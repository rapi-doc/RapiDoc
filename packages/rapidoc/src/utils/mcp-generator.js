/**
 * MCP (Model Context Protocol) Server Generator for RapiDoc
 *
 * Implements client-side, zero-runtime-dependency translation from OpenAPI specs
 * into curated, token-efficient MCP servers across multiple language ecosystems:
 *   - TypeScript (@modelcontextprotocol/sdk + zod)
 *   - Python (fastmcp + standard urllib)
 *   - Go (mark3labs/mcp-go)
 *   - C# (.NET / ModelContextProtocol.NET)
 *   - Rust (mcp-sdk / rmcp)
 *   - Java (Spring AI MCP)
 *
 * Honors primary `x-mcp` extensions and compatibility aliases from Redocly,
 * Scalar, OpenAI (x-openai-isConsequential), and Speakeasy.
 */

export {
  AUTH_TRANSPORT_HEADERS,
  VALID_MCP_TARGETS,
  MCP_TARGET_LABELS,
  parseMcpTargets,
  toSnakeCase,
  toPascalCase,
  toCamelCase,
  sanitizeDescription,
  deriveToolName,
  extractParameters,
  extractMcpOperations,
  estimateTokenCost,
  generateHostConfigs,
} from './mcp/common.js';

import { extractMcpOperations, estimateTokenCost, generateHostConfigs } from './mcp/common.js';
import { generateTypeScriptMcpServer, generateTypeScriptFiles } from './mcp/generators/typescript.js';
import { generatePythonFastMcpServer, generatePythonFiles } from './mcp/generators/python.js';
import { generateGoMcpServer, generateGoFiles } from './mcp/generators/go.js';
import { generateCSharpMcpServer, generateCSharpFiles } from './mcp/generators/csharp.js';
import { generateRustMcpServer, generateRustFiles } from './mcp/generators/rust.js';
import { generateJavaMcpServer, generateJavaFiles } from './mcp/generators/java.js';

export {
  generateTypeScriptMcpServer,
  generatePythonFastMcpServer,
  generateGoMcpServer,
  generateCSharpMcpServer,
  generateRustMcpServer,
  generateJavaMcpServer,
};

/**
 * Main orchestrator: extracts MCP operations, computes budget, and generates
 * language-specific server implementation and packaging manifests.
 *
 * @param {object} parsedSpec Raw or parsed OpenAPI specification object
 * @param {object} options Target language, server name, and filtering options
 * @returns {object} { target, serverCode, hostConfig, budget, files, extracted }
 */
export function generateMcpServer(parsedSpec, options = {}) {
  const rawTarget = (options.target || 'typescript').toLowerCase();
  const target = rawTarget === 'c#' ? 'csharp' : rawTarget;
  const extracted = extractMcpOperations(parsedSpec, options);
  const budget = estimateTokenCost(extracted.tools, extracted.resources, extracted.workflows);
  const hostConfigs = generateHostConfigs(options.serverName || extracted.metadata.title, { target });

  let serverCode;
  let targetFiles;

  if (target === 'python') {
    serverCode = generatePythonFastMcpServer(extracted.metadata, extracted.tools, extracted.resources, extracted.workflows, options);
    targetFiles = generatePythonFiles(serverCode, extracted.metadata, options);
  } else if (target === 'go') {
    serverCode = generateGoMcpServer(extracted.metadata, extracted.tools, extracted.resources, extracted.workflows, options);
    targetFiles = generateGoFiles(serverCode, extracted.metadata, options);
  } else if (target === 'csharp') {
    serverCode = generateCSharpMcpServer(extracted.metadata, extracted.tools, extracted.resources, extracted.workflows, options);
    targetFiles = generateCSharpFiles(serverCode, extracted.metadata, options);
  } else if (target === 'rust') {
    serverCode = generateRustMcpServer(extracted.metadata, extracted.tools, extracted.resources, extracted.workflows, options);
    targetFiles = generateRustFiles(serverCode, extracted.metadata, options);
  } else if (target === 'java') {
    serverCode = generateJavaMcpServer(extracted.metadata, extracted.tools, extracted.resources, extracted.workflows, options);
    targetFiles = generateJavaFiles(serverCode, extracted.metadata, options);
  } else {
    // Default: TypeScript
    serverCode = generateTypeScriptMcpServer(extracted.metadata, extracted.tools, extracted.resources, extracted.workflows, options);
    targetFiles = generateTypeScriptFiles(serverCode, extracted.metadata, options);
  }

  const files = {
    'claude_desktop_config.json': hostConfigs.claudeDesktopConfig,
    ...targetFiles,
  };

  return {
    target,
    serverCode,
    hostConfig: hostConfigs.claudeDesktopConfig,
    budget,
    files,
    extracted,
  };
}
