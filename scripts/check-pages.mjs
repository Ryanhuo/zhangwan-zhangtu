#!/usr/bin/env node
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { SYSTEM_PAGE_DIRS } from "./zhangtu/discovery.mjs";

export async function checkPages(rootDir) {
  const pagesDir = join(rootDir, "src", "pages");
  const failures = [];

  if (!existsSync(pagesDir)) {
    return { ok: true, checked: 0, failures: [] };
  }

  const entries = await collectPageEntries(pagesDir, rootDir);

  for (const entry of entries) {
    const htmlPath = join(entry.dir, "index.html");
    const relativeHtmlPath = normalizePath(relative(rootDir, htmlPath));
    const relativeTsxPath = normalizePath(relative(rootDir, entry.tsxPath));

    if (!entry.hasIndexTsx) {
      failures.push({
        file: relativeHtmlPath,
        reason: "missing-index-tsx",
        message: "页面目录必须包含 index.tsx。",
      });
      continue;
    }

    if (!entry.hasIndexHtml) {
      failures.push({
        file: relativeHtmlPath,
        reason: "missing-index-html",
        message: "页面目录必须包含 index.html。",
      });
      continue;
    }

    const source = await readFile(entry.tsxPath, "utf8");
    if (!/createRoot\s*\(/.test(source) || !/\.render\s*\(/.test(source)) {
      failures.push({
        file: relativeTsxPath,
        reason: "missing-react-root-render",
        message: "页面入口必须调用 createRoot(...).render(...)，不能只写组件片段。",
      });
    }

    const html = await readFile(htmlPath, "utf8");
    if (!/<div\b(?=[^>]*\bid=["']root["'])[^>]*>/i.test(html)) {
      failures.push({
        file: relativeHtmlPath,
        reason: "missing-root-container",
        message: "index.html 必须包含 <div id=\"root\"></div>。",
      });
    }
    if (!/<script\b(?=[^>]*\btype=["']module["'])(?=[^>]*\bsrc=["']\.\/index\.tsx["'])[^>]*>/i.test(html)) {
      failures.push({
        file: relativeHtmlPath,
        reason: "missing-index-tsx-module-script",
        message: "index.html 必须通过 <script type=\"module\" src=\"./index.tsx\"> 加载页面入口。",
      });
    }
  }

  return { ok: failures.length === 0, checked: entries.length, failures };
}

async function collectPageEntries(dir, rootDir) {
  const result = [];
  const relDir = relative(rootDir, dir).split("\\").join("/");
  if (SYSTEM_PAGE_DIRS.has(relDir)) return result;

  const children = await readdir(dir, { withFileTypes: true });
  const hasIndexTsx = children.some((entry) => entry.isFile() && entry.name === "index.tsx");
  const hasIndexHtml = children.some((entry) => entry.isFile() && entry.name === "index.html");

  if (hasIndexTsx || hasIndexHtml) {
    result.push({
      dir,
      tsxPath: join(dir, "index.tsx"),
      hasIndexTsx,
      hasIndexHtml,
    });
  }

  for (const child of children) {
    if (!child.isDirectory()) {
      continue;
    }
    if (["assets", "data", "styles", "node_modules", "dist"].includes(child.name)) {
      continue;
    }
    result.push(...await collectPageEntries(join(dir, child.name), rootDir));
  }

  return result;
}

function normalizePath(value) {
  return value.split("\\").join("/");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await checkPages(process.cwd());
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) {
    process.exit(1);
  }
}
