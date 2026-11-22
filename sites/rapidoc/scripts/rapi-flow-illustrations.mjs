// Generates the animated SVG illustrations of the RapiFlow feature page
// (pages/rapi-flow.astro) into public/assets/images/rapi-flow/.
//
//   node sites/rapidoc/scripts/rapi-flow-illustrations.mjs
//
// Each SVG is self-contained (CSS keyframes inside, no scripts, system fonts), so it animates
// when loaded with <img>. One timeline per file: every animated element has its own keyframes
// over the same loop. With prefers-reduced-motion, the animations stop and each SVG shows its
// finished state (a completed run).
//
// workflow-diagram.svg is not drawn here: it is the orderOrReserve workflow of
// public/specs/petstore.arazzo.yaml as rapi-flow draws it (renderArazzoWorkflow of
// @rapidoc/prerender, which must be built: npm run build:prerender), with the ember theme's dark
// tokens inside, so it looks like <rapi-flow theme="ember" color-scheme="dark">.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { getFlowCss, getThemeTokensCss, renderArazzoWorkflow } from "@rapidoc/prerender";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BOX_R,
  C,
  METHOD,
  chips,
  dataLine,
  edge,
  elbow,
  esc,
  step,
  svg,
  timeline,
  valueChip,
} from "./illustration-kit.mjs";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "../public/assets/images/rapi-flow");

/* ------------------------------------------------------------------------------------------ */
/* 1. Hero: a run of adoptPet, step by step, with a retry and the values passed along          */
/* ------------------------------------------------------------------------------------------ */

