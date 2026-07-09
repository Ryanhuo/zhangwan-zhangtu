#!/usr/bin/env node
import { spawn } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { discoverPages } from "./discovery.mjs";
import { checkPages } from "../check-pages.mjs";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(SCRIPT_DIR, "../../");
import { createIteration, listIterations, resolveIteration, updateIteration } from "./iterations.mjs";
import {
  getProtoHubPublishStatus,
  getProtoHubShareLink,
  listProtoHubSystems,
  listProtoHubVersions,
  publishIterationViaProtoHub,
  saveProtoHubPublishConfig,
  updateRemoteVersionViaProtoHub,
  uploadPrototypeViaProtoHub,
} from "./proto-hub.mjs";
import { startPreviewServer } from "./preview-server.mjs";

const rootDir = process.cwd();
const INIT_ALLOWED_EXISTING_ENTRIES = new Set([".git", ".gitignore", ".DS_Store", "README.md", "LICENSE", "LICENSE.md"]);
// Paths that `zhangtu init` physically copies into every scaffolded project
// (see handleInit below). They are framework-owned — CLAUDE.md/AGENTS.md tell
// both users and AI agents not to hand-edit them — but because they're a
// one-time copy, `npm update` on the framework devDependency never refreshes
// them. handleSyncSystemFiles() re-copies just these paths from the
// currently-installed package into the current project, overwriting local
// copies.
//
// Note `.agents/skills/project` (baseline framework skills like zhangwanUI) is
// included, but `.agents/skills/imported` (user-uploaded skills) is NOT —
// syncing must never clobber a project's own imported skills.
const SYSTEM_FILE_SYNC_TARGETS = ["src/common", "src/pages/skills", ".agents/skills/project"];

const SYSTEM_VERSION = (() => {
  try {
    return JSON.parse(readFileSync(join(PACKAGE_ROOT, "package.json"), "utf-8")).version || "0.0.0";
  } catch {
    return "0.0.0";
  }
})();

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

async function main() {
  const { command, positionals, options } = parseArgs(process.argv.slice(2));

  if (options.version || options.v) {
    console.log(`zhangtu v${SYSTEM_VERSION}`);
    return;
  }

  switch (command) {
    case "version":
      console.log(`zhangtu v${SYSTEM_VERSION}`);
      return;
    case "init":
      return handleInit(positionals, options);
    case "inspect-pages":
    case "list-pages":
      print(discoverPages(rootDir), options);
      return;
    case "check-pages": {
      const result = await checkPages(rootDir);
      console.log(JSON.stringify(result, null, 2));
      if (!result.ok) {
        process.exit(1);
      }
      return;
    }
    case "sync-system-files":
      return handleSyncSystemFiles(options);
    case "list-iterations":
      print({ version: 1, iterations: listIterations(rootDir) }, options);
      return;
    case "create-iteration":
      return handleCreateIteration(positionals, options);
    case "update-iteration":
      return handleUpdateIteration(positionals, options);
    case "preview":
      return handlePreview(options);
    case "preview-iteration":
      return handlePreviewIteration(positionals, options);
    case "publish-status":
      return handlePublishStatus(options);
    case "configure-publish":
      return handleConfigurePublish(positionals, options);
    case "publish-iteration":
      return handlePublishIteration(positionals, options);
    case "list-remote-systems":
      return handleListRemoteSystems(options);
    case "list-remote-versions":
      return handleListRemoteVersions(positionals, options);
    case "get-share-link":
      return handleGetShareLink(positionals, options);
    case "upload-prototype":
      return handleUploadPrototype(positionals, options);
    case "update-remote-version":
      return handleUpdateRemoteVersion(positionals, options);
    case "help":
    default:
      printHelp();
  }
}

