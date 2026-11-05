/**
 * OpenAPI schemas as the JSON Schema an MCP tool argument carries.
 */

// JSON Schema keywords copied as they are; everything else (examples, xml, x-*, ...) is dropped
const SCHEMA_KEYWORDS = new Set([
  "type",
  "title",
  "description",
  "default",
  "enum",
  "const",
  "format",
  "multipleOf",
  "maximum",
  "exclusiveMaximum",
  "minimum",
  "exclusiveMinimum",
  "maxLength",
  "minLength",
  "pattern",
  "maxItems",
  "minItems",
  "uniqueItems",
  "maxProperties",
  "minProperties",
  "required",
]);
const SCHEMA_SUBSCHEMAS = new Set(["items", "additionalProperties", "not"]);
const SCHEMA_LISTS = new Set(["allOf", "anyOf", "oneOf"]);

/** Follows a `#/...` JSON pointer inside `root`. */
export function resolvePointer(root, ref) {
  if (typeof ref !== "string" || !ref.startsWith("#/")) return undefined;
  return ref
    .slice(2)
    .split("/")
    .map((s) => decodeURIComponent(s).replace(/~1/g, "/").replace(/~0/g, "~"))
    .reduce((node, key) => (node && typeof node === "object" ? node[key] : undefined), root);
}

/**
 * An OpenAPI schema as JSON Schema for a tool argument: `$ref`s inlined, `nullable` folded into
 * `type`, read-only properties dropped (they never go in a request), and non-schema keys removed.
 * A schema reached again on the same branch (a cycle) is cut to its bare type.
 */
export function toJsonSchema(schema, root, stack = new Set()) {
  if (!schema || typeof schema !== "object") return {};
  if (schema.$ref) {
    const target = resolvePointer(root, schema.$ref);
    if (!target || typeof target !== "object") {
      return { description: `See ${schema.$ref}` };
    }
    return toJsonSchema(target, root, stack);
  }
  if (stack.has(schema)) return schema.type ? { type: schema.type } : {};
  stack.add(schema);
  const out = {};
  let nullable = false;
  for (const [key, value] of Object.entries(schema)) {
    if (key === "properties" && value && typeof value === "object") {
      out.properties = {};
      for (const [name, prop] of Object.entries(value)) {
        if (prop?.readOnly === true) continue;
        out.properties[name] = toJsonSchema(prop, root, stack);
      }
    } else if (SCHEMA_SUBSCHEMAS.has(key)) {
      out[key] = typeof value === "object" ? toJsonSchema(value, root, stack) : value;
    } else if (SCHEMA_LISTS.has(key) && Array.isArray(value)) {
      out[key] = value.map((s) => toJsonSchema(s, root, stack));
    } else if (key === "nullable") {
      nullable = value === true;
    } else if (SCHEMA_KEYWORDS.has(key)) {
      out[key] = value;
    }
  }
  stack.delete(schema);
  if (out.properties && Array.isArray(out.required)) {
    out.required = out.required.filter((name) => name in out.properties);
    if (!out.required.length) delete out.required;
  }
  // OpenAPI 3.0 booleans: exclusiveMinimum: true means "minimum is exclusive"
  for (const [flag, bound] of [
    ["exclusiveMinimum", "minimum"],
    ["exclusiveMaximum", "maximum"],
  ]) {
    if (typeof out[flag] === "boolean") {
      if (out[flag] && out[bound] !== undefined) {
        out[flag] = out[bound];
        delete out[bound];
      } else delete out[flag];
    }
  }
  if (nullable && out.type && ![].concat(out.type).includes("null")) {
    out.type = [].concat(out.type, "null");
  }
  return out;
}
