/**
 * Lays out a flow graph (see graph.js) and draws it as an SVG string. No DOM: text widths are
 * estimated from character counts, so the same code runs in Node and the browser.
 *
 * Steps are stacked top to bottom between the workflow's inputs and outputs. Values passed between
 * steps run in lanes on the right, and a goto draws a line through the lanes on the left to its
 * target step. Two views:
 * - "expanded" (default): the inputs box lists each input's type, whether it is required, its
 *   default and enum values; each step lists the values it sends and where they come from (input,
 *   step, fixed or expr), and its actions as "condition → what happens"; the outputs box names the step output behind each output. Value lines arrive at the
 *   line that uses the value, so they carry no labels.
 * - "compact": step boxes show only the step, method and path; values passed are labelled lines,
 *   and a step's own actions are pills on the left.
 */

const BOX_W = 320; // compact
const BOX_MIN = 360; // expanded, grows with its longest line up to BOX_MAX
const BOX_MAX = 560;
const PAD = 16;
const ROW = 18;
const HEADER_H = 52; // a step's title and method/path lines
const GAP = 40;
const LANE = 20;
const MARGIN = 16;
const PILL_H = 20;
const PILL_GAP = 4;
const ARRIVAL_ZONE = 18; // top strip of a step's left edge where goto lines arrive
const MAX_BINDINGS = 10; // more are summed up in one line; the step details list them all
const CHAR_W = 7.2; // average advance of a 12-13px sans character
const MONO_W = 7.4; // 12px monospace
const PILL_CHAR_W = 6.4; // 11px sans

export function escapeXml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function truncate(text, maxChars) {
  const s = String(text ?? "");
  if (maxChars < 2) return "";
  return s.length <= maxChars ? s : `${s.slice(0, maxChars - 1)}…`;
}

