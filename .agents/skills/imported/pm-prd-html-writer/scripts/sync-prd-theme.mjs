#!/usr/bin/env node
/**
 * 将 prd-antd-theme.css 注入 HTML PRD 的 <style> 块。
 * 用法: node sync-prd-theme.mjs [file.html ...]
 * 无参数时同步模板与已知 PRD 文件。
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../../..');
const THEME_CSS = path.join(__dirname, '../references/prd-antd-theme.css');

const DEFAULT_TARGETS = [
  path.join(REPO_ROOT, 'skills/pm-prd-html-writer/references/html-template.html'),
  path.join(REPO_ROOT, 'src/docs/管理模式_PRD_V1.0.html'),
  path.join(REPO_ROOT, 'src/docs/PRD/管理模式/管理模式_PRD_V1.0.html'),
];

function injectTheme(htmlPath, css) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const styleRe = /<style>[\s\S]*?<\/style>/;
  if (!styleRe.test(html)) {
    throw new Error(`未找到 <style> 块: ${htmlPath}`);
  }
  const next = html.replace(styleRe, `<style>\n${css}\n    </style>`);
  if (next === html) return false;
  fs.writeFileSync(htmlPath, next, 'utf8');
  return true;
}

function main() {
  const css = fs.readFileSync(THEME_CSS, 'utf8').trim();
  const targets = process.argv.slice(2).length
    ? process.argv.slice(2).map((p) => path.resolve(p))
    : DEFAULT_TARGETS;

  let ok = 0;
  for (const file of targets) {
    if (!fs.existsSync(file)) {
      console.warn(`跳过（不存在）: ${file}`);
      continue;
    }
    injectTheme(file, css);
    console.log(`已同步主题: ${path.relative(REPO_ROOT, file)}`);
    ok += 1;
  }
  if (!ok) {
    console.error('没有文件被更新');
    process.exit(1);
  }
}

main();
