/**
 * TypeScript Type Definitions for 'rapidoc/mcp'
 */

/** A JSON Schema object, as the manifest writes it. */
export type JsonSchema = Record<string, unknown>;

export interface McpSecurityScheme {
  type: "apiKey" | "http" | "oauth2" | "openIdConnect" | string;
  description?: string;
  in?: "header" | "query" | "cookie";
  name?: string;
  scheme?: string;
  bearerFormat?: string;
  openIdConnectUrl?: string;
  flows?: Record<string, unknown>;
}

export interface McpSource {
  baseUrl: string;
  securitySchemes: Record<string, McpSecurityScheme>;
}

export interface McpOperationParam {
  /** The parameter's name on the wire, or `body`. */
  name: string;
  in: "path" | "query" | "header" | "cookie" | "body";
  /** The tool argument that supplies it, when it differs from `name`. */
  arg?: string;
  /** For `in: "body"`: the request body's media type. */
  contentType?: string;
}

export interface McpOperation {
  source: string;
  method: string;
  path: string;
  params: McpOperationParam[];
  /** OpenAPI security requirement alternatives, `{ schemeId: scopes }` each. */
  security: Record<string, string[]>[];
}

export interface McpToolAnnotations {
  readOnlyHint: boolean;
  destructiveHint: boolean;
  idempotentHint: boolean;
}

export interface McpTool {
  name: string;
  description: string;
  inputSchema: JsonSchema;
  annotations: McpToolAnnotations;
  operation: McpOperation;
}

export interface McpResource {
  name: string;
  uri: string;
  description: string;
  mimeType: string;
  operation: McpOperation;
}

export interface McpManifest {
  manifestVersion: 1;
  server: { name: string; version: string; description: string };
  sources: Record<string, McpSource>;
  tools: McpTool[];
  resources: McpResource[];
  /** Empty until workflows land. */
  workflows: Record<string, unknown>;
}

export interface BuildManifestOptions {
  /** The MCP server's name; defaults to the API title. */
  serverName?: string;
  /** The key of the API in `sources`; defaults to `api`. */
  sourceName?: string;
  includeInternal?: boolean;
  includeDeprecated?: boolean;
}

/**
 * Builds the manifest from a raw OpenAPI 3.x / Swagger 2.0 object or from `<rapi-doc>`'s
 * processed spec (`resolvedSpec`).
 */
export function buildMcpManifest(spec: object, options?: BuildManifestOptions): McpManifest;

/** An OpenAPI schema as JSON Schema: `$ref`s inlined from `root`, cycles cut, `nullable` folded. */
export function toJsonSchema(schema: unknown, root: object): JsonSchema;

export const MANIFEST_VERSION: 1;

export type McpCredential = string | { username: string; password: string } | { token: string };

export interface RuntimeOptions {
  fetch?: typeof fetch;
  /** By security scheme id. */
  credentials?: Record<string, McpCredential>;
  /** By source name, overriding the manifest's base URLs. */
  baseUrls?: Record<string, string>;
}

export interface McpContent {
  type: "text";
  text: string;
}

export interface McpToolResult {
  content: McpContent[];
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
}

export interface McpResourceResult {
  contents: { uri: string; mimeType: string; text: string }[];
}

export interface McpRuntime {
  manifest: McpManifest;
  listTools(): Omit<McpTool, "operation">[];
  listResources(): Omit<McpResource, "operation">[];
  callTool(name: string, args?: Record<string, unknown>): Promise<McpToolResult>;
  readResource(uri: string): Promise<McpResourceResult>;
}

export function createMcpRuntime(manifest: McpManifest, options?: RuntimeOptions): McpRuntime;

export interface BuiltRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
}

/** The request a tool call would make, without sending it. Throws on a missing path parameter. */
export function buildRequest(
  manifest: McpManifest,
  operation: McpOperation,
  args?: Record<string, unknown>,
  options?: Pick<RuntimeOptions, "credentials" | "baseUrls">,
): BuiltRequest;

/** Credentials for every security scheme, from variables such as `PETSTORE_AUTH` or `API_KEY`. */
export function credentialsFromEnv(
  manifest: McpManifest,
  env?: Record<string, string | undefined>,
): Record<string, McpCredential>;

/** `petstore_auth` → `PETSTORE_AUTH`. */
export function envNameFor(schemeId: string): string;

/** The exported project's files: manifest.json, server.ts, runtime.js, package.json, README.md, claude_desktop_config.json. */
export function writeMcpProject(
  manifest: McpManifest,
  options?: { serverName?: string },
): Record<string, string>;

/** A stored (uncompressed) ZIP of text files. */
export function createZip(files: Record<string, string>): Uint8Array;

export interface McpBudget {
  totalTools: number;
  totalResources: number;
  estimatedTokens: number;
  /** Tools that are not read-only. */
  consequentialCount: number;
  warnings: string[];
}

export function estimateTokenCost(manifest: McpManifest): McpBudget;

export function generateHostConfigs(
  serverName: string,
  options?: { schemes?: string[] },
): { claudeDesktopConfig: string; cursorConfig: string };

export interface GenerateMcpServerResult {
  manifest: McpManifest;
  files: Record<string, string>;
  budget: McpBudget;
  hostConfig: string;
}

/** The manifest, the project files, the budget and the Claude Desktop config in one call. */
export function generateMcpServer(
  spec: object,
  options?: BuildManifestOptions,
): GenerateMcpServerResult;

/** Reads `<rapi-doc>`'s `mcp` attribute: off for empty, `false` or `none`. */
export function parseMcpEnabled(val: unknown): boolean;

export function toSnakeCase(str: string): string;
export function sanitizeDescription(text: string, maxLength?: number): string;
export function deriveToolName(method: string, path: string): string;
export const AUTH_TRANSPORT_HEADERS: Set<string>;
