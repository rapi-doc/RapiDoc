// Building blocks of the animated SVG illustrations of rapidocui.com's feature pages: colors, fonts,
// a keyframe timeline, edges with travelling pulses, status chips, step boxes, the panel and the SVG
// wrapper. Each product has its own generator (rapi-flow-illustrations.mjs, rapi-mock-illustrations.mjs).
//
// Every SVG is self-contained (CSS keyframes inside, no scripts, system fonts), so it animates when loaded
// with <img>. One timeline per file: every animated element has its own keyframes over the same loop.
// With prefers-reduced-motion the animations stop and the SVG shows its finished state.

export const C = {
  panel: "#0b1222",
  node: "#101a2e",
  nodeStroke: "rgba(148,163,184,0.20)",
  edge: "rgba(148,163,184,0.28)",
  text: "#e2e8f0",
  muted: "#94a3b8",
  dim: "#64748b",
  amber: "#f6a821",
  green: "#34d399",
  red: "#f87171",
  cyan: "#38bdf8",
  blue: "#60a5fa",
  violet: "#a78bfa",
};
export const SANS = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
export const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
export const METHOD = { GET: C.blue, POST: C.green, PUT: C.amber, DELETE: C.red };

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export const pct = (n) => `${+n.toFixed(2)}%`;

/** Corner radius of the lines between boxes, and of the boxes: rapi-flow's (utils/arazzo/svg.js). */
export const CORNER_R = 6;
export const BOX_R = 8;

/**
 * A right-angled line through `points`, each corner rounded with a quadratic curve of up to
 * CORNER_R, as rapi-flow draws its lines (roundedPath in packages/rapidoc/src/utils/arazzo/svg.js).
 */
export function elbow(...input) {
  // Repeated points would make a zero-length segment, and no direction to round the corner in
  const points = input.filter(
    (p, i) => i === 0 || p[0] !== input[i - 1][0] || p[1] !== input[i - 1][1],
  );
  const n = (v) => String(Math.round(v * 100) / 100);
  let d = `M${n(points[0][0])} ${n(points[0][1])}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i - 1];
    const [cx, cy] = points[i];
    const [nx, ny] = points[i + 1];
    const l1 = Math.hypot(cx - px, cy - py);
    const l2 = Math.hypot(nx - cx, ny - cy);
    const r = Math.min(CORNER_R, l1 / 2, l2 / 2);
    d += `L${n(cx - ((cx - px) / l1) * r)} ${n(cy - ((cy - py) / l1) * r)}`;
    d += `Q${n(cx)} ${n(cy)} ${n(cx + ((nx - cx) / l2) * r)} ${n(cy + ((ny - cy) / l2) * r)}`;
  }
  const last = points.at(-1);
  return `${d}L${n(last[0])} ${n(last[1])}`;
}

/** One SVG's animation registry: keyframes are collected and written into its <style>. */
export function timeline(seconds) {
  let n = 0;
  const rules = [];
  const add = (frames, easing = "linear") => {
    const name = `k${++n}`;
    rules.push(
      `@keyframes ${name}{${frames.map(([p, css]) => `${pct(p)}{${css}}`).join("")}}`,
      `.${name}{animation:${name} ${seconds}s ${easing} infinite}`,
    );
    return name;
  };
  return {
    add,
    /** Opacity 1 during each [from, to] segment (percent of the loop), fading in and out. */
    show(segments, fade = 1.2) {
      if (!segments.length)
        return add([
          [0, "opacity:0"],
          [100, "opacity:0"],
        ]);
      const frames = [];
      const at = (p, o) => frames.push([Math.min(100, Math.max(0, p)), `opacity:${o}`]);
      if (segments[0][0] > 0) at(0, 0);
      for (const [a, b] of segments) {
        if (a > 0) at(a - fade, 0);
        at(a, 1);
        at(b, 1);
        if (b < 100) at(b + fade, 0);
      }
      if (segments.at(-1)[1] < 100) at(100, 0);
      frames.sort((x, y) => x[0] - y[0]);
      return add(frames);
    },
    /** A bright dash that travels along a path with pathLength="100" between a and b. */
    comet(a, b, len = 16) {
      return add([
        [0, `stroke-dashoffset:${len + 6}`],
        [a, `stroke-dashoffset:${len + 6};animation-timing-function:cubic-bezier(.45,0,.3,1)`],
        [b, "stroke-dashoffset:-106"],
        [100, "stroke-dashoffset:-106"],
      ]);
    },
    /** Opacity ramps from 0 at a to 1 at b, holds until c, fades by d. */
    ramp(a, b, c, d) {
      return add([
        [0, "opacity:0"],
        [a, "opacity:0"],
        [b, "opacity:1"],
        [c, "opacity:1"],
        [d, "opacity:0"],
        [100, "opacity:0"],
      ]);
    },
    /** A horizontal scale from 0 to 1 between a and b, held to c, back to 0 by d. */
    grow(a, b, c, d) {
      return add([
        [0, "transform:scaleX(0)"],
        [a, "transform:scaleX(0)"],
        [b, "transform:scaleX(1)"],
        [c, "transform:scaleX(1)"],
        [d, "transform:scaleX(0)"],
        [100, "transform:scaleX(0)"],
      ]);
    },
    /** A press: scale down and back at p. */
    press(p) {
      return add([
        [0, "transform:scale(1)"],
        [p - 1, "transform:scale(1)"],
        [p, "transform:scale(.94)"],
        [p + 1.5, "transform:scale(1)"],
        [100, "transform:scale(1)"],
      ]);
    },
    style(extra = "") {
      return `<style>
text{font-family:${SANS}}
.mono{font-family:${MONO}}
.fb{transform-box:fill-box;transform-origin:center}
.fl{transform-box:fill-box;transform-origin:left center}
.spin{animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.flow{animation:flow 1.4s linear infinite}
@keyframes flow{to{stroke-dashoffset:-20}}
${rules.join("\n")}
${extra}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.rm0{opacity:0}}
</style>`;
    },
  };
}

/** Defs shared by every SVG: glow filters, arrowheads, the canvas dot grid. */
export function defs() {
  const marker = (id, fill) =>
    `<marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 L9 5 L1 9 Z" fill="${fill}"/></marker>`;
  return `<defs>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="soft" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="10"/></filter>
<pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.1" fill="rgba(148,163,184,0.10)"/></pattern>
<linearGradient id="panelFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1528"/><stop offset="1" stop-color="#080d1a"/></linearGradient>
${marker("ah", "rgba(148,163,184,0.45)")}
${marker("ahAmber", C.amber)}
${marker("ahGreen", C.green)}
${marker("ahRed", C.red)}
${marker("ahCyan", C.cyan)}
</defs>`;
}

