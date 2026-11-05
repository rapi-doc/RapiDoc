/**
 * Arazzo reusable components. Kept apart from parse.js so the MCP manifest builder can compile
 * workflows inside dist/rapidoc-min.js without pulling in the YAML parser.
 */

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
