import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import http from "node:http";
import net from "node:net";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../");
const SYSTEM_VERSION = (() => {
  try {
    return JSON.parse(readFileSync(join(PACKAGE_ROOT, "package.json"), "utf-8")).version || "0.0.0";
  } catch {
    return "0.0.0";
  }
})();
import { discoverPages } from "./discovery.mjs";
import { createIteration, deleteIteration, listIterations, updateIteration } from "./iterations.mjs";
import {
  applyPageLibrary,
  createFolder,
  createPageLibrarySnapshot,
  deleteFolder,
  deletePage,
  duplicatePage,
  moveFolder,
  movePage,
  renameFolder,
  renamePage,
} from "./page-library.mjs";
import { deleteSkill, discoverSkills, exportSkillArchive, getSkillDetail, importSkill } from "./skills.mjs";
import {
  buildIterationPrdMarkdown,
  getProtoHubPublishStatus,
  publishIterationViaProtoHub,
  saveProtoHubPublishConfig,
} from "./proto-hub.mjs";
import {
  applyTextReplacements,
  clearHackCss,
  countTextReplacements,
  QuickEditError,
  readHackCss,
  resolvePageDirectory,
  saveHackCss,
} from "./quick-edit.mjs";

export async function startPreviewServer({ rootDir, discovery, scope, requestedPort = 6320, requestedVitePort = 51720 }) {
  const port = await findFreePort(requestedPort);
  const vitePort = await findFreePort(requestedVitePort);
  // Spawn the Vite binary directly (not `npm run dev`) so that the dev script is
  // free to launch this same shell without recursing back into the preview server.
  const viteBin = join(rootDir, "node_modules", "vite", "bin", "vite.js");
  if (!existsSync(viteBin)) {
    throw new Error(`找不到 Vite(${viteBin}),请先在项目目录执行 npm install。`);
  }
  const viteProcess = spawn(process.execPath, [viteBin, "--host", "127.0.0.1", "--port", String(vitePort), "--strictPort", "true"], {
    cwd: rootDir,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let viteOutput = "";
  viteProcess.stdout.on("data", (chunk) => {
    viteOutput += chunk.toString();
  });
  viteProcess.stderr.on("data", (chunk) => {
    viteOutput += chunk.toString();
  });

  const viteBaseUrl = `http://127.0.0.1:${vitePort}`;
  await waitForUrl(`${viteBaseUrl}/@vite/client`, () => viteOutput);

  const previewState = createPreviewState({
    rootDir,
    discovery,
    scope,
    runtime: { port, vitePort, viteBaseUrl },
  });

  const server = http.createServer(async (req, res) => {
    try {
      await handleRequest({ req, res, state: previewState, viteBaseUrl, rootDir });
    } catch (error) {
      if (!res.destroyed && !res.writableEnded) {
        try {
          res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
          res.end(error.stack || error.message);
        } catch {}
      }
    }
  });

  server.on("upgrade", (req, socket, head) => {
    proxyUpgrade({ req, socket, head, vitePort });
  });

  await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));

  const close = () => {
    server.close();
    viteProcess.kill("SIGTERM");
  };

  process.once("SIGINT", () => {
    close();
    process.exit(0);
  });
  process.once("SIGTERM", () => {
    close();
    process.exit(0);
  });

  return {
    manifest: previewState.manifest,
    url: `http://127.0.0.1:${port}${scope.kind === "iteration" ? `/iterations/${scope.slug}` : "/"}`,
    port,
    vitePort,
    close,
  };
}

function createPreviewState({ rootDir, discovery, scope, runtime }) {
  const state = {
    rootDir,
    scope,
    runtime,
    discovery,
    manifest: null,
    refresh(nextDiscovery = discoverPages(rootDir)) {
      state.discovery = nextDiscovery;
      state.manifest = buildManifest(rootDir, nextDiscovery, scope, runtime);
      writePreviewManifest(rootDir, state.manifest);
    },
  };

  state.refresh(discovery);
  return state;
}

function isSkillsManagementPage(page) {
  if (!page || typeof page !== "object") {
    return false;
  }
  const sourcePath = String(page.sourcePath || "");
  const pageDirectory = String(page.pageDirectory || "");
  const htmlPath = String(page.htmlPath || "");
  return sourcePath === "src/pages/skills/index.tsx"
    || pageDirectory === "src/pages/skills"
    || htmlPath === "src/pages/skills/index.html";
}

function isDesignSystemPage(page) {
  if (!page || typeof page !== "object") {
    return false;
  }
  const sourcePath = String(page.sourcePath || "");
  const pageDirectory = String(page.pageDirectory || "");
  const htmlPath = String(page.htmlPath || "");
  return sourcePath === "src/pages/design-system/index.tsx"
    || pageDirectory === "src/pages/design-system"
    || htmlPath === "src/pages/design-system/index.html";
}

function isSystemPage(page) {
  return isSkillsManagementPage(page) || isDesignSystemPage(page);
}

function splitPreviewPages(pages) {
  const pageList = Array.isArray(pages) ? pages : [];
  const skillsPage = pageList.find(isSkillsManagementPage) || null;
  const designSystemPage = pageList.find(isDesignSystemPage) || null;
  return {
    skillsPage,
    designSystemPage,
    regularPages: pageList.filter((page) => !isSystemPage(page)),
  };
}

