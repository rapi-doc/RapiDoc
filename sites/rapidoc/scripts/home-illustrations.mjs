// Generates the illustrations of rapidocui.com's home page (pages/index.astro) into
// public/assets/images/home/, with the building blocks of illustration-kit.mjs. The plan they follow is
// home-page-content-plan.md (Visuals) at the repository's root.
//
//   node sites/rapidoc/scripts/home-illustrations.mjs
//
//   home-family.svg   V1, the hero: one spec in the middle of a slab, the six products around it; a packet
//                     goes to each in turn and lights it, then all six glow under "MIT · $0 · every feature"

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  C,
  METHOD,
  faceMatrix,
  iso,
  isoBox,
  packet,
  pts,
  round2,
  svg,
  timeline,
  travel,
} from "./illustration-kit.mjs";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "../public/assets/images/home");

/** Bars standing for text, in a face's own coordinates. */
const bar = (x, y, w, h = 3, fill = "rgba(148,163,184,0.35)") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}"/>`;

const SHEET = { top: "#e8edf5", left: "#aab4c4", right: "#8f9aab", stroke: "rgba(0,0,0,0.15)" };
const DARK = { top: "#1b2640", left: "#131c31", right: "#0d1527" };

/* ------------------------------------------------------------------------------------------ */
/* V1. The family on one slab                                                                  */
/* ------------------------------------------------------------------------------------------ */

