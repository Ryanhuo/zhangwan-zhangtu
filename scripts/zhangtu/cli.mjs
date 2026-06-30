#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { dirname, fileURLToPath } from "node:url";
import { discoverPages } from "./discovery.mjs";

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

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

async function main() {
  const { command, positionals, options } = parseArgs(process.argv.slice(2));

  switch (command) {
    case "init":
      return handleInit(positionals, options);
    case "inspect-pages":
    case "list-pages":
      print(discoverPages(rootDir), options);
      return;
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
  const [projectName] = positionals;
  if (!projectName) {
    throw new Error("Usage: init <project-name>");
  }

  const targetDir = resolve(rootDir, projectName);
  if (existsSync(targetDir)) {
    throw new Error(`目录已存在: ${projectName}`);
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

  // Rename _gitignore → .gitignore (npm strips leading-dot files from published packages)
  const gitignoreSrc = join(targetDir, "_gitignore");
  if (existsSync(gitignoreSrc)) {
    renameSync(gitignoreSrc, join(targetDir, ".gitignore"));
  }

  // Update package.json: substitute project name and package source URL
  const pkgPath = join(targetDir, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  pkg.name = projectName;

  // Try to infer the GitHub URL from the installed package's own package.json
  const selfPkgPath = resolve(PACKAGE_ROOT, "package.json");
  if (existsSync(selfPkgPath)) {
    const selfPkg = JSON.parse(readFileSync(selfPkgPath, "utf8"));
    const repoUrl = (typeof selfPkg.repository === "string" ? selfPkg.repository : selfPkg.repository?.url) || "";
    const githubMatch = repoUrl.match(/github\.com[:/]([^/]+\/[^/.]+)/);
    if (githubMatch) {
      pkg.devDependencies["zhangwan-zhangtu"] = `github:${githubMatch[1]}`;
    }
  }

  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  if (!options.json) {
    console.log(`项目已创建：${projectName}/`);
    console.log(`\n下一步：`);
    console.log(`  cd ${projectName}`);
    console.log(`  npm install`);
    console.log(`  npm run dev    # 开发预览（Vite）`);
    console.log(`  npm run zhangtu -- preview    # 掌图预览 Shell`);
    console.log(`\n在 src/pages/ 下添加新目录即可创建更多原型页面。`);
    if (pkg.devDependencies["zhangwan-zhangtu"]?.includes("GITHUB_OWNER")) {
      console.log(`\n注意：请将 package.json 中 zhangwan-zhangtu 的版本源替换为你的 GitHub 仓库地址。`);
    }
  }
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
      if (key === "json") {
        options.json = true;
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
  console.log(`zhangtu

Commands:
  init <project-name>
  inspect-pages [--json]
  list-pages [--json]
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
