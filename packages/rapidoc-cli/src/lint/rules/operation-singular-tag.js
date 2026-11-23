/** @type {import("../types.js").Rule} */
export default {
  name: "operation-singular-tag",
  description:
    "An operation has one tag: with several, the reference lists it once under each, so it shows twice in the sidebar and in search.",
  default: "off",
  on: ["operation"],
  check: (operation, { pointer, method, path }) =>
    Array.isArray(operation.tags) && operation.tags.length > 1
      ? [
          {
            pointer: [...pointer, "tags"],
            message: `${method.toUpperCase()} ${path} has ${operation.tags.length} tags (${operation.tags.join(", ")})`,
          },
        ]
      : [],
};
