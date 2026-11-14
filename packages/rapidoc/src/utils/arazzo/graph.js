/**
 * Turns one Arazzo workflow into the graph the diagram draws: steps in order, the values passed
 * between them, and each step's success and failure actions.
 */
import { collectRefs } from "./refs.js";
import { resolveComponentRef } from "./components.js";
import { mergeActions, readActions, readCriteria } from "./actions.js";
import { resolveOperation } from "./operations.js";

// The diagram's criteria: as read, without the list position the MCP compiler reports by
const withoutIndex = ({ index: _index, ...rest }) => rest;
const normalizeCriteria = (list) => readCriteria(list).map(withoutIndex);

function normalizeActions(doc, list, kind, outcome, inherited) {
  return readActions(doc, list, kind).map((a) => {
    const plain = a.criteria.map(withoutIndex);
    return {
      outcome,
      type: a.type,
      name: a.name,
      stepId: a.stepId,
      workflowId: a.workflowId,
      retryAfter: a.retryAfter,
      retryLimit: a.retryLimit,
      criteria: plain,
      conditional: plain.length > 0,
      inherited,
    };
  });
}

/**
 * The actions a runner checks for a step (mergeActions). It takes the first whose criteria match,
 * so every action after one without criteria is marked `shadowed`: it can never run.
 */
function markShadowed(actions) {
  const first = actions.findIndex((a) => !a.conditional);
  return actions.map((a, i) => ({ ...a, shadowed: first >= 0 && i > first }));
}

/** The workflow's `inputs` JSON Schema (or a `$ref` to `#/components/inputs/<name>`) as rows. */
function describeInputs(doc, schema) {
  const ref =
    typeof schema?.$ref === "string" && schema.$ref.match(/^#\/components\/inputs\/(.+)$/);
  const resolved = ref ? doc?.components?.inputs?.[ref[1]] : schema;
  const required = new Set(Array.isArray(resolved?.required) ? resolved.required : []);
  return Object.entries(resolved?.properties || {}).map(([name, prop]) => ({
    name,
    type: prop?.type ? [].concat(prop.type).join(" | ") : prop?.enum ? "enum" : "",
    format: prop?.format || "",
    required: required.has(name),
    default: prop?.default,
    enum: Array.isArray(prop?.enum) ? prop.enum : undefined,
    description: prop?.description || "",
  }));
}

function describeParameters(doc, list) {
  return (Array.isArray(list) ? list : [])
    .map((raw) => resolveComponentRef(doc, raw, "parameters"))
    .filter((p) => p && p.name)
    .map((p) => ({ name: p.name, in: p.in || "", value: p.value }));
}

/**
 * Where a value comes from, for one line in a step box: a workflow input, a step output, another
 * runtime expression, or a fixed value.
 */
function describeSource(value) {
  if (typeof value === "string") {
    const text = value.trim();
    let m = text.match(/^\$inputs\.([A-Za-z0-9_-]+)$/);
    if (m) return { kind: "input", name: m[1], text: m[1] };
    m = text.match(/^\$steps\.([A-Za-z0-9_-]+)\.outputs\.([A-Za-z0-9_-]+)$/);
    if (m) return { kind: "step", stepId: m[1], name: m[2], text: `${m[1]}.${m[2]}` };
    if (text.includes("$")) return { kind: "expression", text };
    return { kind: "value", text };
  }
  return { kind: "value", text: value === undefined ? "" : JSON.stringify(value) };
}

function flattenPayload(obj, prefix, rows) {
  for (const [key, value] of Object.entries(obj)) {
    const name = `${prefix}.${key}`;
    if (value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length) {
      flattenPayload(value, name, rows);
    } else rows.push({ name, in: "body", value });
  }
}

/** A step's parameters and request body fields, one row per value it sends. */
function describeBindings(parameters, requestBody) {
  const rows = parameters.map((p) => ({ name: p.name, in: p.in, value: p.value }));
  const payload = requestBody?.payload;
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    flattenPayload(payload, "body", rows);
  } else if (payload !== undefined && payload !== null) {
    rows.push({ name: "body", in: "body", value: payload });
  }
  for (const r of requestBody?.replacements || []) {
    if (r?.target) rows.push({ name: `body ${r.target}`, in: "body", value: r.value });
  }
  return rows.map((r) => {
    const stepRefs = collectRefs(r.value).filter((x) => x.kind === "step");
    return {
      ...r,
      source: describeSource(r.value),
      fromSteps: [...new Set(stepRefs.map((x) => x.stepId))],
      fromOutputs: stepRefs.filter((x) => x.name).map((x) => ({ stepId: x.stepId, name: x.name })),
    };
  });
}

const listOf = (names) =>
  names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0];

/**
 * One warning per step and outcome whose actions include some that can never run, because an
 * earlier action without criteria always matches first.
 */
function shadowWarnings(steps, workflowIndex) {
  const warnings = [];
  steps.forEach((step, si) => {
    for (const outcome of ["success", "failure"]) {
      const actions = step.actions.filter((a) => a.outcome === outcome);
      const never = actions.filter((a) => a.shadowed);
      if (!never.length) continue;
      const catchAll = actions.find((a) => !a.conditional);
      const names = never.map((a) => a.name || `an unnamed ${a.type}`);
      const whose = never.every((a) => a.inherited) ? "the workflow's " : "";
      const verb = never.length > 1 ? "never run" : "never runs";
      warnings.push({
        level: "warning",
        path: `workflows[${workflowIndex}].steps[${si}].${outcome === "failure" ? "onFailure" : "onSuccess"}`,
        message: `${step.stepId}: ${whose}${listOf(names)} ${verb}, because ${catchAll?.name || "an action"} has no criteria and always matches first`,
      });
    }
  });
  return warnings;
}

