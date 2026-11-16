/**
 * The `x-security` extension (as Redocly Respect defines it): credentials a workflow or a step
 * sends, each entry naming a security scheme of the step's OpenAPI source (`schemeName`) or
 * defining one inline (`scheme`), with the `values` to send (`$inputs.token`, say). Read here
 * once for the diagram, the validator and the MCP compiler.
 */

/** The `values` each kind of scheme takes; any one of them is enough for a bearer token. */
export const SECURITY_VALUES = {
  apiKey: ["apiKey"],
  basic: ["username", "password"],
  bearer: ["token"],
};

/**
 * What a scheme sends, as `x-security` values: `apiKey`, `basic`, `bearer` (http bearer, oauth2
 * and openIdConnect all send a bearer token), or null for one that cannot be sent (http digest,
 * mutualTLS, an unknown type).
 */
export function securityKind(scheme) {
  if (!scheme || typeof scheme !== "object") return null;
  if (scheme.type === "apiKey") return "apiKey";
  if (scheme.type === "oauth2" || scheme.type === "openIdConnect") return "bearer";
  if (scheme.type === "http") {
    const s = String(scheme.scheme || "").toLowerCase();
    if (s === "basic" || s === "bearer") return s;
  }
  return null;
}

/** A short label for a scheme: `bearer`, `basic`, `apiKey header X-Key`, `digest`. */
export function securityLabel(scheme) {
  if (!scheme || typeof scheme !== "object") return "";
  if (scheme.type === "apiKey") return ["apiKey", scheme.in, scheme.name].filter(Boolean).join(" ");
  if (scheme.type === "http") return String(scheme.scheme || "http").toLowerCase();
  return String(scheme.type || "");
}

/**
 * One `x-security` list as written, entries that are not objects left out. Each entry is
 * `{ index, schemeName?, scheme?, values }`, `index` its place in the list for problem paths.
 */
export function readSecurity(list) {
  return (Array.isArray(list) ? list : [])
    .map((e, index) => ({ e, index }))
    .filter(({ e }) => e && typeof e === "object")
    .map(({ e, index }) => {
      const entry = { index, values: e.values && typeof e.values === "object" ? e.values : {} };
      if (typeof e.schemeName === "string") entry.schemeName = e.schemeName;
      if (e.scheme && typeof e.scheme === "object") entry.scheme = e.scheme;
      return entry;
    });
}

/**
 * The `x-security` entries a step sends: the workflow's (marked `inherited`), then the step's
 * own. A runner applies them in this order, so where two set the same header, query parameter or
 * cookie, the step's wins, as Respect has it.
 */
export function stepSecurity(workflow, step) {
  return [
    ...readSecurity(workflow?.["x-security"]).map((e) => ({ ...e, inherited: true })),
    ...readSecurity(step?.["x-security"]).map((e) => ({ ...e, inherited: false })),
  ];
}

/**
 * Structural problems of one `x-security` list, as `{ path, message }`: not a list, an entry with
 * both or neither of `schemeName` and `scheme`, without `values`, or an inline scheme that cannot
 * be sent.
 */
export function securityProblems(list, path) {
  if (list === undefined) return [];
  if (!Array.isArray(list)) return [{ path, message: "must be a list" }];
  const problems = [];
  list.forEach((e, i) => {
    const p = `${path}[${i}]`;
    if (!e || typeof e !== "object") {
      problems.push({ path: p, message: "must be an object" });
      return;
    }
    const named = typeof e.schemeName === "string" && e.schemeName !== "";
    const inline = e.scheme && typeof e.scheme === "object";
    if (named === Boolean(inline)) {
      problems.push({ path: p, message: "needs exactly one of schemeName or scheme" });
    }
    if (!e.values || typeof e.values !== "object") {
      problems.push({ path: `${p}.values`, message: "is required" });
    }
    if (inline && !securityKind(e.scheme)) {
      problems.push({
        path: `${p}.scheme`,
        message: `${securityLabel(e.scheme) || "this scheme"} is not supported: use apiKey, http basic or http bearer`,
      });
    } else if (
      inline &&
      e.scheme.type === "apiKey" &&
      (!e.scheme.name || !["header", "query", "cookie"].includes(e.scheme.in))
    ) {
      problems.push({
        path: `${p}.scheme`,
        message: "an apiKey scheme needs a name and in: header, query or cookie",
      });
    }
  });
  return problems;
}
