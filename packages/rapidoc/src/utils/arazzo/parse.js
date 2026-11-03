/**
 * Arazzo document parsing and structural validation.
 */
import { parse as parseYaml } from "yaml";
import { collectRefs } from "./refs.js";

const ACTION_TYPES = new Set(["end", "goto", "retry"]);
const SOURCE_TYPES = new Set(["openapi", "arazzo", "asyncapi"]);

/**
 * Parses Arazzo (or OpenAPI) text as JSON or YAML. An object is returned as is.
 *
 * @param {string|object} input
 * @returns {object}
 */
export function parseDocument(input) {
  if (input && typeof input === "object") return input;
  const text = String(input ?? "").trim();
  if (!text) throw new Error("The document is empty");
  const doc = text.startsWith("{") ? JSON.parse(text) : parseYaml(text);
  if (!doc || typeof doc !== "object") throw new Error("The document is not an object");
  return doc;
}

/**
 * Resolves `{ reference: "$components.<kind>.<name>" }` against the document's components.
 */
export function resolveComponentRef(doc, obj, kind) {
  if (!obj || typeof obj.reference !== "string") return obj;
  const m = obj.reference.match(/^\$components\.([A-Za-z]+)\.([A-Za-z0-9_.-]+)$/);
  if (!m || m[1] !== kind) return null;
  const target = doc?.components?.[kind]?.[m[2]];
  return target ? { ...target, ...(obj.value !== undefined ? { value: obj.value } : {}) } : null;
}

function problem(level, path, message) {
  return { level, path, message };
}

function checkActions(doc, list, kind, path, stepIds, workflowIds, problems) {
  if (list === undefined) return;
  if (!Array.isArray(list)) {
    problems.push(problem("error", path, "must be a list of actions"));
    return;
  }
  list.forEach((raw, i) => {
    const p = `${path}[${i}]`;
    const action = resolveComponentRef(doc, raw, kind);
    if (!action) {
      problems.push(problem("error", p, `unresolved reference ${raw?.reference}`));
      return;
    }
    if (!ACTION_TYPES.has(action.type)) {
      problems.push(problem("error", `${p}.type`, "must be end, goto or retry"));
      return;
    }
    if (action.type === "retry" && kind === "successActions") {
      problems.push(problem("error", `${p}.type`, "retry is only allowed on failure"));
    }
    if (action.stepId && action.workflowId) {
      problems.push(problem("error", p, "has both stepId and workflowId"));
    }
    if (action.type === "goto" && !action.stepId && !action.workflowId) {
      problems.push(problem("error", p, "goto needs a stepId or a workflowId"));
    }
    if (action.stepId && !stepIds.has(action.stepId)) {
      problems.push(problem("error", `${p}.stepId`, `no step "${action.stepId}"`));
    }
    if (
      action.workflowId &&
      !action.workflowId.startsWith("$") &&
      !workflowIds.has(action.workflowId)
    ) {
      problems.push(problem("error", `${p}.workflowId`, `no workflow "${action.workflowId}"`));
    }
  });
}

/**
 * Checks the structure the visualizer relies on. Returns problems; an empty list means valid.
 * Expression syntax and JSON Schema of `inputs` are not checked.
 *
 * @param {object} doc
 * @returns {{ level: 'error'|'warning', path: string, message: string }[]}
 */
