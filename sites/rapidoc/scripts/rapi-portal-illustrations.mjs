// Generates the animated SVG illustrations of the RapiDoc Portal feature page (pages/portal.astro) into
// public/assets/images/rapi-portal/, with the building blocks of illustration-kit.mjs.
//
//   node sites/rapidoc/scripts/rapi-portal-illustrations.mjs
//
// What they show follows the RapiDoc Portal documentation (sites/rapi-portal/docs): a portal built from
// the files of a repository by `rapidoc build`, laid out by rapidoc.config.yaml (keys as in
// packages/rapidoc-portal/schema.json), and the access rules `rapidoc serve` applies to each reader.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BOX_R,
  C,
  METHOD,
  esc,
  faceMatrix,
  iso,
  isoBox,
  isoTag,
  packet,
  pts,
  round2,
  svg,
  timeline,
  travel,
} from "./illustration-kit.mjs";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "../public/assets/images/rapi-portal");

/** A card: the box, plus an amber outline over `active`. */
function card(t, x, y, w, h, { active = [], fill = C.node } = {}) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${BOX_R}" fill="${fill}" stroke="${C.nodeStroke}"/>
${active.length ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${BOX_R}" fill="none" stroke="${C.amber}" stroke-width="1.6" class="${t.show(active)} rm0"/>` : ""}`;
}

/** A lock icon, 12px, its top left at (x, y). */
const lock = (x, y, color = C.amber) =>
  `<rect x="${x}" y="${y + 5}" width="11" height="8" rx="2" fill="${color}"/><path d="M${x + 2.5} ${y + 5.5} v-2 a3 3 0 0 1 6 0 v2" fill="none" stroke="${color}" stroke-width="1.6"/>`;

/* ------------------------------------------------------------------------------------------ */
/* 1. Hero: files in a repository, `rapidoc build`, a developer portal                         */
/* ------------------------------------------------------------------------------------------ */

