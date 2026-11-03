# `src/` — Custom Element Entry Points

## Overview

Source root of the `rapidoc` package. It owns the three custom elements and the bundle entry:
`rapidoc.ts` (`<rapi-doc>`, the full viewer), `rapidoc-mini.ts` (`<rapi-doc-mini>`, the embeddable
subset) and `oauth-receiver.ts` (`<oauth-receiver>`, the OAuth 2 return page). `index.js` is the
entry Vite builds into `dist/rapidoc-min.js`; `static/` is the second entry (`rapidoc/static`).
`rapi-flow.ts` (`<rapi-flow>`, the Arazzo workflow diagram) has its own entry, `flow.js`, built into
`dist/rapidoc-flow-min.js` (`rapidoc/flow`), so `rapidoc-min.js` carries no Arazzo code.

It does not own parsing, rendering or styling: a spec goes through `ProcessSpec`
([`utils/`](./utils/README.md)) into `this.resolvedSpec`, and `render()` hands it to
[`templates/main-body-template.js`](./templates/README.md), which composes
[`components/`](./components/README.md). Themes are in [`styles/`](./styles/README.md).

Dependents: page authors (attributes, methods, events), `@rapidoc/portal` and
`utils/bind-navbar.js` (navigation hooks), and the docs site, which renders the attribute, method
and event reference from `docs/src/page-data/rapidoc-api.yaml`.

## Interface

What `rapidoc-api.yaml` documents is the supported API, plus the portal hooks listed below. Every
other member is internal; templates call internal members freely through `this`.

- `index.js`: default export is the object `{ RapiDoc }` (not the class); named exports
  `RapiDocMini` and `OAuthReceiver`. Importing it registers all three elements.
- `<rapi-doc>` (`[rapidoc.ts:RapiDoc]`):
  - Documented methods: `loadSpec`, `scrollToPath`, `setApiKey`, `setHttpUserNameAndPassword`,
    `setApiServer`, `generateMcpServer`, `downloadMcpServer`, `getMcpBudget`.
  - Portal hooks: `bindNavBar(sidebar, options)`, `scrollTo(elementId)` (alias of `scrollToPath`;
    it shadows `Element.prototype.scrollTo`, so `el.scrollTo({ top })` does not scroll),
    `expandAndGotoOperation`, `getTargetElement`, `resolveOperationAlias`.
  - Events: `before-render` (from `ProcessSpec`, `detail: { spec }`); `spec-loaded` (`detail` is
    the live `resolvedSpec`; not bubbling); `nav-active-change` (`detail: { id, elementId,
    operationId? }`; bubbles, composed).
- `<rapi-doc-mini>` (`[rapidoc-mini.ts:RapiDocMini]`): `loadSpec`, `setApiKey`,
  `setHttpUserNameAndPassword`, `removeAllSecurityKeys`, `setApiServer`; event `spec-loaded`.
- `<oauth-receiver>` (`[oauth-receiver.ts:OauthReceiver]`): plain `HTMLElement` for the page named
  by the `oauth-receiver` attribute; relays the provider's reply to the opener.
- `<rapi-flow>` (`[rapi-flow.ts:RapiFlow]`): attributes `arazzo-url`, `spec-url` (replaces the
  first OpenAPI source's URL), `workflow-id` (defaults to the first workflow), `for` (id of a
  `<rapi-doc>`: clicking a step calls its `scrollToPath`), `show-docs` (`"false"` hides the inputs,
  outputs and step details under the diagram), `view` (`expanded`, the default, or `compact`;
  the header's Compact / Expanded switch sets it), `show-view-toggle` (`"false"` hides that
  switch), `theme`, `color-scheme`; method `load`; events `flow-loaded` (`detail: { doc,
  problems }`), `step-click` (`detail: { workflowId, stepId, operation, workflowRef }`) and
  `view-change` (`detail: { view }`, fired only by the switch), all bubbling and composed. The
  element does not store the chosen view; a page that wants it remembered listens for
  `view-change`. The legend lists only the kinds of lines the current diagram draws. Clicking a
  step also opens its entry in the step details; clicking a step that calls another workflow of
  the same document switches to it. Display only: it calls no API.

## Invariants

- **String flags.** Boolean-like attributes are the strings `"true"` / `"false"`, compared exactly,
  never by truthiness. `[rapidoc.ts:connectedCallback]` replaces an unknown enumerated value with a
  fixed fallback so templates can compare with `===`. `<rapi-doc-mini>` normalizes a smaller set
  (`[rapidoc-mini.ts:connectedCallback]`): its `layout` falls back to `row`, `sort-endpoints-by`
  has no `none`, and it does not move `theme="light|dark"` into `color-scheme`.
