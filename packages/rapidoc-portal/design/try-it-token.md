# Design: Try-it with the signed-in user's token

Status: **implemented** (T1–T4 approved 2026-10-28). §3 notes where the implementation differs from the first draft.

## 1. Goal

A reader signed in to the portal presses **Try** on an operation and the request carries their access token, so the API (or `rapidoc mock`) answers 200 or 403 by their permissions. No copying codes or tokens, no second sign-in in a popup.

Today the portal signs readers in but keeps no token (Phase 1: "tokens never reach the browser"), and the API reference's Authentication section is empty until someone pastes a token by hand.

## 2. Config contract

Two new optional keys under `auth`:

```yaml
auth:
  issuer: https://rapidocui.us.auth0.com/
  claims: { groups: https://rapidoc/roles }
  audience: https://api.rapidocui.com   # NEW: the API the access token is for; sent as `audience` at sign-in
  tryIt: true                           # NEW (default false): give Try the signed-in reader's access token
```

| Key | Type | Default | Meaning |
| :--- | :--- | :--- | :--- |
| `auth.audience` | string | none | Sent as the `audience` parameter when signing in, so the provider issues the access token for that API. Auth0 needs it unless the tenant has a default audience; Okta (one authorization server per API) and Entra ID (API scopes in `auth.scopes`, e.g. `api://…/.default`) don't. `RAPIDOC_AUTH_AUDIENCE` overrides it. |
| `auth.tryIt` | boolean | `false` | Fill the Authentication section of every API reference and embedded operation with the reader's access token: the spec's first `oauth2` / `openIdConnect` scheme, else its first http `bearer` scheme (one scheme only, see §3). API-key and Basic schemes are left alone. |

Validation: `tryIt` without `auth` can't exist (it's inside `auth`); no other cross-checks. Schema and `schema.json` regenerate; demo and scaffold get the keys (scaffold commented out).

## 3. How it works

```text
sign-in (server)                     page (browser)                         API / mock
────────────────                     ──────────────                         ──────────
authorize?…&audience=…   ──►  Auth0
callback: code → tokens
  ID token  → identity (as today)
  access token → encrypted cookie
                                     GET /_rapidoc/auth/token
                          ◄────────  (same origin, cookie)
  { access_token, expires_at }  ──►  rapiDoc.setApiKey(scheme, token)
                                     Try ─────────────────────────────►  Authorization: Bearer …
                                                                          200 / 401 / 403
```

**Server (`@rapidoc/server`)**
- At sign-in, also keep the **access token** (never the ID or refresh token) in its own encrypted, HttpOnly cookie (`rapidoc-api-token`, `__Host-` on https). A separate cookie keeps the session cookie small; a token with many permissions can be over 1 KB.
- Cookie lifetime: the shorter of the token's expiry and `auth.session.maxAge`.
- New route `GET /_rapidoc/auth/token`: same-origin requests only (`Sec-Fetch-Site`), `Cache-Control: no-store`. Returns `{ access_token, expires_at }`, or 401 when signed out or the token has expired.
- Only when `auth.tryIt` is on; otherwise the cookie isn't set and the route answers 404.

**Portal pages (`@rapidoc/portal`)**
- With `auth.tryIt`, API reference pages and pages with embedded operations ask `/_rapidoc/auth/token` once after load (only when the user menu reports a signed-in reader).
- Then on `<rapi-doc>` and every `<rapi-doc-mini>`, once its spec has loaded: `setApiKey()` on **one** scheme, the first `oauth2` / `openIdConnect` scheme, else the first http `bearer` scheme. Only one, because every such scheme sends the `Authorization` header and RapiDoc sends every filled scheme an operation lists: filling both `oauth2` and `bearerAuth` would send `Authorization: Bearer x, Bearer x`. (A spec whose operations list only a bearer scheme while another scheme is oauth2 would need a choice; none of ours do.)
- Signed out or no token: nothing happens; the Authentication section stays as today.
- Expired token: Try gets 401 from the API; the user menu's sign-in again fixes it (no refresh tokens in this step).

