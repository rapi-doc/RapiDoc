# RapiDoc Utilities

## Overview

Framework-free helpers behind the `<rapi-doc>` component (`src/rapidoc.ts`), its templates and
the static renderer (`rapidoc/static`, `src/static/`). `utils/` owns the spec pipeline (load,
dereference, group, anchor), schema rendering and example generation, request/response/mock
helpers, and UI helpers (highlighting, Markdown, sanitizing, navbar binding, color, OAuth). It
does not own rendering (`templates/`, `components/`) or styles. The MCP manifest, runtime and
project writer are documented in [`./mcp/README.md`](./mcp/README.md); Arazzo parsing and workflow diagrams in
[`./arazzo/README.md`](./arazzo/README.md).

Everything except `arazzo/` is bundled into `dist/rapidoc-min.js`; `arazzo/` goes into
`dist/rapidoc-flow-min.js` and `rapidoc/static`. `@rapidoc/portal` depends on this folder
indirectly through `rapidoc/static` (`methodPathSlug`, `operationAnchorSource`, `toKebabCase`)
and the anchors `<rapi-doc>` emits, so anchor generation is public behavior.
Several modules run in Node (static renderer, unit tests) and must guard `window`/`document`.

## Interface

Spec pipeline:

- `spec-parser.js`: default `ProcessSpec` (spec URL, text or object to the render model of
  tags, tag groups, components, security schemes, servers); `isTagExpanded`, `groupByTagGroups`.
- `slugger.js`: `OperationSlugger` (`slug`, `slugOp`, `slugTag`, `slugTagGroup`, `reset`),
  `operationAnchorSource`, `methodPathSlug`, `toKebabCase`, `clampWordBoundary`, `createSlugger`.
- `common-utils.js`: search (`advancedSearch`, `getMatchedPaths`), `debounce`, `sleep`,
  clipboard and download helpers, `rapidocApiKey`.

Schema rendering:

- `schema-utils.js`: `getTypeInfo`, `schemaToAST` (schema tree for renderers),
  `schemaInObjectNotation` (older tree format), `schemaToSampleObj` and `generateExample`
  (examples), `json2xml`, `getMergedProperties`/`getMergedRequired`.

Request, response, mock:

- `url-utils.js`: path/query serialization, `constructFetchURL`, `oauthReceiverUrl`.
- `request-utils.js`: headers, url-encoded and multipart bodies.
- `response-utils.js`: `processFetchResponse` (decode a `Response`),
  `prepareResponseDefinitions`.
- `curl-utils.js`: `generateCurlCommand`.
- `mock-interceptor.js`: `enableMockServer`, `disableMockServer`, `updateMockConfig`,
  `isMockServerActive`, `compileRoutes` (from a `ProcessSpec` result).

UI helpers:

- `highlighter.js`: `highlightAllCode`, `scheduleHighlight` (CSS Custom Highlight API).
- `markdown-utils.js`: `configureMarkdown` and token helpers for the global `marked`.
- `sanitize.js`: `sanitizeHTML`.
- `bind-navbar.js`: `bindNavBar` ties a static `getNavBarHtml` sidebar to `<rapi-doc>`.
- `auto-color-scheme.js`: `AutoColorSchemeController`, `resolvePageColorScheme`.
- `oauth-utils.js`: PKCE (`randomUrlSafe`, `pkceChallenge`), `readOAuthReply`,
  `isExpectedOAuthReply`.
- `color-utils.js`, `xml-utils.js` (`formatXml`): pure helpers.
- `mcp-generator.js`: `generateMcpServer(spec, options) -> { manifest, files, budget, hostConfig }`,
  re-exporting `./mcp` (`buildMcpManifest`, `createMcpRuntime`, `writeMcpProject`, `createZip`,
  `parseMcpEnabled`, ...).

## Invariants

- **`ProcessSpec` never rejects** (`[spec-parser.js:ProcessSpec]`). Loading and post-load
  processing are each wrapped in `try/catch`. Every failure resolves to
  `{ specLoadError: true, isSpecLoading: false, info: { title, description, version }, tags: [],
  tagGroups: [] }`, where `description` is `"<url> ┃ Not Found (404)"`,
  `"Unable to load <url> ┃ <status|message>"`, `"Invalid Spec Definition"`, or
  `"Unable to process the spec ┃ <message>"` for failures after loading. Callers check
  `specLoadError`, not exceptions. It uses an optional `this` (`requestUpdate`,
  `before-render` event), so the component calls it with `.call(element, ...)`.
- **Webhooks** (`[spec-parser.js:groupByTags]`) are grouped after paths and flagged
  `isWebhook`; they are never written into the spec's `paths`, so a webhook named like a path
  does not replace it.
