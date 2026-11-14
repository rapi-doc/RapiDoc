/**
 * The `filter-operations` attribute of <rapi-doc> and <rapi-doc-mini>: which operations an element
 * shows. A space- or comma-separated list of terms; an operation is shown when it matches any
 * include term (all are, without one) and no `!` term.
 *
 *   getPetById           the operation with that operationId
 *   GET /pet/{petId}     that method and path
 *   /pet/{petId}         every method on that path
 *   /pet/* /pet/**       `*` one path segment, `**` any number (zero or more)
 *   tag:store            operations tagged `store` (quote a name with spaces: tag:"Pet Store")
 *   badge:Beta           operations with that x-badges label
 *   deprecated           deprecated operations
 *   !<term>              leaves out what <term> matches
 *
 * Paths, methods, tags and badges compare without case; operationIds exactly. A term is an
 * operationId only when it is none of the other kinds: an id that starts with `tag:` or `badge:`,
 * or is the word `deprecated`, is read as that kind; select such an operation by `METHOD /path`. Shown operations keep
 * the order of the first include term they match (spec order within a term), so a list of
 * operationIds lists them in that order.
 */

const METHODS = new Set([
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
  "query",
]);

/** Splits the attribute into tokens: on spaces and commas, keeping "quoted text" together. */
function tokenize(text) {
  const tokens = [];
  const re = /"([^"]*)"|([^\s,"]+(?:"[^"]*")?)/g;
  let m;
  while ((m = re.exec(String(text || "")))) {
    tokens.push(m[1] !== undefined ? m[1] : m[2]);
  }
  return tokens;
}

const unquote = (value) => value.replace(/^"|"$/g, "");

/** A path pattern: exact, or with `*` (one segment) and `**` (any segments). */
function pathMatcher(pattern) {
  const lower = pattern.toLowerCase();
  if (!lower.includes("*")) return (path) => path.toLowerCase() === lower;
  const escape = (text) => text.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
  // Segment by segment after the leading "/": `**` is any number of segments (the path itself
  // too), `*` within a segment any characters but "/"
  const source = lower
    .split("/")
    .slice(1)
    .map((segment) =>
      segment === "**" ? "(?:/.*)?" : `/${segment.split("*").map(escape).join("[^/]*")}`,
    )
    .join("");
  const re = new RegExp(`^${source}$`);
  return (path) => re.test(path.toLowerCase());
}

/** One term as a test of an operation `{ method, path, operationId, tags, badges, deprecated }`. */
function parseTerm(token, next) {
  // `GET /path`: a method followed by a path is one term
  if (METHODS.has(token.toLowerCase()) && next?.startsWith("/")) {
    const method = token.toLowerCase();
    const matchPath = pathMatcher(next);
    return { consumed: 2, test: (op) => op.method === method && matchPath(op.path) };
  }
  if (token.startsWith("/")) {
    const matchPath = pathMatcher(token);
    return { consumed: 1, test: (op) => matchPath(op.path) };
  }
  const prefixed = token.match(/^(tag|badge):(.+)$/i);
  if (prefixed) {
    const value = unquote(prefixed[2]).toLowerCase();
    const list = prefixed[1].toLowerCase() === "tag" ? "tags" : "badges";
    return { consumed: 1, test: (op) => op[list].some((v) => v.toLowerCase() === value) };
  }
  if (token.toLowerCase() === "deprecated") {
    return { consumed: 1, test: (op) => op.deprecated };
  }
  return { consumed: 1, test: (op) => op.operationId === token };
}

/**
 * Parses the attribute's text.
 * @returns {{ include: Function[], exclude: Function[] } | null} null when it filters nothing
 */
export function parseOperationFilter(text) {
  const tokens = tokenize(text);
  if (!tokens.length) return null;
  const include = [];
  const exclude = [];
  for (let i = 0; i < tokens.length;) {
    const negated = tokens[i].startsWith("!");
    const token = negated ? tokens[i].slice(1) : tokens[i];
    if (!token) {
      i += 1;
      continue;
    }
    const { consumed, test } = parseTerm(token, tokens[i + 1]);
    (negated ? exclude : include).push(test);
    i += consumed;
  }
  return include.length || exclude.length ? { include, exclude } : null;
}

/** What the terms look at, from an OpenAPI operation object and where it is. */
export function operationFacts(method, path, operation) {
  const badges = Array.isArray(operation?.["x-badges"]) ? operation["x-badges"] : [];
  return {
    method: String(method).toLowerCase(),
    path: String(path),
    operationId: operation?.operationId || "",
    tags: Array.isArray(operation?.tags) ? operation.tags.map(String) : [],
    badges: badges.map((b) => String(b?.label ?? "")).filter(Boolean),
    deprecated: Boolean(operation?.deprecated),
  };
}

/**
 * Where an operation goes in the filter: the index of the first include term it matches (0 when
 * there are none), or -1 when it is left out.
 */
export function operationRank(filter, facts) {
  if (!filter) return 0;
  if (filter.exclude.some((test) => test(facts))) return -1;
  if (!filter.include.length) return 0;
  return filter.include.findIndex((test) => test(facts));
}
