import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join } from "node:path";

/**
 * 注意：本文件为恢复重建版本。
 * 原始 `page-library.mjs` 在历史日志中只留下了 createPageLibrarySnapshot / applyPageLibrary /
 * createFolder 三个导出（且缺失全部辅助函数），其余 deletePage / duplicatePage / movePage /
 * renameFolder / renamePage 及存储辅助函数无完整快照。
 * 这里按 preview-server.mjs 的调用契约与 discovery 的页面数据结构，重新实现了一个
 * 功能等价、可独立运行的页面库（基于 .zhangtu/page-library.json 元数据存储）。
 * 上面三个函数体沿用了原始恢复内容。
 */

const LIBRARY_RELATIVE_PATH = join(".zhangtu", "page-library.json");

function libraryPath(rootDir) {
  return join(rootDir, LIBRARY_RELATIVE_PATH);
}

function defaultLibrary() {
  return { version: 1, folders: [], pages: {}, deleted: [] };
}

function readPageLibrary(rootDir) {
  const file = libraryPath(rootDir);
  if (!existsSync(file)) return defaultLibrary();
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return defaultLibrary();
  }
}

function writePageLibrary(rootDir, library) {
  const file = libraryPath(rootDir);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(normalizePageLibrary(library), null, 2)}\n`);
  return library;
}

function normalizePageLibrary(library) {
  const safe = library && typeof library === "object" ? library : {};
  return {
    version: 1,
    folders: Array.isArray(safe.folders)
      ? safe.folders
          .filter((folder) => folder && folder.id)
          .map((folder, index) => ({
            id: String(folder.id),
            name: normalizeLabel(folder.name, "未命名文件夹"),
            order: Number.isFinite(folder.order) ? folder.order : index,
          }))
      : [],
    pages: safe.pages && typeof safe.pages === "object" ? { ...safe.pages } : {},
    deleted: Array.isArray(safe.deleted) ? safe.deleted.map(String) : [],
  };
}

function prunePageLibrary(rootDir, pages) {
  const library = normalizePageLibrary(readPageLibrary(rootDir));
  const livingIds = new Set(pages.map((page) => page.id));
  const folderIds = new Set(library.folders.map((folder) => folder.id));
  const prunedPages = {};
  for (const [pageId, meta] of Object.entries(library.pages)) {
    if (!livingIds.has(pageId)) continue;
    const folderId = meta.folderId && folderIds.has(meta.folderId) ? meta.folderId : null;
    prunedPages[pageId] = { ...meta, folderId };
  }
  library.pages = prunedPages;
  library.deleted = library.deleted.filter((id) => livingIds.has(id));
  return library;
}

function getPageMeta(library, pageId) {
  return (library.pages && library.pages[pageId]) || {};
}

function buildResolvedPageMetaMap(library, pages) {
  const resolved = {};
  const nextOrderByFolder = new Map();

  for (const page of pages) {
    const meta = getPageMeta(library, page.id);
    const folderId = meta.folderId || null;
    const key = folderId || "__root__";
    const currentMax = nextOrderByFolder.get(key) ?? 0;

    if (Number.isFinite(meta.order)) {
      resolved[page.id] = { ...meta, folderId, order: meta.order };
      nextOrderByFolder.set(key, Math.max(currentMax, Number(meta.order) + 1));
      continue;
    }

    resolved[page.id] = {
      ...meta,
      folderId,
      order: currentMax,
    };
    nextOrderByFolder.set(key, currentMax + 1);
  }

  return resolved;
}

function compareByOrderThenName(left, right) {
  const orderLeft = Number.isFinite(left.order) ? left.order : Number.MAX_SAFE_INTEGER;
  const orderRight = Number.isFinite(right.order) ? right.order : Number.MAX_SAFE_INTEGER;
  if (orderLeft !== orderRight) return orderLeft - orderRight;
  return String(left.name || "").localeCompare(String(right.name || ""), "zh-Hans-CN");
}

function comparePagesWithLibrary(left, right, library) {
  const metaLeft = getPageMeta(library, left.id);
  const metaRight = getPageMeta(library, right.id);
  const orderLeft = Number.isFinite(metaLeft.order) ? metaLeft.order : Number.MAX_SAFE_INTEGER;
  const orderRight = Number.isFinite(metaRight.order) ? metaRight.order : Number.MAX_SAFE_INTEGER;
  if (orderLeft !== orderRight) return orderLeft - orderRight;
  const nameLeft = metaLeft.title || left.name || "";
  const nameRight = metaRight.title || right.name || "";
  return String(nameLeft).localeCompare(String(nameRight), "zh-Hans-CN");
}

function createFolderId() {
  return `folder-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeLabel(value, fallback) {
  const text = typeof value === "string" ? value.trim() : "";
  return text || fallback;
}

