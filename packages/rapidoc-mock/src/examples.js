import { validatorFor } from "./responses.js";
import { toJsonSchema } from "./schema.js";

/**
 * Why a value misses an OpenAPI schema, or null when it fits (or the schema can't be checked): the check
 * `rapidoc lint`'s `example-matches-schema` rule runs on a spec's examples, with the schema read the way the
 * mock reads it (OpenAPI 3.0 `nullable`, `$ref`s, `allOf`).
 *
 * @param {object} doc - The OpenAPI document; `$ref`s inside it are followed
 * @param {object} schema - The schema object as the document writes it
 * @param {unknown} value
 * @param {string} [pointer] - Where the schema is, for the cache of converted schemas
 * @returns {string | null} The first problem: "/data/0/id must be string"
 */
export function exampleError(doc, schema, value, pointer = "#/example") {
  let valid;
  try {
    valid = validatorFor(toJsonSchema(doc, schema, pointer));
  } catch {
    return null;
  }
  if (!valid || valid(value)) return null;
  const [error] = valid.errors;
  const detail =
    error.keyword === "required"
      ? `must have ${error.params.missingProperty}`
      : error.keyword === "additionalProperties"
        ? `must not have ${error.params.additionalProperty}`
        : error.keyword === "enum"
          ? `must be one of ${error.params.allowedValues.map((one) => JSON.stringify(one)).join(", ")}`
          : error.message;
  return `${error.instancePath || "the value"} ${detail}`;
}
