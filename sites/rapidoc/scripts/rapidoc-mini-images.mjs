// Makes the static images of the RapiDoc Mini feature page (pages/rapidoc-mini.astro) into
// public/assets/images/rapidoc-mini/:
//
//   mini-anatomy.svg        the hero: an article with <rapi-doc-mini> in it, as a blueprint (text as
//                           bars) with labelled parts on right-angled leaders
//   mini-where-it-fits.svg  one OpenAPI spec: the full reference, and the operations embedded around it
//
//   node sites/rapidoc/scripts/rapidoc-mini-images.mjs

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BOX_R, C, METHOD, elbow, esc, svg, timeline } from "./illustration-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "../public/assets/images/rapidoc-mini");
mkdirSync(OUT, { recursive: true });
/* ------------------------------------------------------------------------------------------ */
/* 1. The hero: an article with <rapi-doc-mini> in it, as a blueprint with labelled parts      */
/* ------------------------------------------------------------------------------------------ */

function anatomy() {
  const t = timeline(1); // no animation: the kit's style and defs only
  const W = 760;
  const H = 620;
  const LINE = "rgba(226,232,240,0.55)"; // leader lines and the frame, as on a drawing
  // The element's notes: a paler amber than its frame, on thinner lines, so the two don't merge
  const NOTE = "#fcd9a0";
  const BAR = "rgba(148,163,184,0.22)"; // text, drawn as bars
  const bar = (x, y, w, h = 6, fill = BAR) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}"/>`;

  // The page: a browser frame, the site's bar, and the article in bars
  const F = { x: 40, y: 150, w: 520, h: 470 };
  const page = `
<rect x="${F.x}" y="${F.y}" width="${F.w}" height="${F.h + 20}" rx="14" fill="#0a0f1c" stroke="${LINE}" stroke-width="1.4"/>
<line x1="${F.x}" y1="${F.y + 36}" x2="${F.x + F.w}" y2="${F.y + 36}" stroke="rgba(255,255,255,0.10)"/>
<circle cx="${F.x + 22}" cy="${F.y + 18}" r="6" fill="none" stroke="${LINE}" stroke-width="1.4"/>
${bar(F.x + 36, F.y + 15, 90, 7, "rgba(226,232,240,0.45)")}
${bar(F.x + 360, F.y + 16, 40)}${bar(F.x + 412, F.y + 16, 40)}${bar(F.x + 464, F.y + 16, 34)}
${bar(90, 206, 70, 5)}
${bar(90, 220, 230, 13, "rgba(226,232,240,0.55)")}
${bar(90, 246, 400)}${bar(90, 259, 330)}
${bar(90, 282, 150, 9, "rgba(226,232,240,0.40)")}
${bar(90, 302, 380)}
${bar(90, 546, 300)}${bar(90, 559, 220)}${bar(90, 582, 360)}`;

  // <rapi-doc-mini>: one operation, in amber
  const K = { x: 90, y: 322, w: 420, h: 206 };
  const card = `
<rect x="${K.x}" y="${K.y}" width="${K.w}" height="${K.h}" rx="8" fill="rgba(246,168,33,0.03)" stroke="${C.amber}" stroke-width="1.6"/>
<line x1="${K.x}" y1="${K.y + 28}" x2="${K.x + K.w}" y2="${K.y + 28}" stroke="rgba(246,168,33,0.35)"/>
<rect x="${K.x + 12}" y="${K.y + 7}" width="34" height="14" rx="3" fill="none" stroke="${METHOD.POST}" stroke-width="1.4"/>
${bar(K.x + 54, K.y + 11, 70, 6, "rgba(226,232,240,0.45)")}
${bar(K.x + 12, K.y + 40, 120, 9, "rgba(226,232,240,0.45)")}
${bar(K.x + 12, K.y + 56, 80, 5)}
<line x1="${K.x}" y1="${K.y + 70}" x2="${K.x + K.w}" y2="${K.y + 70}" stroke="rgba(255,255,255,0.08)"/>
${bar(K.x + 12, K.y + 82, 60, 6, "rgba(226,232,240,0.35)")}
${bar(K.x + 12, K.y + 96, 40, 5, C.amber)}<rect x="${K.x + 12}" y="${K.y + 105}" width="40" height="1.6" fill="${C.amber}"/>
${bar(K.x + 60, K.y + 96, 40, 5)}
<rect x="${K.x + 12}" y="${K.y + 113}" width="${K.w - 24}" height="58" rx="5" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.12)"/>
${bar(K.x + 22, K.y + 124, 8, 4)}${bar(K.x + 32, K.y + 135, 80, 4)}${bar(K.x + 32, K.y + 146, 64, 4)}${bar(K.x + 22, K.y + 157, 8, 4)}
<rect x="${K.x + K.w - 132}" y="${K.y + 180}" width="44" height="16" rx="3" fill="none" stroke="rgba(255,255,255,0.25)"/>
<rect x="${K.x + K.w - 82}" y="${K.y + 180}" width="34" height="16" rx="3" fill="none" stroke="rgba(255,255,255,0.25)"/>
<rect x="${K.x + K.w - 42}" y="${K.y + 180}" width="30" height="16" rx="3" fill="${C.amber}"/>`;

  // A dimension down the left: the card is one operation, in the article's flow
  const dim = `
<line x1="68" y1="${K.y}" x2="68" y2="${K.y + K.h}" stroke="${NOTE}" stroke-opacity=".8"/>
<line x1="62" y1="${K.y}" x2="74" y2="${K.y}" stroke="${NOTE}" stroke-opacity=".8"/>
<line x1="62" y1="${K.y + K.h}" x2="74" y2="${K.y + K.h}" stroke="${NOTE}" stroke-opacity=".8"/>
<text transform="translate(58 ${K.y + K.h / 2}) rotate(-90)" font-size="10" fill="${NOTE}" text-anchor="middle" class="mono">one operation, in place</text>`;

  // Callouts with right-angled leaders: a dot on the part, a line to the label, a tick, the label
  const dot = (x, y, color) => `<circle cx="${x}" cy="${y}" r="3" fill="${color}"/>`;
  const label = (x, y, lines, color) =>
    lines
      .map(
        (l, i) =>
          `<text x="${x}" y="${y + 4 + i * 15}" font-size="11.5" fill="${color}" class="mono">${esc(l)}</text>`,
      )
      .join("");
  // up: from the part straight up to the label's row, then a tick right to the label
  const up = (x, y, ly, lines, color = LINE) =>
    `${dot(x, y, color)}<path d="M${x} ${y} V${ly} H${x + 10}" fill="none" stroke="${color}" stroke-width="1"/>${label(x + 15, ly, lines, color === LINE ? C.text : color)}`;
  // right: from the part straight right past the frame, a tick down, the label beside it
  const right = (x, y, lx, lines, color = NOTE) =>
    `${dot(x, y, color)}<path d="M${x} ${y} H${lx}" fill="none" stroke="${color}" stroke-width="1"/><path d="M${lx} ${y - 6} V${y + 6}" stroke="${color}" stroke-width="1"/>${label(lx + 8, y, lines, color)}`;

  const LX = 590;
  const callouts = `
${up(320, 226, 98, ["your page, your styles"])}
${up(K.x + K.w, K.y, 62, ["<rapi-doc-mini>"], NOTE)}
${right(K.x + 124, K.y + 14, LX, ["filter-operations=", '"POST /users"'])}
${right(K.x + K.w - 12, K.y + 142, LX, ["request body and", "schema, from the spec"])}
${right(K.x + K.w - 12, K.y + 188, LX, ["Try: a real request,", "from this page"])}
${right(F.x + F.w, F.y + 20, LX, ["no iframe: the", "page's own layout"], LINE)}`;

  const body = `
<rect width="${W}" height="${H}" fill="url(#dots)"/>
${page}
${card}
${dim}
${callouts}`;
  return svg(
    W,
    H,
    "RapiDoc Mini in an article",
    "A blueprint of a web page: the article drawn as bars, and in it an amber rapi-doc-mini card showing one operation. Labels with right-angled leaders: your page and your styles; the rapi-doc-mini element; filter-operations set to POST /users; the request body and schema from the spec; Try sends a real request from the page; no iframe, the page's own layout.",
    t,
    body,
    "",
    { framed: false },
  );
}

