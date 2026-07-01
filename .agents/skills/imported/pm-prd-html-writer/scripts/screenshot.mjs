import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(msg, color = 'reset') {
  console.log(`${COLORS[color]}${msg}${COLORS.reset}`);
}

function logSuccess(msg) {
  log(`✓ ${msg}`, 'green');
}

function logError(msg) {
  log(`✗ ${msg}`, 'red');
}

function logInfo(msg) {
  log(`⏳ ${msg}`, 'yellow');
}

async function checkPlaywright() {
  try {
    await import('playwright');
    return true;
  } catch {
    logError('未检测到 Playwright，正在自动安装...');
    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    try {
      execSync(`${npmCmd} install playwright`, { cwd: __dirname, stdio: 'inherit' });
      execSync('npx playwright install chromium', { cwd: __dirname, stdio: 'inherit' });
      logSuccess('Playwright 安装完成');
      return true;
    } catch (e) {
      logError(`安装失败：${e.message}`);
      logInfo(`手动安装命令：cd "${__dirname}" && npm install playwright && npx playwright install chromium`);
      process.exit(1);
    }
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(0);
  }

  const options = {
    htmlFile: null,
    output: './assets/screenshots',
    fullpage: true,
    width: 1920,
    height: 1080,
    type: 'fullpage',
    waitTime: 2000,
    quality: 90,
    format: 'png',
    outputName: 'fullpage',
  };

  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    switch (arg) {
      case '--output':
      case '-o':
        options.output = args[++i];
        break;
      case '--fullpage':
      case '-f':
        options.fullpage = args[++i] !== 'false';
        break;
      case '--width':
        options.width = parseInt(args[++i], 10);
        break;
      case '--height':
        options.height = parseInt(args[++i], 10);
        break;
      case '--type':
        options.type = args[++i];
        break;
      case '--wait-time':
        options.waitTime = parseInt(args[++i], 10);
        break;
      case '--quality':
        options.quality = parseInt(args[++i], 10);
        break;
      case '--format':
        options.format = args[++i];
        break;
      case '--name':
        options.outputName = args[++i];
        break;
      default:
        if (!arg.startsWith('--')) {
          options.htmlFile = arg;
        }
        break;
    }
    i++;
  }

  return options;
}

function printUsage() {
  console.log(`
使用方法: node screenshot.mjs <html-file-path> [选项]

参数:
  <html-file-path>          要截图的 HTML 文件路径（必需）

选项:
  --output, -o <path>       输出目录（默认: ./assets/screenshots）
  --fullpage, -f <bool>     是否全页截图（默认: true）
  --width <px>              视口宽度（默认: 1920）
  --height <px>             视口高度（默认: 1080）
  --type <mode>             截图类型: fullpage | sections | both（默认: fullpage）
  --wait-time <ms>          渲染等待时间毫秒（默认: 2000）
  --quality <0-100>         JPEG 质量（默认: 90，仅 JPEG 格式）
  --format <format>         输出格式: png | jpeg（默认: png）
  --help, -h                显示帮助信息

示例:
  node screenshot.mjs product.html
  node screenshot.mjs product.html -o ./output --format jpeg
  node screenshot.mjs product.html --type sections
  node screenshot.mjs product.html --width 375 --height 812
`);
}

function fileUrl(filePath) {
  const absPath = path.resolve(filePath).replace(/\\/g, '/');
  return `file:///${absPath.startsWith('/') ? '' : '/'}${absPath}`;
}

async function waitForMermaid(page) {
  try {
    await page.waitForSelector('.mermaid svg', { timeout: 5000 });
    logSuccess('Mermaid 图表渲染完成');
  } catch {
    logInfo('未检测到 Mermaid 图表或仍在渲染中');
  }
}

async function captureFullPage(page, outputDir, format, quality, outputName = 'fullpage') {
  const ext = format === 'jpeg' ? '.jpg' : '.png';
  const outputPath = path.join(outputDir, `${outputName}${ext}`);

  await page.screenshot({
    path: outputPath,
    fullPage: true,
    type: format,
    quality: format === 'jpeg' ? quality : undefined,
  });

  return outputPath;
}

