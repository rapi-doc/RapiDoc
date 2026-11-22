// V3 of the home page plan (home-page-content-plan.md): one spec through the whole API lifecycle, a
// blueprint like the RapiDoc Mini hero. Six stages, each a node with its product's icon (the same
// Phosphor icon as the Products menu), its name and one short note on a leader. Static.
//
//   home-lifecycle.svg       wide, for desktop
//   home-lifecycle-tall.svg  the same, top to bottom, for phones (swapped with <picture>)
//
//   node sites/rapidoc/scripts/home-lifecycle.mjs

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { C, esc, svg, timeline } from "./illustration-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "../public/assets/images/home");
mkdirSync(OUT, { recursive: true });

const LINE = "rgba(226,232,240,0.55)"; // the frame and leaders, as on a drawing
const NOTE = "#fcd9a0"; // notes: a paler amber than the nodes
const BAR = "rgba(148,163,184,0.22)"; // text, drawn as bars

// A Phosphor duotone icon, inlined at (x, y), size s
const ICONS = resolve(
  dirname(createRequire(join(HERE, "../package.json")).resolve("@phosphor-icons/core")),
  "../assets/duotone",
);
const icon = (name, x, y, s, color = C.amber) => {
  const inner = readFileSync(join(ICONS, `${name}-duotone.svg`), "utf8")
    .replace(/^<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "");
  return `<svg x="${x}" y="${y}" width="${s}" height="${s}" viewBox="0 0 256 256" fill="${color}">${inner}</svg>`;
};

const stages = [
  { stage: "Check", product: "RapiDoc CLI", icon: "terminal", note: "validate · lint · bundle" },
  { stage: "Mock", product: "RapiMock", icon: "hard-drives", note: "state · scopes · checks" },
  { stage: "Document", product: "RapiDoc · Mini · RapiPdf", icon: "file-code", note: "reference · embed · PDF" },
  { stage: "Explain", product: "RapiFlow", icon: "path", note: "Arazzo, runnable" },
  { stage: "Publish", product: "RapiDoc Portal", icon: "layout", note: "SSO · search · static" },
  { stage: "Automate", product: "MCP Server", icon: "robot", note: "tools for AI agents" },
];

const bar = (x, y, w, h = 5, fill = BAR) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}"/>`;

// The spec: a page with a folded corner, its name, and lines as bars
function spec(x, y) {
  const w = 104;
  const h = 128;
  const f = 18; // the fold
  return `
<path d="M${x} ${y + 6}a6 6 0 0 1 6 -6H${x + w - f}L${x + w} ${y + f}V${y + h - 6}a6 6 0 0 1 -6 6H${x + 6}a6 6 0 0 1 -6 -6Z" fill="#0a0f1c" stroke="${LINE}" stroke-width="1.4"/>
<path d="M${x + w - f} ${y}V${y + f}H${x + w}" fill="none" stroke="${LINE}" stroke-width="1.4"/>
<text x="${x + 12}" y="${y + 26}" font-size="10.5" fill="${C.amber}" class="mono">openapi.yaml</text>
${bar(x + 12, y + 40, 44)}${bar(x + 20, y + 52, 60)}${bar(x + 20, y + 64, 48)}${bar(x + 12, y + 76, 36)}${bar(x + 20, y + 88, 56)}
<text x="${x + 12}" y="${y + 115}" font-size="9.5" fill="${C.muted}" class="mono">+ arazzo.yaml</text>`;
}

// A stage's node: a rounded square with the icon
const NODE = 60;
const node = (cx, cy, s) =>
  `<rect x="${cx - NODE / 2}" y="${cy - NODE / 2}" width="${NODE}" height="${NODE}" rx="12" fill="${C.node}" stroke="${C.amber}" stroke-opacity=".55" stroke-width="1.4"/>
${icon(s.icon, cx - 15, cy - 15, 30)}`;
const dot = (x, y, color = LINE) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${color}"/>`;
const arrow = (x1, y1, x2, y2) =>
  `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${LINE}" stroke-opacity=".7" stroke-width="1.2" marker-end="url(#ah)"/>`;

