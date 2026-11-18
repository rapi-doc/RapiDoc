/*
 * What the example rules share: reading an `example` that was written as a map of named examples.
 */

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const EXAMPLE_OBJECT_KEYS = new Set(["summary", "description", "value", "externalValue"]);

/** The property names a schema declares, through `allOf` and `$ref`s. */
function declaredProperties(schema, resolve, depth = 0, names = new Set()) {
  const node = resolve(schema);
  if (!isObject(node) || depth > 6) return names;
  for (const name of Object.keys(isObject(node.properties) ? node.properties : {})) names.add(name);
  for (const part of Array.isArray(node.allOf) ? node.allOf : [])
    declaredProperties(part, resolve, depth + 1, names);
  return names;
}

/**
 * The name and value of a media type's `example` when it is a map of named examples, which belongs under
 * `examples`: `example: { "Calendar": { id, name } }` or `example: { "Calendar": { value: { id, name } } }`.
 * Told by the schema: the example's one key is no property of it, and what is under the key is (an object
 * with properties the schema declares, or a list where the schema is one). Undefined otherwise.
 *
 * @param {object} media - A media type object
 * @param {(node: unknown) => unknown} resolve
 * @returns {{ name: string, value: unknown } | undefined}
 */
export function namedExampleMap(media, resolve) {
  const example = media?.example;
  if (!isObject(example)) return undefined;
  const names = Object.keys(example);
  const schema = resolve(media.schema);
  if (names.length !== 1 || !isObject(schema)) return undefined;
  const [name] = names;
  const inner = example[name];
  // An Example Object (`{ summary?, description?, value }`) holds the value one level further down
  const wrapped =
    isObject(inner) &&
    "value" in inner &&
    Object.keys(inner).every((key) => EXAMPLE_OBJECT_KEYS.has(key));
  const value = wrapped ? inner.value : inner;
  const declared = declaredProperties(schema, resolve);
  const isList = schema.type === "array" || isObject(schema.items);
  if (isList) return Array.isArray(value) ? { name, value } : undefined;
  if (!declared.size || declared.has(name) || !isObject(value)) return undefined;
  return Object.keys(value).some((key) => declared.has(key)) ? { name, value } : undefined;
}
