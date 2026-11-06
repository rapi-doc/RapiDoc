/** @type {import("../types.js").Rule} */
export default {
  name: "operation-4xx-response",
  description:
    "Every operation documents at least one 4xx response, so readers see the error shapes.",
  default: "off",
  on: ["operation"],
  check: (op, { pointer, method, path }) =>
    Object.keys(op.responses ?? {}).some((code) => code.startsWith("4"))
      ? []
      : [
          {
            pointer: [...pointer, "responses"],
            message: `${method.toUpperCase()} ${path} has no 4xx response`,
          },
        ],
};
