// Captures the Mock UI's Dashboard for the RapiMock feature page (pages/rapi-mock.astro) as
// public/assets/images/rapi-mock/mock-ui-dashboard.png, at twice the pixels for sharp screens.
//
// It is the RapiMock site's spec check opened on its example spec, City Library
// (sites/rapi-mock/spec-check/example.yaml): what the page's "Try It on a Spec" button opens.
//
//   npm run dev:mock-site                                # the RapiMock site on port 4327, spec check built
//   node sites/rapidoc/scripts/capture-mock-ui.mjs       # in another terminal
//
// The capture is the real UI. Only --surface, the one color its surfaces are mixed from
// (packages/rapidoc-mock/ui/styles/tokens.js), is set to the site's navy, so the picture sits on
// the page's background. Chrome is found as the perf tests find it, or set CHROME_PATH.

import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const SITE = process.argv[2] || "http://localhost:4327";
const URL = `${SITE}/spec-check/index.html?url=${encodeURIComponent(`${SITE}/spec-check/example.yaml`)}`;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "../public/assets/images/rapi-mock");
const NAVY = "#0b1120";

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
  });
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForSelector("rapidoc-mock-ui");
  await page.evaluate((navy) => {
    document.documentElement.style.setProperty("--surface", navy);
    document.querySelector("rapidoc-mock-ui").style.setProperty("--surface", navy);
    document.body.style.background = navy;
  }, NAVY);
  // The Dashboard's lint card reads the lint on first view, which takes a moment
  await page.waitForTimeout(2500);
  mkdirSync(OUT, { recursive: true });
  const file = join(OUT, "mock-ui-dashboard.png");
  await page.screenshot({ path: file });
  console.log(file);
} finally {
  await browser.close();
}