export function panel(w, h) {
  return `<rect x="8" y="8" width="${w - 16}" height="${h - 16}" rx="18" fill="url(#panelFade)" stroke="rgba(255,255,255,0.08)"/>
<rect x="8" y="8" width="${w - 16}" height="${h - 16}" rx="18" fill="url(#dots)"/>`;
}

/** An edge: the faint base line, a lit copy that fades in, and a travelling comet with a glow. */
export function edge(
  t,
  d,
  { a, b, runs = [[a, b]], lit, color = C.amber, marker = "ahAmber", dashed = false },
) {
  const dash = dashed ? ` stroke-dasharray="5 5"` : "";
  return `<path d="${d}" fill="none" stroke="${C.edge}" stroke-width="1.6"${dash} marker-end="url(#ah)"/>
<path d="${d}" class="${lit}" fill="none" stroke="${color}" stroke-opacity=".75" stroke-width="1.8"${dash} marker-end="url(#${marker})"/>
${runs
  .map(
    ([
      from,
      to,
    ]) => `<g opacity=".4"><path d="${d}" pathLength="100" class="${t.comet(from, to)} rm0" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" stroke-dasharray="16 200" filter="url(#soft)"/></g>
<path d="${d}" pathLength="100" class="${t.comet(from, to)} rm0" fill="none" stroke="#fff4dc" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="16 200"/>`,
  )
  .join("\n")}`;
}

/** Status chips at the top right of a step box; `states` maps a chip to its visible segments. */
export function chips(t, x, y, states) {
  const chip = (cls, w, fill, stroke, inner) =>
    `<g class="${cls}"><rect x="${x - w}" y="${y}" width="${w}" height="22" rx="11" fill="${fill}" stroke="${stroke}"/>${inner(x - w)}</g>`;
  const out = [];
  if (states.idle)
    out.push(
      chip(
        `${t.show(states.idle)} rm0`,
        52,
        "rgba(148,163,184,0.08)",
        "rgba(148,163,184,0.25)",
        (x0) =>
          `<circle cx="${x0 + 13}" cy="${y + 11}" r="3" fill="${C.dim}"/><text x="${x0 + 21}" y="${y + 15}" font-size="10" font-weight="600" fill="${C.muted}" letter-spacing=".04em">IDLE</text>`,
      ),
    );
  for (const run of states.running ?? [])
    out.push(
      chip(
        `${t.show([run])} rm0`,
        64,
        "rgba(246,168,33,0.12)",
        "rgba(246,168,33,0.55)",
        (x0) =>
          `<g class="fb spin" style="transform-origin:${x0 + 13}px ${y + 11}px;transform-box:view-box"><circle cx="${x0 + 13}" cy="${y + 11}" r="5" fill="none" stroke="${C.amber}" stroke-width="2" stroke-dasharray="20 12" stroke-linecap="round"/></g><text x="${x0 + 23}" y="${y + 15}" font-size="10" font-weight="700" fill="${C.amber}" letter-spacing=".04em">RUN</text>`,
      ),
    );
  for (const [segs, code] of states.fail ?? [])
    out.push(
      chip(
        `${t.show(segs)} rm0`,
        56,
        "rgba(248,113,113,0.12)",
        "rgba(248,113,113,0.55)",
        (x0) =>
          `<path d="M${x0 + 10} ${y + 7} l8 8 M${x0 + 18} ${y + 7} l-8 8" stroke="${C.red}" stroke-width="2" stroke-linecap="round"/><text x="${x0 + 24}" y="${y + 15}" font-size="11" font-weight="700" fill="${C.red}" class="mono">${code}</text>`,
      ),
    );
  if (states.done)
    out.push(
      chip(
        t.show(states.done[0]),
        56,
        "rgba(52,211,153,0.12)",
        "rgba(52,211,153,0.55)",
        (x0) =>
          `<path d="M${x0 + 9} ${y + 11} l4 4 l7 -8" fill="none" stroke="${C.green}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><text x="${x0 + 24}" y="${y + 15}" font-size="11" font-weight="700" fill="${C.green}" class="mono">${states.done[1]}</text>`,
      ),
    );
  return out.join("\n");
}

/** A step box: index, stepId, method badge and path, plus the running and done outlines. */
export function step(t, { x, y, w = 250, h = 78, idx, id, method, path, running = [], done }) {
  const mColor = METHOD[method];
  const mw = method.length * 7.5 + 14;
  return `<g>
<g opacity=".22"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${BOX_R}" fill="${C.amber}" class="${t.show(running)} rm0" filter="url(#soft)"/></g>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${BOX_R}" fill="${C.node}" stroke="${C.nodeStroke}"/>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${BOX_R}" fill="none" stroke="${C.amber}" stroke-width="1.6" class="${t.show(running)} rm0"/>
${done ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${BOX_R}" fill="rgba(52,211,153,0.04)" stroke="${C.green}" stroke-opacity=".55" stroke-width="1.4" class="${t.show(done)}"/>` : ""}
<circle cx="${x + 26}" cy="${y + 26}" r="11" fill="rgba(148,163,184,0.10)" stroke="rgba(148,163,184,0.25)"/>
<text x="${x + 26}" y="${y + 30}" font-size="11" font-weight="700" fill="${C.muted}" text-anchor="middle">${idx}</text>
<text x="${x + 46}" y="${y + 31}" font-size="14.5" font-weight="650" fill="${C.text}" class="mono">${esc(id)}</text>
<rect x="${x + 16}" y="${y + 46}" width="${mw}" height="19" rx="5" fill="${mColor}" fill-opacity=".14" stroke="${mColor}" stroke-opacity=".45"/>
<text x="${x + 16 + mw / 2}" y="${y + 59.5}" font-size="10" font-weight="700" fill="${mColor}" text-anchor="middle" class="mono">${method}</text>
<text x="${x + 24 + mw}" y="${y + 60}" font-size="12" fill="${C.muted}" class="mono">${esc(path)}</text>
</g>`;
}

/** A small value chip sitting on a data line. */
export function valueChip(t, cx, cy, label, segs, color = C.cyan) {
  const w = label.length * 7 + 22;
  return `<g class="${t.show(segs)}"><rect x="${cx - w / 2}" y="${cy - 11}" width="${w}" height="22" rx="11" fill="#0a1426" stroke="${color}" stroke-opacity=".6"/><text x="${cx}" y="${cy + 4}" font-size="11" fill="${color}" text-anchor="middle" class="mono">${esc(label)}</text></g>`;
}

/** A dashed data line that fades in and keeps flowing. */
export function dataLine(t, d, segs, color = C.cyan) {
  return `<path d="${d}" fill="none" stroke="${color}" stroke-opacity=".18" stroke-width="1.4" stroke-dasharray="4 6"/>
<path d="${d}" class="${t.show(segs)}" fill="none" stroke="${color}" stroke-opacity=".85" stroke-width="1.6" stroke-dasharray="4 6" marker-end="url(#ahCyan)"/>`;
}

export function svg(w, h, title, desc, t, body, extraStyle, { framed = true, crop } = {}) {
  // crop: [x, y, width, height], the part of the drawing to show
  const [vx, vy, vw, vh] = crop || [0, 0, w, h];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx} ${vy} ${vw} ${vh}" width="${vw}" height="${vh}" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title>
<desc id="d">${esc(desc)}</desc>
${defs()}
${t.style(extraStyle)}
${framed ? panel(w, h) : ""}
${body}
</svg>
`;
}

