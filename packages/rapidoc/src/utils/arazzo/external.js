/**
 * The `x-operation` extension (as Redocly Respect defines it): a step that calls an HTTP endpoint
 * no source description describes, `{ url, method }`. The URL is absolute (http or https) or a
 * runtime expression (`$steps.upload.outputs.fileUrl`), which may also be interpolated into text
 * (`https://cdn.example.com/{$inputs.path}`). Read here once for the validator, the diagram and the
 * MCP compiler.
 */

export const EXTERNAL_METHODS = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "head",
  "options",
  "connect",
  "trace",
];

/** Whether a URL is computed from runtime expressions rather than written out. */
export const isDynamicUrl = (url) => String(url).includes("$");

/** Whether text is an absolute http or https URL. */
export function isAbsoluteHttpUrl(text) {
  try {
    return ["http:", "https:"].includes(new URL(String(text)).protocol);
  } catch {
    return false;
  }
}

/**
 * A step's `x-operation` as `{ method, url }`, method lower-case, or null when the step has none or
 * it is not an object.
 */
export function readExternalOperation(step) {
  const x = step?.["x-operation"];
  if (!x || typeof x !== "object") return null;
  return {
    method: typeof x.method === "string" ? x.method.toLowerCase() : "",
    url: typeof x.url === "string" ? x.url : "",
  };
}

/** Structural problems of a step's `x-operation`, as `{ path, message }`. */
export function externalProblems(step, path) {
  const x = step?.["x-operation"];
  if (x === undefined) return [];
  if (!x || typeof x !== "object") return [{ path, message: "must be an object" }];
  const problems = [];
  if (typeof x.url !== "string" || !x.url) {
    problems.push({ path: `${path}.url`, message: "is required" });
  } else if (!isDynamicUrl(x.url) && !isAbsoluteHttpUrl(x.url)) {
    problems.push({
      path: `${path}.url`,
      message: "must be an absolute http or https URL, or a runtime expression",
    });
  }
  if (typeof x.method !== "string" || !x.method) {
    problems.push({ path: `${path}.method`, message: "is required" });
  } else if (!EXTERNAL_METHODS.includes(x.method.toLowerCase())) {
    problems.push({
      path: `${path}.method`,
      message: `must be one of ${EXTERNAL_METHODS.map((m) => m.toUpperCase()).join(", ")}`,
    });
  }
  const security = Array.isArray(step["x-security"]) ? step["x-security"] : [];
  security.forEach((e, i) => {
    if (e && typeof e === "object" && e.schemeName) {
      problems.push({
        path: `${path.replace(/x-operation$/, "x-security")}[${i}].schemeName`,
        message: "can't be used with x-operation, which has no source: define the scheme inline",
      });
    }
  });
  return problems;
}
