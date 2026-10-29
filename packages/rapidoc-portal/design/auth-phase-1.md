# Design: sign-in and access control, Phase 1

Status: **implemented** (Phase 1). Decisions D1–D8 approved with the recommendations on 2026-10-26. Where the implementation differs from this draft, §13 says so.

## 1. Goal

A company can run a RapiDoc portal on its own servers, behind its own identity provider, and decide who can read which pages, APIs and specs. Protection must be real: a reader without access cannot fetch protected HTML, specs or search results, even with the exact URL.

**In Phase 1**

- Sign-in with any OpenID Connect provider: Okta, Microsoft Entra ID, Google Workspace, Keycloak, Authentik, Zitadel, Auth0, Ping, AWS Cognito, GitLab.
- Path rules: public, any signed-in user, or members of named groups or email domains.
- `rapidoc serve`: a small Node server (new package `@rapidoc/server`) that serves a built portal and enforces the rules. Stateless, so it scales horizontally and needs no database.
- Protected specs and search; header sign-in button and user menu.

**Not in Phase 1** (see §11): GitHub sign-in, SAML (use an IdP broker), Try-it with the user's token, hiding the names of locked items, API keys, per-page `access:` frontmatter.

### How it fits together

```text
rapidoc build                                   rapidoc serve dist
─────────────                                   ──────────────────
config + docs + specs                           Hono server
   │                                              ├─ /_rapidoc/auth/*   sign-in, callback, sign-out, me
   ▼                                              ├─ dist/public/*      served to everyone
astro build (all pages static, as today)          ├─ dist/protected/*   served only if the session's
   │                                              │                     groups allow the file's zone
   ▼                                              └─ /search-index.json public + allowed zones merged
split by access rules
   ├─ dist/public/           safe to host on any CDN
   ├─ dist/protected/        only through rapidoc serve
   └─ dist/rapidoc-server.json   zones, file → zone map, non-secret auth settings
```

Pages are still pre-rendered once at build time. The server never renders, it only decides who gets which file. That works because the portal's content is HTML files, not JavaScript bundles; Zudoku needs code-splitting machinery for the same guarantee because its content ships in JS chunks.

---

## 2. Config contract (`rapidoc.config.yaml`)

Two new optional top-level keys. Both are strict like the rest of the schema: unknown keys fail with their path.

### 2.1 Examples

Whole portal for employees only (the common case):

```yaml
auth:
  issuer: https://login.microsoftonline.com/<tenant-id>/v2.0
  clientId: 3f2b…
access:
  default: signed-in
```

Mixed: public docs, partner pages for any signed-in user, one API for two groups:

```yaml
auth:
  issuer: https://cosmocargo.okta.com/oauth2/default
  clientId: portal-web
  scopes: [openid, profile, email, groups]
  label: Sign in with Okta

access:
  default: public
  rules:
    - path: /docs/partners/**
      allow: signed-in
    - path: /apis/billing/**
      allow:
        groups: [billing-team, platform-admins]
    - path: /docs/internal/**
      allow:
        emails: ['*@cosmocargo.com']
```

### 2.2 `auth`

| Key | Type | Default | Meaning |
| :--- | :--- | :--- | :--- |
| `provider` | `oidc` | `oidc` | Only `oidc` in Phase 1. The key exists so `github` can be added without a breaking change. |
| `issuer` | URL | — | OIDC issuer; endpoints come from its `/.well-known/openid-configuration`. Required at serve time, from here or `RAPIDOC_AUTH_ISSUER`. |
| `clientId` | string | — | Required at serve time, from here or `RAPIDOC_AUTH_CLIENT_ID`. |
| `scopes` | string[] | `[openid, profile, email]` | Add `groups` (Okta) or similar when the provider needs a scope for group claims. |
| `claims.groups` | string | `groups` | Claim holding the user's groups or roles. Dotted paths work: `realm_access.roles` (Keycloak), `roles` (Entra app roles). An array or a space/comma-separated string. |
| `session.maxAge` | duration | `8h` | How long a sign-in lasts: `30m`, `8h`, `7d`. After that the reader is sent through the provider again (usually silent if their provider session is still alive). |
| `logout` | `local` \| `idp` | `local` | `idp` also ends the session at the provider (RP-initiated logout) when it supports it. |
| `label` | string | `Sign in` | Text of the header button. |

**No secrets in the config file.** The client secret and the session key come only from environment variables (§3). The YAML file, the build output and the browser never contain them. There is no `${VAR}` interpolation in YAML: fixed variable names are simpler and keep secrets out of build artifacts.

