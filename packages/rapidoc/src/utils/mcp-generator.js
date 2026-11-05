/**
 * MCP (Model Context Protocol) server export for RapiDoc.
 *
 * An OpenAPI document becomes an MCP manifest (plain JSON: one tool per operation, with JSON
 * Schema arguments and MCP safety annotations), and the exported project is that manifest plus
 * two fixed files: a runtime that executes it with fetch, and a stdio server built on
 * @modelcontextprotocol/sdk.
 */

export {
  AUTH_TRANSPORT_HEADERS,
  parseMcpEnabled,
  toSnakeCase,
  sanitizeDescription,
  deriveToolName,
  estimateTokenCost,
  envNameFor,
  generateHostConfigs,
} from "./mcp/common.js";
export { buildMcpManifest, toJsonSchema, MANIFEST_VERSION } from "./mcp/manifest.js";
export { compileWorkflows } from "./mcp/workflows.js";
export {
  createMcpRuntime,
  buildRequest,
  credentialsFromEnv,
  evaluateExpression,
  evaluateCondition,
  resolveValue,
} from "./mcp/runtime.js";
export { writeMcpProject } from "./mcp/project.js";
export { createZip } from "./mcp/zip.js";

import { estimateTokenCost, generateHostConfigs } from "./mcp/common.js";
import { buildMcpManifest } from "./mcp/manifest.js";
import { writeMcpProject } from "./mcp/project.js";

/**
 * Builds the manifest and the files of the exported project.
 *
 * @param {object} spec Raw OpenAPI object or `ProcessSpec`'s result
 * @param {object} [options] `serverName`, `includeInternal`, `includeDeprecated`, `arazzo`
 * @returns {{ manifest: object, files: Record<string, string>, budget: object, hostConfig: string,
 *   problems: object[] }} `problems` lists the workflows left out and why
 */
export function generateMcpServer(spec, options = {}) {
  const problems = [];
  const manifest = buildMcpManifest(spec, { ...options, onProblem: (p) => problems.push(p) });
  const files = writeMcpProject(manifest, options);
  const budget = estimateTokenCost(manifest);
  const schemes = Object.values(manifest.sources).flatMap((s) => Object.keys(s.securitySchemes));
  const hostConfig = generateHostConfigs(manifest.server.name, { schemes }).claudeDesktopConfig;
  return { manifest, files, budget, hostConfig, problems };
}
