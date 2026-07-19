import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import { basename, dirname, extname, join, relative } from "node:path";

const CLAUDE_SKILLS_DIR = join(homedir(), ".claude", "skills");
const ARCHIVE_TOOL_PATHS = {
  zip: ["/usr/bin/zip", "/bin/zip", "/opt/homebrew/bin/zip", "/usr/local/bin/zip"],
  unzip: ["/usr/bin/unzip", "/bin/unzip", "/opt/homebrew/bin/unzip", "/usr/local/bin/unzip"],
};

/**
 * 框架运维技能 slug 清单（命中 → tier: "ops"，否则 "capability"）。
 * 以 .agents/skills/project/ 实际目录名为准：
 * - zhangtu-installer
 * - zhangtu-init-prototype-project（任务草稿中的 init-prototype-project）
 * - protolink（预留；当前 project 目录下可能尚未收录）
 */
const OPS_SKILL_SLUGS = new Set([
  "zhangtu-installer",
  "zhangtu-init-prototype-project",
  "protolink",
]);

const SKILLS_DIR = [".agents", "skills"];
const SKILLS_LOCK = "skills-lock.json";
const SKILL_BUCKETS = {
  project: {
    category: "project",
    dir: "project",
    label: "项目自带",
  },
  imported: {
    category: "user",
    dir: "imported",
    label: "用户导入",
  },
};
const RESERVED = new Set([
  "node_modules",
  ".git",
  "dist",
  SKILL_BUCKETS.project.dir,
  SKILL_BUCKETS.imported.dir,
]);

function toEntryId(storageBucket, slug) {
  return `${storageBucket}:${slug}`;
}

export function discoverSkills(rootDir) {
  const skillsRoot = join(rootDir, ...SKILLS_DIR);
  if (!existsSync(skillsRoot)) {
    return [];
  }
  const lock = readLock(rootDir);
  const entries = listSkillEntries(rootDir);
  const callableNameCounts = buildCallableNameCounts(entries);

  return entries
    .map((entry) => buildSkillSummary(rootDir, entry, lock, callableNameCounts))
    .sort((left, right) => {
      if (left.category !== right.category) {
        return left.category === "project" ? -1 : 1;
      }
      return String(left.name).localeCompare(String(right.name), "zh-CN");
    });
}

export function getSkillDetail(rootDir, id) {
  const entry = resolveSkillEntry(rootDir, id);
  if (!entry || !existsSync(entry.skillFile)) {
    throw new Error(`Skill not found: ${id}`);
  }

  const lock = readLock(rootDir);
  const callableNameCounts = buildCallableNameCounts(listSkillEntries(rootDir));
  const markdown = readFileSync(entry.skillFile, "utf8");

  return {
    ...buildSkillSummary(rootDir, entry, lock, callableNameCounts),
    markdown,
    contentMarkdown: stripFrontmatter(markdown),
  };
}

export function resolveSkillDirectory(rootDir, id) {
  return resolveSkillEntry(rootDir, id)?.dir || null;
}

/**
 * 注意：exportSkillArchive 为恢复重建版本（原实现无完整快照）。
 * 将技能目录打包为 zip，并保持 SKILL.md 位于压缩包根级，供预览壳「导出」按钮下载。
 */
