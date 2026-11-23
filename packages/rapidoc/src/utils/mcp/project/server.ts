/**
 * MCP server over stdio for the API described in manifest.json. Exported by RapiDoc.
 *
 * The tools, resources and the API's base URL come from the manifest and the requests are made
 * by runtime.js, so this file is the same for every API. Everything it reads from the environment
 * starts with MCP_ (README.md and mcp.json name the exact variables):
 *   MCP_AUTH_<SCHEME>    a security scheme's credential (_USERNAME and _PASSWORD for HTTP Basic)
 *   MCP_BASE_URL         the API's base URL (MCP_BASE_URL_<SOURCE> each with several APIs)
 *   MCP_EXTERNAL_HOSTS   hosts a workflow's URL computed at run time may go to
 */
import { readFileSync } from "node:fs";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  baseUrlEnvNames,
  baseUrlsFromEnv,
  createMcpRuntime,
  credentialsFromEnv,
  externalHostsFromEnv,
  sourcesWithoutBaseUrl,
} from "./runtime.js";

// workflow-runtime.js is part of the export only when the manifest has workflow tools
const { runWorkflow } = await import("./workflow-runtime.js").catch(() => ({
  runWorkflow: undefined,
}));

const manifest = JSON.parse(readFileSync(new URL("./manifest.json", import.meta.url), "utf8"));

const baseUrls: Record<string, string> = baseUrlsFromEnv(manifest, process.env);
for (const source of sourcesWithoutBaseUrl(manifest, baseUrls)) {
  console.error(
    `[MCP] ${manifest.server.name}: no base URL for "${source}". Set ${baseUrlEnvNames(manifest)[source]}; until then its tools answer with an error.`,
  );
}
const runtime = createMcpRuntime(manifest, {
  credentials: credentialsFromEnv(manifest, process.env),
  baseUrls,
  // Hosts a workflow's x-operation URL computed at run time may go to, besides those it names
  externalHosts: externalHostsFromEnv(process.env),
  runWorkflow,
});

const server = new Server(
  { name: manifest.server.name, version: manifest.server.version },
  { capabilities: { tools: {}, resources: {} } },
);
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: runtime.listTools() }));
server.setRequestHandler(CallToolRequestSchema, async (request) =>
  runtime.callTool(request.params.name, request.params.arguments ?? {}),
);
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: runtime.listResources(),
}));
server.setRequestHandler(ReadResourceRequestSchema, async (request) =>
  runtime.readResource(request.params.uri),
);

await server.connect(new StdioServerTransport());
console.error(`[MCP] ${manifest.server.name}: ${manifest.tools.length} tools on stdio`);
