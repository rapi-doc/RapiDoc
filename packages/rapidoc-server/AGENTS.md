# AGENTS.md — `packages/rapidoc-server` (`@rapidoc/server`)

## 1. Package Scope & Identity
`packages/rapidoc-server` serves a portal built by `@rapidoc/portal` and enforces sign-in and access rules. `rapidoc serve` (in `@rapidoc/cli`) runs it.

- **Package Name**: `@rapidoc/server`
- **Module Type**: ESM (`"type": "module"`)
- **Entry Point**: `src/index.js` (`createApp`, `startServer`, `loadSettings`, `SettingsError`)
- **Dependencies**: `hono` + `@hono/node-server` (HTTP), `openid-client` (OpenID Connect), `jose` (encrypted cookies). Dev: `oidc-provider` (a real OIDC provider for tests).

---

## 2. Boundaries

- **No dependency on `@rapidoc/portal` or Astro.** The server reads only the build: `dist/public/`, `dist/protected/` and `dist/rapidoc-server.json`. The build-side contract is `packages/rapidoc-portal/src/access/split-output.js`; change both sides together and keep the manifest `version` in step.
- **The server never evaluates rule patterns.** The build gives every file a zone; the server only maps a file to its zone and a zone's allow to the session.
- **Stateless.** No database, no in-memory sessions: the session and the sign-in transaction are encrypted cookies (`src/auth/session.js`). Anything shared between instances must fit that model.
- **Secrets only from environment variables** (`src/settings.js`). Never read them from, or write them to, the build.
- **The CLI loads this package lazily** (an optional peer); never import it at the top of the CLI.

---

## 3. Security rules

- Default deny: a protected file without a zone in the manifest is never served; an unknown zone allows nobody.
- Signed-out readers can't tell a missing page from a protected one when the default zone isn't public.
- Responses that depend on the session: `Cache-Control: private, no-store` and `Vary: Cookie`.
- `returnTo` stays on this site (`safeReturnTo`); sign-out is same-origin only (`isSameOrigin`).
- The ID and refresh tokens never reach the browser or a cookie. The access token does only with `auth.tryIt`: in its own encrypted cookie (`rapidoc-api-token`), and to the page only through `GET /_rapidoc/auth/token` (same-origin, no-store). Only groups named by some rule go into the session.

---

## 4. Files

| File | Role |
| :--- | :--- |
| `src/index.js` | `createApp()`: routes and the per-request decision; `startServer()` |
| `src/settings.js` | Manifest + environment variables → settings; fails fast with every problem listed |
| `src/access.js` | `allows`, `decide`, `visibleZones`, email patterns |
| `src/static.js` | URL path → file (no traversal), streamed responses, cache headers |
| `src/search.js` | Merged `search-index.json`; per-zone Pagefind bundles with the empty-bundle fallback |
| `src/auth/oidc.js` | Discovery, PKCE sign-in, code exchange + userinfo, end-session URL, claim paths |
| `src/auth/session.js` | Encrypted cookies (JWE dir + A256GCM), cookie names (`__Host-` on https) |
| `src/auth/routes.js` | `/_rapidoc/auth/{login,callback,logout,me}` |

---

## 5. Tests

`npm test` (or `npm run test:portal` from the monorepo root). `tests/helpers.js` starts `oidc-provider` on a random localhost port, writes a fixture build, and drives the app with a cookie-keeping client that calls `app.fetch()` for the portal origin (`http://portal.test`). Add a case to `tests/server.test.js` for every change to the decision table or the auth routes.
