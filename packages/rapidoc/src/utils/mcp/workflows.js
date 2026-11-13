/**
 * Compiles the workflows of an Arazzo document into the manifest: one tool per workflow, and a
 * `workflows` entry whose steps name resolved operations (source, method, path), so the runtime
 * needs no Arazzo or OpenAPI document. A workflow that uses something the runtime does not run
 * (another workflow, non-simple criteria, `$workflows` or `$components` expressions) is reported
 * through `onProblem` and left out.
 */
import { sanitizeDescription, toSnakeCase } from "./common.js";
import { toJsonSchema } from "./schema.js";
import { resolveComponentRef } from "../arazzo/components.js";
import { resolveOperation } from "../arazzo/operations.js";
import { collectRefs } from "../arazzo/refs.js";
import { mergeActions, readActions, readCriteria } from "../arazzo/actions.js";

const PARAM_LOCATIONS = new Set(["path", "query", "header", "cookie"]);
/** Criteria from readCriteria the runtime evaluates: simple conditions only, the rest reported. */
function criteria(read, where, problems) {
  const out = [];
  for (const c of read) {
    if (c.type !== "simple") {
      problems.push(
        `${where}[${c.index}]: criterion type ${c.type} is not supported, only simple conditions`,
      );
      continue;
    }
    out.push({ condition: c.condition });
  }
  return out;
}

/**
 * Actions from readActions as the runtime takes them: no goto or retry into another workflow, no
 * unknown step, retry limits defaulted (once, no wait).
 */
function actions(doc, list, kind, where, stepIds, problems) {
  const out = [];
  for (const a of readActions(doc, list, kind)) {
    const p = `${where}[${a.index}]`;
    if (a.workflowId) {
      problems.push(`${p}: ${a.type} to another workflow is not supported`);
      continue;
    }
    if (a.stepId && !stepIds.has(a.stepId)) {
      problems.push(`${p}: no step "${a.stepId}"`);
      continue;
    }
    const action = { name: a.name, type: a.type, criteria: criteria(a.criteria, p, problems) };
    if (a.stepId) action.stepId = a.stepId;
    if (a.type === "retry") {
      action.retryLimit = Number.isFinite(a.retryLimit) ? a.retryLimit : 1;
      action.retryAfter = Number.isFinite(a.retryAfter) ? a.retryAfter : 0;
    }
    out.push(action);
  }
  return out;
}

function unsupportedRefs(value, where, problems) {
  for (const ref of collectRefs(value)) {
    if (ref.kind === "workflow") {
      problems.push(`${where}: ${ref.expr} refers to another workflow, which is not supported`);
    }
  }
}

function compileStep(doc, step, workflow, sources, stepIds, problems) {
  const where = `steps.${step.stepId}`;
  if (step.workflowId) {
    problems.push(`${where}: calls workflow "${step.workflowId}", which is not supported`);
    return null;
  }
  const op = resolveOperation(step, sources);
  if (!op) {
    const ref = step.operationId || step.operationPath || "(no operation)";
    problems.push(
      `${where}: operation ${ref} was not found in ${[...sources.keys()].join(", ") || "any source"}`,
    );
    return null;
  }
  const params = [];
  const parameters = [];
  for (const [i, raw] of (Array.isArray(step.parameters) ? step.parameters : []).entries()) {
    const p = resolveComponentRef(doc, raw, "parameters");
    if (!p?.name) continue;
    if (!PARAM_LOCATIONS.has(p.in)) {
      problems.push(`${where}.parameters[${i}]: "in" must be path, query, header or cookie`);
      continue;
    }
    params.push({ name: p.name, in: p.in });
    parameters.push({ name: p.name, in: p.in, value: p.value });
    unsupportedRefs(p.value, `${where}.parameters[${i}]`, problems);
  }
  let requestBody = null;
  if (step.requestBody && typeof step.requestBody === "object") {
    const contentType = step.requestBody.contentType || "application/json";
    requestBody = { contentType, payload: step.requestBody.payload ?? null };
    if (Array.isArray(step.requestBody.replacements)) {
      requestBody.replacements = step.requestBody.replacements
        .filter((r) => r && typeof r.target === "string")
        .map((r) => ({ target: r.target, value: r.value }));
    }
    params.push({ name: "body", in: "body", contentType });
    unsupportedRefs(step.requestBody, `${where}.requestBody`, problems);
  }
  const onSuccess = actions(
    doc,
    step.onSuccess,
    "successActions",
    `${where}.onSuccess`,
    stepIds,
    problems,
  );
  const onFailure = actions(
    doc,
    step.onFailure,
    "failureActions",
    `${where}.onFailure`,
    stepIds,
    problems,
  );
  const outputs = {};
  for (const [name, expr] of Object.entries(step.outputs || {})) {
    outputs[name] = expr;
    unsupportedRefs(expr, `${where}.outputs.${name}`, problems);
  }
  return {
    stepId: step.stepId,
    description: step.description || "",
    operation: {
      source: op.source,
      method: op.method.toUpperCase(),
      path: op.path,
      params,
      security: Array.isArray(op.security)
        ? op.security.filter((s) => s && typeof s === "object")
        : [],
    },
    parameters,
    requestBody,
    successCriteria: criteria(
      readCriteria(step.successCriteria),
      `${where}.successCriteria`,
      problems,
    ),
    onSuccess: mergeActions(onSuccess, workflow.successActions),
    onFailure: mergeActions(onFailure, workflow.failureActions),
    outputs,
  };
}

