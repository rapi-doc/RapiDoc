# MCP Extraction Library

## Overview

The language-independent half of RapiDoc's MCP (Model Context Protocol) server generator.
`common.js` turns an OpenAPI document into lists of MCP tools, resources and workflows, honoring
the `x-mcp` extension and its aliases, estimates their token cost, and builds host configuration
snippets.

Not owned here: the per-language code emitters ([`./generators/`](./generators/README.md)) and
the entry point that wires the two together, `src/utils/mcp-generator.js`, which `<rapi-doc>`
(`src/rapidoc.ts`, `src/templates/downloads-template.js`) uses for its MCP server download.

`common.js` has no imports and does not touch the browser or `<rapi-doc>`.

## Interface

- `AUTH_TRANSPORT_HEADERS`: lowercase header names never exposed as tool parameters.
- `VALID_MCP_TARGETS`, `VALID_TARGET_SET`, `MCP_TARGET_LABELS`: the six target ids and their
  display names.
- `parseMcpTargets(val) -> string[]`: normalizes an array, JSON-array string or comma list to
  valid, de-duplicated target ids; `"none"` or `"false"` anywhere returns `[]`; no wildcards.
- `toSnakeCase`, `toPascalCase`, `toCamelCase`: identifier helpers shared with the generators.
- `sanitizeDescription(text, maxLength = 300)`: strips HTML and Markdown and truncates.
- `deriveToolName(method, path)`: fallback tool name from method and path segments.
- `extractParameters(pathObj, xMcp)`: one operation's parameters and request-body properties as
  flat `{ name, in, type, description, required, default, ... }` items.
- `extractMcpOperations(parsedSpec, options) -> { metadata, tools, resources, workflows }`:
  accepts the `ProcessSpec` result (`tags[].paths[]`) or a raw OpenAPI object; `options` are
  `includeInternal` and `includeDeprecated`.
- `estimateTokenCost(tools, resources, workflows)`: totals, an estimated token count,
  `consequentialCount` and warnings.
- `generateHostConfigs(serverName, options) -> { claudeDesktopConfig, cursorConfig }`:
  `mcpServers` JSON whose command depends on `options.target`.

## Invariants

- **Exclusion** (`[common.js:extractMcpOperations]`): an operation is skipped when
  `x-mcp.enabled === false` or `x-mcp.type === "skip"`, when `x-internal` / `x-hidden` is `true`
  (unless `includeInternal`), when `deprecated === true` (unless `includeDeprecated`), or when it
  is a webhook. Extension flags (`x-mcp`, falling back to `x-mcp-tool`; `x-internal`,
  `x-hidden`, `x-speakeasy-name-override`, `x-openai-isConsequential`) are read from
  `rawOperation`; `deprecated`, `operationId`, `summary`, `description`, `parameters` and
  `requestBody` from the operation object itself.
- **Classification**: a resource when `x-mcp.type === "resource"`, or when the operation is a
  `get` with no required parameter, `x-mcp.type !== "tool"`, and a path matching one of a fixed
  list of reference-data segments (`/reference`, `/status`, `/schema`, ...); otherwise a tool.
- **Naming**: `toSnakeCase` of `x-mcp.name`, `x-speakeasy-name-override`, `operationId` or
  `deriveToolName`, in that order. Duplicates are not renamed.
- **`isConsequential`**: `x-mcp.requireConfirmation`, then `x-openai-isConsequential`, then
  `true` for `post`, `put`, `delete` and `patch` and `false` otherwise.
- **Auth stripping** drops only `in: "header"` parameters named in `AUTH_TRANSPORT_HEADERS`.
- **Order** follows tag order then path order (object key order in raw mode); nothing is sorted.
- **Shape handed to generators**: tool `method` is upper-case; parameters never carry `items`;
  `in` is whatever the spec used; `workflows` is `x-mcp-workflows` from the spec root (or `[]`),
  passed through unvalidated.
- `estimateTokenCost` reads `name`, `description` and `parameters` of every tool and `uri` of
  every resource without guards, so items must come from `extractMcpOperations`.
- `sanitizeDescription` deletes every `_` (`user_id` becomes `userid`).

## Side Effects

- None: no network, DOM, storage or console. Exported constants are shared module state that the
  code never mutates. `estimateTokenCost` warning text uses `toLocaleString()`.

## Verification

- `npm run test:unit` from the repo root. `tests/unit/mcp-generator.test.js` covers extraction,
  naming, token cost and host configs through `src/utils/mcp-generator.js`.
- After editing, `npm run lint` and `npm run format-fix`.
