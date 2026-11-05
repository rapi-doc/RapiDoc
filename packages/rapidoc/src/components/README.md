# RapiDoc Sub-Components

## Overview

Lit 3 elements that `<rapi-doc>` (and `@rapidoc/static`, which constructs the schema renderers
directly) composes into each operation's request and response panels. Each file is a TypeScript
class with `@customElement` / `@property` decorators and shadow DOM.

This folder owns the request panel (parameters, body, Try, cURL, live response), the response
panel, the schema tree/table renderers, the JSON example viewer and the tag editor. It does not own
the surrounding templates (`../templates/`), styles (`../styles/`), or the parsing, URL, cURL and
fetch helpers (`../utils/`). Callers: `../rapidoc.ts`, `../templates/*` and
`../static/render.js` (`renderSchema` uses `SchemaTable` / `SchemaTree`).

## Interface

- `<api-request>` [api-request.ts:ApiRequest] — request panel; the only component that calls
  `fetch`. Dispatches `before-try`, `after-try` and `request-aborted`.
- `<api-response>` [api-response.ts:ApiResponse] — status buttons, MIME dropdown, Example/Schema
  tabs, response headers. `resetSelection()` is called by `<rapi-doc>` when focused mode reuses one
  instance. Dispatches no events.
- `SchemaBaseElement` [schema-base-element.ts:SchemaBaseElement] — unregistered base class for the
  schema renderers: config sync, hide rules, description cells, expand/collapse.
- `<schema-tree>` [schema-tree.ts:SchemaTree] and `<schema-table>` [schema-table.ts:SchemaTable] —
  render a schema AST (from `../utils/schema-utils.js`) as a bracketed tree or a
  Field/Type/Description table via `renderAST(node, parentType, schemaLevel, indentLevel)`.
- `<json-tree>` [json-tree.ts:JsonTree] — collapsible JSON viewer with a Copy button.
- `<tag-input>` [tag-input.ts:TagInput] — tag editor for array-valued parameters; dispatches
  `change` then `input` with `detail: { value }`.

The `before-try`, `after-try`, `request-aborted`, `change` and `input` events are all
`bubbles: true, composed: true`. Property lists, CSS parts and event detail fields are in the code.

## Invariants

- Flags passed from `<rapi-doc>` are strings, compared with `=== "true"` / `=== "false"`, not
  booleans (`allowTry`, `showCurlBeforeTry`, `webhook`, `callback`, the `schema*` flags).
- `<api-request>` omits the Try bar only when `allowTry === "false"`, and sets
  `allowTry = "false"` after every update while `webhook === "true"`
  [api-request.ts:ApiRequest.updated].
- Config sync runs in `willUpdate` only when `config` is set and changed. `<api-request>` and
  `<api-response>` map a defined `config.schemaHide*` of `"never"` to `"false"` and any other value
  to the direction default (requests hide read-only, responses hide write-only; webhooks invert
  both) [api-request.ts:ApiRequest.willUpdate; api-response.ts:ApiResponse.willUpdate].
  `SchemaBaseElement` maps `"never"` to `"false"`, copies a literal `"true"` / `"false"`, and
  otherwise keeps the value the template set [schema-base-element.ts:hideFlagFromConfig].
- `SchemaBaseElement.willUpdate` resets a falsy or `< 1` `schemaExpandLevel` to `99999`, and
  resets `schemaDescriptionExpanded` to `"false"` and either hide flag to `"true"` when the value
  is not `"true"` or `"false"`.
- `isFieldHidden(node)` hides read-only / write-only nodes per the hide flags, and `renderAST`
  skips a hidden node's whole subtree [schema-base-element.ts:SchemaBaseElement.isFieldHidden].
- A node starts expanded iff `schemaLevel < schemaExpandLevel`; children render at
  `schemaLevel + 1`. Union options stay at the parent's level in `<schema-tree>` but go one level
  deeper in `<schema-table>`.
- Markdown descriptions are passed through `sanitizeHTML` before `unsafeHTML`; plain-text schema
  descriptions skip markdown and rely on Lit escaping
  [schema-base-element.ts:SchemaBaseElement.renderDescrCell; api-response.ts:ApiResponse].
- Each Try gets its own `AbortController`; `before-try` listeners may change the request (`url`,
  `method`, `headers`, `credentials`, `body`) before the `Request` is built, and `loading` is reset
  in `finally` [api-request.ts:ApiRequest.onTryClick].
- `<tag-input value="a,b">` is a comma-separated list: blank parts are dropped, values are not
  trimmed, and removing the attribute sets `value` to `[]` [tag-input.ts:TagInput]. Events fire
  only after user edits (paste, Enter, Backspace/Delete on an empty input, blur), never on
  attribute or property sets.

## Side Effects

- Network: `ApiRequest.onTryClick` calls `fetch`; `disconnectedCallback` aborts an in-flight
  request.
- Object URLs for blob responses are revoked before each Try, in `clearResponseData`, and in
  `disconnectedCallback` (they are created in `../utils/response-utils.js`).
- `ApiRequest.updated` schedules `syncTryBarState` with `queueMicrotask` and calls
  `scheduleHighlight` on the host's shadow root; example selection uses `window.setTimeout`.
- `<api-request>` reads outside its shadow root: `buildFetchHeaders` takes `Accept` from the
  sibling `<api-response>`'s `selectedMimeType` via `this.closest(...)`.
- Direct DOM writes without reactive state: example fill/clear writes input values;
  `<api-response>` toggles `.example` panel `display`; expand/collapse swaps classes.
- Clipboard: `<json-tree>` copies JSON; `<tag-input>` reads pasted text and prevents the default.
- `renderMarkdownDescription` keeps a module-level cache shared by all schema renderers, cleared
  when it reaches 5000 entries [schema-base-element.ts:renderMarkdownDescription].
- `willUpdate` overwrites reactive properties from `config`, so a `config` change replaces values
  set by attribute.

## Verification

- Run `npm run test:unit` from the repo root (`tests/unit/*.test.js`, Node test runner).
- Unit tests that render or load these components: `semantic-markup.test.js` (heading outline,
  `exportparts`), `schema-modernization.test.js`, `schema-nullable.test.js`,
  `multipart-form-curl.test.js` (`<tag-input>` converter), `static-renderer.test.js`;
  `css-variables.test.js` checks every `var(--x)` read here is defined.
- Template rendering is also covered by `npm run test:component` and `npm run test:visual`.
