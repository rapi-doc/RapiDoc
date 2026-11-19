---
title: Set up sign-in
description: Step by step, for any OpenID Connect provider - register the portal, configure sign-in and access rules, test locally, and deploy.
---

This page takes a portal that already builds (`npx rapidoc build`) to one that signs readers in with your company's identity provider. The example uses Okta; the provider-specific values are in [Identity providers](/docs/access/providers/), and [SSO with Microsoft Entra ID](/docs/access/entra-id/) is the same walkthrough with every Entra ID screen.

Before you begin, you need:

- the address the portal will have, here `https://developers.acme.com`,
- permission to register applications at your identity provider,
- a host that can run a Node.js server for `rapidoc serve` ([Deploy with rapidoc serve](/docs/deploy/rapidoc-serve/)): a static host can't check who is reading.

## 1. Register the portal at your provider

Create an OpenID Connect application for the portal, of the **web application** kind (authorization code flow):

- **Redirect URLs** (also called sign-in redirect URIs or callback URLs):
  - `https://developers.acme.com/_rapidoc/auth/callback`
  - `http://localhost:8080/_rapidoc/auth/callback`, for testing on your computer
- **Post-logout redirect URLs**, only if you'll set `logout: idp`: `https://developers.acme.com/` and `http://localhost:8080/`.

Then note:

- the **issuer** URL, the address of your provider's sign-in service (Okta: `https://acme.okta.com/oauth2/default`),
- the **client ID** of the new application,
- its **client secret**, if the provider gave it one.

Most providers make a web application a *confidential client*: it has a client secret, which `rapidoc serve` keeps. If your provider offers a *public client* with PKCE only (a "single-page" or "native" app), that works too, with no secret to store. Either way the portal uses the authorization code flow with PKCE.

For access rules by group, make the provider put the reader's groups in the sign-in token: see [Groups](/docs/access/providers/#groups) for your provider.

## 2. Configure the portal

In `rapidoc.config.yaml`, add `auth` (who signs readers in) and `access` (who may read what):

```yaml title="rapidoc.config.yaml"
site:
  url: https://developers.acme.com

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

Here everything is public except the partner guides (any signed-in reader) and the billing API (the `billing-team` group only). Use paths your portal has: a rule that matches no page fails the build. All keys: [The `auth` key](/docs/access/overview/#the-auth-key) and [Access rules](/docs/access/access-rules/).

The issuer and client ID are not secrets: they belong in the committed config. The client secret does not.

`rapidoc serve` comes from the package `@rapidoc/server`. A project made with `npm create rapidoc` already depends on it; otherwise add it: `npm install @rapidoc/server`.

## 3. Test on your computer

1. Put the secrets in a `.env` file in the project folder. Make sure `.gitignore` lists `.env` (the starter's does):

   ```bash title=".env"
   RAPIDOC_SESSION_SECRET=<output of: openssl rand -base64 32>
   # Only for a confidential client:
   RAPIDOC_AUTH_CLIENT_SECRET=<client secret>
   RAPIDOC_PUBLIC_URL=http://localhost:8080
   ```

   `RAPIDOC_SESSION_SECRET` encrypts the reader's session cookie. `RAPIDOC_PUBLIC_URL` is the portal's address, which the redirect URL is built from: here it overrides `site.url` (your production address).

2. Build, then serve with the `.env` file:

   ```bash
   npx rapidoc build
   node --env-file=.env node_modules/.bin/rapidoc serve dist
   ```

`rapidoc dev` doesn't do any of this: it shows every page, with no sign-in button. Sign-in and the rules work only with `rapidoc serve`.

## 4. Check that it works

Open `http://localhost:8080`:

| As | You should see |
| :--- | :--- |
| Signed out | Public pages open. Locked links show a lock icon. A partner guide sends you to Okta's sign-in, then back to that guide. |
| Signed in | Your name in the header and the partner guides. |
| Signed in, in `billing-team` | The billing API too. |
| Signed in, not in `billing-team` | An "access denied" page under `/apis/billing/`. |

If group rules never match, the server's log says so after each sign-in (`no "groups" claim for ...`): check [Groups](/docs/access/providers/#groups). For "redirect URI mismatch" errors, compare the provider's redirect URL with `RAPIDOC_PUBLIC_URL` + `/_rapidoc/auth/callback`, character for character.

## 5. Deploy

On the host, set the same environment variables in its secret or environment settings, with `RAPIDOC_PUBLIC_URL=https://developers.acme.com`:

- generate `RAPIDOC_SESSION_SECRET` once and keep it: the same on every instance and across restarts, or every reader is signed out,
- never put secrets in the repository or on the command line.

Then run `npx rapidoc build` and `npx rapidoc serve dist` there. Containers, several instances, proxies and every environment variable: [Deploy with rapidoc serve](/docs/deploy/rapidoc-serve/).

## Next steps

- [Access rules](/docs/access/access-rules/): rules by group or email, API versions, what is protected.
- [Try with the reader's token](/docs/access/try-it/): let **Try** call your API as the signed-in reader.
- [MCP server for agents](/docs/tools/mcp-server/): the same rules for AI agents.