- **Rewrites in `<rapi-doc>`.** `theme="light"|"dark"` moves into `color-scheme`;
  `color-scheme="auto"` is resolved by `AutoColorSchemeController` before normalization; a missing
  or invalid `layout` is derived from `render-style` (`column` for `read`/`focused`, `row` for
  `view`) and written back, while an author-set `row`/`column` is kept; an empty `mcp` becomes
  `none`. The declared `mcp` default `"true"` is not a target, so the effective default is no MCP
  export.
- **Spec loading** (`[rapidoc.ts:loadSpec]`). Each load takes a token from `_specLoadSeq`; a load
  whose token is no longer current applies nothing (no `resolvedSpec`, no `loadFailed`, no
  `spec-loaded`), so the newest call wins. `connectedCallback` owns the initial load: an inlined
  `<script type="application/json" slot="rapidoc-spec">` wins over `spec-url`, and the `spec-url`
  value present at connect is then skipped by `attributeChangedCallback`. An inlined spec that
  fails `JSON.parse` is ignored, with no fallback to `spec-url`. A falsy argument is ignored. On
  failure `loadFailed` is set and `resolvedSpec` cleared. `<rapi-doc-mini>` uses the same token
  but loads only from `attributeChangedCallback`.
- **`spec-loaded`** (`[rapidoc.ts:afterSpecParsedAndValidated]`) fires once per applied load, after
  `updateComplete` resolves true in a loop; `updated()` must not set a reactive property on every
  cycle, or the event never fires. Initial navigation follows: `location.hash`, else `goto-path`,
  else (focused mode) `overview` or the first operation.
- **Server selection.** `default-api-server` equal to `server-url` selects the added server;
  otherwise the spec server with that `url`; otherwise `resolvedSpec.servers[0]`.
- **Section ids.** Operation ids come from `OperationSlugger` (`utils/slugger.js`);
  `[rapidoc.ts:getTargetElement]` also accepts a `data-op-slug`, a `<tag>--<op>` suffix or a
  method+path alias. `nav-active-change.detail.id` is the alias-resolved request in `scrollToPath`
  and the observed section's DOM id in `onIntersect`; consumers should not assume the two agree.
- **Auto height.** Scroll handling treats the element as page-scrolled when `auto-height="true"`
  or the attribute is present with any value.
- **DSD hydration** (`[rapidoc.ts:_clearDsdIfNeeded]`). With a pre-rendered shadow root, `render()`
  returns `noChange` until `resolvedSpec` is set, then replaces all shadow children before Lit's
  first render.
- **`<oauth-receiver>`** does no validation; `templates/security-scheme-template.js` in the opener
  checks `state`, origin and source and must stay the sole validator.

## Side Effects

- Importing `index.js` defines `rapi-doc`, `rapi-doc-mini` and `oauth-receiver` globally, and
  evaluates `utils/markdown-utils.js`, which configures the global `marked`.
- `<rapi-doc>` `connectedCallback` sets inline size and margin on a zero-size parent `<body>`; adds
  one capturing `hashchange` listener and first-interaction listeners on `window` (both removed on
  disconnect). Programmatic scrolls add temporary `scroll` / `scrollend` listeners.
- `[rapidoc.ts:render]` clones the page `<link>` whose `href` contains `css-file` (passed through
  `CSS.escape`) into the shadow root on each render.
- `history.replaceState` rewrites the hash on navigation only when `update-route="true"`.
- `mock-server="true"` makes `utils/mock-interceptor.js` replace `window.fetch` and
  `XMLHttpRequest` methods page-wide; disconnect restores them only when the flag is still `"true"`.
- `AutoColorSchemeController` observes `<html>`/`<body>` and a `matchMedia` query while
  `color-scheme="auto"`, removed on disconnect.
- `downloadMcpServer` creates a Blob URL and a temporary `<a>`; the file input uses `FileReader`.
- `console.error` on load or parse failure (not for superseded loads); `console.warn` when
  `scroll-container` is not an ancestor.
- `<rapi-flow>` fetches `arazzo-url` and each OpenAPI source description (relative to the Arazzo
  URL); a source that fails to load becomes a warning, not an error.
- `<oauth-receiver>` clears its URL with `history.replaceState`, posts the reply to
  `window.opener` (when set) with `location.origin` as target, and to
  `BroadcastChannel("rapidoc-oauth")` when that global exists.

## Verification

- `npm run test:unit` (repo root; tests in `tests/unit/`): `spec-load-sequence.test.js` (load
  tokens, inlined spec first, one load per `spec-url`), `semantic-markup.test.js` and
  `static-renderer.test.js` (static render path). These run in Node, not a browser.
- `npm run test:e2e` / `npm run test:component` run the elements in a browser, e.g.
  `tests/e2e/dynamic-attributes.test.js`, `scroll-offset.test.js`, `color-scheme-auto.test.js`,
  `sections-routing.test.js`.
- After changes: `npm run build:rapidoc`, `npm run lint`, `npm run format-fix`.
