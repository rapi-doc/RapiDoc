# AGENTS.md — `packages/rapidoc-hono` (`@rapidoc/hono`)

## 1. Package Scope & Identity

`@rapidoc/hono` is the RapiDoc integration for Hono, and the reference integration for JavaScript server frameworks: other ones (Express, Fastify) should look like it.

- **Package Name**: `@rapidoc/hono`
- **Module Type**: ESM, published as source (`src/`, no build), with `examples/`
- **Dependencies**: `@rapidoc/embed`; `hono` is a peer (`>=4`)
- **Versioning**: its own semver, outside the fixed group (root `AGENTS.md` §6)

| File                                 | Role                                                                                                                                                          |
| :----------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/middleware.js`                  | `createRapidocMiddleware(options, runtime)`: hands the request to `createResponder` of `@rapidoc/embed` and turns its answer into a Hono response. No imports |
| `src/index.js`                       | `rapidoc()` for Node, Bun and Deno: reads the bundle with `@rapidoc/embed/node`; `assets` defaults to `bundled`                                               |
| `src/edge.js` (`@rapidoc/hono/edge`) | `rapidoc()` for runtimes without a file system; `assets` defaults to `cdn`, `bundled` throws                                                                  |
| `examples/server.js`                 | A Hono app with the middleware (launch config `hono-example`, port 4401)                                                                                      |

---

## 2. Boundaries

- **No HTML here.** Pages and the route table come from `@rapidoc/embed`; `tests/hono.test.js` compares the responses with its `renderHostPage` and `renderOAuthReceiverPage`. A change to the page belongs in the contract, not in this package.
- **`src/edge.js` and `src/middleware.js` import no Node module**, directly or through `@rapidoc/embed/node` (a test checks the source), so a Workers bundle needs no Node compatibility.
- **Options are the contract's** (`@rapidoc/embed`'s `EmbedOptions`). Hono-specific ones are `enabled`, `publicUiPath` and a `nonce` function; add another only when it has no meaning outside Hono.
- **Requests are matched on `uiPath`; pages are written with `publicUiPath`.** They differ only behind a proxy that strips a prefix.

---

## 3. Commands and Tests

| Command                      | Purpose                                                                                                            |
| :--------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| `npm test`                   | `tests/hono.test.js`, through `app.request()`; needs `npm run build:rapidoc` first (bundle and `integration.json`) |
| `npm run test:portal` (root) | Runs these with the other package tests                                                                            |