function buildManifest(rootDir, discovery, scope, runtime) {
  if (scope.kind === "iteration") {
    const iteration = scope.iterationSnapshot || listIterations(rootDir).find((item) => item.id === scope.id || item.slug === scope.slug) || null;
    if (iteration) {
      return buildIterationManifest({ rootDir, discovery, runtime, scope, iteration });
    }
  }

  const pageIdSet = scope.pageIds ? new Set(scope.pageIds) : null;
  const discoveredPages = pageIdSet ? discovery.pages.filter((page) => pageIdSet.has(page.id)) : discovery.pages;
  const runtimePages = discoveredPages.map((page) => ({
    ...page,
    directPagePath: `/${page.htmlPath}`,
  }));
  const { skillsPage, designSystemPage, regularPages } = splitPreviewPages(runtimePages);
  const pages = applyPageLibrary(rootDir, regularPages);

  return {
    version: 1,
    systemVersion: SYSTEM_VERSION,
    title: scope.title || discovery.title,
    brandName: discovery.brandName,
    brandLogo: discovery.brandLogo,
    theme: discovery.theme,
    capabilities: discovery.capabilities,
    scope,
    runtime,
    pages,
    skillsPage,
    designSystemPage,
    pageLibrary: createPageLibrarySnapshot(rootDir, pages),
    iterationRequirementSnapshots: {},
    navigation: groupNavigation(pages),
    skills: discoverSkills(rootDir),
    diagnostics: discovery.diagnostics,
    generatedAt: new Date().toISOString(),
  };
}

function buildIterationManifest({ rootDir, discovery, runtime, scope, iteration }) {
  const runtimePages = getIterationPages(iteration, discovery.pages).map((page) => ({
    ...page,
    directPagePath: `/${page.htmlPath}`,
  }));
  const { regularPages } = splitPreviewPages(runtimePages);
  const requirementSnapshots = normalizeRequirementSnapshotsForPages(iteration.requirementSnapshots, regularPages);
  const pages = applyPageLibrary(rootDir, applyRequirementSnapshotsToPages(regularPages, requirementSnapshots));

  return {
    version: 1,
    systemVersion: SYSTEM_VERSION,
    title: scope.title || iteration.name || discovery.title,
    brandName: discovery.brandName,
    brandLogo: discovery.brandLogo,
    theme: discovery.theme,
    capabilities: discovery.capabilities,
    scope: {
      kind: "iteration",
      id: iteration.id,
      name: iteration.name,
      title: iteration.name,
      slug: iteration.slug,
      description: iteration.description,
      pageIds: iteration.pageIds,
      publishedAt: iteration.publishedAt || null,
      publishedMeta: iteration.publishedMeta || null,
    },
    runtime,
    pages,
    skillsPage: null,
    designSystemPage: null,
    // 用当前页面库（只读）排布该版本的页面，保证「页面列表」与「编辑版本的页面选择」目录结构一致，且移动文件即时生效。
    pageLibrary: createPageLibrarySnapshot(rootDir, pages, { includeEmptyFolders: false }),
    iterationRequirementSnapshots: requirementSnapshots,
    navigation: groupNavigation(pages),
    skills: discoverSkills(rootDir),
    diagnostics: discovery.diagnostics,
    generatedAt: new Date().toISOString(),
  };
}

function groupNavigation(pages) {
  const groups = new Map();
  for (const page of pages) {
    if (!groups.has(page.group)) {
      groups.set(page.group, []);
    }
    groups.get(page.group).push(page);
  }
  return Array.from(groups, ([name, items]) => ({
    name,
    pageIds: items.map((page) => page.id),
  }));
}

