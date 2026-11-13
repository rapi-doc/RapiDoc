/**
 * Lays out a flow graph (see graph.js) and draws it as an SVG string. No DOM: text widths are
 * estimated from character counts, so the same code runs in Node and the browser.
 *
 * Steps are stacked top to bottom between the workflow's inputs and outputs. A goto or retry
 * draws a line through the lanes on the left to its target step; lines have rounded corners.
 * Values passed between steps draw no lines: each value names the step it comes from
 * ("← from <step>.<output>"). The inputs box (each input's type, required flag, default and enum
 * values) and the outputs box are the same in both views; the views differ in the step boxes:
 * - "expanded" (default): each step lists the values it sends and where they come from (input,
 *   from a step, fixed or expr), its checks, its actions as "condition → what happens", and the
 *   outputs something reads.
 * - "compact": each step shows its name, method, path, number of checks and the values it sends.
 */

const BOX_MIN = 360; // both views; boxes grow with their longest line up to BOX_MAX
const BOX_MAX = 560;
const PAD = 16;
const ROW = 18;
const HEADER_H = 52; // a step's title and method/path lines
const GAP = 40;
const LANE = 20;
const MARGIN = 16;
const COMPACT_GOTO_Y = 30; // compact: first goto line leaves the box's left edge this far down
const ARRIVAL_ZONE = 18; // top strip of a step's left edge where goto lines arrive
const ACTION_LINE_GAP = 10; // expanded: between action lines leaving a box's left edge
const MAX_BINDINGS = 10; // more are summed up in one line; the step details list them all
const CHAR_W = 7.2; // average advance of a 12-13px sans character
const MONO_W = 7.4; // 12px monospace
const PILL_CHAR_W = 6.4; // 11px sans
const END_CHAR_W = 8; // 11px bold upper case, for the END pill
const PILL_PAD = 5; // an in-row pill's padding on each side

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
 * tag: "Inherited" }`; `name` is the action's own name ("" when the file gives none), `tag` is
 * "Inherited" for an action the step inherits and "" for the step's own. An action without criteria applies whenever the
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
  else if (a.type === "goto") does = a.stepId ? `goto ${a.stepId}` : `run workflow ${a.workflowId}`;
  else {
    does = "retry";
    if (a.retryLimit) does += ` ${a.retryLimit}×`;
    if (a.retryAfter) does += `, ${a.retryAfter}s apart`;
    if (a.stepId) does += ` from ${a.stepId}`;
  }
  return { when, does, name: a.name || "", tag: a.inherited ? "Inherited" : "" };
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

/** A pill's rounded rect: END in a step box, a line's label. */
const pillRect = (x, y, width, height, cls = "") =>
  `<rect${cls ? ` class="${cls}"` : ""} x="${x}" y="${y}" width="${width}" height="${height}" rx="3"/>`;

/**
 * One row as SVG text. A row with `fromStep` (an output row, or a value line that reads a step)
 * carries `data-from-step`; with `interactive` it is also an `rf-jump` link to that step, and the
 * step name in its tag is focusable.
 */
function renderRow(row, boxX, boxW, baseline, interactive = false) {
  const jump = interactive && row.fromStep;
  const from = row.fromStep ? ` data-from-step="${escapeXml(row.fromStep)}"` : "";
  const rowCls = jump ? "rf-row rf-jump" : "rf-row";
  // A part with `pill` gets a rounded rect behind it, PILL_PAD wider on each side
  const { starts } = rowExtent(row);
  const pills = row.parts
    .map((p, i) =>
      p.pill
        ? pillRect(
            boxX + starts[i] - PILL_PAD,
            baseline - 12,
            textWidth(p.text, p.w) + PILL_PAD * 2,
            16,
            p.pill,
          )
        : "",
    )
    .join("");
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
  // An output row is a link to its step: focusable, named for screen readers
  const link =
    jump && row.focusable
      ? ` tabindex="0" role="link" aria-label="${escapeXml(`Go to step ${row.fromStep}`)}"`
      : "";
  return `${rule}${pills}<text class="${rowCls}" y="${baseline}"${from}${link}>${tip}${tspans}</text>${tag}`;
}

// The word before each value in a step box or the outputs box, by source kind
// The word before each value in a step box or the outputs box, by source kind
const KEYWORDS = { input: "input", step: "from", value: "fixed", expression: "expr" };
// A one-character column before the keyword holds "←" for a value read from an earlier step, so
// values passed in from another step stand apart from those the step sets itself
const ARROW_W = 2 * MONO_W; // "←" plus a space
const KEYWORD_W = 6 * MONO_W; // "input" plus a space

function sourceParts(source, col, { fromKeyword = true } = {}) {
  const keyword = part(KEYWORDS[source.kind], `rf-kw rf-kw-${source.kind}`, MONO_W, {
    x: col + ARROW_W,
  });
  const valueX = col + ARROW_W + KEYWORD_W;
  // A step output reads "← from <step>.<output>" ("← <step>.<output>" in the outputs box): the
  // step name in the step color, the output plain
  if (source.kind === "step") {
    return [
      // The same arrow, in the same font and color, as an action's "→ goto"
      part("←", "rf-from-arrow", CHAR_W, { x: col }),
      ...(fromKeyword ? [keyword] : []),
      part(source.stepId, "rf-step-name", MONO_W, { x: fromKeyword ? valueX : col + ARROW_W }),
      part(`.${source.name}`, "rf-bind-val", MONO_W),
    ];
  }
  return [keyword, part(source.text, "rf-bind-val", MONO_W, { x: valueX })];
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
 * The step's own outputs that something later reads, with where they come from. Unused outputs
 * are counted on one line.
 */
function stepOutputRows(step) {
  if (!step.usedOutputs.length) return [];
  const nameChars = Math.min(24, Math.max(4, ...step.usedOutputs.map((o) => o.name.length)));
  const col = PAD + nameChars * MONO_W + 12;
  const rows = [
    { parts: [part("Outputs", "rf-sec-title", PILL_CHAR_W, { x: PAD })] },
    ...step.usedOutputs.map((o) => ({
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

/** A step's actions for one outcome that can run, each with its wording (describeAction). */
function describedActions(step, outcome) {
  return step.actions
    .filter((a) => a.outcome === outcome && !a.shadowed)
    .map((a, i) => ({ a, d: describeAction(a, step.criteria.length, i) }));
}

/**
 * The step an action draws a line to: a goto's step, or a retry's (its own step unless it names
 * one). "" when the action draws none (end, goto to a workflow, a step not in this workflow).
 */
function actionTarget(a, step, stepIds) {
  if (a.type === "goto") return a.stepId && stepIds.has(a.stepId) ? a.stepId : "";
  if (a.type === "retry") return !a.stepId || stepIds.has(a.stepId) ? a.stepId || step.stepId : "";
  return "";
}

const EDGE_LABEL_CHARS = 20;

/**
 * The actions a step draws as lines, the whole action in the label's tooltip: "status 503 →
 * retry 3×, 2s apart (storeBusy)". A goto's label is the action's name (or where it goes); a
 * retry's is how many times and how far apart, "retry 3× @ 2s", its name being on its action line.
 */
/** Corner radius of the lines between boxes. */
const CORNER_R = 6;
const num = (v) => String(Math.round(v * 100) / 100);

/**
 * An SVG path through `points` ([x, y] pairs joined by straight segments) with each corner
 * rounded: a quadratic curve of up to `CORNER_R`, less where a segment is too short for it.
 */
function roundedPath(points) {
  const pts = points.filter(
    (p, i) => i === 0 || p[0] !== points[i - 1][0] || p[1] !== points[i - 1][1],
  );
  let d = `M${num(pts[0][0])} ${num(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const [nx, ny] = pts[i + 1];
    const l1 = Math.hypot(cx - px, cy - py);
    const l2 = Math.hypot(nx - cx, ny - cy);
    const r = Math.min(CORNER_R, l1 / 2, l2 / 2);
    const ax = cx - ((cx - px) / l1) * r;
    const ay = cy - ((cy - py) / l1) * r;
    const bx = cx + ((nx - cx) / l2) * r;
    const by = cy + ((ny - cy) / l2) * r;
    d += `L${num(ax)} ${num(ay)}Q${num(cx)} ${num(cy)} ${num(bx)} ${num(by)}`;
  }
  const last = pts.at(-1);
  return `${d}L${num(last[0])} ${num(last[1])}`;
}

