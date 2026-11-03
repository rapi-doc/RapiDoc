# MCP Extraction Library

## Overview

The language-independent half of RapiDoc's MCP (Model Context Protocol) server generator.
`common.js` turns an OpenAPI document into lists of MCP tools and resources, estimates their token
cost, and builds host configuration snippets.

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
- `extractParameters(pathObj)`: one operation's parameters and request-body properties as
  flat `{ name, in, type, description, required, default, ... }` items.
- `extractMcpOperations(parsedSpec, options) -> { metadata, tools, resources }`:
  accepts the `ProcessSpec` result (`tags[].paths[]`) or a raw OpenAPI object; `options` are
  `includeInternal` and `includeDeprecated`.
- `estimateTokenCost(tools, resources)`: totals, an estimated token count,
  `consequentialCount` and warnings.
- `generateHostConfigs(serverName, options) -> { claudeDesktopConfig, cursorConfig }`:
  `mcpServers` JSON whose command depends on `options.target`.

## Invariants

- **Exclusion** (`[common.js:extractMcpOperations]`): an operation is skipped when
  `x-internal` / `x-hidden` is `true` (unless `includeInternal`), when `deprecated === true`
  (unless `includeDeprecated`), or when it is a webhook. `x-internal` and `x-hidden` are read from
  `rawOperation`; `deprecated`, `operationId`, `summary`, `description`, `parameters` and
  `requestBody` from the operation object itself.
- **Classification**: a resource when the operation is a `get` with no required parameter and a
  path matching one of a fixed list of reference-data segments (`/reference`, `/status`,
  `/schema`, ...); otherwise a tool.
- **Naming**: `toSnakeCase` of `operationId`, else `deriveToolName`. Duplicates are not renamed.
- **`isConsequential`**: `true` for `post`, `put`, `delete` and `patch`, `false` otherwise.
- **Auth stripping** drops only `in: "header"` parameters named in `AUTH_TRANSPORT_HEADERS`.
- **Order** follows tag order then path order (object key order in raw mode); nothing is sorted.
- **Shape handed to generators**: tool `method` is upper-case; parameters never carry `items`;
  `in` is whatever the spec used.
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
