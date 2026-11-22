# @rapidoc/prerender

## 0.2.6

No changes in this release.

## 0.2.5

No changes in this release.

## 0.2.4

### Patch Changes

- 5f050fe: `allow-try` takes the terms of `filter-operations` besides `true` and `false`: `allow-try="!deprecated !tag:pending-implementation"` keeps Try on only for the operations they select; the others keep their request documentation and show a disabled TRY DISABLED button (CSS part `btn-try-disabled`) with the reason next to it in grey, such as "Try is off for operations tagged pending-implementation" (part `try-disabled-reason`). `badge:` terms (in `filter-operations` and `allow-try`) also match OpenAPI 3.2 tags of `kind: badge`, by label or name.
- 90d213f: `--destructive` (errors, required markers, DEPRECATED labels) is `#f05050` on dark (it was `#ef4444`; `#f25a5a` with the cobalt theme and `#f98080` with amber, whose surfaces are lighter, so every dark theme keeps 4.5:1) and `#c81e1e` on light (it was `#dc2626`), which keeps 4.5:1 on the light themes' tinted cards. The Deprecated badge on security schemes uses `--destructive` too (it used `--method-delete`), like every other deprecation marker. The named badge colour `--red` (`x-badges` `color: red`) is `#f98080` on dark and `#c81e1e` on light.
- cc15663: Faster rendering of large specs: a schema's nested fields are built and rendered only when they are shown, so with `schema-expand-level` a collapsed field costs nothing until it is opened, and a response status's example and schema render only once that status is selected. The Stripe spec in read mode with `schema-expand-level="1"` now renders in under 5 seconds instead of over 20. Very large schemas are cut below depth 4 as they grow past the node budget, instead of being rebuilt shallower.
- 90d213f: The mock's badge in the API Server section reads MOCKING, with a pulsing light blue dot beside it (still when the reader prefers reduced motion); the "(Mocked)" note after the selected server is gone.
- a84c379: `mock-server-status-code` takes the strategy in front of the codes (`random:200, 500`, `cycle:503, 503, 200`), also per operation in its JSON map, and a list without a prefix is now used in turn (`cycle`) instead of always answering its first code; each operation's cycle starts again when the codes change. `mock-server-status-strategy` (now defaulting to `cycle`) and its `first` value are deprecated. In RapiFlow, an Arazzo step's `x-mock-server-status-code` prefills its Mock Response Status field, each field takes the same prefix, and the separate "in turn / at random" select is gone.
- 5f050fe: Sidebar items whose operation shows a badge (`x-badges`, or an OpenAPI 3.2 tag of `kind: badge`) get a small dot in the first badge's color, with the badges in its tooltip and accessible label: `show-badges-in-nav-bar`, `dot` by default, `false` to turn it off (CSS part `nav-badge-dot`). Badges with `color: none` are left out. `@rapidoc/prerender`'s `getNavBarHtml` draws the same dot (`showBadgesInNavBar`).
- 90d213f: OpenAPI 3.2: streamed bodies (`itemSchema` on Server-Sent Events, JSON Lines and JSON Text Sequences) show the schema of one item and the example as a stream, and Try shows a streamed response as it arrives, with a STOP button. Also shown: a response's `summary`, a server's `name`, deprecated security schemes, and XML `nodeType: element` wrapping arrays.
- 90d213f: OpenAPI 3.2 tags: a tag's `summary` is its name in the navigation, tags with a `parent` are grouped under it (as with `x-tagGroups`), tags of a `kind` other than `nav` no longer become sections (`badge` tags show as badges), and Example Objects' `dataValue` is shown as the example.
- 90d213f: Operation badges (`x-badges` and OpenAPI 3.2 `kind: badge` tags) use the shared badge style (2px radius, 4px padding, weight 500) in the badge's colour, with the same 15% tint in every render style; the base badge's padding, radius and weight change accordingly, and the unused `.badge-sm` and `.btn-destructive` styles are gone.
- 90d213f: `--green` takes the values of `--method-post` (`#68cc97` dark, `#047857` light). In RapiFlow, a step under the pointer or keyboard focus gets a grey border, so only the selected (or running) step has the accent border, and the next-step arrows are as thick as the action lines.
- 90d213f: RapiFlow's action labels on lines and its END pills are outlined instead of filled (a border in the action's colour, the surface behind them, text mixing the colour with the foreground), so they read at 4.5:1 or more on every theme in both colour schemes; a step's default END keeps a dashed border.
- 90d213f: The server selection's radio buttons are drawn by RapiDoc (a ring in `--muted-foreground`, `--primary` when selected), so they look the same in every browser and OS.
- 90d213f: Try shows where a request is: a status line ("Waiting for <url>… 3.4 s", "The server is taking a while" after 10 s, "Streaming… 3 events") with a spinner on the same line, and a CANCEL button (STOP for streams). A request that fails no longer leaves the ⌛ in the response; it says the server couldn't be reached (or blocked the page with CORS). The response area only ever holds what the server sent. CSS parts: `btn-stop` (was `btn-stop-stream`), `response-status-line`, `response-spinner`.
- 90d213f: XML examples name array items by the items' `xml.name` (else the property's name) instead of their index (`<0>`), also when the array or its items have an example; unwrapped arrays put the items directly in the parent element.

