// V4 of the home page plan (home-page-content-plan.md): a 2:1 thumbnail for each product's card on the
// home page, a close crop of one part of that product page's own image (so the card stays calm), into
// public/assets/images/home/thumbs/*.webp.
//
//   node sites/rapidoc/scripts/home-thumbs.mjs
//
// Rendered in headless Chrome (found as the perf tests find it, or set CHROME_PATH), so text in the SVGs
// comes out as on the site. An animated SVG is stopped at a chosen moment of its loop: six moving
// thumbnails would be too busy; the product page has it moving. Each image sits on the card's navy, at
// twice the pixels for sharp screens.

import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import sharp from "sharp";

const HERE = dirname(fileURLToPath(import.meta.url));
const IMAGES = join(HERE, "../public/assets/images");
const OUT = join(IMAGES, "home/thumbs");
const NAVY = "#0b1120";
const W = 640; // the thumbnail, in CSS pixels; 2:1
const H = 320;

// Each thumbnail: its source, the part of it to show (x, y, width in the source's own pixels; the height
// follows from 2:1), and for an animated SVG the moment of its loop to show (0 to 1). One part each: the
// sidebar and the operation, the Mini card, two workflow steps, the page spread, the server answering, the
// portal's window.
const thumbs = [
  { name: "rapidoc", src: "RapidocDarkScreenShot.png", crop: [0, 0, 2300] },
  { name: "rapidoc-mini", src: "rapidoc-mini/mini-anatomy.svg", crop: [70, 300, 480] },
  { name: "rapi-flow", src: "rapi-flow/workflow-run.svg", crop: [30, 84, 640], at: 0.88 },
  { name: "rapipdf", src: "rapipdf/rapipdf-stack.webp", crop: [-160, -10, 2040] },
  // the frontend's POST just answered 201
  { name: "rapi-mock", src: "rapi-mock/mock-server.svg", crop: [110, 70, 470], at: 0.215 },
  // the portal's window up, its Billing API locked
  { name: "rapi-portal", src: "rapi-portal/portal-build.svg", crop: [340, 6, 420], at: 0.85 },
];

const chrome =
  process.env.CHROME_PATH ||
  [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].find((p) => existsSync(p));
if (!chrome) throw new Error("No Chrome found: set CHROME_PATH");

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: chrome });
try {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  for (const { name, src, crop, at } of thumbs) {
    const [cx, cy, cw] = crop;
    const scale = W / cw; // source pixels to thumbnail pixels
    const file = join(IMAGES, src);
    let content;
    if (src.endsWith(".svg")) {
      const svg = readFileSync(file, "utf8");
      const width = Number(/width="([\d.]+)"/.exec(svg)[1]);
      content = `<div style="width:${width}px;transform-origin:0 0;transform:scale(${scale}) translate(${-cx}px,${-cy}px)">${svg}</div>`;
    } else {
      const { width } = await sharp(file).metadata();
      const data = `data:image/${src.endsWith(".png") ? "png" : "webp"};base64,${readFileSync(file).toString("base64")}`;
      content = `<img src="${data}" style="display:block;width:${width}px;transform-origin:0 0;transform:scale(${scale}) translate(${-cx}px,${-cy}px)">`;
    }
    await page.setContent(
      `<html><body style="margin:0;background:${NAVY};overflow:hidden;width:${W}px;height:${H}px">${content}</body></html>`,
      { waitUntil: "load" },
    );
    // An animated SVG, stopped at its moment: every animation of the loop's length paused there
    if (at !== undefined)
      await page.evaluate((f) => {
        const all = document.getAnimations();
        const loop = Math.max(...all.map((a) => a.effect.getTiming().duration));
        for (const a of all) {
          a.pause();
          if (a.effect.getTiming().duration === loop) a.currentTime = f * loop;
        }
      }, at);
    await page.waitForTimeout(200);
    const shot = await page.screenshot({ clip: { x: 0, y: 0, width: W, height: H } });
    const out = join(OUT, `${name}.webp`);
    const info = await sharp(shot).webp({ quality: 82, effort: 6 }).toFile(out);
    console.log(`thumbs/${name}.webp  ${(info.size / 1024).toFixed(1)} KB`);
  }
} finally {
  await browser.close();
}
