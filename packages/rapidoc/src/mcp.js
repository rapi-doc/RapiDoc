/**
 * `rapidoc/mcp`: the MCP manifest builder, runtime and project writer for Node (the portal build,
 * `@rapidoc/server`, the CLI), without Lit or any element. Built into `dist/rapidoc-mcp-min.js`.
 */
export * from "./utils/mcp-generator.js";
export { parseDocument as parseArazzo, validateArazzo } from "./utils/arazzo/parse.js";
