/** @type {import("../types.js").Rule} */
export default {
  name: "operation-operationId",
  description:
    "Every operation has an operationId: the portal builds stable page URLs from it, and MCP tool names.",
  default: "warn",
  on: ["operation"],
  check: (op, { pointer, method, path }) =>
    typeof op.operationId === "string" && op.operationId.trim()
      ? []
      : [{ pointer, message: `${method.toUpperCase()} ${path} has no operationId` }],
};
