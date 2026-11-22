// V5 of the home page plan (home-page-content-plan.md): the receipt beside "What is usually a paid
// extra". A paper till receipt, tilted a little with a soft shadow and fading into the page at the
// bottom, like the RapiPdf pages: every line $0.00. Its items are the section's checklist. Static.
//
//   node sites/rapidoc/scripts/home-receipt.mjs   -> public/assets/images/home/home-receipt.svg

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { C, esc, svg, timeline } from "./illustration-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "../public/assets/images/home");
mkdirSync(OUT, { recursive: true });

const items = [
  "API reference",
  "Mock server",
  "PDF export",
  "Workflows (Arazzo)",
  "Single sign-on",
  "MCP server",
  "Self-hosting, no limits",
];

const W = 440;
const H = 620;
const P = { x: 70, y: 40, w: 300 }; // the paper
const INK = "#1f2937";
const FAINT = "#6b7280";
const L = P.x + 22; // the text's left and right edges
const R = P.x + P.w - 22;

let y = P.y + 44;
const rows = [];
const text = (x, t, { size = 12, anchor = "start", weight = 400, fill = INK, spacing = 0 } = {}) =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${spacing ? ` letter-spacing="${spacing}em"` : ""} class="mono">${esc(t)}</text>`;
const rule = () => {
  rows.push(
    `<line x1="${L}" y1="${y}" x2="${R}" y2="${y}" stroke="${FAINT}" stroke-width="1" stroke-dasharray="3 3"/>`,
  );
};

rows.push(text(P.x + P.w / 2, "RAPIDOC", { size: 17, anchor: "middle", weight: 700, spacing: 0.2 }));
y += 18;
rows.push(text(P.x + P.w / 2, "THE OPEN SOURCE TOOLKIT", { size: 9.5, anchor: "middle", fill: FAINT, spacing: 0.12 }));
y += 14;
rows.push(text(P.x + P.w / 2, "rapidocui.com", { size: 9.5, anchor: "middle", fill: FAINT }));
y += 18;
rule();
y += 24;
for (const item of items) {
  rows.push(text(L, item), text(R, "$0.00", { anchor: "end" }));
  y += 22;
}
y -= 6;
rule();
y += 30;
rows.push(text(L, "TOTAL", { size: 16, weight: 700 }), text(R, "$0.00", { size: 16, weight: 700, anchor: "end" }));
y += 14;
rule();
y += 22;
rows.push(text(P.x + P.w / 2, "MIT LICENSE · NO SUBSCRIPTION", { size: 9.5, anchor: "middle", fill: FAINT, spacing: 0.06 }));
y += 15;
rows.push(text(P.x + P.w / 2, "NO ACCOUNT · NO USAGE LIMITS", { size: 9.5, anchor: "middle", fill: FAINT, spacing: 0.06 }));
y += 20;

// A barcode, the same every time
const bars = [];
let bx = L;
let seed = 7;
while (bx < L + 124) {
  seed = (seed * 9301 + 49297) % 233280;
  const w = 1 + (seed % 3);
  bars.push(`<rect x="${bx}" y="${y}" width="${w}" height="30" fill="${INK}"/>`);
  bx += w + 1 + ((seed >> 3) % 3);
}
y += 30 + 26;

// The paper: a torn (zigzag) bottom edge
const bottom = y;
const zig = [];
for (let x = P.x + P.w, i = 0; x >= P.x; x -= 10, i++) zig.push(`L${x} ${bottom + (i % 2 ? 0 : 7)}`);
const paper = `M${P.x} ${P.y}H${P.x + P.w}V${bottom}${zig.join("")}Z`;

// A stamp beside the barcode: the headline
const stamp = `<g transform="translate(${R - 72} ${bottom - 42}) rotate(-10)" opacity=".9">
<rect x="-72" y="-21" width="144" height="42" rx="6" fill="none" stroke="${C.amber}" stroke-width="2.4"/>
<rect x="-66" y="-15" width="132" height="30" rx="3" fill="none" stroke="${C.amber}" stroke-width="1"/>
<text x="0" y="4.5" font-size="11.5" font-weight="800" fill="${C.amber}" text-anchor="middle" letter-spacing=".06em" class="mono">FREE · ALL OF IT</text>
</g>`;

const body = `
<defs>
<filter id="receiptShadow" x="-30%" y="-20%" width="160%" height="150%"><feGaussianBlur stdDeviation="14"/></filter>
<linearGradient id="paperFade" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#eeede8"/><stop offset=".62" stop-color="#d9dbe0"/><stop offset="1" stop-color="#7d8597"/>
</linearGradient>
<linearGradient id="inkFade" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#fff"/><stop offset=".7" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity=".25"/>
</linearGradient>
<mask id="receiptFade" maskUnits="userSpaceOnUse"><rect x="${P.x - 20}" y="${P.y}" width="${P.w + 40}" height="${bottom - P.y + 10}" fill="url(#inkFade)"/></mask>
</defs>
<g transform="rotate(-3 ${W / 2} ${H / 2})">
<path d="${paper}" transform="translate(10 18)" fill="#000" opacity=".55" filter="url(#receiptShadow)"/>
<g mask="url(#receiptFade)">
<path d="${paper}" fill="url(#paperFade)"/>
${rows.join("\n")}
${bars.join("")}
</g>
${stamp}
</g>`;

const out = svg(
  W,
  bottom + 70,
  "Your bill: $0.00",
  `A till receipt from RapiDoc, the open source toolkit: ${items.join(", ")}, each $0.00. Total $0.00. MIT license, no subscription, no account, no usage limits. Stamped "Free · All of It".`,
  timeline(1),
  body,
  "",
  { framed: false },
);
writeFileSync(join(OUT, "home-receipt.svg"), out);
console.log(`home-receipt.svg  ${(out.length / 1024).toFixed(1)} KB  (${W}x${bottom + 70})`);
