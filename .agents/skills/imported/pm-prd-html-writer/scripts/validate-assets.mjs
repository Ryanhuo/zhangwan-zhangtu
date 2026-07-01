#!/usr/bin/env node

import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  extractAssetRefs,
  formatBytes,
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
用法: node validate-assets.mjs <html-file-path> [选项]

选项:
  --require-fullpage   要求存在 assets/screenshots/fullpage.png（默认开启）
  --no-require-fullpage  关闭 fullpage 强制检查
  --help               显示帮助
`);
}

function main() {
  const { positional, flags } = parseCommonArgs(process.argv);

  if (flags.help || positional.length === 0) {
    printUsage();
    process.exit(flags.help ? 0 : 1);
  }

  const htmlPath = path.resolve(positional[0]);
  if (!fs.existsSync(htmlPath)) {
    logError(`HTML 文件不存在: ${htmlPath}`);
    process.exit(1);
  }

  const htmlDir = path.dirname(htmlPath);
  const assetsDir = resolveAssetsDir(htmlDir);
  const html = readText(htmlPath);
  const refs = extractAssetRefs(html, htmlDir);
  const requireFullpage = flags['no-require-fullpage'] ? false : true;

  const errors = [];
  const warnings = [];
  let validCount = 0;

  for (const ref of refs) {
    if (fs.existsSync(ref.resolved)) {
      validCount++;
      const stat = fs.statSync(ref.resolved);
      if (stat.size > 5 * 1024 * 1024) {
        warnings.push(`文件过大: ${ref.raw} (${formatBytes(stat.size)})`);
      }
      if (stat.size < 1024 && /\.(png|jpe?g|svg|gif|webp)$/i.test(ref.raw)) {
        warnings.push(`图片可能异常过小: ${ref.raw} (${formatBytes(stat.size)})`);
      }
    } else {
      warnings.push(`引用不存在: ${ref.raw}`);
    }
  }

  if (requireFullpage) {
    const fullpageCandidates = [
      path.join(assetsDir, 'screenshots/fullpage.png'),
      path.join(assetsDir, 'screenshots/fullpage.jpg'),
    ];
    if (!fullpageCandidates.some((p) => fs.existsSync(p))) {
      const hasAnyScreenshot = refs.some((ref) => ref.raw.includes('assets/screenshots/') && fs.existsSync(ref.resolved));
      if (!hasAnyScreenshot) {
        errors.push('缺少必需截图: assets/screenshots/fullpage.png（或未引用任何有效截图）');
      } else {
        warnings.push('未找到 fullpage.png，但 HTML 已引用其它截图');
      }
    }
  }

  const hasMermaid = html.includes('class="mermaid"') || html.includes("class='mermaid'");
  if (hasMermaid && !html.includes('mermaid')) {
    warnings.push('检测到 .mermaid 容器，但未发现 mermaid 脚本引用');
  }

  console.log('');
  if (errors.length === 0) {
    logSuccess(`验证通过: ${htmlPath}`);
  } else {
    logError(`验证失败: ${htmlPath}`);
  }

  console.log('\n📊 统计信息:');
  console.log(`  - 总引用数: ${refs.length}`);
  console.log(`  - 有效引用: ${validCount}`);
  console.log(`  - 缺失引用: ${refs.length - validCount}`);
  console.log(`  - 警告项: ${warnings.length}`);

  if (errors.length > 0) {
    console.log('\n❌ 错误详情:');
    for (const item of errors) {
      console.log(`  [严重] ${item}`);
    }
  }

  if (warnings.length > 0) {
    console.log('\n🟡 警告详情:');
    for (const item of warnings) {
      console.log(`  [警告] ${item}`);
    }
  }

  process.exit(errors.length > 0 ? 1 : 0);
}

main();
