# AGENTS.md — `packages/rapidoc-mock` (`@rapidoc/mock`)

## 1. Package Scope & Identity
`packages/rapidoc-mock` is a mock server for the APIs of a portal: examples first, then generated data, request validation, and each operation's `security` enforced with real token checks. `rapidoc mock` (in `@rapidoc/cli`) runs it.

- **Package Name**: `@rapidoc/mock`
- **Module Type**: ESM (`"type": "module"`)
- **Entry Point**: `src/index.js` (`createMockApp`, `startMockServer`, `tokenScopes`, `DEFAULT_PORT`)
- **Dependencies**: `hono` + `@hono/node-server` (HTTP), `jose` (JWT/JWKS), `openapi-backend` (routing, request validation), `json-schema-faker` (data), `@apidevtools/json-schema-ref-parser` (bundling), `ajv` + `ajv-formats` (checking generated data).

---

## 2. Boundaries

- **No dependency on `@rapidoc/portal` or Astro.** The CLI reads `apis:` with `loadConfig` and passes `{ id, fullPath, title }`; this package only reads spec files.
- **Libraries stay behind the adapters in `src/engine/`.** `router.js` is the only file importing openapi-backend (`match`, `validate`); `faker.js` the only one importing json-schema-faker (`fake(schema, seed)`). Swap a library there and keep the interface; everything else works on the bundled OpenAPI document.
- **No `rapidoc.config.yaml` keys.** Settings are CLI options and `RAPIDOC_MOCK_*` variables. Adding a config key (e.g. `mock:`) is a config contract change: ask first.
- **The CLI loads this package lazily** (an optional peer); never import it at the top of the CLI.

---

## 3. Auth rules (`src/auth.js`)

- Requirements are alternatives; schemes inside one requirement are all needed. `security: []` is open.
- Token schemes (oauth2, openIdConnect, http bearer) need a JWT verified against the issuer's JWKS (discovered at start; a wrong issuer fails the start), with `issuer` and, when set, `audience` checked. Scopes come from `scope`, `scp` and `permissions`.
- A bearer requirement without scopes takes the operation's OAuth scopes (the demo convention: the oauth2 scope is the permission, whichever scheme carries the token).
- `401` (missing or invalid token, `WWW-Authenticate: Bearer`, `error="invalid_token"` when one was sent) unless some alternative failed only on scopes: then `403` with `error="insufficient_scope"` and the missing scopes.
- Auth runs before request validation: a caller without access learns nothing about the request format.
- Without an issuer, bearer tokens are accepted unchecked; say so wherever the mock starts.

---

## 4. Files

| File | Role |
| :--- | :--- |
| `src/index.js` | `createMockApp()`: loads specs, mounts each under `/<id>`, CORS, the per-request flow (route → auth → validate → respond); `startMockServer()` |
| `src/spec.js` | `loadSpec` (bundle relative `$ref` files, 3.0/3.1 only), JSON pointers, `resolve`, `listOperations`, `securityOf` |
| `src/schema.js` | OpenAPI schema → self-contained JSON Schema 2020-12 for generation: inlines refs, cuts recursion, 3.0 `nullable`/`exclusive*`, drops `writeOnly`, folds `allOf` + `oneOf` |
| `src/responses.js` | Picks the response (`Prefer: code/example/dynamic`, Accept), examples first, generated data checked with ajv and repaired per value |
| `src/auth.js` | `createVerifier` (discovery + JWKS), `createAuth().check()`, `tokenScopes`, `problem()` |
| `src/engine/router.js` | openapi-backend adapter (lazy validators: an operation whose schema it can't compile is served unvalidated, with a warning) |
| `src/engine/faker.js` | json-schema-faker adapter and generation options |

---

## 5. Tests

`npm test` (or `npm run test:portal` from the monorepo root). `tests/helpers.js` starts a token issuer (discovery + JWKS from a jose key pair) on a random localhost port and signs tokens; `tests/fixtures/` holds a 3.1 spec with a relative `$ref` file and a 3.0 spec. Add a case for every change to the auth rules or response selection. The CLI side (`rapidoc mock`) is tested in `packages/rapidoc-cli/tests/cli.test.js`.