function heroBuild() {
  const t = timeline(14);
  const END = 92;
  const W = 760;
  const H = 610;
  const P = 460;

  const REPO = { x: 20, y: 300, w: 120, d: 110, h: 12 };
  const BUILD = { x: 230, y: 250, w: 76, d: 76, h: 64 };
  const BASE = { x: 330, y: 80, w: 76, d: 76, h: 22 };
  const files = [
    { color: C.blue, name: "openapi.yaml", y: 314, a: 4 },
    { color: C.violet, name: "guides/*.md", y: 346, a: 8 },
    { color: C.amber, name: "rapidoc.config.yaml", y: 378, a: 12 },
  ];
  const BUILT = [24, 32]; // the output's trip from the build to the base
  const BEAM = [32, 36];
  const UI = 36; // the portal's parts appear from here

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

  // Routes on the slab: each file from its tile to the build, and the build to the base
  const fileRoute = (f) => [
    [REPO.x + REPO.w, f.y],
    [190, f.y],
    [190, BUILD.y + 38],
    [BUILD.x - 2, BUILD.y + 38],
  ];
  const outRoute = [
    [BUILD.x + BUILD.w + 2, BUILD.y + 38],
    [368, BUILD.y + 38],
    [368, BASE.y + BASE.d + 2],
  ];
  const routeLine = (route, segs, color = C.amber) => {
    const line = pts(...route.map(([x, y]) => [x, y, 0]));
    return `<polyline points="${line}" fill="none" stroke="rgba(148,163,184,0.30)" stroke-width="1.4" stroke-dasharray="4 5"/>
<polyline points="${line}" fill="none" stroke="${color}" stroke-opacity=".75" stroke-width="1.6" stroke-dasharray="4 5" class="${t.show(segs)} rm0"/>`;
  };
  const routes = `${files.map((f) => routeLine(fileRoute(f), [[f.a, f.a + 8]], f.color)).join("\n")}
${routeLine(outRoute, [[BUILT[0], BUILT[1] + 3]], C.green)}`;

  // The repository: a tray of files
  const repo = `${isoBox(REPO.x, REPO.y, 0, REPO.w, REPO.d, REPO.h, { top: "#1b2640", left: "#131c31", right: "#0d1527" })}
${files
  .map(
    (
      f,
    ) => `${isoBox(REPO.x + 14, f.y - 12, REPO.h, REPO.w - 28, 24, 5, { top: "#e8edf5", left: "#aab4c4", right: "#8f9aab", stroke: "rgba(0,0,0,0.15)" })}
<g transform="${faceMatrix("top", REPO.x + 14, f.y - 12, REPO.h + 5)}"><rect x="6" y="5" width="22" height="4" rx="2" fill="${f.color}"/><rect x="6" y="13" width="${REPO.w - 50}" height="3" rx="1.5" fill="#7c8799"/><rect x="34" y="5" width="${REPO.w - 76}" height="3" rx="1.5" fill="#9aa4b4"/></g>`,
  )
  .join("\n")}
${isoTag((([X, Y]) => [X - 6, Y - 30])(iso(REPO.x + REPO.w / 2, REPO.y + REPO.d / 2, REPO.h)), "Your repository", { mono: false })}
${files.map((f) => isoTag((([X, Y]) => [X - 6, Y - 62])(iso(REPO.x + REPO.w / 2, REPO.y + REPO.d / 2, REPO.h)), f.name, { color: f.color, cls: `${t.show([[f.a, f.a + 7]])} rm0` })).join("\n")}`;

  // The build: a box with a turning gear
  const B = BUILD;
  const gear = Array.from(
    { length: 8 },
    (_, i) =>
      `<rect x="-3" y="-17" width="6" height="7" rx="1.5" transform="rotate(${i * 45})" fill="${C.amber}"/>`,
  ).join("");
  const build = `
<g opacity=".7"><polygon points="${pts([B.x - 8, B.y - 8, 0], [B.x + B.w + 8, B.y - 8, 0], [B.x + B.w + 8, B.y + B.d + 8, 0], [B.x - 8, B.y + B.d + 8, 0])}" fill="${C.amber}" opacity=".25" filter="url(#soft)" class="${t.show([[files[0].a + 6, BUILT[0] + 2]])} rm0"/></g>
${isoBox(B.x, B.y, 0, B.w, B.d, B.h, { top: "#1b2640", left: "#121b30", right: "#0c1426", stroke: "rgba(255,255,255,0.10)" })}
<g transform="${faceMatrix("left", B.x, B.y + B.d, B.h)}">
  <g transform="translate(${B.w / 2} ${B.h / 2})"><g class="gear">${gear}<circle r="12" fill="${C.amber}"/><circle r="5" fill="#121b30"/></g></g>
</g>
<g transform="${faceMatrix("right", B.x + B.w, B.y + B.d, B.h)}">
  ${[0, 1, 2, 3, 4].map((k) => `<rect x="${8 + k * 12}" y="10" width="5" height="${B.h - 20}" rx="2.5" fill="rgba(0,0,0,0.25)"/>`).join("")}
</g>
${isoTag((([X, Y]) => [X, Y - 26])(iso(B.x + B.w / 2, B.y + B.d / 2, B.h)), "rapidoc build", { color: C.amber, border: "rgba(246,168,33,0.55)", fill: "#1a1408" })}`;

  // The base the portal stands on, and the beam up to it
  const S = BASE;
  const [bx, by] = iso(S.x + S.w / 2, S.y + S.d / 2, S.h);
  const base = `${isoBox(S.x, S.y, 0, S.w, S.d, S.h, { top: "#1e2b47", left: "#131c31", right: "#0d1527" })}
<g opacity=".8"><polygon points="${pts([S.x + 8, S.y + 8, S.h], [S.x + S.w - 8, S.y + 8, S.h], [S.x + S.w - 8, S.y + S.d - 8, S.h], [S.x + 8, S.y + S.d - 8, S.h])}" fill="${C.amber}" opacity=".35" filter="url(#soft)" class="${t.show([[BEAM[0], END]])} rm0"/></g>
${isoTag([bx + 4, by + 52], "dist/ · static files", { color: C.muted })}`;

  // The portal: a browser window over the base, its parts appearing as the build finishes
  const WX = 404;
  const WY = 40;
  const WW = 300;
  const WH = 214;
  const part = (at, inner) => `<g class="${t.show([[at, END]])}">${inner}</g>`;
  const portal = `
<g class="fl ${t.add([
    [0, "transform:scaleY(0);opacity:0"],
    [BEAM[0], "transform:scaleY(0);opacity:0"],
    [BEAM[1], "transform:scaleY(1);opacity:1"],
    [END, "transform:scaleY(1);opacity:1"],
    [END + 3, "transform:scaleY(0);opacity:0"],
    [100, "transform:scaleY(0);opacity:0"],
  ])} rm0" style="transform-origin:${round2(bx)}px ${round2(by)}px;transform-box:view-box">
  <polygon points="${round2(bx - 26)},${round2(by)} ${round2(bx + 26)},${round2(by)} ${WX + WW / 2 + 70},${WY + WH} ${WX + WW / 2 - 70},${WY + WH}" fill="url(#beam)"/>
</g>
<g class="${t.show([[UI, END]])}">
  <g opacity=".5"><rect x="${WX - 4}" y="${WY + 6}" width="${WW + 8}" height="${WH}" rx="12" fill="${C.amber}" opacity=".18" filter="url(#soft)"/></g>
  <rect x="${WX}" y="${WY}" width="${WW}" height="${WH}" rx="10" fill="#0b1222" stroke="rgba(255,255,255,0.14)"/>
  <rect x="${WX}" y="${WY}" width="${WW}" height="24" rx="10" fill="#141d33"/><rect x="${WX}" y="${WY + 14}" width="${WW}" height="10" fill="#141d33"/>
  ${[C.red, C.amber, C.green].map((c, i) => `<circle cx="${WX + 14 + i * 11}" cy="${WY + 12}" r="3.4" fill="${c}"/>`).join("")}
  <rect x="${WX + 60}" y="${WY + 5}" width="${WW - 120}" height="14" rx="7" fill="#0b1222"/>
  <text x="${WX + WW / 2}" y="${WY + 15.5}" font-size="9.5" fill="${C.dim}" text-anchor="middle" class="mono">developers.acme.com</text>
</g>
${part(
  UI + 3,
  `<text x="${WX + 14}" y="${WY + 44}" font-size="11" font-weight="700" fill="${C.text}">Acme Developers</text>
<text x="${WX + 122}" y="${WY + 44}" font-size="9.5" fill="${C.muted}">Guides</text><text x="${WX + 160}" y="${WY + 44}" font-size="9.5" fill="${C.muted}">APIs</text>
<rect x="${WX + WW - 62}" y="${WY + 33}" width="50" height="16" rx="8" fill="none" stroke="${C.amber}" stroke-opacity=".6"/>
<text x="${WX + WW - 37}" y="${WY + 44.5}" font-size="9" fill="${C.amber}" text-anchor="middle">Sign in</text>
<rect x="${WX}" y="${WY + 56}" width="${WW}" height="1" fill="rgba(255,255,255,0.08)"/>`,
)}
${part(
  UI + 7,
  `<rect x="${WX + 12}" y="${WY + 68}" width="64" height="${WH - 80}" rx="6" fill="#0f1729"/>
${["Quickstart", "Guides", "Orders API", "Billing API"].map((s, i) => `<text x="${WX + 20}" y="${WY + 86 + i * 18}" font-size="9" fill="${i === 2 ? C.amber : C.muted}">${s}</text>`).join("")}
<rect x="${WX + 12}" y="${WY + 78 + 2 * 18}" width="2" height="12" fill="${C.amber}"/>`,
)}
${part(
  UI + 11,
  `<text x="${WX + 90}" y="${WY + 82}" font-size="12" font-weight="700" fill="${C.text}">API catalog</text>
<rect x="${WX + 90}" y="${WY + 90}" width="${WW - 104}" height="16" rx="8" fill="#0f1729" stroke="rgba(255,255,255,0.08)"/>
<circle cx="${WX + 101}" cy="${WY + 98}" r="3.5" fill="none" stroke="${C.dim}" stroke-width="1.3"/>
<text x="${WX + 110}" y="${WY + 101.5}" font-size="8.5" fill="${C.dim}">Search guides and operations</text>`,
)}
${[
  ["Orders API", "GET", "Public"],
  ["Shipping API", "POST", "Public"],
  ["Billing API", "GET", "Partners"],
]
  .map(([name, m, who], i) => {
    const cx = WX + 90 + (i % 2) * 104;
    const cy = WY + 116 + Math.floor(i / 2) * 46;
    const locked = who === "Partners";
    return part(
      UI + 15 + i * 3,
      `<rect x="${cx}" y="${cy}" width="96" height="38" rx="6" fill="#0f1729" stroke="${locked ? "rgba(246,168,33,0.45)" : "rgba(255,255,255,0.08)"}"/>
<text x="${cx + 8}" y="${cy + 15}" font-size="9.5" font-weight="650" fill="${C.text}">${name}</text>
<rect x="${cx + 8}" y="${cy + 22}" width="${m.length * 6 + 8}" height="11" rx="3" fill="${METHOD[m]}" fill-opacity=".16"/>
<text x="${cx + 12}" y="${cy + 30.5}" font-size="7.5" font-weight="700" fill="${METHOD[m]}" class="mono">${m}</text>
<text x="${cx + 88}" y="${cy + 31}" font-size="8" fill="${locked ? C.amber : C.dim}" text-anchor="end">${who}</text>
${locked ? `<g class="${t.show([[UI + 26, END]])}">${lock(cx + 78, cy + 4)}</g>` : ""}`,
    );
  })
  .join("\n")}
${isoTag([WX + WW / 2, WY + WH + 22], "Your developer portal", { mono: false, cls: t.show([[UI, END]]) })}`;

  // Paint from the back to the front
  const things = [
    { depth: REPO.x + REPO.w / 2 + REPO.y + REPO.d / 2, svg: repo },
    { depth: B.x + B.w / 2 + B.y + B.d / 2, svg: build },
    { depth: S.x + S.w / 2 + S.y + S.d / 2, svg: base },
  ].sort((a, b) => a.depth - b.depth);

  const packets = `${files
    .map(
      (f) =>
        `<g class="${travel(
          t,
          fileRoute(f).map(([x, y]) => iso(x, y, 4)),
          f.a,
          f.a + 8,
        )} rm0" style="opacity:0">${packet(f.color)}</g>`,
    )
    .join("\n")}
