import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:6320/?page=src-pages-demo-workbench-index", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  const iframe = page.frameLocator("iframe#page-frame");
  await iframe.locator("[data-zhangtu-requirement-marker='true']").first().click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "/tmp/zhangtu-annotation2.png", fullPage: true });
  await browser.close();
})();
