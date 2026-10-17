import { chromium } from "playwright-core";

async function capture() {
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

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  await page.goto("http://localhost:8888/", { waitUntil: "domcontentloaded" });

  console.log("Waiting for hero animation to settle...");
  await page.waitForTimeout(7500);

  // 1. Hero Screenshot
  await page.screenshot({
    path: "d:/00_CODING/rea/lusion_reconstruct/screenshot_hero.png",
  });
  console.log("Saved screenshot_hero.png");

  // 2. Open Menu
  console.log("Clicking Menu button...");
  await page.click("#header-right-menu-btn");
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: "d:/00_CODING/rea/lusion_reconstruct/screenshot_menu.png",
  });
  console.log("Saved screenshot_menu.png");

  // Close Menu
  await page.click("#header-right-menu-btn");
  await page.waitForTimeout(800);

  // 3. Scroll to Reel section
  console.log("Scrolling to Reel section...");
  await page.evaluate(() => {
    const el = document.getElementById("home-reel");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: "d:/00_CODING/rea/lusion_reconstruct/screenshot_reel.png",
  });
  console.log("Saved screenshot_reel.png");

  // 4. Scroll to Featured Projects section
  console.log("Scrolling to Featured Work...");
  await page.evaluate(() => {
    const el = document.getElementById("home-featured");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: "d:/00_CODING/rea/lusion_reconstruct/screenshot_featured.png",
  });
  console.log("Saved screenshot_featured.png");

  await browser.close();
  console.log("All screenshots captured successfully!");
}

capture().catch(console.error);