function getNextFolderOrder(library) {
  return library.folders.reduce((max, folder) => {
    const order = Number.isFinite(folder.order) ? folder.order : 0;
    return order >= max ? order + 1 : max;
  }, 0);
}

function getNextPageOrder(library, folderId) {
  return Object.values(library.pages).reduce((max, meta) => {
    if ((meta.folderId || null) !== (folderId || null)) return max;
    const order = Number.isFinite(meta.order) ? meta.order : 0;
    return order >= max ? order + 1 : max;
  }, 0);
}

export function createPageLibrarySnapshot(rootDir, pages, options = {}) {
  const includeEmptyFolders = options.includeEmptyFolders !== false;
  // 只读快照：直接读取当前页面库，不再对子集做 prune+写回，
  // 否则用「部分页面」创建/保存版本时会把库里其它页面的目录归属清掉，导致页面列表与选择器不一致。
  const library = normalizePageLibrary(readPageLibrary(rootDir));
  const deleted = new Set(library.deleted || []);
  const visiblePages = pages.filter((page) => !deleted.has(page.id));
  const resolvedPageMeta = buildResolvedPageMetaMap(library, visiblePages);
  const folders = library.folders
    .slice()
    .sort(compareByOrderThenName)
    .map((folder) => {
      const pageIds = visiblePages
        .filter((page) => (resolvedPageMeta[page.id]?.folderId || null) === folder.id)
        .sort((left, right) => comparePagesWithLibrary(left, right, { ...library, pages: resolvedPageMeta }))
        .map((page) => page.id);
      return {
        id: folder.id,
        name: folder.name,
        pageIds,
      };
    })
    .filter((folder) => includeEmptyFolders || folder.pageIds.length > 0);

  return {
    version: 1,
    rootPageIds: visiblePages
      .filter((page) => !(resolvedPageMeta[page.id]?.folderId || null))
      .sort((left, right) => comparePagesWithLibrary(left, right, { ...library, pages: resolvedPageMeta }))
      .map((page) => page.id),
    folders,
    pageMeta: visiblePages.reduce((accumulator, page) => {
      const meta = resolvedPageMeta[page.id] || {};
      accumulator[page.id] = {
        title: meta.title || null,
        folderId: meta.folderId || null,
        order: meta.order,
      };
      return accumulator;
    }, {}),
  };
}

export function applyPageLibrary(rootDir, pages) {
  const library = normalizePageLibrary(readPageLibrary(rootDir));
  const deleted = new Set(library.deleted || []);
  const snapshot = createPageLibrarySnapshot(rootDir, pages);
  const pageMeta = snapshot.pageMeta || {};

  return pages
    .filter((page) => !deleted.has(page.id))
    .map((page) => {
      const meta = pageMeta[page.id] || {};
      return {
        ...page,
        sourceName: page.name,
        name: meta.title || page.name,
        folderId: meta.folderId || null,
        sortOrder: Number.isFinite(meta.order) ? meta.order : Number.MAX_SAFE_INTEGER,
      };
    });
}

export function createFolder(rootDir, pages, name = "新建文件夹") {
  const library = prunePageLibrary(rootDir, pages);
  const folder = {
    id: createFolderId(),
    name: normalizeLabel(name, "新建文件夹"),
    order: getNextFolderOrder(library),
  };
  library.folders.push(folder);
  writePageLibrary(rootDir, library);
  return folder;
}

export function renameFolder(rootDir, pages, folderId, name) {
  const library = prunePageLibrary(rootDir, pages);
  const folder = library.folders.find((item) => item.id === folderId);
  if (!folder) {
    throw new Error(`未找到文件夹：${folderId}`);
  }
  folder.name = normalizeLabel(name, folder.name);
  writePageLibrary(rootDir, library);
  return folder;
}

export function deleteFolder(rootDir, pages, folderId) {
  const library = prunePageLibrary(rootDir, pages);
  library.folders = library.folders.filter((item) => item.id !== folderId);
  for (const meta of Object.values(library.pages)) {
    if (meta.folderId === folderId) meta.folderId = null;
  }
  writePageLibrary(rootDir, library);
  return { id: folderId };
}

