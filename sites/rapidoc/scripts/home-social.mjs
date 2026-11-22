// V7 of the home page plan (home-page-content-plan.md): the home page's social card, 1200x630, for
// og:image and twitter:image. The RapiDoc lockup, the headline, and the hero's family (V1,
// home-family.svg) stopped where all six products are lit.
//
//   node sites/rapidoc/scripts/home-social.mjs   -> public/assets/images/home/rapidoc-social.png
//
// Rendered in headless Chrome (CHROME_PATH, or the usual places) with Inter from Google Fonts, as the
// site loads it; run home-illustrations.mjs first if the hero changed.

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import sharp from "sharp";

const HERE = dirname(fileURLToPath(import.meta.url));
const IMAGES = join(HERE, "../public/assets/images");
const OUT = join(IMAGES, "home/rapidoc-social.png");
const W = 1200;
const H = 630;
const ALL_LIT = 0.88; // the moment of home-family.svg's loop with all six lit

const lockup = readFileSync(join(HERE, "../../../brand/rapidoc-lockup-dark.svg"), "utf8");
const family = readFileSync(join(IMAGES, "home/home-family.svg"), "utf8");

const html = `<!doctype html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700;800&family=JetBrains+Mono:wght@500&display=block" rel="stylesheet">
<style>
  body { margin: 0; width: ${W}px; height: ${H}px; overflow: hidden; font-family: Inter, sans-serif;
    background: radial-gradient(ellipse 60% 70% at 78% 52%, rgba(246,168,33,0.10), transparent 70%), #060913; color: #f1f5f9; }
  .copy { position: absolute; left: 72px; top: 0; bottom: 0; width: 560px; display: flex; flex-direction: column; justify-content: center; }
  .logo svg { display: block; height: 52px; width: auto; }
  .badge { margin-top: 40px; align-self: flex-start; padding: 7px 14px; border-radius: 999px; font: 500 16px 'JetBrains Mono', monospace;
    color: #f8bd55; background: rgba(246,168,33,0.10); border: 1px solid rgba(246,168,33,0.30); }
  h1 { margin: 22px 0 0; font-size: 66px; line-height: 1.05; font-weight: 800; letter-spacing: -0.02em; }
  h1 span { background: linear-gradient(135deg, #f8bd55 0%, #f6a821 50%, #e0950f 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .url { margin-top: 30px; font: 500 20px 'JetBrains Mono', monospace; color: #94a3b8; }
  .art { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); width: 600px; }
  .art svg { display: block; width: 100%; height: auto; }
</style></head><body>
<div class="copy">
  <div class="logo">${lockup}</div>
  <div class="badge">MIT licensed · Every feature free</div>
  <h1>The Complete OpenAPI Toolkit. <span>Free. All of&nbsp;It.</span></h1>
  <div class="url">rapidocui.com</div>
</div>
<div class="art">${family}</div>
</body></html>`;

const chrome =
  process.env.CHROME_PATH ||
  [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].find((p) => existsSync(p));
if (!chrome) throw new Error("No Chrome found: set CHROME_PATH");

const browser = await chromium.launch({ executablePath: chrome });
try {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // The family, stopped with all six lit: every animation of the loop's length paused there
  await page.evaluate((f) => {
    const all = document.getAnimations();
    const loop = Math.max(...all.map((a) => a.effect.getTiming().duration));
    for (const a of all) {
      a.pause();
      if (a.effect.getTiming().duration === loop) a.currentTime = f * loop;
    }
  }, ALL_LIT);
  await page.waitForTimeout(200);
  const shot = await page.screenshot({ clip: { x: 0, y: 0, width: W, height: H } });
  const info = await sharp(shot).png({ palette: true, quality: 90, effort: 10 }).toFile(OUT);
  console.log(`home/rapidoc-social.png  ${(info.size / 1024).toFixed(1)} KB`);
} finally {
  await browser.close();
}
