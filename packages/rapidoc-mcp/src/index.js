/**
 * `@rapidoc/mcp`: the MCP manifest builder, runtime and project writer for Node (the portal build,
 * `@rapidoc/server`), without Lit or any element. Built into `dist/index.js`.
 *
 * The code lives in `packages/rapidoc/src` (`utils/mcp-generator.js`, `utils/mcp/`, `utils/arazzo/`),
 * shared with `<rapi-doc>`'s Export MCP Server button and `<rapi-flow>`, so a project exported from
 * the browser and one written here are the same. This entry adds the workflow runtime, which
 * `rapidoc-min.js` leaves out: its createMcpRuntime runs workflow tools and its project writers
 * include workflow-runtime.js.
 */
import workflowRuntimeSource from "../../rapidoc/src/utils/mcp/workflow-runtime.js?raw";
import {
  generateMcpServer as generate,
  writeMcpProject as write,
} from "../../rapidoc/src/utils/mcp-generator.js";

export * from "../../rapidoc/src/utils/mcp-generator.js";
export {
  parseDocument as parseArazzo,
  validateArazzo,
} from "../../rapidoc/src/utils/arazzo/parse.js";
export { indexOperations, indexResolvedSpec } from "../../rapidoc/src/utils/arazzo/operations.js";
export {
  createMcpWorkflowRuntime as createMcpRuntime,
  runWorkflow,
  evaluateExpression,
  evaluateCondition,
  resolveValue,
} from "../../rapidoc/src/utils/mcp/workflow-runtime.js";

/** The text of workflow-runtime.js, for a project writer of your own. */
export const WORKFLOW_RUNTIME_SOURCE = workflowRuntimeSource;

export function writeMcpProject(manifest, options = {}) {
  return write(manifest, { workflowRuntime: workflowRuntimeSource, ...options });
}

export function generateMcpServer(spec, options = {}) {
  return generate(spec, { workflowRuntime: workflowRuntimeSource, ...options });
}
