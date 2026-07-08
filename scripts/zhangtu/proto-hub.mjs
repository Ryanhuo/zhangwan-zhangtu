import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_BASE_URL = "https://chanyan.wozhangwan.com";
const PUBLISH_CONFIG_PATH = [".zhangtu", "publish-config.json"];
const PUBLISH_BUNDLE_DIR = [".zhangtu", "publish"];
const LOCAL_PROTO_HUB_PACKAGE = ["node_modules", "@zhangwan", "proto-hub-mcp", "lib.js"];
const PROTO_HUB_TARBALL_URL = "https://chanyan.wozhangwan.com/mcp/proto-hub-mcp.tgz";

export async function getProtoHubPublishStatus(rootDir, defaults = {}) {
  const resolved = resolveProtoHubSettings(rootDir, defaults);
  const runtime = await getProtoHubRuntimeStatus();

  return {
    version: 1,
    ready: Boolean(resolved.token && resolved.systemName && runtime.available),
    systemName: resolved.systemName,
    baseUrl: resolved.baseUrl,
    token: {
      configured: Boolean(resolved.token),
      source: resolved.tokenSource,
    },
    runtime: {
      name: "proto-hub",
      available: runtime.available,
      source: runtime.source,
    },
  };
}

export function saveProtoHubPublishConfig(rootDir, payload = {}, defaults = {}) {
  const current = readPublishConfig(rootDir);
  const nextSystemName = String(payload.systemName ?? current.systemName ?? defaults.systemName ?? "").trim();
  const nextBaseUrl = String(payload.baseUrl ?? current.baseUrl ?? defaults.baseUrl ?? DEFAULT_BASE_URL).trim() || DEFAULT_BASE_URL;
  const nextTokenInput = payload.token === undefined ? undefined : String(payload.token || "").trim();
  const rawToken = nextTokenInput === undefined || nextTokenInput === "" ? (current.token || "") : nextTokenInput;

  if (rawToken && !rawToken.startsWith("pth_")) {
    throw new Error("令牌格式不正确，请粘贴以 pth_ 开头的掌玩令牌。");
  }

  const nextConfig = {
    version: 1,
    systemName: nextSystemName,
    baseUrl: nextBaseUrl,
    token: rawToken,
    updatedAt: new Date().toISOString(),
  };

  const filePath = getPublishConfigPath(rootDir);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(nextConfig, null, 2)}\n`);
  return nextConfig;
}

export async function publishIterationViaProtoHub({
  rootDir,
  iteration,
  projectTitle,
  pages,
  defaults = {},
  changelog,
  prdFile,
  prdUrl,
}) {
  if (!iteration) {
    throw new Error("缺少待发布的版本信息。");
  }

  const settings = resolveProtoHubSettings(rootDir, defaults);
  if (!settings.token) {
    throw new Error("未检测到发布令牌，请先配置掌玩令牌。");
  }
  if (!settings.systemName) {
    throw new Error("请先填写要发布到的系统名称。");
  }

  const runtime = await getProtoHubRuntimeStatus();
  if (!runtime.available) {
    throw new Error("proto-hub 发布组件自动安装失败，请检查网络连接后重试。");
  }

  await runCommand("npm", ["run", "build"], { cwd: rootDir, timeoutMs: 180000 });
  const bundle = createPublishBundle({ rootDir, iteration, pages, projectTitle });
  const autoPrd = prdFile || prdUrl ? null : createAutoPrdFile({
    rootDir,
    iteration,
    pages: bundle.sourcePages,
    projectTitle,
  });
  const uploadPrdFile = prdFile || autoPrd?.filePath;
  const lib = await loadProtoHubLibrary(settings);
  const existingVersion = await findExistingVersion(lib, settings.systemName, iteration.name);
  const nextChangelog = String(changelog ?? (iteration.description || "")).trim() || undefined;

  const result = existingVersion
    ? await lib.updatePrototype({
      system: settings.systemName,
      version: String(existingVersion.id ?? existingVersion.name ?? iteration.name),
      folder: bundle.bundleDir,
      changelog: nextChangelog,
      prd_file: uploadPrdFile,
      prd_url: prdUrl,
    })
    : await lib.createVersion({
      system: settings.systemName,
      name: iteration.name,
      folder: bundle.bundleDir,
      changelog: nextChangelog,
      prd_file: uploadPrdFile,
      prd_url: prdUrl,
    });

  const shareUrl = String(result?.share_url || "").trim();
  if (!shareUrl) {
    const error = new Error("发布请求已完成，但没有拿到分享链接。");
    error.details = trimText(JSON.stringify(result || {}, null, 2), 2400);
    throw error;
  }

  const resultMessage = existingVersion
    ? `已给「${result.system} · ${result.version}」上传新原型快照，分享链接保持不变。`
    : `已在「${result.system}」创建版本「${result.name || iteration.name}」。`;
  const prdSource = prdUrl ? "url" : prdFile ? "manual-file" : autoPrd ? "auto-generated" : "none";

  return {
    publishedAt: new Date().toISOString(),
    publishedMeta: {
      provider: "proto-hub",
      systemName: settings.systemName,
      baseUrl: settings.baseUrl,
      shareUrl,
      cli: "proto-hub-mcp",
      bundleDir: bundle.bundleDir,
      prd: String(result?.prd || "").trim(),
      prdSource,
      prdFile: uploadPrdFile || "",
      resultMessage: trimText(resultMessage, 2400),
    },
  };
}

export async function listProtoHubSystems(rootDir, defaults = {}) {
  const lib = await loadProtoHubLibrary(resolveProtoHubSettings(rootDir, defaults));
  const systems = await lib.listSystems();
  return {
    version: 1,
    systems: Array.isArray(systems) ? systems : [],
  };
}

export async function listProtoHubVersions({ rootDir, system, defaults = {} }) {
  const lib = await loadProtoHubLibrary(resolveProtoHubSettings(rootDir, defaults));
  const result = await lib.listVersions(system);
  return {
    version: 1,
    system: result?.system || null,
    versions: Array.isArray(result?.versions) ? result.versions : [],
  };
}

export async function getProtoHubShareLink({ rootDir, system, version, defaults = {} }) {
  const lib = await loadProtoHubLibrary(resolveProtoHubSettings(rootDir, defaults));
  return {
    version: 1,
    ...(await lib.getShareLink({ system, version })),
  };
}

export async function uploadPrototypeViaProtoHub({
  rootDir,
  folder,
  system,
  name,
  changelog,
  prdFile,
  prdUrl,
  defaults = {},
}) {
  const lib = await loadProtoHubLibrary(resolveProtoHubSettings(rootDir, defaults));
  const existingVersion = await findExistingVersion(lib, system, name);
  const result = existingVersion
    ? await lib.updatePrototype({
      system,
      version: String(existingVersion.id ?? existingVersion.name ?? name),
      folder,
      changelog,
      prd_file: prdFile,
      prd_url: prdUrl,
    })
    : await lib.createVersion({
      system,
      name,
      folder,
      changelog,
      prd_file: prdFile,
      prd_url: prdUrl,
    });

  return {
    version: 1,
    mode: existingVersion ? "updated" : "created",
    shareUrl: String(result?.share_url || "").trim(),
    system: String(result?.system || system || "").trim(),
    name: String(result?.name || result?.version || name || "").trim(),
    remoteVersion: String(result?.version || result?.name || name || "").trim(),
    revisionNumber: Number.isFinite(Number(result?.revision_number)) ? Number(result.revision_number) : null,
    prd: String(result?.prd || "").trim(),
  };
}

export async function updateRemoteVersionViaProtoHub({
  rootDir,
  system,
  version,
  folder,
  changelog,
  prdFile,
  prdUrl,
  defaults = {},
}) {
  const lib = await loadProtoHubLibrary(resolveProtoHubSettings(rootDir, defaults));
  const result = await lib.updatePrototype({
    system,
    version,
    folder,
    changelog,
    prd_file: prdFile,
    prd_url: prdUrl,
  });

  return {
    version: 1,
    shareUrl: String(result?.share_url || "").trim(),
    system: String(result?.system || system || "").trim(),
    remoteVersion: String(result?.version || version || "").trim(),
    revisionNumber: Number.isFinite(Number(result?.revision_number)) ? Number(result.revision_number) : null,
    prd: String(result?.prd || "").trim(),
  };
}

function createPublishBundle({ rootDir, iteration, pages, projectTitle }) {
  const distDir = join(rootDir, "dist");
  if (!existsSync(distDir)) {
    throw new Error("未找到构建产物目录 dist，请先完成构建。");
  }

  const selectedPages = resolvePublishPages(iteration, pages);
  if (!selectedPages.length) {
    throw new Error("当前版本没有可发布的页面。");
  }

  const bundleDir = join(rootDir, ...PUBLISH_BUNDLE_DIR, iteration.slug);
  rmSync(bundleDir, { recursive: true, force: true });
  mkdirSync(bundleDir, { recursive: true });

  const assetsDir = join(distDir, "assets");
  if (existsSync(assetsDir)) {
    cpSync(assetsDir, join(bundleDir, "assets"), { recursive: true });
  }

  const pageEntries = selectedPages.map((page) => {
    const sourceHtml = join(distDir, page.htmlPath);
    if (!existsSync(sourceHtml)) {
      throw new Error(`构建产物里缺少页面入口：${page.htmlPath}。请确认该页面目录仍在 src/pages 下，并已被页面发现收录。`);
    }
    const targetHtml = join(bundleDir, page.htmlPath);
    return {
      id: page.id,
      name: page.name,
      htmlPath: page.htmlPath,
      sourceHtml,
      targetHtml,
    };
  });

  for (const pageEntry of pageEntries) {
    mkdirSync(dirname(pageEntry.targetHtml), { recursive: true });
    writeBundleHtml(pageEntry.sourceHtml, pageEntry.targetHtml, relativeRootPrefix(pageEntry.htmlPath), {
      floatingNavigation: buildFloatingPageNavigation({
        pages: pageEntries,
        currentHtmlPath: pageEntry.htmlPath,
        rootPrefix: relativeRootPrefix(pageEntry.htmlPath),
      }),
    });
  }

  const entryHtmlPath = pageEntries[0]?.htmlPath || "";
  const indexPath = join(bundleDir, "index.html");
  if (entryHtmlPath) {
    writeBundleHtml(join(distDir, entryHtmlPath), indexPath, "./", {
      floatingNavigation: buildFloatingPageNavigation({
        pages: pageEntries,
        currentHtmlPath: entryHtmlPath,
        rootPrefix: "./",
      }),
    });
  }

  if (pageEntries.length > 1) {
    writeFileSync(join(bundleDir, "__zhangtu_pages__.html"), buildBundleIndexHtml({
      versionName: iteration.name,
      projectTitle,
      pages: pageEntries,
    }));
  }

  return {
    bundleDir,
    indexPath,
    entryHtmlPath,
    pages: pageEntries.map(({ id, name, htmlPath }) => ({ id, name, htmlPath })),
    sourcePages: selectedPages,
  };
}

function resolvePublishPages(iteration, pages) {
  const currentPages = new Map((Array.isArray(pages) ? pages : []).map((page) => [page.id, page]));
  const snapshotPages = new Map((Array.isArray(iteration?.pageSnapshots) ? iteration.pageSnapshots : []).map((page) => [page.id, page]));
  return (iteration?.pageIds || [])
    .map((pageId) => currentPages.get(pageId) || snapshotPages.get(pageId))
    .filter(Boolean);
}

function createAutoPrdFile({ rootDir, iteration, pages, projectTitle }) {
  const selectedPages = Array.isArray(pages) ? pages : [];
  const sections = [];

  for (const page of selectedPages) {
    const specMarkdown = readPageSpecMarkdown(rootDir, page);
    const requirementMarkdown = buildRequirementMarkdown(iteration, page);
    if (!specMarkdown && !requirementMarkdown) {
      continue;
    }

    sections.push([
      `## ${page.name || page.id}`,
      page.sourcePath ? `- 页面入口：\`${page.sourcePath}\`` : "",
      page.specPath ? `- Spec：\`${page.specPath}\`` : "",
      specMarkdown ? `\n### 页面 Spec\n\n${specMarkdown}` : "",
      requirementMarkdown ? `\n### 需求标注\n\n${requirementMarkdown}` : "",
    ].filter(Boolean).join("\n"));
  }

  if (!sections.length) {
    return null;
  }

  const content = [
    `# ${projectTitle || "掌图"} · ${iteration.name} 需求文档`,
    "",
    `- 版本名称：${iteration.name}`,
    iteration.description ? `- 版本说明：${iteration.description}` : "",
    `- 生成时间：${new Date().toISOString()}`,
    "",
    sections.join("\n\n---\n\n"),
    "",
  ].filter((line) => line !== "").join("\n");

  const outputDir = join(rootDir, ...PUBLISH_BUNDLE_DIR);
  mkdirSync(outputDir, { recursive: true });
  const filePath = join(outputDir, `${iteration.slug}-prd.md`);
  writeFileSync(filePath, content);
  return { filePath, pageCount: sections.length };
}