function family() {
  const t = timeline(16);
  const END = 94;
  const W = 760;
  const H = 610;
  const P = 460;
  const CENTER = [230, 230];
  const PLINTH = { x: 195, y: 195, w: 70, d: 70, h: 26 };
  const ALL = 80; // every station lit, and the closing tag

  // The stations around the spec, each a shape of its own; `at` is the station's centre on the slab
  // Stations placed by where they appear: (u, v) is the offset on screen from the spec, in the
  // projection's units; atScreen turns it back into a place on the slab. Evenly round the spec, with a
  // gap above it for its tags.
  const atScreen = (u, v) => {
    const a = u / (0.866 * 0.78);
    const b = v / (0.5 * 0.78);
    return [CENTER[0] + (a + b) / 2, CENTER[1] + (b - a) / 2];
  };
  const stations = [
    {
      name: "RapiDoc",
      tag: "<rapi-doc>",
      at: atScreen(-150, -55),
      draw: rapidoc,
      side: -1,
      rise: 40,
    },
    {
      name: "RapiMock",
      tag: "rapidoc mock",
      at: atScreen(165, -55),
      draw: rapimock,
      side: 1,
      rise: 40,
    },
    {
      name: "RapiDoc Portal",
      tag: "rapidoc build",
      at: atScreen(185, 45),
      draw: portal,
      side: 1,
      rise: 46,
    },
    { name: "RapiPdf", tag: "<rapi-pdf>", at: atScreen(85, 95), draw: rapipdf, side: 1, rise: -34 },
    {
      name: "RapiFlow",
      tag: "<rapi-flow>",
      at: atScreen(-95, 85),
      draw: rapiflow,
      side: -1,
      rise: -34,
    },
    {
      name: "RapiDoc Mini",
      tag: "<rapi-doc-mini>",
      at: atScreen(-170, 20),
      draw: mini,
      side: -1,
      rise: 56,
    },
  ].map((s, i) => ({ ...s, a: 6 + i * 12 }));

  // The slab
  const slab = `
<g opacity=".5"><polygon points="${pts([0, 0, 0], [P, 0, 0], [P, P, 0], [0, P, 0])}" fill="${C.amber}" opacity=".10" filter="url(#soft)"/></g>
<polygon points="${pts([0, P, 0], [P, P, 0], [P, P, -16], [0, P, -16])}" fill="#0a1120" stroke="rgba(255,255,255,0.07)"/>
<polygon points="${pts([P, 0, 0], [P, P, 0], [P, P, -16], [P, 0, -16])}" fill="#080e1b" stroke="rgba(255,255,255,0.07)"/>
<polygon points="${pts([0, 0, 0], [P, 0, 0], [P, P, 0], [0, P, 0])}" fill="#0f1729" stroke="rgba(255,255,255,0.10)"/>
${Array.from({ length: 9 }, (_, i) => (i + 1) * 46)
  .map(
    (g) =>
      `<polyline points="${pts([g, 6, 0], [g, P - 6, 0])}" stroke="rgba(148,163,184,0.06)"/><polyline points="${pts([6, g, 0], [P - 6, g, 0])}" stroke="rgba(148,163,184,0.06)"/>`,
  )
  .join("")}`;

  // A route from the plinth's edge to each station, faint, then amber once its packet has passed
  const edgeOf = ([x, y], toward, r) => {
    const dx = toward[0] - x;
    const dy = toward[1] - y;
    const n = Math.hypot(dx, dy);
    return [x + (dx / n) * r, y + (dy / n) * r];
  };
  const routeOf = (s) => [edgeOf(CENTER, s.at, 52), edgeOf(s.at, CENTER, 50)];
  const routes = stations
    .map((s) => {
      const line = pts(...routeOf(s).map(([x, y]) => [x, y, 0]));
      return `<polyline points="${line}" fill="none" stroke="rgba(148,163,184,0.28)" stroke-width="1.4" stroke-dasharray="4 5"/>
<polyline points="${line}" fill="none" stroke="${C.amber}" stroke-opacity=".7" stroke-width="1.6" class="${t.ramp(s.a, s.a + 5, END, END + 3)} rm0"/>`;
    })
    .join("\n");

  // The plinth, with the spec over it (and an Arazzo spec behind)
  const [cx, cy] = iso(CENTER[0], CENTER[1], PLINTH.h);
  const plinth = `
<g opacity=".5"><ellipse cx="${round2(cx)}" cy="${round2(cy)}" rx="70" ry="38" fill="${C.amber}" opacity=".16" filter="url(#soft)"/></g>
${isoBox(PLINTH.x, PLINTH.y, 0, PLINTH.w, PLINTH.d, PLINTH.h, { top: "#24304d", left: "#162037", right: "#0f182b", stroke: "rgba(246,168,33,0.35)" })}
<g class="spec-float">
  ${isoBox(PLINTH.x + 20, PLINTH.y + 6, PLINTH.h + 52, 46, 40, 3, { ...SHEET, top: "#d9cff7" })}
  <g transform="${faceMatrix("top", PLINTH.x + 20, PLINTH.y + 6, PLINTH.h + 55)}">${bar(5, 6, 20, 3.5, C.violet)}${bar(5, 14, 30, 3, "#8a7fb0")}${bar(9, 21, 24, 3, "#8a7fb0")}</g>
  ${isoBox(PLINTH.x + 12, PLINTH.y + 18, PLINTH.h + 34, 54, 46, 4, SHEET)}
  <g transform="${faceMatrix("top", PLINTH.x + 12, PLINTH.y + 18, PLINTH.h + 38)}">${bar(6, 6, 26, 3.5, C.amber)}${[0, 1, 2, 3].map((k) => bar(6 + (k % 2) * 6, 14 + k * 7, 36 - (k % 2) * 10, 3, "#7c8799")).join("")}</g>
</g>`;

  // Each station: its shape and a glow under it once lit (its callout is drawn on top, below)
  const lit = (s) => [[s.a + 5, END]];
  const stationSvg = (s) => {
    const [x, y] = s.at;
    const [gx, gy] = iso(x, y, 0);
    // The animation sets the glow's opacity, so the faintness is on a group around it
    return `<g opacity=".14"><g class="${t.show(lit(s))} rm0"><ellipse cx="${round2(gx)}" cy="${round2(gy)}" rx="62" ry="30" fill="${C.amber}" filter="url(#soft)"/></g></g>
${s.draw(t, x, y, s)}`;
  };

  // Callouts as on a drawing (the RapiDoc Mini hero's): a dot on the part, a line straight up, a tick
  // outward, and plain text beside it, the name over the element or command
  const LINE = "rgba(226,232,240,0.5)";
  const callout = (ax, ay, rise, side, lines, color) => {
    const ly = ay - rise;
    const tx = ax + side * 10;
    const anchor = side > 0 ? "start" : "end";
    return `<circle cx="${round2(ax)}" cy="${round2(ay)}" r="2.6" fill="${color}"/>
<path d="M${round2(ax)} ${round2(ay)} V${round2(ly)} H${round2(tx)}" fill="none" stroke="${color}" stroke-width="1"/>
${lines
  .map(
    ([text, style], k) =>
      `<text x="${round2(tx + side * 5)}" y="${round2(ly + 4 + k * 15)}" text-anchor="${anchor}" ${style}>${text}</text>`,
  )
  .join("")}`;
  };
  const stationCallout = (s) => {
    // From the top of the station, or from where s.anchor says (a negative rise runs the line down)
    const [ax, ay] = iso(...(s.anchor ?? [s.at[0], s.at[1], s.peak]));
    // One label: the element where the product is one (<rapi-doc>), else the product's name
    const element = s.tag.startsWith("<");
    const text = element ? s.tag.replace(/</g, "&lt;").replace(/>/g, "&gt;") : s.name;
    const style = (color) =>
      element
        ? `font-size="12" fill="${color}" class="mono"`
        : `font-size="12.5" font-weight="650" fill="${color}"`;
    return `<g class="${t.show([
      [0, s.a + 4.5],
      [END + 1.5, 100],
    ])} rm0">${callout(ax, ay, s.rise, s.side, [[text, style(C.muted)]], LINE)}</g>
<g class="${t.show(lit(s))}">${callout(ax, ay, s.rise, s.side, [[text, style(C.amber)]], C.amber)}</g>`;
  };

  const things = [
    ...stations.map((s) => ({ depth: s.at[0] + s.at[1], svg: () => stationSvg(s) })),
    { depth: CENTER[0] + CENTER[1], svg: () => plinth },
  ].sort((a, b) => a.depth - b.depth);

  const packets = stations
    .map(
      (s) =>
        `<g class="${travel(
          t,
          routeOf(s).map(([x, y]) => iso(x, y, 4)),
          s.a,
          s.a + 5,
        )} rm0" style="opacity:0">${packet(C.amber)}</g>`,
    )
    .join("\n");

  // The spec's callout; when all six are lit, its second line says what they cost
  const [sx, sy] = iso(CENTER[0] - 6, CENTER[1] + 4, PLINTH.h + 62);
  // Raised into the open space above the spec; the closing words go above the two files
  const RISE = 104;
  const closing = `${callout(
    sx,
    sy,
    RISE,
    1,
    [
      ["openapi.yaml", `font-size="11.5" fill="${C.muted}" class="mono"`],
      ["arazzo.yaml", `font-size="11.5" fill="${C.muted}" class="mono"`],
    ],
    LINE,
  )}
<g class="${t.show([[ALL, END]])}"><text x="${round2(sx + 15)}" y="${round2(sy - RISE - 14)}" font-size="13" font-weight="700" fill="${C.amber}" class="mono">MIT · $0 · every feature</text></g>`;

  const body = `
${slab}
${routes}
${things.map((x) => x.svg()).join("\n")}
${packets}
${stations.map(stationCallout).join("\n")}
${closing}`;
  return svg(
    W,
    H,
    "The RapiDoc family",
    "One OpenAPI spec, with an Arazzo spec behind it, in the middle of a slab; around it RapiDoc, RapiDoc Portal, RapiPdf, RapiFlow, RapiDoc Mini and RapiMock. Each in turn receives the spec and lights up; then all six glow under the tag MIT, $0, every feature.",
    t,
    body,
    `.spec-float{animation:float 4s ease-in-out infinite}@keyframes float{50%{transform:translateY(-6px)}}`,
    { framed: false, crop: [24, 40, 712, 528] },
  );
}

