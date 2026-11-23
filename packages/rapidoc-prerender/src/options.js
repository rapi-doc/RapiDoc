/**
 * The one reader of option objects, used by every function of the package.
 *
 * Options are camelCase, named as <rapi-doc>'s property for the same thing. An option that is also an
 * attribute of <rapi-doc> is accepted under the attribute's kebab-case name too (`schema-style`); an
 * option of this package only (`basePath`, `outputMode`) has its camelCase name alone. A name the
 * function does not know is an error that lists the valid ones.
 */

const toCamelCase = (name) => name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

/** `schemaStyle` to `schema-style`: the attribute of <rapi-doc> for a property name. */
export const toAttributeName = (name) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

/** The options that decide how a spec is read, each an attribute of <rapi-doc>. */
export const SPEC_OPTIONS = [
  "generateMissingTags",
  "sortTags",
  "sortSchemas",
  "sortEndpointsBy",
  "apiKeyName",
  "apiKeyLocation",
  "apiKeyValue",
  "serverUrl",
  "filterOperations",
  "showUnusedTags",
];

/** `true` and `"true"`, as an attribute of <rapi-doc> would be read. */
export const isTrue = (value) => value === true || value === "true";

/**
 * @param {string} fn - The function's name, for the error
 * @param {object} [options] - What the caller passed
 * @param {object} names
 * @param {string[]} [names.attributes] - Options that are attributes of <rapi-doc> (camelCase)
 * @param {string[]} [names.own] - Options of this package only
 * @param {boolean} [names.passThrough] - Keep unknown names (renderRapiDoc: any attribute of <rapi-doc>)
 * @returns {object} The options under their camelCase names; `undefined` and `null` values left out
 */
export function readOptions(fn, options, { attributes = [], own = [], passThrough = false }) {
  if (options === undefined || options === null) return {};
  if (typeof options !== "object" || Array.isArray(options)) {
    throw new TypeError(`${fn}(): options must be an object.`);
  }
  const result = {};
  for (const [given, value] of Object.entries(options)) {
    const isKebab = given.includes("-");
    const name = isKebab ? toCamelCase(given) : given;
    const known = attributes.includes(name) || (!isKebab && own.includes(name));
    if (!known && !(passThrough && !own.includes(name))) {
      const valid = [...own, ...attributes].sort().join(", ");
      throw new Error(
        `${fn}(): unknown option "${given}". Valid options: ${valid}` +
          (attributes.length > 0
            ? ". Those that are attributes of <rapi-doc> are also accepted in kebab-case."
            : "."),
      );
    }
    if (value === undefined || value === null) continue;
    if (name in result) {
      throw new Error(`${fn}(): option "${name}" is given twice (as "${given}" too).`);
    }
    result[name] = value;
  }
  return result;
}

/** The members of `options` named in `names`. */
export function pick(options, names) {
  return Object.fromEntries(names.filter((name) => name in options).map((n) => [n, options[n]]));
}