async function captureSections(page, outputDir, format, quality) {
  const sections = await page.evaluate(() => {
    const headings = document.querySelectorAll('h1[id], h2[id]');
    return Array.from(headings).map((el) => ({
      id: el.id,
      text: el.textContent.trim(),
      top: el.getBoundingClientRect().top + window.scrollY,
    }));
  });

  if (sections.length === 0) {
    logInfo('未找到可识别的章节标题（h1/h2），将截取全页作为单节');
    const ext = format === 'jpeg' ? '.jpg' : '.png';
    const outputPath = path.join(outputDir, `section-full${ext}`);
    await page.screenshot({
      path: outputPath,
      fullPage: true,
      type: format,
      quality: format === 'jpeg' ? quality : undefined,
    });
    return [outputPath];
  }

  const ext = format === 'jpeg' ? '.jpg' : '.png';
  const results = [];

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const nextTop = i + 1 < sections.length ? sections[i + 1].top : Infinity;

    await page.evaluate(
      ({ top, next }) => {
        window.scrollTo(0, top - 20);
        const el = document.elementFromPoint(window.innerWidth / 2, top);
        if (el) el.scrollIntoView({ block: 'start' });
      },
      { top: section.top, next: nextTop },
    );

    await page.waitForTimeout(300);

    const safeId = section.id.replace(/[^a-zA-Z0-9_-]/g, '_') || `section-${i}`;
    const outputPath = path.join(outputDir, `${safeId}${ext}`);

    try {
      const element = await page.$(`#${CSS.escape(section.id)}`);
      if (element) {
        await element.screenshot({
          path: outputPath,
          type: format,
          quality: format === 'jpeg' ? quality : undefined,
        });
      } else {
        await page.screenshot({
          path: outputPath,
          type: format,
          quality: format === 'jpeg' ? quality : undefined,
        });
      }
      results.push(outputPath);
    } catch (err) {
      logError(`章节 "${section.text}" 截图失败: ${err.message}`);
    }
  }

  return results;
}

async function main() {
  const opts = parseArgs();

  if (!opts.htmlFile) {
    logError('请指定 HTML 文件路径');
    printUsage();
    process.exit(1);
  }

  const isRemoteUrl = /^https?:\/\//i.test(opts.htmlFile);
  const htmlPath = isRemoteUrl ? opts.htmlFile : path.resolve(opts.htmlFile);

  if (!isRemoteUrl && !fs.existsSync(htmlPath)) {
    logError(`文件不存在: ${htmlPath}`);
    process.exit(1);
  }

  const outputDir = path.resolve(opts.output);
  fs.mkdirSync(outputDir, { recursive: true });

  await checkPlaywright();

  const { chromium } = await import('playwright');

  let browser;
  try {
    logSuccess('浏览器启动成功');
    browser = await chromium.launch({
      headless: true,
      args: ['--allow-file-access-from-files', '--disable-web-security'],
    });

    const page = await browser.newPage({
      viewport: { width: opts.width, height: opts.height },
      deviceScaleFactor: 2,
    });

    const url = isRemoteUrl ? htmlPath : fileUrl(htmlPath);
    logSuccess(`正在加载: ${isRemoteUrl ? htmlPath : path.basename(htmlPath)}`);

    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    logInfo('等待页面渲染完成...');
    await page.waitForTimeout(opts.waitTime);
    await waitForMermaid(page);

    const results = [];
    const shouldFullPage = opts.type === 'fullpage' || opts.type === 'both';
    const shouldSections = opts.type === 'sections' || opts.type === 'both';

    if (shouldFullPage) {
      const fp = await captureFullPage(page, outputDir, opts.format, opts.quality, opts.outputName);
      results.push(fp);
      logSuccess(`全页截图已保存: ${fp}`);
    }

    if (shouldSections) {
      logInfo('正在截取分节截图...');
      const secs = await captureSections(page, outputDir, opts.format, opts.quality);
      results.push(...secs);
      for (const s of secs) {
        logSuccess(`分节截图已保存: ${s}`);
      }
    }

    logSuccess(`共生成 ${results.length} 张截图`);
  } catch (err) {
    logError(`执行失败: ${err.message}`);
    process.exit(1);
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}

main();
