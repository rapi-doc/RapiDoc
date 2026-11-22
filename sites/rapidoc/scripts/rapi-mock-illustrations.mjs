// Generates the animated SVG illustrations of the RapiMock feature page (pages/rapi-mock.astro) into
// public/assets/images/rapi-mock/, with the building blocks of illustration-kit.mjs.
//
//   node sites/rapidoc/scripts/rapi-mock-illustrations.mjs
//
// What they show follows RapiMock's documentation (sites/rapi-mock/docs): requests checked against the
// spec and the token's scopes, records kept with --stateful, resources read off paths and schemas (the
// Stateful and Static labels), and a copy of the data per X-Mock-Session.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BOX_R,
  C,
  METHOD,
  edge,
  elbow,
  esc,
  svg,
  timeline,
  COS,
  K,
  SIN,
  faceMatrix,
  iso,
  isoBox,
  isoTag,
  packet,
  pts,
  round2,
  travel,
} from "./illustration-kit.mjs";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "../public/assets/images/rapi-mock");
const METHODS = { ...METHOD, PATCH: C.violet };

/** A method badge; returns its markup and width. */
function badge(x, y, method, size = 10) {
  const color = METHODS[method];
  const w = method.length * (size * 0.75) + 12;
  return {
    w,
    svg: `<rect x="${x}" y="${y}" width="${w}" height="${size + 9}" rx="4" fill="${color}" fill-opacity=".14" stroke="${color}" stroke-opacity=".45"/>
<text x="${x + w / 2}" y="${y + size + 3.5}" font-size="${size}" font-weight="700" fill="${color}" text-anchor="middle" class="mono">${method}</text>`,
  };
}

