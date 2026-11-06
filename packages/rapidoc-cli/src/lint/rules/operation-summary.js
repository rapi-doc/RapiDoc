/** @type {import("../types.js").Rule} */
export default {
  name: "operation-summary",
  description:
    "Every operation has a summary: it is the sidebar label of the operation and the title of its MCP tool.",
  default: "warn",
  on: ["operation"],
  check: (op, { pointer, method, path }) =>
    typeof op.summary === "string" && op.summary.trim()
      ? []
      : [{ pointer, message: `${method.toUpperCase()} ${path} has no summary` }],
};
