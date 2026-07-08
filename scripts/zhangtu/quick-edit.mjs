import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";

/**
 * "快速编辑"落盘能力：把预览页里点选出的文本/样式改动写回页面源码目录。
 * 移植自 Axhub Make 的 textReplaceHandler / textReplaceCountHandler / cssUtils，
 * 但校验方式换成了针对掌图 discovery.pages 的 pageDirectory 白名单（比原版的字符串前缀检查更严格）。
 */

const TARGET_EXTENSIONS = new Set([".js", ".ts", ".jsx", ".tsx"]);
const HACK_CSS_WARNING = "/* @ai-agent-warning: Do not modify this file unless explicitly requested by the user */\n\n";

export class QuickEditError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export function resolvePageDirectory(discoveryPages, rawPath) {
  const normalized = String(rawPath || "").trim();
  if (!normalized) {
    throw new QuickEditError("path is required", 400);
  }
  const page = (discoveryPages || []).find((item) => item.pageDirectory === normalized);
  if (!page) {
    throw new QuickEditError("Unknown page directory", 404);
  }
  return page;
}

function getAllSourceFiles(dirPath) {
  let files = [];
  if (!existsSync(dirPath)) {
    return files;
  }
  for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllSourceFiles(fullPath));
    } else if (entry.isFile() && TARGET_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

function hackCssPath(rootDir, pageAbsoluteDir) {
  return join(rootDir, pageAbsoluteDir, "hack.css");
}

export function readHackCss(rootDir, page) {
  const file = join(rootDir, page.pageDirectory, "hack.css");
  return existsSync(file) ? readFileSync(file, "utf8") : "";
}

/** 按选择器增量合并 CSS：相同选择器合并属性，新增属性覆盖旧值。移植自 cssUtils.ts 的 mergeCss。 */
export function mergeCss(existingCss, newCss) {
  const parseCss = (css) => {
    const rules = new Map();
    const ruleRegex = /([^{]+)\{([^}]+)\}/g;
    let match;
    while ((match = ruleRegex.exec(css)) !== null) {
      const selector = match[1].trim();
      const declarations = match[2].trim();
      if (!rules.has(selector)) {
        rules.set(selector, new Map());
      }
      const props = rules.get(selector);
      const propRegex = /([^:;]+):([^;]+)/g;
      let propMatch;
      while ((propMatch = propRegex.exec(declarations)) !== null) {
        props.set(propMatch[1].trim(), propMatch[2].trim());
      }
    }
    return rules;
  };

  const serializeCss = (rules) => {
    const lines = [];
    for (const [selector, props] of rules) {
      lines.push(`${selector} {`);
      for (const [property, value] of props) {
        lines.push(`  ${property}: ${value};`);
      }
      lines.push("}\n");
    }
    return lines.join("\n");
  };

  const existingRules = parseCss(existingCss);
  const newRules = parseCss(newCss);

  for (const [selector, newProps] of newRules) {
    if (!existingRules.has(selector)) {
      existingRules.set(selector, newProps);
    } else {
      const existingProps = existingRules.get(selector);
      for (const [property, value] of newProps) {
        existingProps.set(property, value);
      }
    }
  }

  return serializeCss(existingRules);
}

export function saveHackCss(rootDir, page, cssText) {
  const file = hackCssPath(rootDir, page.pageDirectory);
  const existingRaw = existsSync(file) ? readFileSync(file, "utf8") : "";
  // Strip the warning header before parsing — mergeCss's regex has no notion of comments,
  // so leaving it in makes the header text bleed into the first parsed selector on re-save.
  const existing = existingRaw.startsWith(HACK_CSS_WARNING) ? existingRaw.slice(HACK_CSS_WARNING.length) : existingRaw;
  const merged = mergeCss(existing, cssText || "");
  const finalCss = HACK_CSS_WARNING + merged;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, finalCss, "utf8");
  return finalCss;
}

export function clearHackCss(rootDir, page) {
  const file = hackCssPath(rootDir, page.pageDirectory);
  if (existsSync(file)) {
    rmSync(file, { force: true });
  }
}

export function countTextReplacements(rootDir, page, replacements) {
  const dir = join(rootDir, page.pageDirectory);
  const files = getAllSourceFiles(dir);
  let totalCount = 0;

  for (const file of files) {
    const content = readFileSync(file, "utf8");
    for (const { searchText } of replacements) {
      if (!searchText) continue;
      const count = content.split(searchText).length - 1;
      if (count > 0) {
        totalCount += count;
      }
    }
  }

  return totalCount;
}

export function applyTextReplacements(rootDir, page, replacements) {
  const dir = join(rootDir, page.pageDirectory);
  const files = getAllSourceFiles(dir);
  let changedFiles = 0;

  for (const file of files) {
    const content = readFileSync(file, "utf8");
    let nextContent = content;
    let changed = false;

    for (const { searchText, replaceText } of replacements) {
      if (!searchText) continue;
      if (nextContent.includes(searchText)) {
        nextContent = nextContent.split(searchText).join(replaceText);
        changed = true;
      }
    }

    if (changed && nextContent !== content) {
      writeFileSync(file, nextContent, "utf8");
      changedFiles += 1;
    }
  }

  return changedFiles;
}