function handleInit(positionals, options) {
  const [projectNameArg] = positionals;
  const inPlace = !projectNameArg || projectNameArg === ".";
  const targetDir = inPlace ? rootDir : resolve(rootDir, projectNameArg);
  const projectName = inPlace ? basename(targetDir) : projectNameArg;

  if (inPlace) {
    if (existsSync(targetDir)) {
      const leftoverEntries = readdirSync(targetDir).filter((name) => !INIT_ALLOWED_EXISTING_ENTRIES.has(name));
      if (leftoverEntries.length > 0) {
        throw new Error(
          `当前目录不是空的（发现 ${leftoverEntries[0]}），zhangtu init 只能在空目录里就地初始化。\n如果想新建子文件夹，运行：zhangtu init <项目名称>`
        );
      }
    }
  } else if (existsSync(targetDir)) {
    throw new Error(`目录已存在: ${projectNameArg}`);
  }

  const templateDir = resolve(PACKAGE_ROOT, "templates/workspace");
  if (!existsSync(templateDir)) {
    throw new Error("模板目录不存在，请确认 zhangwan-zhangtu 已正确安装。");
  }

  mkdirSync(targetDir, { recursive: true });
  cpSync(templateDir, targetDir, { recursive: true });

  // Copy runtime source files from the package (always latest version)
  cpSync(resolve(PACKAGE_ROOT, "src/common"), join(targetDir, "src/common"), { recursive: true });
  cpSync(resolve(PACKAGE_ROOT, "src/styles"), join(targetDir, "src/styles"), { recursive: true });
  cpSync(resolve(PACKAGE_ROOT, "src/assets"), join(targetDir, "src/assets"), { recursive: true });

  // Seed baseline project skills so the 掌图 shell skills panel is populated
  const skillsProjectSrc = resolve(PACKAGE_ROOT, ".agents/skills/project");
  if (existsSync(skillsProjectSrc)) {
    cpSync(skillsProjectSrc, join(targetDir, ".agents/skills/project"), { recursive: true });
  }

  // Seed the skills-management page: it is the shell's "技能" system tab UI,
  // hidden from the regular page list (see splitPreviewPages in preview-server.mjs).
  const skillsPageSrc = resolve(PACKAGE_ROOT, "src/pages/skills");
  if (existsSync(skillsPageSrc)) {
    cpSync(skillsPageSrc, join(targetDir, "src/pages/skills"), { recursive: true });
  }

  // Rename _gitignore → .gitignore (npm strips leading-dot files from published packages)
  const gitignoreSrc = join(targetDir, "_gitignore");
  if (existsSync(gitignoreSrc)) {
    renameSync(gitignoreSrc, join(targetDir, ".gitignore"));
  }

  // Update package.json: substitute project name, and align the framework
  // devDependency with whatever this running copy of the package identifies
  // itself as (name + version) — self-describing, regardless of whether
  // `zhangtu init` was invoked via the npm registry or `npm link`.
  const pkgPath = join(targetDir, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  pkg.name = sanitizePackageName(projectName);

  const selfPkgPath = resolve(PACKAGE_ROOT, "package.json");
  if (existsSync(selfPkgPath)) {
    const selfPkg = JSON.parse(readFileSync(selfPkgPath, "utf8"));
    delete pkg.devDependencies["zhangwan-zhangtu"];
    if (selfPkg.name && selfPkg.version) {
      pkg.devDependencies[selfPkg.name] = `^${selfPkg.version}`;
    }
  }

  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  if (!options.json) {
    if (inPlace) {
      console.log(`已在当前目录初始化项目：${projectName}`);
      console.log(`\n下一步：`);
      console.log(`  npm install`);
    } else {
      console.log(`项目已创建：${projectName}/`);
      console.log(`\n下一步：`);
      console.log(`  cd ${projectName}`);
      console.log(`  npm install`);
    }
    console.log(`  npm start    # 启动掌图预览 Shell 并自动打开浏览器`);
    console.log(`  npm run dev    # 同上（掌图 Shell）`);
    console.log(`  npm run dev:page    # 仅裸 Vite 单页调试`);
    console.log(`\n在 src/pages/ 下添加新目录即可创建更多原型页面。`);
  }
}

function handleSyncSystemFiles(options) {
  const synced = [];
  const skipped = [];

  for (const relativePath of SYSTEM_FILE_SYNC_TARGETS) {
    const source = resolve(PACKAGE_ROOT, relativePath);
    if (!existsSync(source)) {
      skipped.push(relativePath);
      continue;
    }
    // Mirror, don't just overlay: remove the destination first so files the
    // framework has since deleted/renamed (e.g. a restructured skill) don't
    // linger as stale copies. Safe because every target is framework-owned;
    // `.agents/skills/imported` (the user's own skills) is never in the list.
    const destination = join(rootDir, relativePath);
    rmSync(destination, { recursive: true, force: true });
    cpSync(source, destination, { recursive: true });
    synced.push(relativePath);
  }

  const result = { version: 1, synced, skipped, packageVersion: SYSTEM_VERSION };
  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(`已从 zhangwan-zhangtu v${SYSTEM_VERSION} 同步以下系统文件（本地改动会被覆盖）：`);
  for (const path of synced) {
    console.log(`  - ${path}/`);
  }
  if (skipped.length > 0) {
    console.log(`\n跳过（当前安装的包里没有这些路径）：`);
    for (const path of skipped) {
      console.log(`  - ${path}/`);
    }
  }
}

function sanitizePackageName(name) {
  const sanitized = name
    .toLowerCase()
    .replace(/[^a-z0-9-_.]+/g, "-")
    .replace(/^[-_.]+/, "")
    .replace(/-+/g, "-")
    .slice(0, 214);
  if (sanitized) {
    return sanitized;
  }
  // Fully non-ASCII folder names (e.g. Chinese) collapse to nothing above —
  // suffix with a short random id so multiple such projects don't all
  // collide on the same generic package name.
  return `zhangtu-workspace-${Math.random().toString(36).slice(2, 8)}`;
}

function handleCreateIteration(positionals, options) {
  const [name, description = "", pageRefs = ""] = positionals;
  if (!name) {
    throw new Error("Usage: create-iteration <name> [description] [pageIdsOrNamesCommaSeparated]");
  }

  const discovery = discoverPages(rootDir);
  const pageIds = resolvePageIds(discovery.pages, pageRefs);
  const iteration = createIteration(rootDir, {
    name,
    description,
    pageIds,
  });
  writeIterationPreviewManifest(discovery, iteration);
  print({ version: 1, iteration }, options);
}

function handleUpdateIteration(positionals, options) {
  const [target, nextName, description, pageRefs] = positionals;
  if (!target) {
    throw new Error("Usage: update-iteration <id|slug|name> [nextName] [description] [pageIdsOrNamesCommaSeparated]");
  }

  const discovery = discoverPages(rootDir);
  const pageIds = pageRefs === undefined ? undefined : resolvePageIds(discovery.pages, pageRefs);
  const iteration = updateIteration(rootDir, target, {
    nextName,
    description,
    pageIds,
  });
  writeIterationPreviewManifest(discovery, iteration);
  print({ version: 1, iteration }, options);
}

async function handlePreview(options) {
  const discovery = discoverPages(rootDir);
  const preview = await startPreviewServer({
    rootDir,
    discovery,
    scope: {
      kind: "project",
      name: discovery.title,
      title: discovery.title,
      slug: "project",
    },
    requestedPort: Number(options.port || 6320),
    requestedVitePort: Number(options["vite-port"] || 51720),
  });
  printPreviewResult(preview, options);
  await new Promise(() => {});
}

async function handlePreviewIteration(positionals, options) {
  const [target] = positionals;
  if (!target) {
    throw new Error("Usage: preview-iteration <id|slug|name>");
  }

  const iteration = resolveIteration(rootDir, target);
  if (!iteration) {
    throw new Error(`Iteration not found: ${target}`);
  }

  const discovery = discoverPages(rootDir);
  const preview = await startPreviewServer({
    rootDir,
    discovery,
    scope: {
      kind: "iteration",
      id: iteration.id,
      name: iteration.name,
      title: iteration.name,
      slug: iteration.slug,
      description: iteration.description,
      pageIds: iteration.pageIds,
    },
    requestedPort: Number(options.port || 6320),
    requestedVitePort: Number(options["vite-port"] || 51720),
  });
  printPreviewResult(preview, options);
  await new Promise(() => {});
}

async function handlePublishStatus(options) {
  const discovery = discoverPages(rootDir);
  const status = await getProtoHubPublishStatus(rootDir, {
    systemName: String(discovery.brandName || discovery.title || "").trim(),
  });
  print(status, options);
}

function handleConfigurePublish(positionals, options) {
  const discovery = discoverPages(rootDir);
  const [systemName] = positionals;
  const config = saveProtoHubPublishConfig(rootDir, {
    systemName: systemName ?? options.system,
    token: options.token,
    baseUrl: options["base-url"],
  }, {
    systemName: String(discovery.brandName || discovery.title || "").trim(),
  });
  print({ version: 1, config }, options);
}

async function handlePublishIteration(positionals, options) {
  const [target] = positionals;
  if (!target) {
    throw new Error("Usage: publish-iteration <id|slug|name> [--system <systemName>] [--prd-file <file>] [--prd-url <url>] [--changelog <text>] [--json]");
  }

  const discovery = discoverPages(rootDir);
  const iteration = resolveIteration(rootDir, target);
  if (!iteration) {
    throw new Error(`Iteration not found: ${target}`);
  }

  if (options.token !== undefined || options["base-url"] !== undefined || options.system !== undefined) {
    saveProtoHubPublishConfig(rootDir, {
      token: options.token,
      baseUrl: options["base-url"],
      systemName: options.system,
    }, {
      systemName: String(discovery.brandName || discovery.title || "").trim(),
    });
  }

  const publishResult = await publishIterationViaProtoHub({
    rootDir,
    iteration,
    projectTitle: String(discovery.brandName || discovery.title || "掌图"),
    pages: discovery.pages,
    defaults: { systemName: String(options.system || discovery.brandName || discovery.title || "").trim() },
    changelog: options.changelog,
    prdFile: options["prd-file"],
    prdUrl: options["prd-url"],
  });
  const updated = updateIteration(rootDir, target, {
    publishedAt: publishResult.publishedAt,
    publishedMeta: publishResult.publishedMeta,
  });
  writeIterationPreviewManifest(discovery, updated);
  print({ version: 1, iteration: updated, publish: publishResult.publishedMeta }, options);
}

async function handleListRemoteSystems(options) {
  print(await listProtoHubSystems(rootDir), options);
}

async function handleListRemoteVersions(positionals, options) {
  const [system] = positionals;
  if (!system) {
    throw new Error("Usage: list-remote-versions <systemNameOrId> [--json]");
  }
  print(await listProtoHubVersions({ rootDir, system }), options);
}

async function handleGetShareLink(positionals, options) {
  const [system, version] = positionals;
  if (!system || !version) {
    throw new Error("Usage: get-share-link <systemNameOrId> <versionNameOrId> [--json]");
  }
  print(await getProtoHubShareLink({ rootDir, system, version }), options);
}

async function handleUploadPrototype(positionals, options) {
  const [folder, system, name] = positionals;
  if (!folder || !system || !name) {
    throw new Error("Usage: upload-prototype <folder> <systemNameOrId> <versionName> [--changelog <text>] [--prd-file <file>] [--prd-url <url>] [--json]");
  }
  print(await uploadPrototypeViaProtoHub({
    rootDir,
    folder,
    system,
    name,
    changelog: options.changelog,
    prdFile: options["prd-file"],
    prdUrl: options["prd-url"],
  }), options);
}

async function handleUpdateRemoteVersion(positionals, options) {
  const [system, version] = positionals;
  if (!system || !version) {
    throw new Error("Usage: update-remote-version <systemNameOrId> <versionNameOrId> [--folder <dir>] [--changelog <text>] [--prd-file <file>] [--prd-url <url>] [--json]");
  }
  print(await updateRemoteVersionViaProtoHub({
    rootDir,
    system,
    version,
    folder: options.folder,
    changelog: options.changelog,
    prdFile: options["prd-file"],
    prdUrl: options["prd-url"],
  }), options);
}

function resolvePageIds(pages, pageRefs) {
  if (!pageRefs || !pageRefs.trim()) {
    return pages.map((page) => page.id);
  }

  const refs = pageRefs.split(",").map((item) => item.trim()).filter(Boolean);
  const pageIds = [];

  for (const ref of refs) {
    const matched = pages.find(
      (page) => page.id === ref || page.name === ref || page.sourcePath === ref || page.htmlPath === ref,
    );
    if (!matched) {
      const candidates = pages.map((page) => `${page.name} (${page.id})`).join(", ");
      throw new Error(`Page not found: ${ref}. Available pages: ${candidates}`);
    }
    if (!pageIds.includes(matched.id)) {
      pageIds.push(matched.id);
    }
  }

  return pageIds;
}

function writeIterationPreviewManifest(discovery, iteration) {
  const dir = join(rootDir, ".zhangtu", "preview", iteration.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "manifest.json"), `${JSON.stringify({
    version: 1,
    title: iteration.name,
    scope: {
      kind: "iteration",
      id: iteration.id,
      name: iteration.name,
      slug: iteration.slug,
      description: iteration.description,
      pageIds: iteration.pageIds,
    },
    pages: discovery.pages.filter((page) => iteration.pageIds.includes(page.id)),
    generatedAt: new Date().toISOString(),
  }, null, 2)}\n`);
}

