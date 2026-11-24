# @rapidoc/cli

## 1.0.0

### Major Changes

- aa3c878: RapiDoc and its family, in sync: RapiDoc Portal and the RapiDoc CLI (with the server, the mock, the prerenderer, the MCP builder and `create-rapidoc`), the integration contract (`@rapidoc/embed`) and RapiDoc for Hono, Express and Fastify were reviewed end to end together with `rapidoc` 15 and are 1.0.0, a new start for the family. The same names for the same things, one sidebar from `<rapi-doc>` to the portal, and safer defaults everywhere; names that were wrong or unclear were corrected once, with no old spellings kept: the portal site's "Upgrading from 0.2 to 1.0" page lists every change. From here they follow semver: a breaking change to the config, the CLI, the integration contract or an integration's options comes only in a new major version.

### Patch Changes

- aa3c878: `rapidoc lint` has fifteen more rules. Mistakes that break Try and the mock: `no-ambiguous-paths`, `operation-parameters-unique`, `path-not-include-query`, `no-enum-type-mismatch` (errors by default), `no-path-trailing-slash`, `no-empty-servers`, `no-server-trailing-slash`, `no-required-undefined-properties` and `description-html-removed`, which reports HTML in a description that the reference removes (warnings). Conventions, off by default: `operation-singular-tag`, `tags-alphabetical`, `no-http-verbs-in-paths`, and three that need no setting because they hold names to the casing most of the spec already uses: `property-casing-consistent`, `parameter-casing-consistent` and `operationId-casing-consistent`.
- aa3c878: MCP servers read their settings from `MCP_` variables only, the same in an exported server, `rapidoc mcp serve` and the `/mcp` endpoint of `rapidoc serve`: a security scheme's credential is `MCP_AUTH_<SCHEME>` (`MCP_AUTH_<SCHEME>_USERNAME` and `MCP_AUTH_<SCHEME>_PASSWORD` for HTTP Basic), the base URL is `MCP_BASE_URL` (`MCP_BASE_URL_<SOURCE>` each when a server has several APIs) and the host allow-list is `MCP_EXTERNAL_HOSTS`. The old names (`<SCHEME>`, `API_KEY`, `API_BASE_URL`, `EXTERNAL_HOSTS`) are no longer read, so a scheme called `token` or `path` can no longer send `$TOKEN` or `$PATH` to an API, and two schemes that would share a variable stop the export with a message. Tool names are now always valid and stable: at most 64 characters, never empty for a non-Latin `operationId`, and a name two operations share ends in a short hash of the operation instead of `_2`, so reordering the spec renames nothing. Every operation is a tool with all its parameters; a `GET` becomes an MCP resource as well only with `x-mcp-resource: true`, no longer because of its path. Swagger 2.0 specs get HTTP Basic for `type: basic` and a form body for `formData` parameters. A spec with a relative server URL or none is resolved against the address it was loaded from; read from a file, the manifest has no base URL, `rapidoc mcp export` and `rapidoc mcp serve` say that one is required, and a tool call without one fails with that message instead of calling `http://localhost`. The runtime refuses a manifest version it does not know, `<rapi-doc>`'s `mcp` attribute shows the export button for `true` only, and `@rapidoc/mcp` no longer exports `parseMcpEnabled`.
- aa3c878: Clean-up before 1.0, with no old names kept. Markdoc tags: `{% api-operation %}` takes the API's id as `api` (was `spec`), `{% workflow %}` takes the `workflows:` entry's id as `document` (was `file`), `{% tab %}` takes `label` only (`name` is gone), and `{% card-grid columns=N %}` now sets the number of columns (1 to 4, default 3; it was ignored and always 2). An old attribute fails the build as an unknown attribute. `@rapidoc/portal` no longer exports the unused second Markdoc renderer (`compileMarkdoc`, `compileDocFile`, `createMarkdocConfig`, `markdocTags`, `extractHeadings`, the `./markdoc` subpath) or `searchRecords`; `resolveConfig` replaces `normalizeConfig` as the config helper. The header and footer for a page with its own document are imported under their real names, `@rapidoc/portal/components/PortalPageHeader.astro` and `PortalPageFooter.astro` (were `PortalHeader.astro` and `PortalFooter.astro`), and the paths the build's workspace imports moved under `@rapidoc/portal/internal/`. Without `site.url`, pages no longer get a canonical link and a sitemap on the placeholder domain `developer.portal`: a build has neither and prints one note that both need `site.url`. `rapidoc migrate` takes the project folder (`rapidoc migrate [dir]`) and `--force` / `-f`; when `rapidoc.config.yaml` exists and it cannot ask (no terminal, or `--yes`), it stops unless `--force` is given. `@rapidoc/cli` has an `exports` field: it is a command, and none of its files can be imported. New portals from `create-rapidoc` and `rapidoc init` use the new attribute names.
- aa3c878: Security fixes. `@rapidoc/server`: the sign-in cookie, which `/_rapidoc/auth/login` gives any visitor, was accepted as a session, opening pages for all signed-in readers without signing in (pages limited to groups or emails were not affected); every sealed cookie and token now has one use. The server also refuses a build whose `protected/` folder has no `rapidoc-server.json`, needs a public URL (`site.url` or `RAPIDOC_PUBLIC_URL`) to sign readers in anywhere but `localhost`, limits request bodies, and sends `frame-ancestors` (`RAPIDOC_FRAME_ANCESTORS`), referrer and HSTS headers. `rapidoc` and `@rapidoc/prerender`: HTML in descriptions is reduced to a fixed list of elements and attributes, in every browser and in pre-rendered pages, where it was not sanitized at all; `javascript:` addresses from a spec are no longer links; a spec value can no longer pass for a template in the prerenderer. `rapidoc build` refuses an output folder that is, holds or is inside a source folder (`--out-dir public` emptied `public/`). `rapidoc mock` and `rapidoc dev` listen on `localhost` by default (`--host 0.0.0.0` for a container or a shared server; `dev` has `--host` now), and the mock takes an imported spec only from a program on its machine or its own page, never from another site's page or through a proxy, and does not let it read other local files.
- aa3c878: Clean-up of the server's and the mock's JavaScript API and a few behaviours before 1.0. `createApp()` and `startServer()` of `@rapidoc/server` return a `summary` (mode, paths, public URL, issuer, client ID, `providerReady`, counts of protected files and zones, MCP tools) in place of the internal `settings` object and the separate `mcp` value, so no secret can be read from what they return; `loadSettings` is no longer exported. `rapidoc serve` now starts when the sign-in provider is down: public pages are served, sign-in ends on the sign-in error page, and the server finds the provider again when a reader signs in; a wrong issuer still stops the start. `/_rapidoc/access/check` no longer tells a signed-out reader which paths exist, and the server's log has the reader's id only, not the email. `@rapidoc/mock` exports only `createMockApp`, `startMockServer` and `DEFAULT_PORT`; neither function returns the token `verifier` any more, and the helpers `rapidoc lint` uses (`exampleError`, `configFor`, `statefulFindings`, `statefulReport`) moved to `@rapidoc/mock/internal`, which is not public API (`tokenScopes`, `CONTROL_PREFIX`, `CONFIG_FILE`, `STATEFUL_RULES`, `ImportError` and `isLocalCaller` are gone from the entry). In the mock, a `security` requirement that names a scheme the spec does not define now answers 401 (it was left open) with a warning at start, each API keeps at most 1000 `X-Mock-Session` sessions (the one used longest ago is dropped first), and a malformed percent-escape in a `/__mock` path answers 400, not 500.
- Updated dependencies [aa3c878]
- Updated dependencies [aa3c878]
- Updated dependencies [f0c81ab]
- Updated dependencies [aa3c878]
- Updated dependencies [57367d1]
- Updated dependencies [708f82e]
- Updated dependencies [7c9a56d]
- Updated dependencies [aa3c878]
- Updated dependencies [aa3c878]
- Updated dependencies [543ef8d]
- Updated dependencies [aa3c878]
- Updated dependencies [aa3c878]
- Updated dependencies [aa3c878]
- Updated dependencies [aa3c878]
  - rapidoc@15.0.0
  - @rapidoc/mcp@1.0.0
  - @rapidoc/server@1.0.0
  - @rapidoc/portal@1.0.0
  - create-rapidoc@1.0.0
  - @rapidoc/mock@1.0.0

