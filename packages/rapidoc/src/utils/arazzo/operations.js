/**
 * Looks up the OpenAPI operation an Arazzo step calls, without dereferencing the OpenAPI document.
 */

const METHODS = ["get", "put", "post", "delete", "options", "head", "patch", "trace", "query"];

/**
 * Indexes an OpenAPI document's operations by operationId and by "<method> <path>".
 *
 * @param {object} openapi Raw OpenAPI 2.0, 3.x object
 * @returns {{ byId: Map<string, object>, byPath: Map<string, object> }} values are
 *   `{ operationId, method, path, summary }`, method lower-case
 */
export function indexOperations(openapi) {
  const byId = new Map();
  const byPath = new Map();
  for (const [path, item] of Object.entries(openapi?.paths || {})) {
    if (!item || typeof item !== "object") continue;
    for (const method of METHODS) {
      const op = item[method];
      if (!op || typeof op !== "object") continue;
      const entry = { operationId: op.operationId || "", method, path, summary: op.summary || "" };
      if (op.operationId) byId.set(op.operationId, entry);
      byPath.set(`${method} ${path}`, entry);
    }
  }
  return { byId, byPath };
}

function unescapePointer(segment) {
  return decodeURIComponent(segment).replace(/~1/g, "/").replace(/~0/g, "~");
}

/**
 * Resolves a step's operationId or operationPath.
 *
 * @param {object} step Arazzo step
 * @param {Map<string, {byId: Map, byPath: Map}>} sources indexes by source description name
 * @returns {{ source: string, operationId: string, method: string, path: string, summary: string } | null}
 */
export function resolveOperation(step, sources) {
  if (!sources?.size) return null;
  if (step.operationId) {
    let source = "";
    let id = step.operationId;
    const qualified = id.match(/^\$sourceDescriptions\.([A-Za-z0-9_-]+)\.(.+)$/);
    if (qualified) [, source, id] = qualified;
    for (const [name, index] of sources) {
      if (source && name !== source) continue;
      const op = index.byId.get(id);
      if (op) return { source: name, ...op };
    }
    return null;
  }
  if (step.operationPath) {
    const m = step.operationPath.match(/^\{\$sourceDescriptions\.([A-Za-z0-9_-]+)\.url\}#(.*)$/);
    if (!m) return null;
    const [, source, pointer] = m;
    const parts = pointer.split("/").slice(1).map(unescapePointer);
    if (parts.length !== 3 || parts[0] !== "paths") return null;
    const op = sources.get(source)?.byPath.get(`${parts[2].toLowerCase()} ${parts[1]}`);
    return op ? { source, ...op } : null;
  }
  return null;
}