/** A card: the box, plus an amber outline over `active` and an optional colored one over `lit`. */
function card(t, x, y, w, h, { active = [], lit, litColor = C.green } = {}) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${BOX_R}" fill="${C.node}" stroke="${C.nodeStroke}"/>
${active.length ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${BOX_R}" fill="none" stroke="${C.amber}" stroke-width="1.6" class="${t.show(active)} rm0"/>` : ""}
${lit ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${BOX_R}" fill="none" stroke="${litColor}" stroke-opacity=".5" stroke-width="1.4" class="${t.show(lit)}"/>` : ""}`;
}

/** A status chip such as "201": green for 2xx, red otherwise. */
function statusChip(x, y, code) {
  const color = code < 300 ? C.green : C.red;
  return `<rect x="${x}" y="${y}" width="40" height="20" rx="10" fill="${color}" fill-opacity=".12" stroke="${color}" stroke-opacity=".55"/>
<text x="${x + 20}" y="${y + 14}" font-size="11" font-weight="700" fill="${color}" text-anchor="middle" class="mono">${code}</text>`;
}

const ok = (cx, cy) =>
  `<circle cx="${cx}" cy="${cy}" r="8" fill="#0d2a24" stroke="${C.green}" stroke-opacity=".7"/><path d="M${cx - 3.5} ${cy} l2.5 2.5 l4.5 -5" fill="none" stroke="${C.green}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
const fail = (cx, cy) =>
  `<circle cx="${cx}" cy="${cy}" r="8" fill="#2c1418" stroke="${C.red}" stroke-opacity=".7"/><path d="M${cx - 3} ${cy - 3} l6 6 M${cx + 3} ${cy - 3} l-6 6" stroke="${C.red}" stroke-width="1.8" stroke-linecap="round"/>`;
const pending = (cx, cy) =>
  `<circle cx="${cx}" cy="${cy}" r="8" fill="${C.node}" stroke="rgba(148,163,184,0.3)"/><circle cx="${cx}" cy="${cy}" r="2" fill="${C.dim}"/>`;

/* ------------------------------------------------------------------------------------------ */
/* 1. Hero: four requests to the mock, checked against the spec and the token, kept in pets    */
/* ------------------------------------------------------------------------------------------ */

function heroRequests() {
  const t = timeline(16);
  const END = 92;
  const W = 760;
  const H = 600;
  const SERVER = { x: 430, y: 116, w: 290, h: 150 };
  const STORE = { x: 430, y: 300, w: 290, h: 190 };
  const inY = SERVER.y + 75;

  // a: when the request is sent; checks: per row, true (passed), false (failed) or null (not reached)
  const requests = [
    {
      a: 4,
      method: "POST",
      path: "/pets",
      sent: '{ "name": "Biscuit" }',
      code: 201,
      reply: "Created · id 3",
      checks: [true, true, true],
      detail: [null, null, "+ Biscuit"],
      store: true,
    },
    {
      a: 26,
      method: "GET",
      path: "/pets",
      sent: "Accept: application/json",
      code: 200,
      reply: "3 pets, Biscuit included",
      checks: [true, true, true],
      detail: [null, null, "3 read"],
      store: true,
    },
    {
      a: 48,
      method: "POST",
      path: "/pets",
      sent: '{ "nam": "Rex" }',
      code: 400,
      reply: "body.name is required",
      checks: [false, null, null],
      detail: ["name is required", null, null],
    },
    {
      a: 70,
      method: "DELETE",
      path: "/pets/3",
      sent: "Bearer token · scope pets:read",
      code: 403,
      reply: "insufficient_scope: pets:write",
      checks: [true, false, null],
      detail: [null, "needs pets:write", null],
    },
  ];
  const rows = ["Valid against the spec", "Token and scopes", "Kept in pets"];

  const reqCards = requests
    .map((r, i) => {
      const y = 116 + i * 96;
      const b = badge(56, y + 14, r.method);
      const until = i === requests.length - 1 ? END : END;
      return `<g class="${t.show([[r.a, until]])}">
${card(t, 40, y, 330, 84, { active: [[r.a, r.a + 15]] })}
${b.svg}
<text x="${62 + b.w}" y="${y + 28}" font-size="13" fill="${C.text}" class="mono">${esc(r.path)}</text>
<text x="56" y="${y + 50}" font-size="11.5" fill="${C.muted}" class="mono">${esc(r.sent)}</text>
<g class="${t.show([[r.a + 15, until]])}">${statusChip(56, y + 57, r.code)}<text x="104" y="${y + 71}" font-size="11.5" fill="${r.code < 300 ? C.text : C.red}" class="mono">${esc(r.reply)}</text></g>
<text x="56" y="${y + 71}" font-size="11.5" fill="${C.dim}" class="mono ${t.show([[r.a, r.a + 14.5]])} rm0">waiting…</text>
</g>`;
    })
    .join("\n");

  const lines = requests
    .map((r, i) => {
      const yc = 116 + i * 96 + 42;
      const out = elbow([370, yc], [400, yc], [400, inY], [SERVER.x - 2, inY]);
      const back = elbow([SERVER.x - 2, inY], [400, inY], [400, yc], [372, yc]);
      const color = r.code < 300 ? C.green : C.red;
      return `${edge(t, out, { a: r.a + 1, b: r.a + 4, lit: t.show([[r.a + 2, r.a + 15]]) })}
<path d="${back}" pathLength="100" class="${t.comet(r.a + 11, r.a + 14.5)} rm0" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="16 200"/>`;
    })
    .join("\n");

  // The check rows: a dim dot, with a pass or fail mark over it while a request is being answered
  const checkRows = rows
    .map((label, r) => {
      const cy = SERVER.y + 62 + r * 28;
      const at = (q) => q.a + 5 + r * 2;
      const passes = requests.filter((q) => q.checks[r] === true).map((q) => [at(q), q.a + 20]);
      const fails = requests.filter((q) => q.checks[r] === false).map((q) => [at(q), q.a + 20]);
      const details = requests
        .map((q) => q.detail[r] && { q, text: q.detail[r] })
        .filter(Boolean)
        .map(
          ({ q, text }) =>
            `<text x="${SERVER.x + SERVER.w - 16}" y="${cy + 4}" font-size="10.5" fill="${q.checks[r] === false ? C.red : C.green}" text-anchor="end" class="mono ${t.show([[at(q), q.a + 20]])} rm0">${esc(text)}</text>`,
        )
        .join("\n");
      return `${pending(SERVER.x + 24, cy)}
<g class="${t.show(passes)} rm0">${ok(SERVER.x + 24, cy)}</g>
<g class="${t.show(fails)} rm0">${fail(SERVER.x + 24, cy)}</g>
<text x="${SERVER.x + 42}" y="${cy + 4}" font-size="12.5" fill="${C.text}">${label}</text>
${details}`;
    })
    .join("\n");

  // The store: two seeded pets, Biscuit added by the first request, all read by the second
  const [r1, r2] = requests;
  const added = r1.a + 9;
  const read = r2.a + 9;
  const petRow = (i, id, name, status, segs) => {
    const y = STORE.y + 70 + i * 30;
    return `<g${segs ? ` class="${t.show(segs)}"` : ""}>
<rect x="${STORE.x + 12}" y="${y - 17}" width="${STORE.w - 24}" height="26" rx="4" fill="${C.amber}" fill-opacity=".10" class="${t.show([[read, read + 7]])} rm0"/>
${segs ? `<rect x="${STORE.x + 12}" y="${y - 17}" width="${STORE.w - 24}" height="26" rx="4" fill="${C.green}" fill-opacity=".14" class="${t.show([[added, added + 8]])} rm0"/>` : ""}
<text x="${STORE.x + 24}" y="${y}" font-size="12" fill="${C.muted}" class="mono">${id}</text>
<text x="${STORE.x + 64}" y="${y}" font-size="12" fill="${C.text}" class="mono">${name}</text>
<text x="${STORE.x + STORE.w - 24}" y="${y}" font-size="11.5" fill="${C.dim}" text-anchor="end" class="mono">${status}</text>
</g>`;
  };

  const body = `
<!-- header -->
<text x="40" y="44" font-size="19" font-weight="700" fill="${C.text}">RapiMock</text>
<text x="40" y="66" font-size="12.5" fill="${C.muted}" class="mono">rapidoc mock openapi.yaml --stateful</text>
<rect x="566" y="28" width="154" height="30" rx="15" fill="rgba(52,211,153,0.08)" stroke="rgba(52,211,153,0.4)"/>
<circle cx="584" cy="43" r="4" fill="${C.green}"><animate attributeName="opacity" values="1;.3;1" dur="1.6s" repeatCount="indefinite"/></circle>
<text x="596" y="47.5" font-size="12" fill="${C.green}" class="mono">localhost:4010</text>
<rect x="40" y="80" width="680" height="1" fill="rgba(148,163,184,0.12)"/>
<text x="40" y="104" font-size="10.5" font-weight="700" fill="${C.dim}" letter-spacing=".08em">REQUESTS</text>

${lines}
${edge(t, elbow([575, SERVER.y + SERVER.h], [575, STORE.y - 2]), {
  runs: [
    [r1.a + 8, r1.a + 10],
    [r2.a + 8, r2.a + 10],
  ],
  lit: t.show([
    [r1.a + 9, r1.a + 16],
    [r2.a + 9, r2.a + 16],
  ]),
})}

<!-- the mock -->
${card(t, SERVER.x, SERVER.y, SERVER.w, SERVER.h, { active: requests.map((r) => [r.a + 4, r.a + 12]) })}
<text x="${SERVER.x + 16}" y="${SERVER.y + 30}" font-size="14.5" font-weight="650" fill="${C.text}">Every request is checked</text>
${checkRows}

<!-- the store -->
${card(t, STORE.x, STORE.y, STORE.w, STORE.h)}
<text x="${STORE.x + 16}" y="${STORE.y + 28}" font-size="14.5" font-weight="650" fill="${C.text}" class="mono">pets</text>
<text x="${STORE.x + STORE.w - 16}" y="${STORE.y + 28}" font-size="11.5" fill="${C.dim}" text-anchor="end" class="${t.show(
    [
      [0, added],
      [END + 1.5, 100],
    ],
  )} rm0">2 records</text>
