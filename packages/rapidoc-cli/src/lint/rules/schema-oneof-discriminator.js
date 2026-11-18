const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

/** Whether a schema describes an object: by its type, or by having properties. */
const describesObject = (schema) =>
  isObject(schema) &&
  (schema.type === "object" ||
    (Array.isArray(schema.type) && schema.type.includes("object")) ||
    isObject(schema.properties) ||
    Array.isArray(schema.allOf));

/** The value a property is fixed to in a schema (`const`, or an enum of one), or undefined. */
const fixedValue = (property) => {
  if (!isObject(property)) return undefined;
  if (property.const !== undefined) return property.const;
  return Array.isArray(property.enum) && property.enum.length === 1 ? property.enum[0] : undefined;
};

/** @type {import("../types.js").Rule} */
export default {
  name: "schema-oneof-discriminator",
  description:
    "A oneOf or anyOf between object schemas says how to tell them apart: a discriminator, or a property with a different fixed value in each. Without one, a client, a code generator and the mock have to guess the shape.",
  default: "warn",
  on: ["schema"],
  check: (schema, { pointer, resolve }) => {
    if (isObject(schema.discriminator)) return [];
    const findings = [];
    for (const keyword of ["oneOf", "anyOf"]) {
      if (!Array.isArray(schema[keyword])) continue;
      const objects = schema[keyword].map(resolve).filter(describesObject);
      if (objects.length < 2) continue; // one object and null, or a choice between simple values
      // a property every branch fixes to its own value tells them apart as well as a discriminator does
      const told = Object.keys(objects[0].properties ?? {}).some((name) => {
        const values = objects.map((one) => fixedValue(resolve(one.properties?.[name])));
        return (
          values.every((value) => value !== undefined) && new Set(values).size === values.length
        );
      });
      if (told) continue;
      findings.push({
        pointer: [...pointer, keyword],
        message: `${keyword} chooses between ${objects.length} object schemas with nothing to tell them apart: add a discriminator, or a property with a fixed value in each`,
      });
    }
    return findings;
  },
};
