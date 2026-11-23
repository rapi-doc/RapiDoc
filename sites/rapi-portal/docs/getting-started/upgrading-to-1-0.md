---
title: Upgrading from 0.2 to 1.0
description: Every change to make when moving a RapiDoc Portal from 0.2 to 1.0, with the old and the new form side by side.
tableOfContents: false
---

1.0 is the first stable release. Before it, names that were wrong or unclear were corrected once, with no old spellings kept: a name from 0.2 that is not listed as unchanged below is an error in 1.0, and the error says what to write. This page lists every change.

Update the packages together:

```bash
npm install @rapidoc/cli@1 @rapidoc/portal@1
```

and `@rapidoc/server@1` or `@rapidoc/mock@1` if your project has them.

## In your docs pages

| 0.2 | 1.0 |
| :--- | :--- |
| `{% api-operation spec="orders" ... /%}` | `{% api-operation api="orders" ... /%}`: the attribute takes an API's `id`, so it is called `api` |
| `{% workflow file="ship-a-parcel" id="..." /%}` | `{% workflow document="ship-a-parcel" id="..." /%}`: the `id` of an entry under `workflows:` |
| `{% tab name="npm" %}` | `{% tab label="npm" %}` (required) |
| `{% card-grid %}`: always two columns, `columns` ignored | `columns` works: 1 to 4, default 3. Write `{% card-grid columns=2 %}` to keep two |

A page that still has an old attribute stops the build with the attribute's name.

## In your own pages (`pages/*.astro`)

| 0.2 | 1.0 |
| :--- | :--- |
| `@rapidoc/portal/components/PortalHeader.astro` | `@rapidoc/portal/components/PortalPageHeader.astro` |
| `@rapidoc/portal/components/PortalFooter.astro` | `@rapidoc/portal/components/PortalPageFooter.astro` |

`PortalHeader` and `PortalFooter` from `@rapidoc/portal/components` are unchanged.

## The build

| 0.2 | 1.0 |
| :--- | :--- |
| Without `site.url`, pages had a canonical link and a sitemap on `https://developer.portal` | No canonical link and no sitemap, and one note in the build output. Set [`site.url`](/docs/configuration/site/) to get both |
| `rapidoc build --out-dir public` (or `docs`, or `.`) emptied that folder | Refused: the output folder must be a folder of its own, such as `dist` |
| An API whose spec could not be loaded got a page with an empty sidebar | The build stops and names the API and the spec |
| A remote spec (`spec: https://...`) was not read at build time, and its sidebar linked to tag pages that did not exist | It is fetched once per build and gets its tag pages. A build fails when it cannot be fetched |
| Search results for operations linked to `/apis/<id>#<operationId>` | They link to the operation on its tag page, as the sidebar does. Operations hidden with `x-internal` or `x-hidden` are not in the index |
| `rapidoc dev` and `rapidoc mock` listened on every network interface | `localhost` only. In a container or on a shared server, add `--host 0.0.0.0` |

## The CLI

| 0.2 | 1.0 |
| :--- | :--- |
| `rapidoc migrate` replaced an existing `rapidoc.config.yaml` when it could not ask (CI, `--yes`) | It stops unless you pass `--force` |
| `rapidoc migrate` worked in the current folder only | `rapidoc migrate [dir]` |

## `rapidoc serve`