/** A retry line's label: "retry 3× @ 2s" ("retry 3×", "retry @ 2s", "retry"). */
function retryLabel(a) {
  return `retry${a.retryLimit ? ` ${a.retryLimit}×` : ""}${a.retryAfter ? ` @ ${a.retryAfter}s` : ""}`;
}

function actionLines(step, stepIds) {
  return ["success", "failure"].flatMap((outcome) =>
    describedActions(step, outcome)
      .filter(({ a }) => actionTarget(a, step, stepIds))
      .map(({ a, d }) => ({
        action: a,
        target: actionTarget(a, step, stepIds),
        kind: a.type === "retry" ? "retry" : outcome,
        label: truncate(a.type === "retry" ? retryLabel(a) : d.name || d.does, EDGE_LABEL_CHARS),
        tip: `${d.when} → ${d.does}${d.name ? ` (${d.name})` : ""}${d.tag ? ", inherited from the workflow" : ""}`,
      })),
  );
}

/**
 * "On success" and "On failure" sections: one line per action, in the order a runner checks.
 * Actions that can never run (`shadowed`) are left out; the graph's `warnings` name them. A goto
 * to a step and a retry also draw a line, which starts at their action line.
 */
function actionSections(step, stepIds) {
  return ["success", "failure"]
    .map((outcome) => {
      const listed = describedActions(step, outcome);
      // When the section applies: a step succeeds only when all its checks pass
      const checks = step.successCriteria;
      const applies =
        checks > 1
          ? { success: "if all checks pass", failure: "if any check fails" }[outcome]
          : checks === 1
            ? { success: "if the check passes", failure: "if the check fails" }[outcome]
            : "";
      const heading = (note) => ({
        parts: [
          part(`On ${outcome}`, "rf-sec-title", PILL_CHAR_W, { x: PAD }),
          ...(note.length
            ? [part(`· ${note.join(" · ")}`, "rf-sec-note", PILL_CHAR_W, { dx: 6 })]
            : []),
        ],
      });
      if (!listed.length) {
        // No action on success: the next-step arrow says it. No action on failure: Arazzo ends
        // the workflow, shown as a faded END pill so every step says what a failure does
        if (outcome === "success") return [];
        return [
          heading(applies ? [applies] : []),
          {
            tip: "No failure action: the workflow ends",
            parts: [
              part("END", "rf-end rf-failure rf-default", END_CHAR_W, {
                x: PAD + PILL_PAD,
                pill: "rf-end-pill rf-failure rf-default",
              }),
              part("(default)", "rf-act-name", CHAR_W, { dx: 8 + PILL_PAD }),
            ],
          },
        ];
      }
      const actions = listed.map(({ a }) => a);
      // An action without criteria that comes first applies whenever the step fails (or
      // succeeds), which the heading already says: no condition, no arrow. It is then the only
      // action that runs; the ones after it are shadowed.
      const whens = listed.map(({ a, d }, i) =>
        !(a.criteria || []).length && i === 0 ? "" : d.when,
      );
      const described = listed.map(({ d }) => d);
      const whenChars = Math.min(34, Math.max(...whens.map((w) => w.length)));
      const col = whenChars ? PAD + whenChars * CHAR_W + 12 : PAD;
      // The order of the actions matters only when there is a choice
      return [
        heading([applies, listed.length > 1 ? "first match runs" : ""].filter(Boolean)),
        ...actions.map((a, i) => {
          const when = whens[i]
            ? [part(truncate(whens[i], whenChars), "rf-act-when", CHAR_W, { x: PAD })]
            : [];
          const arrow = whens[i] ? "→ " : "";
          // A goto with a line: "→ goto <step>", the step in the step color; its name labels
          // the line
          if (a.type === "goto" && actionTarget(a, step, stepIds)) {
            return {
              action: a,
              tag: described[i].tag,
              tagCls: "rf-tag rf-inherited",
              parts: [
                ...when,
                part(`${arrow}goto `, "rf-act-then", CHAR_W, { x: col }),
                part(a.stepId, "rf-step-name", CHAR_W),
              ],
            };
          }
          // An end reads as an END pill
          const does =
            a.type === "end"
              ? [
                  ...(arrow ? [part("→", "rf-act-then", CHAR_W, { x: col })] : []),
                  // Red on failure, green on success, as the goto lines
                  part("END", `rf-end rf-${outcome}`, END_CHAR_W, {
                    ...(arrow ? { dx: 8 + PILL_PAD } : { x: col + PILL_PAD }),
                    pill: `rf-end-pill rf-${outcome}`,
                  }),
                ]
              : [part(`${arrow}${described[i].does}`, "rf-act-then", CHAR_W, { x: col })];
          return {
            // A retry's line starts here; it is labelled with how many times and how far apart
            ...(a.type === "retry" && actionTarget(a, step, stepIds) ? { action: a } : {}),
            tag: described[i].tag,
            tagCls: "rf-tag rf-inherited",
            parts: [
              ...when,
              ...does,
              // The name often says what the action is for; it is cut first when the line is long
              ...(described[i].name
                ? [
                    part(`(${described[i].name})`, "rf-act-name", CHAR_W, {
                      dx: a.type === "end" ? 8 + PILL_PAD : 8,
                    }),
                  ]
                : []),
            ],
          };
        }),
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

// Binding sections, in request order; parameters without `in` (a workflow step's) come before the body
const BINDING_GROUPS = [
  ["path", "Path params"],
  ["query", "Query params"],
  ["header", "Header params"],
  ["cookie", "Cookie params"],
  ["", "Parameters"],
  ["body", "Request body"],
];

/** A request body field's name without the `body.` prefix: `body.petId` reads `petId`. */
function bodyFieldName(name) {
  if (name === "body") return "payload";
  if (name.startsWith("body.")) return name.slice(5);
  if (name.startsWith("body ")) return name.slice(5); // a replacement's target
  return name;
}

/**
 * The values a step sends, one section per location (Path, Query, Header, Cookie, Request body
 * with its content type), request body fields without their `body.` prefix. At most
 * MAX_BINDINGS are listed; the rest are counted at the end of the last section.
 */
function bindingSections(step) {
  const shown = step.bindings.slice(0, MAX_BINDINGS).map((b) => ({
    ...b,
    label: b.in === "body" ? bodyFieldName(b.name) : b.name,
    group: BINDING_GROUPS.some(([key]) => key === b.in) ? b.in : "",
  }));
  if (!shown.length) return [];
  const nameChars = Math.min(18, Math.max(4, ...shown.map((b) => b.label.length)));
  const col = PAD + nameChars * MONO_W + 12;
  const sections = BINDING_GROUPS.map(([key, title]) => {
    const items = shown.filter((b) => b.group === key);
    if (!items.length) return [];
    const type = key === "body" ? step.requestBody?.contentType : "";
    return [
      {
        parts: [
          part(title, "rf-sec-title", PILL_CHAR_W, { x: PAD }),
          ...(type ? [part(`(${type})`, "rf-sec-note", PILL_CHAR_W, { dx: 6 })] : []),
        ],
      },
      ...items.map((b) => ({
        fromStep: b.fromSteps[0],
        parts: [
          part(truncate(b.label, nameChars), "rf-bind-name", MONO_W, { x: PAD }),
          ...sourceParts(b.source, col),
        ],
      })),
    ];
  }).filter((rows) => rows.length);
  const hidden = step.bindings.slice(MAX_BINDINGS);
  if (hidden.length) {
    sections.at(-1).push({
      parts: [
        part(`+${hidden.length} more in the step details`, "rf-more", PILL_CHAR_W, { x: PAD }),
      ],
    });
  }
  return sections;
}

/**
 * The outputs box: one row per output, as a step's value lines read: the output's name, then
 * "← <step>.<output>" for a step's output (the step in the step color), or the source keyword and
 * value (`input`, `fixed`, `expr`). Rows are grouped by step, in the order each step first
 * appears, with a rule between groups; outputs not taken from a step come last.
 */
function outputRows(graph) {
  const groups = new Map();
  for (const o of graph.outputs) {
    const source = o.source || { kind: "expression", text: o.expr };
    const key = o.stepId ? `step:${o.stepId}` : `kind:${source.kind}`;
    if (!groups.has(key)) groups.set(key, { stepId: o.stepId, items: [] });
    groups.get(key).items.push({ ...o, source });
  }
  const ordered = [...groups.values()].sort((x, y) => Number(!x.stepId) - Number(!y.stepId));
  const nameChars = Math.min(22, Math.max(4, ...graph.outputs.map((o) => o.name.length)));
  const col = PAD + nameChars * CHAR_W + 12;
  return ordered.flatMap((g, gi) =>
    g.items.map((o, i) => ({
      fromStep: g.stepId,
      focusable: Boolean(g.stepId),
      rule: gi > 0 && i === 0,
      parts: [
        part(truncate(o.name, nameChars), "rf-out-name", CHAR_W, { x: PAD }),
        ...sourceParts(o.source, col, { fromKeyword: false }),
      ],
    })),
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
 * @param {Record<string, string[]>} [options.stepClasses] more classes on a step's box, by step
 *   id (`<rapi-flow>`: `rf-selected`, `rf-running`)
 * @returns {{ svg: string, legend: string[], legendHtml: string }} `legend` names the kinds of
 *   lines drawn, in this order: `seq` (next step), `success` / `failure` (goto lines), `retry`;
 *   `legendHtml` is a `<ul class="flow-legend">` for them (styled by the flow CSS), "" when none
 */
export function renderFlowDiagram(graph, options = {}) {
  if (!graph) return { svg: "", legend: [], legendHtml: "" };
  const { idPrefix = "rf", interactive = false, stepClasses = {} } = options;
  const expanded = options.view !== "compact";
  const drawn = new Set();

  // ---- Nodes, top to bottom, with their rows ----
  const nodes = [];
  // The inputs and outputs boxes are the same in both views; only step boxes are compacted
  if (graph.inputs.length) {
    nodes.push({ key: "inputs", kind: "io", title: "Inputs", rows: inputRows(graph) });
  }
  const stepIds = new Set(graph.steps.map((s) => s.stepId));
  for (const step of graph.steps) {
    // Gotos to a step and retries are labelled lines. Compact boxes list only the values a
    // step sends (no checks, actions or outputs), so where data comes from shows in both views.
    const sections = expanded
      ? [
          ...bindingSections(step),
          checkRows(step),
          ...actionSections(step, stepIds),
          stepOutputRows(step),
        ]
      : bindingSections(step);
    nodes.push({
      key: step.stepId,
      kind: "step",
      step,
      lines: actionLines(step, stepIds),
      sections: sections.filter((rows) => rows.length),
    });
  }
  if (graph.outputs.length) {
    nodes.push({ key: "outputs", kind: "io", title: "Outputs", rows: outputRows(graph) });
  }
  const index = new Map(nodes.map((n, i) => [n.key, i]));
  const rowsOf = (n) => (n.kind === "io" ? n.rows : n.sections.flat());

  // ---- Box width: the longest line, at least BOX_MIN ----
  const widths = nodes.flatMap((n) => [
    ...rowsOf(n).map((r) => rowExtent(r).end + tagWidth(r) + PAD),
    n.kind === "step" ? headerWidth(n.step) : 0,
  ]);
  const boxW = Math.min(BOX_MAX, Math.max(BOX_MIN, ...widths));
  for (const n of nodes) for (const r of rowsOf(n)) fitRow(r, boxW);
  const boxChars = Math.floor((boxW - 32) / CHAR_W);

  // ---- Heights and row baselines (relative to the node's top) ----
  for (const n of nodes) {
    if (n.kind === "io") {
      n.rows.forEach((r, ri) => (r.by = 40 + ri * ROW));
      n.h = 34 + n.rows.length * ROW;
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
    n.h = expanded
      ? Math.max(60, bottom + 8, HEADER_H + n.lines.length * ACTION_LINE_GAP + 12)
      : Math.max(60, bottom + 8, COMPACT_GOTO_Y + n.lines.length * 8 + 4);
  }

  // ---- Left-hand action lines (gotos and retries), from the box's left edge ----
  // Compact: below the title. Expanded: a goto from its action line; a retry near the bottom of
  // the box, under its last section, looping back into the top of the box for its own step.
  const gotoEdges = [];
  nodes.forEach((n, i) => {
    if (n.kind !== "step") return;
    const rows = rowsOf(n);
    const bottom = n.lines.filter((line) => !rows.some((r) => r.action === line.action));
    n.lines.forEach((line, li) => {
      const j = index.get(line.target);
      if (j === undefined) return;
      const row = rows.find((r) => r.action === line.action);
      // Compact: a loop into its own step leaves near the bottom of the box, so it spans the box
      // with its label on the line, in the middle; other lines leave below the title
      let by = COMPACT_GOTO_Y + li * 8 + 4;
      if (!expanded && j === i) {
        const loops = n.lines.filter((l) => index.get(l.target) === i);
        by = n.h - 10 - (loops.length - 1 - loops.indexOf(line)) * 8;
      }
      if (expanded) {
        by = row ? row.by : n.h - 12 - (bottom.length - 1 - bottom.indexOf(line)) * ACTION_LINE_GAP;
      }
      // Half a node more on the side the line leaves from, so lines that meet at a box get
      // different lanes, a loop included
      const span = [Math.min(i, j), Math.max(i, j) + 0.5];
      gotoEdges.push({ ...line, by, from: i, to: j, span });
    });
  });
  const gotoLaneCount = assignLanes(gotoEdges);

  // ---- Horizontal geometry ----
  // Labels sit on the lines, centred, so the gutter holds half a label each side of the lanes
  const gotoLabelW = Math.max(0, ...gotoEdges.map((e) => textWidth(e.label, PILL_CHAR_W) + 14));
  const gotoW = gotoLaneCount ? (gotoLaneCount - 1) * LANE + gotoLabelW + 12 : 0;
  const boxX = MARGIN + gotoW;
  const boxR = boxX + boxW;
  const width = boxR + MARGIN;

  // ---- Vertical geometry ----
  let y = MARGIN;
  for (const n of nodes) {
    n.y = y;
    n.cy = y + n.h / 2;
    y += n.h + GAP;
  }
  const height = y - GAP + MARGIN;

  const out = [];
  const marker = (id, cls) =>
    `<marker id="${idPrefix}-${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="${cls}"/></marker>`;
  out.push(
    `<svg xmlns="http://www.w3.org/2000/svg" class="rf-svg rf-${expanded ? "expanded" : "compact"}" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="group" aria-label="${escapeXml(`Workflow ${graph.workflowId}`)}">`,
    `<defs>${marker("seq", "rf-head-seq")}${["success", "failure", "retry"].map((k) => marker(k, `rf-head rf-${k}`)).join("")}</defs>`,
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

  // Action lines (gotos and retries), each with its label on the line, centred
  const placedGotoLabels = [];
  for (const e of gotoEdges) {
    const from = nodes[e.from];
    const to = nodes[e.to];
    const x = boxX - 12 - gotoLabelW / 2 - e.lane * LANE;
    const py = from.y + e.by - 4;
    const ty = to.y + ARRIVAL_ZONE / 2;
    drawn.add(e.kind);
    out.push(
      `<path class="rf-goto rf-${e.kind}" data-from-step="${escapeXml(from.key)}" d="${roundedPath([
        [boxX, py],
        [x, py],
        [x, ty],
        [boxX - 2, ty],
      ])}" marker-end="url(#${idPrefix}-${e.kind})"/>`,
    );
    const w = textWidth(e.label, PILL_CHAR_W) + 14;
    const cx = x;
    let ly = (py + ty) / 2 - 9;
    while (
      placedGotoLabels.some(
        (l) => cx - w / 2 < l.x + l.w && l.x < cx + w / 2 && ly < l.y + 20 && l.y < ly + 20,
      )
    )
      ly += 20;
    placedGotoLabels.push({ x: cx - w / 2, y: ly, w });
    out.push(
      `<g class="rf-goto-label rf-${e.kind}"><title>${escapeXml(e.tip)}</title>${pillRect(cx - w / 2, ly, w, 18)}<text x="${cx}" y="${ly + 13}" text-anchor="middle">${escapeXml(e.label)}</text></g>`,
    );
  }

  // Nodes
  for (const n of nodes) {
    if (n.kind === "io") {
      out.push(
        `<g class="rf-node rf-io rf-${n.key}"><rect x="${boxX}" y="${n.y}" width="${boxW}" height="${n.h}" rx="8"/>`,
        `<text class="rf-io-title" x="${boxX + PAD}" y="${n.y + 20}">${n.title}</text>`,
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
      `<g class="${["rf-node rf-step", clickable ? "rf-clickable" : "", ...(stepClasses[s.stepId] || [])].filter(Boolean).join(" ")}" data-step-id="${escapeXml(s.stepId)}"${attrs}>`,
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
  const legend = Object.keys(LEGEND).filter((k) => drawn.has(k));
  return { svg: out.join(""), legend, legendHtml: legendHtml(legend) };
}

/** Each kind of line a diagram can draw: its classes and its words in the legend, in order. */
const LEGEND = {
  seq: ["rf-seq", "rf-head-seq", "next step"],
  success: ["rf-goto rf-success", "rf-head rf-success", "goto on success"],
  failure: ["rf-goto rf-failure", "rf-head rf-failure", "goto on failure"],
  retry: ["rf-goto rf-retry", "rf-head rf-retry", "retry"],
};

/**
 * The legend for the kinds of lines a diagram drew, as HTML: each a short line in that line's
 * classes (the flow CSS colors and dashes it) and its words. Shared by <rapi-flow> and pages
 * that show the diagram drawn at build time.
 */
function legendHtml(kinds) {
  const items = kinds.filter((k) => LEGEND[k]);
  if (!items.length) return "";
  const li = (k) =>
    `<li><svg width="28" height="10" aria-hidden="true"><path class="${LEGEND[k][0]}" d="M1 5H23"/><path class="${LEGEND[k][1]}" d="M22 1L28 5L22 9z"/></svg>${LEGEND[k][2]}</li>`;
  return `<ul class="flow-legend" part="legend" aria-label="Legend">${items.map(li).join("")}</ul>`;
}

/** The diagram as an SVG string; see renderFlowDiagram for the options. */
export function renderFlowSvg(graph, options = {}) {
  return renderFlowDiagram(graph, options).svg;
}
