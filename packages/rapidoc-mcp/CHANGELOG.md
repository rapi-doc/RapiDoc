# @rapidoc/mcp

## 1.0.0

### Major Changes

- aa3c878: RapiDoc and its family, in sync: RapiDoc Portal and the RapiDoc CLI (with the server, the mock, the prerenderer, the MCP builder and `create-rapidoc`), the integration contract (`@rapidoc/embed`) and RapiDoc for Hono, Express and Fastify were reviewed end to end together with `rapidoc` 15 and are 1.0.0, a new start for the family. The same names for the same things, one sidebar from `<rapi-doc>` to the portal, and safer defaults everywhere; names that were wrong or unclear were corrected once, with no old spellings kept: the portal site's "Upgrading from 0.2 to 1.0" page lists every change. From here they follow semver: a breaking change to the config, the CLI, the integration contract or an integration's options comes only in a new major version.

### Patch Changes

- aa3c878: `rapidoc/flow` (`<rapi-flow>`) is 41 KB smaller (283 KB to 242 KB minified, 89 KB to 76 KB gzipped): Arazzo documents are now read with `js-yaml`, half the size of `yaml`. Values are read the same way (YAML 1.2, merge keys, no dates); a tag the reader does not know keeps its plain value, and stray control characters are dropped. `@rapidoc/mcp` depends on `js-yaml` in place of `yaml`, and `@rapidoc/prerender` on both. OpenAPI specs are read as before. In `rapidoc-min.js`, the syntax highlighter no longer carries grammars for Astro, Svelte, Vue, Objective-C, Perl, R and TOML. The first three are drawn as HTML and Objective-C as C; Perl, R and TOML code shows as plain text.
- aa3c878: MCP servers read their settings from `MCP_` variables only, the same in an exported server, `rapidoc mcp serve` and the `/mcp` endpoint of `rapidoc serve`: a security scheme's credential is `MCP_AUTH_<SCHEME>` (`MCP_AUTH_<SCHEME>_USERNAME` and `MCP_AUTH_<SCHEME>_PASSWORD` for HTTP Basic), the base URL is `MCP_BASE_URL` (`MCP_BASE_URL_<SOURCE>` each when a server has several APIs) and the host allow-list is `MCP_EXTERNAL_HOSTS`. The old names (`<SCHEME>`, `API_KEY`, `API_BASE_URL`, `EXTERNAL_HOSTS`) are no longer read, so a scheme called `token` or `path` can no longer send `$TOKEN` or `$PATH` to an API, and two schemes that would share a variable stop the export with a message. Tool names are now always valid and stable: at most 64 characters, never empty for a non-Latin `operationId`, and a name two operations share ends in a short hash of the operation instead of `_2`, so reordering the spec renames nothing. Every operation is a tool with all its parameters; a `GET` becomes an MCP resource as well only with `x-mcp-resource: true`, no longer because of its path. Swagger 2.0 specs get HTTP Basic for `type: basic` and a form body for `formData` parameters. A spec with a relative server URL or none is resolved against the address it was loaded from; read from a file, the manifest has no base URL, `rapidoc mcp export` and `rapidoc mcp serve` say that one is required, and a tool call without one fails with that message instead of calling `http://localhost`. The runtime refuses a manifest version it does not know, `<rapi-doc>`'s `mcp` attribute shows the export button for `true` only, and `@rapidoc/mcp` no longer exports `parseMcpEnabled`.

## 0.2.6

No changes in this release.

## 0.2.5

No changes in this release.

## 0.2.4

### Patch Changes

- a84c379: `mock-server-status-code` takes the strategy in front of the codes (`random:200, 500`, `cycle:503, 503, 200`), also per operation in its JSON map, and a list without a prefix is now used in turn (`cycle`) instead of always answering its first code; each operation's cycle starts again when the codes change. `mock-server-status-strategy` (now defaulting to `cycle`) and its `first` value are deprecated. In RapiFlow, an Arazzo step's `x-mock-server-status-code` prefills its Mock Response Status field, each field takes the same prefix, and the separate "in turn / at random" select is gone.

## 0.2.3

No changes in this release.

## 0.2.2

No changes in this release.

## 0.2.1

### Patch Changes