<text x="${STORE.x + STORE.w - 16}" y="${STORE.y + 28}" font-size="11.5" fill="${C.green}" text-anchor="end" class="${t.show([[added, END]])}">3 records</text>
<rect x="${STORE.x + 12}" y="${STORE.y + 40}" width="${STORE.w - 24}" height="1" fill="rgba(148,163,184,0.12)"/>
${petRow(0, 1, "Rex", "available")}
${petRow(1, 2, "Luna", "pending")}
${petRow(2, 3, "Biscuit", "available", [[added, END]])}
<text x="${STORE.x + 16}" y="${STORE.y + STORE.h - 16}" font-size="10.5" fill="${C.dim}">Seeded from the spec · kept until you reset</text>

${reqCards}

<!-- footer -->
<rect x="40" y="520" width="680" height="52" rx="${BOX_R}" fill="#070b16" stroke="rgba(255,255,255,0.06)"/>
<text x="56" y="542" font-size="11" fill="${C.dim}" class="mono">› Each API under its own path:  localhost:4010/<tspan fill="${C.muted}">&lt;api id&gt;</tspan></text>
<text x="56" y="560" font-size="11" fill="${C.dim}" class="mono">› Reset the data:  POST /__mock/reset   ·   look inside:  /__mock/ui</text>
`;
  return svg(
    W,
    H,
    "RapiMock answering requests",
    "Four requests to RapiMock: a POST creates Biscuit and stores it, a GET lists it, a POST missing a required field gets 400, and a DELETE with a token lacking the pets:write scope gets 403.",
    t,
    body,
  );
}

/* ------------------------------------------------------------------------------------------ */
/* 2. From paths to resources: what RapiMock reads off the spec, and its labels                */
/* ------------------------------------------------------------------------------------------ */

function pathsToResources() {
  const t = timeline(12);
  const END = 90;
  const W = 760;
  const H = 440;
  const PET = { x: 450, y: 96, w: 270, h: 148 };
  const OWNER = { x: 450, y: 290, w: 270, h: 84 };

  const paths = [
    ["GET", "/pets", "list", "pet"],
    ["POST", "/pets", "create", "pet"],
    ["GET", "/pets/{petId}", "read", "pet"],
    ["PATCH", "/pets/{petId}", "update", "pet"],
    ["DELETE", "/pets/{petId}", "delete", "pet"],
    ["GET", "/owners/{ownerId}", "read", "owner"],
    ["POST", "/login", "static", null],
  ];
  const lineY = (i) => 142 + i * 32;
  const scanAt = (i) => 6 + i * 6;

  const lines = paths
    .map(([m, p, action, res], i) => {
      const y = lineY(i);
      const b = badge(56, y - 13, m);
      const at = scanAt(i);
      const tagColor = res ? C.green : C.dim;
      return `<rect x="46" y="${y - 19}" width="318" height="28" rx="5" fill="${C.amber}" fill-opacity=".10" class="${t.show([[at - 1, at + 5]], 0.8)} rm0"/>
${b.svg}
<text x="${62 + b.w}" y="${y}" font-size="12" fill="${C.text}" class="mono">${esc(p)}</text>
<g class="${t.show([[at + 2, END]])}">
  <rect x="${352 - action.length * 6.6 - 14}" y="${y - 13}" width="${action.length * 6.6 + 14}" height="18" rx="9" fill="${tagColor}" fill-opacity=".12" stroke="${tagColor}" stroke-opacity=".45"/>
  <text x="${352 - (action.length * 6.6 + 14) / 2}" y="${y}" font-size="10.5" fill="${tagColor}" text-anchor="middle" class="mono">${action}</text>
