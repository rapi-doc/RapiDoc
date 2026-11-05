/**
 * RapiDoc MCP workflow runtime: runs the compiled Arazzo workflows of a manifest (see
 * workflows.js) on top of runtime.js: runtime expressions, success criteria, success and failure
 * actions (end, goto, retry) and outputs. Kept apart from runtime.js so dist/rapidoc-min.js,
 * which exports operation tools only, carries no Arazzo code; dist/rapidoc-flow-min.js and
 * rapidoc/mcp include it.
 *
 * This file is copied verbatim into exported MCP server projects that have workflows as
 * `workflow-runtime.js`, so it imports only `./runtime.js`.
 */
import { createMcpRuntime } from "./runtime.js";

function serialize(value) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function errorResult(text) {
  return { isError: true, content: [{ type: "text", text }] };
}

// ---- Arazzo runtime expressions ----

/** RFC 6901 JSON pointer lookup; "" is the whole value. */
function pointer(value, path) {
  if (!path) return value;
  let node = value;
  for (const raw of path.split("/").slice(1)) {
    const key = raw.replace(/~1/g, "/").replace(/~0/g, "~");
    if (node === null || typeof node !== "object") return undefined;
    node = node[key];
  }
  return node;
}

function walk(value, keys) {
  let node = value;
  for (const key of keys) {
    if (node === null || typeof node !== "object") return undefined;
    node = node[key];
  }
  return node;
}

/**
 * One Arazzo runtime expression against the step context: `$inputs.x`, `$steps.id.outputs.x`,
 * `$statusCode`, `$response.body` (`#/pointer`), `$response.header.Name`, `$request.body`,
 * `$request.header.Name`, `$url`, `$method`.
 */
