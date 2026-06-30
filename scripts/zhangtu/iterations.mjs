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
    resultMessage: String(value.resultMessage || "").trim(),
  };

  return Object.values(meta).some(Boolean) ? meta : null;
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