function heroRun() {
  const t = timeline(11);
  const END = 91;
  const W = 760;
  const H = 600;

  const S1 = {
    x: 40,
    y: 160,
    idx: 1,
    id: "findAvailable",
    method: "GET",
    path: "/pet/findByStatus",
  };
  const S2 = { x: 450, y: 232, idx: 2, id: "placeOrder", method: "POST", path: "/store/order" };
  const S3 = { x: 40, y: 334, idx: 3, id: "getOrder", method: "GET", path: "/store/order/{id}" };

  const e0 = elbow([130, 128], [130, 143], [165, 143], [165, 158]);
  const e1 = elbow([290, 186], [392, 186], [392, 258], [448, 258]);
  const e2 = elbow([545, 310], [545, 360], [292, 360]);
  const e3 = elbow([165, 412], [165, 452], [448, 452]);
  const retry = elbow([700, 254], [732, 254], [732, 292], [702, 292]);
  const d1 = elbow([290, 216], [330, 216], [330, 288], [448, 288]);
  const d2 = elbow([625, 310], [625, 392], [292, 392]);

  const body = `
<!-- header -->
<text x="40" y="44" font-size="19" font-weight="700" fill="${C.text}" class="mono">adoptPet</text>
<text x="40" y="66" font-size="12.5" fill="${C.muted}">Adopt an available pet · petstore.arazzo.yaml</text>
<g class="fb ${t.press(3)}">
  <rect x="548" y="26" width="172" height="38" rx="${BOX_R}" fill="${C.amber}"/>
  <g opacity=".3"><rect x="548" y="26" width="172" height="38" rx="${BOX_R}" fill="#fff" class="${t.show([[2.5, 5]], 1)} rm0"/></g>
  <path d="M573 38 L585 45 L573 52 Z" fill="#1a1204"/>
  <text x="595" y="50" font-size="14" font-weight="700" fill="#1a1204">Run workflow</text>
</g>
<rect x="40" y="80" width="680" height="2" rx="1" fill="rgba(148,163,184,0.12)"/>
<rect x="40" y="80" width="680" height="2" rx="1" fill="${C.amber}" class="fl ${t.grow(3, 80, END, END + 3)}"/>

<!-- inputs -->
<rect x="40" y="94" width="196" height="34" rx="17" fill="${C.node}" stroke="${C.nodeStroke}"/>
<rect x="40" y="94" width="196" height="34" rx="17" fill="none" stroke="${C.amber}" class="${t.show([[3, 7]])} rm0"/>
<text x="58" y="115.5" font-size="10.5" font-weight="700" fill="${C.dim}" letter-spacing=".08em">INPUTS</text>
<text x="112" y="116" font-size="12" fill="${C.text}" class="mono">quantity: <tspan fill="${C.amber}">1</tspan></text>

<!-- edges -->
${edge(t, e0, { a: 5, b: 11, lit: t.ramp(5, 11, END, END + 3) })}
${edge(t, e1, { a: 22, b: 30, lit: t.ramp(22, 30, END, END + 3) })}
${edge(t, e2, { a: 57, b: 64, lit: t.ramp(57, 64, END, END + 3) })}
${edge(t, e3, { a: 73, b: 80, lit: t.ramp(73, 80, END, END + 3) })}

<!-- retry loop on placeOrder -->
<path d="${retry}" fill="none" stroke="rgba(246,168,33,0.28)" stroke-width="1.6" stroke-dasharray="3 4" marker-end="url(#ahAmber)"/>
<path d="${retry}" pathLength="100" class="${t.comet(40, 47)} rm0" fill="none" stroke="#fff4dc" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="16 200"/>
<text x="738" y="330" font-size="10.5" fill="${C.amber}" fill-opacity=".8" text-anchor="end" class="mono">retry · 503 · 2s</text>

<!-- values passed between steps -->
${dataLine(t, d1, [[24, END]])}
${dataLine(t, d2, [[58, END]])}
${valueChip(t, 330, 254, "petId = 1042", [[25, END]])}
${valueChip(t, 470, 392, "orderId = 7", [[59, END]])}

<!-- steps -->
${step(t, { ...S1, running: [[12, 22]], done: [[22, END]] })}
${chips(t, S1.x + 236, S1.y + 14, {
  idle: [
    [0, 11],
    [END + 2, 100],
  ],
  running: [[12, 22]],
  done: [[[22, END]], "200"],
})}
${step(t, {
  ...S2,
  running: [
    [31, 39],
    [48, 57],
  ],
  done: [[57, END]],
})}
${chips(t, S2.x + 236, S2.y + 14, {
  idle: [
    [0, 30],
    [END + 2, 100],
  ],
  running: [
    [31, 39],
    [48, 57],
  ],
  fail: [[[[39, 47]], "503"]],
  done: [[[57, END]], "200"],
})}
${step(t, { ...S3, running: [[65, 73]], done: [[73, END]] })}
${chips(t, S3.x + 236, S3.y + 14, {
  idle: [
    [0, 64],
    [END + 2, 100],
  ],
  running: [[65, 73]],
  done: [[[73, END]], "200"],
})}

<!-- outputs -->
<rect x="450" y="420" width="250" height="64" rx="${BOX_R}" fill="${C.node}" stroke="${C.nodeStroke}"/>
<rect x="450" y="420" width="250" height="64" rx="${BOX_R}" fill="none" stroke="${C.amber}" stroke-width="1.6" class="${t.show([[80, END]])}"/>
<text x="466" y="442" font-size="10.5" font-weight="700" fill="${C.dim}" letter-spacing=".08em">OUTPUTS</text>
<text x="466" y="468" font-size="13" fill="${C.text}" class="mono">orderId</text>
<text x="530" y="468" font-size="11" fill="${C.dim}" class="mono">← getOrder</text>
<text x="684" y="468" font-size="13" fill="${C.dim}" text-anchor="end" class="mono ${t.show([
    [0, 79],
    [END + 2, 100],
  ])} rm0">—</text>
<text x="684" y="468" font-size="15" font-weight="700" fill="${C.amber}" text-anchor="end" class="mono ${t.show([[80, END]])}">7</text>

<!-- run log -->
<rect x="40" y="504" width="680" height="76" rx="${BOX_R}" fill="#070b16" stroke="rgba(255,255,255,0.06)"/>
${[
  [22, "GET ", "/pet/findByStatus?status=available", "200", C.green, "84 ms"],
  [39, "POST", "/store/order", "503", C.red, "retry in 2 s"],
  [57, "POST", "/store/order", "200", C.green, "attempt 2"],
  [73, "GET ", "/store/order/7", "200", C.green, "61 ms"],
]
  .map(
    ([at, m, p, code, col, note], i) =>
      `<g class="${t.show([[at, END]])}"><text x="56" y="${523 + i * 15.5}" font-size="11" class="mono" fill="${C.dim}">›</text><text x="70" y="${523 + i * 15.5}" font-size="11" class="mono" fill="${METHOD[m.trim()]}">${m}</text><text x="108" y="${523 + i * 15.5}" font-size="11" class="mono" fill="${C.muted}">${esc(p)}</text><text x="600" y="${523 + i * 15.5}" font-size="11" font-weight="700" class="mono" fill="${col}" text-anchor="end">${code}</text><text x="704" y="${523 + i * 15.5}" font-size="11" class="mono" fill="${C.dim}" text-anchor="end">${note}</text></g>`,
  )
  .join("\n")}
`;
  return svg(
    W,
    H,
    "A RapiFlow workflow run",
    "The adoptPet workflow runs step by step: findAvailable returns a pet id, placeOrder fails with 503 and retries, getOrder reads the order back, and the outputs fill in.",
    t,
    body,
  );
}

