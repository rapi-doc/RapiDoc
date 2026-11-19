---
title: Single sign-on (SSO)
description: Put the portal behind your company's single sign-on (SSO) with OpenID Connect (Okta, Microsoft Entra ID, Google, Keycloak, Auth0), and decide who may read which pages and APIs.
---

When some guides or APIs are only for partners, customers or your own staff, readers can sign in with your company's single sign-on (SSO): Okta, Microsoft Entra ID, Google Workspace, Keycloak, Auth0, AWS Cognito, Ping, Authentik, Zitadel or any other OpenID Connect provider. SAML-only providers work through a broker ([Identity providers](/docs/access/providers/#saml-only-providers)).

This page explains the parts and how to choose. To set it up, follow [Set up sign-in](/docs/access/setup/), or [SSO with Microsoft Entra ID](/docs/access/entra-id/) for every Entra ID screen.

Add two keys to `rapidoc.config.yaml`:

- `auth`: readers sign in through your OpenID Connect provider.
- `access`: rules that decide who may read which pages, APIs and files.

```yaml title="rapidoc.config.yaml"
auth:
  issuer: https://acme.okta.com/oauth2/default
  clientId: portal-web
  scopes: [openid, profile, email, groups]

access:
  default: public
  rules:
    - path: /docs/partners/**
      allow: signed-in
    - path: /apis/billing/**
      allow: { groups: [billing-team] }
```

## Choose your setup

