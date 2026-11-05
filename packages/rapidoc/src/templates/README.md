# `src/templates` — `<rapi-doc>` render templates

## Overview

Lit `html` template functions, no classes. Each is called with `this` bound to its host, so
`this.*` is the host's reactive state and methods. `main-body-template.js` is the entry used by
`<rapi-doc>`, `<rapi-doc-mini>` and the static renderer (`@rapidoc/static`, `packages/rapidoc-static/src/`). Three files render inside
`<api-request>` (`src/components/`): `request-params-template.js`, `request-body-template.js`,
`api-response-template.js`.

Templates read `this.resolvedSpec` (built by `utils/spec-parser.js`) and compose the elements in
`src/components/`. They do not parse specs or define styles. The exception to "render only" is
`security-scheme-template.js`, which also owns API key and OAuth logic (token fetch, popup,
persistence).

## Interface

Default exports are section templates; named exports are helpers used by other templates or hosts.

- `mainBodyTemplate(isMini, pathsExpanded)`: page shell; picks layout from `this.renderStyle`.
- Sections: `headerTemplate`, `navbarTemplate`, `overviewTemplate`, `downloadsTemplate`,
  `serverTemplate`, `securitySchemeTemplate`, `endpointTemplate` (view mode),
  `expandedEndpointTemplate` (read mode), `focusedEndpointTemplate`, `componentsTemplate`,
  `callbackTemplate`, `codeSamplesTemplate`, `advancedSearchDialogTemplate`, `logoTemplate`.
- Used by hosts: `setApiServer` (`server-template.js`); `applyApiKey`, `onClearAllApiKeys`,
  `recoverPersistedApiKeys` (`security-scheme-template.js`); `expandedEndpointBodyTemplate`
  (static renderer); navbar helpers such as `expandCollapseNavBarTag` (`utils/bind-navbar.js`).
- Inside `<api-request>`: `inputParametersTemplate`, `requestBodyTemplate`, `apiCallTemplate`.
- Events (all `bubbles`, `composed`): `api-server-change` (`[server-template.js:setApiServer]`);
  `before-authorize`, cancelable, for `authorizationCode` and `implicit` flows; and
  `before-token-request`, cancelable, before each token fetch (listeners may edit
  `detail.request`), both in `security-scheme-template.js`.

## Invariants

- **Headings.** Titles are real `<h1>`–`<h6>` with `class="rapidoc-heading"` and
  `part="heading heading-N"`, never styled divs; the outline is checked by
  `tests/unit/semantic-markup.test.js`.
- **Exported parts.** A part added inside `<api-request>` / `<api-response>` must be added to the
  `exportparts` lists in `endpoint-template.js`, `expanded-endpoint-template.js` and
  `callback-template.js` (the lists differ today); the semantic-markup test catches omissions.
- **String flags.** Host flags are compared as exact strings (`=== "true"` or `=== "false"`),
  never by truthiness; `[focused-endpoint-template.js:focusedEndpointTemplate]` also accepts
  boolean `false` for `showInfo`.
- **Markdown.** Every `marked` result passes through `sanitizeHTML` before `unsafeHTML`.
- **Loading states.** `mainBodyTemplate` returns `""` without `resolvedSpec`, then renders
  `#spec-not-found` on `specLoadError`, a loader while loading, and an error on `loadFailed`.
  `navbarTemplate` returns a stub `<nav part="section-navbar">` in those cases.
- **Navigation ids.** An operation root has `id="${path.elementId}"`; its nav link is
  `id="link-${elementId}"` with `data-content-id` on navigate items (expandable tags carry
  `data-first-path-id` instead).
- **Schema hide flags.** In `endpoint-template.js` and `expanded-endpoint-template.js`, `"never"`
  yields `"false"`; otherwise requests hide read-only and responses hide write-only fields,
  inverted for webhooks. `callback-template.js` always uses the webhook direction.
- **Auth.** `[security-scheme-template.js:applyApiKey]` returns `false` for an unknown scheme or an
  empty value, so an empty value never clears a key. OAuth uses a fresh `state` and `nonce` per
  sign-in and PKCE (`S256`) when its checkbox is checked; a reply is accepted only when
  `isExpectedOAuthReply` matches. Relative OAuth URLs resolve against the selected server's
  `computedUrl` (or its origin).
- **Persistence.** With `persistAuth === "true"`, `localStorage["rapidoc"]` holds
  `{ securitySchemeId, value }` per apiKey / bearer scheme; Basic credentials are never stored.
  `removeApiKey` deletes one entry; `[security-scheme-template.js:onClearAllApiKeys]` empties it.
- **Server variables.** `[server-template.js:onApiServerVarChange]` reads every input in the
  enclosing `<ul class="server-vars">` and recomputes `selectedServer.computedUrl`; the list
  class is what it looks up, so keep it.

## Side Effects

- Render writes host state: `mainBodyTemplate` calls `recoverPersistedApiKeys` on every render
  (before the `specLoadError` check), which can call `requestUpdate()` during render;
  `requestBodyTemplate` sets the selected body type and example when unset;
  `focusedEndpointTemplate` sets `focusedElementId` and expands its nav item.
- Handlers mutate `resolvedSpec` (`expanded` flags in `endpoint-template.js`; scheme values in
  `security-scheme-template.js`) and host tab state, then call `requestUpdate()`.
- `localStorage` key `rapidoc` (see Persistence); no `sessionStorage`.
- `security-scheme-template.js`: `fetch` to the token URL, `window.open` for sign-in
  (`console.error` if blocked), a `BroadcastChannel` and `window` `message` listener while
  waiting, `document` `keydown` listener for popovers.
- Clipboard, downloads and new tabs through `utils/common-utils.js`; navbar handlers toggle
  classes and `aria-expanded` directly in the DOM.

## Verification

- `npm run test:unit` (repo root; tests in `tests/unit/`): `semantic-markup.test.js` (outline,
  `exportparts`), `auth-host-note.test.js`, `request-body-form.test.js`,
  `multipart-part-types.test.js`, `example-dropdown.test.js`, `query-json-array.test.js`,
  `param-content-example.test.js`, `server-description.test.js`, `unused-tags.test.js`,
  `spec-parser-tag-groups.test.js`.
- After edits: `npm run build:rapidoc`, `npm run lint`, `npm run format-fix`.
