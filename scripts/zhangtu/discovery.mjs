import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import vm from "node:vm";

const DEFAULT_CONFIG = {
  schemaVersion: 1,
  title: "公司内部原型工作台",
  brandName: "掌图",
  brandLogo: "src/assets/favicon.svg",
  includeDirectories: ["src/pages"],
  excludeDirectories: ["node_modules", "dist", ".git", ".zhangtu", "coverage"],
  pageNameMap: {},
  theme: {
    primaryColor: "#00bf8a",
    accentColor: "#02b8de",
    backgroundColor: "#f7f8fa",
    surfaceColor: "#ffffff",
    textColor: "#323335",
  },
};

const PAGE_LOCAL_DIRS = new Set(["assets", "data", "styles", "node_modules", "dist"]);

// 开箱能力清单的内置兜底：即使工作区没有 zhangtu.capabilities.json（旧工作区、
// 手动删除）也保证 discovery 输出一份能力清单。权威内容以 zhangtu.capabilities.json
// 为准（工作区文件覆盖此默认），对应 docs/pm-capability-map.md 第三节六条能力。
const DEFAULT_CAPABILITIES = [
  { id: "requirements-alignment", name: "需求对齐", block: "①", inputs: "用户口述需求、参考资料", skills: ["requirements-exploration", "explore-options"], commands: [], outputs: "确认的需求 + 设计决策快照", support: "partial" },
  { id: "legacy-migration", name: "老系统迁移", block: "②a", inputs: "旧系统页面 / 截图 / 导出原型", skills: ["screenshot-to-prototype"], commands: ["preview"], outputs: "新页面（zhangwan-design 重做，内嵌需求锚点）", support: "partial" },
  { id: "build-from-scratch", name: "从零到一", block: "②b", inputs: "确认的需求 + 设计决策", skills: ["zhangwan-design", "zhangtu-init-prototype-project"], commands: ["preview"], outputs: "满足页面契约的新页面", support: "full" },
  { id: "prototype-edit", name: "原型修改", block: "②c", inputs: "已有页面 + 改动点", skills: [], commands: ["quick-edit", "preview"], outputs: "修改后的页面", support: "partial" },
  { id: "prd-output", name: "PRD 输出", block: "③", inputs: "页面实现 + spec.md + 需求锚点", skills: ["prd-generator", "pm-prd-html-writer"], commands: ["publish-iteration"], outputs: "Markdown PRD", defaultChannel: "prd-generator", support: "partial" },
  { id: "version-management", name: "版本管理", block: "④", inputs: "页面集合", skills: [], commands: ["create-iteration", "update-iteration", "preview-iteration", "publish-iteration"], outputs: "版本快照 + 远程分享链接", support: "full" },
];

export function discoverPages(rootDir) {
  const { config, configSource } = loadConfig(rootDir);
  const capabilities = loadCapabilities(rootDir);
  const diagnostics = [];
  const pages = [];
  const candidates = [];
  const { requirements, list: requirementList } = discoverRequirements(rootDir, diagnostics);

  for (const includeDir of config.includeDirectories) {
    const absoluteIncludeDir = resolve(rootDir, includeDir);
    if (!existsSync(absoluteIncludeDir)) {
      diagnostics.push({
        severity: "warning",
        code: "include-directory-missing",
        message: `Include directory does not exist: ${includeDir}`,
      });
      continue;
    }

    walkPageRoots({
      rootDir,
      dir: absoluteIncludeDir,
      config,
      pages,
      candidates,
      diagnostics,
      requirements,
    });
  }

  pages.sort((a, b) => a.sourcePath.localeCompare(b.sourcePath));

  return {
    version: 1,
    ok: diagnostics.every((item) => item.severity !== "error"),
    rootDir,
    configSource,
    title: config.title,
    brandName: config.brandName,
    brandLogo: config.brandLogo,
    theme: config.theme,
    capabilities,
    requirements: requirementList,
    summary: {
      discoveredPageCount: pages.length,
      candidateCount: candidates.length,
      warningCount: diagnostics.filter((item) => item.severity === "warning").length,
    },
    discoveredPageCount: pages.length,
    pages,
    // Alias: tools that consume the discovered/accepted pages expect `discoveredPages`.
    discoveredPages: pages,
    candidates,
    diagnostics,
  };
}