| You need | Setup |
| :--- | :--- |
| Some pages or APIs public, others only for some readers or groups | `auth` and `access`, served by `rapidoc serve`. |
| The whole portal private, every signed-in reader sees everything, with a sign-in button, per-reader search, and **Try** or agents using the reader's token | `auth` with `access.default: signed-in`, served by `rapidoc serve`. |
| The whole portal private, nothing more | A plain static build behind your SSO proxy, with no portal server ([Static hosting](/docs/deploy/static-hosting/#the-whole-portal-behind-your-sso)). |
| Only calls to your API need a sign-in; the docs stay public | No `auth`: readers sign in from the API page ([OAuth 2 sign-in for Try](/docs/api-reference/reference-pages/#oauth-2-sign-in-for-try)). |

[Try with the reader's token](/docs/access/try-it/) is optional: it is for portals whose API accepts tokens from the same provider.

:::caution[Who counts as "signed in"]
`signed-in` lets in everyone your provider lets sign in, not only your employees. Depending on how the provider is set up, that can include anyone with an account: self sign-up in Auth0 or Cognito, any Google account when the client isn't limited to your Workspace domain, other organizations in a multi-tenant Entra ID app, and guest users. Limit sign-in at the provider (in Entra ID, set **Assignment required?** to *Yes*; in Okta, assign the app to groups; turn off self sign-up), or use [group rules](/docs/access/access-rules/) instead of `signed-in`.
:::

## How it works

A static site can show a sign-in button and hide links in the browser, but its files are still there for anyone who asks: pages, OpenAPI specs, attachments and the search index can be downloaded with their URL. So a portal with `auth` is served by `rapidoc serve`, which checks the reader before it sends anything protected:

1. `rapidoc build` sorts the output by the rules: `dist/public/` (no protected content), `dist/protected/`, and `dist/rapidoc-server.json` with the rules.
2. `rapidoc serve dist` serves all three. On every request it reads the reader's session from an encrypted cookie, sends signed-out readers to your provider to sign in, and answers a reader the rules don't allow with "access denied". Search results are filtered per reader.

The contents of protected pages, specs and files never leave the server for a reader who may not see them. The public part stays plain static files, with cache headers so a CDN in front can hold the scripts, styles and fonts; `rapidoc serve` marks every protected answer as not cacheable.

What stays visible: the titles and paths of protected pages. Locked links keep their place in the header, sidebars and catalog, with a lock icon, so readers know there is more behind sign-in. Don't put anything confidential in a page title, a sidebar label or a URL.

:::danger[Never upload all of dist/ to a static host]
A static host serves every file it has, so `dist/protected/` would be readable by anyone. Run `rapidoc serve` on the whole `dist/`, or put only `dist/public/` on a static host or CDN.
:::

The pages stay static. When a page loads, the header's sign-in button and the lock icons ask the server who the reader is.

`rapidoc serve` also hosts your APIs as tools for AI agents, at `/mcp` ([Model Context Protocol](/docs/tools/mcp-server/)). It is on unless you set `RAPIDOC_MCP=off`. An agent without a token sees only the tools of public APIs. A signed-in reader can copy a token for their agent from the user menu: with it, the agent sees the tools of the APIs that reader may see, and calls them as that reader. The token lasts as long as a sign-in (`session.maxAge`). To revoke all tokens, change `RAPIDOC_SESSION_SECRET`, which also signs everyone out.


## The `auth` key

| Key | Meaning |
| :--- | :--- |
| `issuer` | The OpenID Connect issuer URL. `RAPIDOC_AUTH_ISSUER` overrides it. |
| `clientId` | The portal's client ID at the provider. `RAPIDOC_AUTH_CLIENT_ID` overrides it. |
| `scopes` | Scopes to request. Default `openid`, `profile`, `email`. |
| `claims.groups` | The claim with the reader's groups or roles, in the ID token or the provider's user info: a list, or names separated by spaces or commas. Default `groups`. Dotted paths work: `realm_access.roles`. |
| `session.maxAge` | How long a sign-in lasts: `30m`, `8h` (default), `7d`. |
| `logout` | `local` (default) signs out of the portal; `idp` also signs out at the provider, which then needs the portal URL as a post-logout redirect. |
| `label` | Text of the sign-in button. Default `Sign in`. |
| `audience` | The API the access token is for, sent as `audience` at sign-in (Auth0). `RAPIDOC_AUTH_AUDIENCE` overrides it. |
| `tryIt` | `true` gives **Try** the reader's access token. Default `false`. See [Try with the reader's token](/docs/access/try-it/). |

:::caution[Secrets are never config keys]
The session secret and the client secret are environment variables of `rapidoc serve`, because the config is committed to your repository and secrets must not be:

- `RAPIDOC_SESSION_SECRET` (required): 32 characters or more, for example from `openssl rand -base64 32`. It encrypts the session cookie. Generate it once and keep it the same on every instance and across restarts; a new value signs everyone out.
- `RAPIDOC_AUTH_CLIENT_SECRET`: only for a confidential client.

Every variable: [Deploy with rapidoc serve](/docs/deploy/rapidoc-serve/#environment-variables).
:::

## Words used in these pages

| Term | Meaning |
| :--- | :--- |
| Identity provider | The service your company signs in with (Okta, Entra ID, Google...). The portal speaks OpenID Connect to it. |
| Issuer | The URL of the provider's sign-in service, for example `https://acme.okta.com/oauth2/default`. The portal reads the rest of the provider's settings from it. |
| Client ID, client secret | The portal's application at the provider, and its password. A *confidential client* has a secret; a *public client* has none and proves itself with PKCE alone. |
| Redirect URL | Where the provider sends the reader after sign-in: `<portal URL>/_rapidoc/auth/callback`. Some providers say redirect URI or callback URL. |
| Portal URL | `RAPIDOC_PUBLIC_URL`, else `site.url`, else the address the request came to. |
| ID token, access token | What the provider returns after sign-in. The ID token says who the reader is; the portal reads the name, email and groups from it, and from the provider's user info. The access token lets **Try** call your API ([Try with the reader's token](/docs/access/try-it/)). |
| Claim | One field of a token, such as `email` or `groups`. |
| Scopes | What the portal asks the provider for at sign-in: `openid profile email`, sometimes `groups`. |
| Tenant | Your organization's own space at a provider, with its own users (Entra ID, Auth0). |

## Next steps

- [Set up sign-in](/docs/access/setup/): register, configure, test locally and deploy.
- [Identity providers](/docs/access/providers/): the issuer, groups and audience for each provider.
- [Access rules](/docs/access/access-rules/): who may read which pages, APIs and files.
- [Deploy with rapidoc serve](/docs/deploy/rapidoc-serve/): containers, proxies and every environment variable.
