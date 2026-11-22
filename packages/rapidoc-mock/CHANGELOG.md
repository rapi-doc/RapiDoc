# @rapidoc/mock

## 0.2.6

### Patch Changes

- c7e7a4a: The Mock UI says RapiMock, the mock server's product name; `create-rapidoc`'s description names RapiDoc Portal.

## 0.2.5

### Patch Changes

- c138d53: The sentences the mock writes about a spec put the names they take from it in backticks: what an operation does ("Lists the stored `Owner` records, filtered by `lastName`."), a review note ("returns inline objects; assumed to be `destination`") and a parameter's role, in `/__mock/model` and its detail endpoints. The Mock UI shows those names as code, so a resource called `destination` or `user` can't be read as a word of the sentence. `rapidoc lint --stateful` prints its findings as before, without the marks.
- 6f8e0f7: The Mock UI has an Import spec page in its sidebar: add a spec to the running mock from an address, a file or pasted text, and it is served at once under its own path, with state, until the mock stops; imported specs are listed with a Remove button. The control API has the same: `POST /__mock/apis` with `{ "url": ... }` or `{ "text": ..., "name": ... }`, and `DELETE /__mock/apis/<id>`. Importing is accepted only from the machine the mock runs on.
- 6f8e0f7: The Mock UI marks what needs review where it is: on an operation's page, a query parameter the mock had to assume something about (one that matches no field of the records it lists, or is matched on the name of nested objects) has a red dot beside its name, and a Needs review column says what was assumed; the top of the page says how many parameters to review, with a link down to them, instead of the full sentence. The control API's operation detail has the same as data: `review` on such a parameter, and `review: { parameters, other }` on the operation. Needs review is now a red (`#ff8080`) instead of pink. An operation labelled Needs review for its resource shows that reason, on its page and in the Operations table. The page says what an operation does in plainer words ("Deletes the Pet record whose id is in the path parameter petId. If no such record is stored, it responds with HTTP status 404 (Not Found)."), and that `Prefer` is a request header. The Dashboard explains the three labels in full, and each links to its operations.

## 0.2.4

### Patch Changes

