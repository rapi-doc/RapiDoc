/**
 * `allow-try` with filter-operations terms: whether Try is on for one operation. Headless.
 *
 *   allow-try="true"                              Try on every operation (the default)
 *   allow-try="false"                             no Try anywhere
 *   allow-try="!deprecated !tag:pending-implementation"   Try on the operations the terms select
 *
 * The terms are those of `filter-operations` (filter-operations.js). An operation the terms leave
 * out keeps its request documentation and shows a disabled TRY DISABLED button.
 */
import { operationFacts, operationRank, parseOperationFilter } from "./filter-operations.js";

const filters = new Map();

/** The parsed terms of an allow-try value, cached by the text */
function filterOf(allowTry) {
  if (!filters.has(allowTry)) filters.set(allowTry, parseOperationFilter(allowTry));
  return filters.get(allowTry);
}

/** Whether an allow-try value is a filter (not "true", "false" or empty) */
export function isTryFilter(allowTry) {
  const value = String(allowTry ?? "").trim();
  return value !== "" && value !== "true" && value !== "false";
}

/**
 * The `allow-try` an operation's `<api-request>` gets: "true", "false" (no Try anywhere), or
 * "disabled" (the terms leave this operation out).
 * @param {string} allowTry - The element's allow-try
 * @param {object} path - A parsed operation (spec-parser): method, path, rawOperation, xBadges
 * @returns {"true" | "false" | "disabled"}
 */
export function tryStateFor(allowTry, path) {
  if (allowTry === "false") return "false";
  return tryReasonFor(allowTry, path) ? "disabled" : "true";
}

/** What an operation's terms look at: its method, path, id, tags, deprecated and badges */
function factsOf(path) {
  return {
    ...operationFacts(path.method, path.path, path.rawOperation || {}),
    // x-badges and OpenAPI 3.2 kind: badge tags, as the operation shows them
    badges: [
      ...(path.xBadges || []).map((b) => String(b?.label ?? "")),
      ...(path.badgeTagNames || []),
    ].filter(Boolean),
  };
}

/** A term as words: `deprecated` → "deprecated operations", `tag:x` → "operations tagged x" */
function describeTerm(term) {
  const text = String(term || "");
  const prefixed = text.match(/^(tag|badge):"?(.+?)"?$/i);
  if (prefixed) {
    return prefixed[1].toLowerCase() === "tag"
      ? `operations tagged ${prefixed[2]}`
      : `operations with the ${prefixed[2]} badge`;
  }
  if (text.toLowerCase() === "deprecated") return "deprecated operations";
  return text;
}

/**
 * Why Try is off for an operation, for the grey text next to its TRY DISABLED button; "" when Try
 * is on (or allow-try is true or false, which need no reason). Names the ! term that matched, or
 * the include terms the operation is not among.
 * @param {string} allowTry
 * @param {object} path
 */
export function tryReasonFor(allowTry, path) {
  if (!isTryFilter(allowTry) || !path) return "";
  const filter = filterOf(String(allowTry).trim());
  if (!filter) return "";
  const facts = factsOf(path);
  const excluded = filter.exclude.find((test) => test(facts));
  if (excluded) return `Try is off for ${describeTerm(excluded.term)}`;
  if (operationRank(filter, facts) >= 0) return "";
  return `Try is only on for ${filter.include.map((test) => describeTerm(test.term)).join(", ")}`;
}

/** For what is element-wide (the authentication section): "false" only when Try is off everywhere */
export function tryAnywhere(allowTry) {
  return allowTry === "false" ? "false" : "true";
}
