const WRITES = new Set(["post", "put", "patch", "delete"]);

/** @type {import("../types.js").Rule} */
export default {
  name: "security-defined",
  description:
    "Write operations (POST, PUT, PATCH, DELETE) have a security requirement, their own or the document's: Try and the mock server need it, and MCP marks them as consequential. An explicit `security: []` opts out.",
  default: "warn",
  on: ["operation"],
  check: (op, { pointer, method, path, doc }) => {
    if (!WRITES.has(method)) return [];
    const own = Array.isArray(op.security);
    const global = Array.isArray(doc.security) && doc.security.length > 0;
    return own || global
      ? []
      : [
          {
            pointer,
            message: `${method.toUpperCase()} ${path} has no security requirement (and the document has none)`,
          },
        ];
  },
};