/**
 * @param {object} arazzo A parsed Arazzo document
 * @param {object} options
 * @param {Map<string, {byId: Map, byPath: Map}>} options.sources operation indexes by Arazzo
 *   source description name (`indexOperations` / `indexResolvedSpec`); a step resolves against
 *   them and its `operation.source` is the index's name
 * @param {(problem: { level: string, path: string, message: string }) => void} [options.onProblem]
 *   called once per workflow that is left out, with every reason joined
 * @returns {{ tools: object[], workflows: Record<string, object> }} a tool is
 *   `{ name, description, inputSchema, annotations, workflow }`; a workflow is
 *   `{ workflowId, summary, description, inputs, steps, outputs }`
 */
export function compileWorkflows(arazzo, options = {}) {
  const sources = options.sources || new Map();
  const tools = [];
  const workflows = {};
  const list = Array.isArray(arazzo?.workflows) ? arazzo.workflows : [];
  for (const [wi, w] of list.entries()) {
    if (!w?.workflowId) continue;
    const problems = [];
    const stepsRaw = Array.isArray(w.steps) ? w.steps : [];
    const stepIds = new Set(stepsRaw.map((s) => s?.stepId).filter(Boolean));
    const shared = {
      successActions: actions(
        arazzo,
        w.successActions,
        "successActions",
        "successActions",
        stepIds,
        problems,
      ),
      failureActions: actions(
        arazzo,
        w.failureActions,
        "failureActions",
        "failureActions",
        stepIds,
        problems,
      ),
    };
    const steps = stepsRaw
      .filter((s) => s?.stepId)
      .map((s) => compileStep(arazzo, s, shared, sources, stepIds, problems))
      .filter(Boolean);
    if (!steps.length) problems.push("has no runnable step");
    const outputs = {};
    for (const [name, expr] of Object.entries(w.outputs || {})) {
      outputs[name] = expr;
      unsupportedRefs(expr, `outputs.${name}`, problems);
    }
    if (problems.length) {
      options.onProblem?.({
        level: "error",
        path: `workflows[${wi}]`,
        message: `workflow ${w.workflowId} is left out of the MCP export: ${problems.join("; ")}`,
      });
      continue;
    }
    const inputs = w.inputs ? toJsonSchema(w.inputs, arazzo) : { type: "object", properties: {} };
    if (!inputs.type) inputs.type = "object";
    if (!inputs.properties) inputs.properties = {};
    const methods = steps.map((s) => s.operation.method);
    tools.push({
      name: toSnakeCase(w.workflowId),
      description: sanitizeDescription(w.summary || w.description || w.workflowId),
      inputSchema: inputs,
      annotations: {
        readOnlyHint: methods.every((m) => m === "GET"),
        destructiveHint: methods.some((m) => ["PUT", "PATCH", "DELETE"].includes(m)),
        idempotentHint: false,
      },
      workflow: w.workflowId,
    });
    workflows[w.workflowId] = {
      workflowId: w.workflowId,
      summary: w.summary || "",
      description: w.description || "",
      inputs,
      steps,
      outputs,
    };
  }
  return { tools, workflows };
}
