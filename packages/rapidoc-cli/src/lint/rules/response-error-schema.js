const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

/** Statuses that answer without a body by their meaning, or where one is rarely given. */
const NO_BODY = new Set(["401", "403", "404", "405", "406", "410", "412", "429"]);

/** @type {import("../types.js").Rule} */
export default {
  name: "response-error-schema",
  description:
    "A 4xx or 5xx response that says what went wrong (400, 409, 422, 5xx) has a schema: clients read the error from it, and the mock answers Prefer: code=<status> with a body of that shape.",
  default: "warn",
  on: ["response"],
  check: (response, { pointer, parents, method, path, resolve, v2 }) => {
    // the status is known where an operation lists the response, not under components
    if (parents.at(-1) !== "operation") return [];
    const status = String(pointer.at(-1));
    if (!/^[45]/.test(status) || NO_BODY.has(status)) return [];
    const written = resolve(response);
    if (!isObject(written)) return [];
    const described = v2
      ? isObject(written.schema)
      : Object.values(isObject(written.content) ? written.content : {}).some(
          (media) => isObject(media) && (isObject(media.schema) || isObject(media.itemSchema)),
        );
    if (described) return [];
    return [
      {
        pointer,
        message: `${method.toUpperCase()} ${path}: the ${status} response has no schema for its body`,
      },
    ];
  },
};
