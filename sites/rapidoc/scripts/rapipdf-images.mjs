// Makes the static images of the RapiPdf feature page (pages/rapipdf.astro) into
// public/assets/images/rapipdf/, from real PDFs of the Petstore spec made with rapipdf/node:
//
//   rapipdf-stack.webp         the hero: the cover, the contents and an operation page, fanned out
//   rapipdf-schema-object.webp  a request body printed as an indented object (pdf-schema-style="object")
//   rapipdf-schema-table.webp   the same request body as a table (pdf-schema-style="table")
//   rapipdf-brand.webp          a cover and an operation page with a title, colors and a footer of your own
//
// The two fanned images take the site's dark look (back pages dimmed, a fade to navy, an amber glow);
// the schema crops stay plain white, to be read.
//
//   npm run build:rapipdf                                  # rapipdf/node (dist/node.js)
//   node sites/rapidoc/scripts/rapipdf-images.mjs
//
// Pages are rendered by macOS's PDFKit (pdf-pages.swift, run with `swift`), so this runs on a Mac.

import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { generatePdf } from "rapipdf/node";
import sharp from "sharp";

const HERE = dirname(fileURLToPath(import.meta.url));
const SPEC = join(HERE, "../public/specs/petstore.yaml");
const OUT = join(HERE, "../public/assets/images/rapipdf");
const WORK = mkdtempSync(join(tmpdir(), "rapipdf-images-"));

// The PDFs, and the pages each image needs (1 is the cover, 2 the contents, 4 the first operation)
const pdfs = {
  default: [{ pdfTitle: "Petstore API" }, [1, 2, 4]],
  table: [{ pdfTitle: "Petstore API", pdfSchemaStyle: "table" }, [4]],
  brand: [
    {
      pdfTitle: "Acme Pet Platform",
      pdfPrimaryColor: "#d97706",
      pdfAlternateColor: "#1e3a8a",
      pdfFooterText: "Acme Corp · Partner edition",
    },
    [1, 4],
  ],
};

const page = {};
for (const [name, [options, pages]] of Object.entries(pdfs)) {
  const file = join(WORK, `${name}.pdf`);
  writeFileSync(file, await generatePdf(SPEC, options));
  execFileSync("swift", [
    join(HERE, "pdf-pages.swift"),
    file,
    join(WORK, name),
    "2",
    ...pages.map(String),
  ]);
  for (const n of pages) page[`${name}-${n}`] = join(WORK, `${name}-${n}.png`);
}

// The look on the site's dark pages: pages at the back dimmed toward the navy (--rd-bg), the one in
// front only a little, each fading into the navy toward its bottom, and an amber glow behind them
const NAVY = "rgb(6,9,19)";
const BACK = { tint: 0.32, fade: 0.85 };
const FRONT = { tint: 0.06, fade: 0.7 };

/** Svg layers over a page: a flat tint of navy, and a fade to navy from 35% of its height down. */
function shading(width, height, { tint, fade }) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
<defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0.35" stop-color="${NAVY}" stop-opacity="0"/><stop offset="1" stop-color="${NAVY}" stop-opacity="${fade}"/></linearGradient></defs>
<rect width="100%" height="100%" fill="${NAVY}" fill-opacity="${tint}"/><rect width="100%" height="100%" fill="url(#f)"/></svg>`);
}

/** A soft amber glow behind the pages, as large as the canvas. */
function glow(width, height) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
<defs><radialGradient id="r" cx="50%" cy="45%" r="50%"><stop offset="0" stop-color="#f6a821" stop-opacity=".35"/><stop offset="1" stop-color="#f6a821" stop-opacity="0"/></radialGradient></defs>
<ellipse cx="${width / 2}" cy="${height * 0.48}" rx="${width * 0.48}" ry="${height * 0.44}" fill="url(#r)"/></svg>`);
}

/** A page at `width`, shaded, turned by `angle` degrees, with a soft shadow: { image, shadow, w, h }. */
async function lift(file, width, angle, look) {
  const plain = await sharp(file).resize(width).toBuffer();
  const { height } = await sharp(plain).metadata();
  const img = await sharp(plain)
    .composite([{ input: shading(width, height, look) }])
    .png()
    .toBuffer();
  const clear = { r: 0, g: 0, b: 0, alpha: 0 };
  const image = await sharp(img).rotate(angle, { background: clear }).png().toBuffer();
  const shade = await sharp({
    create: { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0.55 } },
  })
    .png()
    .toBuffer();
  const shadow = await sharp(shade)
    .rotate(angle, { background: clear })
    .extend({ top: 40, bottom: 40, left: 40, right: 40, background: clear })
    .blur(22)
    .png()
    .toBuffer();
  const meta = await sharp(image).metadata();
  return { image, shadow, w: meta.width, h: meta.height };
}

/** Pages laid over each other on a transparent canvas, back to front; the last one is in front. */
async function fan(width, height, pages, file) {
  const layers = [{ input: glow(width, height), left: 0, top: 0 }];
  for (const [i, p] of pages.entries()) {
    const look = i === pages.length - 1 ? FRONT : BACK;
    const { image, shadow } = await lift(p.file, p.width, p.angle, look);
    layers.push(
      { input: shadow, left: p.x - 40 + 14, top: p.y - 40 + 26 },
      { input: image, left: p.x, top: p.y },
    );
  }
  await sharp({
    create: { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite(layers)
    .webp({ quality: 86, effort: 6 })
    .toFile(join(OUT, file));
  console.log(file);
}

// A spread: the contents at the back left and an operation at the back right, each mostly in view,
// with the cover in front between them
await fan(
  1720,
  1080,
  [
    { file: page["default-2"], width: 560, angle: -6, x: 40, y: 150 },
    { file: page["default-4"], width: 560, angle: 6, x: 1080, y: 150 },
    { file: page["default-1"], width: 600, angle: 0, x: 560, y: 70 },
  ],
  "rapipdf-stack.webp",
);

await fan(
  1300,
  1100,
  [
    { file: page["brand-4"], width: 600, angle: 4, x: 620, y: 110 },
    { file: page["brand-1"], width: 600, angle: -3, x: 80, y: 60 },
  ],
  "rapipdf-brand.webp",
);

// The first request body of the operation page, the same crop in both styles
for (const [name, file] of [
  ["object", page["default-4"]],
  ["table", page["table-4"]],
]) {
  await sharp(file)
    .extract({ left: 50, top: 470, width: 900, height: 520 })
    .webp({ quality: 86, effort: 6 })
    .toFile(join(OUT, `rapipdf-schema-${name}.webp`));
  console.log(`rapipdf-schema-${name}.webp`);
}

rmSync(WORK, { recursive: true, force: true });
