# MCP Manifest, Runtime and Export

## Overview

Turns an OpenAPI document into an **MCP manifest** (plain JSON: one tool per operation, with
JSON Schema arguments and MCP safety annotations) and executes that manifest with `fetch`. The
exported MCP server is the manifest plus two fixed files: `runtime.js` (this folder's runtime,
copied verbatim) and `project/server.ts` (a stdio server on `@modelcontextprotocol/sdk` that
registers the manifest's tools and hands calls to the runtime). The entry point is
`src/utils/mcp-generator.js`; `<rapi-doc>` (`src/rapidoc.ts`, `src/templates/downloads-template.js`)
uses it for its Export MCP Server button, and `packages/rapidoc-mcp/src/index.js` re-exports it as `@rapidoc/mcp`
(a separate package, Node only, no Lit) for the portal build, `@rapidoc/server` and the CLI.

Arazzo workflows become tools too: `workflows.js` compiles a parsed Arazzo document into
`manifest.workflows` (steps resolved to operations) and one tool per workflow, and
`workflow-runtime.js` runs them on top of `runtime.js`. The two runtimes are separate files so
`dist/rapidoc-min.js` (operation tools only) carries no Arazzo runtime, while
`dist/rapidoc-flow-min.js` and `@rapidoc/mcp` include both. Not owned here: Arazzo parsing and validation (`../arazzo/`), the `<rapi-doc>` attribute and
methods, and the network calls themselves (the runtime only builds and sends requests).

## Interface

- `compileWorkflows(arazzo, { sources, onProblem }) -> { tools, workflows }` [workflows.js]:
  `sources` are operation indexes by Arazzo source name (`../arazzo/operations.js`). A workflow the
  runtime cannot run is reported once through `onProblem` and left out. `buildMcpManifest` calls
  it for `options.arazzo`, naming the manifest's source after the Arazzo document's first OpenAPI
  source so steps resolve; `generateMcpServer` collects the problems into its result.

- `buildMcpManifest(spec, options) -> manifest` [manifest.js]: `spec` is a raw OpenAPI 3.x /
  Swagger 2.0 object or `ProcessSpec`'s result (`tags[].paths[]`). Options: `serverName`,
  `sourceName` (default `api`), `includeInternal`, `includeDeprecated`, `includeOperations` (`false`:
  only the Arazzo workflows' tools, for a manifest of workflows), `specUrl` and `sourceUrls` (the
  http(s) addresses the documents were loaded from, for a relative server URL) and
  `toolNamePrefix`. It throws when two security schemes or two sources would read the same
  environment variable. `toJsonSchema(schema, root)` is the schema converter on its own;
  `MANIFEST_VERSION` is `1` (defined in runtime.js, which checks it).
- `createMcpRuntime(manifest, { fetch, credentials, baseUrls, runWorkflow })` [runtime.js]:
  `listTools()`, `listResources()`, `callTool(name, args, hooks) -> { content, structuredContent?,
  isError? }`, `execute(operation, args, { headers? })` (one request, for workflow runners; the
  headers are added to the request). A workflow tool is handed to `runWorkflow`; without it the
  call is an error result. `callTool`'s hooks reach the workflow runner: `onStepStart`, `onStep`,
  `sleep`, `maxStepRuns`, `signal` (an `AbortSignal`), and `requestHeaders({ workflowId, stepId, attempt, operation })`, whose result is sent
  with that step's request (how `<rapi-flow>` asks `rapidoc mock` for a status with
  `Prefer: code=`).
- `runWorkflow(runtime, tool, args, { onStepStart, onStep, sleep })` and
  `createMcpWorkflowRuntime(manifest, options)` (createMcpRuntime with `runWorkflow` plugged in;
  `options.sleep` waits between retries) [workflow-runtime.js], plus `evaluateExpression`,
  `resolveValue` and `evaluateCondition`. `@rapidoc/mcp` exports `createMcpWorkflowRuntime` as its
  `createMcpRuntime`.
  `readResource(uri) -> { contents }`. `buildRequest(manifest, operation, args, options)` returns
  the request without sending it. The environment: `credentialsFromEnv(manifest, env)`,
  `credentialEnvNames(manifest)` and `envNameFor(id)` for security schemes,
  `baseUrlsFromEnv(manifest, env)` and `baseUrlEnvNames(manifest)` for base URLs,
  `externalHostsFromEnv(env)`, and `sourcesWithoutBaseUrl(manifest, baseUrls)` for the sources a
  server must be given a base URL for.