## 0.2.6

### Patch Changes

- Updated dependencies [e18c68f]
- Updated dependencies [085fd99]
- Updated dependencies [c140a01]
- Updated dependencies [384844c]
- Updated dependencies [daa38ee]
- Updated dependencies [dff1c76]
- Updated dependencies [420a5ad]
- Updated dependencies [5389026]
- Updated dependencies [23aad8f]
- Updated dependencies [05c59b1]
- Updated dependencies [e18c68f]
- Updated dependencies [c7e7a4a]
  - rapidoc@14.2.1
  - @rapidoc/portal@0.2.6
  - @rapidoc/server@0.2.6
  - create-rapidoc@0.2.6
  - @rapidoc/mock@0.2.6
  - @rapidoc/mcp@0.2.6

## 0.2.5

### Patch Changes

- Updated dependencies [c138d53]
- Updated dependencies [6f8e0f7]
- Updated dependencies [6f8e0f7]
  - @rapidoc/mock@0.2.5
  - create-rapidoc@0.2.5
  - @rapidoc/mcp@0.2.5
  - @rapidoc/portal@0.2.5
  - @rapidoc/server@0.2.5

## 0.2.4

### Patch Changes

- 09b4d92: `rapidoc lint` has two rules for examples, both `warn` by default. `example-named-map` reports a media type's `example` that is a map of named examples (`example: { "Calendar": { ... } }`), which belongs under `examples`. `example-matches-schema` reports request and response examples that do not fit their schema; it reads schemas with `@rapidoc/mock`, and where that package is not installed the rule is skipped and lint says so.
- 3b12e51: `rapidoc lint --stateful` reads `mock.config.yaml` (beside the spec or in the folder, or `--mock-config <file>`): what you have stated there, a resource's key or an operation's action, is no longer reported. An entry of the file that no longer fits the spec is reported as `mock-config`. The file is read only when a `stateful-*` rule is on.
- 82c16a8: `rapidoc lint --stateful` reports what the stateful mock (`rapidoc mock --stateful`) had to assume about a spec or could not map, at its place in the spec: a resource without a visible key, a list filter that matches no field, a write that fits no resource, a reference to a resource the spec doesn't have, records described by an inline schema, and other assumptions about operations. These are seven `stateful-*` rules, off by default; `--stateful` turns six on as warnings, and each can be set by name. They need `@rapidoc/mock` installed.
- dd4fae4: The lint engine can summarise a result: its rules are grouped into categories (names and URLs, documentation, responses, examples, security, housekeeping, mock state), with the errors and warnings of each and the share of checks that passed. The Rapi Mock site's spec check shows it; `rapidoc lint` prints what it printed before.
- 9526d92: `rapidoc lint` has three new rules, all warnings by default: `parameter-description` (a parameter without a description), `response-error-schema` (a 4xx or 5xx response that should say what went wrong but has no schema; 401, 403, 404 and a few others may go without) and `schema-oneof-discriminator` (a `oneOf` or `anyOf` between object schemas with nothing to tell them apart). A spec that passed `--strict` may now fail it: turn a rule off with `--rule <name>=off` or `lint.rules` in the config.
- 89c3d74: `rapidoc mock --stateful` reads `mock.config.yaml` beside the spec: your corrections to what the mock worked out. `resources.<Name>.key` names a resource's key, and a dotted path such as `metadata.name` reaches inside the record; `operations.<id>` sets an operation's `resource`, `action` and where its `key` comes from (`path.x`, `query.x`, `body.x`), or `action: none`. With several APIs the sections go under `apis.<api id>`. An entry that no longer fits the spec is skipped and named when the mock starts. `--mock-config <file>` names another file.
- 609632a: `rapidoc mock` has its own endpoints under `/__mock`, for tests in any language: `GET /__mock/health` (ready check), and with `--stateful` `POST /__mock/reset` (back to the seed data), `GET /__mock/state` (the stored records, down to one record), `POST /__mock/snapshot` and `POST /__mock/restore` (save the records and put them back, or load data a test wrote). They follow the `X-Mock-Session` header. An API can no longer have the id `__mock`.
- 90d213f: `rapidoc mock` serves OpenAPI 3.2 `QUERY` operations and the methods under `additionalOperations` (`PURGE`, `COPY`, ...): routed, validated, listed in `Allow` on a 405 and allowed by CORS. It warns at start about a method Node's HTTP server can't receive.
- 90d213f: `rapidoc mock` loads OpenAPI 3.2 specs and streams `itemSchema` responses (Server-Sent Events, JSON Lines, JSON Text Sequences) one item at a time, `--stream-interval` apart (default 300 ms): the example's items (`dataValue` lists and `serializedValue` text are read), else five generated items with numbered ids. JSON Lines request bodies are checked line by line against their `itemSchema`.
- 3d4aa05: `rapidoc mock` takes a spec's http(s) address as well as a file: `rapidoc mock https://example.com/orders-api.yaml` serves it under `/orders-api`, read once at start, with the files its relative `$ref`s name on the same server. An address on `localhost` or a private network works when you name it (your API server's own `/openapi.json`); a `$ref` from a spec to such an address is still refused. The Mock UI's header also stays on one row on any screen wider than a phone's.
- 6147dd3: `rapidoc mock --stateful` keeps state for more operations: lists and creates under a parent path (`/grants/{grant_id}/calendars`), and operations that return a part of the record's schema (a list of `calendar_common` where a read returns `calendar`). Paging, sorting and field-selection parameters such as `page_token`, `orderBy` and `select` no longer mark a list for review.
- e6f9abc: `rapidoc mock --stateful` keeps a record under the parent its path names, also when the record has no field for it: a comment created at `/articles/{slug}/comments` is listed and found under that article only. Seeded records of such a resource start under a few of the seeded parents, not under every one.
- 4f09606: `rapidoc mock --stateful` seeds more readable records. Schemas written with `allOf` now get named values, sequential ids and every enum value, as other schemas do. A field with a `pattern` gets a readable value when one fits (a person's name in a pattern for names). Records after the first follow the shape of a field's example where the schema says no more: a date, digits, an id of the same form, a number of that size, or the example itself for a short value such as a status.
- b2fb27e: `rapidoc mock --stateful` keeps data like a real server: it works out resources, keys and relations from the spec, seeds each resource with records (`--rows`, default 10) whose references point at each other, and then creates, updates and deletes change stored records that reads and lists return, in the response shape the spec defines. Operations that fit no resource answer as before. An `X-Mock-Session` header gives a caller its own copy of the data.
- 9a964fb: The Mock UI has detail pages. A resource's About tab shows its fields with how each is seeded ("a first name", "the id of an Owner record", "shaped like the example"), its links to other resources, the operations on it, and generates a sample record without storing it. An operation's Details page says what the mock does for it in a sentence, what it uses each parameter for, what the request and each response hold, and shows a sample response. The same is available as JSON under `GET /__mock/model/<api>/resources/<Resource>` (and `/sample`) and `GET /__mock/model/<api>/operations/<id>`.
- 79e51fb: The Mock UI has a Lint section and a Lint card on its Dashboard: what `rapidoc lint --stateful` finds in the spec, with the share of checks that passed, the categories and rules, and every finding, each view with its own address. `rapidoc mock --stateful` lints a spec when the page first asks; the result is also at the new control endpoint `GET /__mock/lint/<api id>`. `createMockApp` takes the linter as its `lint` option (the mock has no lint rules of its own), and `/__mock/settings` says whether there is one.
- 9d8672f: The Mock UI (`/__mock/ui`) is now an app with a sidebar: a Dashboard per API, Resources, Operations (grouped by path or by resource) and Settings, each with its own address. Settings makes new seed data with another number of records or seed, and sets a response delay. `rapidoc mock --delay <ms>` waits before every API response; `GET` and `PATCH /__mock/settings` read and change it while the mock runs, and `POST /__mock/reset` with `{ "rows": 25, "seed": 7 }` makes new seed data.
- b745c60: `rapidoc mock --stateful` serves a Mock UI at `/__mock/ui`: per API, the resources with their records in a table you can filter and sort, and every operation with its label (stateful, needs review with the reason, static), plus a reset button and a session field. `GET /__mock/model` returns the same as JSON.
- Updated dependencies [5f050fe]
- Updated dependencies [90d213f]
- Updated dependencies [cc15663]
- Updated dependencies [09b4d92]
- Updated dependencies [3b12e51]
- Updated dependencies [82c16a8]
- Updated dependencies [90d213f]
- Updated dependencies [705116b]
- Updated dependencies [89c3d74]
- Updated dependencies [dcecc2c]
- Updated dependencies [609632a]
- Updated dependencies [316c279]
- Updated dependencies [ffdf370]
- Updated dependencies [90d213f]
- Updated dependencies [90d213f]
- Updated dependencies [3d4aa05]
- Updated dependencies [6147dd3]
- Updated dependencies [e6f9abc]
- Updated dependencies [4f09606]
- Updated dependencies [b2fb27e]
- Updated dependencies [a84c379]
- Updated dependencies [90d213f]
- Updated dependencies [bf984c7]
- Updated dependencies [9a964fb]
- Updated dependencies [79e51fb]
- Updated dependencies [34b2a83]
- Updated dependencies [34b2a83]
- Updated dependencies [9d8672f]
- Updated dependencies [b956bb0]
- Updated dependencies [f1d276f]
- Updated dependencies [b745c60]
- Updated dependencies [93c5415]
- Updated dependencies [5f050fe]
- Updated dependencies [90d213f]
- Updated dependencies [90d213f]
- Updated dependencies [90d213f]
- Updated dependencies [90d213f]
- Updated dependencies [90d213f]
- Updated dependencies [90d213f]
- Updated dependencies [90d213f]
- Updated dependencies [90d213f]
- Updated dependencies [90d213f]
  - rapidoc@14.2.0
  - rapipdf@3.0.1
  - @rapidoc/mock@0.2.4
  - @rapidoc/mcp@0.2.4
  - create-rapidoc@0.2.4
  - @rapidoc/portal@0.2.4
  - @rapidoc/server@0.2.4

## 0.2.3

### Patch Changes

- Updated dependencies [98324b0]
- Updated dependencies [0bf29c6]
- Updated dependencies [94dccbd]
- Updated dependencies [c291fe9]
  - rapidoc@14.1.0
  - @rapidoc/portal@0.2.3
  - create-rapidoc@0.2.3
  - @rapidoc/mcp@0.2.3
  - @rapidoc/mock@0.2.3
  - @rapidoc/server@0.2.3

## 0.2.2

### Patch Changes

- f4364a5: New command `rapidoc pdf <spec>`: writes the API reference of a spec as a PDF (a cover page, a table of contents, the security schemes and every operation), the document `<rapi-pdf>` makes in the browser. Options choose the sections, the schema style, title, footer, colors, labels (`--labels`, for another language) and fonts (`--font`, for text Roboto has no glyphs for). It needs `rapipdf` 3 installed next to the CLI.
- Updated dependencies [43a6655]
- Updated dependencies [f4364a5]
- Updated dependencies [a6748e6]
  - rapidoc@14.0.0
  - rapipdf@3.0.0
  - @rapidoc/portal@0.2.2
  - create-rapidoc@0.2.2
  - @rapidoc/mcp@0.2.2
  - @rapidoc/mock@0.2.2
  - @rapidoc/server@0.2.2

## 0.2.1

### Patch Changes

- 69f5544: `rapidoc mcp serve` and `rapidoc serve` read `EXTERNAL_HOSTS`, as the exported MCP server does: the hosts, comma-separated (`*` for any), that a workflow step's `x-operation` URL computed at run time may call besides those the workflow names. `@rapidoc/mcp` exports `externalHostsFromEnv`.
- d6837bc: MCP export: safer defaults and a host configuration that works as copied.

  - The host configuration file in the export is now `mcp.json` (was `claude_desktop_config.json`): the same `mcpServers` entry, under a name that is not tied to one app.
  - `mcp.json` gives `server.ts` an absolute path (a placeholder to replace in the browser export; the real path from `rapidoc mcp export`). A host starts the server from its own directory, so the relative path was not found.
  - `POST` tools no longer carry `destructiveHint: false`: the hint is left out, so hosts assume the tool may be destructive and can ask first.
  - `API_KEY` is a fallback only when the API has one security scheme. With several, each scheme needs its own variable, so one key is never sent as every scheme's credential.
  - A path argument of `.` or `..` is rejected, since URL parsing would resolve it to another path.
  - A server name that already ends in `-mcp` downloads as `<name>.zip`, not `<name>-mcp.zip` twice over (`my-api-mcp-mcp.zip`).
  - `/status` is no longer treated as reference data, and `x-mcp-resource: true | false` on an operation decides whether it is a resource or a tool.

- Updated dependencies [69f5544]
- Updated dependencies [69f5544]
- Updated dependencies [69f5544]
- Updated dependencies [bccc7a7]
- Updated dependencies [69f5544]
- Updated dependencies [d6837bc]
  - rapidoc@13.1.0
  - @rapidoc/mcp@0.2.1
  - @rapidoc/server@0.2.1
  - create-rapidoc@0.2.1
  - @rapidoc/mock@0.2.1
  - @rapidoc/portal@0.2.1

## 0.2.0

### Patch Changes

- Updated dependencies [5066e13]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [3777ceb]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
- Updated dependencies [2a645cc]
  - rapidoc@13.0.0
  - @rapidoc/portal@0.2.0
  - @rapidoc/mcp@0.2.0
  - create-rapidoc@0.2.0
  - @rapidoc/mock@0.2.0
  - @rapidoc/server@0.2.0

## 0.1.7

### Patch Changes

- 20cd0f1: `RAPIDOC_MCP=off` turns off the MCP endpoint of `rapidoc serve`: no `/mcp` and no agent tokens, and the user menu hides its "connect an AI agent" section. `on` is the default; any other value stops the server, so a typo can't leave `/mcp` on. `rapidoc serve` says `MCP: off` when it starts.
- Updated dependencies [3927554]
- Updated dependencies [53ac5d2]
- Updated dependencies [20cd0f1]
- Updated dependencies [7cbc0b6]
  - @rapidoc/portal@0.1.7
  - rapidoc@12.3.0
  - @rapidoc/server@0.1.7
  - create-rapidoc@0.1.7
  - @rapidoc/mcp@0.1.7
  - @rapidoc/mock@0.1.7

## 0.1.6

### Patch Changes

- Updated dependencies [3d9a081]
- Updated dependencies [ae8e490]
  - @rapidoc/portal@0.1.6
  - @rapidoc/server@0.1.6
  - create-rapidoc@0.1.6
  - @rapidoc/mcp@0.1.6
  - @rapidoc/mock@0.1.6

## 0.1.5

### Patch Changes

- Updated dependencies [f823eae]
- Updated dependencies [7f698d8]
- Updated dependencies [5931b08]
- Updated dependencies [11e945c]
- Updated dependencies [3e15e56]
- Updated dependencies [ef165dc]
- Updated dependencies [2ddb480]
- Updated dependencies [918988a]
- Updated dependencies [6283526]
- Updated dependencies [0095bb9]
  - create-rapidoc@0.1.5
  - rapidoc@12.1.2
  - @rapidoc/portal@0.1.5
  - @rapidoc/mcp@0.1.5
  - @rapidoc/mock@0.1.5
  - @rapidoc/server@0.1.5

## 0.1.4

### Patch Changes

- Updated dependencies [c109c23]
- Updated dependencies [98c5872]
  - @rapidoc/portal@0.1.4
  - create-rapidoc@0.1.4
  - @rapidoc/mcp@0.1.4
  - @rapidoc/mock@0.1.4
  - @rapidoc/server@0.1.4

## 0.1.3

### Patch Changes

- Updated dependencies [691aeff]
- Updated dependencies [fa36d7d]
- Updated dependencies [9deb938]
  - rapidoc@12.1.1
  - @rapidoc/portal@0.1.3
  - create-rapidoc@0.1.3
  - @rapidoc/mcp@0.1.3
  - @rapidoc/mock@0.1.3
  - @rapidoc/server@0.1.3

## 0.1.2

### Patch Changes

- Updated dependencies [dd8998d]
  - create-rapidoc@0.1.2
  - @rapidoc/mcp@0.1.2
  - @rapidoc/mock@0.1.2
  - @rapidoc/portal@0.1.2
  - @rapidoc/server@0.1.2