export function loadConfig(rootDir) {
  // Accept both config names: zhangtu.config.json (full config) and
  // zhangtu.pages.json (page-discovery config written by the init scaffolder).
  for (const configName of ["zhangtu.config.json", "zhangtu.pages.json"]) {
    const configPath = join(rootDir, configName);
    if (existsSync(configPath)) {
      return {
        config: normalizeConfig(JSON.parse(readFileSync(configPath, "utf8"))),
        configSource: configName,
      };
    }
  }

  return {
    config: normalizeConfig(DEFAULT_CONFIG),
    configSource: "default",
  };
}

// 能力清单解析：工作区 zhangtu.capabilities.json 覆盖内置默认（自定义逃生舱），
// 与 loadConfig 同款「工作区文件 > 内置默认」优先级。文件损坏/无 capabilities
// 数组时静默回退默认，不阻断页面发现。
export function loadCapabilities(rootDir) {
  const capabilitiesPath = join(rootDir, "zhangtu.capabilities.json");
  if (existsSync(capabilitiesPath)) {
    try {
      const parsed = JSON.parse(readFileSync(capabilitiesPath, "utf8"));
      if (Array.isArray(parsed.capabilities)) {
        return parsed.capabilities;
      }
    } catch {
      // 损坏则回退默认
    }
  }
  return DEFAULT_CAPABILITIES;
}

// 极小 frontmatter 解析器（无新依赖）：切 `---\n...\n---`，逐行 `key: value`，值去首尾引号。
// 仅支持扁平键值，够全局需求 frontmatter（id/title/category/color/block/order）用。
export function parseFrontmatter(source) {
  const match = String(source).match(/^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, body: String(source).trim() };
  }
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[kv[1]] = value;
  }
  return { data, body: match[2].trim() };
}

// 全局需求源：递归扫 src/requirements/**/*.md，一文件一条需求（frontmatter + 正文）。
// 返回 { requirements: Map<id, req>, list }。缺 id / id 重复走 warning 诊断，不阻断。
export function discoverRequirements(rootDir, diagnostics) {
  const requirementsRoot = join(rootDir, "src", "requirements");
  const requirements = new Map();
  const list = [];
  if (!existsSync(requirementsRoot)) {
    return { requirements, list };
  }

  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(full);
      }
    }
  };
  walk(requirementsRoot);
  files.sort();

  for (const file of files) {
    const sourcePath = normalizePath(relative(rootDir, file));
    const { data, body } = parseFrontmatter(readFileSync(file, "utf8"));
    const id = String(data.id || "").trim();
    if (!id) {
      diagnostics.push({
        severity: "warning",
        code: "requirement-missing-id",
        message: `全局需求缺少 frontmatter id：${sourcePath}`,
        sourcePath,
      });
      continue;
    }
    if (requirements.has(id)) {
      diagnostics.push({
        severity: "warning",
        code: "requirement-duplicate-id",
        message: `全局需求 id 重复：${id}（${sourcePath}）`,
        sourcePath,
      });
      continue;
    }
    const requirement = {
      id,
      title: String(data.title || id).trim(),
      category: String(data.category || "").trim(),
      color: String(data.color || "").trim(),
      block: String(data.block || "").trim(),
      order: Number.isFinite(Number(data.order)) ? Number(data.order) : 0,
      bodyMarkdown: body,
      sourcePath,
    };
    requirements.set(id, requirement);
    list.push(requirement);
  }

  list.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  return { requirements, list };
}