/* ------------------------------------------------------------------------------------------ */
/* Isometric scenes: a slab with boxes, labels and packets travelling between them             */
/* ------------------------------------------------------------------------------------------ */

// Isometric projection: world x runs to the lower right, y to the lower left, z up
export const K = 0.78;
export const COS = 0.866;
export const SIN = 0.5;
export const ORIGIN = [380, 178];
export const iso = (x, y, z = 0) => [
  ORIGIN[0] + (x - y) * COS * K,
  ORIGIN[1] + (x + y) * SIN * K - z * K,
];
export const pts = (...ps) =>
  ps
    .map((p) =>
      iso(...p)
        .map((n) => +n.toFixed(2))
        .join(","),
    )
    .join(" ");
export const round2 = (n) => +n.toFixed(2);

/** A box seen from above: its top, its front-left face (y = y + d) and its front-right face (x = x + w). */
export function isoBox(
  x,
  y,
  z,
  w,
  d,
  h,
  { top, left, right, stroke = "rgba(255,255,255,0.08)", cls = "" },
) {
  return `<g${cls ? ` class="${cls}"` : ""}>
<polygon points="${pts([x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h])}" fill="${left}" stroke="${stroke}"/>
<polygon points="${pts([x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h])}" fill="${right}" stroke="${stroke}"/>
<polygon points="${pts([x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h])}" fill="${top}" stroke="${stroke}"/>
</g>`;
}

