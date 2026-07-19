import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { randomBytes, createHash } from "node:crypto";

export function listIterations(rootDir) {
  const dir = iterationsDir(rootDir);
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir)
    .filter((entry) => entry.endsWith(".json"))
    .map((entry) => JSON.parse(readFileSync(join(dir, entry), "utf8")))
    .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
}

/**
 * 删除页面后清理历史：从所有迭代中移除该 pageId 及其快照/导航/需求快照/页面库快照引用，
 * 并同步改写 `.zhangtu/preview/<slug>/manifest.json`（若存在）。
 * 避免 doctor 报失效引用，也避免版本预览里残留已删页面内容。
 */
export function purgePageFromIterations(rootDir, pageId) {
  if (!pageId) {
    return [];
  }

  const purged = [];
  for (const iteration of listIterations(rootDir)) {
    const next = stripPageFromIteration(iteration, pageId);
    if (!next) {
      continue;
    }
    writeIteration(rootDir, next);
    rewriteIterationPreviewManifest(rootDir, next, pageId);
    purged.push({ id: next.id, slug: next.slug, name: next.name });
  }
  return purged;
}

function stripPageFromIteration(iteration, pageId) {
  const pageIds = Array.isArray(iteration.pageIds) ? iteration.pageIds : [];
  const hadInPageIds = pageIds.includes(pageId);
  const pageSnapshots = Array.isArray(iteration.pageSnapshots) ? iteration.pageSnapshots : [];
  const hadInSnapshots = pageSnapshots.some((page) => page && page.id === pageId);
  const requirementSnapshots = iteration.requirementSnapshots && typeof iteration.requirementSnapshots === "object"
    ? iteration.requirementSnapshots
    : {};
  const hadInRequirements = Object.prototype.hasOwnProperty.call(requirementSnapshots, pageId);
  const navigation = iteration.navigation && typeof iteration.navigation === "object" ? iteration.navigation : null;
  const navItems = Array.isArray(navigation?.items) ? navigation.items : [];
  const hadInNav = navItems.some((item) => item && item.type === "page" && item.pageId === pageId);
  const libraryTouched = pageLibrarySnapshotContains(iteration.pageLibrarySnapshot, pageId);

  if (!hadInPageIds && !hadInSnapshots && !hadInRequirements && !hadInNav && !libraryTouched) {
    return null;
  }

  const nextRequirementSnapshots = { ...requirementSnapshots };
  delete nextRequirementSnapshots[pageId];

  return {
    ...iteration,
    pageIds: pageIds.filter((id) => id !== pageId),
    pageSnapshots: pageSnapshots.filter((page) => !(page && page.id === pageId)),
    requirementSnapshots: normalizeRequirementSnapshots(nextRequirementSnapshots),
    navigation: navigation
      ? {
          ...navigation,
          items: navItems.filter((item) => !(item && item.type === "page" && item.pageId === pageId)),
        }
      : navigation,
    pageLibrarySnapshot: stripPageFromPageLibrarySnapshot(iteration.pageLibrarySnapshot, pageId),
    updatedAt: new Date().toISOString(),
  };
}

function pageLibrarySnapshotContains(snapshot, pageId) {
  if (!snapshot || typeof snapshot !== "object") {
    return false;
  }
  if (Array.isArray(snapshot.rootPageIds) && snapshot.rootPageIds.includes(pageId)) {
    return true;
  }
  if (snapshot.pageMeta && Object.prototype.hasOwnProperty.call(snapshot.pageMeta, pageId)) {
    return true;
  }
  if (Array.isArray(snapshot.folders)) {
    return snapshot.folders.some((folder) => Array.isArray(folder?.pageIds) && folder.pageIds.includes(pageId));
  }
  return false;
}

function stripPageFromPageLibrarySnapshot(snapshot, pageId) {
  if (!snapshot || typeof snapshot !== "object") {
    return snapshot || null;
  }
  const pageMeta = snapshot.pageMeta && typeof snapshot.pageMeta === "object" ? { ...snapshot.pageMeta } : {};
  delete pageMeta[pageId];
  return {
    ...snapshot,
    rootPageIds: Array.isArray(snapshot.rootPageIds)
      ? snapshot.rootPageIds.filter((id) => id !== pageId)
      : [],
    folders: Array.isArray(snapshot.folders)
      ? snapshot.folders.map((folder) => ({
          ...folder,
          pageIds: Array.isArray(folder?.pageIds) ? folder.pageIds.filter((id) => id !== pageId) : [],
        }))
      : [],
    pageMeta,
  };
}