- `writeMcpProject(manifest, { serverName, workflowRuntime }) -> { [path]: text }` [project.js]:
  `manifest.json`, `server.ts`, `runtime.js`, `package.json`, `README.md`,
  `mcp.json`, and `workflow-runtime.js` when the manifest has workflows and
  `workflowRuntime` (its text) is given: `@rapidoc/mcp` and `<rapi-flow>` supply it,
  `dist/rapidoc-min.js` does not carry it. `server.ts` imports it dynamically when present.
- `createZip(files) -> Uint8Array` [zip.js]: a stored (uncompressed) ZIP of text files.
- `generateMcpServer(spec, options) -> { manifest, files, budget, hostConfig }`
  [../mcp-generator.js]: the three above in one call.
- `common.js`: `parseMcpEnabled(val)` (the `mcp` attribute: on for `true` only; not exported by
  `@rapidoc/mcp`), `toSnakeCase(str, fallback)`, `sanitizeDescription`, `deriveToolName`,
  `operationToolName`, `assignToolNames(entries, prefix)`, `AUTH_TRANSPORT_HEADERS`,
  `estimateTokenCost(manifest)`, `hostEnvFor(manifest)` and
  `generateHostConfigs(serverName, { env })`.

## Invariants

- **Manifest shape.** `{ manifestVersion, server: { name, version, description }, sources:
  { [name]: { baseUrl?, securitySchemes } }, tools, resources, workflows }`. A workflow tool has
  `workflow` (its id) instead of `operation`; `workflows[id]` is `{ workflowId, summary,
  description, inputs, steps, outputs }`, each step `{ stepId, operation, parameters, requestBody,
  security, successCriteria, onSuccess, onFailure, outputs }` with the operation resolved (source,
  method, path, params from the step's parameters and body, security from the OpenAPI operation),
  `security` its `x-security` entries (the workflow's, then its own) as `{ scheme: { type,
  scheme?, in?, name? }, values }` with a `schemeName` resolved against its source's schemes, and
  values kept as Arazzo expressions. A tool is
  `{ name, description, inputSchema, annotations, operation }` with `operation = { source, method,
  path, params: [{ name, in, arg?, contentType? }], security }`; `arg` names the argument when it
  differs from the wire name, `contentType` is set for `in: "body"`. A resource has `uri`
  (`reference://...`) and `mimeType` instead of `inputSchema` and `annotations`.
- **Manifest version** (`[runtime.js:createMcpRuntime]`): the runtime throws for a manifest whose
  `manifestVersion` is not `MANIFEST_VERSION`, naming both. A change to the manifest's shape that
  an older runtime would misread raises the version.
- **Exclusion** (`[manifest.js:buildMcpManifest]`): an operation is skipped when `x-internal` or
  `x-hidden` is `true` on it or its path item (unless `includeInternal`), when `deprecated` (unless
  `includeDeprecated`), or when it is a webhook.
- **Arguments.** Path, query, header and cookie parameters become properties by name (a clash
  across locations gets `_<in>`); path parameters are required. The request body is one `body`
  property with the first JSON content type's schema (else form-urlencoded, multipart, or the first
  listed). Swagger 2.0's `in: formData` parameters are the properties of one `body` sent as a form
  (`application/x-www-form-urlencoded`; `multipart/form-data` with a `type: file` parameter or
  when the operation consumes only that). Path-level parameters are merged unless the operation redefines them. Headers in
  `AUTH_TRANSPORT_HEADERS` and any parameter that matches an `apiKey` scheme's `in` and `name`
  are never arguments: the runtime sends them.
- **JSON Schema** (`[manifest.js:toJsonSchema]`): `$ref`s are inlined from the raw document;
  a schema met again on the same branch is cut to `{ type }`; `nullable` folds into `type`;
  `readOnly` properties (and their `required` entries) are dropped; OpenAPI 3.0 boolean
  `exclusiveMinimum/Maximum` become numbers; `example`, `xml`, `x-*` and other non-schema keys
  are dropped.
- **Naming** (`[common.js:operationToolName]`, `[common.js:assignToolNames]`): the operationId
  in snake_case, else (none, or no Latin letter or digit in it) `deriveToolName(method, path)`;
  workflow tools are `toSnakeCase(workflowId)`, after the operations. Names are valid and stable:
  at most 64 characters (a longer one is cut and ends in `_<hash>` of the whole name), and when
  several tools would share a name each of them ends in `_<hash>` of its own key (`GET /pets`,
  `workflow <id>`), so no name depends on document order or equals another tool's. The hash is
  `[runtime.js:shortHash]` (FNV-1a, 8 hex digits). `toolNamePrefix` is added before these rules.
  The server name is `toSnakeCase(title)`, `api_mcp_server` for a title with no Latin letter or
  digit. `sanitizeDescription` deletes every `_`. <rapi-doc>'s processed spec lists an operation
  once per tag; it becomes one tool.
