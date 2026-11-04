/**
 * Lays out a flow graph (see graph.js) and draws it as an SVG string. No DOM: text widths are
 * estimated from character counts, so the same code runs in Node and the browser.
 *
 * Steps are stacked top to bottom between the workflow's inputs and outputs. Values passed between
 * steps run in lanes on the right, and a goto draws a line through the lanes on the left to its
 * target step. The inputs box (each input's type, required flag, default and enum values) and
 * the outputs table are the same in both views; the views differ in the step boxes:
 * - "expanded" (default): each step lists the values it sends and where they come from (input,
 *   step, fixed or expr), its checks, its actions as "condition → what happens", and the outputs
 *   something reads. Value lines run from the output row to the line that reads it, unlabelled.
 * - "compact": each step shows only its name, method, path and number of checks; values passed
 *   to steps are labelled lines.
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
const COMPACT_GOTO_Y = 30; // compact: first goto line leaves the box's left edge this far down
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
 * An action in words, for a step box.
 * `{ when: "status 503", does: "retry 3×, 1s apart", name: "retryOnServiceUnavailable",
 * tag: "workflow" }`; `name` is the action's own name ("" when the file gives none), `tag` is
 * "workflow" for an action the step inherits and "" for the step's own. An action without criteria applies whenever the
 * step's checks fail (or pass); `checks` is how many the step has, for the wording. After other
 * actions (`index` > 0 in its outcome's list) it reads "otherwise".
 */