- **Stable anchors** (`[slugger.js:operationAnchorSource]`, `[slugger.js:OperationSlugger.slug]`):
  - Source priority: `operationId` (trimmed, 1-45 chars, not a placeholder like `operation12`),
    then `summary` (the parser passes `summary || description`; clamped to 40 chars at a word
    boundary), then `methodPathSlug(method, path)`.
  - Memoized per method + path (and tag slug), so one operation keeps one `elementId` per run.
  - Tag prefix `<tagSlug>--` is applied only when the spec has non-empty `x-tagGroups` or
    `x-tag-groups` (`[spec-parser.js:ProcessSpec]`), and never for the tag `general`.
  - Collisions try `<prefix><method>-<slug>` first, then `github-slugger`'s `-1`, `-2` suffixes,
    which depend on encounter order (paths, then webhooks; methods in `supportedMethods` order).
  - Tag and tag-group ids (`tag--<kebab>`, `tag-group--<kebab>`) are not deduplicated.
  - The portal links to these ids and checks them with `operationAnchorSource`/`methodPathSlug`;
    changing any rule above is a breaking change for published portals.
- **Circular references** (`[spec-parser.js:breakCircularRefs]`): after dereferencing, the tree
  is cloned without `x-ref` keys and each cycle becomes `{ $ref }` (fallback
  `#/components/schemas/Circular`); shared non-cyclic nodes stay shared. Schema code treats a
  remaining `$ref` as the cycle marker, so renderers must not recurse into it.
- **Schema depth limits** (`[schema-utils.js]`): `schemaToSampleObj` returns `undefined` and
  `schemaInObjectNotation` returns a `::type` stub when `level > 8`. `schemaToAST` expands to
  `MAX_SCHEMA_DEPTH` (8) and, while the tree exceeds `SCHEMA_NODE_BUDGET` (8000 nodes), retries
  with a smaller depth down to `MIN_SCHEMA_DEPTH` (4); cut containers become nodes with
  `truncated: true`. Its module state makes it synchronous and non-reentrant.
- **Sanitization** (`[sanitize.js:sanitizeHTML]`): non-strings return `""`. The native
  `Sanitizer` path allows all attributes; the fallback removes only `<script>`, `on*` attributes
  and `javascript:` / `data:text/html` in `href`/`src`. Without `DOMParser` (Node) the input is
  returned unchanged, so server-side output is not sanitized.
- **Mock server** (`[mock-interceptor.js:enableMockServer]`): repeated calls refresh routes and
  config but never stack wrappers; `disableMockServer` restores the originals. Unmatched
  requests fall through to the real `fetch`/XHR. Mock responses carry `X-Mock-Server: RapiDoc`.
- **Highlighter** (`[highlighter.js]`): `highlightAllCode` and `scheduleHighlight` are no-ops
  without `window` and `CSS.highlights`; highlighting never mutates the DOM.

## Side Effects

- `ProcessSpec` fetches the spec and external `$ref`s, logs load errors with `console.info`, and
  mutates the spec it processes: `x-ref` during dereference, `paths` replaced by `filterPaths`,
  `callbacks` filtered, relative `servers[*].url` prefixed with `location.origin`,
  `computedUrl` added.
- `mock-interceptor.js` replaces `window.fetch` and `XMLHttpRequest.prototype` methods while
  active and keeps routes and config in module state.
- `markdown-utils.js` configures the global `marked` at import time.
- `highlighter.js` writes the global `CSS.highlights` registry and schedules
  `requestAnimationFrame`.
- `bind-navbar.js` adds DOM and `window` listeners, writes `history`; some timers and the
  `spec-loaded` listener outlive `unbind()`.
- `auto-color-scheme.js` observes `<html>`/`<body>` attributes and `prefers-color-scheme`.
- `response-utils.js` creates object URLs it does not revoke; `common-utils.js` clipboard and
  download helpers create temporary elements.

## Verification

Run `npm run test:unit` from the repo root before and after changing `spec-parser.js` or
`schema-utils.js`, then `npm run lint` and `npm run format-fix`. Files in `tests/unit/`:

- `spec-parser.js`: `spec-parser-relative-url`, `spec-parser-security`,
  `spec-parser-tag-groups`, `spec-parser-webhooks`, `unused-tags`, `openapi-3-2-bookstore`.
- `slugger.js`: `slugger`.
- `schema-utils.js`: `schema-utils`, `schema-ast`, `schema-in-object-notation`,
  `schema-nullable`, `schema-modernization`, `multipart-form-curl`.
- `url-utils.js`: `query-param-serialization`, `oauth-receiver-url`.
- `request-utils.js`, `curl-utils.js`: `request-utils`, `multipart-part-types`, `curl-command`.
- `response-utils.js`: `api-request-response`.
- `mock-interceptor.js`, `oauth-utils.js`, `markdown-utils.js`, `mcp-generator.js`: the
  test file of the same name.