## 0.2.3

### Patch Changes

- 98324b0: New `amber` theme preset: an amber accent (`#f6a821`) over slate-grey surfaces, with lighter cards, a darker sidebar and white headings in dark mode, for a higher-contrast look; in light mode the accent is the orange `#ff791a`. Set it with `theme="amber"`.

## 0.2.2

### Patch Changes

- a6748e6: A schema that contains itself is marked as recursive at the property that refers back to it. In some specs the marker landed one level down, so the property was drawn as an object with a single `$ref` member.

## 0.2.1

### Patch Changes

- 69f5544: `<rapi-flow>` supports the `x-operation` extension of Arazzo (as Redocly Respect defines it): a step that calls a URL outside the workflow's API sources, written out or taken from an input or an earlier step's response. The diagram draws it dashed with an "external" tag; runs and MCP exports call it. In an exported MCP server, a URL computed at run time goes only to a host the workflow names, unless `EXTERNAL_HOSTS` (or the runtime's `externalHosts` option) allows more.
- 69f5544: `<rapi-flow>` supports the `x-security` extension of Arazzo (as Redocly Respect defines it): credentials on a workflow or a step, naming a scheme of the OpenAPI source or defining one inline (API key, HTTP Basic, bearer), with values from inputs or earlier steps. Runs and MCP exports send them; the diagram lists them under Security without showing secrets; inputs with `format: password` get a password field and are masked in the run log.
- bccc7a7: `x-badges` with `color: primary-color` are drawn in the theme's accent color again, instead of the default text color.

## 0.2.0

### Minor Changes

- 5066e13: `<rapi-doc>` and `<rapi-doc-mini>` choose which operations to show with one attribute, `filter-operations`, replacing `match-paths`, `match-type` and `remove-endpoints-with-badge-label-as` (removed). Terms are operationIds, `GET /path`, paths, `*` / `**` path globs, `tag:`, `badge:` and `deprecated`, with `!` to leave out; shown operations keep the order of the first term they match. Matching is exact: a v12 `match-paths` prefix becomes a glob (`/pet/**`). `@rapidoc/prerender` takes `filterOperations` in place of `matchPaths`, `matchType` and `removeEndpointsWithBadgeLabelAs`, and the portal's `{% api-operation %}` tag uses `filter-operations`. See the v12 to v13 migration guide.

### Patch Changes

- 2a645cc: The compact view of a workflow diagram lists only the values that carry data into a step, from the workflow's inputs or an earlier step; its constants are counted in one "+N const values in the expanded view" line, so compact boxes stay short.
- 2a645cc: The compact view of a workflow diagram (`<rapi-flow view="compact">`, and `{% workflow %}` diagrams in compact view) lists the actions that draw a line, its gotos and retries, under their On success / On failure heading, and each line leaves from its action row, so a line always says when it is taken. Ends, checks and outputs stay in the expanded view.
- 2a645cc: `<rapi-flow>` shows the Arazzo document's URL (the URL box with its Load button, or the URL as text) and the API sources it names in one card above the diagram (parts `document` and `sources`); the diagram's first box holds the workflow's inputs alone. `renderArazzoWorkflow` takes `showSources: false` to leave the sources out of the diagram; by default they are still listed above the inputs.
- 3777ceb: `<rapi-flow>`: a step's values are grouped under Path params, Query params, Header params, Cookie params and Request body (with its content type) headings, body fields without the `body.` prefix, and a value from an earlier step reads `← from <step>.<output>`; gotos and retries draw lines from their action line (a goto's labelled with its name, a retry's with "retry 3× @ 2s", looping back into its step); an end action is an END pill, red on failure and green on success; the outputs box reads `<output> ← <step>.<output>` like a step's values, without the From step column; actions a step inherits from the workflow are tagged "Inherited" in violet, and the compact view draws their goto and retry lines too, a retry loop around the height of its step; neither view draws lines for values passed between steps any more (each value names its step), the compact view lists each step's values under the same headings as the expanded view, lines have rounded corners, and the On success / On failure headings say when they apply ("if all checks pass", "if any check fails"), and a step with no failure action shows the default, an outlined END pill marked "(default)". The diagram has no legend any more (next-step arrows are green like gotos on success, gotos on failure red, retries orange, and every goto or retry line is labelled), which also fixes the portal's `{% workflow %}` tag failing the build on a workflow with a retry; a literal value reads `const`, as Arazzo calls it. An action's `→` is in the color of what it leads to (orange retry, green on success, red on failure), and the `←` before a value from a step in the step color. A workflow run in `<rapi-flow>` has a Stop button and stops after 50 steps, saying which goto it kept going round; the MCP workflow runtime takes `maxStepRuns` and an AbortSignal (`signal`) for the same. The run log starts with the inputs the run was given, its entries show a bordered + / − to unfold and fold them, and the Mock Response Status section says how to use it and starts folded. A colored dot on the step box marks where each goto or retry line leaves it. In `<rapi-doc>`, the menu button of narrow layouts is a smaller button with a drawn icon that turns into an × while the menu is open, and the open menu casts a shadow over the content. While `mock-server="true"`, `<rapi-doc>`'s button reads "TRY (Mock)", and `<rapi-flow>`'s reads "Run workflow (Mock) →" while its tied `<rapi-doc>` mocks; the run button ends in → instead of starting with ▶. `<rapi-flow>` has a new `server-is-mock` attribute for runs against a mock server (`rapidoc mock`, Prism); Mock Response Status shows only when a mock answers, the tied `<rapi-doc>`'s or that server. `<rapi-flow>`'s header puts the workflow picker (or id) and the view switch on one row, above the summary and description. `<rapi-doc>`'s `show-side-nav` takes `floating`: the menu button and slide-over menu at every width, so the content takes the whole width. A `<rapi-flow>` diagram shrinks to fit a narrow pane only down to 85%, then scrolls, so its text stays readable; `renderArazzoWorkflow` takes `minScale` for the same. `<rapi-flow>` has a new `allow-arazzo-url-load` attribute: a box to load any Arazzo document by URL, with a tied `<rapi-doc>` loading its first OpenAPI source. A URL that fails to load keeps the current document and `<rapi-doc>`, with the error under the box; without the box, the document's URL shows as text above the diagram. `<rapi-flow>` has `mcp` and `mcp-server-name` attributes and an Export MCP Server button: an MCP server with one tool per workflow, across every API source of the Arazzo document, and no tool per operation (`generateMcpServer()` / `downloadMcpServer()` from code). `<rapi-doc>`'s `downloadMcpServer({ includeOperations: false })` names its file `<server-name>-workflows-mcp.zip`. The Arazzo URL box, and `<rapi-doc>`'s spec URL and filter boxes in its header, no longer show the browser's autocomplete history, and keep their colors when a browser autofills them. The MCP workflow runtime fills in inputs the caller left out from their `default`, as the run form does. The diagram's first box lists the document's API sources (`sourceDescriptions`: name, type, URL) above the inputs, and the flow graph has them as `sources`. `renderFlowDiagram` takes `stepClasses` to add classes to step boxes by step id. The diagram and the MCP workflow compiler read criteria and actions with the same code, so they agree on which actions apply. The run panel's buttons, inputs and selects use `<rapi-doc>`'s control styles (`.btn` sizes and variants), and compact step boxes are at least as wide as expanded ones. A `<rapi-doc>` or `<rapi-doc-mini>` with no spec (no `spec-url`, nothing loading) shows a hint after a moment (`Set spec-url, or call loadSpec()`, part `no-spec`) instead of a blank.
- 2a645cc: `<rapi-doc>` (with `update-route`) and the portal's prerendered sidebar (`bindNavBar`) keep `history.state` when they rewrite the address hash. A single-page app's router (Vue Router, React Router) keeps its history data, such as scroll positions, and Vue Router no longer warns that `history.state` was replaced.

## 0.1.7

### Patch Changes

- 53ac5d2: Links and clickable values follow one style. Links in descriptions use the theme's accent instead of blue, with a quiet underline that turns solid on hover and focus; other links (contact, license, external docs) are underlined on hover. Allowed values and examples that fill a parameter are compact accent links with a dotted underline, and plain text when Try is off. A new `--primary-text` token (`--primary-text-dark`, `--primary-text-light`) is the accent as readable text, computed for every theme and for a hex `primary-color`. In the portal, links in guides keep an underline, but a quiet one that turns solid on hover.

## 0.1.6

No changes in this release.

## 0.1.5

### Patch Changes

- 5931b08: Try It sends object query parameters as their `style` and `explode` say: `pageNo=1&pageSize=20` for the default exploded `form`, `request=pageNo,1,pageSize,20` with `explode: false`, and `request[pageNo]=1` only for `style: deepObject` (before, every object was sent with brackets).
- 11e945c: `persist-auth="true"` keeps an OAuth access token across page reloads, until it expires (`expires_in`). Only the token is stored, never the client secret or Basic credentials.
- 2ddb480: With `default-schema-tab="schema"`, the tabs of request bodies, responses and object parameters read SCHEMA | EXAMPLE, the default tab first. Object parameters now also open on the `default-schema-tab` tab (before, they always opened on SCHEMA).
- 6283526: Parameters, form fields and schema trees and tables label a type the same way. A format that implies its type is shown in its place (`int64`, `date-time`). Any other format (`string` with `format: decimal`) keeps the type and is shown as **Format: decimal**. Types are colored by their declared type, so a string is never colored like a number.
- 0095bb9: Try It sends `application/x-www-form-urlencoded` bodies as the media type's `encoding` says, with the OpenAPI default (`style: form`, `explode: true`) when it says nothing: an array repeats its name (`tag=a&tag=b`, before `tag=a,b`), an object sends one field per property (`a=1`, before JSON), `explode: false` and the delimited and `deepObject` styles are followed, and `contentType: application/json` sends the field as JSON.

## 0.1.4

No changes in this release.

## 0.1.3

### Patch Changes

- 691aeff: Schemas with `allOf` show every field once: the schema's own `properties` and `required` next to `allOf` are no longer dropped (#1168), a property defined in several members is one row with the merged definition (#1169), and `allOf` wrapping a single composed schema keeps its fields (#1170).
- 9deb938: In the sidebar, a click on a tag's name goes to the tag and its description, and a click on its arrow expands or collapses it (#1166).

## 0.1.2

No changes in this release.