/** The matrix that lays flat content onto a face: "top" (x right, y down), "left" (y = const), "right" (x = const). */
export function faceMatrix(face, x, y, z) {
  const [X, Y] = iso(x, y, z);
  const a = COS * K;
  const b = SIN * K;
  if (face === "top")
    return `matrix(${round2(a)},${round2(b)},${round2(-a)},${round2(b)},${round2(X)},${round2(Y)})`;
  if (face === "left")
    return `matrix(${round2(a)},${round2(b)},0,${round2(K)},${round2(X)},${round2(Y)})`;
  return `matrix(${round2(a)},${round2(-b)},0,${round2(K)},${round2(X)},${round2(Y)})`;
}

/** A floating label above a point, in screen space. */
export function isoTag(
  [X, Y],
  text,
  {
    color = C.text,
    fill = "#0d1528",
    border = "rgba(148,163,184,0.35)",
    mono = true,
    cls = "",
  } = {},
) {
  const w = text.length * (mono ? 7 : 6.6) + 22;
  return `<g${cls ? ` class="${cls}"` : ""}><rect x="${round2(X - w / 2)}" y="${round2(Y - 13)}" width="${round2(w)}" height="26" rx="6" fill="${fill}" stroke="${border}"/>
<text x="${round2(X)}" y="${round2(Y + 4.5)}" font-size="12" fill="${color}" text-anchor="middle"${mono ? ' class="mono"' : ""}>${esc(text)}</text></g>`;
}

/** Keyframes that carry a packet along screen points between a and b, by distance, hidden outside. */
export function travel(t, points, a, b) {
  const lens = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
  const total = lens.reduce((x, y) => x + y, 0);
  const at = (p) => `transform:translate(${round2(p[0])}px,${round2(p[1])}px)`;
  const frames = [
    [0, `${at(points[0])};opacity:0`],
    [a - 0.01, `${at(points[0])};opacity:0`],
    [a, `${at(points[0])};opacity:1`],
  ];
  let done = 0;
  lens.forEach((len, i) => {
    done += len;
    frames.push([a + ((b - a) * done) / total, `${at(points[i + 1])};opacity:1`]);
  });
  frames.push([b + 0.6, `${at(points.at(-1))};opacity:0`], [100, `${at(points.at(-1))};opacity:0`]);
  return t.add(frames);
}

/** A small glowing cube, drawn around (0, 0): a request or a response on its way. */
export function packet(color) {
  const a = COS * K * 9;
  const b = SIN * K * 9;
  const h = 10 * K;
  return `<g opacity=".55"><ellipse cx="0" cy="${round2(b)}" rx="${round2(a + 6)}" ry="${round2(b + 4)}" fill="${color}" filter="url(#soft)"/></g>
<polygon points="${round2(-a)},${round2(-h)} 0,${round2(b - h)} 0,${round2(b)} ${round2(-a)},0" fill="${color}" fill-opacity=".75"/>
<polygon points="0,${round2(b - h)} ${round2(a)},${round2(-h)} ${round2(a)},0 0,${round2(b)}" fill="${color}" fill-opacity=".55"/>
<polygon points="0,${round2(-b - h)} ${round2(a)},${round2(-h)} 0,${round2(b - h)} ${round2(-a)},${round2(-h)}" fill="#fff4dc"/>`;
}