/** Joins items into lines of at most maxChars, breaking only between items. */
function wrapItems(items, separator, maxChars) {
  const lines = [];
  let line = "";
  for (const item of items) {
    const next = line ? `${line}${separator}${item}` : item;
    if (next.length > maxChars && line) {
      lines.push(`${line}${separator.trimEnd()}`);
      line = item;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines.map((l) => truncate(l, maxChars));
}

/** A short action label for pills: "✗ retry 3× after 2s (if)". */
export function actionLabel(a) {
  const mark = a.outcome === "failure" ? "✗" : "✓";
  let text;
  if (a.type === "retry") {
    text = "retry";
    if (a.retryLimit) text += ` ${a.retryLimit}×`;
    if (a.retryAfter) text += ` after ${a.retryAfter}s`;
    if (a.stepId) text += ` from ${a.stepId}`;
  } else if (a.type === "goto") {
    text = `goto ${a.stepId || a.workflowId}`;
  } else text = "end";
  if (a.conditional) text += " (if)";
  return `${mark} ${text}`;
}

/** An action with its criteria, without the mark: "retry 3× after 1s if $statusCode == 503". */
export function actionSentence(a) {
  const text = actionLabel({ ...a, conditional: false }).slice(2);
  const when = (a.criteria || []).map((c) => c.condition).join(" and ");
  return when ? `${text} if ${when}` : text;
}

/** Shortens one condition for a step box: "$statusCode == 503" reads "status 503". */
function shortCondition(condition) {
  const m = condition.match(/^\$statusCode\s*==\s*(\d+)$/);
  return m ? `status ${m[1]}` : condition;
}

/**
 * An action in words, for a step box or the step details.
 * `{ when: "status 503", does: "retry 3×, 1s apart", tag: "workflow" }`; `tag` is the action's
 * name, or "workflow" for one the step inherits.
 */
export function describeAction(a) {
  const criteria = a.criteria || [];
  const when = criteria.length
    ? criteria.map((c) => shortCondition(c.condition)).join(" and ")
    : `any ${a.outcome}`;
  let does;
  if (a.type === "end") does = "stop the workflow";
  else if (a.type === "goto")
    does = a.stepId ? `go to ${a.stepId}` : `run workflow ${a.workflowId}`;
  else {
    does = "retry";
    if (a.retryLimit) does += ` ${a.retryLimit}×`;
    if (a.retryAfter) does += `, ${a.retryAfter}s apart`;
    if (a.stepId) does += ` from ${a.stepId}`;
  }
  return { when, does, tag: a.inherited ? "workflow" : a.name || "" };
}

/** Greedy lane assignment: edges whose spans overlap get different lanes. */
function assignLanes(edges) {
  const lanes = [];
  const sorted = [...edges].sort((a, b) => a.span[1] - a.span[0] - (b.span[1] - b.span[0]));
  for (const e of sorted) {
    let lane = 0;
    while ((lanes[lane] || []).some((o) => e.span[0] < o.span[1] && o.span[0] < e.span[1])) lane++;
    (lanes[lane] ||= []).push(e);
    e.lane = lane;
  }
  return lanes.length;
}

function textWidth(text, charW) {
  return Math.ceil(String(text).length * charW);
}

// A row is one line of text in a box, made of parts: { text, cls, w (char width), x | dx }.
// `x` places a part from the box's left edge; `dx` follows the previous part.
const part = (text, cls, w, place = {}) => ({ text: String(text), cls, w, ...place });

function rowExtent(row) {
  let pos = 0;
  const starts = row.parts.map((p) => {
    pos = p.x !== undefined ? p.x : pos + (p.dx || 0);
    const start = pos;
    pos += textWidth(p.text, p.w);
    return start;
  });
  return { starts, end: pos };
}

// Room a row's right-aligned tag takes, gap included
const tagWidth = (row) => (row.tag ? textWidth(row.tag, PILL_CHAR_W) + 16 : 0);

/** Cuts a row's last part so the row, and its tag, fit the box. */
function fitRow(row, boxW) {
  const { starts } = rowExtent(row);
  const last = row.parts.at(-1);
  if (!last) return;
  const room = boxW - PAD - tagWidth(row) - starts.at(-1);
  last.text = truncate(last.text, Math.floor(room / last.w));
}

function renderRow(row, boxX, boxW, baseline) {
  const tspans = row.parts
    .map((p) => {
      const place = p.x !== undefined ? ` x="${boxX + p.x}"` : p.dx ? ` dx="${p.dx}"` : "";
      return `<tspan class="${p.cls}"${place}>${escapeXml(p.text)}</tspan>`;
    })
    .join("");
  const cls = row.shadowed ? "rf-row rf-shadowed" : "rf-row";
  const tip = row.shadowed
    ? "<title>Never runs: an earlier action without criteria always matches first</title>"
    : "";
  const tag = row.tag
    ? `<text class="rf-tag${row.shadowed ? " rf-shadowed" : ""}" x="${boxX + boxW - PAD}" y="${baseline}" text-anchor="end">${escapeXml(row.tag)}</text>`
    : "";
  return `<text class="${cls}" y="${baseline}">${tip}${tspans}</text>${tag}`;
}

// The word before each value in a step box or the outputs box, by source kind
const KEYWORDS = { input: "input", step: "step", value: "fixed", expression: "expr" };
const KEYWORD_W = 6 * MONO_W; // "input" plus a space

function sourceParts(source, col) {
  return [
    part(KEYWORDS[source.kind], `rf-kw rf-kw-${source.kind}`, MONO_W, { x: col }),
    part(source.text, "rf-bind-val", MONO_W, { x: col + KEYWORD_W }),
  ];
}

/** "On success" and "On failure" sections: one line per action, in the order a runner checks. */
function actionSections(step) {
  return ["success", "failure"]
    .map((outcome) => {
      const actions = step.actions.filter((a) => a.outcome === outcome);
      if (!actions.length) return [];
      const described = actions.map(describeAction);
      const whenChars = Math.min(34, Math.max(...described.map((d) => d.when.length)));
      const col = PAD + whenChars * CHAR_W + 12;
      return [
        { parts: [part(`On ${outcome}`, "rf-sec-title", PILL_CHAR_W, { x: PAD })] },
        ...actions.map((a, i) => ({
          action: a,
          tag: described[i].tag,
          shadowed: a.shadowed,
          parts: [
            part(truncate(described[i].when, whenChars), "rf-act-when", CHAR_W, { x: PAD }),
            part(`→ ${described[i].does}`, "rf-act-then", CHAR_W, { x: col }),
          ],
        })),
      ];
    })
    .filter((rows) => rows.length);
}

function inputRows(graph) {
  const nameChars = Math.min(22, Math.max(4, ...graph.inputDetails.map((i) => i.name.length)));
  const col = PAD + nameChars * CHAR_W + 16;
  const rows = [];
  for (const i of graph.inputDetails) {
    const parts = [part(truncate(i.name, nameChars), "rf-in-name", CHAR_W, { x: PAD })];
    const type = i.type ? `${i.type}${i.format ? ` (${i.format})` : ""}` : "any";
    parts.push(part(type, "rf-in-type", MONO_W, { x: col }));
    if (i.required) parts.push(part("required", "rf-req", PILL_CHAR_W, { dx: 8 }));
    if (i.default !== undefined) {
      const value = typeof i.default === "string" ? i.default : JSON.stringify(i.default);
      parts.push(part(`= ${value}`, "rf-in-default", MONO_W, { dx: 8 }));
    }
    rows.push({ parts });
    if (i.enum?.length) {
      const values = i.enum.map((v) => (typeof v === "string" ? v : JSON.stringify(v)));
      rows.push({ parts: [part(values.join(" | "), "rf-in-enum", MONO_W, { x: col })] });
    }
  }
  return rows;
}

function bindingRows(step) {
  const shown = step.bindings.slice(0, MAX_BINDINGS);
  const nameChars = Math.min(18, Math.max(4, ...shown.map((b) => b.name.length)));
  const col = PAD + nameChars * MONO_W + 12;
  const rows = shown.map((b) => ({
    arrivals: b.fromSteps,
    parts: [
      part(truncate(b.name, nameChars), "rf-bind-name", MONO_W, { x: PAD }),
      ...sourceParts(b.source, col),
    ],
  }));
  const hidden = step.bindings.slice(MAX_BINDINGS);
  if (hidden.length) {
    rows.push({
      arrivals: [...new Set(hidden.flatMap((b) => b.fromSteps))],
      parts: [
        part(`+${hidden.length} more in the step details`, "rf-more", PILL_CHAR_W, { x: PAD }),
      ],
    });
  }
  return rows;
}

function outputRows(graph, expanded) {
  if (!expanded) {
    return graph.outputs.map((o) => ({
      parts: [
        part(o.stepId ? `${o.name} ← ${o.stepId}` : o.name, "rf-io-names", CHAR_W, { x: PAD }),
      ],
    }));
  }
  const nameChars = Math.min(22, Math.max(4, ...graph.outputs.map((o) => o.name.length)));
  const col = PAD + nameChars * CHAR_W + 16;
  return graph.outputs.map((o) => ({
    arrivals: o.stepId ? [o.stepId] : [],
    parts: [
      part(truncate(o.name, nameChars), "rf-out-name", CHAR_W, { x: PAD }),
      ...sourceParts(o.source || { kind: "expression", text: o.expr }, col),
    ],
  }));
}

function headerWidth(step) {
  const op = step.operation;
  const sub = op
    ? textWidth(op.method, MONO_W) + 8 + textWidth(op.path, MONO_W)
    : textWidth(step.workflowId || step.operationRef, MONO_W) + 90;
  return Math.max(textWidth(step.stepId, CHAR_W) + 90, sub) + PAD * 2;
}

/**
 * Draws the diagram and reports which kinds of lines it drew, for a legend.
 *
 * @param {object} graph from buildFlowGraph()
 * @param {object} [options]
 * @param {'expanded'|'compact'} [options.view='expanded']
 * @param {string} [options.idPrefix='rf'] prefix for marker ids, unique per page
 * @param {boolean} [options.interactive=false] make operation steps focusable buttons
 * @returns {{ svg: string, legend: string[] }} legend entries in drawing order, from
 *   `seq` (next step), `data` (value to a later step), `output` (value to the outputs box),
 *   `success` / `failure` (goto lines), `action` (compact only: action pills)
 */
export function renderFlowDiagram(graph, options = {}) {
  if (!graph) return { svg: "", legend: [] };
  const { idPrefix = "rf", interactive = false } = options;
  const expanded = options.view !== "compact";
  const drawn = new Set();

  // ---- Nodes, top to bottom, with their rows ----
  const nodes = [];
  if (graph.inputs.length) {
    const rows = expanded
      ? inputRows(graph)
      : wrapItems(graph.inputs, ", ", Math.floor((BOX_W - 32) / CHAR_W)).map((l) => ({
          parts: [part(l, "rf-io-names", CHAR_W, { x: PAD })],
        }));
    nodes.push({ key: "inputs", kind: "io", title: "Inputs", rows });
  }
  for (const step of graph.steps) {
    if (expanded) {
      nodes.push({
        key: step.stepId,
        kind: "step",
        step,
        pills: [],
        sections: [bindingRows(step), ...actionSections(step)].filter((rows) => rows.length),
      });
    } else {
      // The caller lists the workflow's actions once, so they are not drawn on every step
      if (step.actions.length) drawn.add("action");
      const own = step.actions.filter((a) => !a.inherited);
      const pills = own.map((a) => ({ action: a, text: actionLabel(a) }));
      nodes.push({ key: step.stepId, kind: "step", step, pills, sections: [] });
    }
  }
  if (graph.outputs.length) {
    nodes.push({ key: "outputs", kind: "io", title: "Outputs", rows: outputRows(graph, expanded) });
  }
  const index = new Map(nodes.map((n, i) => [n.key, i]));
  const rowsOf = (n) => (n.kind === "io" ? n.rows : n.sections.flat());

  // ---- Box width: fixed when compact, the longest line when expanded ----
  let boxW = BOX_W;
  if (expanded) {
    const widths = nodes.flatMap((n) => [
      ...rowsOf(n).map((r) => rowExtent(r).end + tagWidth(r) + PAD),
      n.kind === "step" ? headerWidth(n.step) : 0,
    ]);
    boxW = Math.min(BOX_MAX, Math.max(BOX_MIN, ...widths));
  }
  for (const n of nodes) for (const r of rowsOf(n)) fitRow(r, boxW);
  const boxChars = Math.floor((boxW - 32) / CHAR_W);

  // ---- Heights and row baselines (relative to the node's top) ----
  for (const n of nodes) {
    if (n.kind === "io") {
      n.rows.forEach((r, ri) => (r.by = 40 + ri * ROW));
      n.h = 34 + n.rows.length * ROW;
      continue;
    }
    if (!expanded) {
      n.h = Math.max(60, ARRIVAL_ZONE + n.pills.length * (PILL_H + PILL_GAP) + 6);
      continue;
    }
    let bottom = HEADER_H;
    n.separators = [];
    for (const rows of n.sections) {
      const sepY = bottom + 6;
      n.separators.push(sepY);
      rows.forEach((r, ri) => (r.by = sepY + 18 + ri * ROW));
      bottom = sepY + 18 + (rows.length - 1) * ROW + 6;
    }
    n.h = Math.max(60, bottom + 8);
  }

  // ---- Right-hand data edges ----
  // Compact: one lane per source step and label, branching to the middle of each target.
  // Expanded: one lane per source step, branching to each line that uses one of its outputs.
  const groups = new Map();
  const addTarget = (fromIdx, toIdx, label, rowBy) => {
    const output = nodes[toIdx].key === "outputs";
    const key = `${fromIdx}\u0000${output}\u0000${label}`;
    const group = groups.get(key) || { from: fromIdx, label, output, targets: [] };
    if (!group.targets.some((t) => t.node === toIdx && t.by === rowBy)) {
      group.targets.push({ node: toIdx, by: rowBy });
    }
    groups.set(key, group);
  };
  if (expanded) {
    nodes.forEach((n, j) => {
      for (const r of rowsOf(n)) {
        for (const stepId of r.arrivals || []) {
          const i = index.get(stepId);
          if (i !== undefined && i < j) addTarget(i, j, "", r.by);
        }
      }
    });
  } else {
    for (const e of graph.dataEdges) {
      if (!index.has(e.from) || !index.has(e.to) || index.get(e.from) >= index.get(e.to)) continue;
      const label = e.to === "outputs" ? "" : truncate(e.labels.join(", "), 28);
      addTarget(index.get(e.from), index.get(e.to), label, undefined);
    }
  }
  const dataEdges = [...groups.values()].map((g) => {
    const targets = g.targets.sort((a, b) => a.node - b.node || (a.by ?? 0) - (b.by ?? 0));
    return { ...g, targets, span: [g.from, targets.at(-1).node] };
  });
  const dataLaneCount = assignLanes(dataEdges);

  // ---- Left-hand goto edges, from a pill (compact) or an action line (expanded) ----
  const gotoEdges = [];
  nodes.forEach((n, i) => {
    if (n.kind !== "step") return;
    const sources = expanded
      ? rowsOf(n)
          .filter((r) => r.action && !r.shadowed)
          .map((r) => ({ action: r.action, by: r.by }))
      : n.pills.map((p, pi) => ({
          action: p.action,
          pill: pi,
          by: ARRIVAL_ZONE + pi * (PILL_H + PILL_GAP) + PILL_H / 2,
        }));
    for (const src of sources) {
      const target = src.action.type === "goto" ? src.action.stepId : "";
      if (!target || !index.has(target) || target === n.key) continue;
      const j = index.get(target);
      gotoEdges.push({ ...src, from: i, to: j, span: [Math.min(i, j), Math.max(i, j)] });
    }
  });
  const gotoLaneCount = assignLanes(gotoEdges);

  // ---- Horizontal geometry ----
  const pillColW = Math.min(
    220,
    Math.max(
      0,
      ...nodes.flatMap((n) => n.pills?.map((p) => textWidth(p.text, PILL_CHAR_W) + 16) || []),
    ),
  );
  const gotoW = gotoLaneCount ? gotoLaneCount * LANE + 8 : 0;
  const boxX = MARGIN + gotoW + (pillColW ? pillColW + 16 : 0);
  const boxR = boxX + boxW;
  const laneX = (lane) => boxR + 20 + lane * LANE;
  const labelW = Math.max(
    8,
    ...dataEdges.map((e) => (e.label ? textWidth(e.label, PILL_CHAR_W) + 14 : 0)),
  );
  const width = (dataLaneCount ? laneX(dataLaneCount - 1) + labelW : boxR) + MARGIN;

  // ---- Vertical geometry ----
  let y = MARGIN;
  for (const n of nodes) {
    n.y = y;
    n.cy = y + n.h / 2;
    y += n.h + GAP;
  }
  const height = y - GAP + MARGIN;

  // Connection points on the right edge. Compact: arrivals above the middle, departures below.
  // Expanded: departures beside the header, arrivals at the line that uses the value.
  const ports = new Map();
  const portY = (nodeIdx, dir, by) => {
    const n = nodes[nodeIdx];
    if (dir === "in" && by !== undefined) return n.y + by - 4;
    const key = `${nodeIdx}:${dir}`;
    const used = ports.get(key) || 0;
    ports.set(key, used + 1);
    if (expanded && dir === "out") return n.y + 18 + used * 8;
    return dir === "in" ? n.cy - 6 - used * 8 : n.cy + 6 + used * 8;
  };

  const out = [];
  const marker = (id, cls) =>
    `<marker id="${idPrefix}-${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="${cls}"/></marker>`;
  out.push(
    `<svg xmlns="http://www.w3.org/2000/svg" class="rf-svg rf-${expanded ? "expanded" : "compact"}" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="group" aria-label="${escapeXml(`Workflow ${graph.workflowId}`)}">`,
    `<defs>${marker("seq", "rf-head-seq")}${marker("data", "rf-head-data")}${marker("output", "rf-head-output")}${marker("success", "rf-head-success")}${marker("failure", "rf-head-failure")}</defs>`,
  );

  // Sequence arrows. A step whose success always ends or jumps never falls through to the next
  // step, so no arrow is drawn into the next step (the outputs box still gets one).
  const stopsOnSuccess = (n) =>
    n.kind === "step" &&
    n.step.actions.some(
      (a) => a.outcome === "success" && !a.conditional && (a.type === "end" || a.type === "goto"),
    );
  for (let i = 0; i + 1 < nodes.length; i++) {
    if (nodes[i + 1].kind === "step" && stopsOnSuccess(nodes[i])) continue;
    const cx = boxX + boxW / 2;
    drawn.add("seq");
    out.push(
      `<path class="rf-seq" d="M${cx} ${nodes[i].y + nodes[i].h}V${nodes[i + 1].y - 2}" marker-end="url(#${idPrefix}-seq)"/>`,
    );
  }

  // Data edges and their labels
  const placedLabels = [];
  for (const e of dataEdges) {
    const x = laneX(e.lane);
    const cls = e.output ? "rf-data rf-to-output" : "rf-data";
    const head = e.output ? "output" : "data";
    drawn.add(head);
    const y1 = portY(e.from, "out");
    const ys = e.targets.map((t) => portY(t.node, "in", t.by));
    out.push(`<path class="${cls}" d="M${boxR} ${y1}H${x}V${Math.max(...ys)}"/>`);
    for (const ty of ys) {
      out.push(
        `<path class="${cls}" d="M${x} ${ty}H${boxR + 2}" marker-end="url(#${idPrefix}-${head})"/>`,
      );
    }
    if (!e.label) continue;
    const w = textWidth(e.label, PILL_CHAR_W) + 12;
    let ly = (y1 + ys[0]) / 2 - 9;
    while (placedLabels.some((l) => x < l.x + l.w && l.x < x + w && ly < l.y + 20 && l.y < ly + 20))
      ly += 20;
    placedLabels.push({ x, y: ly, w });
    out.push(
      `<g class="rf-data-label"><rect x="${x + 4}" y="${ly}" width="${w}" height="18" rx="9"/><text x="${x + 10}" y="${ly + 13}">${escapeXml(e.label)}</text></g>`,
    );
  }

  // Goto edges
  for (const e of gotoEdges) {
    const from = nodes[e.from];
    const to = nodes[e.to];
    const x = MARGIN + (gotoLaneCount - 1 - e.lane) * LANE + 4;
    const py = expanded ? from.y + e.by - 4 : from.y + e.by;
    const start = expanded
      ? boxX
      : boxX - 16 - (textWidth(from.pills[e.pill].text, PILL_CHAR_W) + 16);
    const ty = to.y + ARRIVAL_ZONE / 2;
    drawn.add(e.action.outcome);
    out.push(
      `<path class="rf-goto rf-${e.action.outcome}" d="M${start} ${py}H${x}V${ty}H${boxX - 2}" marker-end="url(#${idPrefix}-${e.action.outcome})"/>`,
    );
  }

  // Nodes
  for (const n of nodes) {
    if (n.kind === "io") {
      out.push(
        `<g class="rf-node rf-io rf-${n.key}"><rect x="${boxX}" y="${n.y}" width="${boxW}" height="${n.h}" rx="8"/>`,
        `<text class="rf-io-title" x="${boxX + PAD}" y="${n.y + 20}">${n.title}</text>`,
        ...n.rows.map((r) => renderRow(r, boxX, boxW, n.y + r.by)),
        `</g>`,
      );
      continue;
    }
    const s = n.step;
    const op = s.operation;
    const clickable = interactive && (op || s.kind === "workflow");
    let sub;
    if (s.kind === "workflow") {
      sub = `<text class="rf-sub" x="${boxX + PAD}" y="${n.y + 44}">workflow ▸ ${escapeXml(truncate(s.workflowId, boxChars - 11))}</text>`;
    } else if (op) {
      const method = op.method.toUpperCase();
      const methodW = textWidth(method, MONO_W) + 8;
      const pathChars = Math.floor((boxW - 32 - methodW) / MONO_W);
      sub =
        `<text class="rf-method rf-method-${op.method}" x="${boxX + PAD}" y="${n.y + 44}">${method}</text>` +
        `<text class="rf-path" x="${boxX + PAD + methodW}" y="${n.y + 44}">${escapeXml(truncate(op.path, pathChars))}</text>`;
    } else {
      const note = graph.operationsKnown ? " (not found)" : "";
      sub = `<text class="rf-sub rf-unresolved" x="${boxX + PAD}" y="${n.y + 44}">${escapeXml(truncate(s.operationRef, boxChars - note.length))}${note}</text>`;
    }
    const tip = [
      s.description,
      op?.summary,
      s.inputs.length ? `Inputs: ${s.inputs.join(", ")}` : "",
      s.outputs.length ? `Outputs: ${s.outputs.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    const label = op ? `${s.stepId}: ${op.method.toUpperCase()} ${op.path}` : s.stepId;
    const attrs = clickable ? ` tabindex="0" role="button" aria-label="${escapeXml(label)}"` : "";
    out.push(
      `<g class="rf-node rf-step${clickable ? " rf-clickable" : ""}" data-step-id="${escapeXml(s.stepId)}"${attrs}>`,
      tip ? `<title>${escapeXml(tip)}</title>` : "",
      `<rect x="${boxX}" y="${n.y}" width="${boxW}" height="${n.h}" rx="8"/>`,
      `<text class="rf-title" x="${boxX + PAD}" y="${n.y + 24}">${escapeXml(truncate(s.stepId, boxChars - 10))}</text>`,
      sub,
      s.successCriteria
        ? `<text class="rf-criteria" x="${boxR - 12}" y="${n.y + 24}" text-anchor="end">${s.successCriteria} check${s.successCriteria > 1 ? "s" : ""}</text>`
        : "",
      ...(n.separators || []).map(
        (sy) => `<path class="rf-sep" d="M${boxX} ${n.y + sy}H${boxR}"/>`,
      ),
      ...n.sections.flat().map((r) => renderRow(r, boxX, boxW, n.y + r.by)),
      `</g>`,
    );
    n.pills.forEach((p, pi) => {
      const w = textWidth(p.text, PILL_CHAR_W) + 16;
      const px = boxX - 16 - w;
      const py = n.y + ARRIVAL_ZONE + pi * (PILL_H + PILL_GAP);
      out.push(
        `<g class="rf-action rf-${p.action.outcome}"><rect x="${px}" y="${py}" width="${w}" height="${PILL_H}" rx="${PILL_H / 2}"/><text x="${px + 8}" y="${py + 14}">${escapeXml(p.text)}</text></g>`,
      );
    });
  }

  out.push("</svg>");
  const order = ["seq", "data", "output", "success", "failure", "action"];
  return { svg: out.join(""), legend: order.filter((k) => drawn.has(k)) };
}

/** The diagram as an SVG string; see renderFlowDiagram for the options. */
export function renderFlowSvg(graph, options = {}) {
  return renderFlowDiagram(graph, options).svg;
}
