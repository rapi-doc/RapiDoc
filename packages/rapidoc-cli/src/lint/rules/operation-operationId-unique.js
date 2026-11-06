/** @type {import("../types.js").Rule} */
export default {
  name: "operation-operationId-unique",
  description:
    "No two operations share an operationId: they would share a page URL and an MCP tool name.",
  default: "error",
  on: ["document"],
  check: (_doc, { operations }) => {
    const seen = new Map();
    const findings = [];
    for (const op of operations) {
      const id = op.node.operationId;
      if (typeof id !== "string" || !id) continue;
      const first = seen.get(id);
      if (first)
        findings.push({
          pointer: [...op.pointer, "operationId"],
          message: `operationId "${id}" is also used by ${first.method.toUpperCase()} ${first.path}`,
        });
      else seen.set(id, op);
    }
    return findings;
  },
};
