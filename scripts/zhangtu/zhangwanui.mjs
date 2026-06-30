import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { getSkillDetail, resolveSkillDirectory } from "./skills.mjs";

const SKILL_ID = "zhangwanUI";
const DEFAULT_DOC_PATHS = [
  "DESIGN.md",
  "SKILL.md",
  "README.md",
  "references/design-tokens.md",
  "references/components.md",
];

export function getZhangwanUiBundle(rootDir) {
  const skillDir = resolveSkillDirectory(rootDir, SKILL_ID);
  if (!skillDir || !existsSync(skillDir)) {
    throw new Error("未找到 zhangwanUI skill 目录。");
  }

  const skill = getSkillDetail(rootDir, SKILL_ID);
  const library = readJsonFile(resolveSkillPath(skillDir, "library-consumption.json"), {});
  const css = readJsonFile(resolveSkillPath(skillDir, library.entrypoints?.tokenUnderstanding || "css.json"), {});
  const componentsIndex = readJsonFile(
    resolveSkillPath(skillDir, library.entrypoints?.componentIndex || "components/index.json"),
    { components: [] },
  );
  const components = buildComponents(skillDir, componentsIndex);
  const documents = collectDocuments(skillDir, library);
  const icons = collectIconFiles(skillDir, components);
  const uiKits = collectUiKits(skillDir);

  return {
    version: 1,
    meta: {
      ...skill,
      displayName: library.libraryName || componentsIndex.brandName || skill.name,
      brandName: componentsIndex.brandName || library.libraryName || skill.name,
      productType: componentsIndex.productType || library.productType || null,
      exportUrl: `/api/skills/${encodeURIComponent(SKILL_ID)}/export`,
      documentCount: documents.length,
      componentCount: components.length,
      iconCount: icons.length,
    },
    library,
    css,
    components,
    documents,
    icons,
    uiKits,
  };
}

function buildComponents(skillDir, componentsIndex) {
  const list = Array.isArray(componentsIndex.components) ? componentsIndex.components : [];
  return list.map((component) => {
    const contractPath = resolveSkillPath(skillDir, `components/${component.slug}.json`);
    return {
      ...component,
      contract: readJsonFile(contractPath, null),
      previewUrl: (component.previewFile || component.preview) ? `/api/zhangwanui/${component.previewFile || component.preview}` : null,
    };
  });
}

function collectDocuments(skillDir, library) {
  const ordered = [];
  const seen = new Set();
  const addPath = (value) => {
    if (!value || seen.has(value)) {
      return;
    }
    const fullPath = resolveSkillPath(skillDir, value);
    if (!existsSync(fullPath)) {
      return;
    }
    seen.add(value);
    ordered.push(value);
  };

  for (const filePath of Array.isArray(library.readOrder) ? library.readOrder : []) {
    if (String(filePath).toLowerCase().endsWith(".md")) {
      addPath(filePath);
    }
  }

  for (const filePath of DEFAULT_DOC_PATHS) {
    addPath(filePath);
  }

  for (const fileName of readMarkdownFiles(skillDir)) {
    addPath(fileName);
  }

  const referencesDir = join(skillDir, "references");
  if (existsSync(referencesDir)) {
    for (const fileName of readMarkdownFiles(referencesDir)) {
      addPath(`references/${fileName}`);
    }
  }

  const prioritized = prioritizeDocuments(ordered);

  return prioritized.map((filePath) => ({
    key: toDocumentKey(filePath),
    title: basename(filePath),
    path: filePath,
    content: readFileSync(resolveSkillPath(skillDir, filePath), "utf8"),
  }));
}

function prioritizeDocuments(paths) {
  const list = paths.slice();
  const designIndex = list.findIndex((filePath) => /(^|\/)design\.md$/i.test(String(filePath || "")));
  if (designIndex > 0) {
    const [designPath] = list.splice(designIndex, 1);
    list.unshift(designPath);
  }
  return list;
}

function readMarkdownFiles(dir) {
  if (!existsSync(dir)) {
    return [];
  }
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, "zh-CN"));
}