`issuer` and `clientId` are optional in YAML so that one build (one Docker image) can be deployed to staging and production with different providers, set by environment variables.

### 2.3 `access`

| Key | Type | Default | Meaning |
| :--- | :--- | :--- | :--- |
| `default` | allow | `public` | Applies to every page and file that no rule matches. |
| `rules` | `{ path, allow }[]` | `[]` | Checked top to bottom; the **first matching rule wins**. |
| `rules[].path` | pattern | — | URL path pattern (§2.4). |
| `rules[].allow` | allow | — | Who may read what the pattern matches. |

An **allow** is one of:

- `public`: everyone, signed in or not.
- `signed-in`: anyone who signs in through the configured provider.
- `{ groups?: string[], emails?: string[] }`: a signed-in user who is in **any** of the groups **or** whose email matches **any** of the patterns (`'*@example.com'`, `'jane@example.com'`). Email matches require a verified email (`email_verified` is not `false`). At least one list must be non-empty.

There is no explicit deny. To lock a subtree inside a public area, put the narrower rule first.

### 2.4 Path patterns

- Patterns are URL paths on the portal: docs (`/docs/...`), API references (`/apis/<id>/...`), `/catalog`, `/`, and files from the project's `public/` folder (`/downloads/sla.pdf`).
- `*` matches one path segment, `**` matches any number of segments, including none. `/apis/billing/**` covers `/apis/billing` and every tag page under it.
- A trailing slash does not matter. Matching is case-sensitive, like the URLs.
- **A spec follows its API.** The spec file of API `billing` gets the access of `/apis/billing`. Embedded operations (`{% api-operation %}`) load that same spec, so they are covered too.

### 2.5 Always public

Some files carry no page content and stay public whatever the rules say: build assets under `/_rapidoc/assets/`, `/assets/rapidoc-min.js`, the portal's own `/_rapidoc/` pages (sign-in error, access denied). A rule whose path is under `/_rapidoc/` is a config error.

### 2.6 Validation

