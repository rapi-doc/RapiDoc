---
title: What's new in 1.0
description: RapiDoc Portal 1.0 is the first stable release, ready for production. What the version promise covers, how to upgrade from 0.x, and the new sidebar.
---

RapiDoc Portal **1.0** is the first stable release, ready for production. It has been out since RapiDoc 12.1.0; with 1.0 its versions make a promise: **a change that breaks your portal comes only in a new major version.**

## What the promise covers

- Your `rapidoc.config.yaml`: its keys and what they do.
- The [Markdoc tags](/docs/writing/markdoc/) and their attributes.
- The [`rapidoc` commands](/docs/reference/cli/) and their flags.
- The [programmatic API](/docs/reference/programmatic-api/) of each package.

A minor version (1.1) adds features; a patch (1.0.1) fixes bugs. Neither asks you to change your project.

## Which packages are 1.0

| Package | What it is |
| :-- | :-- |
| `@rapidoc/cli` | The `rapidoc` command |
| `@rapidoc/portal` | The portal engine |
| `@rapidoc/server` | `rapidoc serve`: sign-in and access rules |
| `@rapidoc/mock` | `rapidoc mock`: the mock server |
| `@rapidoc/prerender` | The API pages' pre-rendered sidebar and reference |
| `@rapidoc/mcp` | MCP tools for your APIs and workflows |
| `create-rapidoc` | `npm create rapidoc` |

They are released together, always with the same version. The API reference pages use [RapiDoc](https://rapidocui.com) 15, released at the same time.

## Upgrading from 0.x

Update the two packages in your portal's folder:

```bash
npm install @rapidoc/cli@1 @rapidoc/portal@1
```

If you use `rapidoc serve` or `rapidoc mock`, update `@rapidoc/server` or `@rapidoc/mock` too. New projects from `npm create rapidoc` start on 1.0.

Before making the promise, names that were wrong or unclear were corrected, and a few defaults were made safer. [Upgrading from 0.2 to 1.0](/docs/getting-started/upgrading-to-1-0/) lists every change with the old and new form. The ones most portals meet:

- **Two tag attributes were renamed:** `{% api-operation api="..." %}` (was `spec`) and `{% workflow document="..." %}` (was `file`).
- **`rapidoc serve` with sign-in needs the portal's address**: set `site.url` in the config or `RAPIDOC_PUBLIC_URL`.
- **`rapidoc mock` and `rapidoc dev` listen on `localhost`.** In a container or on a shared server, add `--host 0.0.0.0`.

1.0 also fixes security problems found in a review of all the code before the release, one of them in sign-in: update a portal that runs `rapidoc serve`.

## A new sidebar

The guides' sidebar and the API pages' sidebar now look the same, with three levels:

- **Section labels:** a tab's top-level groups are small upper-case labels that stay open. A group with `collapsed: true` gets an arrow. In an API's sidebar the labels are Overview and its tag groups, or its tags when it has none.
- **Rows with icons:** the items of those groups, with the `icon` you give them.
- **Compact rows under a guide line:** deeper pages, and an API's operations with the method first.

The current page is a filled block. A top-level group's `icon` is no longer shown. See [Navigation](/docs/configuration/navigation/).
