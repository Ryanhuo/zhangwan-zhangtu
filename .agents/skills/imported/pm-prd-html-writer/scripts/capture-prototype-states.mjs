#!/usr/bin/env node
/**
 * 截取管理模式原型各功能模块、各状态页面截图。
 * 用法: node capture-prototype-states.mjs [--url http://127.0.0.1:51721/prototypes/management-mode/]
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { COLORS, logError, logInfo, logSuccess, parseCommonArgs, REPO_ROOT } from './_utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_OUT = path.join(REPO_ROOT, 'src/docs/assets/screenshots/management-mode');
const DEV_INFO = path.join(REPO_ROOT, '.axhub/make/.dev-server-info.json');

function resolveBaseUrl(flags) {
  if (flags.url) return flags.url;
  if (fs.existsSync(DEV_INFO)) {
    try {
      const info = JSON.parse(fs.readFileSync(DEV_INFO, 'utf8'));
      if (info.port) return `http://127.0.0.1:${info.port}/prototypes/management-mode/`;
    } catch {
      /* ignore */
    }
  }
  return 'http://127.0.0.1:51721/prototypes/management-mode/';
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function shot(page, filePath, locator) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  if (locator) {
    const el = page.locator(locator).first();
    await el.waitFor({ state: 'visible', timeout: 15000 });
    await el.screenshot({ path: filePath });
  } else {
    await page.screenshot({ path: filePath, fullPage: false });
  }
  logSuccess(filePath);
}

async function selectAlarm(page, locationSnippet, typeSnippet) {
  let card = page.locator('.mm-alarm-card').filter({ hasText: locationSnippet });
  if (typeSnippet) {
    card = card.filter({ hasText: typeSnippet });
  }
  await card.first().waitFor({ state: 'visible', timeout: 10000 });
  await card.first().click();
  await sleep(400);
}

