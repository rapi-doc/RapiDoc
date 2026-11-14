# @rapidoc/portal

## 0.2.0

### Patch Changes

- 5066e13: `<rapi-doc>` and `<rapi-doc-mini>` choose which operations to show with one attribute, `filter-operations`, replacing `match-paths`, `match-type` and `remove-endpoints-with-badge-label-as` (removed). Terms are operationIds, `GET /path`, paths, `*` / `**` path globs, `tag:`, `badge:` and `deprecated`, with `!` to leave out; shown operations keep the order of the first term they match. Matching is exact: a v12 `match-paths` prefix becomes a glob (`/pet/**`). `@rapidoc/prerender` takes `filterOperations` in place of `matchPaths`, `matchType` and `removeEndpointsWithBadgeLabelAs`, and the portal's `{% api-operation %}` tag uses `filter-operations`. See the v12 to v13 migration guide.
- 3777ceb: `<rapi-flow>`: a step's values are grouped under Path params, Query params, Header params, Cookie params and Request body (with its content type) headings, body fields without the `body.` prefix, and a value from an earlier step reads `← from <step>.<output>`; gotos and retries draw lines from their action line (a goto's labelled with its name, a retry's with "retry 3× @ 2s", looping back into its step); an end action is an END pill, red on failure and green on success; the outputs box reads `<output> ← <step>.<output>` like a step's values, without the From step column; actions a step inherits from the workflow are tagged "Inherited" in violet, and the compact view draws their goto and retry lines too, a retry loop around the height of its step; neither view draws lines for values passed between steps any more (each value names its step), the compact view lists each step's values under the same headings as the expanded view, lines have rounded corners, and the On success / On failure headings say when they apply ("if all checks pass", "if any check fails"), and a step with no failure action shows the default, an outlined END pill marked "(default)". The diagram has no legend any more (next-step arrows are green like gotos on success, gotos on failure red, retries orange, and every goto or retry line is labelled), which also fixes the portal's `{% workflow %}` tag failing the build on a workflow with a retry; a literal value reads `const`, as Arazzo calls it. An action's `→` is in the color of what it leads to (orange retry, green on success, red on failure), and the `←` before a value from a step in the step color. A workflow run in `<rapi-flow>` has a Stop button and stops after 50 steps, saying which goto it kept going round; the MCP workflow runtime takes `maxStepRuns` and an AbortSignal (`signal`) for the same. The run log starts with the inputs the run was given, its entries show a bordered + / − to unfold and fold them, and the Mock Response Status section says how to use it and starts folded. A colored dot on the step box marks where each goto or retry line leaves it. In `<rapi-doc>`, the menu button of narrow layouts is a smaller button with a drawn icon that turns into an × while the menu is open, and the open menu casts a shadow over the content. While `mock-server="true"`, `<rapi-doc>`'s button reads "TRY (Mock)", and `<rapi-flow>`'s reads "Run workflow (Mock) →" while its tied `<rapi-doc>` mocks; the run button ends in → instead of starting with ▶. `<rapi-flow>` has a new `server-is-mock` attribute for runs against a mock server (`rapidoc mock`, Prism); Mock Response Status shows only when a mock answers, the tied `<rapi-doc>`'s or that server. `<rapi-flow>`'s header puts the workflow picker (or id) and the view switch on one row, above the summary and description. `<rapi-doc>`'s `show-side-nav` takes `floating`: the menu button and slide-over menu at every width, so the content takes the whole width. A `<rapi-flow>` diagram shrinks to fit a narrow pane only down to 85%, then scrolls, so its text stays readable; `renderArazzoWorkflow` takes `minScale` for the same. `<rapi-flow>` has a new `allow-arazzo-url-load` attribute: a box to load any Arazzo document by URL, with a tied `<rapi-doc>` loading its first OpenAPI source. A URL that fails to load keeps the current document and `<rapi-doc>`, with the error under the box; without the box, the document's URL shows as text above the diagram. `<rapi-flow>` has `mcp` and `mcp-server-name` attributes and an Export MCP Server button: an MCP server with one tool per workflow, across every API source of the Arazzo document, and no tool per operation (`generateMcpServer()` / `downloadMcpServer()` from code). `<rapi-doc>`'s `downloadMcpServer({ includeOperations: false })` names its file `<server-name>-workflows-mcp.zip`. The Arazzo URL box, and `<rapi-doc>`'s spec URL and filter boxes in its header, no longer show the browser's autocomplete history, and keep their colors when a browser autofills them. The MCP workflow runtime fills in inputs the caller left out from their `default`, as the run form does. The diagram's first box lists the document's API sources (`sourceDescriptions`: name, type, URL) above the inputs, and the flow graph has them as `sources`. `renderFlowDiagram` takes `stepClasses` to add classes to step boxes by step id. The diagram and the MCP workflow compiler read criteria and actions with the same code, so they agree on which actions apply. The run panel's buttons, inputs and selects use `<rapi-doc>`'s control styles (`.btn` sizes and variants), and compact step boxes are at least as wide as expanded ones. A `<rapi-doc>` or `<rapi-doc-mini>` with no spec (no `spec-url`, nothing loading) shows a hint after a moment (`Set spec-url, or call loadSpec()`, part `no-spec`) instead of a blank.
- Updated dependencies [5066e13]
- Updated dependencies [3777ceb]
  - rapidoc@13.0.0
  - @rapidoc/prerender@0.2.0
  - @rapidoc/mcp@0.2.0