function collectIconFiles(skillDir, components) {
  const iconsDir = join(skillDir, "assets", "icons");
  const files = [];
  if (existsSync(iconsDir)) {
    for (const entry of readdirSync(iconsDir, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.toLowerCase().endsWith(".svg")) {
        files.push(entry.name);
      }
    }
  }
  files.sort((left, right) => left.localeCompare(right, "en"));

  if (!files.length) {
    return extractIconCatalogFromPreview(skillDir, components);
  }

  return files.map((fileName) => {
    const id = fileName.replace(/\.svg$/i, "");
    return {
      id,
      name: humanizeIconId(id),
      fileName,
      url: `/api/zhangwanui/assets/icons/${encodeURIComponent(fileName)}`,
      sources: ["assets/icons"],
      componentNames: [],
    };
  });
}

function collectUiKits(skillDir) {
  const kitsDir = join(skillDir, "ui_kits");
  const kits = [];
  if (!existsSync(kitsDir)) {
    return kits;
  }
  for (const entry of readdirSync(kitsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }
    const indexPath = join(kitsDir, entry.name, "index.html");
    if (!existsSync(indexPath)) {
      continue;
    }
    kits.push({
      id: entry.name,
      name: entry.name,
      url: `/api/zhangwanui/ui_kits/${encodeURIComponent(entry.name)}/index.html`,
      path: `ui_kits/${entry.name}/index.html`,
    });
  }
  kits.sort((left, right) => left.name.localeCompare(right.name, "en"));
  return kits;
}

function extractIconCatalogFromPreview(skillDir, components) {
  const symbolMap = new Map();
  const previewMap = new Map();

  for (const component of components) {
    if (!component.previewFile) {
      continue;
    }
    if (!previewMap.has(component.previewFile)) {
      previewMap.set(component.previewFile, []);
    }
    previewMap.get(component.previewFile).push(component.name);
  }

  for (const [previewFile, names] of previewMap.entries()) {
    const previewPath = resolveSkillPath(skillDir, previewFile);
    if (!existsSync(previewPath)) {
      continue;
    }

    const source = readFileSync(previewPath, "utf8");
    const regex = /<symbol\s+id="([^"]+)"([^>]*)>([\s\S]*?)<\/symbol>/g;
    for (const match of source.matchAll(regex)) {
      const id = match[1];
      const attrs = match[2] || "";
      const markup = (match[3] || "").trim();
      const viewBoxMatch = attrs.match(/viewBox="([^"]+)"/);
      const viewBox = viewBoxMatch?.[1] || "0 0 16 16";
      const record = symbolMap.get(id) || {
        id,
        name: humanizeIconId(id),
        viewBox,
        markup,
        sources: new Set(),
        componentNames: new Set(),
      };

      record.sources.add(previewFile);
      for (const name of names) {
        record.componentNames.add(name);
      }
      if (!record.markup && markup) {
        record.markup = markup;
      }
      if (!record.viewBox && viewBox) {
        record.viewBox = viewBox;
      }
      symbolMap.set(id, record);
    }
  }

  return Array.from(symbolMap.values())
    .map((item) => ({
      id: item.id,
      name: item.name,
      viewBox: item.viewBox,
      markup: item.markup,
      sources: Array.from(item.sources).sort((left, right) => left.localeCompare(right, "zh-CN")),
      componentNames: Array.from(item.componentNames).sort((left, right) => left.localeCompare(right, "zh-CN")),
    }))
    .sort((left, right) => left.name.localeCompare(right.name, "en"));
}

function humanizeIconId(id) {
  return String(id || "")
    .replace(/^i-/, "")
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toDocumentKey(filePath) {
  const normalized = String(filePath || "")
    .replace(/^references\//, "")
    .replace(/\.md$/i, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return normalized || "document";
}

function resolveSkillPath(skillDir, relativePath) {
  return join(skillDir, ...String(relativePath || "").split("/").filter(Boolean));
}

function readJsonFile(filePath, fallback) {
  if (!existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(readFileSync(filePath, "utf8"));
}
