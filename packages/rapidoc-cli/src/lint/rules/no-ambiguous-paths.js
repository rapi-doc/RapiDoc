/** @type {import("../types.js").Rule} */
export default {
  name: "no-ambiguous-paths",
  description:
    "No two paths differ only in a parameter's name (/orders/{id} and /orders/{orderId}): a request matches both, and Try, the mock and a server each pick one.",
  default: "error",
  on: ["document"],
  check: (doc) => {
    const seen = new Map();
    const findings = [];
    for (const path of Object.keys(doc.paths ?? {})) {
      const shape = path.replace(/\{[^}]*\}/g, "{}");
      const first = seen.get(shape);
      if (first)
        findings.push({
          pointer: ["paths", path],
          message: `${path} matches the same requests as ${first}`,
        });
      else seen.set(shape, path);
    }
    return findings;
  },
};
