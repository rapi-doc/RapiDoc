# AGENTS.md — `packages/rapidoc-express` (`@rapidoc/express`)

## 1. Package Scope & Identity

`@rapidoc/express` is the RapiDoc integration for Express.

- **Package Name**: `@rapidoc/express`
- **Module Type**: ESM, published as source (`src/`, no build), with `examples/`
- **Dependencies**: `@rapidoc/embed`; `express` is a peer
- **Versioning**: its own semver, outside the fixed group (root `AGENTS.md` §6)

`src/index.js` is the whole package: `rapidoc(options)` returns a `(req, res, next)` middleware. `examples/server.js` is an app that uses it (port 4404).

---

## 2. Boundaries

- **No HTML and no route matching here.** Both come from `createResponder` of `@rapidoc/embed` (as in `@rapidoc/hono`, the reference for JavaScript server integrations); this package turns the framework's request into the responder's and writes its answer back. The tests compare the responses with `renderHostPage` and `renderOAuthReceiverPage`.
- **Options are the contract's**, plus `enabled`, `publicUiPath` and a `nonce` function. Add another only when it has no meaning outside Express.
- **Reads only `req.method`, `req.url`, `req.path`, `req.baseUrl` and the headers**, so it also runs under Connect and plain `node:http` (a test covers the latter). Under a mount point (`req.baseUrl`), that prefix goes into the page's URLs unless `publicUiPath` is set.

---

## 3. Commands and Tests

| Command                      | Purpose                                                                                      |
| :--------------------------- | :------------------------------------------------------------------------------------------- |
| `npm test`                   | `tests/express.test.js`; needs `npm run build:rapidoc` first (bundle and `integration.json`) |
| `npm run test:portal` (root) | Runs these with the other package tests                                                      |
