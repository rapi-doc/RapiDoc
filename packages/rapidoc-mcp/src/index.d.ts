/**
 * TypeScript Type Definitions for '@rapidoc/mcp'
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
  /**
   * Absolute http(s) URL. Left out when the OpenAPI document names no absolute server URL and
   * was not loaded from an address: the runtime then needs `baseUrls` (`MCP_BASE_URL`).
   */
  baseUrl?: string;
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
  /** For `in: "query"`: send RFC 3986 reserved characters unencoded (OpenAPI `allowReserved`). */
  allowReserved?: boolean;
}

export interface McpOperation {
  /** The source description's name; "" for an `x-operation` step. */
  source: string;
  method: string;
  /** The OpenAPI path; absent for an `x-operation` step, which has `url` instead. */
  path?: string;
  /** An `x-operation` step's URL as written: absolute, or a runtime expression. */
  url?: string;
  params: McpOperationParam[];
  /** OpenAPI security requirement alternatives, `{ schemeId: scopes }` each. */
  security: Record<string, string[]>[];
}

export interface McpToolAnnotations {
  readOnlyHint: boolean;
  /**
   * True with a PUT, PATCH or DELETE, false for reads. Left out for a POST (it may add or undo),
   * so hosts assume the tool may be destructive.
   */
  destructiveHint?: boolean;
  idempotentHint: boolean;
}

export interface McpTool {
  /** At most 64 characters of `a-z`, `0-9` and `_`; unique in the manifest. */
  name: string;
  description: string;
  inputSchema: JsonSchema;
  annotations: McpToolAnnotations;
  /** An operation tool's request. */
  operation?: McpOperation;
  /** A workflow tool: the id of its entry in `workflows`. */
  workflow?: string;
}

export interface McpCriterion {
  /** A simple Arazzo condition, e.g. `$statusCode == 200`. */
  condition: string;
}

export interface McpAction {
  name: string;
  type: "end" | "goto" | "retry";
  criteria: McpCriterion[];
  stepId?: string;
  retryLimit?: number;
  retryAfter?: number;
}

export interface McpWorkflowStep {
  stepId: string;
  description: string;
  operation: McpOperation;
  /** Arazzo parameters; `value` may be a runtime expression. */
  parameters: { name: string; in: string; value: unknown }[];
  requestBody: {
    contentType: string;
    payload: unknown;
    replacements?: { target: string; value: unknown }[];
  } | null;
  /** The step's `x-security` entries (the workflow's, then its own); values may be expressions. */
  security: {
    scheme: { type: string; scheme?: string; in?: string; name?: string };
    values: Record<string, unknown>;
  }[];
  successCriteria: McpCriterion[];
  /** The step's own actions, then the workflow's it does not override by name. */
  onSuccess: McpAction[];
  onFailure: McpAction[];
  /** Output name → runtime expression against the step's response. */
  outputs: Record<string, unknown>;
}

export interface McpWorkflow {
  workflowId: string;
  summary: string;
  description: string;
  inputs: JsonSchema;
  steps: McpWorkflowStep[];
  outputs: Record<string, unknown>;
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
  /** By workflow id; empty without an Arazzo document. */
  workflows: Record<string, McpWorkflow>;
}

export interface McpProblem {
  level: "error" | "warning";
  path: string;
  message: string;
}

export interface BuildManifestOptions {
  /** A parsed Arazzo document (or JSON text) whose workflows become tools. */
  arazzo?: object | string;
  /** The other OpenAPI documents those workflows use, by Arazzo source description name. */
  sources?: Record<string, object>;
  /** Receives one entry per workflow the runtime cannot run, which is left out. */
  onProblem?: (problem: McpProblem) => void;
  /** The MCP server's name; defaults to the API title. */
  serverName?: string;
  /** The key of the API in `sources`; defaults to `api`. */
  sourceName?: string;
  /**
   * The http(s) address the document was loaded from. A relative server URL (`/api/v1`), or
   * none, is resolved against it; without it the source has no `baseUrl`.
   */
  specUrl?: string;
  /** The same for the documents in `sources`, by name. */
  sourceUrls?: Record<string, string>;
  /** Put in front of every tool name, before names are cut to 64 characters and made unique. */
  toolNamePrefix?: string;
  includeInternal?: boolean;
  includeDeprecated?: boolean;
  /** `false` leaves the operations out: the Arazzo workflows' tools alone (default `true`). */
  includeOperations?: boolean;
}

