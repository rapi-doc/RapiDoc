---
title: Try with the reader's token
description: Let Try call your API with the signed-in reader's access token.
---

Every operation on an API reference page has a **Try** button, which sends the request to your API from the reader's browser. Without `tryIt`, readers fill in the **Authentication** panel of the reference page themselves: an API key, a token, or their own OAuth sign-in.

With `auth.tryIt`, a signed-in reader presses **Try** and the request carries their own access token, from their sign-in to the portal. Your API's own permission check answers, with that reader's permissions: `200` for a reader who may call it, `403` for one who may not. There is no token to copy and paste.

`tryIt` is optional. It needs:

- portal sign-in with `auth` ([Set up sign-in](/docs/access/setup/)),
- an API that accepts access tokens from the same provider, for the right audience ([below](#the-audience)),
- an API that allows the portal's address for cross-origin requests (CORS) with an `Authorization` header, as for any **Try** request.

```yaml title="rapidoc.config.yaml"
auth:
  issuer: https://acme.okta.com/oauth2/default   # your API's authorization server
  clientId: portal-web
  tryIt: true
```

## How it works

1. At sign-in, `rapidoc serve` keeps the reader's access token in its own encrypted, `HttpOnly` cookie. The ID and refresh tokens are not kept at all.
2. Reference pages and embedded operations ask the server for the token, and fill it into the authentication panel for one security scheme of the spec:
   - the first `oauth2` or `openIdConnect` scheme,
   - else the first HTTP `bearer` scheme.
3. **Try** sends `Authorization: Bearer <token>` to the API.

The page keeps the token in memory only, never in local storage. It is handed only to pages of the portal itself (same origin), but every script running on those pages can fetch it, including analytics or other scripts you add with [`head`](/docs/configuration/site/#head-tags). Add only scripts you trust to a portal with `tryIt`.

The token expires on the provider's schedule, often after an hour, which can be well before the sign-in ends (`session.maxAge`). From then on, **Try** sends no token until the reader signs in again. A shorter `session.maxAge` keeps the two closer.

## The audience

The access token has to be for your API, not for the portal. Okta: use your API's authorization server as `issuer`. Auth0: set `audience` to the API's identifier. Microsoft Entra ID: add your API's scope to `scopes`, such as `api://<API's application ID>/access_as_user`. Every provider: [Audience for Try](/docs/access/providers/#audience-for-try).

## Before your API exists: the mock server

Point the spec's server at [`rapidoc mock`](/docs/tools/mock-server/), which checks each token's signature, audience and scopes the way your API would:

```yaml title="specs/billing.yaml"
servers:
  - url: http://localhost:4010/billing   # /<api id>
```

```bash
npx rapidoc mock --issuer https://acme.okta.com/oauth2/default --audience api://default
```

Signed-in readers then get `200` or `403` from the mock, depending on their own scopes. Okta's default authorization server issues tokens for the audience `api://default`.

## Troubleshooting

| What you see | Cause |
| :--- | :--- |
| **Try** has no token | The reader isn't signed in, `tryIt` isn't `true`, the token has expired, or the spec has no `oauth2`, `openIdConnect` or HTTP `bearer` scheme. |
| `401` from your API | The token is for another audience (see [The audience](#the-audience)), or it has expired. |
| A CORS error in the browser console, no response | Your API doesn't allow the portal's address, or the `Authorization` header, for cross-origin requests. |
| `403` from your API | The API's own check: the reader lacks the scope or permission. **Try** is working. |