export function exportSkillArchive(rootDir, id) {
  const dir = resolveSkillDirectory(rootDir, id);
  if (!dir || !existsSync(dir)) {
    throw new Error(`Skill not found: ${id}`);
  }
  const workDir = mkdtempSync(join(tmpdir(), "zhangtu-skill-export-"));
  const zipPath = join(workDir, "skill.zip");
  try {
    execFileSync(resolveArchiveTool("zip"), ["-r", "-q", zipPath, "."], { cwd: dir });
    const buffer = readFileSync(zipPath);
    return { filename: `${basename(dir)}.zip`, buffer };
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

export function importSkill(rootDir, { filename, buffer }) {
  const ext = extname(String(filename || "")).toLowerCase();
  if (![".md", ".markdown", ".zip", ".skill"].includes(ext)) {
    throw new Error("仅支持上传 .md 文件，或包含根级 SKILL.md 的 .zip / .skill 压缩包。");
  }

  return ext === ".md" || ext === ".markdown"
    ? importMarkdownSkill(rootDir, filename, buffer)
    : importArchiveSkill(rootDir, filename, buffer);
}

function importMarkdownSkill(rootDir, filename, buffer) {
  const content = buffer.toString("utf8");
  const meta = parseFrontmatter(content);
  if (!meta.name || !meta.description) {
    throw new Error("SKILL.md 必须包含 YAML 格式的 name 与 description 字段。");
  }
  validateImportedSkillName(rootDir, meta.name);

  const slug = createSkillSlug(rootDir, meta.name || basename(filename, extname(filename)));
  const targetDir = join(rootDir, ...SKILLS_DIR, SKILL_BUCKETS.imported.dir, slug);
  mkdirSync(targetDir, { recursive: true });
  writeFileSync(join(targetDir, "SKILL.md"), content.endsWith("\n") ? content : `${content}\n`);
  ensureTopLevelAlias(rootDir, slug, targetDir);
  return finalizeImport(rootDir, slug);
}

function importArchiveSkill(rootDir, filename, buffer) {
  const workDir = mkdtempSync(join(tmpdir(), "zhangtu-skill-"));
  const archivePath = join(workDir, "upload.zip");
  const extractDir = join(workDir, "extract");

  try {
    writeFileSync(archivePath, buffer);
    mkdirSync(extractDir, { recursive: true });
    try {
      execFileSync(resolveArchiveTool("unzip"), ["-o", "-qq", archivePath, "-d", extractDir]);
    } catch {
      throw new Error("无法解压该压缩包，请确认是有效的 zip / .skill 文件。");
    }

    const skillFile = findShallowestSkillFile(extractDir);
    if (!skillFile) {
      throw new Error("压缩包内未找到根级 SKILL.md 文件。");
    }

    const meta = parseFrontmatter(readFileSync(skillFile, "utf8"));
    if (!meta.name || !meta.description) {
      throw new Error("SKILL.md 必须包含 YAML 格式的 name 与 description 字段。");
    }
    validateImportedSkillName(rootDir, meta.name);

    const slug = createSkillSlug(rootDir, meta.name || basename(filename, extname(filename)));
    const targetDir = join(rootDir, ...SKILLS_DIR, SKILL_BUCKETS.imported.dir, slug);
    cpSync(dirname(skillFile), targetDir, { recursive: true });
    ensureTopLevelAlias(rootDir, slug, targetDir);
    return finalizeImport(rootDir, slug);
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

function finalizeImport(rootDir, slug) {
  const entry = resolveSkillEntry(rootDir, toEntryId(SKILL_BUCKETS.imported.dir, slug));
  if (!entry) {
    throw new Error(`导入后的技能不存在：${slug}`);
  }
  registerClaudeSkill(slug, entry.dir);
  const entries = listSkillEntries(rootDir);
  return buildSkillSummary(rootDir, entry, readLock(rootDir), buildCallableNameCounts(entries));
}

function registerClaudeSkill(slug, sourceDir) {
  try {
    mkdirSync(CLAUDE_SKILLS_DIR, { recursive: true });
    const target = join(CLAUDE_SKILLS_DIR, slug);
    if (existsSync(target)) {
      try {
        const stats = lstatSync(target);
        if (stats.isSymbolicLink()) {
          rmSync(target, { force: true });
        } else {
          return;
        }
      } catch {
        return;
      }
    }
    symlinkSync(sourceDir, target, "dir");
  } catch {
    // 注册失败不阻断导入流程
  }
}

function unregisterClaudeSkill(slug) {
  try {
    const target = join(CLAUDE_SKILLS_DIR, slug);
    if (existsSync(target)) {
      const stats = lstatSync(target);
      if (stats.isSymbolicLink()) {
        rmSync(target, { force: true });
      }
    }
  } catch {
    // 清理失败不阻断删除流程
  }
}

function buildSkillSummary(rootDir, entry, lock, callableNameCounts = new Map()) {
  const meta = parseFrontmatter(readFileSync(entry.skillFile, "utf8"));
  const lockEntry = lock.skills?.[entry.id] || null;
  const isProject = lockEntry?.category === "project"
    || meta.category === "project"
    || entry.storageBucket === SKILL_BUCKETS.project.dir;
  const callableName = normalizeCallableName(meta.name || entry.slug);
  const callableConflict = (callableNameCounts.get(callableName.toLowerCase()) || 0) > 1;

  return {
    id: entry.entryId,
    slug: entry.slug,
    name: meta.name || entry.slug,
    callableName,
    description: meta.description || "",
    author: meta.author || lockEntry?.author || lock.author || null,
    category: isProject ? "project" : "user",
    tier: resolveSkillTier(entry.slug),
    storageBucket: entry.storageBucket,
    storageLabel: entry.storageBucket === SKILL_BUCKETS.project.dir ? SKILL_BUCKETS.project.label : SKILL_BUCKETS.imported.label,
    source: lockEntry?.source || (isProject ? "project-builtin" : "imported"),
    registered: Boolean(lockEntry),
    callableConflict,
    fileCount: countFiles(entry.dir),
    entryPath: relative(rootDir, entry.dir),
    skillPath: relative(rootDir, entry.skillFile),
  };
}

/** @param {string} slug */
function resolveSkillTier(slug) {
  return OPS_SKILL_SLUGS.has(slug) ? "ops" : "capability";
}

function listSkillEntries(rootDir) {
  const entries = [];
  const seenEntryIds = new Set();

  for (const bucket of [SKILL_BUCKETS.project.dir, SKILL_BUCKETS.imported.dir]) {
    const bucketDir = join(rootDir, ...SKILLS_DIR, bucket);
    if (!existsSync(bucketDir)) {
      continue;
    }
    for (const entry of readdirSync(bucketDir, { withFileTypes: true })) {
      if (!entry.isDirectory() || RESERVED.has(entry.name)) {
        continue;
      }
      const dir = join(bucketDir, entry.name);
      const skillFile = join(dir, "SKILL.md");
      const entryId = toEntryId(bucket, entry.name);
      if (!existsSync(skillFile) || seenEntryIds.has(entryId)) {
        continue;
      }
      entries.push({
        id: entry.name,
        slug: entry.name,
        entryId,
        dir,
        skillFile,
        storageBucket: bucket,
      });
      seenEntryIds.add(entryId);
    }
  }

  const legacyRoot = join(rootDir, ...SKILLS_DIR);
  if (existsSync(legacyRoot)) {
    for (const entry of readdirSync(legacyRoot, { withFileTypes: true })) {
      if (!entry.isDirectory() || RESERVED.has(entry.name)) {
        continue;
      }
      const dir = join(legacyRoot, entry.name);
      const skillFile = join(dir, "SKILL.md");
      if (!existsSync(skillFile)) {
        continue;
      }
      const storageBucket = inferLegacyBucket(rootDir, entry.name);
      const entryId = toEntryId(storageBucket, entry.name);
      if (seenEntryIds.has(entryId)) {
        continue;
      }
      entries.push({
        id: entry.name,
        slug: entry.name,
        entryId,
        dir,
        skillFile,
        storageBucket,
      });
      seenEntryIds.add(entryId);
    }
  }

  return entries;
}

function inferLegacyBucket(rootDir, id) {
  const lock = readLock(rootDir);
  const lockEntry = lock.skills?.[id];
  if (lockEntry?.category === "project") {
    return SKILL_BUCKETS.project.dir;
  }
  return SKILL_BUCKETS.imported.dir;
}

function resolveSkillEntry(rootDir, id) {
  const entries = listSkillEntries(rootDir);

  const byEntryId = entries.find((entry) => entry.entryId === id);
  if (byEntryId) {
    return byEntryId;
  }

  const bySlug = entries.filter((entry) => entry.slug === id);
  if (bySlug.length === 1) {
    return bySlug[0];
  }
  if (bySlug.length > 1) {
    return bySlug.find((entry) => entry.storageBucket === SKILL_BUCKETS.project.dir) || bySlug[0];
  }

  const byCallableName = entries.filter((entry) => normalizeCallableName(parseFrontmatter(readFileSync(entry.skillFile, "utf8")).name || entry.slug) === id);
  if (byCallableName.length === 1) {
    return byCallableName[0];
  }
  if (byCallableName.length > 1) {
    return byCallableName.find((entry) => entry.storageBucket === SKILL_BUCKETS.project.dir) || byCallableName[0];
  }

  return null;
}

function ensureTopLevelAlias(rootDir, slug, targetDir) {
  const aliasPath = join(rootDir, ...SKILLS_DIR, slug);

  if (existsSync(aliasPath)) {
    try {
      const stats = lstatSync(aliasPath);
      if (stats.isSymbolicLink()) {
        rmSync(aliasPath, { force: true });
      } else {
        return;
      }
    } catch {
      return;
    }
  }

  const relativeTarget = relative(dirname(aliasPath), targetDir) || ".";
  symlinkSync(relativeTarget, aliasPath, "dir");
}

function readLock(rootDir) {
  const lockPath = join(rootDir, SKILLS_LOCK);
  if (!existsSync(lockPath)) {
    return { skills: {} };
  }
  try {
    const parsed = JSON.parse(readFileSync(lockPath, "utf8"));
    return { ...parsed, skills: parsed.skills || {} };
  } catch {
    return { skills: {} };
  }
}

function parseFrontmatter(content) {
  const match = String(content || "").match(/^﻿?---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return {};
  }

  const result = {};
  let inMetadata = false;
  for (const rawLine of match[1].split(/\r?\n/)) {
    if (!rawLine.trim() || rawLine.trim().startsWith("#")) {
      continue;
    }
    const indented = /^\s+/.test(rawLine);
    const [key, ...rest] = rawLine.trim().split(":");
    const value = stripQuotes(rest.join(":").trim());

    if (key === "metadata" && !value) {
      inMetadata = true;
      continue;
    }
    if (!indented) {
      inMetadata = false;
    }
    if (inMetadata && indented) {
      if (key === "category") {
        result.category = value;
      } else if (key === "maintainer" && !result.author) {
        result.author = value;
      }
      continue;
    }
    if (["name", "description", "author"].includes(key)) {
      result[key] = value;
    }
  }

  return result;
}

export function stripFrontmatter(content) {
  return String(content || "").replace(/^﻿?---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trim();
}

function stripQuotes(value) {
  return value.replace(/^["']/, "").replace(/["']$/, "");
}

function resolveArchiveTool(name) {
  const candidates = ARCHIVE_TOOL_PATHS[name] || [];
  return candidates.find((candidate) => existsSync(candidate)) || name;
}

function findShallowestSkillFile(dir) {
  let best = null;
  let bestDepth = Infinity;

  const walk = (current, depth) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (RESERVED.has(entry.name) || entry.name.startsWith("__MACOSX")) {
        continue;
      }
      const full = join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full, depth + 1);
      } else if (entry.name === "SKILL.md" && depth < bestDepth) {
        best = full;
        bestDepth = depth;
      }
    }
  };

  walk(dir, 0);
  return best;
}

function countFiles(dir) {
  let count = 0;
  const walk = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (RESERVED.has(entry.name)) {
        continue;
      }
      const full = join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else {
        count += 1;
      }
    }
  };

  try {
    walk(dir);
  } catch {
    return 0;
  }

  return count;
}

function createSkillSlug(rootDir, seed) {
  const base = String(seed || "imported-skill")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9一-龥]+/g, "-")
    .replace(/^-+|-+$/g, "") || "imported-skill";

  let attempt = 0;
  while (attempt < 200) {
    const slug = attempt === 0 ? base : `${base}-${attempt + 1}`;
    if (!resolveSkillEntry(rootDir, slug) && !existsSync(join(rootDir, ...SKILLS_DIR, slug))) {
      return slug;
    }
    attempt += 1;
  }
  throw new Error("无法为该技能创建唯一目录。");
}

