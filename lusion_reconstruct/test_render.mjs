import { chromium } from "playwright-core";

async function test() {
  const browser = await chromium.launch({
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    args: [
      "--use-gl=angle",
      "--use-angle=d3d11",
      "--enable-webgl",
      "--no-sandbox",
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  const logs = [];
  const errors = [];
  const failedRequests = [];

  page.on("console", (msg) => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
    if (msg.type() === "error") errors.push(msg.text());
  });

  page.on("pageerror", (err) => {
    errors.push(`PageError: ${err.message}`);
  });

  page.on("requestfailed", (req) => {
    failedRequests.push(`${req.url()} (${req.failure()?.errorText})`);
  });

  console.log("Navigating to http://localhost:8888/ ...");
  await page.goto("http://localhost:8888/", { waitUntil: "domcontentloaded" });

  // Wait 6 seconds for preloader, assets, and Three.js initialization
  console.log("Waiting for scene initialization...");
  await page.waitForTimeout(6000);

  const isReady = await page.evaluate(() =>
    document.documentElement.classList.contains("is-ready"),
  );
  const htmlClasses = await page.evaluate(
    () => document.documentElement.className,
  );
  const canvasInfo = await page.evaluate(() => {
    const c = document.getElementById("canvas");
    if (!c) return { exists: false };
    return {
      exists: true,
      width: c.width,
      height: c.height,
      clientWidth: c.clientWidth,
      clientHeight: c.clientHeight,
      display: window.getComputedStyle(c).display,
    };
  });

  console.log("document.className:", htmlClasses);
  console.log("is-ready class present:", isReady);
  console.log("Canvas info:", canvasInfo);
  console.log("Console logs count:", logs.length);
  if (logs.length > 0) {
    console.log("Sample logs (last 5):", logs.slice(-5));
  }
  console.log("Console errors count:", errors.length);
  if (errors.length > 0) {
    console.log("Errors:", errors);
  }
  console.log("Failed requests count:", failedRequests.length);
  if (failedRequests.length > 0) {
    console.log("Failed requests:", failedRequests);
  }

  // Take screenshot
  const screenshotPath = "d:/00_CODING/rea/lusion_reconstruct/screenshot.png";
  await page.screenshot({ path: screenshotPath });
  console.log("Screenshot saved to", screenshotPath);

  await browser.close();
  console.log("Test completed successfully!");
}

test().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