function readPageSpecMarkdown(rootDir, page) {
  if (!page?.specPath) {
    return "";
  }
  const specPath = join(rootDir, page.specPath);
  if (!existsSync(specPath)) {
    return "";
  }
  try {
    return readFileSync(specPath, "utf8").trim();
  } catch {
    return "";
  }
}

function buildRequirementMarkdown(iteration, page) {
  const snapshot = iteration?.requirementSnapshots?.[page.id];
  const modules = Array.isArray(snapshot) && snapshot.length
    ? snapshot
    : Array.isArray(page.requirementModules) ? page.requirementModules : [];

  return modules
    .map((item, index) => {
      const title = String(item?.title || `需求 ${index + 1}`).trim();
      const lines = [
        `#### ${index + 1}. ${title}`,
        item?.ref ? `- 关联：${item.ref}` : "",
        item?.category ? `- 分类：${item.category}` : "",
        item?.anchorId ? `- 锚点：\`${item.anchorId}\`` : "",
        item?.bodyMarkdown ? `\n${String(item.bodyMarkdown).trim()}` : "",
      ];
      return lines.filter(Boolean).join("\n");
    })
    .filter(Boolean)
    .join("\n\n");
}

function buildBundleIndexHtml({ versionName, projectTitle, pages }) {
  const firstPath = pages[0]?.htmlPath || "";
  const pageLinks = pages.map((page) => `
        <li>
          <a href="${escapeHtml(page.htmlPath)}">${escapeHtml(page.name)}</a>
          <span>${escapeHtml(page.htmlPath)}</span>
        </li>
      `).join("");

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(projectTitle)} · ${escapeHtml(versionName)}</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f4f6f8;
        --surface: #ffffff;
        --text: #1f2937;
        --muted: #6b7683;
        --border: #d8e0e6;
        --primary: #16a56f;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Noto Sans SC", "Inter", sans-serif;
        background: var(--bg);
        color: var(--text);
      }
      main {
        max-width: 880px;
        margin: 48px auto;
        padding: 0 24px;
      }
      .hero {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 28px;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
      }
      .eyebrow {
        color: var(--primary);
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      h1 {
        margin: 10px 0 8px;
        font-size: 28px;
        line-height: 1.25;
      }
      p {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
      }
      .primary-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-top: 18px;
        min-height: 36px;
        padding: 0 16px;
        border-radius: 8px;
        background: var(--primary);
        color: #ffffff;
        text-decoration: none;
        font-weight: 600;
      }
      .pages {
        margin-top: 20px;
        padding: 0;
        list-style: none;
        display: grid;
        gap: 12px;
      }
      .pages li {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 14px 16px;
        border-radius: 10px;
        border: 1px solid var(--border);
        background: var(--surface);
      }
      .pages a {
        color: var(--text);
        text-decoration: none;
        font-weight: 600;
      }
      .pages span {
        color: var(--muted);
        font-size: 12px;
      }
      @media (max-width: 720px) {
        .pages li {
          flex-direction: column;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <div class="eyebrow">zhangtu publish pages</div>
        <h1>${escapeHtml(projectTitle)} · ${escapeHtml(versionName)}</h1>
        <p>默认入口已直接指向首个页面；这里保留多页面目录，方便切换查看。</p>
        ${firstPath ? `<a class="primary-link" href="${escapeHtml(firstPath)}">打开首个页面</a>` : ""}
      </section>
      <ul class="pages">
        ${pageLinks}
      </ul>
    </main>
  </body>
</html>
`;
}

function writeBundleHtml(sourceHtml, targetHtml, rootPrefix, options = {}) {
  const rawHtml = readFileSync(sourceHtml, "utf8");
  writeFileSync(targetHtml, rewriteBundleHtml(rawHtml, rootPrefix, options));
}

function rewriteBundleHtml(html, rootPrefix, options = {}) {
  const rewritten = String(html || "")
    .replace(/\b(src|href)=(["'])\/(?!\/)([^"']+)\2/g, (_, attr, quote, value) => `${attr}=${quote}${rootPrefix}${value}${quote}`)
    .replace(/url\((["']?)\/(?!\/)([^)"']+)\1\)/g, (_, quote, value) => `url(${quote}${rootPrefix}${value}${quote})`);
  return injectFloatingNavigation(rewritten, options.floatingNavigation);
}

function relativeRootPrefix(htmlPath) {
  const depth = String(htmlPath || "")
    .split("/")
    .slice(0, -1)
    .filter(Boolean)
    .length;
  return depth ? `${"../".repeat(depth)}` : "./";
}

function buildFloatingPageNavigation({ pages, currentHtmlPath, rootPrefix }) {
  if (!Array.isArray(pages) || pages.length <= 1) {
    return "";
  }

  const links = pages.map((page, index) => {
    const active = page.htmlPath === currentHtmlPath;
    const href = `${rootPrefix}${page.htmlPath}`;
    return `
      <a class="zt-publish-nav__item${active ? " is-active" : ""}" href="${escapeHtml(href)}">
        <span class="zt-publish-nav__index">${index + 1}</span>
        <span class="zt-publish-nav__name">${escapeHtml(page.name || `页面 ${index + 1}`)}</span>
      </a>
    `;
  }).join("");

  return `
    <nav class="zt-publish-nav" aria-label="版本页面导航">
      <button class="zt-publish-nav__trigger" type="button" aria-expanded="false">页面</button>
      <div class="zt-publish-nav__panel">
        <div class="zt-publish-nav__title">页面导航</div>
        <div class="zt-publish-nav__list">${links}</div>
      </div>
    </nav>
    <style>
      .zt-publish-nav {
        position: fixed;
        right: 18px;
        top: 88px;
        z-index: 2147483000;
        font-family: "Noto Sans SC", "Inter", system-ui, sans-serif;
      }
      .zt-publish-nav__trigger {
        min-width: 48px;
        height: 36px;
        border: 1px solid rgba(15, 23, 42, 0.16);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.94);
        color: #111827;
        font-size: 13px;
        font-weight: 600;
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.16);
        cursor: pointer;
        backdrop-filter: blur(10px);
      }
      .zt-publish-nav__panel {
        position: absolute;
        top: 44px;
        right: 0;
        width: min(280px, calc(100vw - 32px));
        max-height: min(420px, calc(100vh - 128px));
        overflow: auto;
        display: none;
        padding: 10px;
        border: 1px solid rgba(15, 23, 42, 0.14);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.97);
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.18);
        backdrop-filter: blur(12px);
      }
      .zt-publish-nav.is-open .zt-publish-nav__panel,
      .zt-publish-nav:hover .zt-publish-nav__panel,
      .zt-publish-nav:focus-within .zt-publish-nav__panel {
        display: block;
      }
      .zt-publish-nav__title {
        padding: 4px 6px 10px;
        color: #6b7280;
        font-size: 12px;
        font-weight: 600;
      }
      .zt-publish-nav__list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .zt-publish-nav__item {
        display: grid;
        grid-template-columns: 22px minmax(0, 1fr);
        align-items: center;
        gap: 8px;
        min-height: 36px;
        padding: 7px 8px;
        border-radius: 8px;
        color: #1f2937;
        text-decoration: none;
      }
      .zt-publish-nav__item:hover {
        background: #f3f4f6;
      }
      .zt-publish-nav__item.is-active {
        background: #111827;
        color: #ffffff;
      }
      .zt-publish-nav__index {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        border-radius: 999px;
        background: rgba(107, 114, 128, 0.14);
        font-size: 12px;
        font-weight: 700;
      }
      .zt-publish-nav__item.is-active .zt-publish-nav__index {
        background: rgba(255, 255, 255, 0.2);
      }
      .zt-publish-nav__name {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 13px;
        font-weight: 600;
      }
      @media (max-width: 720px) {
        .zt-publish-nav {
          right: 12px;
          top: 72px;
        }
        .zt-publish-nav__panel {
          max-height: min(360px, calc(100vh - 104px));
        }
      }
    </style>
    <script>
      (() => {
        const nav = document.querySelector(".zt-publish-nav");
        const trigger = nav && nav.querySelector(".zt-publish-nav__trigger");
        if (!nav || !trigger) return;
        trigger.addEventListener("click", () => {
          const open = !nav.classList.contains("is-open");
          nav.classList.toggle("is-open", open);
          trigger.setAttribute("aria-expanded", String(open));
        });
        document.addEventListener("click", (event) => {
          if (!nav.contains(event.target)) {
            nav.classList.remove("is-open");
            trigger.setAttribute("aria-expanded", "false");
          }
        });
      })();
    </script>
  `;
}

function injectFloatingNavigation(html, floatingNavigation) {
  const navigation = String(floatingNavigation || "").trim();
  if (!navigation) {
    return html;
  }
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${navigation}\n</body>`);
  }
  return `${html}\n${navigation}`;
}