<g class="${travel(
    t,
    outRoute.map(([x, y]) => iso(x, y, 4)),
    BUILT[0],
    BUILT[1],
  )} rm0" style="opacity:0">${packet(C.green)}</g>`;

  const body = `
<defs><linearGradient id="beam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${C.amber}" stop-opacity=".45"/><stop offset="1" stop-color="${C.amber}" stop-opacity="0"/></linearGradient></defs>
${slab}
${routes}
${things.map((x) => x.svg).join("\n")}
${packets}
${portal}
`;
  return svg(
    W,
    H,
    "From a repository to a developer portal",
    "OpenAPI specs, Markdown guides and rapidoc.config.yaml travel from your repository into rapidoc build, which writes static files; the developer portal rises from them: a header with Sign in, a sidebar, search and an API catalog with one API for partners only.",
    t,
    body,
    `.gear{animation:gearspin 4s linear infinite;transform-box:fill-box;transform-origin:center}@keyframes gearspin{to{transform:rotate(360deg)}}`,
    { framed: false, crop: [24, 24, 700, 520] },
  );
}

/* ------------------------------------------------------------------------------------------ */
/* 2. One config file: rapidoc.config.yaml lays the portal out                                 */
/* ------------------------------------------------------------------------------------------ */

function configFile() {
  const t = timeline(12);
  const END = 90;
  const W = 760;
  const H = 430;

  // [text, indent, color of the key, the step it belongs to]
  const lines = [
    ["site:", 0, 0],
    ["  title: Acme Developers", 1, 0],
    ["header:", 0, 1],
    ["  links:", 1, 1],
    ["    - { label: Guides, href: /docs/ }", 2, 1],
    ["apis:", 0, 2],
    ["  - { id: orders, spec: specs/orders.yaml }", 1, 2],
    ["  - { id: billing, spec: specs/billing.yaml }", 1, 2],
    ["theme:", 0, 3],
    ['  primary: "#f6a821"', 1, 3],
  ];
  const steps = [8, 26, 44, 62]; // when each part of the config takes effect
  const lineY = (i) => 138 + i * 23;

  const yaml = lines
    .map(([text, , step], i) => {
      const at = steps[step];
      const [k, ...v] = text.split(":");
      const rest = v.join(":");
      return `<rect x="46" y="${lineY(i) - 15}" width="318" height="21" rx="4" fill="${C.amber}" fill-opacity=".10" class="${t.show([[at, at + 14]], 0.8)} rm0"/>
<text x="56" y="${lineY(i)}" font-size="10.8" class="mono" xml:space="preserve"><tspan fill="${C.violet}">${esc(k)}</tspan><tspan fill="${C.dim}">:</tspan><tspan fill="${C.text}">${esc(rest)}</tspan></text>`;
    })
    .join("\n");

  // The portal it lays out, grey until the theme step turns its accents amber
  const PX = 410;
  const PY = 92;
  const PW = 310;
  const PH = 300;
  const amberAt = steps[3];
  const twoTone = (shape) =>
    `${shape.replace("%C", "#5b6475")}${shape.replace("%C", C.amber).replace("<", `<g class="${t.show([[amberAt, END]])}"><`)}</g>`;
  const part = (at, inner) => `<g class="${t.show([[at, END]])}">${inner}</g>`;

  const portal = `
${card(t, PX, PY, PW, PH, { fill: "#0b1222" })}
<rect x="${PX}" y="${PY}" width="${PW}" height="40" rx="${BOX_R}" fill="#111a2e"/><rect x="${PX}" y="${PY + 30}" width="${PW}" height="10" fill="#111a2e"/>
<rect x="${PX + 14}" y="${PY + 14}" width="12" height="12" rx="3" fill="#2a3550"/>
${part(steps[0] + 3, `${twoTone(`<rect x="${PX + 14}" y="${PY + 14}" width="12" height="12" rx="3" fill="%C"/>`)}<text x="${PX + 34}" y="${PY + 25}" font-size="12" font-weight="700" fill="${C.text}">Acme Developers</text>`)}
${part(steps[1] + 3, `<text x="${PX + 160}" y="${PY + 25}" font-size="11" fill="${C.muted}">Guides</text><text x="${PX + 206}" y="${PY + 25}" font-size="11" fill="${C.muted}">APIs</text>`)}
<rect x="${PX + 14}" y="${PY + 54}" width="78" height="${PH - 68}" rx="6" fill="#0f1729"/>
${part(
  steps[2] + 3,
  `${["Orders API", "Billing API"].map((s, i) => `<text x="${PX + 24}" y="${PY + 76 + i * 22}" font-size="10" fill="${C.muted}">${s}</text>`).join("")}
${twoTone(`<rect x="${PX + 14}" y="${PY + 64}" width="2" height="16" fill="%C"/>`)}
<text x="${PX + 106}" y="${PY + 74}" font-size="13" font-weight="700" fill="${C.text}">APIs</text>
${["Orders API", "Billing API"]
  .map(
    (
      s,
      i,
    ) => `<rect x="${PX + 106 + i * 98}" y="${PY + 86}" width="90" height="62" rx="6" fill="#0f1729" stroke="rgba(255,255,255,0.08)"/>
<text x="${PX + 114 + i * 98}" y="${PY + 104}" font-size="10.5" font-weight="650" fill="${C.text}">${s}</text>
<text x="${PX + 114 + i * 98}" y="${PY + 120}" font-size="9" fill="${C.dim}" class="mono">${i ? "billing" : "orders"}.yaml</text>
${twoTone(`<rect x="${PX + 114 + i * 98}" y="${PY + 128}" width="34" height="12" rx="3" fill="%C" fill-opacity=".9"/>`)}
<text x="${PX + 131 + i * 98}" y="${PY + 137}" font-size="7.5" font-weight="700" fill="#0b1222" text-anchor="middle">VIEW</text>`,
  )
  .join("")}`,
)}
${twoTone(`<rect x="${PX + 106}" y="${PY + 168}" width="190" height="8" rx="4" fill="%C" fill-opacity=".35"/>`)}
<rect x="${PX + 106}" y="${PY + 188}" width="160" height="6" rx="3" fill="rgba(148,163,184,0.2)"/>
<rect x="${PX + 106}" y="${PY + 202}" width="176" height="6" rx="3" fill="rgba(148,163,184,0.2)"/>
<rect x="${PX + 106}" y="${PY + 216}" width="120" height="6" rx="3" fill="rgba(148,163,184,0.2)"/>
${twoTone(`<rect x="${PX + 106}" y="${PY + 240}" width="84" height="24" rx="6" fill="%C"/>`)}
<text x="${PX + 148}" y="${PY + 256}" font-size="10" font-weight="700" fill="#0b1222" text-anchor="middle">Get started</text>`;

  // Lines from the config to what each part lays out
  const link = (i, x2, y2, at) => {
    const y1 = lineY(i) - 4;
    const d = `M370 ${y1} C390 ${y1} 390 ${y2} ${x2} ${y2}`;
    return `<path d="${d}" fill="none" stroke="${C.amber}" stroke-opacity=".6" stroke-width="1.4" stroke-dasharray="3 4" class="${t.show([[at, at + 14]])} rm0"/>`;
  };

  const body = `
<text x="40" y="44" font-size="17" font-weight="700" fill="${C.text}">One config file</text>
<text x="40" y="65" font-size="12.5" fill="${C.muted}">rapidoc.config.yaml lays out the header, the APIs, the sidebars and the theme.</text>
${card(t, 40, 92, 330, 260)}
<text x="56" y="114" font-size="10.5" font-weight="700" fill="${C.dim}" letter-spacing=".08em">RAPIDOC.CONFIG.YAML</text>
${yaml}
${link(1, PX + 30, PY + 20, steps[0])}
${link(4, PX + 156, PY + 20, steps[1])}
${link(6, PX + 14, PY + 80, steps[2])}
${link(9, PX + 106, PY + 172, steps[3])}
${portal}
<text x="40" y="378" font-size="11.5" fill="${C.muted}" class="${t.show([[steps[3] + 6, END]])}">An unknown key fails the build, with its path and a hint.</text>
`;
  return svg(
    W,
    H,
    "One config file",
    "Lines of rapidoc.config.yaml light up in turn and the portal takes shape: the site title in the header, the header links, the API catalog and sidebar from two specs, and the theme's amber on the accents.",
    t,
    body,
  );
}

