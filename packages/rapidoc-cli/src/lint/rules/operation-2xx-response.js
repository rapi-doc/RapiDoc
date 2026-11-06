/** @type {import("../types.js").Rule} */
export default {
  name: "operation-2xx-response",
  description:
    "Every operation documents a success response (2xx or 3xx): without one, Try has nothing to show as the expected result.",
  default: "warn",
  on: ["operation"],
  check: (op, { pointer, method, path }) =>
    Object.keys(op.responses ?? {}).some((code) => /^[23]/.test(code))
      ? []
      : [
          {
            pointer: [...pointer, "responses"],
            message: `${method.toUpperCase()} ${path} has no 2xx or 3xx response`,
          },
        ],
};