/**
 * Builds the manifest from a raw OpenAPI 3.x / Swagger 2.0 object or from `<rapi-doc>`'s
 * processed spec (`resolvedSpec`). Every operation is a tool; a GET without required arguments
 * marked `x-mcp-resource: true` is a resource as well.
 *
 * Throws when two security schemes (or two sources) would read the same environment variable,
 * such as the schemes `api-key` and `apiKey` (both `MCP_AUTH_API_KEY`).
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
  /**
   * Hosts an `x-operation` URL computed at run time (from an input or a response) may go to,
   * besides the hosts the workflow names; `["*"]` allows any.
   */
  externalHosts?: string[];
  /** Waits between retries; defaults to setTimeout. */
  sleep?: (ms: number) => Promise<void>;
  /** Runs workflow tools; `@rapidoc/mcp`'s createMcpRuntime sets it to `runWorkflow`. */
  runWorkflow?: (
    runtime: McpRuntime,
    tool: McpTool,
    args: Record<string, unknown>,
    hooks: McpRunHooks,
  ) => Promise<McpToolResult>;
}

export interface McpRunHooks {
  /** Before each step's request. */
  onStepStart?: (event: { workflowId: string; stepId: string; attempt: number }) => void;
  /** After each step run. */
  onStep?: (event: McpStepEvent) => void;
  /** Waits between retries; defaults to setTimeout. */
  sleep?: (ms: number) => Promise<void>;
  /** Extra headers for a step's request (a mock's `Prefer: code=503`, say), or nothing. */
  requestHeaders?: (event: {
    workflowId: string;
    stepId: string;
    attempt: number;
    operation: object;
  }) => Record<string, string> | undefined;
  /**
   * Steps a run may take, retries and gotos included, before it stops with an error naming the
   * last jump back to an earlier step. Default 1000.
   */
  maxStepRuns?: number;
  /** Stops the run before its next step, or during a retry's wait; the request in flight finishes. */
  signal?: AbortSignal;
}

/** What a workflow run reports after each step. */
export interface McpStepEvent {
  workflowId: string;
  stepId: string;
  attempt: number;
  outcome: "success" | "failure";
  request?: { url: string; method: string; headers: Record<string, string>; body?: unknown };
  response?: { status: number; headers: Record<string, string>; body: unknown };
  outputs?: Record<string, unknown>;
  failedCriterion?: string;
  action: { type: string; name: string; stepId?: string } | null;
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
  callTool(
    name: string,
    args?: Record<string, unknown>,
    hooks?: McpRunHooks,
  ): Promise<McpToolResult>;
  /** Sends one operation; for workflow runners. */
  execute(
    operation: McpOperation,
    args: Record<string, unknown>,
  ): Promise<
    | {
        request: BuiltRequest;
        response: Response;
        headers: Record<string, string>;
        text: string;
        data: unknown;
      }
    | { request?: BuiltRequest; error: McpToolResult }
  >;
  readResource(uri: string): Promise<McpResourceResult>;
}

/**
 * In `@rapidoc/mcp` this is createMcpWorkflowRuntime: workflow tools run too. Throws when
 * `manifest.manifestVersion` is not `MANIFEST_VERSION`. A tool call for a source without a base
 * URL answers with an error result that names the variable to set; it never calls `localhost`.
 */
export function createMcpRuntime(manifest: McpManifest, options?: RuntimeOptions): McpRuntime;

/** Runs a workflow tool on a runtime; pass as `runWorkflow`. */
export function runWorkflow(
  runtime: McpRuntime,
  tool: McpTool,
  args: Record<string, unknown>,
  hooks?: McpRunHooks,
): Promise<McpToolResult>;

/** The text of workflow-runtime.js, for a project writer of your own. */
export const WORKFLOW_RUNTIME_SOURCE: string;

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
  options?: Pick<RuntimeOptions, "credentials" | "baseUrls" | "externalHosts"> & {
    /** An `x-operation` step's URL with its expressions filled in. */
    url?: string;
    /** A workflow step's `x-security` credentials, values filled in. */
    security?: McpWorkflowStep["security"];
  },
): BuiltRequest;

/**
 * Credentials for every security scheme, from `MCP_AUTH_<SCHEME>` (`MCP_AUTH_<SCHEME>_USERNAME`
 * and `MCP_AUTH_<SCHEME>_PASSWORD` for HTTP Basic), and from no other variable.
 */
export function credentialsFromEnv(
  manifest: McpManifest,
  env?: Record<string, string | undefined>,
): Record<string, McpCredential>;

/** The variables credentialsFromEnv reads, by security scheme id. */
export function credentialEnvNames(manifest: McpManifest): Record<string, string[]>;

/** `petstore_auth` → `MCP_AUTH_PETSTORE_AUTH`. */
export function envNameFor(schemeId: string): string;

