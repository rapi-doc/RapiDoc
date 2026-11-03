/**
 * Finds Arazzo runtime expressions ($inputs, $steps, $workflows) inside any value.
 */

const EXPRESSION =
  /\$(inputs|steps|workflows)\.([A-Za-z0-9_-]+)(?:\.([A-Za-z0-9_-]+)(?:\.([A-Za-z0-9_-]+))?)?/g;

function scan(value, out, seen) {
  if (typeof value === "string") {
    for (const m of value.matchAll(EXPRESSION)) {
      const [expr, root, a, b, c] = m;
      let ref;
      if (root === "inputs") ref = { kind: "input", name: a, expr };
      else if (root === "steps" && b === "outputs" && c)
        ref = { kind: "step", stepId: a, name: c, expr };
      else if (root === "steps") ref = { kind: "step", stepId: a, name: "", expr };
      else if (b === "outputs" && c) ref = { kind: "workflow", workflowId: a, name: c, expr };
      else ref = { kind: "workflow", workflowId: a, name: "", expr };
      if (!seen.has(expr)) {
        seen.add(expr);
        out.push(ref);
      }
    }
  } else if (Array.isArray(value)) {
    for (const v of value) scan(v, out, seen);
  } else if (value && typeof value === "object") {
    for (const v of Object.values(value)) scan(v, out, seen);
  }
}

/**
 * @param {*} value Any JSON value: parameters, a request body, outputs
 * @returns {{ kind: 'input'|'step'|'workflow', name: string, stepId?: string, workflowId?: string, expr: string }[]}
 *   distinct references in the order they first appear
 */
export function collectRefs(value) {
  const out = [];
  scan(value, out, new Set());
  return out;
}
