/**
 * MCP server over stdio for the API described in manifest.json. Exported by RapiDoc.
 *
 * The tools, resources and the API's base URL come from the manifest and the requests are made
 * by runtime.js, so this file is the same for every API. Credentials come from environment
 * variables named after the API's security schemes (see claude_desktop_config.json);
 * API_BASE_URL overrides the base URL.
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
import { createMcpRuntime, credentialsFromEnv } from "./runtime.js";

const manifest = JSON.parse(readFileSync(new URL("./manifest.json", import.meta.url), "utf8"));

const baseUrls: Record<string, string> = {};
if (process.env.API_BASE_URL) {
  for (const name of Object.keys(manifest.sources)) baseUrls[name] = process.env.API_BASE_URL;
}
const runtime = createMcpRuntime(manifest, {
  credentials: credentialsFromEnv(manifest, process.env),
  baseUrls,
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
