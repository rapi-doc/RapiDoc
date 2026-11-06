import {
  bundleSpec,
  decodePointer,
  isUrl,
  locate,
  position,
  SpecSyntaxError,
  valueAt,
} from "./bundle.js";

/**
 * Checks one spec (a file path or URL) against the OpenAPI Specification with @scalar/openapi-validator,
 * which is strict: every required field (info.version, a response's description, ...) must be there.
 * (@scalar/openapi-parser's own validate fills in defaults first, so it lets those through.)
 *
 * Returns { location, version, problems, skipped }: problems are
 * { severity: "error", rule, message, location, pointer, line, column }; skipped lists remote files its
 * $refs point to that were not fetched (see `remote`).
 */
export async function checkSpec(location, { remote = false } = {}) {
  // Imported here: the CLI loads every command module for its help; only validate needs these.
  const { validate } = await import("@scalar/openapi-validator");

  let bundle;
  try {
    bundle = await bundleSpec(location, { remote });
  } catch (err) {
    if (err instanceof SpecSyntaxError) {
      const where = { location: err.location, pointer: [], line: err.line, column: err.column };
      return {
        location,
        problems: [{ severity: "error", rule: "syntax", message: err.message, ...where }],
        skipped: [],
      };
    }
    throw err;
  }

  const problems = [];
  const seen = new Set();
  const add = (rule, message, segments, fromBundle = true) => {
    const at = fromBundle ? locate(bundle, segments) : segments;
    const { line, column } = position(bundle.files.get(at.location), at.pointer);
    const key = `${at.location}:${line}:${column}:${message}`;
    if (seen.has(key)) return;
    seen.add(key);
    problems.push({
      severity: "error",
      rule,
      message,
      location: at.location,
      pointer: at.pointer,
      line,
      column,
    });
  };

  for (const problem of bundle.problems) add("ref", problem.message, problem, false);

  // 1. The document against the OpenAPI schema for its version (plus the cookie-parameter rules).
  const result = await validate(bundle.value, { checkPathParameters: false });
  for (const error of result.errors ?? []) add("openapi", error.message, segmentsOf(error.path));

  // 2. Declared path parameters ({id} in the path) must be defined. The validator needs parameter
  // $refs resolved for that, so it gets a copy where only those are; its schema errors are already
  // reported above, so only the path-parameter findings (array paths) are kept.
  if (result.version && result.version !== "2.0") {
    const withParameters = await validate(resolveParameters(bundle.value), {
      checkPathParameters: true,
      checkCookieParameters: false,
    });
    for (const error of withParameters.errors ?? [])
      if (Array.isArray(error.path)) add("openapi", error.message, segmentsOf(error.path));
  }

  return { location, version: result.version, problems, skipped: bundle.skipped };
}

/** A validator error path ("/paths/~1a/get", ["paths", "/a", "get"] or nothing) as segments. */
function segmentsOf(errorPath) {
  if (Array.isArray(errorPath)) return errorPath.map(String);
  if (typeof errorPath === "string" && errorPath) return decodePointer(`#${errorPath}`);
  return [];
}

/** A copy of the document with `#/...` $refs in parameter lists (and path items) followed. */
function resolveParameters(document) {
  const follow = (node) => {
    for (
      let hops = 0;
      node && typeof node.$ref === "string" && node.$ref.startsWith("#") && hops < 10;
      hops++
    )
      node = valueAt(document, decodePointer(node.$ref)) ?? node;
    return node;
  };
  const withParams = (node) =>
    Array.isArray(node?.parameters) ? { ...node, parameters: node.parameters.map(follow) } : node;

  const paths = {};
  for (const [route, rawItem] of Object.entries(document.paths ?? {})) {
    const item = withParams(follow(rawItem));
    if (!item || typeof item !== "object") {
      paths[route] = item;
      continue;
    }
    const copy = { ...item };
    for (const [key, operation] of Object.entries(item))
      if (
        operation &&
        typeof operation === "object" &&
        !Array.isArray(operation) &&
        key !== "parameters"
      )
        copy[key] = withParams(operation);
    paths[route] = copy;
  }
  return { ...document, paths };
}

export { isUrl };
