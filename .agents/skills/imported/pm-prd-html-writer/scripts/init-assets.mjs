#!/usr/bin/env node

import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  DEFAULT_DOCS_DIR,
  ensureDir,
  logError,
  logInfo,
  logSuccess,
  parseCommonArgs,
  resolveAssetsDir,
  resolveDocsBase,
  SKILL_ROOT,
  writeGitkeep,
} from './_utils.mjs';

const SUBDIRS = ['screenshots', 'images/ui-mockups', 'images/flowcharts', 'images/icons', 'prototypes', 'scripts'];
const INLINE_EDITOR_SRC = path.join(SKILL_ROOT, '..', 'references', 'assets', 'scripts', 'prd-inline-editor.js');

function printUsage() {
  console.log(`
用法: node init-assets.mjs [目标路径] [选项]

目标路径:
  省略时默认 src/docs/
  可传 HTML 文件路径，将在其同级创建 assets/

选项:
  --only <dirs>   仅创建指定子目录，逗号分隔（如 screenshots,images）
  --force         覆盖已有 README.md
  --help          显示帮助
`);
}

function writeAssetsReadme(assetsDir, force) {
  const readmePath = path.join(assetsDir, 'README.md');
  if (fs.existsSync(readmePath) && !force) {
    return;
  }

  const content = `# HTML PRD 资源目录

本目录存放同文件夹下 HTML PRD 引用的静态资源（\`src/docs/PRD/[文档名称]/assets/\`）。

## 子目录

| 目录 | 用途 |
|------|------|
| \`screenshots/\` | Playwright 自动截图（含按原型分子目录） |
| \`images/\` | 手动补充的 UI 稿、流程图、图标 |
| \`prototypes/\` | 离线交付用的原型快照（export-prototype-for-prd.mjs） |
| \`scripts/\` | 本地 \`mermaid.min.js\`、\`prd-inline-editor.js\` 等脚本 |

## 引用规范

HTML 中统一使用相对路径：

\`\`\`html
<img src="./assets/screenshots/fullpage.png" alt="全页截图">
\`\`\`

详见 \`skills/pm-prd-html-writer/references/asset-management.md\`。
`;

  fs.writeFileSync(readmePath, content, 'utf8');
}

function main() {
  const { positional, flags } = parseCommonArgs(process.argv);

  if (flags.help) {
    printUsage();
    process.exit(0);
  }

  const baseDir = resolveDocsBase(positional[0] || DEFAULT_DOCS_DIR);
  const assetsDir = resolveAssetsDir(baseDir);
  const only = flags.only ? String(flags.only).split(',').map((s) => s.trim()) : null;

  ensureDir(assetsDir);

  const selected = only
    ? SUBDIRS.filter((dir) => only.some((item) => dir === item || dir.startsWith(`${item}/`)))
    : SUBDIRS;

  if (selected.length === 0) {
    logError('没有匹配的子目录可创建，请检查 --only 参数');
    process.exit(1);
  }

  logInfo(`初始化资源目录: ${assetsDir}`);

  for (const subdir of selected) {
    const fullPath = path.join(assetsDir, subdir);
    writeGitkeep(fullPath);
    logSuccess(`创建 ${path.relative(baseDir, fullPath).replace(/\\/g, '/')}`);
  }

  writeAssetsReadme(assetsDir, Boolean(flags.force));

  const scriptsDir = path.join(assetsDir, 'scripts');
  ensureDir(scriptsDir);
  if (fs.existsSync(INLINE_EDITOR_SRC)) {
    const editorDest = path.join(scriptsDir, 'prd-inline-editor.js');
    fs.copyFileSync(INLINE_EDITOR_SRC, editorDest);
    logSuccess(`复制 prd-inline-editor.js -> ${path.relative(baseDir, editorDest).replace(/\\/g, '/')}`);
  } else {
    logError(`未找到内联编辑器源文件: ${INLINE_EDITOR_SRC}`);
  }

  logSuccess('资源目录初始化完成');
}

main();
