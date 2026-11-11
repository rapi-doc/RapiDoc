# AGENTS.md — `packages/rapidoc-embed` (`@rapidoc/embed`)

## 1. Package Scope & Identity

`@rapidoc/embed` is the integration contract: how a plugin or middleware for a framework, docs site or tool turns its options into the page that hosts `<rapi-doc>`. JavaScript integrations depend on it; integrations in other languages port `src/core.js` and run the fixtures.

- **Package Name**: `@rapidoc/embed`
- **Module Type**: ESM, published as source (`src/`, no build), with `conformance/` and `examples/`
- **Dependencies**: `rapidoc` only (its `dist/integration.json` and bundle files)
- **Versioning**: its own semver, outside the fixed group (root `AGENTS.md` §6)

| File                                  | Role                                                                                                                                                                                          |
| :------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/core.js` (`@rapidoc/embed/core`) | The contract: `renderHostPage`, `renderOAuthReceiverPage`, `embedRoutes`, `embedUrls`, `toAttributes`. Pure string functions                                                                  |
| `src/index.js`                        | The same functions with `manifest` defaulted to `rapidoc/integration.json` (JSON import)                                                                                                      |
| `src/responder.js`                    | `createResponder(options, { readAsset })`: matches a request against the routes and returns status, headers and body. What the JavaScript server integrations share; not part of the contract |
| `src/node.js` (`@rapidoc/embed/node`) | Paths and contents of rapidoc's `dist/` files                                                                                                                                                 |
| `conformance/README.md`               | The contract in words: options, routes, rendering rules                                                                                                                                       |
| `conformance/fixtures/<case>/`        | `input.json` and `expected.html` or `expected.json`                                                                                                                                           |
| `examples/node-server.js`             | A whole integration on `node:http` (launch config `embed-example`, port 4400)                                                                                                                 |

---

## 2. Boundaries

- **`src/core.js` has no imports and uses no Node or DOM API.** It must run in edge runtimes and stay short enough to port by hand.
- **The output is a contract.** Ports in other repositories compare against the fixtures byte for byte. Any change to what `core.js` returns needs a new `CONTRACT_VERSION` (here and in `scripts/rapidoc-metadata.js`), regenerated fixtures and an updated `conformance/README.md`, in one change. Adding an option whose absence leaves the output unchanged is not a contract change, but still needs a fixture.
- **No framework code here.** An integration for a framework is its own package.
- **`head` and `css` are written unescaped** by design (the developer's own markup); everything else is escaped, and attribute names are validated. Keep `tests/embed.test.js`'s injection cases passing.
- **The attribute list is not here.** It is declared in `packages/rapidoc/src/rapidoc.ts` and published as `rapidoc/options.schema.json` and the types of `rapidoc`.

---

## 3. Commands and Tests

| Command                      | Purpose                                                                                                                       |
| :--------------------------- | :---------------------------------------------------------------------------------------------------------------------------- |
| `npm test`                   | `tests/conformance.test.js` (fixtures) and `tests/embed.test.js`; needs `npm run build:rapidoc` first, for `integration.json` |
| `UPDATE_FIXTURES=1 npm test` | Rewrites the expected files after a deliberate contract change; review the diff                                               |
| `npm run test:portal` (root) | Runs these with the other package tests (its `pretest` builds `rapidoc`)                                                      |