- **Annotations**: `readOnlyHint` for GET; `idempotentHint` for GET, PUT and DELETE;
  `destructiveHint` (`destructiveHintFor`) true for PUT, PATCH and DELETE, false for GET, and left
  out for POST, which may add or undo: hosts then assume it may be destructive. A workflow tool is
  read-only when every step is a GET, destructive when any step is PUT, PATCH or DELETE (hint left
  out with a POST and none of those), never idempotent. `estimateTokenCost.consequentialCount` counts tools
  without `readOnlyHint`.
- **Resources**: opt-in only. An operation is a resource when it has `x-mcp-resource: true`, is a
  GET and has no required argument; it is also a tool, with all its parameters, because many
  hosts leave resources for the user to attach. No path makes an operation a resource.
- **Base URL** (`[manifest.js:baseUrlOf]`): the first server's URL with its variables' defaults
  (Swagger 2.0: `schemes`, `host`, `basePath`). A relative URL, or no server (OpenAPI's default
  is `/`), is resolved against `specUrl`, else against the page's address in a browser (as
  `<rapi-doc>` does); with neither, the source has no `baseUrl`. `buildRequest` throws for a
  source without an absolute base URL (manifest or `baseUrls`), so the call is an error result
  that names `MCP_BASE_URL`; nothing is ever sent to `http://localhost` by default.
- **Path arguments**: `buildRequest` percent-encodes them and rejects `.` and `..`, which URL
  parsing would resolve as dot segments.
