/**
 * Turns one Arazzo workflow into the graph the diagram draws: steps in order, the values passed
 * between them, and each step's success and failure actions.
 */
import { collectRefs } from "./refs.js";
import { resolveComponentRef } from "./parse.js";
import { resolveOperation } from "./operations.js";

function normalizeCriteria(list) {
  return (Array.isArray(list) ? list : [])
    .filter((c) => c && typeof c.condition === "string")
    .map((c) => ({
      condition: c.condition,
      context: c.context || "",
      type: typeof c.type === "string" ? c.type : c.type?.type || "simple",
    }));
}

function normalizeActions(doc, list, kind, outcome, inherited) {
  return (Array.isArray(list) ? list : [])
    .map((raw) => resolveComponentRef(doc, raw, kind))
    .filter((a) => a && ["end", "goto", "retry"].includes(a.type))
    .map((a) => {
      const criteria = normalizeCriteria(a.criteria);
      return {
        outcome,
        type: a.type,
        name: a.name || "",
        stepId: a.stepId || "",
        workflowId: a.workflowId || "",
        retryAfter: a.retryAfter,
        retryLimit: a.retryLimit,
        criteria,
        conditional: criteria.length > 0,
        inherited,
      };
    });
}

/**
 * A step's own actions, then the workflow's, minus those the step overrides by name. A runner
 * takes the first action whose criteria match, so every action after one without criteria is
 * marked `shadowed`: it can never run.
 */
function mergeActions(own, inherited) {
  const names = new Set(own.map((a) => a.name).filter(Boolean));
  const merged = [...own, ...inherited.filter((a) => !a.name || !names.has(a.name))];
  const first = merged.findIndex((a) => !a.conditional);
  return merged.map((a, i) => ({ ...a, shadowed: first >= 0 && i > first }));
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
  return rows.map((r) => ({
    ...r,
    source: describeSource(r.value),
    fromSteps: [
      ...new Set(
        collectRefs(r.value)
          .filter((x) => x.kind === "step")
          .map((x) => x.stepId),
      ),
    ],
  }));
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
 * body fields named `body.<path>`); `source` is `{ kind: 'input'|'step'|'expression'|'value', text }`.
 *
 * @returns {object|null} `{ workflowId, summary, description, inputs, inputDetails, workflowActions,
 *   operationsKnown, outputs, steps, dataEdges }`,
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
        ...mergeActions(onSuccess, workflowSuccess),
        ...mergeActions(onFailure, workflowFailure),
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

  return {
    workflowId: workflow.workflowId || "",
    summary: workflow.summary || "",
    description: workflow.description || "",
    inputs: inputDetails.map((i) => i.name),
    inputDetails,
    workflowActions: [...workflowSuccess, ...workflowFailure],
    operationsKnown: Boolean(options.sources?.size),
    outputs,
    steps,
    dataEdges,
  };
}
