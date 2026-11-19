---
title: Configuration keys
description: Every key of rapidoc.config.yaml in one place.
sidebar:
  order: 2
---

Every key, with its default. The guides explain each section: [Configuration](/docs/configuration/overview/).

## `site`

| Key | Type | Default |
| :--- | :--- | :--- |
| `site.title` | string, **required** | |
| `site.description` | string | |
| `site.url` | URL | |
| `site.logo.src` | path, or `{ light, dark }` | |
| `site.logo.text` | string | the title when there is no image |
| `site.logo.alt` | string | |
| `site.logo.href` | URL | `/` |
| `site.favicon` | path | |
| `site.image` | path (needs `site.url`) or URL | |
| `site.titleTemplate` | string with `%s` | `'%s \| <title>'` |
| `site.noindex` | boolean | `false` |
| `site.banner.message` | string, required in a banner | |
| `site.banner.href` | URL | |
| `site.banner.dismissible` | boolean | `true` |
| `site.banner.background`, `site.banner.color` | CSS color | |

## `theme`

| Key | Type | Default |
| :--- | :--- | :--- |
| `theme.primary` | CSS color | `#f76b39` |
| `theme.mode` | `auto` \| `light` \| `dark` | `auto` |
| `theme.fonts.sans`, `theme.fonts.mono` | `{ family, url? }` | System fonts |
| `theme.css` | path, or list of paths | |

## `header`

| Key | Type | Default |
| :--- | :--- | :--- |
| `header.themeSwitcher` | boolean | `true` |
| `header.links[]` | `{ label, href \| items, icon?, style? }` | |
| `header.links[].style` | `link` \| `button` \| `primary` | `link` |
| `header.links[].items[]` | `{ label, href, icon?, description?, badge?, items? }` | |

## `navigation[]`

| Key | Type |
| :--- | :--- |
| `label` | string, required |
| `icon` | Phosphor icon name |
| `badge` | string, or `{ text, variant }` |
| exactly one of: `items`, `autogenerate`, `api`, `catalog: true`, `href` | the kind of tab |

Sidebar items: a page path string, or `{ label?, slug \| href \| items \| autogenerate \| api, version?, icon?, badge?, collapsed? }`.

A tab or sidebar item with `api` can have `version`: one of that API's versions.

## `apis[]`

| Key | Type | Default |
| :--- | :--- | :--- |
| `id` | lowercase letters, digits, dashes; **required** | |
| `spec` | path or URL; **required** unless `versions` is set | |
| `versions` | list of spec paths or `{ spec, version?, label? }`, instead of `spec` | the first is the default |
| `title` | string | `info.title` |
| `description` | string | `info.description` |
| `category` | string | `General` |

### `apis[].versions[]`

| Key | Type | Default |
| :--- | :--- | :--- |
| `spec` | path or URL, **required** | |
| `version` | lowercase letters, digits, dots, dashes; **required** for a URL spec | `info.version` |
| `label` | string | `info.version` |

## `workflows[]`

| Key | Type | Default |
| :--- | :--- | :--- |
| `file` | path to an Arazzo 1.x file; **required** | |
| `id` | lowercase letters, digits, dashes | the file name without `.arazzo.yaml` |
| `sources` | map of source description name → API id | sources named like an API id |

See [Workflows](/docs/configuration/workflows/).

## `docs`

| Key | Type | Default |
| :--- | :--- | :--- |
| `docs.dir` | path | `./docs` |
| `docs.toc` | `{ minHeadingLevel, maxHeadingLevel }` or `false` | levels 2 to 3 |
| `docs.editUrl` | URL | |

## `footer` (or `false`)

| Key | Type | Default |
| :--- | :--- | :--- |
| `footer.cta` | `{ title, description?, links? }`, up to 3 links | |
| `footer.newsletter` | `{ action, field?, title?, description?, button? }` | field `email`, button `Subscribe` |
| `footer.columns[]` | `{ title, links: [{ label, href }] }` | |
| `footer.social[]` | `{ icon: github \| x \| discord \| linkedin \| youtube, href }` | |
| `footer.copyright` | string | |
| `footer.branding` | boolean | `true` |

## Others

| Key | Type | Default |
| :--- | :--- | :--- |
| `rapidoc` | map of `<rapi-doc>` attributes | see [RapiDoc attributes](/docs/api-reference/rapidoc-attributes/) |
| `head[]` | `{ script }`, `{ link }` or `{ meta }`; `script` is attributes or inline code | |
| `search` | boolean | `true` |
| `llms` | `false`, or `{ description?, pageActions? }` | on; see [LLM output](/docs/configuration/llms/) |
| `llms.pageActions` | list of `copy`, `markdown`, `chatgpt`, `claude`, or `false` | all four |
| `redirects[]` | `{ from, to }` | |

## `auth`

| Key | Type | Default |
| :--- | :--- | :--- |
| `auth.provider` | `oidc` | `oidc` |
| `auth.issuer` | URL | `$RAPIDOC_AUTH_ISSUER` |
| `auth.clientId` | string | `$RAPIDOC_AUTH_CLIENT_ID` |
| `auth.scopes` | string list | `openid, profile, email` |
| `auth.claims.groups` | claim name or dotted path | `groups` |
| `auth.session.maxAge` | `30m`, `8h`, `7d` | `8h` |
| `auth.logout` | `local` \| `idp` | `local` |
| `auth.label` | string | `Sign in` |
| `auth.audience` | string | `$RAPIDOC_AUTH_AUDIENCE` |
| `auth.tryIt` | boolean | `false` |

## `access`

| Key | Type | Default |
| :--- | :--- | :--- |
| `access.default` | allow | `public` |
| `access.rules[]` | `{ path, allow }`, first match wins | |

An allow is `public`, `signed-in`, or `{ groups?, emails? }`.

## `lint`

Settings for [`rapidoc lint`](/docs/tools/lint/); the build ignores them.

| Key | Type | Default |
| :--- | :--- | :--- |
| `lint.rules` | `{ <rule>: error \| warn \| off }` | each rule's own default |
| `lint.apis` | `{ <api id>: { <rule>: severity } }`, wins over `rules` | |

## JSON Schema

The full schema ships as `@rapidoc/portal/schema.json`. Point your editor at it for autocomplete:

```yaml title="rapidoc.config.yaml"
# yaml-language-server: $schema=./node_modules/@rapidoc/portal/schema.json
```