- **Security.** `securitySchemes` keeps `type, description, in, name, scheme, bearerFormat,
  openIdConnectUrl` and OAuth 2 `flows`; Swagger 2.0 definitions are written as OpenAPI 3 schemes
  (`type: basic` is `{ type: "http", scheme: "basic" }`, OAuth 2's `flow` becomes `flows`); `<rapi-doc>`'s injected `_rapidoc_api_key` scheme is
  left out. A tool's `security` is the operation's, else the document's. The runtime uses the
  first alternative all of whose credentials are known; with none, nothing is sent when an
  alternative is empty, else the first alternative as far as credentials go. A workflow step's
  `x-security` credentials (`[runtime.js:applyStepSecurity]`), their values filled in by
  workflow-runtime.js for each request, are sent after those, in order, each replacing a header
  (any case), query parameter or cookie of the same name; one whose values are missing sends
  nothing. `[workflows.js:compileSecurity]` leaves out a workflow with an entry it cannot send
  (an unknown scheme name, HTTP Digest, missing values).
- **Runtime.** `runtime.js` imports nothing and uses only `fetch`, `URLSearchParams`,
  `TextEncoder` and `btoa`, and `workflow-runtime.js` imports only `./runtime.js`, because the
  project writer embeds their text (`?raw` imports, supported by Vite and
  `scripts/test-loader.mjs`). Path parameters are percent-encoded; array query values
  repeat the key; a query parameter with `allowReserved: true` (the OpenAPI parameter's, or a
  workflow step parameter's `x-allowReserved`, which overrides it) keeps RFC 3986 reserved
  characters unencoded, all but `#`, and comes after the others; objects elsewhere are JSON; `Accept: application/json` unless set; a missing path
  parameter is an error result, as is a transport failure or a non-2xx status (text `HTTP <status>`
  plus the body). JSON responses are pretty-printed and, for objects, also `structuredContent`.
- **Workflows the runtime runs** (`[workflows.js:compileWorkflows]`): steps that name an
  operation found in the sources, parameters in path, query, header or cookie, a request body
  with `payload` and `replacements`, simple criteria only (`regex`, `jsonpath` and `xpath` are
  reported), actions `end`, `goto` to a step and `retry` (`retryLimit` default 1, `retryAfter`
  seconds) with simple criteria, and `$inputs` / `$steps` expressions. Steps that call another
  workflow, actions that go to one, and `$workflows` expressions are reported. An `x-operation`
  step compiles to an operation with `url` (as written) and `source: ""` instead of a path; a
  relative URL, an unknown method, a path parameter without its `{name}` in the URL and an
  `x-security` `schemeName` are reported.
- **x-operation URLs** (`[runtime.js:externalUrl]`): workflow-runtime.js fills in the URL's
  expressions for each request; `buildRequest` sends to it (path parameters filled in, query
  appended, no source credentials) only when it is absolute http(s), and, when it was computed
  at run time, only on a host the workflow names (sources' base URLs, `baseUrls`, written-out
  x-operation URLs) or `externalHosts` lists (`"*"` any). `<rapi-flow>` passes `["*"]`; the
  exported `server.ts`, `rapidoc mcp serve` and `@rapidoc/server` read `MCP_EXTERNAL_HOSTS` through
  `[runtime.js:externalHostsFromEnv]`. A step's actions
  are its own `onSuccess` / `onFailure` followed by the workflow's it does not override by name.
  Criteria and actions are read with `../arazzo/actions.js`, as the diagram reads them.
- **Running a workflow** (`[workflow-runtime.js:runWorkflow]`): required inputs are checked first.
  Each step's parameters and payload are evaluated against `$inputs` and earlier steps' outputs
  (`resolveValue`: a whole-string expression keeps its type, `{$expr}` inside text is
  interpolated), the request is sent, and every criterion must hold (`evaluateCondition`: `==`,
  `!=`, `<`, `>`, `<=`, `>=`, `&&`, `||`, `!`, parentheses, quoted strings, numbers, `true`,
  `false`, `null`; `==` compares numbers and strings as text and treats a missing value as
  `null`). Inputs the caller leaves out get their `default` from the workflow's `inputs`
  schema, as a form would fill them; `required` is checked after that. A step without criteria succeeds on a 2xx response. The first action whose criteria all hold runs: on success
  `end` finishes, `goto` jumps, none falls through; on failure none or `end` fails the workflow
  (the result names the step, the criterion and the response), `goto` jumps, `retry` re-runs the
  step (or `stepId`) after `retryAfter` seconds up to `retryLimit` times. A transport error is a
  failure with no response. More step runs than `maxStepRuns` (1000 by default) is an error naming the last goto
  back to an earlier step, the usual cause ("it kept going back from checkPet to findAvailable
  (pickAnother)"); an aborted `signal` ends the run with an error before the next step, or cuts a
  retry's wait short. The result is the workflow's
  `outputs` as `structuredContent`; `onStepStart` gets `{ workflowId, stepId, attempt }` before
  each request and `onStep` gets `{ workflowId, stepId, attempt, outcome, request, response,
  outputs, failedCriterion, action }` after it.
- **Environment.** One rule for the exported `server.ts`, `rapidoc mcp serve` and
  `@rapidoc/server`'s `/mcp`: every variable has the `MCP_` prefix, and no other variable is read
  (`tests/unit/mcp-generator.test.js` reads through a recording environment). A scheme's
  credential is `MCP_AUTH_<SCHEME>` (`envNameFor("petstore_auth")` is `MCP_AUTH_PETSTORE_AUTH`);
  HTTP Basic is `MCP_AUTH_<SCHEME>_USERNAME` and `MCP_AUTH_<SCHEME>_PASSWORD`. There is no
  shortcut variable for "the one scheme". The base URL is `MCP_BASE_URL` for a manifest with one
  source and `MCP_BASE_URL_<SOURCE>` each for several (`MCP_BASE_URL` then throws, so one
  source's credentials never go to another's host); the host allow-list is `MCP_EXTERNAL_HOSTS`.
  Two scheme ids, or two source names, that give the same variable make `buildMcpManifest` throw
  (`[manifest.js:checkEnvNames]`). Credentials are keyed by scheme id: the same id in two sources
  is one credential.
- **Project.** `server.ts` and `runtime.js` are identical for every API; only `manifest.json`,
  `package.json`, `README.md` and `mcp.json` vary. The README and `mcp.json` name the exact
  variables (`hostEnvFor`), with the base URL variable marked required when the manifest has no
  base URL. The zip stores entries
  uncompressed with a fixed 1980-01-01 timestamp and UTF-8 names.

## Side Effects

- None in this folder: no network, DOM, storage or console. The exported `server.ts` reads
  `manifest.json`, the environment and stdio, and the runtime it calls makes HTTP requests.

## Verification

- `npm run test:unit` from the repo root. `tests/unit/mcp-generator.test.js` covers the manifest
  (from `sites/rapidoc/public/specs/petstore.yaml` and small documents), the schema converter, the runtime
  with a fake `fetch`, credentials from the environment, the project files and the zip.
  `tests/unit/mcp-workflows.test.js` covers compiling `sites/rapidoc/public/specs/petstore.arazzo.yaml`,
  expressions, conditions, and runs (outputs between steps, retry, goto, failure) with a fake
  `fetch`. `tests/unit/mcp-project.test.js` runs the exported project for real: it starts `server.ts`
  (through `scripts/test-loader.mjs` instead of `tsx`) under `.test-tmp/`, drives it with the MCP
  SDK's stdio client (`@modelcontextprotocol/sdk`, a root dev dependency) and points
  `MCP_BASE_URL` at `@rapidoc/mock` serving the same Petstore spec, workflow tools included.
- `/examples/mcp-server` on the docs site shows the manifest, `server.ts` and `runtime.js` and
  downloads the project. After editing, `npm run lint` and `npm run format-fix`.
