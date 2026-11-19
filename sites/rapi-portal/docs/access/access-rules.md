---
title: Access rules
description: Decide who may read which pages, APIs and files - by sign-in, group or email.
---

The `access` key of `rapidoc.config.yaml` decides who may read which pages, API references, specs and files. It works together with [`auth`](/docs/access/overview/) and is enforced by `rapidoc serve`; `rapidoc dev` shows everything.

```yaml title="rapidoc.config.yaml"
access:
  default: public
  rules:
    - path: /docs/partners/**
      allow: signed-in
    - path: /apis/billing/**
      allow: { groups: [billing-team] }
    - path: /docs/internal/**
      allow: { emails: ['*@acme.com'] }
```

| Key | Meaning |
| :--- | :--- |
| `default` | Who may read what no rule matches: any `allow` value below. Default `public`. |
| `rules` | A list of `{ path, allow }`, checked top to bottom. |
| `rules[].path` | A URL path pattern, see below. |
| `rules[].allow` | Who may read what the path matches, see [Who may read](#who-may-read-allow). |

:::caution[A rule must match something]
A rule whose path matches no page or file **fails the build**, so a typo can't leave content public by accident. Write rules only for paths your portal has.
:::

## Rules

Rules are checked top to bottom, and **the first rule whose path matches decides**. Put specific rules before general ones.

`path` is a URL path on the site, starting with `/`:

- `*` matches one path segment: `/docs/*/setup` matches `/docs/orders/setup`.
- `**` matches any number of segments, including none: `/docs/internal/**` matches `/docs/internal` and everything under it.

Guides in `docs/internal/` are at `/docs/internal/...`, so the folder and the path match ([Project structure](/docs/getting-started/project-structure/#docs)).

## Who may read: `allow`

| `allow` | Who may read |
| :--- | :--- |
| `public` | Everyone, signed in or not. |
| `signed-in` | Anyone who has signed in: everyone your provider lets sign in, which may be more than your staff ([who counts as signed in](/docs/access/overview/#choose-your-setup)). |
| `{ groups: [a, b] }` | Signed-in readers in at least one of these groups. |
| `{ emails: ['*@acme.com', 'jo@partner.io'] }` | Signed-in readers whose verified email matches one of these. `*` matches any characters. |

`groups` and `emails` can be combined in one `allow`: matching either one is enough (OR), not both.

Groups come from the claim named in `auth.claims.groups` (default `groups`); see [Groups](/docs/access/providers/#groups) for how each provider sends them.

An email counts only when the provider vouches for it in the token: `email_verified: true`, or on Microsoft Entra ID `xms_edov: true`. That one means the email's domain is verified by the reader's organization, not that the reader confirmed the address. Entra ID sends neither by default: add `xms_edov` as an optional claim, or better, use app roles ([SSO with Microsoft Entra ID](/docs/access/entra-id/)). `rapidoc serve` logs a hint when a reader's email can't match email rules.

## APIs and their specs

An API's reference page, its tag pages, its spec file and its embedded operations are all under `/apis/<id>`, where `<id>` is the API's `id` under `apis:` ([APIs](/docs/configuration/apis/)). One rule covers all of them:

```yaml title="rapidoc.config.yaml"
access:
  rules:
    - path: /apis/billing/**
      allow: { groups: [finance] }
```

This covers every [version](/docs/api-reference/versions/) of the API too. To treat one version differently, put a rule for its URLs before the API's rule, since the first match decides:

```yaml title="rapidoc.config.yaml"
access:
  rules:
    - path: /apis/billing/v4-beta/**
      allow: { groups: [finance-beta] }
    - path: /apis/billing/**
      allow: { groups: [finance] }
```

## What is protected

- Pages, specs, and the files of your project's `public/` folder.
- Search results: the search indexes are split per rule, so readers only find what they may read.
- The sitemap lists only public pages.

Not protected: the titles and paths of protected pages. Locked links stay visible in menus and the catalog with a lock icon, so readers know there is more behind sign-in; don't put anything confidential in a title or a URL.

Always public: the site's scripts, styles and fonts, the RapiDoc bundle, the logo and the favicon. Paths under `/_rapidoc/` belong to the portal: don't put pages or files there.

## What readers get

| Request | Allowed | Signed out | Signed in, not allowed |
| :--- | :--- | :--- | :--- |
| Page | 200 | Sent to your provider's sign-in, then back to the page | 403 "access denied" page |
| Spec or other file | 200 | 401 | 403 |

## Build warnings

- A protected API whose spec is a URL: the build warns, because the spec stays public at that URL. Protect it where it is hosted.
- A public page that embeds an operation of a protected API: the build warns, because the operation won't load for readers who may not see the API.