function printPreviewResult(preview, options) {
  const result = {
    version: 1,
    url: preview.url,
    port: preview.port,
    vitePort: preview.vitePort,
    pageCount: preview.manifest.pages.length,
    manifestPath: `.zhangtu/preview/${preview.manifest.scope.slug || "project"}/manifest.json`,
  };
  print(result, options);
  if (!options.json) {
    console.log("\nPress Ctrl+C to stop the preview server.");
    if (options.open) {
      openInBrowser(preview.url);
    }
  }
}

function openInBrowser(url) {
  const command =
    process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  try {
    spawn(command, [url], { stdio: "ignore", detached: true, shell: process.platform === "win32" }).unref();
  } catch {
    // 打开浏览器失败不影响服务运行,用户可手动访问打印出的 URL
  }
}

function print(value, options) {
  if (options.json) {
    console.log(JSON.stringify(value, null, 2));
    return;
  }

  if (value.pages) {
    console.log(`${value.title || "Prototype"}: ${value.pages.length} page(s)`);
    for (const page of value.pages) {
      console.log(`- ${page.name} (${page.id})`);
    }
    if (value.diagnostics?.length) {
      console.log("\nDiagnostics:");
      for (const item of value.diagnostics) {
        console.log(`- [${item.severity}] ${item.message}`);
      }
    }
    return;
  }

  if (value.iterations) {
    console.log(`${value.iterations.length} iteration(s)`);
    for (const item of value.iterations) {
      console.log(`- ${item.name} (${item.slug}) ${item.pageIds.length} page(s)`);
    }
    return;
  }

  if (value.iteration) {
    console.log(`Iteration saved: ${value.iteration.name}`);
    console.log(`ID: ${value.iteration.id}`);
    console.log(`Slug: ${value.iteration.slug}`);
    console.log(`Pages: ${value.iteration.pageIds.join(", ")}`);
    if (value.publish?.shareUrl) {
      console.log(`Share: ${value.publish.shareUrl}`);
    }
    return;
  }

  if (value.url) {
    console.log(`Preview: ${value.url}`);
    console.log(`Pages: ${value.pageCount}`);
    console.log(`Manifest: ${value.manifestPath}`);
    return;
  }

  if (value.ready !== undefined && value.runtime) {
    console.log(`Publish runtime: ${value.runtime.available ? "ready" : "missing"}`);
    console.log(`System: ${value.systemName || "未配置"}`);
    console.log(`Token: ${value.token?.configured ? `已配置（${value.token.source || "unknown"}）` : "未配置"}`);
    console.log(`Base URL: ${value.baseUrl}`);
    return;
  }

  if (value.config) {
    console.log(`Publish config saved for system: ${value.config.systemName || "未配置"}`);
    console.log(`Base URL: ${value.config.baseUrl}`);
    console.log(`Token: ${value.config.token ? "已保存" : "未保存"}`);
    return;
  }

  if (value.systems) {
    console.log(`${value.systems.length} system(s)`);
    for (const item of value.systems) {
      console.log(`- ${item.name} (${item.id})`);
    }
    return;
  }

  if (value.versions) {
    console.log(`${value.system?.name || "System"}: ${value.versions.length} version(s)`);
    for (const item of value.versions) {
      console.log(`- ${item.name} (${item.id})`);
    }
    return;
  }

  if (value.shareUrl && value.system && (value.remoteVersion || value.version || value.name)) {
    const versionName = value.remoteVersion || value.version || value.name;
    console.log(`Share link for ${value.system} · ${versionName}`);
    console.log(value.shareUrl);
    if (value.prd) {
      console.log(value.prd);
    }
    if (value.revisionNumber) {
      console.log(`Revision: #${value.revisionNumber}`);
    }
    return;
  }

  console.log(JSON.stringify(value, null, 2));
}