</g>`;
    })
    .join("\n");

  const toPet = paths
    .map(([, , , res], i) => {
      if (res !== "pet") return "";
      const d = elbow(
        [368, lineY(i) - 4],
        [410, lineY(i) - 4],
        [410, PET.y + 60],
        [PET.x - 2, PET.y + 60],
      );
      return edge(t, d, {
        a: scanAt(i) + 1,
        b: scanAt(i) + 4,
        lit: t.ramp(scanAt(i) + 1, scanAt(i) + 4, END, END + 3),
        color: C.green,
        marker: "ahGreen",
      });
    })
    .join("\n");
  const ownerLine = 5;
  const toOwner = edge(
    t,
    elbow(
      [368, lineY(ownerLine) - 4],
      [410, lineY(ownerLine) - 4],
      [410, OWNER.y + 35],
      [OWNER.x - 2, OWNER.y + 35],
    ),
    {
      a: scanAt(ownerLine) + 1,
      b: scanAt(ownerLine) + 4,
      lit: t.ramp(scanAt(ownerLine) + 1, scanAt(ownerLine) + 4, END, END + 3),
      color: C.green,
      marker: "ahGreen",
    },
  );

  const petIn = scanAt(0) + 4;
  const keyIn = scanAt(2) + 4;
  const ownerIn = scanAt(ownerLine) + 4;
  const linkIn = ownerIn + 4;
  const staticIn = scanAt(6) + 4;

  const fields = ["id", "name", "status", "ownerId"];
  const body = `
<text x="40" y="44" font-size="17" font-weight="700" fill="${C.text}">From paths to resources</text>
<text x="40" y="65" font-size="12.5" fill="${C.muted}">RapiMock reads the data model off the spec, and labels every operation.</text>

<!-- the spec's paths -->
${card(t, 40, 92, 330, 300)}
<text x="56" y="114" font-size="10.5" font-weight="700" fill="${C.dim}" letter-spacing=".08em">OPENAPI.YAML · PATHS</text>
${lines}
<text x="56" y="376" font-size="11.5" fill="${C.muted}" class="${t.show([[staticIn + 2, END]])}"><tspan fill="${C.green}">6 stateful</tspan>  ·  <tspan fill="${C.dim}">1 static</tspan></text>

${toPet}
${toOwner}

<!-- Pet -->
<g class="${t.show([[petIn, END]])}">
${card(t, PET.x, PET.y, PET.w, PET.h, { lit: [[petIn, END]] })}
<text x="${PET.x + 16}" y="${PET.y + 28}" font-size="15" font-weight="700" fill="${C.text}">Pet</text>
<rect x="${PET.x + PET.w - 88}" y="${PET.y + 14}" width="72" height="20" rx="10" fill="${C.green}" fill-opacity=".12" stroke="${C.green}" stroke-opacity=".5"/>
<text x="${PET.x + PET.w - 52}" y="${PET.y + 28}" font-size="10.5" font-weight="700" fill="${C.green}" text-anchor="middle">Stateful</text>
<text x="${PET.x + 16}" y="${PET.y + 56}" font-size="10.5" font-weight="700" fill="${C.dim}" letter-spacing=".08em">KEY</text>
<text x="${PET.x + 56}" y="${PET.y + 56}" font-size="12" fill="${C.text}" class="mono ${t.show([[keyIn, END]])}">id <tspan fill="${C.dim}">←</tspan> <tspan fill="${C.amber}">{petId}</tspan></text>
<text x="${PET.x + 16}" y="${PET.y + 84}" font-size="10.5" font-weight="700" fill="${C.dim}" letter-spacing=".08em">FIELDS</text>
${fields.map((f, i) => `<text x="${PET.x + 72 + (i % 2) * 90}" y="${PET.y + 84 + Math.floor(i / 2) * 22}" font-size="12" fill="${f === "ownerId" ? C.cyan : C.muted}" class="mono">${f}</text>`).join("\n")}
<text x="${PET.x + 16}" y="${PET.y + 134}" font-size="10" fill="${C.dim}" class="mono">list · create · read · update · delete</text>
</g>

<!-- the link to Owner -->
<path d="${elbow([PET.x + 196, PET.y + PET.h], [PET.x + 196, OWNER.y - 2])}" fill="none" stroke="${C.cyan}" stroke-opacity=".85" stroke-width="1.6" stroke-dasharray="4 5" marker-end="url(#ahCyan)" class="${t.show([[linkIn, END]])}"/>
<text x="${PET.x + 188}" y="${PET.y + PET.h + 27}" font-size="10.5" fill="${C.cyan}" text-anchor="end" class="mono ${t.show([[linkIn, END]])}">ownerId → Owner</text>

<!-- Owner -->
<g class="${t.show([[ownerIn, END]])}">
${card(t, OWNER.x, OWNER.y, OWNER.w, OWNER.h, { lit: [[ownerIn, END]] })}
<text x="${OWNER.x + 16}" y="${OWNER.y + 28}" font-size="15" font-weight="700" fill="${C.text}">Owner</text>
<text x="${OWNER.x + 16}" y="${OWNER.y + 50}" font-size="12" fill="${C.text}" class="mono">id <tspan fill="${C.dim}">←</tspan> <tspan fill="${C.amber}">{ownerId}</tspan></text>
<text x="${OWNER.x + 16}" y="${OWNER.y + 72}" font-size="11" fill="${C.dim}">Seeded pets belong to seeded owners</text>
</g>