export function evaluateExpression(expr, ctx) {
  const m = String(expr).match(/^\$([A-Za-z]+)((?:\.[^.#\s]+)*)(?:#(.*))?$/);
  if (!m) return undefined;
  const [, root, dotted, ptr] = m;
  const keys = dotted ? dotted.slice(1).split(".") : [];
  switch (root) {
    case "inputs":
      return walk(ctx.inputs || {}, keys);
    case "steps":
      return walk(ctx.steps || {}, keys);
    case "statusCode":
      return ctx.response?.status;
    case "url":
      return ctx.request?.url;
    case "method":
      return ctx.request?.method;
    case "response":
    case "request": {
      const msg = ctx[root];
      if (!msg) return undefined;
      const [part, ...rest] = keys;
      if (part === "body") return walk(pointer(msg.body, ptr || ""), rest);
      if (part === "header" || part === "headers") {
        const name = rest.join(".").toLowerCase();
        const headers = msg.headers || {};
        const hit = Object.keys(headers).find((h) => h.toLowerCase() === name);
        return hit === undefined ? undefined : headers[hit];
      }
      if (part === "query" || part === "path") return walk(msg[part] || {}, rest);
      return undefined;
    }
    default:
      return undefined;
  }
}

const WHOLE_EXPRESSION = /^\$[A-Za-z][^\s{}]*$/;

/** A parameter or payload value with its expressions filled in; `{$expr}` inside text is interpolated. */
export function resolveValue(value, ctx) {
  if (typeof value === "string") {
    if (WHOLE_EXPRESSION.test(value)) return evaluateExpression(value, ctx);
    return value.replace(/\{(\$[^{}]+)\}/g, (_, expr) => {
      const v = evaluateExpression(expr, ctx);
      return v === undefined || v === null ? "" : serialize(v);
    });
  }
  if (Array.isArray(value)) return value.map((v) => resolveValue(v, ctx));
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = resolveValue(v, ctx);
    return out;
  }
  return value;
}

// ---- Simple conditions: `$statusCode == 200 && $response.body#/status != 'placed'` ----

function tokenize(condition) {
  const tokens = [];
  const re =
    /\s*(?:(&&|\|\||==|!=|<=|>=|<|>|!|\(|\))|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(-?\d+(?:\.\d+)?)|(\$[^\s()&|=!<>]+)|(true|false|null))/y;
  let last = 0;
  for (;;) {
    re.lastIndex = last;
    const m = re.exec(condition);
    if (!m) break;
    last = re.lastIndex;
    if (m[1]) tokens.push({ op: m[1] });
    else if (m[2]) tokens.push({ value: m[2].slice(1, -1).replace(/\\(.)/g, "$1") });
    else if (m[3]) tokens.push({ value: Number(m[3]) });
    else if (m[4]) tokens.push({ expr: m[4] });
    else if (m[5]) tokens.push({ value: m[5] === "true" ? true : m[5] === "false" ? false : null });
  }
  if (condition.slice(last).trim()) throw new Error(`Cannot parse condition "${condition}"`);
  return tokens;
}

/** `==` in a simple condition: null and a missing value are the same; numbers and strings compare as text. */
function looseEquals(a, b) {
  if (a === b) return true;
  const missing = (v) => v === null || v === undefined;
  if (missing(a) || missing(b)) return missing(a) && missing(b);
  if (typeof a === "object" || typeof b === "object")
    return JSON.stringify(a) === JSON.stringify(b);
  return String(a) === String(b);
}

/** Evaluates a simple Arazzo condition. Throws when it cannot be parsed. */
export function evaluateCondition(condition, ctx) {
  const tokens = tokenize(condition);
  let i = 0;
  const peek = () => tokens[i];
  const takeOp = (...ops) => (peek()?.op && ops.includes(peek().op) ? tokens[i++].op : null);
  const unary = () => {
    if (takeOp("!")) return !unary();
    if (takeOp("(")) {
      const v = or();
      if (!takeOp(")")) throw new Error(`Missing ) in "${condition}"`);
      return v;
    }
    const t = tokens[i++];
    if (!t || t.op) throw new Error(`Unexpected ${t ? t.op : "end"} in "${condition}"`);
    return t.expr !== undefined ? evaluateExpression(t.expr, ctx) : t.value;
  };
  const cmp = () => {
    const left = unary();
    const op = takeOp("==", "!=", "<=", ">=", "<", ">");
    if (!op) return left;
    const right = unary();
    if (op === "==") return looseEquals(left, right);
    if (op === "!=") return !looseEquals(left, right);
    const [a, b] = [Number(left), Number(right)];
    if (op === "<") return a < b;
    if (op === ">") return a > b;
    if (op === "<=") return a <= b;
    return a >= b;
  };
  const and = () => {
    let v = cmp();
    while (takeOp("&&")) v = cmp() && v;
    return v;
  };
  const or = () => {
    let v = and();
    while (takeOp("||")) v = and() || v;
    return v;
  };
  const result = or();
  if (i < tokens.length) throw new Error(`Unexpected ${tokens[i].op ?? "token"} in "${condition}"`);
  return Boolean(result);
}

/** Sets the value at a JSON pointer inside a payload (an Arazzo request body replacement). */
function replaceAt(payload, target, value) {
  const keys = String(target)
    .split("/")
    .slice(1)
    .map((k) => k.replace(/~1/g, "/").replace(/~0/g, "~"));
  if (!keys.length) return value;
  const root = Array.isArray(payload) ? [...payload] : { ...payload };
  let node = root;
  for (const [i, key] of keys.entries()) {
    if (i === keys.length - 1) {
      node[key] = value;
      break;
    }
    const next = node[key];
    node[key] = Array.isArray(next) ? [...next] : { ...next };
    node = node[key];
  }
  return root;
}

const MAX_STEP_RUNS = 1000;

function evaluateAll(criteria, ctx) {
  return (criteria || []).every((c) => {
    try {
      return evaluateCondition(c.condition, ctx);
    } catch {
      return false;
    }
  });
}

/**
 * Runs a workflow tool. Pass as createMcpRuntime's `runWorkflow` option, or use
 * createMcpWorkflowRuntime().
 *
 * @param {object} runtime from createMcpRuntime()
 * @param {object} tool a manifest tool with `workflow`
 * @param {object} args the workflow inputs
 * @param {object} [hooks]
 * @param {Function} [hooks.onStepStart] gets `{ workflowId, stepId, attempt }` before each request
 * @param {Function} [hooks.onStep] gets `{ workflowId, stepId, attempt, outcome, request,
 *   response, outputs, failedCriterion, action }` after each step run
 * @param {(ms: number) => Promise<void>} [hooks.sleep] waits between retries (default setTimeout)
 * @returns {Promise<object>} the MCP result: the workflow's outputs as `structuredContent`, or an
 *   error result naming the step, the failed criterion and the response
 */
export async function runWorkflow(runtime, tool, args, hooks = {}) {
  const workflow = runtime.manifest.workflows?.[tool.workflow];
  if (!workflow) return errorResult(`Workflow "${tool.workflow}" is not in the manifest`);
  const sleep = hooks.sleep || ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
  const inputs = args || {};
  const required = (workflow.inputs?.required || []).filter((name) => inputs[name] === undefined);
  if (required.length) return errorResult(`Missing input ${required.join(", ")}`);

  const steps = workflow.steps;
  const indexOf = (stepId) => steps.findIndex((s) => s.stepId === stepId);
  const stepsCtx = {};
  const attempts = new Map();
  let index = 0;
  let runs = 0;
  while (index >= 0 && index < steps.length) {
    if (++runs > MAX_STEP_RUNS) {
      return errorResult(`Workflow ${workflow.workflowId} ran more than ${MAX_STEP_RUNS} steps`);
    }
    const step = steps[index];
    const attempt = (attempts.get(step.stepId) || 0) + 1;
    attempts.set(step.stepId, attempt);
    const ctx = { inputs, steps: stepsCtx };
    const stepArgs = {};
    for (const p of step.parameters || []) stepArgs[p.name] = resolveValue(p.value, ctx);
    if (step.requestBody) {
      let payload = resolveValue(step.requestBody.payload, ctx);
      for (const r of step.requestBody.replacements || []) {
        payload = replaceAt(payload, r.target, resolveValue(r.value, ctx));
      }
      stepArgs.body = payload;
    }
    hooks.onStepStart?.({ workflowId: workflow.workflowId, stepId: step.stepId, attempt });
    const sent = await runtime.execute(step.operation, stepArgs);
    const stepCtx = {
      ...ctx,
      request: sent.request && {
        url: sent.request.url,
        method: sent.request.method,
        headers: sent.request.headers,
        body: stepArgs.body,
      },
      response: sent.response && {
        status: sent.response.status,
        headers: sent.headers,
        body: sent.data === undefined ? sent.text : sent.data,
      },
    };
    let failedCriterion = sent.error ? sent.error.content[0].text : "";
    // Without criteria of its own, a step succeeds on a 2xx response
    if (!failedCriterion && !(step.successCriteria || []).length && !sent.response.ok) {
      failedCriterion = `HTTP ${sent.response.status}`;
    }
    if (!failedCriterion) {
      for (const c of step.successCriteria || []) {
        let ok;
        try {
          ok = evaluateCondition(c.condition, stepCtx);
        } catch (err) {
          ok = false;
          failedCriterion = err.message;
        }
        if (!ok) {
          failedCriterion ||= c.condition;
          break;
        }
      }
    }
    const outcome = failedCriterion ? "failure" : "success";
    let outputs;
    if (outcome === "success") {
      outputs = {};
      for (const [name, expr] of Object.entries(step.outputs || {})) {
        outputs[name] = resolveValue(expr, stepCtx);
      }
      stepsCtx[step.stepId] = { outputs };
    }
    const candidates = outcome === "success" ? step.onSuccess : step.onFailure;
    const action = (candidates || []).find((a) => evaluateAll(a.criteria, stepCtx));
    hooks.onStep?.({
      workflowId: workflow.workflowId,
      stepId: step.stepId,
      attempt,
      outcome,
      request: stepCtx.request,
      response: stepCtx.response,
      outputs,
      failedCriterion: failedCriterion || undefined,
      action: action ? { type: action.type, name: action.name, stepId: action.stepId } : null,
    });

    const failure = (why) =>
      errorResult(
        `Workflow ${workflow.workflowId} failed at step ${step.stepId}: ${why}` +
          (stepCtx.response
            ? `\nHTTP ${stepCtx.response.status}\n${serialize(stepCtx.response.body)}`
            : ""),
      );
    if (outcome === "success") {
      if (!action) index++;
      else if (action.type === "end") break;
      else if (action.type === "goto") index = indexOf(action.stepId);
      else index++;
      continue;
    }
    if (!action || action.type === "end") return failure(failedCriterion);
    if (action.type === "goto") {
      index = indexOf(action.stepId);
      continue;
    }
    // retry
    const target = action.stepId ? indexOf(action.stepId) : index;
    const key = `${step.stepId}:${action.name}`;
    const tried = (attempts.get(key) || 0) + 1;
    attempts.set(key, tried);
    if (tried > (action.retryLimit ?? 1)) {
      return failure(`${failedCriterion} (after ${action.retryLimit ?? 1} retries)`);
    }
    if (action.retryAfter) await sleep(action.retryAfter * 1000);
    index = target;
  }

  const outputs = {};
  for (const [name, expr] of Object.entries(workflow.outputs || {})) {
    outputs[name] = resolveValue(expr, { inputs, steps: stepsCtx });
  }
  return {
    content: [{ type: "text", text: JSON.stringify(outputs, null, 2) }],
    structuredContent: outputs,
  };
}

/** createMcpRuntime() with workflow support plugged in; `options.sleep` waits between retries. */
export function createMcpWorkflowRuntime(manifest, options = {}) {
  return createMcpRuntime(manifest, {
    ...options,
    runWorkflow: (runtime, tool, args, hooks) =>
      runWorkflow(runtime, tool, args, { sleep: options.sleep, ...hooks }),
  });
}