async function reloadPrototype(page) {
  await page.reload({ waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('.mm-page', { timeout: 30000 });
  await sleep(1200);
}

async function waitForNotice(page, modifier, timeoutMs = 15000) {
  await page.waitForSelector(`.mm-compare-notice--${modifier}`, { timeout: timeoutMs });
  await sleep(500);
}

async function clickFirstThumb(page) {
  const thumb = page.locator('.mm-media-content--images .mm-media-thumb').first();
  await thumb.waitFor({ state: 'visible', timeout: 10000 });
  await thumb.click();
  await page.locator('.mm-compare-modal-inner').waitFor({ state: 'visible', timeout: 5000 });
}

async function closeModal(page) {
  const close = page.locator('.mm-compare-close');
  if (await close.isVisible()) {
    await close.click();
    await sleep(300);
  }
}

async function setRole(page, roleLabel) {
  const item = page.locator('.mm-role-switch .ant-segmented-item').filter({ hasText: roleLabel });
  await item.first().click();
  await sleep(400);
}

async function main() {
  const { flags } = parseCommonArgs(process.argv);
  const baseUrl = resolveBaseUrl(flags);
  const outDir = flags.output ? path.resolve(flags.output) : DEFAULT_OUT;

  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    logError('请先安装 Playwright: npm install playwright && npx playwright install chromium');
    process.exit(1);
  }

  logInfo(`目标 URL: ${baseUrl}`);
  logInfo(`输出目录: ${outDir}`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--allow-file-access-from-files'],
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });

  try {
    await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForSelector('.mm-page', { timeout: 30000 });
    await sleep(1500);

    // 全页
    await shot(page, path.join(outDir, '../management-mode-fullpage.png'), '.mm-page');
    await shot(page, path.join(REPO_ROOT, 'src/docs/assets/screenshots/fullpage.png'), '.mm-page');

    // 3.1 顶栏
    await shot(page, path.join(outDir, '31-nav.png'), '.mm-header');

    // 3.2 左侧列表（含选中态）
    await shot(page, path.join(outDir, '32-list-selected.png'), '.mm-sidebar');

    // 3.3 详情标题区
    await shot(page, path.join(outDir, '33-detail-header.png'), '.mm-detail-header');

    // 3.4 实时视频空态
    await shot(page, path.join(outDir, '34-video-empty.png'), '.mm-media-panel >> nth=0');

    // 3.6 录像回放空态
    await shot(page, path.join(outDir, '36-replay-empty.png'), '.mm-media-panel >> nth=2');

    // 3.7 关联报警表（A-002 有数据）
    await selectAlarm(page, 'K2253+289', '施工');
    await shot(page, path.join(outDir, '37-related-table.png'), '.mm-related-section');

    // 3.8 底部按钮
    await shot(page, path.join(outDir, '38-action-buttons.png'), '.mm-action-bar');

    // 3.5 图像增强各状态（干净会话）
    await reloadPrototype(page);

    await selectAlarm(page, 'K3632+706');
    await shot(page, path.join(outDir, '35-thumb-idle.png'), '.mm-media-content--images');

    await selectAlarm(page, 'K980+456');
    await shot(page, path.join(outDir, '35-thumb-ready.png'), '.mm-media-content--images');

    // 并发超限：先占满 3 路 generating，再打开第 4 路 idle 图片
    await selectAlarm(page, 'K3632+706');
    await clickFirstThumb(page);
    await closeModal(page);
    await selectAlarm(page, 'K1890+120');
    await clickFirstThumb(page);
    await closeModal(page);
    await selectAlarm(page, 'K1567+890');
    await clickFirstThumb(page);
    await closeModal(page);
    await selectAlarm(page, 'K2253+289', '驶离');
    await clickFirstThumb(page);
    await waitForNotice(page, 'warning', 5000);
    await shot(page, path.join(outDir, '35-rate-limit-warning.png'), '.mm-compare-modal-inner');
    await closeModal(page);

    await reloadPrototype(page);

    // 缩略图 generating 角标
    await selectAlarm(page, 'K1890+120');
    await clickFirstThumb(page);
    await sleep(1200);
    await shot(page, path.join(outDir, '35-modal-generating.png'), '.mm-compare-modal-inner');
    await closeModal(page);
    await sleep(300);
    await shot(page, path.join(outDir, '35-thumb-generating.png'), '.mm-media-content--images');

    // 弹窗 success（保持弹窗打开直至 generating→ready）
    await selectAlarm(page, 'K1567+890');
    await clickFirstThumb(page);
    await waitForNotice(page, 'success', 8000);
    await shot(page, path.join(outDir, '35-modal-success.png'), '.mm-compare-modal-inner');
    await closeModal(page);

    // 弹窗 failed（A-002 demoFailOnce 约 8s）
    await selectAlarm(page, 'K2253+289', '施工');
    await clickFirstThumb(page);
    await waitForNotice(page, 'error', 15000);
    await shot(page, path.join(outDir, '35-modal-failed.png'), '.mm-compare-modal-inner');

    await page.locator('.mm-compare-tab--enhanced').click({ force: true });
    await sleep(400);
    await shot(page, path.join(outDir, '35-modal-failed-tab-hint.png'), '.mm-compare-modal-inner');

    await page.locator('button.mm-compare-regenerate').click();
    await waitForNotice(page, 'success', 8000);
    await shot(page, path.join(outDir, '35-modal-regenerate-success.png'), '.mm-compare-modal-inner');
    await closeModal(page);

    // 只读用户
    await setRole(page, '只读');
    await selectAlarm(page, 'K980+456');
    await clickFirstThumb(page);
    await sleep(800);
    await shot(page, path.join(outDir, '35-readonly-enhanced-tab.png'), '.mm-compare-modal-inner');
    await closeModal(page);

    await selectAlarm(page, 'K3632+706');
    await clickFirstThumb(page);
    await sleep(600);
    await shot(page, path.join(outDir, '35-readonly-original-only.png'), '.mm-compare-modal-inner');

    logSuccess(`共输出至 ${outDir}`);
  } catch (err) {
    logError(err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