<!-- the static one -->
<text x="${OWNER.x}" y="${OWNER.y + OWNER.h + 26}" font-size="11.5" fill="${C.muted}" class="${t.show([[staticIn, END]])}"><tspan class="mono" fill="${C.text}">POST /login</tspan> · Static: no resource fits,</text>
<text x="${OWNER.x}" y="${OWNER.y + OWNER.h + 44}" font-size="11.5" fill="${C.muted}" class="${t.show([[staticIn, END]])}">so it answers with the spec's example.</text>
`;
  return svg(
    W,
    H,
    "From paths to resources",
    "RapiMock reads the paths of an OpenAPI spec: the /pets operations become the Pet resource with its key and actions, /owners/{ownerId} the Owner resource it links to, and POST /login stays static.",
    t,
    body,
  );
}

/* ------------------------------------------------------------------------------------------ */
/* 3. Sessions: two tests in parallel, each with its own copy of the data                      */
/* ------------------------------------------------------------------------------------------ */

function sessions() {
  const t = timeline(12);
  const END = 90;
  const W = 760;
  const H = 470;
  const BAR = { x: 40, y: 206, w: 680, h: 40 };
  const tableY = 290;
  const tableW = 212;
  const tables = [
    { x: 40, title: "test-1", note: "its own copy" },
    { x: 274, title: "default", note: "untouched" },
    { x: 508, title: "test-2", note: "its own copy" },
  ];
  const SENT = 6;
  const AT_BAR = 14;
  const COPIED = 24;
  const CHANGED = 30;
  const REPLIED = 40;

  const test = (x, name, method, path, code) => {
    const b = badge(x + 16, 120, method);
    return `${card(t, x, 96, 320, 78, { active: [[SENT, REPLIED]], lit: [[REPLIED, END]] })}
<text x="${x + 16}" y="114" font-size="10.5" font-weight="700" fill="${C.dim}" letter-spacing=".08em">${name.toUpperCase()}</text>
${b.svg}
<text x="${x + 22 + b.w}" y="133.5" font-size="12.5" fill="${C.text}" class="mono">${esc(path)}</text>
<text x="${x + 16}" y="161" font-size="11.5" fill="${C.muted}" class="mono">X-Mock-Session: <tspan fill="${C.amber}">${name}</tspan></text>
<g class="${t.show([[REPLIED, END]])}">${statusChip(x + 264, 104, code)}</g>`;
  };

  const row = (x, i, id, name, cls = "") =>
    `<g${cls ? ` class="${cls}"` : ""}><text x="${x + 16}" y="${tableY + 64 + i * 24}" font-size="12" fill="${C.muted}" class="mono">${id}</text><text x="${x + 44}" y="${tableY + 64 + i * 24}" font-size="12" fill="${C.text}" class="mono">${name}</text></g>`;

  const tableSvg = ({ x, title, note }, k) => {
    const copy = k !== 1;
    const inner = `${card(t, x, tableY, tableW, 120, copy ? { lit: [[COPIED, END]], litColor: C.amber } : {})}
<text x="${x + 16}" y="${tableY + 26}" font-size="13" font-weight="650" fill="${C.text}" class="mono">${title}</text>
<text x="${x + tableW - 16}" y="${tableY + 26}" font-size="10.5" fill="${C.dim}" text-anchor="end">${note}</text>
<rect x="${x + 12}" y="${tableY + 38}" width="${tableW - 24}" height="1" fill="rgba(148,163,184,0.12)"/>`;
    if (k === 0)
      return `<g class="${t.show([[COPIED, END]])}">${inner}
${row(x, 0, 1, "Rex")}${row(x, 1, 2, "Luna")}
<rect x="${x + 8}" y="${tableY + 96}" width="${tableW - 16}" height="24" rx="4" fill="${C.green}" fill-opacity=".14" class="${t.show([[CHANGED, CHANGED + 8]])} rm0"/>
${row(x, 2, 3, "Biscuit", t.show([[CHANGED, END]]))}</g>`;
    if (k === 2)
      return `<g class="${t.show([[COPIED, END]])}">${inner}
<g class="${t.show([[COPIED, CHANGED + 4]])} rm0">${row(x, 0, 1, "Rex")}<path d="M${x + 14} ${tableY + 60} h56" stroke="${C.red}" stroke-width="1.6" class="${t.show([[CHANGED, CHANGED + 4]])} rm0"/></g>
${row(x, 0, 2, "Luna", t.show([[CHANGED + 5, END]]))}
<g class="${t.show([[COPIED, CHANGED + 4]])} rm0">${row(x, 1, 2, "Luna")}</g></g>`;
    return `${inner}
${row(x, 0, 1, "Rex")}${row(x, 1, 2, "Luna")}`;
  };

  const down = (x, y1, y2, a, b, segs) =>
    edge(t, elbow([x, y1], [x, y2]), { a, b, lit: t.show(segs) });

  const body = `
<text x="40" y="44" font-size="17" font-weight="700" fill="${C.text}">A copy of the data per test</text>
<text x="40" y="65" font-size="12.5" fill="${C.muted}">Tests that run at the same time never see each other's changes.</text>