function pushEdge(edges, from, to, label) {
  const edge = edges.find((e) => e.from === from && e.to === to);
  if (!edge) edges.push({ from, to, labels: [label] });
  else if (!edge.labels.includes(label)) edge.labels.push(label);
}

/**
 * @param {object} doc Parsed Arazzo document
 * @param {string} [workflowId] Defaults to the first workflow
 * @param {object} [options]
 * @param {Map<string, {byId: Map, byPath: Map}>} [options.sources] operation indexes by source name
 * Each step's `bindings` list the values it sends (`{ name, in, value, source, fromSteps }`, with
 * body fields named `body.<path>`; `fromOutputs` the `{ stepId, name }` step outputs they read);
 * `usedOutputs` are the step's own outputs that a later step or the workflow reads; `source` is `{ kind: 'input'|'step'|'expression'|'value', text }`.
 *
 * @returns {object|null} `{ workflowId, summary, description, inputs, inputDetails, workflowActions,
 *   operationsKnown, outputs, steps, dataEdges, warnings }`,
 *   or null when there is no such workflow. Data edges go from a step id to a later step id or
 *   to "outputs"; `labels` are the output names passed.
 */
export function buildFlowGraph(doc, workflowId, options = {}) {
  const workflows = Array.isArray(doc?.workflows) ? doc.workflows : [];
  const workflow = workflowId ? workflows.find((w) => w?.workflowId === workflowId) : workflows[0];
  if (!workflow) return null;

  const rawSteps = Array.isArray(workflow.steps) ? workflow.steps : [];
  const stepIds = new Set(rawSteps.map((s) => s?.stepId).filter(Boolean));
  const workflowSuccess = normalizeActions(
    doc,
    workflow.successActions,
    "successActions",
    "success",
    true,
  );
  const workflowFailure = normalizeActions(
    doc,
    workflow.failureActions,
    "failureActions",
    "failure",
    true,
  );
  const dataEdges = [];

  const steps = rawSteps.map((s) => {
    const onSuccess = normalizeActions(doc, s.onSuccess, "successActions", "success", false);
    const onFailure = normalizeActions(doc, s.onFailure, "failureActions", "failure", false);
    const operation = s.workflowId ? null : resolveOperation(s, options.sources);
    const refs = collectRefs([s.parameters, s.requestBody]);
    for (const ref of refs) {
      if (ref.kind === "step" && ref.name && ref.stepId !== s.stepId && stepIds.has(ref.stepId)) {
        pushEdge(dataEdges, ref.stepId, s.stepId, ref.name);
      }
    }
    const criteria = normalizeCriteria(s.successCriteria);
    const parameters = describeParameters(doc, s.parameters);
    return {
      stepId: s.stepId || "",
      description: s.description || "",
      kind: s.workflowId ? "workflow" : "operation",
      workflowId: s.workflowId || "",
      operationRef: s.operationId || s.operationPath || "",
      operation,
      inputs: refs.filter((r) => r.kind === "input").map((r) => r.name),
      outputs: Object.keys(s.outputs || {}),
      outputExprs: Object.entries(s.outputs || {}).map(([name, expr]) => ({ name, expr })),
      parameters,
      requestBody: s.requestBody || null,
      bindings: describeBindings(parameters, s.requestBody),
      criteria,
      successCriteria: criteria.length,
      actions: [
        ...markShadowed(mergeActions(onSuccess, workflowSuccess)),
        ...markShadowed(mergeActions(onFailure, workflowFailure)),
      ],
    };
  });

  const inputDetails = describeInputs(doc, workflow.inputs);
  const outputs = Object.entries(workflow.outputs || {}).map(([name, expr]) => {
    const ref = collectRefs(expr).find((r) => r.kind === "step");
    if (ref && stepIds.has(ref.stepId)) pushEdge(dataEdges, ref.stepId, "outputs", name);
    return {
      name,
      stepId: ref?.stepId || "",
      output: ref?.name || "",
      source: describeSource(expr),
      expr: typeof expr === "string" ? expr : JSON.stringify(expr),
    };
  });

  // Each step output something else reads: later steps' values and the workflow's outputs
  const used = new Map();
  const markUsed = (stepId, name) => {
    if (stepId && name) used.set(stepId, (used.get(stepId) || new Set()).add(name));
  };
  for (const s of steps)
    for (const b of s.bindings) for (const r of b.fromOutputs) markUsed(r.stepId, r.name);
  for (const o of outputs) markUsed(o.stepId, o.output);
  for (const s of steps) {
    const names = used.get(s.stepId) || new Set();
    s.usedOutputs = s.outputExprs.filter((o) => names.has(o.name));
  }

  return {
    workflowId: workflow.workflowId || "",
    summary: workflow.summary || "",
    description: workflow.description || "",
    inputs: inputDetails.map((i) => i.name),
    inputDetails,
    // The document's API sources (sourceDescriptions), as written: name, type and URL
    sources: (Array.isArray(doc?.sourceDescriptions) ? doc.sourceDescriptions : [])
      .filter((s) => s && typeof s.name === "string")
      .map((s) => ({ name: s.name, type: s.type || "openapi", url: s.url || "" })),
    workflowActions: [...workflowSuccess, ...workflowFailure],
    operationsKnown: Boolean(options.sources?.size),
    outputs,
    steps,
    dataEdges,
    warnings: shadowWarnings(steps, workflows.indexOf(workflow)),
  };
}