- 69f5544: Workflow runs and MCP tools honor `allowReserved` on OpenAPI query parameters, and `<rapi-flow>` supports the `x-allowReserved` extension of Arazzo (as Redocly Respect defines it) on a step's query parameter: reserved characters such as `:` and `/` in the value are sent unencoded (all but `#`).
- 69f5544: `<rapi-flow>` supports the `x-operation` extension of Arazzo (as Redocly Respect defines it): a step that calls a URL outside the workflow's API sources, written out or taken from an input or an earlier step's response. The diagram draws it dashed with an "external" tag; runs and MCP exports call it. In an exported MCP server, a URL computed at run time goes only to a host the workflow names, unless `EXTERNAL_HOSTS` (or the runtime's `externalHosts` option) allows more.
- 69f5544: `<rapi-flow>` supports the `x-security` extension of Arazzo (as Redocly Respect defines it): credentials on a workflow or a step, naming a scheme of the OpenAPI source or defining one inline (API key, HTTP Basic, bearer), with values from inputs or earlier steps. Runs and MCP exports send them; the diagram lists them under Security without showing secrets; inputs with `format: password` get a password field and are masked in the run log.
- 69f5544: `rapidoc mcp serve` and `rapidoc serve` read `EXTERNAL_HOSTS`, as the exported MCP server does: the hosts, comma-separated (`*` for any), that a workflow step's `x-operation` URL computed at run time may call besides those the workflow names. `@rapidoc/mcp` exports `externalHostsFromEnv`.
- d6837bc: MCP export: safer defaults and a host configuration that works as copied.

  - The host configuration file in the export is now `mcp.json` (was `claude_desktop_config.json`): the same `mcpServers` entry, under a name that is not tied to one app.
  - `mcp.json` gives `server.ts` an absolute path (a placeholder to replace in the browser export; the real path from `rapidoc mcp export`). A host starts the server from its own directory, so the relative path was not found.
  - `POST` tools no longer carry `destructiveHint: false`: the hint is left out, so hosts assume the tool may be destructive and can ask first.
  - `API_KEY` is a fallback only when the API has one security scheme. With several, each scheme needs its own variable, so one key is never sent as every scheme's credential.
  - A path argument of `.` or `..` is rejected, since URL parsing would resolve it to another path.
  - A server name that already ends in `-mcp` downloads as `<name>.zip`, not `<name>-mcp.zip` twice over (`my-api-mcp-mcp.zip`).
  - `/status` is no longer treated as reference data, and `x-mcp-resource: true | false` on an operation decides whether it is a resource or a tool.

## 0.2.0

### Patch Changes

- 3777ceb: `<rapi-flow>`: a step's values are grouped under Path params, Query params, Header params, Cookie params and Request body (with its content type) headings, body fields without the `body.` prefix, and a value from an earlier step reads `← from <step>.<output>`; gotos and retries draw lines from their action line (a goto's labelled with its name, a retry's with "retry 3× @ 2s", looping back into its step); an end action is an END pill, red on failure and green on success; the outputs box reads `<output> ← <step>.<output>` like a step's values, without the From step column; actions a step inherits from the workflow are tagged "Inherited" in violet, and the compact view draws their goto and retry lines too, a retry loop around the height of its step; neither view draws lines for values passed between steps any more (each value names its step), the compact view lists each step's values under the same headings as the expanded view, lines have rounded corners, and the On success / On failure headings say when they apply ("if all checks pass", "if any check fails"), and a step with no failure action shows the default, an outlined END pill marked "(default)". The diagram has no legend any more (next-step arrows are green like gotos on success, gotos on failure red, retries orange, and every goto or retry line is labelled), which also fixes the portal's `{% workflow %}` tag failing the build on a workflow with a retry; a literal value reads `const`, as Arazzo calls it. An action's `→` is in the color of what it leads to (orange retry, green on success, red on failure), and the `←` before a value from a step in the step color. A workflow run in `<rapi-flow>` has a Stop button and stops after 50 steps, saying which goto it kept going round; the MCP workflow runtime takes `maxStepRuns` and an AbortSignal (`signal`) for the same. The run log starts with the inputs the run was given, its entries show a bordered + / − to unfold and fold them, and the Mock Response Status section says how to use it and starts folded. A colored dot on the step box marks where each goto or retry line leaves it. In `<rapi-doc>`, the menu button of narrow layouts is a smaller button with a drawn icon that turns into an × while the menu is open, and the open menu casts a shadow over the content. While `mock-server="true"`, `<rapi-doc>`'s button reads "TRY (Mock)", and `<rapi-flow>`'s reads "Run workflow (Mock) →" while its tied `<rapi-doc>` mocks; the run button ends in → instead of starting with ▶. `<rapi-flow>` has a new `server-is-mock` attribute for runs against a mock server (`rapidoc mock`, Prism); Mock Response Status shows only when a mock answers, the tied `<rapi-doc>`'s or that server. `<rapi-flow>`'s header puts the workflow picker (or id) and the view switch on one row, above the summary and description. `<rapi-doc>`'s `show-side-nav` takes `floating`: the menu button and slide-over menu at every width, so the content takes the whole width. A `<rapi-flow>` diagram shrinks to fit a narrow pane only down to 85%, then scrolls, so its text stays readable; `renderArazzoWorkflow` takes `minScale` for the same. `<rapi-flow>` has a new `allow-arazzo-url-load` attribute: a box to load any Arazzo document by URL, with a tied `<rapi-doc>` loading its first OpenAPI source. A URL that fails to load keeps the current document and `<rapi-doc>`, with the error under the box; without the box, the document's URL shows as text above the diagram. `<rapi-flow>` has `mcp` and `mcp-server-name` attributes and an Export MCP Server button: an MCP server with one tool per workflow, across every API source of the Arazzo document, and no tool per operation (`generateMcpServer()` / `downloadMcpServer()` from code). `<rapi-doc>`'s `downloadMcpServer({ includeOperations: false })` names its file `<server-name>-workflows-mcp.zip`. The Arazzo URL box, and `<rapi-doc>`'s spec URL and filter boxes in its header, no longer show the browser's autocomplete history, and keep their colors when a browser autofills them. The MCP workflow runtime fills in inputs the caller left out from their `default`, as the run form does. The diagram's first box lists the document's API sources (`sourceDescriptions`: name, type, URL) above the inputs, and the flow graph has them as `sources`. `renderFlowDiagram` takes `stepClasses` to add classes to step boxes by step id. The diagram and the MCP workflow compiler read criteria and actions with the same code, so they agree on which actions apply. The run panel's buttons, inputs and selects use `<rapi-doc>`'s control styles (`.btn` sizes and variants), and compact step boxes are at least as wide as expanded ones. A `<rapi-doc>` or `<rapi-doc-mini>` with no spec (no `spec-url`, nothing loading) shows a hint after a moment (`Set spec-url, or call loadSpec()`, part `no-spec`) instead of a blank.

## 0.1.7

No changes in this release.

## 0.1.6

No changes in this release.

## 0.1.5

No changes in this release.

## 0.1.4

No changes in this release.

## 0.1.3

No changes in this release.

## 0.1.2

No changes in this release.