function resolveProtoHubSettings(rootDir, defaults = {}) {
  const saved = readPublishConfig(rootDir);
  const codexConfig = readCodexProtoHubConfig();
  const envToken = String(process.env.PROTO_HUB_TOKEN || "").trim();
  const envBaseUrl = String(process.env.PROTO_HUB_BASE || "").trim();

  const token = saved.token || envToken || codexConfig.token || "";
  const tokenSource = saved.token ? "workspace" : envToken ? "env" : codexConfig.token ? "codex" : "";
  const baseUrl = saved.baseUrl || envBaseUrl || codexConfig.baseUrl || defaults.baseUrl || DEFAULT_BASE_URL;
  const systemName = saved.systemName || defaults.systemName || "";

  return {
    token,
    tokenSource,
    baseUrl,
    systemName,
  };
}

function readPublishConfig(rootDir) {
  const filePath = getPublishConfigPath(rootDir);
  if (!existsSync(filePath)) {
    return {};
  }
  try {
    const value = JSON.parse(readFileSync(filePath, "utf8"));
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

function getPublishConfigPath(rootDir) {
  return join(rootDir, ...PUBLISH_CONFIG_PATH);
}

function readCodexProtoHubConfig() {
  const configPath = join(homedir(), ".codex", "config.toml");
  if (!existsSync(configPath)) {
    return {};
  }
  try {
    const raw = readFileSync(configPath, "utf8");
    const tokenMatch = raw.match(/PROTO_HUB_TOKEN\s*=\s*"([^"]+)"/);
    const baseMatch = raw.match(/PROTO_HUB_BASE\s*=\s*"([^"]+)"/);
    return {
      token: tokenMatch ? tokenMatch[1].trim() : "",
      baseUrl: baseMatch ? baseMatch[1].trim() : "",
    };
  } catch {
    return {};
  }
}