/* The stations. Each draws itself around its centre (x, y) on the slab, and sets s.peak, the height of
   its top, where its callout starts. */

/** RapiDoc: a monitor showing a reference, a sidebar and operations with their methods. */
function rapidoc(t, x, y, s) {
  s.peak = 86;
  const w = 96;
  const h = 70;
  const X = x - w / 2;
  const Y = y - 4;
  return `${isoBox(x - 14, y - 10, 0, 28, 20, 8, DARK)}
${isoBox(x - 4, y - 2, 8, 8, 6, 10, DARK)}
${isoBox(X, Y, 16, w, 8, h, { top: "#24304d", left: "#121b30", right: "#0c1426", stroke: "rgba(255,255,255,0.14)" })}
<g transform="${faceMatrix("left", X, Y + 8, 16 + h)}">
  <rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="3" fill="#0b1324"/>
  <rect x="7" y="8" width="20" height="${h - 16}" rx="2" fill="#111b31"/>${[0, 1, 2, 3, 4].map((k) => bar(10, 12 + k * 9, 14 - (k % 2) * 4, 2.5)).join("")}
  ${["GET", "POST", "PUT", "DELETE"].map((m, k) => `<rect x="31" y="${9 + k * 13}" width="12" height="7" rx="1.5" fill="${METHOD[m]}" fill-opacity=".8"/>${bar(46, 11 + k * 13, 34 - (k % 2) * 8, 3)}`).join("")}
</g>`;
}

