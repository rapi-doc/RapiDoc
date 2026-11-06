const SAFE = /^[A-Za-z0-9._-]+$/;

/** @type {import("../types.js").Rule} */
export default {
  name: "operation-operationId-url-safe",
  description: "operationIds use letters, digits, '_', '-' and '.' only: they appear in page URLs.",
  default: "warn",
  on: ["operation"],
  check: (op, { pointer }) =>
    typeof op.operationId !== "string" || !op.operationId || SAFE.test(op.operationId)
      ? []
      : [
          {
            pointer: [...pointer, "operationId"],
            message: `operationId "${op.operationId}" has characters other than letters, digits, '_', '-' and '.'`,
          },
        ],
};
