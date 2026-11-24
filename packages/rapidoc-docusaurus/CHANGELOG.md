# @rapidoc/docusaurus

## 0.2.0

### Minor Changes

- 22b7bd6: For `rapidoc` 15: the API pages get its new three-level sidebar and keyboard support. Requires `rapidoc` 15, `@rapidoc/embed` 1 and `@rapidoc/prerender` 1.

### Patch Changes

- aa3c878: `<rapi-doc>` 15 clean-up. Removed: the `scrollTo(elementId)` method (use `scrollToPath`; `scrollTo` is the browser's own method again), `mock-server-status-strategy` (write the strategy in front of the codes: `mock-server-status-code="random:200, 500"`), `theme="light"` and `theme="dark"` (use `color-scheme`), `default-schema-tab="model"` (use `schema`), `mcp="none"` (use `false`), the hidden "Operations" sidebar row with its part `section-navbar-operations-top`, and `loading`, `focusedElementId`, `searchVal` and `advancedSearchMatches` as attributes. `nav-active-change` has one detail from every source, `{ elementId, type, operationId? }`: `id` is gone, `type` is `operation`, `tag` or `section`, and `operationId` is the spec's own operationId. `persist-auth` saves keys per API (by spec URL, else title), so two APIs on one site no longer share a token; keys saved by v14 are not carried over, and saved keys are applied once per spec load, so a key set with `setApiKey` on `spec-loaded` stays. Relative server URLs (`api/v1`, `../v2`, `/v1`) resolve against the spec's address. Fixed: the mock stays on after the element is moved in the page; OAuth with a scheme name that has a dot or starts with a digit; the Authentication section with a server URL such as `//host` or `{scheme}://host`; `css-file` copied once instead of on every render; the header's local file button reads YAML and reports a file it cannot read. The sidebar follows right-to-left pages, strikes deprecated operations through, and applies `nav-item-overflow` to description headings. The API reference, types and schema no longer list removed attributes; the docs have a "Removed attributes" page instead. `@rapidoc/starlight` and `@rapidoc/docusaurus` read `detail.elementId` only.

  The sidebar is usable with a keyboard and a screen reader: every item is a real link (so it is announced as one, opens in a new tab with a middle click, and shows its address), a tag's arrow is a separate button that answers Enter and Space, the current item is marked with `aria-current`, and the menu button of narrow layouts says whether the menu is open and Escape closes it. The look, class names and CSS parts are unchanged.

- Updated dependencies [aa3c878]
- Updated dependencies [aa3c878]
- Updated dependencies [aa3c878]
- Updated dependencies [f0c81ab]
- Updated dependencies [aa3c878]
- Updated dependencies [aa3c878]
- Updated dependencies [aa3c878]
- Updated dependencies [aa3c878]
- Updated dependencies [aa3c878]
  - @rapidoc/embed@1.0.0
  - rapidoc@15.0.0
  - @rapidoc/prerender@1.0.0

## 0.1.2

### Patch Changes

- Updated dependencies [43a6655]
- Updated dependencies [a6748e6]
  - rapidoc@14.0.0
  - @rapidoc/prerender@0.2.2
  - @rapidoc/embed@0.3.2

## 0.1.1

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
  - @rapidoc/prerender@0.2.0
  - @rapidoc/embed@0.3.1

## 0.1.0

### Minor Changes

- 5c535eb: New package `@rapidoc/docusaurus`: API reference pages in a Docusaurus site. A plugin reads your OpenAPI documents, a `RapidocReference` component draws the page inside your theme, and `rapidocSidebarSync` lists the API's operations for `sidebars.js`.

### Patch Changes

- Updated dependencies [5c535eb]
- Updated dependencies [5c535eb]
  - @rapidoc/embed@0.3.0
