/** @type {import("../types.js").Rule} */
export default {
  name: "parameter-description",
  description:
    "Every parameter has a description: the reference shows it beside the field, and an AI agent calling the API through MCP has nothing else to go on.",
  default: "warn",
  on: ["parameter"],
  check: (parameter, { pointer, method, path }) => {
    // a $ref is checked where the parameter is written, under components
    if (typeof parameter.$ref === "string") return [];
    if (typeof parameter.description === "string" && parameter.description.trim()) return [];
    const where = path ? `${method ? `${method.toUpperCase()} ` : ""}${path}: ` : "";
    const name = parameter.name ?? pointer.at(-1);
    return [
      {
        pointer,
        message: `${where}${parameter.in ?? ""} parameter "${name}" has no description`.replace(
          ":  parameter",
          ": parameter",
        ),
      },
    ];
  },
};