function runCommand(command, args, { cwd, timeoutMs = 120000 }) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let killedByTimeout = false;

    const timer = setTimeout(() => {
      killedByTimeout = true;
      child.kill("SIGTERM");
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0 && !killedByTimeout) {
        resolve({ stdout, stderr });
        return;
      }
      const error = new Error(killedByTimeout ? `${command} 执行超时。` : `${command} 执行失败。`);
      error.code = code;
      error.stdout = stdout;
      error.stderr = stderr;
      reject(error);
    });
  });
}

function trimText(value, maxLength = 2000) {
  const text = String(value || "").trim();
  if (!text || text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}…`;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

async function getProtoHubRuntimeStatus() {
  let libraryPath = resolveProtoHubLibraryPath();
  let source = libraryPath ? "local-cache" : "";
  if (!libraryPath) {
    libraryPath = await bootstrapProtoHubLibrary();
    source = libraryPath ? "auto-installed" : "";
  }
  return {
    available: Boolean(libraryPath),
    source,
    libraryPath,
  };
}

async function bootstrapProtoHubLibrary() {
  try {
    await runCommand("npx", ["-y", PROTO_HUB_TARBALL_URL, "--version"], { timeoutMs: 30000 });
  } catch {
    // npx caches the downloaded package before running it, so the lookup below
    // can still succeed even if the process itself errored, timed out, or was
    // killed while sitting idle as an MCP stdio server.
  }
  return resolveProtoHubLibraryPath();
}

function resolveProtoHubLibraryPath() {
  const directCandidate = join(process.cwd(), ...LOCAL_PROTO_HUB_PACKAGE);
  if (existsSync(directCandidate)) {
    return directCandidate;
  }

  const npxRoot = join(homedir(), ".npm", "_npx");
  if (!existsSync(npxRoot)) {
    return "";
  }

  const candidates = readdirSync(npxRoot)
    .map((entry) => join(npxRoot, entry, ...LOCAL_PROTO_HUB_PACKAGE))
    .filter((candidate) => existsSync(candidate))
    .sort((left, right) => {
      try {
        return statSync(right).mtimeMs - statSync(left).mtimeMs;
      } catch {
        return 0;
      }
    });

  return candidates[0] || "";
}

async function loadProtoHubLibrary(settings) {
  let libraryPath = resolveProtoHubLibraryPath();
  if (!libraryPath) {
    libraryPath = await bootstrapProtoHubLibrary();
  }
  if (!libraryPath) {
    throw new Error("未检测到 proto-hub 发布组件，自动安装失败，请检查网络连接后重试。");
  }

  const previousToken = process.env.PROTO_HUB_TOKEN;
  const previousBase = process.env.PROTO_HUB_BASE;
  process.env.PROTO_HUB_TOKEN = settings.token;
  process.env.PROTO_HUB_BASE = settings.baseUrl;

  try {
    const moduleUrl = `${pathToFileURL(libraryPath).href}?ts=${Date.now()}-${Math.random().toString(36).slice(2)}`;
    return await import(moduleUrl);
  } finally {
    if (previousToken === undefined) {
      delete process.env.PROTO_HUB_TOKEN;
    } else {
      process.env.PROTO_HUB_TOKEN = previousToken;
    }
    if (previousBase === undefined) {
      delete process.env.PROTO_HUB_BASE;
    } else {
      process.env.PROTO_HUB_BASE = previousBase;
    }
  }
}

async function findExistingVersion(lib, systemName, versionName) {
  const { versions } = await lib.listVersions(systemName);
  return Array.isArray(versions)
    ? versions.find((item) => String(item?.name || "").trim() === String(versionName || "").trim()) || null
    : null;
}