/**
 * The variable each source's base URL is read from, by source name: `MCP_BASE_URL` with one
 * source, `MCP_BASE_URL_<SOURCE>` each with several.
 */
export function baseUrlEnvNames(manifest: McpManifest): Record<string, string>;

/**
 * Base URLs from those variables, as RuntimeOptions' `baseUrls`. Throws when `MCP_BASE_URL` is
 * set for a manifest with several sources.
 */
export function baseUrlsFromEnv(
  manifest: McpManifest,
  env?: Record<string, string | undefined>,
): Record<string, string>;

/** The sources with no absolute base URL, in the manifest or in `baseUrls`. */
export function sourcesWithoutBaseUrl(
  manifest: McpManifest,
  baseUrls?: Record<string, string>,
): string[];

/**
 * The hosts `MCP_EXTERNAL_HOSTS` lists (comma-separated, `*` for any), as RuntimeOptions'
 * `externalHosts`.
 */
export function externalHostsFromEnv(env?: Record<string, string | undefined>): string[];

/**
 * The exported project's files: manifest.json, server.ts, runtime.js, package.json, README.md,
 * mcp.json, and workflow-runtime.js when the manifest has workflows (`@rapidoc/mcp`
 * supplies its text; pass `workflowRuntime` to override).
 */
export function writeMcpProject(
  manifest: McpManifest,
  options?: { serverName?: string; workflowRuntime?: string; serverPath?: string },
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

/**
 * The exported server's environment variables with placeholder values, for `mcp.json`: its
 * credentials, and the base URL variable of each source the manifest gives no base URL.
 */
export function hostEnvFor(manifest: McpManifest): Record<string, string>;

/** The `mcpServers` entry of `mcp.json`; `env` is hostEnvFor(manifest), none by default. */
export function generateHostConfigs(
  serverName: string,
  options?: { env?: Record<string, string>; serverPath?: string },
): { claudeDesktopConfig: string; cursorConfig: string };

export interface GenerateMcpServerResult {
  manifest: McpManifest;
  files: Record<string, string>;
  budget: McpBudget;
  hostConfig: string;
  /** The workflows left out of the manifest, and why. */
  problems: McpProblem[];
}

/** Arazzo workflows as manifest tools and `workflows` entries; `sources` are operation indexes by Arazzo source name. */
export function compileWorkflows(
  arazzo: object,
  options: {
    sources: Map<string, { byId: Map<string, object>; byPath: Map<string, object> }>;
    onProblem?: (problem: McpProblem) => void;
  },
): { tools: McpTool[]; workflows: Record<string, McpWorkflow> };

/** One Arazzo runtime expression against a step context. */
export function evaluateExpression(expr: string, ctx: object): unknown;
/** A value with its expressions filled in; `{$expr}` inside text is interpolated. */
export function resolveValue(value: unknown, ctx: object): unknown;
/** A simple Arazzo condition; throws when it cannot be parsed. */
export function evaluateCondition(condition: string, ctx: object): boolean;

/** Operation indexes for compileWorkflows' `sources`, from a raw OpenAPI document or <rapi-doc>'s processed one. */
export function indexOperations(openapi: object): {
  byId: Map<string, object>;
  byPath: Map<string, object>;
};
export function indexResolvedSpec(resolvedSpec: object): {
  byId: Map<string, object>;
  byPath: Map<string, object>;
};

/** Parses Arazzo text (JSON or YAML) to an object. */
export function parseArazzo(input: string | object): object;
export function validateArazzo(doc: object): McpProblem[];

/** The manifest, the project files, the budget and the host configuration (mcp.json) in one call. */
export function generateMcpServer(
  spec: object,
  options?: BuildManifestOptions & { workflowRuntime?: string; serverPath?: string },
): GenerateMcpServerResult;

/** snake_case; `fallback` (default `tool`) for text with no Latin letter or digit. */
export function toSnakeCase(str: string, fallback?: string): string;
export function sanitizeDescription(text: string, maxLength?: number): string;
export function deriveToolName(method: string, path: string): string;
/** An operation's name before the length cap and the duplicate check: its operationId, else method and path. */
export function operationToolName(operationId: string, method: string, path: string): string;
export const MAX_TOOL_NAME_LENGTH: 64;
/**
 * Final tool names: over 64 characters, cut with a hash of the whole name; names several tools
 * share end in a hash of each tool's `key` (`GET /pets`), so they do not depend on order.
 */
export function assignToolNames(
  entries: { name: string; key: string }[],
  prefix?: string,
): string[];
export const AUTH_TRANSPORT_HEADERS: Set<string>;