function writePreviewManifest(rootDir, manifest) {
  const previewDir = join(rootDir, ".zhangtu", "preview", manifest.scope.slug || "project");
  mkdirSync(previewDir, { recursive: true });
  writeFileSync(join(previewDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
}

async function handleRequest({ req, res, state, viteBaseUrl, rootDir }) {
  const requestUrl = new URL(req.url || "/", "http://127.0.0.1");
  const pathname = decodeURIComponent(requestUrl.pathname);
  const shouldRefreshDiscovery = pathname === "/"
    || pathname === "/api/manifest"
    || pathname === "/api/project/pages"
    || pathname.startsWith("/iterations/");

  if (shouldRefreshDiscovery) {
    state.refresh();
  }

  const manifest = state.manifest;
  const discovery = state.discovery;

  if (pathname.startsWith("/api/")) {
    applyApiCors(req, res);
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }
  }

  if (pathname === "/" || pathname === `/iterations/${manifest.scope.slug}`) {
    sendHtml(res, renderShell(manifest));
    return;
  }

  // Preview any saved version by slug: render the shell scoped to that version's pages.
  if (pathname.startsWith("/iterations/")) {
    const slug = decodeURIComponent(pathname.replace(/^\/iterations\//, "")).replace(/\/$/, "");
    const iteration = listIterations(rootDir).find((it) => it.slug === slug);
    if (iteration) {
      const scopedManifest = buildIterationManifest({
        rootDir,
        discovery,
        runtime: manifest.runtime,
        scope: { kind: "iteration", id: iteration.id, slug: iteration.slug, title: iteration.name },
        iteration,
      });
      sendHtml(res, renderShell(scopedManifest));
      return;
    }
  }

  if (pathname === "/api/manifest") {
    sendJson(res, manifest);
    return;
  }

  if (pathname === "/api/page-library" && req.method === "GET") {
    sendJson(res, { version: 1, pageLibrary: manifest.pageLibrary });
    return;
  }

  if (pathname === "/api/page-library/folders" && req.method === "POST") {
    const body = await readJsonBody(req);
    const folder = createFolder(rootDir, discovery.pages, body.name);
    state.refresh();
    sendJson(res, { version: 1, folder, manifest: state.manifest }, 201);
    return;
  }

  if (pathname.startsWith("/api/page-library/folders/") && req.method === "PUT") {
    const folderId = decodeURIComponent(pathname.replace(/^\/api\/page-library\/folders\//, ""));
    const body = await readJsonBody(req);
    const folder = renameFolder(rootDir, discovery.pages, folderId, body.name);
    state.refresh();
    sendJson(res, { version: 1, folder, manifest: state.manifest });
    return;
  }

  if (pathname.startsWith("/api/page-library/folders/") && req.method === "DELETE") {
    const folderId = decodeURIComponent(pathname.replace(/^\/api\/page-library\/folders\//, ""));
    const deleted = deleteFolder(rootDir, discovery.pages, folderId);
    state.refresh();
    sendJson(res, { version: 1, deleted, manifest: state.manifest });
    return;
  }

  if (pathname.startsWith("/api/page-library/folders/") && req.method === "POST") {
    const folderPath = pathname.replace(/^\/api\/page-library\/folders\//, "");
    const [rawFolderId, action] = folderPath.split("/");
    const folderId = decodeURIComponent(rawFolderId || "");
    if (!folderId) {
      sendJson(res, { error: "Folder id is required." }, 400);
      return;
    }
    if (action === "move") {
      const body = await readJsonBody(req);
      const moved = moveFolder(rootDir, discovery.pages, folderId, body.index);
      state.refresh();
      sendJson(res, { version: 1, moved, manifest: state.manifest });
      return;
    }
    sendJson(res, { error: `未知的文件夹操作：${action || "(empty)"}` }, 404);
    return;
  }

  if (pathname.startsWith("/api/page-library/pages/")) {
    const pagePath = pathname.replace(/^\/api\/page-library\/pages\//, "");
    const [rawPageId, action] = pagePath.split("/");
    const pageId = decodeURIComponent(rawPageId || "");

    if (!pageId) {
      sendJson(res, { error: "Page id is required." }, 400);
      return;
    }

    if (!action && req.method === "DELETE") {
      const deleted = deletePage(rootDir, discovery.pages, pageId);
      state.refresh();
      sendJson(res, { version: 1, deleted, manifest: state.manifest });
      return;
    }

    const body = await readJsonBody(req);
    if (action === "rename" && req.method === "POST") {
      const page = renamePage(rootDir, discovery.pages, pageId, body.name);
      state.refresh();
      sendJson(res, { version: 1, page, manifest: state.manifest });
      return;
    }
    if (action === "duplicate" && req.method === "POST") {
      const duplicated = duplicatePage(rootDir, discovery.pages, pageId);
      state.refresh();
      sendJson(res, { version: 1, duplicated, manifest: state.manifest }, 201);
      return;
    }
    if (action === "move" && req.method === "POST") {
      const moved = movePage(rootDir, discovery.pages, pageId, body.folderId || null, body.index);
      state.refresh();
      sendJson(res, { version: 1, moved, manifest: state.manifest });
      return;
    }
    if (action === "spec" && req.method === "GET") {
      const page = discovery.pages.find((p) => p.id === pageId);
      if (!page) { sendJson(res, { error: "页面不存在。" }, 404); return; }
      const specPath = join(rootDir, page.sourcePath, "spec.md");
      const content = existsSync(specPath) ? readFileSync(specPath, "utf8") : "";
      sendJson(res, { version: 1, content, path: specPath });
      return;
    }
    if (action === "spec" && req.method === "PUT") {
      const page = discovery.pages.find((p) => p.id === pageId);
      if (!page) { sendJson(res, { error: "页面不存在。" }, 404); return; }
      const specPath = join(rootDir, page.sourcePath, "spec.md");
      const content = String((await readJsonBody(req)).content || "");
      writeFileSync(specPath, content, "utf8");
      state.refresh();
      sendJson(res, { version: 1, saved: true });
      return;
    }
  }

  if (pathname === "/api/quick-edit/hack-css" && req.method === "GET") {
    try {
      const page = resolvePageDirectory(discovery.pages, requestUrl.searchParams.get("path"));
      sendJson(res, { success: true, content: readHackCss(rootDir, page) });
    } catch (error) {
      sendJson(res, { error: error.message }, error.status || 500);
    }
    return;
  }

  if (pathname === "/api/quick-edit/hack-css/save" && req.method === "POST") {
    try {
      const body = await readJsonBody(req);
      const page = resolvePageDirectory(discovery.pages, body.path);
      const merged = saveHackCss(rootDir, page, String(body.content || ""));
      sendJson(res, { success: true, merged });
    } catch (error) {
      sendJson(res, { error: error.message }, error.status || 500);
    }
    return;
  }

  if (pathname === "/api/quick-edit/hack-css/clear" && req.method === "POST") {
    try {
      const body = await readJsonBody(req);
      const page = resolvePageDirectory(discovery.pages, body.path);
      clearHackCss(rootDir, page);
      sendJson(res, { success: true });
    } catch (error) {
      sendJson(res, { error: error.message }, error.status || 500);
    }
    return;
  }

  if (pathname === "/api/quick-edit/text-replace/count" && req.method === "POST") {
    try {
      const body = await readJsonBody(req);
      const page = resolvePageDirectory(discovery.pages, body.path);
      const replacements = Array.isArray(body.replacements)
        ? body.replacements.filter((item) => item && typeof item.searchText === "string")
        : [];
      if (!replacements.length) {
        throw new QuickEditError("replacements is empty", 400);
      }
      const totalCount = countTextReplacements(rootDir, page, replacements);
      sendJson(res, { success: true, totalCount });
    } catch (error) {
      sendJson(res, { error: error.message }, error.status || 500);
    }
    return;
  }

  if (pathname === "/api/quick-edit/text-replace/replace" && req.method === "POST") {
    try {
      const body = await readJsonBody(req);
      const page = resolvePageDirectory(discovery.pages, body.path);
      const replacements = Array.isArray(body.replacements)
        ? body.replacements
            .filter((item) => item && typeof item.searchText === "string" && item.replaceText !== undefined)
            .map((item) => ({ searchText: item.searchText, replaceText: String(item.replaceText ?? "") }))
        : [];
      if (!replacements.length) {
        throw new QuickEditError("replacements is empty", 400);
      }
      const changedFiles = applyTextReplacements(rootDir, page, replacements);
      sendJson(res, { success: true, changedFiles });
    } catch (error) {
      sendJson(res, { error: error.message }, error.status || 500);
    }
    return;
  }

  if (pathname === "/api/skills" && req.method === "GET") {
    sendJson(res, { version: 1, skills: discoverSkills(rootDir) });
    return;
  }

  if (pathname === "/api/skills/import" && req.method === "POST") {
    const body = await readLargeJsonBody(req);
    const base64 = String(body.dataBase64 || "").replace(/^data:[^,]*,/, "");
    if (!base64) {
      sendJson(res, { error: "缺少上传文件内容。" }, 400);
      return;
    }
    try {
      const skill = importSkill(rootDir, { filename: body.filename, buffer: Buffer.from(base64, "base64") });
      state.refresh();
      sendJson(res, { version: 1, skill, manifest: state.manifest }, 201);
    } catch (error) {
      sendJson(res, { error: error.message || "导入技能失败。" }, 400);
    }
    return;
  }

  if (pathname.startsWith("/api/skills/") && !pathname.endsWith("/export") && !pathname.endsWith("/import") && req.method === "DELETE") {
    const id = decodeURIComponent(pathname.replace(/^\/api\/skills\//, ""));
    try {
      const deleted = deleteSkill(rootDir, id);
      state.refresh();
      sendJson(res, { version: 1, deleted });
    } catch (error) {
      sendJson(res, { error: error.message || "删除技能失败。" }, 400);
    }
    return;
  }

  if (pathname.startsWith("/api/skills/") && pathname.endsWith("/export") && req.method === "GET") {
    const id = decodeURIComponent(pathname.replace(/^\/api\/skills\//, "").replace(/\/export$/, ""));
    try {
      const archive = exportSkillArchive(rootDir, id);
      res.writeHead(200, {
        "content-type": "application/zip",
        "content-disposition": `attachment; filename="${archive.filename}"; filename*=UTF-8''${encodeURIComponent(archive.filename)}`,
        "content-length": String(archive.buffer.length),
        "cache-control": "no-store",
      });
      res.end(archive.buffer);
    } catch (error) {
      sendJson(res, { error: error.message || "技能导出失败。" }, 404);
    }
    return;
  }

  if (pathname.startsWith("/api/skills/") && req.method === "GET") {
    const id = decodeURIComponent(pathname.replace(/^\/api\/skills\//, ""));
    try {
      sendJson(res, { version: 1, skill: getSkillDetail(rootDir, id) });
    } catch (error) {
      sendJson(res, { error: error.message || "未找到技能。" }, 404);
    }
    return;
  }

  if (pathname === "/api/project/pages" && req.method === "GET") {
    // 始终返回全量项目页面目录，供版本编辑器在任意 scope（含迭代查看页）下增删页面。
    const projectManifest = buildManifest(rootDir, discovery, { kind: "project" }, state.runtime);
    sendJson(res, { version: 1, pages: projectManifest.pages, pageLibrary: projectManifest.pageLibrary });
    return;
  }

  if (pathname === "/api/publish/status" && req.method === "GET") {
    const status = await getProtoHubPublishStatus(rootDir, {
      systemName: String(manifest.brandName || manifest.title || "").trim(),
    });
    sendJson(res, status);
    return;
  }

  if (pathname === "/api/publish/config" && req.method === "POST") {
    const body = await readJsonBody(req);
    try {
      const config = saveProtoHubPublishConfig(rootDir, body, {
        systemName: String(manifest.brandName || manifest.title || "").trim(),
      });
      sendJson(res, { version: 1, config });
    } catch (error) {
      sendJson(res, { error: error.message || "保存发布配置失败。" }, 400);
    }
    return;
  }

  if (pathname === "/api/versions") {
    if (req.method === "GET") {
      sendJson(res, { version: 1, iterations: serializeIterations(rootDir, manifest) });
      return;
    }
    if (req.method === "POST") {
      const body = await readJsonBody(req);
      const pageIds = normalizePageIds(body.pageIds, state.manifest, { defaultToAll: false });
      if (!pageIds.length) {
        sendJson(res, { error: "请至少选择一个页面后再保存版本。" }, 400);
        return;
      }
      const selectedPages = state.manifest.pages.filter((page) => pageIds.includes(page.id));
      const iteration = createIteration(rootDir, {
        name: body.name,
        description: body.description || "",
        pageIds,
        pageSnapshots: selectedPages,
        pageLibrarySnapshot: createPageLibrarySnapshot(rootDir, selectedPages, { includeEmptyFolders: false }),
        requirementSnapshots: collectRequirementSnapshots(selectedPages),
        issues: body.issues,
      });
      writeIterationPreviewManifest(rootDir, discovery, iteration);
      sendJson(res, { version: 1, iteration: serializeIteration(iteration, manifest, rootDir) }, 201);
      return;
    }
  }

  if (pathname.startsWith("/api/versions/")) {
    const [rawTarget = "", action = "", rawPageId = ""] = pathname.replace(/^\/api\/versions\//, "").split("/");
    const target = decodeURIComponent(rawTarget);
    if (action === "publish" && req.method === "POST") {
      const body = await readJsonBody(req).catch(() => ({}));
      const currentIteration = listIterations(rootDir).find((it) => it.id === target || it.slug === target || it.name === target);
      if (!currentIteration) {
        sendJson(res, { error: "版本不存在。" }, 404);
        return;
      }
      try {
        // 发布时始终尝试附带 PRD（页面 prd.md 优先，否则 Spec/需求汇总），与原型包一起上传
        const publishResult = await publishIterationViaProtoHub({
          rootDir,
          iteration: currentIteration,
          projectTitle: String(manifest.brandName || manifest.title || "掌图"),
          pages: discovery.pages,
          defaults: { systemName: String(manifest.brandName || manifest.title || "").trim() },
          changelog: body?.changelog,
          prdFile: body?.prdFile,
          prdUrl: body?.prdUrl,
        });
        const iteration = updateIteration(rootDir, target, {
          publishedAt: publishResult.publishedAt,
          publishedMeta: publishResult.publishedMeta,
        });
        writeIterationPreviewManifest(rootDir, discovery, iteration);
        sendJson(res, { version: 1, iteration: serializeIteration(iteration, manifest, rootDir), publish: publishResult.publishedMeta });
      } catch (error) {
        const detail = [error.details, error.stderr, error.stdout].filter((s) => typeof s === "string" && s.trim()).join("\n\n");
        sendJson(res, { error: detail ? `${error.message || "发布失败"}\n\n${detail}` : (error.message || "发布版本失败") }, 400);
      }
      return;
    }
    if (action === "prd" && req.method === "GET") {
      const currentIteration = listIterations(rootDir).find((it) => it.id === target || it.slug === target || it.name === target);
      if (!currentIteration) {
        sendJson(res, { error: "版本不存在。" }, 404);
        return;
      }
      const prd = resolveIterationPrd(rootDir, currentIteration, discovery, manifest);
      sendJson(res, {
        version: 1,
        iterationId: currentIteration.id,
        name: currentIteration.name,
        ...prd,
      });
      return;
    }
    if (action === "requirements" && rawPageId && req.method === "PUT") {
      const pageId = decodeURIComponent(rawPageId);
      const body = await readJsonBody(req);
      const iteration = listIterations(rootDir).find((item) => item.id === target || item.slug === target || item.name === target);
      if (!iteration) {
        sendJson(res, { error: `Iteration not found: ${target}` }, 404);
        return;
      }
      const pageIds = normalizePageIds(iteration.pageIds, state.manifest, { defaultToAll: false });
      if (!pageIds.includes(pageId)) {
        sendJson(res, { error: "当前版本不包含该页面。" }, 400);
        return;
      }
      const requirementSnapshots = {
        ...(iteration.requirementSnapshots || {}),
        [pageId]: Array.isArray(body.annotations) ? body.annotations : [],
      };
      const updated = updateIteration(rootDir, target, {
        requirementSnapshots,
      });
      writeIterationPreviewManifest(rootDir, discovery, updated);
      sendJson(res, { version: 1, iteration: serializeIteration(updated, manifest, rootDir) });
      return;
    }
    if (!action && req.method === "PUT") {
      const body = await readJsonBody(req);
      const pageIds = normalizePageIds(body.pageIds, state.manifest, { defaultToAll: false });
      if (!pageIds.length) {
        sendJson(res, { error: "请至少选择一个页面后再保存版本。" }, 400);
        return;
      }
      const currentIteration = listIterations(rootDir).find((item) => item.id === target || item.slug === target || item.name === target);
      const selectedPages = state.manifest.pages.filter((page) => pageIds.includes(page.id));
      const nextRequirementSnapshots = mergeRequirementSnapshots({
        selectedPages,
        previous: currentIteration?.requirementSnapshots || {},
      });
      const iteration = updateIteration(rootDir, target, {
        nextName: body.name,
        description: body.description,
        pageIds,
        pageSnapshots: selectedPages,
        pageLibrarySnapshot: createPageLibrarySnapshot(rootDir, selectedPages, { includeEmptyFolders: false }),
        requirementSnapshots: nextRequirementSnapshots,
        issues: body.issues,
        publishedAt: body.publishedAt,
      });
      writeIterationPreviewManifest(rootDir, discovery, iteration);
      sendJson(res, { version: 1, iteration: serializeIteration(iteration, manifest, rootDir) });
      return;
    }
    if (!action && req.method === "DELETE") {
      const iteration = deleteIteration(rootDir, target);
      rmSync(join(rootDir, ".zhangtu", "preview", iteration.slug), { recursive: true, force: true });
      sendJson(res, { version: 1, deleted: serializeIteration(iteration, manifest, rootDir) });
      return;
    }
  }

  if (pathname.startsWith("/workspace/")) {
    await proxyToVite({
      req,
      res,
      viteBaseUrl,
      targetPath: pathname.replace(/^\/workspace/, "") + requestUrl.search,
    });
    return;
  }

  if (shouldProxyToVite(pathname)) {
    await proxyToVite({
      req,
      res,
      viteBaseUrl,
      targetPath: pathname + requestUrl.search,
    });
    return;
  }

  if (pathname === "/api/brand-logo" && req.method === "GET") {
    const logoRel = state.manifest.brandLogo;
    if (!logoRel) {
      res.writeHead(204);
      res.end();
      return;
    }
    const logoAbs = join(rootDir, logoRel);
    if (!sendStaticAsset(res, logoAbs)) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found");
    }
    return;
  }

  if (pathname === "/favicon.ico" || pathname === "/favicon.png" || pathname === "/favicon.svg") {
    const candidateAssets = pathname === "/favicon.ico"
      ? [
          join(rootDir, "src/assets/favicon.ico"),
          join(rootDir, "src/assets/favicon.png"),
          join(rootDir, "src/assets/favicon.svg"),
        ]
      : pathname === "/favicon.png"
        ? [
            join(rootDir, "src/assets/favicon.png"),
            join(rootDir, "src/assets/favicon.ico"),
            join(rootDir, "src/assets/favicon.svg"),
          ]
        : [
            join(rootDir, "src/assets/favicon.svg"),
            join(rootDir, "src/assets/favicon.png"),
            join(rootDir, "src/assets/favicon.ico"),
          ];

    if (state.manifest.brandLogo) {
      candidateAssets.push(join(rootDir, state.manifest.brandLogo));
    }

    for (const assetPath of candidateAssets) {
      if (sendStaticAsset(res, assetPath)) {
        return;
      }
    }

    res.writeHead(204);
    res.end();
    return;
  }

  res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
  res.end("Not found");
}

function normalizePageIds(pageIds, manifest, options = {}) {
  const defaultToAll = options.defaultToAll !== false;
  if (!Array.isArray(pageIds)) {
    return defaultToAll ? manifest.pages.map((page) => page.id) : [];
  }
  if (pageIds.length === 0) {
    return defaultToAll ? manifest.pages.map((page) => page.id) : [];
  }
  const validPageIds = new Set(manifest.pages.map((page) => page.id));
  return Array.from(new Set(pageIds.map(String).filter((pageId) => validPageIds.has(pageId))));
}

function getIterationPages(iteration, fallbackPages) {
  const liveById = new Map((Array.isArray(fallbackPages) ? fallbackPages : []).map((page) => [page.id, page]));
  const mergeLivePrd = (page) => {
    const live = liveById.get(page.id);
    if (!live) {
      return { ...page };
    }
    // 快照可能早于 prd.md 生成：展示/发布以磁盘现状为准
    return {
      ...page,
      prdPath: live.prdPath || page.prdPath || null,
      hasPrd: Boolean(live.hasPrd || live.prdPath || page.hasPrd || page.prdPath),
      pageDirectory: live.pageDirectory || page.pageDirectory || null,
      specPath: live.specPath || page.specPath || null,
    };
  };

  if (Array.isArray(iteration.pageSnapshots) && iteration.pageSnapshots.length) {
    return iteration.pageSnapshots
      .filter((page) => !isSkillsManagementPage(page))
      .map(mergeLivePrd);
  }
  const pageIdSet = new Set(iteration.pageIds || []);
  return fallbackPages
    .filter((page) => pageIdSet.has(page.id) && !isSkillsManagementPage(page))
    .map((page) => ({ ...page }));
}

function normalizeRequirementSnapshotsForPages(value, pages) {
  const pageIdSet = new Set((pages || []).map((page) => page.id));
  const snapshots = value && typeof value === "object" ? value : {};
  return Object.entries(snapshots).reduce((accumulator, [pageId, annotations]) => {
    if (!pageIdSet.has(pageId) || !Array.isArray(annotations)) {
      return accumulator;
    }
    accumulator[pageId] = annotations.map((item, index) => ({
      id: String(item?.id || `req-${index + 1}`),
      order: Number.isFinite(Number(item?.order)) ? Number(item.order) : index + 1,
      title: String(item?.title || "").trim(),
      anchorId: String(item?.anchorId || item?.id || `req-${index + 1}`),
      activatePath: Array.isArray(item?.activatePath) ? item.activatePath : undefined,
      bodyMarkdown: typeof item?.bodyMarkdown === "string" ? item.bodyMarkdown : "",
      category: typeof item?.category === "string" ? item.category : "",
      color: typeof item?.color === "string" ? item.color : "",
      ref: typeof item?.ref === "string" ? item.ref : undefined,
    }));
    return accumulator;
  }, {});
}

function applyRequirementSnapshotsToPages(pages, requirementSnapshots) {
  return (pages || []).map((page) => {
    const snapshot = requirementSnapshots[page.id];
    if (!snapshot) {
      return page;
    }
    return {
      ...page,
      requirementModules: snapshot.map((item) => ({ ...item })),
    };
  });
}

function collectRequirementSnapshots(pages) {
  return (pages || []).reduce((accumulator, page) => {
    accumulator[page.id] = Array.isArray(page.requirementModules)
      ? page.requirementModules.map((item) => ({ ...item }))
      : [];
    return accumulator;
  }, {});
}

function mergeRequirementSnapshots({ selectedPages, previous }) {
  const merged = {};
  const previousMap = previous && typeof previous === "object" ? previous : {};
  for (const page of selectedPages || []) {
    merged[page.id] = Array.isArray(previousMap[page.id])
      ? previousMap[page.id].map((item) => ({ ...item }))
      : Array.isArray(page.requirementModules)
        ? page.requirementModules.map((item) => ({ ...item }))
        : [];
  }
  return merged;
}

function serializeIterations(rootDir, manifest) {
  return listIterations(rootDir).map((iteration) => serializeIteration(iteration, manifest, rootDir));
}

function serializeIteration(iteration, manifest, rootDir) {
  const pages = getIterationPages(iteration, manifest.pages);
  const prd = rootDir
    ? resolveIterationPrd(rootDir, iteration, null, manifest)
    : summarizePagePrd(pages);
  return {
    ...iteration,
    pageCount: (iteration.pageIds || []).length,
    pages: pages.map((page) => ({
      id: page.id,
      name: page.name,
      sourcePath: page.sourcePath,
      hasPrd: Boolean(page.hasPrd || page.prdPath),
      prdPath: page.prdPath || null,
    })),
    previewPath: `/iterations/${iteration.slug}`,
    isPublished: Boolean(iteration.publishedAt),
    publishedMeta: iteration.publishedMeta || null,
    hasPrd: prd.hasPrd,
    prdPageCount: prd.prdPageCount,
    prdPaths: prd.prdPaths,
  };
}

/** 正式 PRD = 版本内页面存在 prd.md；展示/置灰按钮以它为准。发布仍可附带 Spec 汇总。 */
function summarizePagePrd(pages) {
  const withPrd = (Array.isArray(pages) ? pages : []).filter((page) => page?.hasPrd || page?.prdPath);
  return {
    hasPrd: withPrd.length > 0,
    prdPageCount: withPrd.length,
    prdPaths: withPrd.map((page) => page.prdPath).filter(Boolean),
    available: withPrd.length > 0,
    markdown: null,
  };
}

function resolveIterationPrd(rootDir, iteration, discovery, manifest) {
  const livePages = discovery?.pages || manifest?.pages || [];
  const pages = getIterationPages(iteration, livePages);
  const summary = summarizePagePrd(pages);
  if (!summary.hasPrd) {
    return {
      ...summary,
      available: false,
      markdown: null,
      message: "当前版本内页面尚未生成 PRD（缺少 prd.md）。请先用 prd-generator 生成后再查看。",
    };
  }

  const built = buildIterationPrdMarkdown({
    rootDir,
    iteration,
    pages,
    projectTitle: String(manifest?.brandName || manifest?.title || "掌图"),
  });

  return {
    ...summary,
    available: true,
    markdown: built?.markdown || null,
    formalPrdCount: built?.formalPrdCount || summary.prdPageCount,
    message: built
      ? `已汇总 ${built.formalPrdCount || summary.prdPageCount} 个页面的 PRD。`
      : "未能读取 PRD 内容。",
  };
}

function writeIterationPreviewManifest(rootDir, discovery, iteration) {
  const rawPages = getIterationPages(iteration, discovery.pages);
  const requirementSnapshots = normalizeRequirementSnapshotsForPages(iteration.requirementSnapshots, rawPages);
  const pages = applyPageLibrary(
    rootDir,
    applyRequirementSnapshotsToPages(rawPages, requirementSnapshots),
  );
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
      publishedAt: iteration.publishedAt || null,
      publishedMeta: iteration.publishedMeta || null,
    },
    pages,
    skillsPage: null,
    designSystemPage: null,
    pageLibrary: createPageLibrarySnapshot(rootDir, pages, { includeEmptyFolders: false }),
    iterationRequirementSnapshots: requirementSnapshots,
    generatedAt: new Date().toISOString(),
  }, null, 2)}\n`);
}

function readLargeJsonBody(req, maxBytes = 48 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk.toString();
      if (raw.length > maxBytes) {
        reject(new Error("上传内容过大，请控制在 32MB 以内。"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!raw.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Request body must be JSON."));
      }
    });
    req.on("error", reject);
  });
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk.toString();
      if (raw.length > 1024 * 1024) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!raw.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Request body must be JSON."));
      }
    });
    req.on("error", reject);
  });
}

function shouldProxyToVite(pathname) {
  return (
    pathname.startsWith("/src/") ||
    pathname.startsWith("/@fs/") ||
    pathname.startsWith("/@vite/") ||
    pathname.startsWith("/@react-refresh") ||
    pathname.startsWith("/node_modules/") ||
    pathname.startsWith("/assets/")
  );
}

async function proxyToVite({ req, res, viteBaseUrl, targetPath }) {
  try {
    const response = await fetch(`${viteBaseUrl}${targetPath}`, {
      method: req.method,
      headers: buildProxyHeaders(req.headers),
    });
    if (res.destroyed || res.writableEnded) {
      return;
    }
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    res.writeHead(response.status, headers);
    const buffer = Buffer.from(await response.arrayBuffer());
    if (res.destroyed) {
      return;
    }
    res.end(buffer);
  } catch (error) {
    if (!res.destroyed && !res.writableEnded) {
      try {
        res.writeHead(502, { "content-type": "text/plain; charset=utf-8" });
        res.end("proxy error");
      } catch {}
    }
  }
}

function buildProxyHeaders(headers) {
  const nextHeaders = { ...headers };
  delete nextHeaders.host;
  return nextHeaders;
}

function proxyUpgrade({ req, socket, head, vitePort }) {
  const proxy = net.connect(vitePort, "127.0.0.1", () => {
    proxy.write(`${req.method} ${req.url} HTTP/${req.httpVersion}\r\n`);
    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          proxy.write(`${key}: ${item}\r\n`);
        }
      } else if (value !== undefined) {
        proxy.write(`${key}: ${value}\r\n`);
      }
    }
    proxy.write("\r\n");
    proxy.write(head);
    proxy.pipe(socket);
    socket.pipe(proxy);
  });

  proxy.on("error", () => socket.destroy());
  socket.on("error", () => {
    try {
      proxy.destroy();
    } catch {}
  });
}

function renderShell(manifest) {
  const manifestJson = JSON.stringify(manifest).replace(/</g, "\\u003c");
  const theme = manifest.theme;
  const templatePath = new URL("./shell.html", import.meta.url);
  const html = readFileSync(templatePath, "utf8");
  return html
    .replace("__MANIFEST__", manifestJson)
    .replace("__TITLE__", escapeHtml(manifest.title))
    .replace("__PRIMARY__", theme.primaryColor)
    .replace("__ACCENT__", theme.accentColor)
    .replace("__BG__", theme.backgroundColor)
    .replace("__SURFACE__", theme.surfaceColor)
    .replace("__TEXT__", theme.textColor)
    .replace("__BRAND_NAME__", escapeHtml(manifest.brandName))
    .replace("__BRAND_LOGO__", manifest.brandLogo ? "/api/brand-logo" : "")
    .replace("__SCOPE_LABEL__", escapeHtml(manifest.scope.kind === "iteration" ? "迭代预览" : "项目预览"));
}

function sendHtml(res, html) {
  res.writeHead(200, {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(html);
}

function sendJson(res, value, status = 200) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(`${JSON.stringify(value, null, 2)}\n`);
}

function applyApiCors(req, res) {
  const origin = req.headers.origin || "*";
  res.setHeader("access-control-allow-origin", origin);
  res.setHeader("access-control-allow-methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("access-control-allow-headers", "content-type");
  res.setHeader("vary", "origin");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sendStaticAsset(res, assetPath) {
  try {
    const data = readFileSync(assetPath);
    res.writeHead(200, {
      "content-type": getAssetContentType(assetPath),
      "cache-control": "no-store",
    });
    res.end(data);
    return true;
  } catch {
    return false;
  }
}

function getAssetContentType(assetPath) {
  const normalized = String(assetPath).toLowerCase();
  if (normalized.endsWith(".png")) return "image/png";
  if (normalized.endsWith(".svg")) return "image/svg+xml";
  if (normalized.endsWith(".ico")) return "image/x-icon";
  return "application/octet-stream";
}

async function waitForUrl(url, getOutput) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 30000) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Keep waiting for Vite.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Vite dev server did not start at ${url}.\n${getOutput()}`);
}

async function findFreePort(startPort) {
  for (let port = Number(startPort); port < Number(startPort) + 50; port += 1) {
    if (await isPortFree(port)) {
      return port;
    }
  }
  throw new Error(`No free port found near ${startPort}.`);
}

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port, "127.0.0.1");
  });
}
