#!/usr/bin/env node

import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  DEFAULT_DOCS_DIR,
  extractAssetRefs,
  logError,
  logInfo,
  logSuccess,
  logWarn,
  parseCommonArgs,
  readText,
  resolveAssetsDir,
  resolveDocsBase,
} from './_utils.mjs';

function printUsage() {
  console.log(`
用法: node clean-assets.mjs [目标路径] [选项]

选项:
  --dry-run           仅预览将删除的文件，不实际删除
  --keep-version <v>  保留文件名中包含该版本号的资源（如 V1.0）
  --help              显示帮助
`);
}

function listFiles(dir, exts) {
  if (!fs.existsSync(dir)) return [];
  const results = [];

  function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name !== '.gitkeep' && entry.name !== 'README.md') {
        if (!exts || exts.some((ext) => entry.name.toLowerCase().endsWith(ext))) {
          results.push(fullPath);
        }
      }
    }
  }

  walk(dir);
  return results;
}

function collectReferencedAssets(baseDir) {
  const referenced = new Set();
  const htmlFiles = fs.readdirSync(baseDir).filter((name) => name.endsWith('.html'));

  for (const htmlFile of htmlFiles) {
    const htmlPath = path.join(baseDir, htmlFile);
    const html = readText(htmlPath);
    const refs = extractAssetRefs(html, baseDir);
    for (const ref of refs) {
      if (ref.raw.startsWith('assets/') || ref.raw.startsWith('./assets/')) {
        referenced.add(path.normalize(ref.resolved));
      }
    }
  }

  return referenced;
}

function main() {
  const { positional, flags } = parseCommonArgs(process.argv);

  if (flags.help) {
    printUsage();
    process.exit(0);
  }

  const baseDir = resolveDocsBase(positional[0] || DEFAULT_DOCS_DIR);
  const assetsDir = resolveAssetsDir(baseDir);
  const dryRun = Boolean(flags['dry-run']);
  const keepVersion = flags['keep-version'] ? String(flags['keep-version']) : null;

  if (!fs.existsSync(assetsDir)) {
    logInfo('assets 目录不存在，无需清理');
    process.exit(0);
  }

  const referenced = collectReferencedAssets(baseDir);
  const assetFiles = listFiles(assetsDir, ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.html', '.css', '.js']);
  const toDelete = [];

  for (const filePath of assetFiles) {
    const normalized = path.normalize(filePath);
    if (referenced.has(normalized)) continue;
    if (keepVersion && path.basename(filePath).includes(keepVersion)) continue;
    toDelete.push(filePath);
  }

  if (toDelete.length === 0) {
    logSuccess('未发现可清理的孤儿资源');
    process.exit(0);
  }

  logWarn(`发现 ${toDelete.length} 个未被 HTML 引用的资源文件`);
  for (const filePath of toDelete) {
    const rel = path.relative(baseDir, filePath).replace(/\\/g, '/');
    if (dryRun) {
      logInfo(`[dry-run] 将删除: ${rel}`);
    } else {
      fs.unlinkSync(filePath);
      logSuccess(`已删除: ${rel}`);
    }
  }

  if (dryRun) {
    logInfo('预览完成，未实际删除任何文件');
  } else {
    logSuccess(`清理完成，共删除 ${toDelete.length} 个文件`);
  }
}

main();