export function validateArazzo(doc) {
  const problems = [];
  if (!doc || typeof doc !== "object") return [problem("error", "", "not an object")];

  if (typeof doc.arazzo !== "string" || !/^1\.\d+(\.\d+)?/.test(doc.arazzo)) {
    problems.push(problem("error", "arazzo", "must be an Arazzo 1.x version string"));
  }
  if (!doc.info?.title) problems.push(problem("error", "info.title", "is required"));
  if (!doc.info?.version) problems.push(problem("error", "info.version", "is required"));

  const sources = Array.isArray(doc.sourceDescriptions) ? doc.sourceDescriptions : [];
  if (!sources.length) {
    problems.push(problem("error", "sourceDescriptions", "needs at least one source"));
  }
  const sourceNames = new Set();
  sources.forEach((s, i) => {
    const p = `sourceDescriptions[${i}]`;
    if (!s?.name) problems.push(problem("error", `${p}.name`, "is required"));
    else if (sourceNames.has(s.name))
      problems.push(problem("error", `${p}.name`, "is a duplicate"));
    else sourceNames.add(s.name);
    if (!s?.url) problems.push(problem("error", `${p}.url`, "is required"));
    if (s?.type && !SOURCE_TYPES.has(s.type)) {
      problems.push(problem("warning", `${p}.type`, `unknown type "${s.type}"`));
    }
  });

  const workflows = Array.isArray(doc.workflows) ? doc.workflows : [];
  if (!workflows.length)
    problems.push(problem("error", "workflows", "needs at least one workflow"));
  const workflowIds = new Set();
  workflows.forEach((w, i) => {
    if (!w?.workflowId)
      problems.push(problem("error", `workflows[${i}].workflowId`, "is required"));
    else if (workflowIds.has(w.workflowId)) {
      problems.push(problem("error", `workflows[${i}].workflowId`, "is a duplicate"));
    } else workflowIds.add(w.workflowId);
  });

  workflows.forEach((w, wi) => {
    const wp = `workflows[${wi}]`;
    const steps = Array.isArray(w?.steps) ? w.steps : [];
    if (!steps.length) problems.push(problem("error", `${wp}.steps`, "needs at least one step"));
    const stepIds = new Set();
    steps.forEach((s, si) => {
      const sp = `${wp}.steps[${si}]`;
      if (!s?.stepId) problems.push(problem("error", `${sp}.stepId`, "is required"));
      else if (stepIds.has(s.stepId))
        problems.push(problem("error", `${sp}.stepId`, "is a duplicate"));
      else stepIds.add(s.stepId);
      const targets = ["operationId", "operationPath", "workflowId"].filter((k) => s?.[k]);
      if (targets.length !== 1) {
        problems.push(
          problem("error", sp, "needs exactly one of operationId, operationPath or workflowId"),
        );
      }
      if (s?.workflowId && !s.workflowId.startsWith("$") && !workflowIds.has(s.workflowId)) {
        problems.push(problem("error", `${sp}.workflowId`, `no workflow "${s.workflowId}"`));
      }
    });
    (w?.dependsOn || []).forEach((id, di) => {
      if (!String(id).startsWith("$") && !workflowIds.has(id)) {
        problems.push(problem("error", `${wp}.dependsOn[${di}]`, `no workflow "${id}"`));
      }
    });

    checkActions(
      doc,
      w?.successActions,
      "successActions",
      `${wp}.successActions`,
      stepIds,
      workflowIds,
      problems,
    );
    checkActions(
      doc,
      w?.failureActions,
      "failureActions",
      `${wp}.failureActions`,
      stepIds,
      workflowIds,
      problems,
    );
    steps.forEach((s, si) => {
      const sp = `${wp}.steps[${si}]`;
      checkActions(
        doc,
        s?.onSuccess,
        "successActions",
        `${sp}.onSuccess`,
        stepIds,
        workflowIds,
        problems,
      );
      checkActions(
        doc,
        s?.onFailure,
        "failureActions",
        `${sp}.onFailure`,
        stepIds,
        workflowIds,
        problems,
      );
      for (const ref of collectRefs([s?.parameters, s?.requestBody])) {
        if (ref.kind === "step" && !stepIds.has(ref.stepId)) {
          problems.push(problem("error", sp, `refers to unknown step "${ref.stepId}"`));
        }
      }
    });
    for (const ref of collectRefs(w?.outputs)) {
      if (ref.kind === "step" && !stepIds.has(ref.stepId)) {
        problems.push(problem("error", `${wp}.outputs`, `refers to unknown step "${ref.stepId}"`));
      }
    }
  });

  return problems;
}