export function pageIdFromPath(relativeSourcePath) {
  return relativeSourcePath
    .replace(/\.[^.]+$/, "")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function normalizeConfig(config) {
  return {
    ...DEFAULT_CONFIG,
    ...config,
    includeDirectories: Array.isArray(config.includeDirectories) ? config.includeDirectories : DEFAULT_CONFIG.includeDirectories,
    excludeDirectories: Array.isArray(config.excludeDirectories)
      ? Array.from(new Set([...DEFAULT_CONFIG.excludeDirectories, ...config.excludeDirectories]))
      : DEFAULT_CONFIG.excludeDirectories,
    pageNameMap: config.pageNameMap || {},
    brandLogo: config.brandLogo || DEFAULT_CONFIG.brandLogo,
    theme: {
      ...DEFAULT_CONFIG.theme,
      ...(config.theme || {}),
    },
  };
}

function walkPageRoots({ rootDir, dir, config, pages, candidates, diagnostics, requirements }) {
  if (isExcluded(rootDir, dir, config.excludeDirectories)) {
    return;
  }

  const children = readdirSync(dir, { withFileTypes: true });
  const hasIndexTsx = children.some((entry) => entry.isFile() && entry.name === "index.tsx");
  const hasIndexHtml = children.some((entry) => entry.isFile() && entry.name === "index.html");

  if (hasIndexTsx || hasIndexHtml) {
    const sourcePath = normalizePath(relative(rootDir, join(dir, "index.tsx")));
    const htmlPath = normalizePath(relative(rootDir, join(dir, "index.html")));
    const candidate = {
      id: hasIndexTsx ? pageIdFromPath(sourcePath) : pageIdFromPath(htmlPath),
      relativePath: hasIndexTsx ? sourcePath : htmlPath,
      status: hasIndexTsx && hasIndexHtml ? "accepted" : "rejected",
      reasonCode: hasIndexTsx && hasIndexHtml ? "accepted-file-page" : "missing-page-entry-pair",
      reason: hasIndexTsx && hasIndexHtml ? "Page has index.tsx and index.html." : "Page directory must contain both index.tsx and index.html.",
    };
    candidates.push(candidate);

    if (hasIndexTsx && hasIndexHtml) {
      pages.push(buildPage({
        rootDir,
        dir,
        sourcePath,
        htmlPath,
        config,
        diagnostics,
        requirements,
      }));
    } else {
      diagnostics.push({
        severity: "warning",
        code: "missing-page-entry-pair",
        message: candidate.reason,
        sourcePath: candidate.relativePath,
      });
    }
  }

  for (const child of children) {
    if (!child.isDirectory()) {
      continue;
    }
    if (PAGE_LOCAL_DIRS.has(child.name)) {
      continue;
    }
    walkPageRoots({
      rootDir,
      dir: join(dir, child.name),
      config,
      pages,
      candidates,
      diagnostics,
      requirements,
    });
  }
}

function buildPage({ rootDir, dir, sourcePath, htmlPath, config, diagnostics, requirements }) {
  const specPath = normalizePath(relative(rootDir, join(dir, "spec.md")));
  const requirementsPath = normalizePath(relative(rootDir, join(dir, "zhangtu.requirements.ts")));
  const prdPath = normalizePath(relative(rootDir, join(dir, "prd.md")));
  const hasSpec = existsSync(join(rootDir, specPath));
  const hasRequirements = existsSync(join(rootDir, requirementsPath));
  const hasPrd = existsSync(join(rootDir, prdPath));
  const pageDirectory = normalizePath(relative(rootDir, dir));
  const id = pageIdFromPath(sourcePath);
  const name = config.pageNameMap[sourcePath] || readSpecTitle(join(rootDir, specPath)) || readHtmlTitle(join(rootDir, htmlPath)) || titleFromPath(pageDirectory);
  const group = inferGroup(pageDirectory);
  const requirementModules = hasRequirements ? readRequirementModules(join(rootDir, requirementsPath), diagnostics, requirements) : [];

  return {
    id,
    name,
    group,
    sourceKind: "file",
    sourcePath,
    htmlPath,
    pageDirectory,
    specPath: hasSpec ? specPath : null,
    requirementsPath: hasRequirements ? requirementsPath : null,
    prdPath: hasPrd ? prdPath : null,
    hasPrd,
    requirementModules,
    directPagePath: `/workspace/${htmlPath}`,
  };
}

function readRequirementModules(filePath, diagnostics, requirements) {
  const source = readFileSync(filePath, "utf8");
  if (!/export\s+const\s+zhangtuRequirementAnnotations\s*=/.test(source)) {
    diagnostics.push({
      severity: "warning",
      code: "requirements-export-missing",
      message: "Requirement sidecar does not export zhangtuRequirementAnnotations.",
      sourcePath: filePath,
    });
    return [];
  }

  try {
    const transformed = source.replace(/export\s+const\s+zhangtuRequirementAnnotations\s*=/, "module.exports =");
    const sandbox = {
      module: { exports: null },
      exports: {},
    };
    vm.createContext(sandbox);
    new vm.Script(transformed, { filename: filePath }).runInContext(sandbox, { timeout: 1000 });
    const value = sandbox.module.exports;
    if (!Array.isArray(value)) {
      throw new Error("zhangtuRequirementAnnotations is not an array");
    }

    return value
      .map((item, index) => {
        // 需求反转：条目带 ref 时，从全局需求源（src/requirements/）拉正文/标题/分类，
        // 页面本地字段（anchorId、order，或显式覆盖的 title/category/color）优先。
        // 无 ref 的旧内联条目原样解析（向后兼容）。ref 指向不存在的全局需求 → warning。
        const ref = typeof item.ref === "string" ? item.ref.trim() : "";
        const global = ref && requirements ? requirements.get(ref) : null;
        if (ref && requirements && !global) {
          diagnostics.push({
            severity: "warning",
            code: "requirement-ref-missing",
            message: `需求引用未找到全局需求：${ref}`,
            sourcePath: filePath,
          });
        }
        const anchorId = String(item.anchorId || item.id || (global ? global.id : "") || "");
        const category = typeof item.category === "string" && item.category.trim()
          ? item.category.trim()
          : (global ? global.category : "");
        const color = typeof item.color === "string" && item.color.trim()
          ? item.color.trim()
          : (global ? global.color : "");
        return {
          id: anchorId || String(index + 1),
          number: String(item.number || item.id || (global ? global.id : "") || index + 1),
          order: Number.isFinite(Number(item.order)) ? Number(item.order) : (global ? global.order : index + 1),
          title: String(item.title || (global ? global.title : "") || `需求 ${index + 1}`),
          anchorId,
          bodyMarkdown: String(item.bodyMarkdown || (global ? global.bodyMarkdown : "") || "").trim(),
          category,
          color,
          ref,
        };
      })
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    diagnostics.push({
      severity: "warning",
      code: "requirements-read-failed",
      message: `Failed to read requirement sidecar: ${error.message}`,
      sourcePath: filePath,
    });
    return [];
  }
}

function readSpecTitle(filePath) {
  if (!existsSync(filePath)) {
    return null;
  }
  const source = readFileSync(filePath, "utf8");
  const match = source.match(/^#\s+(.+)$/m);
  return match ? match[1].trim().replace(/\s+Spec$/i, "") : null;
}

function readHtmlTitle(filePath) {
  if (!existsSync(filePath)) {
    return null;
  }
  const source = readFileSync(filePath, "utf8");
  const match = source.match(/<title>(.*?)<\/title>/i);
  return match ? match[1].trim() : null;
}

function titleFromPath(pageDirectory) {
  const slug = pageDirectory.split("/").filter(Boolean).at(-1) || "Prototype Page";
  return slug
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

function inferGroup(pageDirectory) {
  const parts = pageDirectory.split("/").filter(Boolean);
  const pagesIndex = parts.indexOf("pages");
  const firstSegment = pagesIndex >= 0 ? parts[pagesIndex + 1] : parts[0];
  if (!firstSegment) {
    return "其他";
  }
  if (firstSegment === parts.at(-1)) {
    return "独立页面";
  }
  return titleFromPath(firstSegment);
}

function isExcluded(rootDir, absolutePath, excludeDirectories) {
  const relativePath = normalizePath(relative(rootDir, absolutePath));
  return excludeDirectories.some((entry) => {
    const normalized = normalizePath(entry).replace(/\/+$/, "");
    return relativePath === normalized || relativePath.startsWith(`${normalized}/`);
  });
}

function normalizePath(value) {
  return value.split("\\").join("/");
}
