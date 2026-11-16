/**
 * Compiles the workflows of an Arazzo document into the manifest: one tool per workflow, and a
 * `workflows` entry whose steps name resolved operations (source, method, path), so the runtime
 * needs no Arazzo or OpenAPI document; an `x-operation` step's operation has its `url` (as written,
 * expressions filled in by the runtime) and no source or path instead. Each step's `security` holds its `x-security` entries (the
 * workflow's, then its own) with the scheme resolved. A workflow that uses something the runtime does not run
 * (another workflow, non-simple criteria, `$workflows` or `$components` expressions) is reported
 * through `onProblem` and left out.
 */
import { destructiveHintFor, sanitizeDescription, toSnakeCase } from "./common.js";
import { toJsonSchema } from "./schema.js";
import { resolveComponentRef } from "../arazzo/components.js";
import { resolveOperation } from "../arazzo/operations.js";
import { collectRefs } from "../arazzo/refs.js";
import { mergeActions, readActions, readCriteria } from "../arazzo/actions.js";
import { SECURITY_VALUES, securityKind, securityLabel, stepSecurity } from "../arazzo/security.js";
import {
  EXTERNAL_METHODS,
  isAbsoluteHttpUrl,
  isDynamicUrl,
  readExternalOperation,
} from "../arazzo/external.js";

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

/**
 * A step's `x-security` entries (the workflow's, then its own) as the runtime takes them:
 * `{ scheme: { type, scheme?, in?, name? }, values }`, a `schemeName` resolved against the
 * security schemes of the step's source. The values keep their expressions; the runtime fills
 * them in for each request.
 */
function compileSecurity(workflow, step, op, schemes, where, problems) {
  const out = [];
  for (const e of stepSecurity(workflow, step)) {
    const p = `${e.inherited ? "x-security" : `${where}.x-security`}[${e.index}]`;
    if (Boolean(e.schemeName) === Boolean(e.scheme)) {
      problems.push(`${p}: needs exactly one of schemeName or scheme`);
      continue;
    }
    if (e.schemeName && !op.source) {
      problems.push(`${p}: schemeName can't be used with x-operation: define the scheme inline`);
      continue;
    }
    const scheme = e.scheme || schemes?.[op.source]?.[e.schemeName];
    if (!scheme) {
      problems.push(`${p}: no security scheme "${e.schemeName}" in ${op.source}`);
      continue;
    }
    const kind = securityKind(scheme);
    if (!kind) {
      problems.push(`${p}: ${securityLabel(scheme)} security is not supported`);
      continue;
    }
    if (kind === "apiKey" && (!scheme.name || !["header", "query", "cookie"].includes(scheme.in))) {
      problems.push(`${p}: an apiKey scheme needs a name and in: header, query or cookie`);
      continue;
    }
    const expected = kind === "bearer" ? ["token", "accessToken"] : SECURITY_VALUES[kind];
    const values = {};
    for (const key of expected) if (e.values[key] !== undefined) values[key] = e.values[key];
    if (!Object.keys(values).length) {
      problems.push(`${p}: values needs ${SECURITY_VALUES[kind].join(" and ")}`);
      continue;
    }
    unsupportedRefs(values, p, problems);
    const compiled = { type: scheme.type };
    for (const key of ["scheme", "in", "name"]) if (scheme[key]) compiled[key] = scheme[key];
    out.push({ scheme: compiled, values });
  }
  return out;
}

function compileStep(doc, step, workflow, sources, stepIds, problems, schemes) {
  const where = `steps.${step.stepId}`;
  if (step.workflowId) {
    problems.push(`${where}: calls workflow "${step.workflowId}", which is not supported`);
    return null;
  }
  const external = readExternalOperation(step);
  if (external) {
    if (!EXTERNAL_METHODS.includes(external.method)) {
      problems.push(`${where}.x-operation.method: "${external.method}" is not an HTTP method`);
      return null;
    }
    if (!isDynamicUrl(external.url) && !isAbsoluteHttpUrl(external.url)) {
      problems.push(`${where}.x-operation.url: must be an absolute http or https URL`);
      return null;
    }
    unsupportedRefs(external.url, `${where}.x-operation.url`, problems);
  }
  // An x-operation step has no source: its operation is the URL and method it names
  const op = external
    ? { source: "", method: external.method, url: external.url }
    : resolveOperation(step, sources);
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
    // x-allowReserved (Redocly Respect) on the step's parameter, else the operation's allowReserved
    const reserved =
      typeof p["x-allowReserved"] === "boolean"
        ? p["x-allowReserved"]
        : Boolean(op.allowReserved?.includes(p.name));
    if (op.url && p.in === "path" && !op.url.includes(`{${p.name}}`)) {
      problems.push(`${where}.parameters[${i}]: the x-operation URL has no {${p.name}}`);
      continue;
    }
    params.push(
      p.in === "query" && reserved
        ? { name: p.name, in: p.in, allowReserved: true }
        : { name: p.name, in: p.in },
    );
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
      ...(op.url ? { url: op.url } : { path: op.path }),
      params,
      security: Array.isArray(op.security)
        ? op.security.filter((s) => s && typeof s === "object")
        : [],
    },
    parameters,
    requestBody,
    security: compileSecurity(workflow.raw, step, op, schemes, where, problems),
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
 * @param {Record<string, Record<string, object>>} [options.schemes] the security schemes of each
 *   source by scheme id (the manifest's `sources.<name>.securitySchemes`), for `x-security`
 *   entries that name one
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
      raw: w,
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
      .map((s) => compileStep(arazzo, s, shared, sources, stepIds, problems, options.schemes))
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
        ...destructiveHintFor(methods),
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