function rewriteIterationPreviewManifest(rootDir, iteration, removedPageId) {
  const previewPath = join(rootDir, ".zhangtu", "preview", iteration.slug, "manifest.json");
  if (!existsSync(previewPath)) {
    return;
  }
  try {
    const manifest = JSON.parse(readFileSync(previewPath, "utf8"));
    const pageIds = Array.isArray(iteration.pageIds) ? iteration.pageIds : [];
    if (manifest.scope && typeof manifest.scope === "object") {
      manifest.scope.pageIds = pageIds;
    }
    if (Array.isArray(manifest.pages)) {
      manifest.pages = manifest.pages.filter((page) => page && page.id !== removedPageId && pageIds.includes(page.id));
    }
    if (Array.isArray(manifest.navigation)) {
      manifest.navigation = manifest.navigation
        .map((group) => ({
          ...group,
          pageIds: Array.isArray(group.pageIds)
            ? group.pageIds.filter((id) => id !== removedPageId && pageIds.includes(id))
            : [],
        }))
        .filter((group) => group.pageIds.length > 0);
    }
    if (manifest.pageLibrary) {
      manifest.pageLibrary = stripPageFromPageLibrarySnapshot(manifest.pageLibrary, removedPageId);
    }
    if (manifest.iterationRequirementSnapshots && typeof manifest.iterationRequirementSnapshots === "object") {
      const next = { ...manifest.iterationRequirementSnapshots };
      delete next[removedPageId];
      manifest.iterationRequirementSnapshots = next;
    }
    manifest.generatedAt = new Date().toISOString();
    writeFileSync(previewPath, `${JSON.stringify(manifest, null, 2)}\n`);
  } catch {
    // 预览 manifest 损坏时忽略，下次 preview-iteration 会重写
  }
}

export function createIteration(
  rootDir,
  { name, description = "", pageIds, navigation, issues, pageSnapshots, pageLibrarySnapshot, requirementSnapshots, publishedAt = null, publishedMeta = null },
) {
  if (!name || !name.trim()) {
    throw new Error("Iteration name is required.");
  }

  const now = new Date().toISOString();
  const iteration = {
    id: `itr_${randomBytes(6).toString("hex")}`,
    name: name.trim(),
    slug: uniqueSlug(rootDir, name),
    description,
    pageIds,
    navigation: navigation || { items: pageIds.map((pageId) => ({ type: "page", pageId })) },
    pageSnapshots: Array.isArray(pageSnapshots) ? pageSnapshots : [],
    pageLibrarySnapshot: pageLibrarySnapshot || null,
    requirementSnapshots: normalizeRequirementSnapshots(requirementSnapshots),
    issues: normalizeIssues(issues),
    publishedAt: publishedAt || null,
    publishedMeta: normalizePublishedMeta(publishedMeta),
    createdAt: now,
    updatedAt: now,
  };

  writeIteration(rootDir, iteration);
  return iteration;
}

export function updateIteration(
  rootDir,
  target,
  { nextName, description, pageIds, navigation, issues, pageSnapshots, pageLibrarySnapshot, requirementSnapshots, publishedAt, publishedMeta },
) {
  const iteration = resolveIteration(rootDir, target);
  if (!iteration) {
    throw new Error(`Iteration not found: ${target}`);
  }

  const updated = {
    ...iteration,
    name: nextName && nextName.trim() ? nextName.trim() : iteration.name,
    description: description !== undefined ? description : iteration.description,
    pageIds: pageIds || iteration.pageIds,
    navigation: navigation || (pageIds ? { items: pageIds.map((pageId) => ({ type: "page", pageId })) } : iteration.navigation),
    pageSnapshots: pageSnapshots || iteration.pageSnapshots || [],
    pageLibrarySnapshot: pageLibrarySnapshot || iteration.pageLibrarySnapshot || null,
    requirementSnapshots: requirementSnapshots === undefined
      ? normalizeRequirementSnapshots(iteration.requirementSnapshots)
      : normalizeRequirementSnapshots(requirementSnapshots),
    issues: issues === undefined ? normalizeIssues(iteration.issues) : normalizeIssues(issues),
    publishedAt: publishedAt === undefined ? (iteration.publishedAt || null) : (publishedAt || null),
    publishedMeta: publishedMeta === undefined ? normalizePublishedMeta(iteration.publishedMeta) : normalizePublishedMeta(publishedMeta),
    updatedAt: new Date().toISOString(),
  };

  writeIteration(rootDir, updated);
  return updated;
}