function buildCallableNameCounts(entries) {
  const counts = new Map();
  for (const entry of entries) {
    const meta = parseFrontmatter(readFileSync(entry.skillFile, "utf8"));
    const callableName = normalizeCallableName(meta.name || entry.slug).toLowerCase();
    counts.set(callableName, (counts.get(callableName) || 0) + 1);
  }
  return counts;
}

function normalizeCallableName(value) {
  return String(value || "").trim() || "unnamed-skill";
}

function validateImportedSkillName(rootDir, nextName) {
  const normalized = normalizeCallableName(nextName).toLowerCase();
  const duplicated = listSkillEntries(rootDir).find((entry) => {
    const meta = parseFrontmatter(readFileSync(entry.skillFile, "utf8"));
    return normalizeCallableName(meta.name || entry.slug).toLowerCase() === normalized;
  });

  if (duplicated) {
    const duplicateLabel = duplicated.storageBucket === SKILL_BUCKETS.project.dir ? "项目自带" : "已导入";
    throw new Error(`技能名“${nextName}”已存在（${duplicateLabel}：${duplicated.slug}）。请修改 SKILL.md 中的 name 后重试。`);
  }
}

function isInsideSkills(rootDir, target) {
  const skillsRoot = join(rootDir, ...SKILLS_DIR);
  const rel = relative(skillsRoot, target);
  return !rel.startsWith("..") && rel !== "";
}

export function deleteSkill(rootDir, id) {
  const entry = resolveSkillEntry(rootDir, id);
  if (!entry) throw new Error(`技能不存在：${id}`);
  if (entry.storageBucket !== SKILL_BUCKETS.imported.dir) {
    throw new Error("项目自带技能不能删除。");
  }
  unregisterClaudeSkill(entry.slug);
  rmSync(entry.dir, { recursive: true, force: true });
  const aliasPath = join(rootDir, ...SKILLS_DIR, id);
  if (existsSync(aliasPath)) {
    try { rmSync(aliasPath, { recursive: true, force: true }); } catch {}
  }
  return { id };
}

export function skillsDirExists(rootDir) {
  return existsSync(join(rootDir, ...SKILLS_DIR)) && statSync(join(rootDir, ...SKILLS_DIR)).isDirectory();
}