/* ------------------------------------------------------------------------------------------ */
/* 2. Branches: a step's onSuccess / onFailure actions: retry, goto, end                        */
/* ------------------------------------------------------------------------------------------ */

function branches() {
  const t = timeline(14);
  const W = 760;
  const H = 440;
  const S = { x: 40, y: 178, idx: 2, id: "placeOrder", method: "POST", path: "/store/order" };
  const D = { cx: 368, cy: 217 };

  const toD = "M290 217 L346 217";
  const toGoto = elbow([368, 195], [368, 92], [486, 92]);
  const toRetry = "M392 217 L486 217";
  const toEnd = elbow([368, 239], [368, 342], [486, 342]);
  const back = elbow([604, 251], [604, 292], [165, 292], [165, 265]);

  const action = (y, color, kind, label, crit, segs) => `
<rect x="488" y="${y}" width="232" height="64" rx="${BOX_R}" fill="${C.node}" stroke="${C.nodeStroke}"/>
<rect x="488" y="${y}" width="232" height="64" rx="${BOX_R}" fill="${color}" fill-opacity=".06" stroke="${color}" stroke-width="1.6" class="${t.show(segs)} rm0"/>
<rect x="502" y="${y + 13}" width="${kind.length * 7.6 + 14}" height="18" rx="5" fill="${color}" fill-opacity=".15"/>
<text x="${509}" y="${y + 26}" font-size="10.5" font-weight="700" fill="${color}" class="mono">${kind}</text>
<text x="${520 + kind.length * 7.6}" y="${y + 26.5}" font-size="12.5" fill="${C.text}" class="mono">${esc(label)}</text>
<text x="502" y="${y + 50}" font-size="11" fill="${C.muted}" class="mono">${esc(crit)}</text>`;

  const body = `
<text x="40" y="44" font-size="17" font-weight="700" fill="${C.text}">Success and failure actions</text>
<text x="40" y="65" font-size="12.5" fill="${C.muted}">Every branch an Arazzo step declares is part of the diagram, and of the run.</text>

${edge(t, toD, {
  runs: [
    [12, 16],
    [48, 52],
    [79, 83],
  ],
  lit: t.show([
    [14, 22],
    [50, 56],
    [81, 88],
  ]),
})}
${edge(t, toRetry, { a: 17, b: 23, lit: t.show([[18, 40]]), color: C.amber, marker: "ahAmber" })}
${edge(t, toGoto, { a: 53, b: 59, lit: t.show([[55, 72]]), color: C.green, marker: "ahGreen" })}
${edge(t, toEnd, { a: 84, b: 90, lit: t.show([[86, 98]]), color: C.red, marker: "ahRed" })}
${edge(t, back, { a: 34, b: 42, lit: t.show([[36, 46]]), color: C.amber, marker: "ahAmber", dashed: true })}
<text x="596" y="284" font-size="10.5" fill="${C.amber}" fill-opacity=".8" text-anchor="end" class="mono">retry · attempt 2 of 3</text>

<!-- decision -->
<g>
  <rect x="${D.cx - 15}" y="${D.cy - 15}" width="30" height="30" rx="5" transform="rotate(45 ${D.cx} ${D.cy})" fill="${C.node}" stroke="${C.nodeStroke}"/>
  <rect x="${D.cx - 15}" y="${D.cy - 15}" width="30" height="30" rx="5" transform="rotate(45 ${D.cx} ${D.cy})" fill="none" stroke="${C.amber}" stroke-width="1.6" class="${t.show(
    [
      [15, 19],
      [51, 55],
      [82, 86],
    ],
  )} rm0"/>
  <text x="${D.cx}" y="${D.cy + 4}" font-size="11" font-weight="700" fill="${C.muted}" text-anchor="middle">?</text>
</g>

${action(60, C.green, "goto", "getOrder", "$statusCode == 200", [[58, 72]])}
${action(185, C.amber, "retry", "after 2s · max 3", "$statusCode == 503", [[22, 38]])}
${action(310, C.red, "end", "noStock", "$statusCode == 404", [[89, 98]])}

<!-- the retry countdown -->
<g class="${t.show([[22, 36]])} rm0">
  <circle cx="696" cy="217" r="9" fill="none" stroke="rgba(246,168,33,0.25)" stroke-width="2.4"/>
  <circle cx="696" cy="217" r="9" fill="none" stroke="${C.amber}" stroke-width="2.4" pathLength="100" stroke-dasharray="100" transform="rotate(-90 696 217)" class="${t.add(
    [
      [0, "stroke-dashoffset:0"],
      [22, "stroke-dashoffset:0"],
      [36, "stroke-dashoffset:100"],
      [100, "stroke-dashoffset:100"],
    ],
  )}"/>
</g>

${step(t, {
  ...S,
  running: [
    [4, 12],
    [42, 48],
    [73, 79],
  ],
})}
${chips(t, S.x + 236, S.y + 14, {
  idle: [
    [0, 3],
    [98.5, 100],
  ],
  running: [
    [4, 12],
    [42, 48],
    [73, 79],
  ],
  fail: [
    [[[12, 41]], "503"],
    [[[79, 98]], "404"],
  ],
  done: [[[48, 72]], "200"],
})}
<text x="40" y="318" font-size="11" fill="${C.dim}" class="mono">
  <tspan class="${t.show([[4, 40]])}">run 1 · store busy</tspan>
</text>
<text x="40" y="318" font-size="11" fill="${C.dim}" class="mono ${t.show([[42, 72]])} rm0">run 1 · second attempt</text>
<text x="40" y="318" font-size="11" fill="${C.dim}" class="mono ${t.show([[73, 98]])} rm0">run 2 · out of stock</text>
<text x="40" y="410" font-size="11.5" fill="${C.muted}" class="mono">onSuccess: [ goto ]   onFailure: [ retry, end ]</text>
`;
  return svg(
    W,
    H,
    "Success and failure branches in RapiFlow",
    "placeOrder answers 503 and its retry action runs it again; the second attempt answers 200 and goto moves on to getOrder. In a second run it answers 404 and the end action stops the workflow.",
    t,
    body,
  );
}

