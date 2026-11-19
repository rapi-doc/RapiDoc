---
title: Identity providers
description: The issuer URL, groups and Try audience for Okta, Microsoft Entra ID, Auth0, Keycloak, Google, AWS Cognito, Ping, Authentik and Zitadel, and SAML-only providers.
---

Single sign-on works with any OpenID Connect provider. This page has what differs between them; the steps are the same everywhere ([Set up sign-in](/docs/access/setup/)). For every Entra ID screen, see [SSO with Microsoft Entra ID](/docs/access/entra-id/).

At every provider, register a web application with the authorization code flow, its redirect URL `<portal URL>/_rapidoc/auth/callback`, and with `logout: idp` the portal URL as a post-logout redirect. A confidential client (with a client secret) and a public client (PKCE only) both work; set `RAPIDOC_AUTH_CLIENT_SECRET` only for a confidential client.

## Issuer

`auth.issuer` is the provider's sign-in service. Copy it exactly: with or without the trailing slash, as the provider shows it.

| Provider | `issuer` |
| :--- | :--- |
| Okta | `https://<org>.okta.com/oauth2/default` (or another authorization server's URL) |
| Microsoft Entra ID | `https://login.microsoftonline.com/<tenant ID>/v2.0` |
| Auth0 | `https://<tenant>.<region>.auth0.com/`, with the slash |
| Keycloak | `https://<host>/realms/<realm>` |
| Google | `https://accounts.google.com` |
| AWS Cognito | `https://cognito-idp.<region>.amazonaws.com/<user pool ID>` |
| PingOne | `https://auth.pingone.<region>/<environment ID>/as` |
| Authentik | `https://<host>/application/o/<application slug>/` |
| Zitadel | `https://<instance>.zitadel.cloud`, or your own domain |

A wrong issuer stops `rapidoc serve` at start, with the address it couldn't reach.

## Groups

[Access rules](/docs/access/access-rules/) by group read the claim named in `auth.claims.groups` (default `groups`) from the ID token or the provider's user info. It must be a list of names, or names separated by spaces or commas. A dot in `auth.claims.groups` means a nested field (`realm_access.roles`), so a claim name can't contain one.

| Provider | Setting |
| :--- | :--- |
| Okta | On the authorization server, add a claim named `groups` to the ID token: **Security → API → Authorization Servers → default → Claims → Add Claim**, value type **Groups**, filter **Matches regex** `.*` (or a narrower one). If you include it only with the `groups` scope, add `groups` to `scopes`. |
| Microsoft Entra ID | Use app roles and `claims: { groups: roles }`. The `groups` claim holds group IDs, not names, and is left out for users in more than 200 groups. Steps: [SSO with Microsoft Entra ID](/docs/access/entra-id/#2-create-app-roles-for-your-groups). |
| Auth0 | Auth0 sends no roles by default. Add them in a Post Login Action, under a claim name with no dots, and set `claims: { groups: https://acme/roles }`. See below. |
| Keycloak | Realm roles: `claims: { groups: realm_access.roles }`. In **Client scopes → roles → Mappers → realm roles**, turn on **Add to ID token** or **Add to userinfo**. |
| Google | No groups. Use `emails` rules instead (`*@acme.com`); see [Google Workspace](#google-workspace). |
| AWS Cognito | User pool groups arrive as `cognito:groups`: `claims: { groups: "cognito:groups" }`. |
| Ping, Authentik, Zitadel | Add a claim with the reader's groups as a list of names, and set `auth.claims.groups` to its name. Zitadel's own roles claim is an object, which rules can't read: map it to a list in an Action. |

The Auth0 Action, under **Actions → Library → Create Action → Login / Post Login**, then added to the Login flow:

```js title="Add roles to the ID token"
exports.onExecutePostLogin = async (event, api) => {
  api.idToken.setCustomClaim("https://acme/roles", event.authorization?.roles ?? []);
};
```

After a sign-in that carries no groups, `rapidoc serve` logs `no "<claim>" claim for <user>: group rules can't match`. Group changes apply at the reader's next sign-in.

## Audience for Try

With [`tryIt`](/docs/access/try-it/), **Try** sends the reader's access token to your API, so the token has to be for your API:

| Provider | Setting |
| :--- | :--- |
| Okta | Use your API's authorization server as `issuer`. Its tokens are for that server's audience. |
| Microsoft Entra ID | Add your API's scope to `scopes`, for example `api://<API's application ID>/access_as_user`. |
| Auth0 | Set `audience` to the API's identifier. |
| Keycloak | Add an **Audience** mapper for your API's client to the portal's client. |
| Google | Not possible: Google's tokens are for Google's own APIs. |
| AWS Cognito | Add your resource server's scopes to `scopes`. |

## Google Workspace

Google's ID token has no groups, so rules can use `signed-in` or `emails`; Google marks addresses as verified. To keep other Google accounts out, set the OAuth consent screen's **User type** to **Internal**: then only accounts of your Workspace organization can sign in.

## SAML-only providers

Put an OpenID Connect broker in front: Keycloak, Authentik, Zitadel or Ory Polis. The portal signs in with the broker, which signs in with your SAML provider. Each broker's documentation has the steps.

## One build, several tenants

`RAPIDOC_AUTH_ISSUER`, `RAPIDOC_AUTH_CLIENT_ID` and `RAPIDOC_AUTH_AUDIENCE` override the config, so the same build can run against a staging and a production tenant.
