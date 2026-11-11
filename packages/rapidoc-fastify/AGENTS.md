# AGENTS.md — `packages/rapidoc-fastify` (`@rapidoc/fastify`)

## 1. Package Scope & Identity

`@rapidoc/fastify` is the RapiDoc integration for Fastify.

- **Package Name**: `@rapidoc/fastify`
- **Module Type**: ESM, published as source (`src/`, no build), with `examples/`
- **Dependencies**: `@rapidoc/embed`; `fastify` is a peer
- **Versioning**: its own semver, outside the fixed group (root `AGENTS.md` §6)

`src/index.js` is the whole package: `rapidoc(fastify, options)` is an async plugin that registers one route per route of the contract. `examples/server.js` is an app that uses it (port 4405).

---

## 2. Boundaries

- **No HTML and no route matching here.** Both come from `createResponder` of `@rapidoc/embed` (as in `@rapidoc/hono`, the reference for JavaScript server integrations); this package turns the framework's request into the responder's and writes its answer back. The tests compare the responses with `renderHostPage` and `renderOAuthReceiverPage`.
- **Options are the contract's**, plus `enabled`, `publicUiPath` and a `nonce` function. Add another only when it has no meaning outside Fastify.
- **Routes are registered, not matched in a hook**, so Fastify's router, its 404 handling and the plugin `prefix` apply as usual. Each route has `schema: { hide: true }` for `@fastify/swagger`. The plugin is not wrapped with `fastify-plugin`: it adds nothing its parent scope needs.

---

## 3. Commands and Tests

| Command                      | Purpose                                                                                      |
| :--------------------------- | :------------------------------------------------------------------------------------------- |
| `npm test`                   | `tests/fastify.test.js`; needs `npm run build:rapidoc` first (bundle and `integration.json`) |
| `npm run test:portal` (root) | Runs these with the other package tests                                                      |
