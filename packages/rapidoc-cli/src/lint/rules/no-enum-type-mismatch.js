const typeOf = (value) =>
  value === null
    ? "null"
    : Array.isArray(value)
      ? "array"
      : Number.isInteger(value)
        ? "integer"
        : typeof value;

const fits = (value, type) => {
  const actual = typeOf(value);
  return actual === type || (type === "number" && actual === "integer");
};

/** @type {import("../types.js").Rule} */
export default {
  name: "no-enum-type-mismatch",
  description:
    'Every enum value has the schema\'s type (not type: integer with enum: ["1", "2"]): the reference, generated examples and the mock would offer values the schema itself refuses.',
  default: "error",
  on: ["schema"],
  check: (schema, { pointer }) => {
    if (!Array.isArray(schema.enum) || schema.type === undefined) return [];
    const types = [schema.type].flat().filter((type) => typeof type === "string");
    if (!types.length) return [];
    // OpenAPI 3.0: nullable lets null in beside the type
    if (schema.nullable === true) types.push("null");
    return schema.enum.flatMap((value, i) =>
      types.some((type) => fits(value, type))
        ? []
        : [
            {
              pointer: [...pointer, "enum", String(i)],
              message: `enum value ${JSON.stringify(value)} is not of type ${types.join(" or ")}`,
            },
          ],
    );
  },
};
