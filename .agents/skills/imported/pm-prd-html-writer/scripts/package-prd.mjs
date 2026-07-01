#!/usr/bin/env node

import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';
import {
  ensureDir,
  extractAssetRefs,
  formatBytes,
  logError,
  logInfo,
  logSuccess,
  parseCommonArgs,
  readText,
  resolveDocsBase,
} from './_utils.mjs';

function printUsage() {
  console.log(`
用法: node package-prd.mjs <html-file-path> [选项]

选项:
  --output, -o <dir>     输出目录（默认: src/docs/_deliverable/）
  --format <zip|dir>     输出格式（默认: dir；zip 在 Windows/macOS/Linux 可用时生成压缩包）
  --timestamp            输出目录/压缩包名追加日期戳
  --include-prototypes   额外复制 assets/prototypes/ 全目录
  --help                 显示帮助
`);
}

function copyFileSafe(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyReferencedAssets(htmlPath, outputDir, includePrototypes) {
  const htmlDir = path.dirname(htmlPath);
  const html = readText(htmlPath);
  const refs = extractAssetRefs(html, htmlDir);
  const copied = new Set();

  for (const ref of refs) {
    if (!fs.existsSync(ref.resolved)) continue;
    if (!ref.raw.includes('assets/')) continue;
    const normalized = ref.raw.replace(/^\.\//, '');
    const target = path.join(outputDir, normalized);
    if (copied.has(target)) continue;
    copyFileSafe(ref.resolved, target);
    copied.add(target);
  }

  if (includePrototypes) {
    const protoDir = path.join(htmlDir, 'assets/prototypes');
    if (fs.existsSync(protoDir)) {
      const targetRoot = path.join(outputDir, 'assets/prototypes');
      copyDirRecursive(protoDir, targetRoot);
    }
  }

  return copied.size;
}

function copyDirRecursive(srcDir, destDir) {
  ensureDir(destDir);
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(src, dest);
    } else {
      copyFileSafe(src, dest);
    }
  }
}

function countFiles(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) count += countFiles(full);
    else count++;
  }
  return count;
}

function dirSize(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) total += dirSize(full);
    else total += fs.statSync(full).size;
  }
  return total;
}

function tryCreateZip(sourceDir, zipPath) {
  if (process.platform === 'win32') {
    execSync(
      `powershell -NoProfile -Command "Compress-Archive -Path '${sourceDir.replace(/'/g, "''")}\\*' -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force"`,
      { stdio: 'inherit' },
    );
    return true;
  }

  try {
    execSync(`tar -czf "${zipPath}" -C "${sourceDir}" .`, { stdio: 'inherit' });
    return true;
  } catch {
    return false;
  }
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

  const htmlDir = resolveDocsBase(htmlPath);
  const baseName = path.basename(htmlPath, '.html');
  const stamp = flags.timestamp ? `_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}` : '';
  const defaultOutput = path.join(htmlDir, '_deliverable');
  const outputRoot = path.resolve(flags.output || flags.o || defaultOutput);
  const bundleDir = path.join(outputRoot, `${baseName}${stamp}`);

  if (fs.existsSync(bundleDir)) {
    fs.rmSync(bundleDir, { recursive: true, force: true });
  }
  ensureDir(bundleDir);

  copyFileSafe(htmlPath, path.join(bundleDir, path.basename(htmlPath)));
  const assetCount = copyReferencedAssets(htmlPath, bundleDir, Boolean(flags['include-prototypes']));

  const readme = `# ${baseName} 交付包

- 生成时间: ${new Date().toISOString()}
- 源文件: ${htmlPath}
- 资源文件数: ${assetCount}

## 使用说明

1. 解压或复制整个目录到目标位置
2. 用浏览器打开主 HTML 文件
3. 离线环境下请确保 \`assets/\` 目录与 HTML 同级引用关系不变
`;

  fs.writeFileSync(path.join(bundleDir, 'README.md'), readme, 'utf8');

  const fileCount = countFiles(bundleDir);
  const totalSize = dirSize(bundleDir);
  let finalPath = bundleDir;

  if (flags.format === 'zip') {
    const zipPath = `${bundleDir}.zip`;
    logInfo('正在创建压缩包...');
    if (tryCreateZip(bundleDir, zipPath)) {
      finalPath = zipPath;
      logSuccess(`压缩包已生成: ${zipPath}`);
    } else {
      logError('压缩包创建失败，已保留目录版交付物');
    }
  }

  console.log('\n✅ 打包成功!\n');
  console.log('📦 交付包信息:');
  console.log(`  - 名称: ${path.basename(finalPath)}`);
  console.log(`  - 大小: ${formatBytes(fs.statSync(finalPath).size || totalSize)}`);
  console.log(`  - 文件数: ${fileCount}`);
  console.log(`  - 输出路径: ${finalPath}`);
}

main();