export function renamePage(rootDir, pages, pageId, name) {
  // 页面重命名通过本地别名（title）实现，不修改物理文件名。
  const library = prunePageLibrary(rootDir, pages);
  const page = pages.find((item) => item.id === pageId);
  if (!page) {
    throw new Error(`未找到页面：${pageId}`);
  }
  const meta = { ...getPageMeta(library, pageId) };
  meta.title = normalizeLabel(name, page.name);
  library.pages[pageId] = meta;
  writePageLibrary(rootDir, library);
  return { ...page, name: meta.title };
}

export function movePage(rootDir, pages, pageId, folderId = null, index) {
  const library = prunePageLibrary(rootDir, pages);
  const page = pages.find((item) => item.id === pageId);
  if (!page) {
    throw new Error(`未找到页面：${pageId}`);
  }
  if (folderId && !library.folders.some((folder) => folder.id === folderId)) {
    throw new Error(`未找到目标文件夹：${folderId}`);
  }
  // 目标容器内的现有页面（排除被移动的页面自身），按 order 排序后重排，
  // 再把被移动页面插入到 index 位置，最后回写连续的 order 值。
  // 这样无论 index 是否越界、是否与现有 order 冲突都能得到稳定结果。
  const targetFolderId = folderId || null;
  const siblings = Object.entries(library.pages)
    .filter(([id, meta]) => id !== pageId && (meta.folderId || null) === targetFolderId)
    .map(([id]) => id);
  // 借用快照排序逻辑：构造临时 library 副本读取顺序
  const orderedSiblings = pages
    .filter((p) => siblings.includes(p.id))
    .sort((a, b) => comparePagesWithLibrary(a, b, library))
    .map((p) => p.id);
  const clampedIndex = Number.isFinite(index)
    ? Math.max(0, Math.min(index, orderedSiblings.length))
    : orderedSiblings.length;
  orderedSiblings.splice(clampedIndex, 0, pageId);

  orderedSiblings.forEach((id, i) => {
    const meta = { ...library.pages[id] };
    meta.folderId = targetFolderId;
    meta.order = i;
    library.pages[id] = meta;
  });

  writePageLibrary(rootDir, library);
  const finalMeta = library.pages[pageId];
  return { id: pageId, folderId: finalMeta.folderId, order: finalMeta.order };
}

export function moveFolder(rootDir, pages, folderId, index) {
  const library = prunePageLibrary(rootDir, pages);
  const folder = library.folders.find((item) => item.id === folderId);
  if (!folder) {
    throw new Error(`未找到文件夹：${folderId}`);
  }
  // 按 order 排序后移除当前文件夹，再插入到目标位置，最后回写连续 order
  const ordered = library.folders.slice().sort(compareByOrderThenName);
  const currentIndex = ordered.findIndex((item) => item.id === folderId);
  if (currentIndex === -1) return { id: folderId, order: folder.order };
  ordered.splice(currentIndex, 1);
  const clampedIndex = Number.isFinite(index)
    ? Math.max(0, Math.min(index, ordered.length))
    : ordered.length;
  ordered.splice(clampedIndex, 0, folder);
  ordered.forEach((item, i) => {
    item.order = i;
  });
  writePageLibrary(rootDir, library);
  return { id: folderId, order: folder.order };
}

export function duplicatePage(rootDir, pages, pageId) {
  const page = pages.find((item) => item.id === pageId);
  if (!page || !page.pageDirectory) {
    throw new Error(`无法复制页面：${pageId}`);
  }
  const sourceDir = join(rootDir, page.pageDirectory);
  if (!existsSync(sourceDir)) {
    throw new Error(`页面目录不存在：${page.pageDirectory}`);
  }
  const parent = dirname(sourceDir);
  const baseName = basename(sourceDir);
  let suffix = 1;
  let targetDir = join(parent, `${baseName}-copy`);
  while (existsSync(targetDir)) {
    suffix += 1;
    targetDir = join(parent, `${baseName}-copy-${suffix}`);
  }
  cpSync(sourceDir, targetDir, { recursive: true });
  return { sourceId: pageId, directory: targetDir.replace(`${rootDir}/`, "") };
}

export function deletePage(rootDir, pages, pageId) {
  // 真实删除：移除页面目录；同时清理库内元数据。
  const page = pages.find((item) => item.id === pageId);
  const library = normalizePageLibrary(readPageLibrary(rootDir));
  if (page && page.pageDirectory) {
    const dir = join(rootDir, page.pageDirectory);
    const pagesRoot = join(rootDir, "src", "pages");
    if (dir.startsWith(pagesRoot) && existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
  delete library.pages[pageId];
  if (!library.deleted.includes(pageId)) library.deleted.push(pageId);
  writePageLibrary(rootDir, library);
  return { id: pageId };
}