writeFileSync(join(OUT, "mini-anatomy.svg"), anatomy());
console.log("mini-anatomy.svg");

/* ------------------------------------------------------------------------------------------ */
/* 2. Where it fits: one spec, the full reference, and operations embedded around it          */
/* ------------------------------------------------------------------------------------------ */

function whereItFits() {
  const t = timeline(1); // no animation: the kit's style and defs only
  const W = 760;
  const H = 440;
  const card = (x, y, w, h, stroke = C.nodeStroke) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${BOX_R}" fill="${C.node}" stroke="${stroke}"/>`;
  const METHODS = { ...METHOD, PATCH: C.violet };
  const badge = (x, y, m) => {
    const w = m.length * 7 + 10;
    return `<rect x="${x}" y="${y}" width="${w}" height="16" rx="4" fill="${METHODS[m]}" fill-opacity=".16" stroke="${METHODS[m]}" stroke-opacity=".5"/><text x="${x + w / 2}" y="${y + 11.5}" font-size="9" font-weight="700" fill="${METHODS[m]}" text-anchor="middle" class="mono">${m}</text>`;
  };
  const lines = (x, y, w, n, step = 9) =>
    Array.from(
      { length: n },
      (_, i) =>
        `<rect x="${x}" y="${y + i * step}" width="${w - (i % 3) * 18}" height="4" rx="2" fill="rgba(148,163,184,0.22)"/>`,
    ).join("");

  // The four places a single operation is embedded, each a small page with its words around it
  const embeds = [
    { title: "Blog post", m: "POST", path: "/users", note: "a call in the story" },
    { title: "Tutorial step", m: "GET", path: "/users/{id}", note: "step 2 of 4" },
    { title: "Changelog", m: "PATCH", path: "/users/{id}", note: "new in v2.3" },
    { title: "Dashboard", m: "DELETE", path: "/users/{id}", note: "next to the setting" },
  ];
  const EY = 270;
  const EW = 158;
  const embedSvg = embeds
    .map((e, i) => {
      const x = 40 + i * (EW + 16);
      return `${card(x, EY, EW, 132)}
<text x="${x + 12}" y="${EY + 22}" font-size="12" font-weight="650" fill="${C.text}">${e.title}</text>
${lines(x + 12, EY + 32, EW - 24, 2)}
<rect x="${x + 10}" y="${EY + 54}" width="${EW - 20}" height="40" rx="6" fill="#0b1426" stroke="${C.amber}" stroke-opacity=".7"/>
${badge(x + 18, EY + 66, e.m)}
<text x="${x + 26 + e.m.length * 7 + 10}" y="${EY + 78}" font-size="10" fill="${C.text}" class="mono">${esc(e.path)}</text>
${lines(x + 12, EY + 104, EW - 24, 1)}
<text x="${x + 12}" y="${EY + 124}" font-size="10" fill="${C.dim}">${e.note}</text>`;
    })
    .join("\n");

  // The spec, and the full reference beside it
  const spec = `${card(40, 92, 170, 120)}
<text x="56" y="116" font-size="10.5" font-weight="700" fill="${C.dim}" letter-spacing=".08em">ONE OPENAPI SPEC</text>
<text x="56" y="142" font-size="12" fill="${C.violet}" class="mono">paths:</text>
${["/users", "/users/{id}", "/orders"].map((p, i) => `<text x="68" y="${162 + i * 17}" font-size="11.5" fill="${C.text}" class="mono">${p}</text>`).join("")}`;
  const ref = `${card(300, 92, 420, 120)}
<text x="316" y="116" font-size="10.5" font-weight="700" fill="${C.dim}" letter-spacing=".08em">THE FULL REFERENCE · &lt;RAPI-DOC&gt;</text>
<rect x="316" y="128" width="88" height="70" rx="5" fill="#0b1426"/>${lines(324, 138, 72, 6)}
${["POST", "GET", "PATCH"].map((m, i) => `${badge(418, 130 + i * 24, m)}${lines(418 + m.length * 7 + 18, 136 + i * 24, 220, 1)}`).join("")}
<text x="704" y="203" font-size="10" fill="${C.dim}" text-anchor="end">every operation, on the docs site</text>`;

  // Solid lines: one straight to the reference; from the spec, a stem straight down to the first page
  // (which sits under it) and a bus along to the others, each dropping straight to its page
  const cx = (i) => 40 + i * (EW + 16) + EW / 2;
  const BUS = 238;
  const TIP = EY - 3;
  const toRef = elbow([212, 152], [296, 152]);
  const stem = elbow([cx(0), 214], [cx(0), TIP]);
  const busLine = elbow([cx(0), BUS], [cx(3), BUS], [cx(3), TIP]);
  const drops = [1, 2].map((i) => elbow([cx(i), BUS], [cx(i), TIP]));
  const arrow = (d, color = C.amber, marker = "ahAmber") =>
    `<path d="${d}" fill="none" stroke="${color}" stroke-opacity=".9" stroke-width="1.8" stroke-linejoin="round" marker-end="url(#${marker})"/>`;

  const body = `
<text x="40" y="44" font-size="17" font-weight="700" fill="${C.text}">Where it fits</text>
<text x="40" y="65" font-size="12.5" fill="${C.muted}">The full reference lives on the docs site; the one operation a page talks about goes in that page.</text>
${arrow(toRef, C.muted, "ah")}
${arrow(stem)}
${arrow(busLine)}
${drops.map((d) => arrow(d)).join("\n")}
${spec}
${ref}
<text x="${(cx(1) + cx(2)) / 2}" y="228" font-size="11" fill="${C.amber}" text-anchor="middle" class="mono">&lt;rapi-doc-mini filter-operations="…"&gt;</text>
${embedSvg}
<text x="40" y="424" font-size="11.5" fill="${C.muted}">Same spec, same Try. No iframe: the page's own styles and layout around it.</text>
`;
  return svg(
    W,
    H,
    "Where RapiDoc Mini fits",
    "One OpenAPI spec feeds the full reference on the docs site, rendered by rapi-doc, and single operations embedded with rapi-doc-mini in a blog post, a tutorial step, a changelog entry and a dashboard.",
    t,
    body,
  );
}

writeFileSync(join(OUT, "mini-where-it-fits.svg"), whereItFits());
console.log("mini-where-it-fits.svg");