const DESC =
  "One OpenAPI spec, with an Arazzo file beside it, through six stages: Check with the RapiDoc CLI (validate, lint, bundle); Mock with RapiMock (state, scopes, checks); Document with RapiDoc, RapiDoc Mini and RapiPdf (reference, embed, PDF); Explain with RapiFlow (Arazzo, runnable); Publish with RapiDoc Portal (SSO, search, static); Automate with the MCP Server (tools for AI agents).";

/* Wide: the spec at the left, the stages along one line */
function wide() {
  const W = 1200;
  const H = 260;
  const Y = 118; // the line through the nodes
  const cx = (i) => 232 + i * 176;
  const body = `
${spec(32, Y - 64)}
${arrow(140, Y, cx(0) - NODE / 2 - 4, Y)}
${stages
  .map((s, i) => {
    const x = cx(i);
    const link = i < stages.length - 1 ? arrow(x + NODE / 2 + 4, Y, cx(i + 1) - NODE / 2 - 4, Y) : "";
    return `
<text x="${x}" y="${Y - NODE / 2 - 16}" font-size="10.5" fill="${C.muted}" text-anchor="middle" letter-spacing=".12em" class="mono">${String(i + 1).padStart(2, "0")} ${s.stage.toUpperCase()}</text>
${node(x, Y, s)}
${link}
${dot(x, Y + NODE / 2 + 4, NOTE)}<path d="M${x} ${Y + NODE / 2 + 4}V${Y + NODE / 2 + 24}" stroke="${NOTE}" stroke-opacity=".7"/>
<text x="${x}" y="${Y + NODE / 2 + 44}" font-size="14" font-weight="600" fill="${C.text}" text-anchor="middle">${esc(s.product)}</text>
<text x="${x}" y="${Y + NODE / 2 + 64}" font-size="11" fill="${NOTE}" text-anchor="middle" class="mono">${esc(s.note)}</text>`;
  })
  .join("")}`;
  return svg(W, H, "One spec, the whole lifecycle", DESC, timeline(1), body, "", { framed: false });
}

/* Tall: the spec on top, the stages down the left, their words to the right */
function tall() {
  const W = 360;
  const X = 54; // the line through the nodes
  const top = 190;
  const STEP = 104;
  const cy = (i) => top + i * STEP;
  const H = cy(stages.length - 1) + NODE / 2 + 24;
  const body = `
${spec(X - 50, 14)}
${arrow(X, 146, X, cy(0) - NODE / 2 - 4)}
${stages
  .map((s, i) => {
    const y = cy(i);
    const link = i < stages.length - 1 ? arrow(X, y + NODE / 2 + 4, X, cy(i + 1) - NODE / 2 - 4) : "";
    const tx = X + NODE / 2 + 30;
    return `
${node(X, y, s)}
${link}
${dot(X + NODE / 2 + 4, y, NOTE)}<path d="M${X + NODE / 2 + 4} ${y}H${tx - 8}" stroke="${NOTE}" stroke-opacity=".7"/>
<text x="${tx}" y="${y - 16}" font-size="10" fill="${C.muted}" letter-spacing=".12em" class="mono">${String(i + 1).padStart(2, "0")} ${s.stage.toUpperCase()}</text>
<text x="${tx}" y="${y + 5}" font-size="15" font-weight="600" fill="${C.text}">${esc(s.product)}</text>
<text x="${tx}" y="${y + 24}" font-size="11.5" fill="${NOTE}" class="mono">${esc(s.note)}</text>`;
  })
  .join("")}`;
  return svg(W, H, "One spec, the whole lifecycle", DESC, timeline(1), body, "", { framed: false });
}

for (const [name, make] of [
  ["home-lifecycle.svg", wide],
  ["home-lifecycle-tall.svg", tall],
]) {
  const out = make();
  writeFileSync(join(OUT, name), out);
  console.log(`${name}  ${(out.length / 1024).toFixed(1)} KB`);
}