${down(200, 174, BAR.y - 2, SENT, AT_BAR, [[SENT + 2, REPLIED]])}
${down(560, 174, BAR.y - 2, SENT, AT_BAR, [[SENT + 2, REPLIED]])}
${down(146, BAR.y + BAR.h, tableY - 2, AT_BAR + 4, COPIED, [[AT_BAR + 6, REPLIED]])}
${down(614, BAR.y + BAR.h, tableY - 2, AT_BAR + 4, COPIED, [[AT_BAR + 6, REPLIED]])}
<path d="${elbow([380, BAR.y + BAR.h], [380, tableY - 2])}" fill="none" stroke="${C.edge}" stroke-width="1.6" stroke-dasharray="3 4"/>

${test(40, "test-1", "POST", '/pets  {"name":"Biscuit"}', 201)}
${test(400, "test-2", "DELETE", "/pets/1", 204)}

${card(t, BAR.x, BAR.y, BAR.w, BAR.h, { active: [[AT_BAR, COPIED + 2]] })}
<text x="${BAR.x + BAR.w / 2}" y="${BAR.y + 25}" font-size="13" font-weight="650" fill="${C.text}" text-anchor="middle">RapiMock <tspan font-weight="400" fill="${C.dim}" class="mono">· localhost:4010</tspan></text>

${tables.map(tableSvg).join("\n")}
<text x="380" y="${tableY + 150}" font-size="11" fill="${C.dim}" text-anchor="middle" class="${t.show([[COPIED, END]])}">A session starts as a copy of the seed data, made when it first writes.</text>
`;
  return svg(
    W,
    H,
    "A copy of the data per test",
    "Two tests send requests with their own X-Mock-Session header: test-1 adds Biscuit and test-2 deletes Rex, each in its own copy of the data, while the default data stays untouched.",
    t,
    body,
  );
}

/* ------------------------------------------------------------------------------------------ */
/* 0. Hero: RapiMock as a server, isometric: callers on other machines, one mock on :4010       */
/* ------------------------------------------------------------------------------------------ */

function heroServer() {
  const t = timeline(16);
  const W = 760;
  const H = 610;
  const P = 460; // the slab
  const SERVER = { x: 90, y: 90, w: 90, d: 90, h: 170 };
  const DB = {
    cx: 360,
    cy: 95,
    r: 28,
    h: 46,
    link: [
      [182, 95],
      [330, 95],
    ],
  };

  // Each caller: its box, the route along the slab to a port of the server, and its one request
  const callers = [
    {
      name: "Your frontend",
      box: [80, 250, 55, 50, 30],
      route: [
        [118, 250],
        [118, 182],
      ],
      a: 4,
      req: "POST /pets",
      res: "201 Created",
      code: 201,
      store: true,
    },
    {
      name: "AI agent · MCP",
      box: [270, 245, 60, 50, 40],
      route: [
        [270, 270],
        [170, 270],
        [170, 182],
      ],
      a: 26,
      req: "GET /pets/3",
      res: "200 OK",
      code: 200,
      store: true,
    },
    {
      name: "Tests",
      box: [190, 380, 70, 55, 34],
      route: [
        [190, 405],
        [145, 405],
        [145, 182],
      ],
      a: 48,
      req: "POST /pets",
      res: "400 name is required",
      code: 400,
    },
    {
      name: "curl",
      box: [10, 395, 60, 50, 30],
      route: [
        [40, 395],
        [40, 230],
        [100, 230],
        [100, 182],
      ],
      a: 70,
      req: "DELETE /pets/3",
      res: "403 needs pets:write",
      code: 403,
    },
  ];

  // The slab, its grid, and the routes drawn on it
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
  .join("")}
${[
  [14, 14],
  [P - 14, 14],
  [14, P - 14],
  [P - 14, P - 14],
]
  .map(
    ([x, y]) =>
      `<circle cx="${round2(iso(x, y)[0])}" cy="${round2(iso(x, y)[1])}" r="2.6" fill="rgba(148,163,184,0.35)"/>`,
  )
  .join("")}`;

  const routes = callers
    .map((c) => {
      const line = pts(...c.route.map(([x, y]) => [x, y, 0]));
      return `<polyline points="${line}" fill="none" stroke="rgba(148,163,184,0.30)" stroke-width="1.4" stroke-dasharray="4 5"/>
<polyline points="${line}" fill="none" stroke="${C.amber}" stroke-opacity=".7" stroke-width="1.6" stroke-dasharray="4 5" class="${t.show([[c.a, c.a + 16]])} rm0"/>`;
    })
    .join("\n");

  // The server: a rack of three units, RapiMock on its face, the spec over it
  const S = SERVER;
  const units = [0, 1, 2]
    .map((i) => {
      const z = 14 + i * 50;
      return `<g transform="${faceMatrix("left", S.x + 10, S.y + S.d, z + 40)}">
  <rect x="0" y="0" width="${S.w - 20}" height="38" rx="3" fill="#0b1324" stroke="rgba(255,255,255,0.08)"/>
  ${[0, 1, 2, 3].map((k) => `<rect x="8" y="${7 + k * 7}" width="34" height="3" rx="1.5" fill="rgba(148,163,184,0.22)"/>`).join("")}
  <circle cx="${S.w - 34}" cy="19" r="3.4" fill="${C.green}" opacity=".8"/>
  <circle cx="${S.w - 34}" cy="19" r="3.4" fill="${C.amber}" class="${t.show(
    callers.map((c) => [c.a + 6 + i * 0.6, c.a + 9.5 + i * 0.6]),
    0.4,
  )} rm0"/>
</g>`;
    })
    .join("\n");
  const server = `
<g opacity=".7"><polygon points="${pts([S.x - 8, S.y - 8, 0], [S.x + S.w + 8, S.y - 8, 0], [S.x + S.w + 8, S.y + S.d + 8, 0], [S.x - 8, S.y + S.d + 8, 0])}" fill="${C.amber}" opacity=".25" filter="url(#soft)" class="${t.show(callers.map((c) => [c.a + 6, c.a + 10]))} rm0"/></g>
${isoBox(S.x, S.y, 0, S.w, S.d, S.h, { top: "#1b2640", left: "#121b30", right: "#0c1426", stroke: "rgba(255,255,255,0.10)" })}
${units}
<g transform="${faceMatrix("right", S.x + S.w, S.y + S.d - 10, S.h - 14)}">
  ${[0, 1, 2, 3, 4, 5, 6, 7].map((k) => `<rect x="${k * 9}" y="0" width="4" height="${S.h - 30}" rx="2" fill="rgba(0,0,0,0.25)"/>`).join("")}
</g>
<g transform="${faceMatrix("top", S.x, S.y, S.h)}">
  <rect x="10" y="10" width="${S.w - 20}" height="${S.d - 20}" rx="4" fill="none" stroke="rgba(246,168,33,0.35)"/>
</g>
<!-- the spec, floating over the server -->
<g class="spec-float">
  ${isoBox(S.x + 18, S.y + 22, S.h + 34, 54, 46, 4, { top: "#e8edf5", left: "#aab4c4", right: "#8f9aab", stroke: "rgba(0,0,0,0.15)" })}
  <g transform="${faceMatrix("top", S.x + 18, S.y + 22, S.h + 38)}">
    ${[0, 1, 2, 3, 4].map((k) => `<rect x="${6 + (k % 2) * 6}" y="${7 + k * 7.5}" width="${k === 0 ? 26 : 38 - (k % 2) * 10}" height="3" rx="1.5" fill="${k === 0 ? C.amber : "#7c8799"}"/>`).join("")}
  </g>