/* ------------------------------------------------------------------------------------------ */
/* 3. Who sees what: rapidoc serve checks each reader against the access rules                  */
/* ------------------------------------------------------------------------------------------ */

function access() {
  const t = timeline(16);
  const END = 92;
  const W = 760;
  const H = 480;

  const rules = [
    ["access:", 0],
    ["  default: public", 1],
    ["  rules:", 2],
    ["    - path: /docs/partners/**", 3],
    ["      allow: signed-in", 4],
    ["    - path: /apis/billing/**", 5],
    ["      allow: { groups: [billing-team] }", 6],
  ];
  const ruleY = (i) => 140 + i * 24;

  // Each request: who, what, which rule lines decide it, and the answer
  const requests = [
    {
      who: "Visitor",
      state: "signed out",
      path: "/docs/quickstart/",
      lines: [1],
      answer: "public",
      color: C.green,
    },
    {
      who: "Visitor",
      state: "signed out",
      path: "/docs/partners/",
      lines: [3, 4],
      answer: "sign in →",
      color: C.amber,
    },
    {
      who: "Partner",
      state: "signed in",
      path: "/docs/partners/",
      lines: [3, 4],
      answer: "200",
      color: C.green,
    },
    {
      who: "Partner",
      state: "signed in",
      path: "/apis/billing/",
      lines: [5, 6],
      answer: "access denied",
      color: C.red,
    },
    {
      who: "Staff",
      state: "billing-team",
      path: "/apis/billing/",
      lines: [5, 6],
      answer: "200",
      color: C.green,
    },
  ].map((r, i) => ({ ...r, a: 4 + i * 17 }));
  const rowY = (i) => 96 + i * 56;

  const yaml = rules
    .map(([text, i]) => {
      const lit = requests.filter((r) => r.lines.includes(i)).map((r) => [r.a + 3, r.a + 14]);
      const [k, ...v] = text.split(":");
      return `${lit.length ? `<rect x="46" y="${ruleY(i) - 15}" width="288" height="21" rx="4" fill="${C.amber}" fill-opacity=".12" class="${t.show(lit, 0.8)} rm0"/>` : ""}
<text x="56" y="${ruleY(i)}" font-size="11.5" class="mono" xml:space="preserve"><tspan fill="${C.violet}">${esc(k)}</tspan><tspan fill="${C.dim}">:</tspan><tspan fill="${C.text}">${esc(v.join(":"))}</tspan></text>`;
    })
    .join("\n");

  const rows = requests
    .map((r, i) => {
      const y = rowY(i);
      const w = r.answer.length * 7 + 22;
      const avatar = { Visitor: C.dim, Partner: C.cyan, Staff: C.violet }[r.who];
      return `<g class="${t.show([[r.a, END]])}">
${card(t, 370, y, 350, 48, { active: [[r.a, r.a + 14]] })}
<circle cx="392" cy="${y + 24}" r="11" fill="${avatar}" fill-opacity=".18" stroke="${avatar}" stroke-opacity=".6"/>
<circle cx="392" cy="${y + 20.5}" r="3.6" fill="${avatar}"/><path d="M385 ${y + 31} a7 6 0 0 1 14 0" fill="${avatar}"/>
<text x="412" y="${y + 21}" font-size="12" font-weight="650" fill="${C.text}">${r.who} <tspan font-weight="400" fill="${C.dim}" font-size="10.5">· ${r.state}</tspan></text>
<text x="412" y="${y + 37}" font-size="11" fill="${C.muted}" class="mono"><tspan fill="${C.blue}">GET</tspan> ${esc(r.path)}</text>
<g class="${t.show([[r.a + 7, END]])}"><rect x="${708 - w}" y="${y + 13}" width="${w}" height="22" rx="11" fill="${r.color}" fill-opacity=".12" stroke="${r.color}" stroke-opacity=".55"/>
<text x="${708 - w / 2}" y="${y + 28}" font-size="11" font-weight="700" fill="${r.color}" text-anchor="middle" class="mono">${esc(r.answer)}</text></g>
<text x="${708 - 10}" y="${y + 28}" font-size="11" fill="${C.dim}" text-anchor="end" class="mono ${t.show([[r.a, r.a + 5.6]])} rm0">checking…</text>
</g>`;
    })
    .join("\n");

  const body = `
<text x="40" y="44" font-size="17" font-weight="700" fill="${C.text}">Who sees what</text>
<text x="40" y="65" font-size="12.5" fill="${C.muted}">rapidoc serve checks each reader's session against the rules before it sends anything protected.</text>
${card(t, 40, 96, 300, 250)}
<text x="56" y="118" font-size="10.5" font-weight="700" fill="${C.dim}" letter-spacing=".08em">RAPIDOC.CONFIG.YAML</text>
${yaml}
<text x="56" y="328" font-size="11" fill="${C.dim}">Sign-in: Okta, Entra ID, Google or any OIDC</text>
${rows}
<rect x="40" y="388" width="680" height="64" rx="${BOX_R}" fill="#070b16" stroke="rgba(255,255,255,0.06)"/>
<text x="56" y="414" font-size="11.5" fill="${C.green}" class="mono">dist/public/</text><text x="168" y="414" font-size="11.5" fill="${C.muted}">plain static files, for any host or CDN</text>
<g>${lock(56, 427, C.amber)}</g><text x="74" y="438" font-size="11.5" fill="${C.amber}" class="mono">dist/protected/</text><text x="196" y="438" font-size="11.5" fill="${C.muted}">only through rapidoc serve, per reader; search filtered too</text>
`;
  return svg(
    W,
    H,
    "Who sees what",
    "Five requests: a signed-out visitor reads a public page and is sent to sign in for a partner page; a signed-in partner reads it but is denied the billing API; staff in the billing-team group read the billing API. The matching access rule lights up for each.",
    t,
    body,
  );
}

mkdirSync(OUT, { recursive: true });
const files = {
  "portal-build.svg": heroBuild(),
  "portal-config.svg": configFile(),
  "portal-access.svg": access(),
};
for (const [name, content] of Object.entries(files)) {
  writeFileSync(join(OUT, name), content);
  console.log(`${name}  ${(content.length / 1024).toFixed(1)} KB`);
}
