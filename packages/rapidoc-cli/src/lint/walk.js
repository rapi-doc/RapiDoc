/*
 * Helpers for rules that look across the whole document: a walk that stays out of data (examples,
 * defaults, enum values, which may hold keys that look like OpenAPI's), and the casing of a name.
 */

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

/** Keys whose value is data written by the spec's author, not part of the description of the API */
const DATA_KEYS = new Set(["example", "examples", "default", "enum", "const", "x-examples"]);

/**
 * Calls `visit(node, pointer, isNameMap)` for every object in the document that is not data.
 * `isNameMap` is true for a `properties` object: its keys are names the author chose, each holding a
 * schema, so a key such as `description`, `example` or `properties` in it is a property, not a keyword.
 *
 * @param {object} doc
 * @param {(node: object, pointer: string[], isNameMap: boolean) => void} visit
 */
export function walkDocument(doc, visit) {
  const seen = new Set();
  const walk = (node, pointer, isNameMap) => {
    if (Array.isArray(node)) {
      node.forEach((item, i) => walk(item, [...pointer, String(i)], false));
      return;
    }
    if (!isObject(node) || seen.has(node)) return;
    seen.add(node);
    visit(node, pointer, isNameMap);
    for (const [key, child] of Object.entries(node)) {
      if (isNameMap) walk(child, [...pointer, key], false);
      else if (!DATA_KEYS.has(key)) walk(child, [...pointer, key], key === "properties");
    }
  };
  walk(doc, [], false);
}

/**
 * The casing of a name: "camelCase", "snake_case", "kebab-case", "PascalCase", or null for a name that
 * fits several (one lower-case word, as `id`) or none (`X-Request-ID`, `user.name`).
 *
 * @param {string} name
 * @returns {"camelCase" | "snake_case" | "kebab-case" | "PascalCase" | null}
 */
export function casingOf(name) {
  if (/^[a-z][a-z0-9]*$/.test(name)) return null;
  if (/^[a-z][a-z0-9]*([A-Z][a-z0-9]*)+$/.test(name)) return "camelCase";
  if (/^[a-z][a-z0-9]*(_[a-z0-9]+)+$/.test(name)) return "snake_case";
  if (/^[a-z][a-z0-9]*(-[a-z0-9]+)+$/.test(name)) return "kebab-case";
  if (/^([A-Z][a-z0-9]+)+$/.test(name)) return "PascalCase";
  return null;
}

/**
 * Findings for the names that are not written the way most are. Nothing when no casing is used by
 * more than half of the names that have one: then there is no convention to hold the rest to.
 *
 * @param {{ name: string, pointer: string[] }[]} names
 * @param {string} what - "property", "query parameter" ...
 * @returns {import("./types.js").Finding[]}
 */
export function casingOutliers(names, what) {
  const cased = names
    .map((one) => ({ ...one, casing: casingOf(one.name) }))
    .filter((one) => one.casing);
  const counts = Map.groupBy(cased, (one) => one.casing);
  const [usual, same] = [...counts].sort((a, b) => b[1].length - a[1].length)[0] ?? [];
  if (!usual || same.length * 2 <= cased.length) return [];
  return cased
    .filter((one) => one.casing !== usual)
    .map((one) => ({
      pointer: one.pointer,
      message: `${what} "${one.name}" is ${one.casing}; most (${same.length} of ${cased.length}) are ${usual}`,
    }));
}