/** RapiDoc Portal: a browser window standing up, a lock on one corner. */
function portal(t, x, y, s) {
  s.peak = 72;
  const w = 92;
  const h = 66;
  const X = x - w / 2;
  const Y = y - 4;
  return `${isoBox(x - 14, y - 10, 0, 28, 20, 6, DARK)}
${isoBox(X, Y, 6, w, 8, h, { top: "#24304d", left: "#121b30", right: "#0c1426", stroke: "rgba(255,255,255,0.14)" })}
<g transform="${faceMatrix("left", X, Y + 8, 6 + h)}">
  <rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="3" fill="#0b1324"/>
  <rect x="4" y="4" width="${w - 8}" height="9" rx="3" fill="#1b2640"/>${[C.red, C.amber, C.green].map((c, k) => `<circle cx="${10 + k * 5}" cy="8.5" r="1.6" fill="${c}"/>`).join("")}
  ${bar(8, 18, 24, 4, "rgba(226,232,240,0.5)")}${bar(8, 27, 60, 2.5)}${bar(8, 33, 52, 2.5)}
  ${[0, 1, 2].map((k) => `<rect x="${8 + k * 26}" y="40" width="22" height="16" rx="2" fill="#111b31" stroke="${k === 2 ? C.amber : "rgba(255,255,255,0.12)"}" stroke-width=".8"/>`).join("")}
  <rect x="${w - 18}" y="40" width="8" height="6" rx="1.2" fill="${C.amber}"/><path d="M${w - 16.5} 40.4 v-1.6 a2.5 2.5 0 0 1 5 0 v1.6" fill="none" stroke="${C.amber}" stroke-width="1.2"/>
</g>`;
}

/** RapiPdf: a short stack of pages, the top one printed. */
function rapipdf(t, x, y, s) {
  s.peak = 17;
  const w = 58;
  const d = 76;
  s.anchor = [x + w / 2, y + d / 2 - 10, 0]; // its callout drops from the front of the stack
  return `${[0, 1, 2]
    .map((k) => isoBox(x - w / 2 + k * 3, y - d / 2 - k * 3, k * 6, w, d, 5, SHEET))
    .join("\n")}
<g transform="${faceMatrix("top", x - w / 2 + 6, y - d / 2 - 6, 17)}">${bar(6, 6, 22, 4, "#b44646")}${bar(6, 14, 34, 3, "#7c8799")}${[0, 1, 2, 3, 4].map((k) => bar(6, 24 + k * 8, 40 - (k % 3) * 8, 3, "#9aa4b4")).join("")}${bar(6, 66, 20, 3, "#005b96")}</g>`;
}

