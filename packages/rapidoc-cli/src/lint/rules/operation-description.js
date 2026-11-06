/** @type {import("../types.js").Rule} */
export default {
  name: "operation-description",
  description:
    "Every operation has a description: readers and AI agents (the MCP tool's description) rely on it.",
  default: "off",
  on: ["operation"],
  check: (op, { pointer, method, path }) =>
    typeof op.description === "string" && op.description.trim()
      ? []
      : [{ pointer, message: `${method.toUpperCase()} ${path} has no description` }],
};