**RapiDoc core: `setApiKey()` keeps its value handling; it gains an optional note**
- `setApiKey()` sends the value as given for `oauth2` / `openIdConnect` schemes and adds `Bearer ` only for `http bearer`. The docs show `setApiKey('ms-oauth', 'newToken')` on an oauth2 scheme, so existing pages may already pass `'Bearer <token>'` themselves; adding the prefix inside `setApiKey()` would send `Bearer Bearer <token>` for them. So the portal script adapts instead: `setApiKey(id, 'Bearer ' + token)` for oauth2 / openIdConnect schemes, `setApiKey(id, token)` for http bearer. (A clearer, non-breaking core API, e.g. `setAccessToken(schemeId, token)` that prefixes correctly per scheme type, can come separately.)
- The portal passes `setApiKey(id, value, { note })` with "Using your sign-in (<email>). Try sends your access token." RapiDoc (added after T1–T4, opt-in, older callers unaffected) shows the note in place of that scheme's form, with a **Use a different token** link that opens it; changing or removing the key drops the note. Without sign-in the Authentication section is unchanged.

**Also in this step: OAuth return page**
- RapiDoc's own **Authorize** button (OAuth popup from the spec) returns to `oauth-receiver.html`, which portal builds didn't include, and RapiDoc always resolved that name against the *page's folder* (`/apis/oauth-receiver.html`, `/apis/shipments/oauth-receiver.html`, …): one redirect URL per page to register with the provider.
- **RapiDoc core (small, backward compatible):** `oauthReceiverUrl()` in `utils/url-utils.js`. A value starting with `/` is a path from the site root, a full URL is used as is, anything else resolves against the page folder as before. Values starting with `/` produced a broken URL before (`/apis//oauth-receiver.html`), so nothing relied on them. Unit test: `tests/unit/oauth-receiver-url.test.js`.
- **Portal:** the build writes `/oauth-receiver.html` (always public) and sets `oauth-receiver="/oauth-receiver.html"` on `<rapi-doc>` and `<rapi-doc-mini>`; `compileMarkdoc()` takes `variables.oauthReceiver`. This helps portals **without** `auth` too. `oauth-receiver` joins the attributes the portal manages (setting it under `rapidoc:` is a config error).

## 4. Security trade-off

Phase 1 kept every token on the server. Try-it calls the API **from the browser**, so the browser has to hold an access token; this design narrows what it gets:

- Only the **access token**, only for the configured API audience, only to a same-origin script, and only in memory (not `localStorage`).
- The ID token and any refresh token stay on the server.
- Risk: a script injected into a portal page (XSS) could read the token while it is valid. Portal pages are static and written by the company's own authors, which limits this; it's the same exposure every single-page app has.

The alternative is a **server-side Try proxy**: the browser sends Try requests to the portal, which adds the token and forwards them to the API, so the token never leaves the server. It's safer but larger: the proxy must only forward to the spec's servers (no open proxy), handle every request shape including uploads, and it changes how Try reaches the API. Worth a later step if companies ask for it; it can reuse `GET /_rapidoc/auth/token`'s cookie.

## 5. Out of scope

- Refresh tokens (silent renewal when the access token expires).
- Different tokens per API (one audience for the whole portal). Several audiences would need one sign-in per API or a provider that issues multi-audience tokens.
- The server-side Try proxy (§4).

## 6. Tests

- Server: the token cookie is set at sign-in only with `tryIt`; `/_rapidoc/auth/token` returns it same-origin, 401 signed out or expired, 403 cross-site, 404 without `tryIt`; the session cookie never contains it. Uses the existing `oidc-provider` test issuer with a resource indicator / audience.
- Portal: schema cases; with `tryIt`, built API pages contain the token script and `oauth-receiver="/oauth-receiver.html"`; `/oauth-receiver.html` is in the output (public).
- Portal: the token script prefixes `Bearer ` for oauth2 / openIdConnect schemes and not for http bearer (unit test on the script's helper).
- Manual: Rapid Parcels with Auth0: ship@ Try on Shipments → 200, on Tracking → 403; review@ → 403.

## 7. Decisions for you

| # | Question | Recommendation |
| :--- | :--- | :--- |
| T1 | Key shape: `auth.audience` + `auth.tryIt: true`, as above? | **Yes.** `audience` is useful on its own (it decides which token the sign-in gets); `tryIt` is the switch. |
| T2 | Token to the browser via `/_rapidoc/auth/token` now, server-side proxy maybe later? | **Yes.** Same exposure as any SPA, much smaller change; the proxy can come later. |
| T3 | Fill every `oauth2` / `openIdConnect` / `bearer` scheme automatically, no per-scheme setting? | **Yes.** Add a `schemes:` list only if a portal needs to exclude one. |
| T4 | Include the `oauth-receiver.html` fix in the same step, and leave RapiDoc's `setApiKey()` unchanged (the portal adds `Bearer ` itself)? | **Yes.** No change to a long-standing public method; the receiver fix is portal-only. |