function parseArgs(args) {
  const [command = "help", ...rest] = args;
  const options = {};
  const positionals = [];

  for (let index = 0; index < rest.length; index += 1) {
    const item = rest[index];
    if (item.startsWith("--")) {
      const key = item.slice(2);
      if (key === "json" || key === "open") {
        options[key] = true;
      } else {
        options[key] = rest[index + 1];
        index += 1;
      }
    } else {
      positionals.push(item);
    }
  }

  return { command, positionals, options };
}

function printHelp() {
  console.log(`zhangtu v${SYSTEM_VERSION}

Commands:
  version
  init <project-name>            # 新建子文件夹并初始化
  init [.]                       # 在当前空目录里就地初始化，项目名取当前目录名
  inspect-pages [--json]
  list-pages [--json]
  check-pages
  sync-system-files [--json]     # 把 src/common/、src/pages/skills/、.agents/skills/project/ 更新到当前框架版本（覆盖本地，保留 imported 技能）
  preview [--port 6320] [--vite-port 51720] [--json]
  list-iterations [--json]
  create-iteration <name> [description] [pageIdsOrNamesCommaSeparated] [--json]
  update-iteration <id|slug|name> [nextName] [description] [pageIdsOrNamesCommaSeparated] [--json]
  preview-iteration <id|slug|name> [--port 6320] [--vite-port 51720] [--json]
  publish-status [--json]
  configure-publish [systemName] [--system <systemName>] [--token <pth_...>] [--base-url <url>] [--json]
  publish-iteration <id|slug|name> [--system <systemName>] [--prd-file <file>] [--prd-url <url>] [--changelog <text>] [--json]
  list-remote-systems [--json]
  list-remote-versions <systemNameOrId> [--json]
  get-share-link <systemNameOrId> <versionNameOrId> [--json]
  upload-prototype <folder> <systemNameOrId> <versionName> [--changelog <text>] [--prd-file <file>] [--prd-url <url>] [--json]
  update-remote-version <systemNameOrId> <versionNameOrId> [--folder <dir>] [--changelog <text>] [--prd-file <file>] [--prd-url <url>] [--json]
`);
}
