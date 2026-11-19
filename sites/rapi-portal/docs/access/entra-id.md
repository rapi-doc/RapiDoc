---
title: SSO with Microsoft Entra ID
description: Step by step - put the portal behind Microsoft Entra ID (Azure AD) single sign-on, and give groups of employees access to their APIs with app roles.
---

This guide puts a portal behind your company's Microsoft Entra ID (formerly Azure AD) sign-in: everyone in the company can read the portal, and only the billing team can read the billing API. Other providers work the same way; their differences are in [Identity providers](/docs/access/providers/).

It follows the same steps as [Set up sign-in](/docs/access/setup/), with every Entra ID screen. Before you begin, you need:

- a portal that builds (`npx rapidoc build`),
- the address it will have, here `https://developers.acme.com`,
- the right to register applications in your Entra tenant.

## 1. Register the portal in Entra ID

In the [Microsoft Entra admin center](https://entra.microsoft.com), open **Identity → Applications → App registrations** and choose **New registration**:

- **Name**: `Developer portal`.
- **Supported account types**: *Accounts in this organizational directory only*.
- **Redirect URI**: platform **Web**, URL `https://developers.acme.com/_rapidoc/auth/callback`.

For local testing, add `http://localhost:8080/_rapidoc/auth/callback` as a second redirect URI under **Authentication**.

From the app's **Overview**, note:

- **Application (client) ID**, for `auth.clientId`.
- **Directory (tenant) ID**, for the issuer: `https://login.microsoftonline.com/<tenant ID>/v2.0`.

Under **Certificates & secrets**, create a **client secret** and copy its **Value** (not its Secret ID).

:::caution[Copy the secret now]
Entra ID shows the secret's value only once. Store it in your secret manager right away; if it's lost, create a new one.
:::

## 2. Create app roles for your groups

Entra ID's `groups` claim holds group IDs, not names, and is left out for users in more than 200 groups. App roles avoid both problems.

Under **App roles**, choose **Create app role**:

- **Display name**: `Billing team`
- **Allowed member types**: *Users/Groups*
- **Value**: `billing-team`. This is the name your access rules use.

Then open **Identity → Applications → Enterprise applications → Developer portal → Users and groups**, choose **Add user/group**, and assign the billing team's Entra group (or single users) to the **Billing team** role.

Optional: to let only the users and groups you assign sign in at all, set **Properties → Assignment required?** to *Yes* on the same enterprise application. Then assign everyone who should read the portal, not only the billing team.

## 3. Configure the portal

```yaml title="rapidoc.config.yaml"
site:
  url: https://developers.acme.com

auth:
  issuer: https://login.microsoftonline.com/<tenant ID>/v2.0
  clientId: <application (client) ID>
  scopes: [openid, profile, email]
  claims:
    groups: roles # app roles arrive in the roles claim

access:
  default: signed-in # everyone the tenant lets sign in, guests included
  rules:
    - path: /apis/billing/**
      allow: { groups: [billing-team] }
    - path: /docs/billing/** # only if you have guides under docs/billing/
      allow: { groups: [billing-team] }
```

`signed-in` admits every account your tenant lets sign in to the app, including guest users. To limit the portal to people you choose, set **Assignment required?** to *Yes* (step 2) and assign them. A rule whose path matches no page fails the build, so keep only the rules for paths your portal has.

The issuer and client ID are not secrets, so they can live in the committed config. To use one build against a staging and a production tenant, set `RAPIDOC_AUTH_ISSUER` and `RAPIDOC_AUTH_CLIENT_ID` instead.

## 4. Build and run

Set three environment variables where the portal runs, from your secret manager or the host's environment settings, never in the repository or on the command line:

| Variable | Value |
| :--- | :--- |
| `RAPIDOC_SESSION_SECRET` | Generate once with `openssl rand -base64 32` and keep it: the same on every instance and across restarts, or everyone is signed out. |
| `RAPIDOC_AUTH_CLIENT_SECRET` | The client secret's **Value** from step 1. |
| `RAPIDOC_PUBLIC_URL` | `https://developers.acme.com`, the address in the redirect URI. |

Then build and serve:

```bash
npx rapidoc build
npx rapidoc serve dist   # port 8080, or $PORT
```

To try it on your computer first, put the same variables in a `.env` file with `RAPIDOC_PUBLIC_URL=http://localhost:8080`, as in [Set up sign-in](/docs/access/setup/#3-test-on-your-computer).

## 5. Check that it works

| As | You should see |
| :--- | :--- |
| Signed out | The Microsoft sign-in page, then the page you asked for. |
| A user with the **Billing team** role | Every page, including the billing API under `/apis/billing/`. |
| A user without it | Every page except the billing API: an "access denied" page there. |

Role changes apply at the user's next sign-in.

To run it in a container or behind a load balancer, see [Deploy with rapidoc serve](/docs/deploy/rapidoc-serve/).

## Troubleshooting

| Problem | Fix |
| :--- | :--- |
| `AADSTS50011`: the redirect URI does not match | The redirect URI in the app registration must equal `<RAPIDOC_PUBLIC_URL>/_rapidoc/auth/callback`, including `https` and any path the portal is served under. |
| `AADSTS7000215`: invalid client secret | Use the secret's **Value**, not its **Secret ID**, and check that it hasn't expired. |
| Signed in, but group rules deny access | Check that the user or their group is assigned to the app role, and that `auth.claims.groups` is `roles`. The server's log says when a sign-in carries no roles. Role changes apply at the next sign-in. |
| Email rules never match | Use app roles instead. Email rules need the optional claim `xms_edov` in the ID token (**Token configuration**), and match only users who have an email address in their Entra ID profile ([Access rules](/docs/access/access-rules/#who-may-read-allow)). |