</g>
${isoTag(iso(S.x + S.w / 2 + 10, S.y + S.d / 2 + 10, S.h + 92), "openapi.yaml", { color: C.muted })}
${isoTag([iso(S.x + S.w, S.y + S.d, S.h)[0] + 104, iso(S.x + S.w, S.y + S.d, S.h)[1] + 18], "RapiMock  localhost:4010", { color: C.amber, border: "rgba(246,168,33,0.55)", fill: "#1a1408" })}`;

  // The store beside it, and its link
  const [dx, dy] = iso(DB.cx, DB.cy, 0);
  const rx = DB.r * COS * K * 1.414;
  const ry = DB.r * SIN * K * 1.414;
  const hh = DB.h * K;
  const disk = (z, fill, stroke) =>
    `<ellipse cx="${round2(dx)}" cy="${round2(dy - z * K)}" rx="${round2(rx)}" ry="${round2(ry)}" fill="${fill}" stroke="${stroke}"/>`;
  // The loop opens with RapiMock seeding the store from the spec, then the callers' reads and writes
  const SEED = [0.5, 3.2];
  const stored = [
    [SEED[1] - 0.6, SEED[1] + 0.8],
    ...callers.filter((c) => c.store).map((c) => [c.a + 7, c.a + 11]),
  ];
  const db = `
