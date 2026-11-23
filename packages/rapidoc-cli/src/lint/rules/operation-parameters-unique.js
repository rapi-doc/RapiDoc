/** @type {import("../types.js").Rule} */
export default {
  name: "operation-parameters-unique",
  description:
    "A parameter is listed once per operation or path (same name and location): of two, Try and the mock send one.",
  default: "error",
  on: ["operation", "pathItem"],
  check: (node, { pointer, resolve, method, path }) => {
    if (!Array.isArray(node.parameters)) return [];
    const seen = new Set();
    const findings = [];
    node.parameters.forEach((listed, i) => {
      const parameter = resolve(listed);
      if (!parameter || typeof parameter.name !== "string") return;
      const key = `${parameter.in}\n${parameter.name}`;
      if (seen.has(key))
        findings.push({
          pointer: [...pointer, "parameters", String(i)],
          message: `${method ? `${method.toUpperCase()} ` : ""}${path ?? ""}: ${parameter.in} parameter "${parameter.name}" is listed twice`,
        });
      seen.add(key);
    });
    return findings;
  },
};
