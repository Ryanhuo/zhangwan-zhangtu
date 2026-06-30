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
    primaryColor: "#2563eb",
    accentColor: "#0f766e",
    backgroundColor: "#f6f8fb",
    surfaceColor: "#ffffff",
    textColor: "#111827",
  },
};

const PAGE_LOCAL_DIRS = new Set(["assets", "data", "styles", "node_modules", "dist"]);

export function discoverPages(rootDir) {
  const { config, configSource } = loadConfig(rootDir);
  const diagnostics = [];
  const pages = [];
  const candidates = [];

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

function walkPageRoots({ rootDir, dir, config, pages, candidates, diagnostics }) {
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
    });
  }
}

function buildPage({ rootDir, dir, sourcePath, htmlPath, config, diagnostics }) {
  const specPath = normalizePath(relative(rootDir, join(dir, "spec.md")));
  const requirementsPath = normalizePath(relative(rootDir, join(dir, "zhangtu.requirements.ts")));
  const hasSpec = existsSync(join(rootDir, specPath));
  const hasRequirements = existsSync(join(rootDir, requirementsPath));
  const pageDirectory = normalizePath(relative(rootDir, dir));
  const id = pageIdFromPath(sourcePath);
  const name = config.pageNameMap[sourcePath] || readSpecTitle(join(rootDir, specPath)) || readHtmlTitle(join(rootDir, htmlPath)) || titleFromPath(pageDirectory);
  const group = inferGroup(pageDirectory);
  const requirementModules = hasRequirements ? readRequirementModules(join(rootDir, requirementsPath), diagnostics) : [];

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
    requirementModules,
    directPagePath: `/workspace/${htmlPath}`,
  };
}

function readRequirementModules(filePath, diagnostics) {
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
      .map((item, index) => ({
        id: String(item.anchorId || item.id || index + 1),
        number: String(item.id || index + 1),
        order: Number.isFinite(Number(item.order)) ? Number(item.order) : index + 1,
        title: String(item.title || `需求 ${index + 1}`),
        anchorId: String(item.anchorId || item.id || ""),
        bodyMarkdown: String(item.bodyMarkdown || "").trim(),
        category: typeof item.category === "string" ? item.category.trim() : "",
        color: typeof item.color === "string" ? item.color.trim() : "",
        ref: typeof item.ref === "string" ? item.ref.trim() : "",
      }))
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
