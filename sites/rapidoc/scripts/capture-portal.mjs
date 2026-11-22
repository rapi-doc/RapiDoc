// Captures Rapid Parcels, the RapiDoc Portal demo (https://parcels.rapidocui.com, its source in the
// rapi-portal-demo repository), for the RapiDoc Portal feature page (pages/portal.astro) as
// public/assets/images/rapi-portal/portal-demo.webp, at twice the pixels for sharp screens: the page
// the feature page's demo section links to.
//
//   node sites/rapidoc/scripts/capture-portal.mjs [address]
//
// The capture is the live page in its dark theme, signed out, as is. Chrome is found as the perf
// tests find it, or set CHROME_PATH.

import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import sharp from "sharp";

const URL = process.argv[2] || "https://parcels.rapidocui.com/";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "../public/assets/images/rapi-portal");

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
  const page = await browser.newPage({
    viewport: { width: 1360, height: 820 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  await page.goto(URL, { waitUntil: "load" });
  // the hero animates in
  await page.waitForTimeout(3500);
  mkdirSync(OUT, { recursive: true });
  // WebP at quality 82: a seventh of the PNG's size, with no visible loss at this size
  const file = join(OUT, "portal-demo.webp");
  await sharp(await page.screenshot())
    .webp({ quality: 82, effort: 6 })
    .toFile(file);
  console.log(file);
} finally {
  await browser.close();
}
