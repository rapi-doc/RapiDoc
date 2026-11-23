const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

/** @type {import("../types.js").Rule} */
export default {
  name: "no-required-undefined-properties",
  description:
    "Every name under required is a property of the schema: a required property nobody described is usually a typo or a leftover, and no example or mock data can satisfy it.",
  default: "warn",
  on: ["schema"],
  check: (schema, { pointer }) => {
    if (!Array.isArray(schema.required) || !isObject(schema.properties)) return [];
    // a schema put together from others, or open to more properties, may get the property elsewhere
    if (schema.allOf || schema.anyOf || schema.oneOf || schema.$ref) return [];
    if (isObject(schema.additionalProperties) || isObject(schema.patternProperties)) return [];
    return schema.required.flatMap((name, i) =>
      typeof name !== "string" || Object.hasOwn(schema.properties, name)
        ? []
        : [
            {
              pointer: [...pointer, "required", String(i)],
              message: `required property "${name}" is not under properties`,
            },
          ],
    );
  },
};