export function describeAction(a, checks = 0, index = 0) {
  const criteria = a.criteria || [];
  let when;
  if (criteria.length) when = criteria.map((c) => shortCondition(c.condition)).join(" and ");
  else if (index > 0) when = "otherwise";
  else if (a.outcome === "failure") {
    when = checks > 1 ? "checks fail" : checks ? "check fails" : "request fails";
  } else when = checks > 1 ? "checks pass" : checks ? "check passes" : "request succeeds";
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
  return { when, does, name: a.name || "", tag: a.inherited ? "workflow" : "" };
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
const tagWidth = (row) => (row.tag ? textWidth(row.tag, row.tagW || PILL_CHAR_W) + 16 : 0);

/** Cuts a row's last part so the row, and its tag, fit the box. */
function fitRow(row, boxW) {
  const { starts } = rowExtent(row);
  const last = row.parts.at(-1);
  if (!last) return;
  const room = boxW - PAD - tagWidth(row) - starts.at(-1);
  last.text = truncate(last.text, Math.floor(room / last.w));
}

/**
 * One row as SVG text. A row with `fromStep` (an output row, or a value line that reads a step)
 * carries `data-from-step`; with `interactive` it is also an `rf-jump` link to that step, and the
 * step name in its tag is focusable.
 */
function renderRow(row, boxX, boxW, baseline, interactive = false) {
  const jump = interactive && row.fromStep;
  const from = row.fromStep ? ` data-from-step="${escapeXml(row.fromStep)}"` : "";
  const rowCls = jump ? "rf-row rf-jump" : "rf-row";
  const tspans = row.parts
    .map((p) => {
      const place = p.x !== undefined ? ` x="${boxX + p.x}"` : p.dx ? ` dx="${p.dx}"` : "";
      return `<tspan class="${p.cls}"${place}>${escapeXml(p.text)}</tspan>`;
    })
    .join("");
  const tag = row.tag
    ? `<text class="${row.tagCls || "rf-tag"}${jump ? " rf-jump" : ""}" x="${boxX + boxW - PAD}" y="${baseline}" text-anchor="end"${from}${jump ? ` tabindex="0" role="link" aria-label="${escapeXml(`Go to step ${row.fromStep}`)}"` : ""}>${escapeXml(row.tag)}</text>`
    : "";
  const tip = row.tip ? `<title>${escapeXml(row.tip)}</title>` : "";
  const rule = row.rule
    ? `<path class="rf-sep" d="M${boxX} ${baseline - 13}H${boxX + boxW}"/>`
    : "";
  return `${rule}<text class="${rowCls}" y="${baseline}"${from}>${tip}${tspans}</text>${tag}`;
}

// The word before each value in a step box or the outputs box, by source kind
const KEYWORDS = { input: "input", step: "step", value: "fixed", expression: "expr" };
const KEYWORD_W = 6 * MONO_W; // "input" plus a space

function sourceParts(source, col) {
  const keyword = part(KEYWORDS[source.kind], `rf-kw rf-kw-${source.kind}`, MONO_W, { x: col });
  // A step output reads "<step>.<output>": the step name in the step color, the output plain
  if (source.kind === "step") {
    return [
      keyword,
      part(source.stepId, "rf-step-name", MONO_W, { x: col + KEYWORD_W }),
      part(`.${source.name}`, "rf-bind-val", MONO_W),
    ];
  }
  return [keyword, part(source.text, "rf-bind-val", MONO_W, { x: col + KEYWORD_W })];
}

/** "$response.body#/status" as "response body /status", for a step output's source. */
function shortExpression(expr) {
  const text = typeof expr === "string" ? expr : JSON.stringify(expr);
  const m = text.match(/^\$response\.(body|header)(?:#(.*)|\.(.+))?$/);
  if (m) return `response ${m[1]}${m[2] || m[3] ? ` ${m[2] || m[3]}` : ""}`;
  if (text === "$statusCode") return "status code";
  return text;
}

/**
 * The step's own outputs that something later reads, with where they come from. Lines to the
 * steps and outputs that read them start at these rows. Unused outputs are counted on one line.
 */
function stepOutputRows(step) {
  if (!step.usedOutputs.length) return [];
  const nameChars = Math.min(24, Math.max(4, ...step.usedOutputs.map((o) => o.name.length)));
  const col = PAD + nameChars * MONO_W + 12;
  const rows = [
    { parts: [part("Outputs", "rf-sec-title", PILL_CHAR_W, { x: PAD })] },
    ...step.usedOutputs.map((o) => ({
      departs: o.name,
      tip: typeof o.expr === "string" ? o.expr : JSON.stringify(o.expr),
      parts: [
        part(truncate(o.name, nameChars), "rf-bind-name", MONO_W, { x: PAD }),
        part(shortExpression(o.expr), "rf-out-from", MONO_W, { x: col }),
      ],
    })),
  ];
  const unused = step.outputExprs.length - step.usedOutputs.length;
  if (unused) {
    rows.push({ parts: [part(`+${unused} unused`, "rf-more", PILL_CHAR_W, { x: PAD })] });
  }
  return rows;
}

/**
 * The step's success criteria. Not numbered: all must pass, in no order. Regex, JSONPath and
 * XPath ones show their type and context.
 */
function checkRows(step) {
  if (!step.criteria.length) return [];
  return [
    { parts: [part("Checks", "rf-sec-title", PILL_CHAR_W, { x: PAD })] },
    ...step.criteria.map((c) => ({
      parts: [
        ...(c.type !== "simple"
          ? [
              part(`${c.type}${c.context ? ` on ${c.context}` : ""}:`, "rf-check-type", MONO_W, {
                x: PAD,
              }),
            ]
          : []),
        part(c.condition, "rf-check", MONO_W, c.type !== "simple" ? { dx: 8 } : { x: PAD }),
      ],
    })),
  ];
}

/**
 * "On success" and "On failure" sections: one line per action, in the order a runner checks.
 * Actions that can never run (`shadowed`) are left out; the graph's `warnings` name them.
 */
function actionSections(step) {
  return ["success", "failure"]
    .map((outcome) => {
      const actions = step.actions.filter((a) => a.outcome === outcome && !a.shadowed);
      if (!actions.length) return [];
      const described = actions.map((a, i) => describeAction(a, step.criteria.length, i));
      const whenChars = Math.min(34, Math.max(...described.map((d) => d.when.length)));
      const col = PAD + whenChars * CHAR_W + 12;
      return [
        {
          parts: [
            part(`On ${outcome} · first match runs`, "rf-sec-title", PILL_CHAR_W, { x: PAD }),
          ],
        },
        ...actions.map((a, i) => ({
          action: a,
          tag: described[i].tag,
          parts: [
            part(truncate(described[i].when, whenChars), "rf-act-when", CHAR_W, { x: PAD }),
            part(`→ ${described[i].does}`, "rf-act-then", CHAR_W, { x: col }),
            // The name often says what the action is for; it is cut first when the line is long
            ...(described[i].name
              ? [part(`(${described[i].name})`, "rf-act-name", CHAR_W, { dx: 8 })]
              : []),
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
    // As <rapi-doc> labels it (schema-utils getTypeInfo): a string enum reads "enum"
    const base = i.enum?.length ? i.type.replace("string", "enum") : i.type;
    const type = base ? `${base}${i.format ? ` (${i.format})` : ""}` : "any";
    parts.push(part(type, "rf-in-type", MONO_W, { x: col }));
    if (i.required) parts.push(part("required", "rf-req", PILL_CHAR_W, { dx: 8 }));
    if (i.default !== undefined) {
      const value = typeof i.default === "string" ? i.default : JSON.stringify(i.default);
      parts.push(part(`= ${value}`, "rf-in-default", MONO_W, { dx: 8 }));
    }
    rows.push({ parts, tip: i.description });
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
    arrivals: b.fromOutputs,
    fromStep: b.fromSteps[0],
    parts: [
      part(truncate(b.name, nameChars), "rf-bind-name", MONO_W, { x: PAD }),
      ...sourceParts(b.source, col),
    ],
  }));
  const hidden = step.bindings.slice(MAX_BINDINGS);
  if (hidden.length) {
    rows.push({
      arrivals: hidden.flatMap((b) => b.fromOutputs),
      parts: [
        part(`+${hidden.length} more in the step details`, "rf-more", PILL_CHAR_W, { x: PAD }),
      ],
    });
  }
  return rows;
}

/**
 * The outputs box as a table: one flat column of output names (the workflow's result is a flat
 * object), and on the right the step each group comes from, shown once per group, with a rule
 * between groups. Groups follow the order each step first appears; outputs not taken from a step
 * come last, their source kind in the step column. A step output with another name follows the
 * output's name as "← <name>". A step's line arrives at its group's first row, beside the name.
 */
function outputRows(graph) {
  const groups = new Map();
  for (const o of graph.outputs) {
    const source = o.source || { kind: "expression", text: o.expr };
    const key = o.stepId ? `step:${o.stepId}` : `kind:${source.kind}`;
    if (!groups.has(key)) {
      groups.set(key, { stepId: o.stepId, title: o.stepId || KEYWORDS[source.kind], items: [] });
    }
    groups.get(key).items.push({ ...o, source });
  }
  const ordered = [...groups.values()].sort((x, y) => Number(!x.stepId) - Number(!y.stepId));
  return ordered.flatMap((g, gi) =>
    g.items.map((o, i) => {
      let from = "";
      if (o.source.kind === "step") from = o.output && o.output !== o.name ? `← ${o.output}` : "";
      else from = `${o.source.kind === "value" ? "=" : "←"} ${o.source.text}`;
      return {
        fromStep: g.stepId,
        rule: gi > 0 && i === 0,
        ...(i === 0
          ? {
              tag: g.title,
              tagCls: g.stepId ? "rf-tag rf-out-step" : "rf-tag",
              tagW: g.stepId ? CHAR_W : PILL_CHAR_W,
              arrivals: g.items
                .filter((x) => x.stepId && x.output)
                .map((x) => ({ stepId: x.stepId, name: x.output })),
            }
          : {}),
        parts: [
          part(o.name, "rf-out-name", CHAR_W, { x: PAD }),
          ...(from ? [part(from, "rf-out-from", MONO_W, { dx: 8 })] : []),
        ],
      };
    }),
  );
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
 *   `success` / `failure` (goto lines)
 */
export function renderFlowDiagram(graph, options = {}) {
  if (!graph) return { svg: "", legend: [] };
  const { idPrefix = "rf", interactive = false } = options;
  const expanded = options.view !== "compact";
  const drawn = new Set();

  // ---- Nodes, top to bottom, with their rows ----
  const nodes = [];
  // The inputs and outputs boxes are the same in both views; only step boxes are compacted
  if (graph.inputs.length) {
    nodes.push({ key: "inputs", kind: "io", title: "Inputs", rows: inputRows(graph) });
  }
  for (const step of graph.steps) {
    if (expanded) {
      nodes.push({
        key: step.stepId,
        kind: "step",
        step,
        sections: [
          bindingRows(step),
          checkRows(step),
          ...actionSections(step),
          stepOutputRows(step),
        ].filter((rows) => rows.length),
      });
    } else {
      // Compact boxes show no actions; a step's own gotos still draw their lines
      const gotos = step.actions.filter(
        (a) => !a.inherited && !a.shadowed && a.type === "goto" && a.stepId,
      );
      nodes.push({ key: step.stepId, kind: "step", step, gotos, sections: [] });
    }
  }
  if (graph.outputs.length) {
    nodes.push({ key: "outputs", kind: "io", title: "Outputs", rows: outputRows(graph) });
  }
  const index = new Map(nodes.map((n, i) => [n.key, i]));
  const rowsOf = (n) => (n.kind === "io" ? n.rows : n.sections.flat());

  // ---- Box width: the longest line, at least BOX_MIN (expanded) or BOX_W (compact) ----
  const widths = nodes.flatMap((n) => [
    ...rowsOf(n).map((r) => rowExtent(r).end + tagWidth(r) + PAD),
    n.kind === "step" && expanded ? headerWidth(n.step) : 0,
  ]);
  const boxW = Math.min(BOX_MAX, Math.max(expanded ? BOX_MIN : BOX_W, ...widths));
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
      n.h = Math.max(60, COMPACT_GOTO_Y + n.gotos.length * 8 + 4);
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
  const addTarget = (fromIdx, toIdx, label, rowBy, outputName) => {
    const output = nodes[toIdx].key === "outputs";
    const key = `${fromIdx}\u0000${output}\u0000${label}`;
    const group = groups.get(key) || {
      from: fromIdx,
      label,
      output,
      targets: [],
      departs: new Set(),
    };
    if (!group.targets.some((t) => t.node === toIdx && t.by === rowBy)) {
      group.targets.push({ node: toIdx, by: rowBy });
    }
    if (outputName) group.departs.add(outputName);
    groups.set(key, group);
  };
  if (expanded) {
    // Lines start at each output row of the source step that is read
    nodes.forEach((n, j) => {
      for (const r of rowsOf(n)) {
        for (const ref of r.arrivals || []) {
          const i = index.get(ref.stepId);
          if (i !== undefined && i < j) addTarget(i, j, "", r.by, ref.name);
        }
      }
    });
  } else {
    for (const e of graph.dataEdges) {
      if (!index.has(e.from) || !index.has(e.to) || index.get(e.from) >= index.get(e.to)) continue;
      if (e.to === "outputs") {
        // Into the outputs table: arrive at the step's group, as in the expanded view
        const row = rowsOf(nodes[index.get("outputs")]).find((r) =>
          r.arrivals?.some((ref) => ref.stepId === e.from),
        );
        addTarget(index.get(e.from), index.get(e.to), "", row?.by);
        continue;
      }
      addTarget(index.get(e.from), index.get(e.to), truncate(e.labels.join(", "), 28), undefined);
    }
  }
  const dataEdges = [...groups.values()].map((g) => {
    const targets = g.targets.sort((a, b) => a.node - b.node || (a.by ?? 0) - (b.by ?? 0));
    return { ...g, targets, span: [g.from, targets.at(-1).node] };
  });
  const dataLaneCount = assignLanes(dataEdges);

  // ---- Left-hand goto edges, from the box's left edge (compact) or an action line (expanded) ----
  const gotoEdges = [];
  nodes.forEach((n, i) => {
    if (n.kind !== "step") return;
    const sources = expanded
      ? rowsOf(n)
          .filter((r) => r.action)
          .map((r) => ({ action: r.action, by: r.by }))
      : n.gotos.map((a, gi) => ({ action: a, by: COMPACT_GOTO_Y + gi * 8 + 4 }));
    for (const src of sources) {
      const target = src.action.type === "goto" ? src.action.stepId : "";
      if (!target || !index.has(target) || target === n.key) continue;
      const j = index.get(target);
      gotoEdges.push({ ...src, from: i, to: j, span: [Math.min(i, j), Math.max(i, j)] });
    }
  });
  const gotoLaneCount = assignLanes(gotoEdges);

  // ---- Horizontal geometry ----
  const gotoW = gotoLaneCount ? gotoLaneCount * LANE + 8 : 0;
  const boxX = MARGIN + gotoW;
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
    const ys = e.targets.map((t) => portY(t.node, "in", t.by));
    const source = nodes[e.from];
    const departs = expanded
      ? rowsOf(source)
          .filter((r) => r.departs && e.departs.has(r.departs))
          .map((r) => source.y + r.by - 4)
      : [];
    if (!departs.length) departs.push(portY(e.from, "out"));
    const y1 = Math.min(...departs);
    const from = ` data-from-step="${escapeXml(source.key)}"`;
    for (const dy of departs) out.push(`<path class="${cls}"${from} d="M${boxR} ${dy}H${x}"/>`);
    out.push(`<path class="${cls}"${from} d="M${x} ${y1}V${Math.max(...ys)}"/>`);
    for (const ty of ys) {
      out.push(
        `<path class="${cls}"${from} d="M${x} ${ty}H${boxR + 2}" marker-end="url(#${idPrefix}-${head})"/>`,
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
    const py = from.y + e.by - 4;
    const start = boxX;
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
        n.key === "outputs" && graph.outputs.some((o) => o.stepId)
          ? `<text class="rf-io-title" x="${boxX + boxW - PAD}" y="${n.y + 20}" text-anchor="end">From step</text>`
          : "",
        ...n.rows.map((r) => renderRow(r, boxX, boxW, n.y + r.by, interactive)),
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
      s.successCriteria && !expanded
        ? `<text class="rf-criteria" x="${boxR - 12}" y="${n.y + 24}" text-anchor="end">${s.successCriteria} check${s.successCriteria > 1 ? "s" : ""}</text>`
        : "",
      ...(n.separators || []).map(
        (sy) => `<path class="rf-sep" d="M${boxX} ${n.y + sy}H${boxR}"/>`,
      ),
      ...n.sections.flat().map((r) => renderRow(r, boxX, boxW, n.y + r.by, interactive)),
      `</g>`,
    );
  }

  out.push("</svg>");
  const order = ["seq", "data", "output", "success", "failure"];
  return { svg: out.join(""), legend: order.filter((k) => drawn.has(k)) };
}

/** The diagram as an SVG string; see renderFlowDiagram for the options. */
export function renderFlowSvg(graph, options = {}) {
  return renderFlowDiagram(graph, options).svg;
}