export function deleteIteration(rootDir, target) {
  const iteration = resolveIteration(rootDir, target);
  if (!iteration) {
    throw new Error(`Iteration not found: ${target}`);
  }
  unlinkSync(join(iterationsDir(rootDir), `${iteration.id}.json`));
  return iteration;
}

export function resolveIteration(rootDir, target) {
  const iterations = listIterations(rootDir);
  return iterations.find((item) => item.id === target || item.slug === target || item.name === target) || null;
}

function normalizeIssues(issues) {
  if (!Array.isArray(issues)) {
    return [];
  }

  return issues
    .map((item, index) => ({
      id: String(item.id || `issue-${index + 1}`),
      title: String(item.title || "").trim(),
      description: String(item.description || "").trim(),
      status: ["open", "in-progress", "resolved"].includes(item.status) ? item.status : "open",
    }))
    .filter((item) => item.title);
}

function normalizeRequirementSnapshots(value) {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.entries(value).reduce((accumulator, [pageId, annotations]) => {
    if (!Array.isArray(annotations)) {
      return accumulator;
    }
    accumulator[String(pageId)] = annotations.map((item, index) => ({
      id: String(item?.id || `req-${index + 1}`),
      order: Number.isFinite(Number(item?.order)) ? Number(item.order) : index + 1,
      title: String(item?.title || "").trim(),
      anchorId: String(item?.anchorId || item?.id || `req-${index + 1}`),
      activatePath: Array.isArray(item?.activatePath) ? item.activatePath : undefined,
      bodyMarkdown: typeof item?.bodyMarkdown === "string" ? item.bodyMarkdown : "",
      category: typeof item?.category === "string" ? item.category : "",
      color: typeof item?.color === "string" ? item.color : "",
      ref: typeof item?.ref === "string" ? item.ref : undefined,
    })).filter((item) => item.title || item.bodyMarkdown || item.anchorId);
    return accumulator;
  }, {});
}

function normalizePublishedMeta(value) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const meta = {
    provider: String(value.provider || "").trim(),
    systemName: String(value.systemName || "").trim(),
    baseUrl: String(value.baseUrl || "").trim(),
    shareUrl: String(value.shareUrl || "").trim(),
    cli: String(value.cli || "").trim(),
    bundleDir: String(value.bundleDir || "").trim(),
    prd: String(value.prd || "").trim(),
    prdSource: String(value.prdSource || "").trim(),
    prdFile: String(value.prdFile || "").trim(),
    prdAttached: Boolean(value.prdAttached),
    formalPrdCount: Number.isFinite(Number(value.formalPrdCount)) ? Number(value.formalPrdCount) : 0,
    resultMessage: String(value.resultMessage || "").trim(),
  };

  const hasValue = Object.entries(meta).some(([key, entry]) => {
    if (key === "prdAttached" || key === "formalPrdCount") {
      return Boolean(entry);
    }
    return Boolean(entry);
  });
  return hasValue ? meta : null;
}

function writeIteration(rootDir, iteration) {
  const dir = iterationsDir(rootDir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${iteration.id}.json`), `${JSON.stringify(iteration, null, 2)}\n`);
}

function iterationsDir(rootDir) {
  return join(rootDir, ".zhangtu", "iterations");
}

function uniqueSlug(rootDir, name) {
  const base = slugify(name);
  const existing = new Set(listIterations(rootDir).map((item) => item.slug));
  if (!existing.has(base)) {
    return base;
  }

  let index = 2;
  while (existing.has(`${base}-${index}`)) {
    index += 1;
  }
  return `${base}-${index}`;
}

function slugify(value) {
  const ascii = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (ascii) {
    return ascii;
  }

  return `iteration-${createHash("sha1").update(value).digest("hex").slice(0, 8)}`;
}