<polyline points="${pts(...DB.link.map(([x, y]) => [x, y, 0]))}" fill="none" stroke="rgba(148,163,184,0.35)" stroke-width="1.6" stroke-dasharray="4 5"/>
<polyline points="${pts(...DB.link.map(([x, y]) => [x, y, 0]))}" fill="none" stroke="${C.green}" stroke-width="2" class="${t.show(stored)} rm0"/>
<path d="M${round2(dx - rx)} ${round2(dy)} L${round2(dx - rx)} ${round2(dy - hh)} A${round2(rx)} ${round2(ry)} 0 0 1 ${round2(dx + rx)} ${round2(dy - hh)} L${round2(dx + rx)} ${round2(dy)} A${round2(rx)} ${round2(ry)} 0 0 1 ${round2(dx - rx)} ${round2(dy)} Z" fill="#101a2e" stroke="rgba(255,255,255,0.10)"/>
${disk(DB.h / 2, "none", "rgba(148,163,184,0.18)")}
${disk(DB.h, "#1b2640", "rgba(255,255,255,0.12)")}
<g class="${t.show(stored)} rm0">${disk(DB.h, C.green, "none").replace("/>", ' fill-opacity=".35"/>')}</g>
${isoTag([dx + 18, dy + 34], "RapiMock Store", { color: C.green, border: "rgba(52,211,153,0.45)", fill: "#0b1f1a" })}`;

  // A caller: a box with a face to say what it is, its name, and its request and response as they happen
  const drawCaller = (c, i) => {
    const [x, y, w, d, h] = c.box;
    const glyph = [
      // the frontend: a browser window
      `<rect x="4" y="4" width="${w - 8}" height="${h * 1.6}" rx="3" fill="#0b1324" stroke="rgba(255,255,255,0.12)"/><rect x="4" y="4" width="${w - 8}" height="7" rx="3" fill="#1e2a44"/>${[0, 1, 2].map((k) => `<circle cx="${9 + k * 6}" cy="7.5" r="1.6" fill="${[C.red, C.amber, C.green][k]}"/>`).join("")}<rect x="10" y="17" width="${w * 0.45}" height="3" rx="1.5" fill="${C.amber}" opacity=".8"/><rect x="10" y="24" width="${w * 0.6}" height="3" rx="1.5" fill="rgba(148,163,184,0.35)"/>`,
      // the agent: two eyes
      `<rect x="6" y="6" width="${w - 12}" height="${h * 0.8}" rx="5" fill="#0b1324" stroke="rgba(255,255,255,0.12)"/><circle cx="${w / 2 - 9}" cy="${6 + h * 0.4}" r="3.6" fill="${C.cyan}"/><circle cx="${w / 2 + 9}" cy="${6 + h * 0.4}" r="3.6" fill="${C.cyan}"/>`,
      // the tests: a list of checks
      [0, 1, 2]
        .map(
          (k) =>
            `<path d="M8 ${10 + k * 9} l3 3 l5 -6" fill="none" stroke="${C.green}" stroke-width="1.8" stroke-linecap="round"/><rect x="22" y="${8 + k * 9}" width="${w - 32}" height="3" rx="1.5" fill="rgba(148,163,184,0.35)"/>`,
        )
        .join(""),
      // curl: a prompt
      `<rect x="4" y="4" width="${w - 8}" height="${h * 0.9}" rx="3" fill="#060a14" stroke="rgba(255,255,255,0.12)"/><text x="9" y="17" font-size="9" fill="${C.green}" class="mono">$ curl</text><rect x="9" y="21" width="${w * 0.5}" height="2.6" rx="1.3" fill="rgba(148,163,184,0.35)"/>`,
    ][i];
    const top = iso(x + w / 2, y + d / 2, h);
    const resColor = c.code < 300 ? C.green : C.red;
    return `${isoBox(x, y, 0, w, d, h, { top: "#1b2640", left: "#131c31", right: "#0d1527" })}
<g transform="${faceMatrix("left", x, y + d, h)}">${glyph}</g>
${isoTag([top[0], top[1] - 22], c.name, { color: C.text, mono: false })}
${isoTag([top[0], top[1] - 54], c.req, { color: C.amber, border: "rgba(246,168,33,0.55)", fill: "#1a1408", cls: `${t.show([[c.a, c.a + 9]])} rm0` })}
${isoTag([top[0], top[1] - 54], c.res, { color: resColor, border: c.code < 300 ? "rgba(52,211,153,0.55)" : "rgba(248,113,113,0.55)", fill: c.code < 300 ? "#0b1f1a" : "#24121a", cls: t.show([[c.a + 15, c.a + 22]]) })}`;
  };

  // Paint from the back to the front
  const things = [
    ...callers.map((c, i) => ({
      depth: c.box[0] + c.box[2] / 2 + c.box[1] + c.box[3] / 2,
      svg: () => drawCaller(c, i),
    })),
    { depth: SERVER.x + SERVER.w / 2 + SERVER.y + SERVER.d / 2, svg: () => server },
    { depth: DB.cx + DB.cy, svg: () => db },
  ].sort((a, b) => a.depth - b.depth);

  const packets = callers
    .map((c) => {
      const there = c.route.map(([x, y]) => iso(x, y, 4));
      const back = [...there].reverse();
      return `<g class="${travel(t, there, c.a, c.a + 6)} rm0" style="opacity:0">${packet(C.amber)}</g>
<g class="${travel(t, back, c.a + 9, c.a + 15)} rm0" style="opacity:0">${packet(c.code < 300 ? C.green : C.red)}</g>`;
    })
    .join("\n");

  const seed = `<g class="${travel(
    t,
    DB.link.map(([x, y]) => iso(x, y, 4)),
    SEED[0],
    SEED[1],
  )} rm0" style="opacity:0">${packet(C.green)}</g>`;

  const body = `
${slab}
${routes}
${things.map((x) => x.svg()).join("\n")}
${packets}
${seed}
`;
  return svg(
    W,
    H,
    "RapiMock, a server for every caller",
    "Your frontend, an AI agent, a test run and curl each send a request across the network to RapiMock on port 4010, which is built from openapi.yaml and keeps records in a store: a 201 and a 200 come back green, a 400 and a 403 red.",
    t,
    body,
    `.spec-float{animation:float 4s ease-in-out infinite}@keyframes float{50%{transform:translateY(-6px)}}`,
    { framed: false, crop: [24, 62, 700, 510] },
  );
}

mkdirSync(OUT, { recursive: true });
const files = {
  "mock-server.svg": heroServer(),
  "mock-requests.svg": heroRequests(),
  "mock-resources.svg": pathsToResources(),
  "mock-sessions.svg": sessions(),
};
for (const [name, content] of Object.entries(files)) {
  writeFileSync(join(OUT, name), content);
  console.log(`${name}  ${(content.length / 1024).toFixed(1)} KB`);
}
