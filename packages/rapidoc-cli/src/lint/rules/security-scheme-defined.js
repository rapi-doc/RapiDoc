/** @type {import("../types.js").Rule} */
export default {
  name: "security-scheme-defined",
  description:
    "Every security scheme a requirement names is declared (components.securitySchemes, or securityDefinitions): Try's authentication panel is built from the declarations.",
  default: "error",
  on: ["document"],
  check: (doc, { v2, operations }) => {
    const declared = new Set(
      Object.keys((v2 ? doc.securityDefinitions : doc.components?.securitySchemes) ?? {}),
    );
    const findings = [];
    const checkList = (list, pointer) => {
      if (!Array.isArray(list)) return;
      list.forEach((requirement, i) => {
        for (const name of Object.keys(requirement ?? {}))
          if (!declared.has(name))
            findings.push({
              pointer: [...pointer, String(i), name],
              message: `Security scheme "${name}" is not declared`,
            });
      });
    };
    checkList(doc.security, ["security"]);
    for (const op of operations) checkList(op.node.security, [...op.pointer, "security"]);
    return findings;
  },
};