| 0.2 | 1.0 |
| :--- | :--- |
| With sign-in and no `site.url` or `RAPIDOC_PUBLIC_URL`, the address came from each request | Set one of the two. Without it the server answers only on `localhost` |
| A sign-in provider that could not be reached stopped the server from starting | The server starts and serves public pages; sign-in works as soon as the provider answers. A wrong issuer still stops it |
| A portal with sign-in could be shown in a frame on any site | Only on its own site. Allow others with [`RAPIDOC_FRAME_ANCESTORS`](/docs/deploy/rapidoc-serve/#environment-variables) |
| A build folder whose `rapidoc-server.json` was missing was served as plain files | Refused when the folder has a `protected/` folder |
| The log line of a sign-in had the reader's email | The reader's id only |

Readers sign in once more after the update: sessions from 0.2 stay valid, but the saved token for **Try** and agent tokens do not.

## If you call the packages from code

| Package | 0.2 | 1.0 |
| :--- | :--- | :--- |
| `@rapidoc/portal` | `normalizeConfig(raw, dir)`, `checkReferences` | `resolveConfig(raw, dir)`: validates, checks references and normalizes |
| `@rapidoc/portal` | `compileMarkdoc`, `compileDocFile`, `createMarkdocConfig`, `markdocTags`, `extractHeadings`, `searchRecords`, and the `@rapidoc/portal/markdoc` entry | Removed. The build's Markdoc rendering is the only one; `buildSearchIndex` stays |
| `@rapidoc/server` | `createApp()` returned `{ app, settings, mcp }`; `startServer()` `{ url, port, settings, mcp, close }` | `{ app, summary }` and `{ url, port, summary, close }`. `summary` has `mode`, `basePath`, `mountPath`, `publicUrl`, `issuer`, `clientId`, `providerReady`, `access` and `mcp`, and no secret |
| `@rapidoc/server` | `loadSettings` | Removed from the entry |
| `@rapidoc/mock` | `createMockApp()` and `startMockServer()` returned a `verifier` | No longer returned |
| `@rapidoc/mock` | `tokenScopes`, `CONTROL_PREFIX`, `CONFIG_FILE`, `STATEFUL_RULES`, `ImportError`, and the lint helpers | Removed from the entry |
| `@rapidoc/cli` | Files under `@rapidoc/cli/src/` could be imported | The package is a command; nothing is importable |
| `@rapidoc/prerender` | `usePathInNav`; `renderSchema({ style })`; `apiKey`; `getNavFilterHtml({ placeholder })` | `usePathInNavBar`; `schemaStyle`; `apiKeyName`; `searchPlaceholder` |
| `@rapidoc/prerender` | An option name it did not know was ignored | An error that lists the valid names (`renderRapiDoc` still passes unknown names to the element as attributes) |
| `@rapidoc/prerender` | `renderRapiDoc` wrote `schema-style="table"`, `layout="column"` and 14 more attributes by default | Only the options you pass; the rest are `<rapi-doc>`'s own defaults (`tree`, `row`) |
| `@rapidoc/prerender` | A spec that could not be loaded gave an almost empty result | An error: `Cannot load the OpenAPI spec ...`. A mistyped path is `file not found`, not a request to `localhost` |
| `@rapidoc/prerender` | `getSpecNavigation` operations were the parser's objects | `method`, `path`, `summary`, `description`, `elementId`, `deprecated`, `operationId`, `isWebhook` |
| `@rapidoc/prerender` | A default export; `resolveSpecInput`, `renderNavBarHtml`, `renderTemplateToString`, `escapeHtml`, `getMethodBadge` on the entry | Named imports only; those helpers are not public |
| `@rapidoc/mcp` | `parseMcpEnabled`; `generateHostConfigs(name, { schemes })` | Removed; `generateHostConfigs(name, { env })` with `hostEnvFor(manifest)` |

## MCP: exported servers, `rapidoc mcp serve` and the hosted `/mcp`

Settings are read only from variables that start with `MCP_`, so a security scheme called `token` can no longer pick up an unrelated `TOKEN` variable.

| 0.2 | 1.0 |
| :--- | :--- |
| A scheme's credential in `<SCHEME>` (`PETSTORE_AUTH`), or `API_KEY` when the API has one scheme | `MCP_AUTH_<SCHEME>` (`MCP_AUTH_PETSTORE_AUTH`). There is no `API_KEY` shortcut |
| HTTP Basic as `<SCHEME>=user:password` | `MCP_AUTH_<SCHEME>_USERNAME` and `MCP_AUTH_<SCHEME>_PASSWORD` |
| `API_BASE_URL` | `MCP_BASE_URL`, or `MCP_BASE_URL_<SOURCE>` for each API when there are several. On the hosted `/mcp`: `MCP_BASE_URL_<API ID>` |
| `EXTERNAL_HOSTS` | `MCP_EXTERNAL_HOSTS` |
| A spec with no server, or a relative one, called `http://localhost` | No call is made: set the base URL. `rapidoc mcp serve` stops and says so; the hosted `/mcp` leaves that API's tools out and logs why |
| A `GET` on a path such as `/categories` or `/schemas` became a resource, not a tool | Every operation is a tool. A resource needs `x-mcp-resource: true`, and is then both |
| Two operations with the same name became `name` and `name_2`, by their order in the spec | Each gets a suffix made from its method and path (`name_3f9a1c2e`), so reordering the spec renames nothing. Names over 64 characters are shortened the same way |
| Two schemes whose ids give the same variable (`api-key`, `apiKey`) shared it | Building the tools stops and names both |

If you published agent instructions that name tools, check the names of operations that shared an `operationId`.

## The mock

| 0.2 | 1.0 |
| :--- | :--- |
| An operation whose `security` names a scheme the spec does not define was open | It answers `401`, and the mock warns at start |
| Any number of `X-Mock-Session` sessions | 1000 per API; the one used longest ago starts from the seed data again |
| A spec could be imported (`POST /__mock/apis`) by any request from the machine | Only by a program on the machine or the mock's own page, and an imported spec cannot read other local files |