/** RapiFlow: three steps, linked, the middle one lit. */
function rapiflow(t, x, y, s) {
  s.peak = 18;
  s.anchor = [x + 12, y + 26, 0]; // its callout drops from the front step
  const boxes = [
    [x - 44, y - 30],
    [x - 12, y + 2],
    [x + 20, y - 30],
  ];
  const link = (a, b) =>
    `<polyline points="${pts([a[0] + 12, a[1] + 12, 0], [b[0] + 12, a[1] + 12, 0], [b[0] + 12, b[1] + 12, 0])}" fill="none" stroke="${C.amber}" stroke-opacity=".75" stroke-width="1.6"/>`;
  return `${link(boxes[0], boxes[1])}${link(boxes[1], boxes[2])}
${boxes
  .map(
    ([bx, by], k) =>
      `${isoBox(bx, by, 0, 24, 24, 18, k === 1 ? { top: "#3a2a10", left: "#2a1e0b", right: "#1f1608", stroke: C.amber } : DARK)}<g transform="${faceMatrix("top", bx, by, 18)}">${bar(4, 6, 14, 3, k === 1 ? C.amber : "rgba(148,163,184,0.45)")}${bar(4, 13, 10, 2.5)}</g>`,
  )
  .join("\n")}`;
}

/** RapiDoc Mini: a page of an article lying flat, an amber operation in the middle of its text. */
function mini(t, x, y, s) {
  s.peak = 6;
  const w = 76;
  const d = 92;
  return `${isoBox(x - w / 2, y - d / 2, 0, w, d, 6, { top: "#16203a", left: "#111a2e", right: "#0c1426", stroke: "rgba(255,255,255,0.12)" })}
<g transform="${faceMatrix("top", x - w / 2, y - d / 2, 6)}">
  ${bar(8, 8, 36, 5, "rgba(226,232,240,0.5)")}${bar(8, 18, 58, 3)}${bar(8, 24, 48, 3)}
  <rect x="8" y="33" width="${w - 16}" height="26" rx="3" fill="#1a1408" stroke="${C.amber}" stroke-width="1.2"/>
  <rect x="12" y="38" width="12" height="6" rx="1.2" fill="none" stroke="${C.green}" stroke-width="1"/>${bar(27, 40, 22, 2.5, "rgba(226,232,240,0.5)")}${bar(12, 49, 36, 2.5)}<rect x="${w - 22}" y="49" width="10" height="5" rx="1" fill="${C.amber}"/>
  ${bar(8, 66, 58, 3)}${bar(8, 72, 40, 3)}${bar(8, 80, 52, 3)}
</g>`;
}

/** RapiMock: a server tower and the store it keeps. */
function rapimock(t, x, y, s) {
  s.peak = 104;
  const w = 56;
  const X = x - w / 2;
  const Y = y - w / 2;
  const units = [0, 1, 2]
    .map(
      (i) => `<g transform="${faceMatrix("left", X + 6, Y + w, 12 + i * 30 + 26)}">
  <rect x="0" y="0" width="${w - 12}" height="24" rx="2" fill="#0b1324" stroke="rgba(255,255,255,0.08)"/>${[0, 1, 2].map((k) => bar(5, 5 + k * 5, 20, 2.2, "rgba(148,163,184,0.22)")).join("")}
  <circle cx="${w - 20}" cy="12" r="2.4" fill="${C.green}" opacity=".85"/>
</g>`,
    )
    .join("");
  return `${isoBox(X, Y, 0, w, w, 104, { top: "#1b2640", left: "#121b30", right: "#0c1426", stroke: "rgba(255,255,255,0.10)" })}${units}
<g transform="${faceMatrix("right", X + w, Y + w - 6, 96)}">${[0, 1, 2, 3, 4].map((k) => `<rect x="${k * 8}" y="0" width="3" height="84" rx="1.5" fill="rgba(0,0,0,0.25)"/>`).join("")}</g>`;
}

mkdirSync(OUT, { recursive: true });
const files = { "home-family.svg": family() };
for (const [name, content] of Object.entries(files)) {
  writeFileSync(join(OUT, name), content);
  console.log(`${name}  ${(content.length / 1024).toFixed(1)} KB`);
}