## 0.1.7

### Patch Changes

- 3927554: `rapidoc dev` and `rapidoc build` no longer print `The collection "i18n" does not exist or is empty` on every run. The portal now defines Starlight's i18n collection, with an empty English entry that changes no interface text.
- 53ac5d2: Links and clickable values follow one style. Links in descriptions use the theme's accent instead of blue, with a quiet underline that turns solid on hover and focus; other links (contact, license, external docs) are underlined on hover. Allowed values and examples that fill a parameter are compact accent links with a dotted underline, and plain text when Try is off. A new `--primary-text` token (`--primary-text-dark`, `--primary-text-light`) is the accent as readable text, computed for every theme and for a hex `primary-color`. In the portal, links in guides keep an underline, but a quiet one that turns solid on hover.
- 20cd0f1: `RAPIDOC_MCP=off` turns off the MCP endpoint of `rapidoc serve`: no `/mcp` and no agent tokens, and the user menu hides its "connect an AI agent" section. `on` is the default; any other value stops the server, so a typo can't leave `/mcp` on. `rapidoc serve` says `MCP: off` when it starts.
- Updated dependencies [53ac5d2]
  - rapidoc@12.3.0
  - @rapidoc/prerender@0.1.7
  - @rapidoc/mcp@0.1.7

## 0.1.6

### Patch Changes

- 3d9a081: `.mdx` pages can import your own Astro components and modules from the project with a relative path, such as `import Hello from '../components/Hello.astro'`. These imports failed before, because the portal builds from a copy of `docs/`. Importing a React, Vue or Svelte component stops the build with an error that names the page and the import.
- @rapidoc/mcp@0.1.6
  - @rapidoc/prerender@0.1.6

## 0.1.5

### Patch Changes

- 3e15e56: A closed `site.banner` stays closed after a reload and on later visits, until its message or link changes. Before, it came back on every reload.
- ef165dc: API reference pages use `<rapi-doc>`'s own `scale="default"` instead of `lg`. Body text and headings keep the portal's sizes; code, descriptions and small labels are 1–2px smaller (code 13px instead of 15px). Set `scale: lg` under `rapidoc:` to keep the previous sizes.
- 918988a: The "On this page" rail bends with rounded curves at nested headings, and its highlight covers every section on screen, growing, shrinking and gliding along the rail as the page scrolls instead of jumping (no animation with reduced motion).
- Updated dependencies [7f698d8]
- Updated dependencies [5931b08]
- Updated dependencies [11e945c]
- Updated dependencies [2ddb480]
- Updated dependencies [6283526]
- Updated dependencies [0095bb9]
  - rapidoc@12.1.2
  - @rapidoc/prerender@0.1.5
  - @rapidoc/mcp@0.1.5

## 0.1.4

### Patch Changes

- c109c23: A portal without `navigation:` builds again: its default sidebar (every page in `docs/`) uses the group format current Starlight versions require.
- 98c5872: Uses Starlight 0.42.10.
- @rapidoc/mcp@0.1.4
  - @rapidoc/prerender@0.1.4

## 0.1.3

### Patch Changes

- fa36d7d: `{% api-operation %}` takes `collapsed=true`: the embed shows only the operation's method and path, and opens when the reader clicks it.
- Updated dependencies [691aeff]
- Updated dependencies [9deb938]
  - rapidoc@12.1.1
  - @rapidoc/prerender@0.1.3
  - @rapidoc/mcp@0.1.3

## 0.1.2

### Patch Changes

- @rapidoc/mcp@0.1.2
  - @rapidoc/prerender@0.1.2
