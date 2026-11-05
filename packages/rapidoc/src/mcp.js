/**
 * `rapidoc/mcp`: the MCP manifest builder, runtime and project writer for Node (the portal build,
 * `@rapidoc/server`, the CLI), without Lit or any element. Built into `dist/rapidoc-mcp-min.js`.
 * Unlike dist/rapidoc-min.js, this entry carries the workflow runtime: its createMcpRuntime runs
 * workflow tools and its exports include workflow-runtime.js in the project.
 */
import workflowRuntimeSource from "./utils/mcp/workflow-runtime.js?raw";
import { generateMcpServer as generate, writeMcpProject as write } from "./utils/mcp-generator.js";

export * from "./utils/mcp-generator.js";
export { parseDocument as parseArazzo, validateArazzo } from "./utils/arazzo/parse.js";
export {
  createMcpWorkflowRuntime as createMcpRuntime,
  runWorkflow,
  evaluateExpression,
  evaluateCondition,
  resolveValue,
} from "./utils/mcp/workflow-runtime.js";

/** The text of workflow-runtime.js, for a project writer of your own. */
export const WORKFLOW_RUNTIME_SOURCE = workflowRuntimeSource;

export function writeMcpProject(manifest, options = {}) {
  return write(manifest, { workflowRuntime: workflowRuntimeSource, ...options });
}

export function generateMcpServer(spec, options = {}) {
  return generate(spec, { workflowRuntime: workflowRuntimeSource, ...options });
}