Schema errors (on load, same style as today's messages):

- `access` with any allow other than `public` but no `auth` → `access.rules[1].allow: needs "auth" — who is signed in is only known when sign-in is configured`.
- A rule path that does not start with `/`, or is under `/_rapidoc/`.
- An allow object with neither `groups` nor `emails`.
- `redirects[].from` under `/_rapidoc/` (reserved).

Build checks (`rapidoc build`, with the build's file list):

- **Error**: a rule that matches no page or file (a typo would otherwise leave content public).
- **Warning**: a protected API whose `spec` is a URL. The browser fetches it from that origin, so protect it there.
- **Warning**: a public page that embeds an operation of a protected API. Readers without access see an error in place of the embed.
- **Warning**: no `site.url` and no `RAPIDOC_PUBLIC_URL` known; the sign-in redirect URL will be taken from the request's `Host`.
- **Info**: `N protected pages in M zones. Serve with "rapidoc serve dist". dist/public alone is safe to host anywhere but has no protected content.`

`auth` without `access`, or with everything public, is valid: the header shows sign-in, nothing is protected. It is the base for Phase 2 (Try-it with the user's token).

### 2.7 Schema sketch (zod, for `src/config/schema.js`)

```js
const allow = z.union([
  z.enum(['public', 'signed-in']),
  z
    .strictObject({
      groups: z.array(z.string().min(1)).optional().describe('Signed-in users in any of these groups.'),
      emails: z.array(z.string().min(1)).optional().describe("Signed-in users whose verified email matches, e.g. '*@example.com'."),
    })
    .refine((a) => a.groups?.length || a.emails?.length, 'needs groups or emails'),
]);

export const AuthSchema = z.strictObject({
  provider: z.literal('oidc').optional(),
  issuer: z.url().optional(),
  clientId: z.string().min(1).optional(),
  scopes: z.array(z.string()).optional(),
  claims: z.strictObject({ groups: z.string().optional() }).optional(),
  session: z.strictObject({ maxAge: z.string().regex(/^\d+[smhd]$/).optional() }).optional(),
  logout: z.enum(['local', 'idp']).optional(),
  label: z.string().optional(),
});

export const AccessSchema = z.strictObject({
  default: allow.optional(),
  rules: z.array(z.strictObject({ path: z.string().startsWith('/'), allow })).optional(),
});
```

---

## 3. Runtime settings (environment variables, read by `rapidoc serve`)

| Variable | Required | Meaning |
| :--- | :--- | :--- |
| `RAPIDOC_SESSION_SECRET` | when `auth` is set | Key that encrypts the session cookie, at least 32 characters. Every instance behind a load balancer uses the same value. Changing it signs everyone out. |
| `RAPIDOC_AUTH_CLIENT_SECRET` | for a confidential client | Leave unset for a public client (PKCE only). |
| `RAPIDOC_AUTH_ISSUER`, `RAPIDOC_AUTH_CLIENT_ID` | no | Override `auth.issuer` / `auth.clientId`. |
| `RAPIDOC_PUBLIC_URL` | recommended | External URL, e.g. `https://developers.example.com`. Used for the redirect URL and to decide the cookie's `Secure` flag behind a TLS-terminating proxy. Default: `site.url`. |
| `PORT`, `HOST` | no | Default `8080`, `0.0.0.0`. Flags `--port` / `--host` win. |

Redirect URL to register at the provider: `<public URL>/_rapidoc/auth/callback`.

The server refuses to start, with a one-line reason, when a required value is missing, the session secret is too short, or issuer discovery fails.

---

## 4. Access decisions

The build turns each distinct allow into a **zone** and assigns every page and file exactly one zone. The server only reads that map; it never evaluates patterns.

| Request | Reader may see the zone | Signed out, zone not public | Signed in, no access |
| :--- | :--- | :--- | :--- |
| HTML page | 200 | 302 to `/_rapidoc/auth/login?returnTo=<path>` | 403, portal-styled "Access denied" page |
| Spec, file from `public/` | 200 | 401 | 403 |
| `/search-index.json` | public entries + allowed zones merged | public entries | public + allowed zones |
| Pagefind bundle of a zone | real bundle | empty bundle | empty bundle |
| Unknown path | 404 if the reader may see `default`, else as the column says | | |

The last row means a signed-out reader can't tell whether a protected URL exists.

Headers: every response that depends on the session has `Cache-Control: private, no-store` and `Vary: Cookie`, so a shared cache never serves one reader's page to another. Public files keep today's caching (`/_rapidoc/assets/*` immutable).

---

## 5. Build changes (`@rapidoc/portal`)

Only when `access` protects something. A portal with no `access` (or all public) builds exactly as today.

1. **Zones.** `src/access/zones.js` matches every built URL against the rules (first match wins, then `default`) and gives each a zone id. Specs take the zone of their API's page.
2. **Split.** After `astro build`, files in a non-public zone move from `dist/` to `dist/protected/`, the rest to `dist/public/`. Paths inside each folder stay the same.
3. **Specs.** Spec files are published as `/specs/<api id><ext>` instead of `/specs/<file name>`, so two APIs whose spec files share a name no longer overwrite each other and the server can map a spec to its API. (This changes spec URLs for every portal; see decision D6.)
4. **Search, Pagefind.** The build re-runs Pagefind (its Node API, already a Starlight dependency) per zone: public pages into `dist/public/pagefind/`, each zone into `dist/protected/_search/<zone>/pagefind/`, plus one empty bundle. Starlight's `pagefind.mergeIndex` lists `/_rapidoc/search/<zone>/pagefind/` for every zone; the server answers each with the real bundle or the empty one, so search keeps working for everyone and shows only what the reader may open.
5. **Search, API index.** `search-index.json` (the portal's API operation search) is split the same way; the server merges the allowed parts.
6. **Sitemap.** Protected URLs are removed from the sitemap.
7. **Manifest.** `dist/rapidoc-server.json`: zones and their allows, the file → zone map for `dist/protected/`, and the non-secret `auth` settings. Not under `public/`, so a static host never serves it.
8. **Header.** When `auth` is set, header row 1 gets a fixed-size slot (no layout shift) right of the links. A small script calls `/_rapidoc/auth/me`: 200 shows the user menu (name, email, Sign out), 401 shows the sign-in button, 404 (static hosting, no server) hides the slot.
9. **Locked items.** Links to pages in non-public zones (header tabs, sidebar, catalog cards) get `data-access-zone`. The same script adds a lock icon to the ones `/me` says the reader can't open. Their names and the catalog summary stay visible in Phase 1 (decision D1).
10. **Portal pages.** `/_rapidoc/access-denied/` and `/_rapidoc/sign-in-error/`, in the portal's styling, always public.

New files: `src/config/schema.js` (+ `AuthSchema`, `AccessSchema`), `src/access/zones.js`, `src/access/split-output.js`, `src/access/search.js`, `src/components/PortalUserMenu.astro`, `src/pages/access-denied.astro`, `src/pages/sign-in-error.astro`. `build-portal.js` calls the split after `astro build`.

---

## 6. Package `@rapidoc/server`

New workspace `packages/rapidoc-server`. It does **not** depend on `@rapidoc/portal` or Astro: it only needs a built `dist/`, so a production image is Node + this package + the build.

```text
packages/rapidoc-server/
├── package.json          name @rapidoc/server; deps: hono, @hono/node-server, openid-client, jose
├── AGENTS.md, CLAUDE.md, README.md
├── src/
│   ├── index.js          createApp({ distDir, env }) → Hono app; startServer({ distDir, port, host, env })
│   ├── settings.js       reads dist/rapidoc-server.json, applies env overrides, validates, fails fast
│   ├── manifest.js       zone of a protected file; zones a user may see
│   ├── access.js         decide(request, user) → allow | sign-in | forbidden | not-found  (the §4 table)
│   ├── static.js         serves dist/public and dist/protected with the right cache headers
│   ├── search.js         /search-index.json merge; /_rapidoc/search/<zone>/pagefind/* → real or empty bundle
│   └── auth/
│       ├── oidc.js       discovery, authorization URL, code exchange, userinfo, end-session URL
│       ├── session.js    encrypted session cookie and short-lived sign-in cookie (jose, A256GCM)
│       └── routes.js     /_rapidoc/auth/{login,callback,logout,me}, /_rapidoc/health
└── tests/
    ├── session.test.js   encode/decode, tamper, expiry, size
    ├── access.test.js    the §4 decision table
    └── server.test.js    full sign-in against a local oidc-provider issuer, using a built demo portal
```

`createApp` is exported so a company can mount the portal inside its own Node service or add middleware (logging, extra headers) without forking.

### 6.1 Endpoints

| Route | Method | Does |
| :--- | :--- | :--- |
| `/_rapidoc/auth/login?returnTo=/path` | GET | Starts the authorization code flow with PKCE, `state` and `nonce`; keeps them in a 10-minute encrypted cookie. |
| `/_rapidoc/auth/callback` | GET | Checks `state`, exchanges the code, validates the ID token (signature, issuer, audience, expiry, nonce), merges userinfo claims, sets the session cookie, redirects to `returnTo`. |
| `/_rapidoc/auth/logout` | POST | Same-origin only (`Sec-Fetch-Site: same-origin`, `Origin` fallback). Clears the cookie; with `logout: idp`, redirects to the provider's end-session endpoint. |
| `/_rapidoc/auth/me` | GET | `{ user: { name, email, picture }, zones: [...] }` or 401. |
| `/_rapidoc/health` | GET | 200 when the manifest is loaded and the issuer was discovered; for load-balancer and Kubernetes probes. |

### 6.2 Security details

- **Tokens never reach the browser.** The code exchange happens on the server (a backend-for-frontend), so there is nothing in `localStorage` to steal. Phase 1 keeps no access or refresh token at all, only the user's identity.
- **Session cookie** `__Host-rapidoc-session`: HttpOnly, Secure (except on `http://localhost`), SameSite=Lax, Path=/. Holds `sub`, name, email, picture and only the groups that appear in some rule, which keeps it under 4 KB even for users in hundreds of groups and keeps unrelated group names out of it. Expires after `session.maxAge`.
- **Open redirects:** `returnTo` must be a same-site path (`/…`, not `//…`, no scheme); anything else becomes `/`.
- **Entra ID:** with many groups, Entra drops the `groups` claim (group overage) and sends GUIDs, not names. The guide recommends app roles with `claims.groups: roles`.
- **Clock skew** on token validation: 60 s.
- **Logs:** one line per sign-in, sign-in failure and denied request (`sub`, path, zone), no tokens.

---

## 7. CLI (`@rapidoc/cli`)

```text
rapidoc serve [dist]   Serve a built portal; enforces sign-in and access rules
  --port <n>           Default $PORT or 8080
  --host <host>        Default $HOST or 0.0.0.0
```

- `@rapidoc/server` is an optional peer dependency, loaded lazily like `@rapidoc/portal`. When missing: `rapidoc serve needs @rapidoc/server: npm install @rapidoc/server`.
- Without `access` or `auth`, `rapidoc serve` is a plain static server for the build, handy for previewing a production build.

## 8. `rapidoc dev`

Access rules are **not** enforced in dev. The dev server prints `access rules are not enforced by rapidoc dev; test them with rapidoc build && rapidoc serve dist` and the header shows a "Signed out (dev)" placeholder. Enforcing in dev would mean running the Astro dev server behind the auth server; it can come later if people ask.

## 9. Deployment

- Docker example (multi-stage: build with the CLI and portal, run with only the CLI and server) in the server README, in `rapi-portal-demo`, and as an optional file in the `create-rapidoc` template.
- Guides: Entra ID, Okta, Google Workspace, Keycloak. Each is "create an app, set the redirect URL, copy two values". Plus "SAML-only? Put Keycloak, Authentik, Zitadel or Ory Polis in front; they turn SAML into OIDC".
- Kubernetes and load balancers: stateless, any number of instances with the same `RAPIDOC_SESSION_SECRET`.

## 10. Tests

- **Portal** (`npm run test:portal`): schema cases (valid, every error in §2.6); zone assignment and first-match-wins; spec follows its API; a build of a copy of the demo with rules produces the right `public/` / `protected/` split, split search indexes, a filtered sitemap and the manifest; a rule matching nothing fails the build; no file under `dist/public/` contains text from a protected page.
- **Server**: unit tests for the session and the §4 table; an end-to-end test that runs `oidc-provider` (panva, the reference OIDC server) as a local issuer, signs in with a cookie jar, and checks 302 / 401 / 403 / 200, merged search, the empty Pagefind bundle, logout CSRF, and cache headers.
- **CLI**: `rapidoc serve` with the package missing; missing secrets.
- **Layout**: the header sign-in slot keeps the header height fixed and adds no layout shift.

Dependencies added: `hono`, `@hono/node-server`, `openid-client` (OpenID-certified), `jose` in `@rapidoc/server`; `oidc-provider` as a dev dependency. All MIT.

## 11. Later phases

| Phase | Adds |
| :--- | :--- |
| 2 | Try-it as the signed-in user (`<rapi-doc>.setApiKey()` with a short-lived token from the server); GitHub sign-in with org/team as groups; hide locked items' names from HTML for readers without access. |
| 3 | Specs pulled from other Git repos at build time; CI templates (GitHub Actions, GitLab CI, Azure DevOps). |
| 4 | API key UI and backend contract; PocketBase reference backend. |

---

## 12. Decisions for you

| # | Question | Recommendation |
| :--- | :--- | :--- |
| D1 | Locked items in nav and catalog: visible with a lock, or removed from the HTML? | **Visible with a lock** in Phase 1. Removing them per reader means rewriting HTML per request; Phase 2. Page content, specs and search are protected either way. |
| D2 | Output layout `dist/public/` + `dist/protected/` when something is protected (unchanged otherwise)? | **Yes.** `dist/public/` is always safe to publish; serving `dist/` by mistake shows no `index.html` at the root instead of leaking pages. |
| D3 | Rule order: first match wins? | **Yes**, like most firewalls and nginx `location` ordering; easy to read top to bottom. |
| D4 | Allow names `public` / `signed-in` / `{ groups, emails }`? | **Yes.** Plain words, like the rest of the config. |
| D5 | Separate `@rapidoc/server` package, optional peer of the CLI? | **Yes.** Production images don't need Astro, and the portal keeps "no runtime server" as its own rule. |
| D6 | Spec URLs become `/specs/<api id><ext>` for every portal? | **Yes.** It fixes name collisions too. Anyone linking to the old URL breaks; add redirects only if you know of such links. |
| D7 | Secrets only from environment variables, no `${VAR}` in YAML? | **Yes.** |
| D8 | `emails` patterns in Phase 1 (verified email required)? | **Yes.** "Everyone at our company" is the most common rule and many providers have no groups set up. |

---

## 13. Implementation notes (differences from the draft)

- **Split layout whenever `auth` is set** (D2 said "when something is protected"). Sign-in needs `rapidoc serve` anyway, so one rule is simpler: with `auth` the output is `public/` + `protected/` + `rapidoc-server.json`, without it the usual static site.
- **Search.** The portal header replaces Starlight's, so the search box readers use is the portal's own (`search-index.json`), which the server merges per reader. The Pagefind bundles are still split per zone (and merged through `pagefind.mergeIndex`), so `/pagefind/` never holds protected pages either.
- **Always public, added:** the logo and favicon (the sign-in error and access-denied pages show them).
- **New endpoint** `POST /_rapidoc/access/check` (`{ paths }` → `{ locked }`) for the lock icons, instead of the build marking links with `data-access-zone`. The page asks only about links it shows, so no list of protected URLs is published.
- **Groups hint.** `rapidoc serve` logs a hint when rules use groups but a sign-in carries no groups claim (a missing `groups` scope, for example).
- **Not done in Phase 1:** a Docker file in the `create-rapidoc` template (the server README has an example), provider-specific setup guides (the portal README has short notes), and a layout test for the header's sign-in slot. `rapidoc dev` doesn't enforce rules, as planned.
- **Known gap (existing before this work):** spec files that a spec references through a relative `$ref` (e.g. `label-v3.json` → `label-base.json` in the demo) are not published at all. When that is fixed, they must take the zone of the API that references them.