- 09b4d92: `rapidoc lint` has two rules for examples, both `warn` by default. `example-named-map` reports a media type's `example` that is a map of named examples (`example: { "Calendar": { ... } }`), which belongs under `examples`. `example-matches-schema` reports request and response examples that do not fit their schema; it reads schemas with `@rapidoc/mock`, and where that package is not installed the rule is skipped and lint says so.
- 3b12e51: `rapidoc lint --stateful` reads `mock.config.yaml` (beside the spec or in the folder, or `--mock-config <file>`): what you have stated there, a resource's key or an operation's action, is no longer reported. An entry of the file that no longer fits the spec is reported as `mock-config`. The file is read only when a `stateful-*` rule is on.
- 82c16a8: `rapidoc lint --stateful` reports what the stateful mock (`rapidoc mock --stateful`) had to assume about a spec or could not map, at its place in the spec: a resource without a visible key, a list filter that matches no field, a write that fits no resource, a reference to a resource the spec doesn't have, records described by an inline schema, and other assumptions about operations. These are seven `stateful-*` rules, off by default; `--stateful` turns six on as warnings, and each can be set by name. They need `@rapidoc/mock` installed.
- 705116b: The stateful mock's code no longer needs a Node module to make a UUID, and `src/browser.js` (`createBrowserMock`) runs the stateful mode in a page, answering the control API as a function. The Rapi Mock site uses it for its spec check; the server works as before.
- 89c3d74: `rapidoc mock --stateful` reads `mock.config.yaml` beside the spec: your corrections to what the mock worked out. `resources.<Name>.key` names a resource's key, and a dotted path such as `metadata.name` reaches inside the record; `operations.<id>` sets an operation's `resource`, `action` and where its `key` comes from (`path.x`, `query.x`, `body.x`), or `action: none`. With several APIs the sections go under `apis.<api id>`. An entry that no longer fits the spec is skipped and named when the mock starts. `--mock-config <file>` names another file.
- dcecc2c: `mock.config.yaml` can say `version: 1`, the format it is written in. The line is optional; a version the mock does not know is named when it starts, and what it recognises in the file is still applied.
- 609632a: `rapidoc mock` has its own endpoints under `/__mock`, for tests in any language: `GET /__mock/health` (ready check), and with `--stateful` `POST /__mock/reset` (back to the seed data), `GET /__mock/state` (the stored records, down to one record), `POST /__mock/snapshot` and `POST /__mock/restore` (save the records and put them back, or load data a test wrote). They follow the `X-Mock-Session` header. An API can no longer have the id `__mock`.
- 316c279: `rapidoc mock` reads an `example` that was written as a map of named examples (`example: { "Calendar": { ... } }`, which belongs under `examples`): the response is the value under the name, not the map. It does so only when the response schema confirms it.
- ffdf370: `rapidoc mock --stateful` no longer takes a record for a wrapper because it holds another object under `payload`, `data`, `result` or `item`. An object is a record when it has a key of its own (`id`, `key`, `uuid`, `slug`, or one named after it, such as `messageId` on `Message`), or when its item path addresses one of its fields (`/tags/{slug}` and `slug`). Gmail's messages (an `id` and a `payload` part) now keep state. A wrapper's own `request_id` does not count.
- 90d213f: `rapidoc mock` serves OpenAPI 3.2 `QUERY` operations and the methods under `additionalOperations` (`PURGE`, `COPY`, ...): routed, validated, listed in `Allow` on a 405 and allowed by CORS. It warns at start about a method Node's HTTP server can't receive.
- 90d213f: `rapidoc mock` loads OpenAPI 3.2 specs and streams `itemSchema` responses (Server-Sent Events, JSON Lines, JSON Text Sequences) one item at a time, `--stream-interval` apart (default 300 ms): the example's items (`dataValue` lists and `serializedValue` text are read), else five generated items with numbered ids. JSON Lines request bodies are checked line by line against their `itemSchema`.
- 3d4aa05: `rapidoc mock` takes a spec's http(s) address as well as a file: `rapidoc mock https://example.com/orders-api.yaml` serves it under `/orders-api`, read once at start, with the files its relative `$ref`s name on the same server. An address on `localhost` or a private network works when you name it (your API server's own `/openapi.json`); a `$ref` from a spec to such an address is still refused. The Mock UI's header also stays on one row on any screen wider than a phone's.
- 6147dd3: `rapidoc mock --stateful` keeps state for more operations: lists and creates under a parent path (`/grants/{grant_id}/calendars`), and operations that return a part of the record's schema (a list of `calendar_common` where a read returns `calendar`). Paging, sorting and field-selection parameters such as `page_token`, `orderBy` and `select` no longer mark a list for review.
- e6f9abc: `rapidoc mock --stateful` keeps a record under the parent its path names, also when the record has no field for it: a comment created at `/articles/{slug}/comments` is listed and found under that article only. Seeded records of such a resource start under a few of the seeded parents, not under every one.
- 4f09606: `rapidoc mock --stateful` seeds more readable records. Schemas written with `allOf` now get named values, sequential ids and every enum value, as other schemas do. A field with a `pattern` gets a readable value when one fits (a person's name in a pattern for names). Records after the first follow the shape of a field's example where the schema says no more: a date, digits, an id of the same form, a number of that size, or the example itself for a short value such as a status.
- b2fb27e: `rapidoc mock --stateful` keeps data like a real server: it works out resources, keys and relations from the spec, seeds each resource with records (`--rows`, default 10) whose references point at each other, and then creates, updates and deletes change stored records that reads and lists return, in the response shape the spec defines. Operations that fit no resource answer as before. An `X-Mock-Session` header gives a caller its own copy of the data.
- bf984c7: Mock UI: a new look. One dark theme with an amber brand block, a darker sidebar that marks where you are, panels without borders and quieter tables. The header and the page title now say Rapi Mock. The operation labels are now named Stateful, Needs review and Static (before: Confident, Needs review, Plain mock), in the UI and in the `rapidoc mock` start-up line, and a badge shows what its label means on hover.
- 9a964fb: The Mock UI has detail pages. A resource's About tab shows its fields with how each is seeded ("a first name", "the id of an Owner record", "shaped like the example"), its links to other resources, the operations on it, and generates a sample record without storing it. An operation's Details page says what the mock does for it in a sentence, what it uses each parameter for, what the request and each response hold, and shows a sample response. The same is available as JSON under `GET /__mock/model/<api>/resources/<Resource>` (and `/sample`) and `GET /__mock/model/<api>/operations/<id>`.
- 79e51fb: The Mock UI has a Lint section and a Lint card on its Dashboard: what `rapidoc lint --stateful` finds in the spec, with the share of checks that passed, the categories and rules, and every finding, each view with its own address. `rapidoc mock --stateful` lints a spec when the page first asks; the result is also at the new control endpoint `GET /__mock/lint/<api id>`. `createMockApp` takes the linter as its `lint` option (the mock has no lint rules of its own), and `/__mock/settings` says whether there is one.
- 34b2a83: The Mock UI puts Operations first. Its table writes each path once beside its methods in colored text, and an operation's page has tabs for the path's other methods and a response table with each status's model, where its body comes from and how to get it. The control API's operation detail says, for each response, where the body comes from (`body`, `examples`) and which response is returned by default (`returned`). Its icons are Phosphor's, as on the portal, and the Dashboard's Lint card shows the share passed as a ring beside one table of categories. Its controls follow `<rapi-doc>`: caps buttons, tabs and section headings, an amber current button in a group, switches for checkboxes.
- 34b2a83: In the Mock UI, a resource's About tab is now its Schema tab, and an object field there opens to its own fields. The resource list marks a count that requests changed from the seed data ("11 (+1)"). On an operation's page, selecting a response shows its sample. The control API gives each resource's `seeded` count, the nested `fields` of a resource's fields, and an operation's sample for another response with `?code=`. The stateful mock now keeps records whose schema is one of several objects (a `oneOf` or `anyOf`, such as Nylas' redirect URIs): their fields are all of their shapes', so they get a key, and seeded records take each shape in turn; the model gives such a resource's `shape` and, per field, the shapes it is `onlyIn`.
- 9d8672f: The Mock UI (`/__mock/ui`) is now an app with a sidebar: a Dashboard per API, Resources, Operations (grouped by path or by resource) and Settings, each with its own address. Settings makes new seed data with another number of records or seed, and sets a response delay. `rapidoc mock --delay <ms>` waits before every API response; `GET` and `PATCH /__mock/settings` read and change it while the mock runs, and `POST /__mock/reset` with `{ "rows": 25, "seed": 7 }` makes new seed data.
- b956bb0: Mock UI: `<rapidoc-mock-ui>` takes a `source` property, the control API as a function (`({ method, path, body, session }) => ({ status, data })`), so the same UI can show a mock that runs in the page instead of on a server. Without it the UI reads the control API over HTTP as before.
- f1d276f: Mock UI: the records table sorts, filters and pages with TanStack Table (a third click on a column header clears the sort), and each screen keeps its own filter. "See all operations that need review" on the Dashboard is now an address (`#/<api>/operations?label=needsReview`).
- b745c60: `rapidoc mock --stateful` serves a Mock UI at `/__mock/ui`: per API, the resources with their records in a table you can filter and sort, and every operation with its label (stateful, needs review with the reason, static), plus a reset button and a session field. `GET /__mock/model` returns the same as JSON.
- 93c5415: `rapidoc mock --stateful` maps more of a spec it has not seen before, after measuring on Jira and DigitalOcean. A collection's list is found by what its item path returns, whatever the property is called (`{ load_balancers: [...], links, meta }`, a page object with `values`). A POST with an object on a resource's collection is taken as a create, marked for review. Where a path takes a number for a key the schema types as text, new keys are numbers in text, so the next request passes validation. A field or resource whose seed data cannot be generated no longer leaves the whole API without state: the resource starts empty and the server says which.

## 0.2.3

No changes in this release.

## 0.2.2

No changes in this release.

## 0.2.1

No changes in this release.

## 0.2.0

No changes in this release.

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