/* ------------------------------------------------------------------------------------------ */
/* 3. One runtime: the same workflow in the browser, for an AI agent, in the portal            */
/* ------------------------------------------------------------------------------------------ */

function oneRuntime() {
  const t = timeline(10);
  const END = 90;
  const W = 760;
  const H = 420;

  const card = (x, y, w, h, segs) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${BOX_R}" fill="${C.node}" stroke="${C.nodeStroke}"/>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${BOX_R}" fill="none" stroke="${C.amber}" stroke-width="1.6" class="${t.show(segs)} rm0"/>`;

  const yaml = [
    ["arazzo", "1.0.1", 0],
    ["workflows", "", 0],
    ["- workflowId", "adoptPet", 1],
    ["steps", "", 2],
    ["- stepId", "findAvailable", 3],
    ["- stepId", "placeOrder", 3],
    ["- stepId", "getOrder", 3],
  ];

  const hubX = 300;
  const hubY = 168;
  const targets = [
    { y: 40, at: 22, icon: "browser", title: "Browser", line: "Run workflow ▸ 3 steps ✓" },
    { y: 168, at: 42, icon: "agent", title: "AI agent · MCP", line: "tools/call adoptPet" },
    { y: 296, at: 62, icon: "portal", title: "Developer portal", line: "{% workflow %} → SVG" },
  ];
  const icon = (kind, x, y) =>
    ({
      browser: `<rect x="${x}" y="${y}" width="22" height="18" rx="3" fill="none" stroke="${C.muted}" stroke-width="1.5"/><path d="M${x} ${y + 5} h22" stroke="${C.muted}" stroke-width="1.5"/>`,
      agent: `<rect x="${x + 1}" y="${y + 3}" width="20" height="15" rx="5" fill="none" stroke="${C.muted}" stroke-width="1.5"/><circle cx="${x + 7.5}" cy="${y + 10.5}" r="1.8" fill="${C.muted}"/><circle cx="${x + 14.5}" cy="${y + 10.5}" r="1.8" fill="${C.muted}"/><path d="M${x + 11} ${y + 3} v-3" stroke="${C.muted}" stroke-width="1.5"/>`,
      portal: `<path d="M${x + 2} ${y + 2} h7 a4 4 0 0 1 2 1 a4 4 0 0 1 2 -1 h7 v15 h-7 a3 3 0 0 0 -2 1 a3 3 0 0 0 -2 -1 h-7 z" fill="none" stroke="${C.muted}" stroke-width="1.5" stroke-linejoin="round"/>`,
    })[kind];

  const body = `
<!-- the Arazzo spec -->
${card(40, 112, 196, 196, [[3, 12]])}
<text x="56" y="138" font-size="10.5" font-weight="700" fill="${C.dim}" letter-spacing=".08em">ARAZZO SPEC</text>
${yaml
  .map(
    ([k, v, ind], i) =>
      `<text x="${56 + ind * 10}" y="${166 + i * 19}" font-size="11.5" class="mono" fill="${C.violet}">${esc(k)}<tspan fill="${C.dim}">:</tspan>${v ? ` <tspan fill="${C.text}">${esc(v)}</tspan>` : ""}</text>
<rect x="48" y="${153 + i * 19}" width="180" height="18" rx="4" fill="${C.amber}" fill-opacity=".10" class="${t.show([[3 + i, 5 + i]], 0.8)} rm0"/>`,
  )
  .join("\n")}

${edge(t, `M238 210 L${hubX - 4} 210`, { a: 11, b: 15, lit: t.ramp(11, 15, END, END + 3) })}

<!-- the runtime -->
<g opacity=".2"><rect x="${hubX}" y="${hubY}" width="170" height="84" rx="${BOX_R}" fill="${C.amber}" class="${t.show([[15, END]])} rm0" filter="url(#soft)"/></g>
${card(hubX, hubY, 170, 84, [[15, END]])}
<text x="${hubX + 85}" y="${hubY + 34}" font-size="14" font-weight="700" fill="${C.text}" text-anchor="middle">Workflow runtime</text>
<text x="${hubX + 85}" y="${hubY + 56}" font-size="11" fill="${C.muted}" text-anchor="middle" class="mono">RapiDoc MCP manifest</text>
<g class="${t.show([[15, END]])} rm0">
  <circle cx="${hubX + 85}" cy="${hubY + 70}" r="2.5" fill="${C.amber}"><animate attributeName="opacity" values="1;.2;1" dur="1.2s" repeatCount="indefinite"/></circle>
</g>

${targets
  .map((g, i) => {
    const d = elbow([hubX + 172, 210], [500, 210], [500, g.y + 42], [526, g.y + 42]);
    return `${edge(t, d, { a: g.at - 6, b: g.at, lit: t.ramp(g.at - 6, g.at, END, END + 3) })}
${card(528, g.y, 192, 84, [[g.at, g.at + 8]])}
${icon(g.icon, 544, g.y + 14)}
<text x="576" y="${g.y + 29}" font-size="13.5" font-weight="650" fill="${C.text}">${g.title}</text>
<text x="544" y="${g.y + 62}" font-size="11.5" fill="${C.dim}" class="mono ${t.show([
      [0, g.at],
      [END + 2, 100],
    ])} rm0">waiting…</text>
<text x="544" y="${g.y + 62}" font-size="11.5" fill="${i === 0 ? C.green : C.amber}" class="mono ${t.show([[g.at + 1, END]])}">${esc(g.line)}</text>`;
  })
  .join("\n")}
`;
  return svg(
    W,
    H,
    "One workflow runtime, three places",
    "One Arazzo spec feeds RapiFlow's workflow runtime, which runs the workflow in the browser, serves it to AI agents as an MCP tool and draws it in the developer portal.",
    t,
    body,
  );
}

/** The orderOrReserve workflow, drawn by rapi-flow's own renderer, as a standalone image. */
function workflowDiagram() {
  const specs = join(dirname(fileURLToPath(import.meta.url)), "../public/specs");
  const { svg, problems } = renderArazzoWorkflow(
    readFileSync(join(specs, "petstore.arazzo.yaml"), "utf8"),
    {
      workflowId: "orderOrReserve",
      sources: { petstore: readFileSync(join(specs, "petstore.yaml"), "utf8") },
      view: "compact",
      idPrefix: "rf-page",
    },
  );
  if (problems.length)
    throw new Error(`orderOrReserve: ${problems.map((p) => p.message).join("; ")}`);
  // In a standalone SVG, :root is the <svg>: the theme tokens apply to it, dark whatever the OS says
  // The site's navy in place of the theme's greys: the tokens sites/shared/styles/dark.css gives
  // the workflows embedded in docs, and the site's amber (--rd-accent) for steps and highlights
  const navy = `:root[data-theme="dark"]{--background:#060913;--foreground:#cbd5e1;--card:#0f1626;--muted:#162035;--muted-foreground:#94a3b8;--border:rgba(255,255,255,0.1);--primary:#f6a821}`;
  const css = getThemeTokensCss("ember") + getFlowCss() + navy;
  return `${svg.replace(/^<svg ([^>]*)>/, `<svg $1 data-theme="dark"><style><![CDATA[${css}]]></style>`)}\n`;
}

mkdirSync(OUT, { recursive: true });
const files = {
  "workflow-diagram.svg": workflowDiagram(),
  "workflow-run.svg": heroRun(),
  "workflow-branches.svg": branches(),
  "workflow-one-runtime.svg": oneRuntime(),
};
for (const [name, content] of Object.entries(files)) {
  writeFileSync(join(OUT, name), content);
  console.log(`${name}  ${(content.length / 1024).toFixed(1)} KB`);
}
