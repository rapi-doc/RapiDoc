/**
 * Success criteria and success/failure actions as written in an Arazzo document, read once for
 * the diagram (graph.js) and the MCP workflow compiler (utils/mcp/workflows.js), which each add
 * their own fields and checks. No YAML parser and no DOM, like components.js.
 */
import { resolveComponentRef } from "./components.js";

/** The action types Arazzo 1.x defines. */
export const ACTION_TYPES = new Set(["end", "goto", "retry"]);

/**
 * A criteria list's entries that have a condition, each `{ index, condition, context, type }`.
 * `type` is "simple" unless given (a string, or `{ type }` for jsonpath / xpath / regex), and
 * `index` is the entry's position in the list as written, for problem paths.
 */
export function readCriteria(list) {
  return (Array.isArray(list) ? list : []).flatMap((c, index) =>
    c && typeof c.condition === "string"
      ? [
          {
            index,
            condition: c.condition,
            context: c.context || "",
            type: typeof c.type === "string" ? c.type : c.type?.type || "simple",
          },
        ]
      : [],
  );
}

/**
 * An action list's actions, `$components` references resolved, those of a type Arazzo does not
 * define (or an unresolved reference) left out. Each is `{ index, type, name, stepId, workflowId,
 * retryAfter, retryLimit, criteria }`: `index` is its position in the list as written, the retry
 * fields as written (undefined when absent), `criteria` from readCriteria.
 *
 * @param {'successActions'|'failureActions'} kind the components section references point into
 */
export function readActions(doc, list, kind) {
  return (Array.isArray(list) ? list : []).flatMap((raw, index) => {
    const a = resolveComponentRef(doc, raw, kind);
    if (!a || !ACTION_TYPES.has(a.type)) return [];
    return [
      {
        index,
        type: a.type,
        name: a.name || "",
        stepId: a.stepId || "",
        workflowId: a.workflowId || "",
        retryAfter: a.retryAfter,
        retryLimit: a.retryLimit,
        criteria: readCriteria(a.criteria),
      },
    ];
  });
}

/**
 * A step's own actions, then the workflow's, minus those the step overrides by `name`: the list a
 * runner checks in order.
 */
export function mergeActions(own, inherited) {
  const names = new Set(own.map((a) => a.name).filter(Boolean));
  return [...own, ...inherited.filter((a) => !a.name || !names.has(a.name))];
}
