---
title: Configuration overview
description: How rapidoc.config.yaml is organized, its conventions, and editor autocomplete.
---

Everything about the site lives in `rapidoc.config.yaml` at the project root. Only `site.title` is required, so the smallest config is:

```yaml title="rapidoc.config.yaml"
site:
  title: Acme Developers
```

Every top-level key:

```yaml
# yaml-language-server: $schema=./node_modules/@rapidoc/portal/schema.json
site:        # title, logo, favicon, URL, banner
theme:       # accent color, light/dark mode, fonts
head:        # extra tags in every page's <head> (analytics, fonts)
header:      # row 1: links and menus right of the search
navigation:  # row 2: one tab per entry; documentation tabs have a sidebar
apis:        # your OpenAPI specs
workflows:   # Arazzo workflow files
docs:        # docs folder, table of contents, edit links
footer:      # call to action, columns, social links, newsletter
rapidoc:     # <rapi-doc> attributes for API reference pages
search:      # full-text search on or off
llms:        # llms.txt and Markdown copies for AI assistants
redirects:   # old URLs to new ones
lint:        # rules for rapidoc lint
auth:        # single sign-on with OpenID Connect (optional)
access:      # who may read what (optional)
```

## Conventions

The same three words mean the same thing everywhere:

- `label` is the text of anything clickable.
- `href` is any URL: a path on this site (`/docs/intro`) or a full URL.
- `items` are children: dropdown items, mega-menu links, sidebar groups.

A navigation item's kind comes from its keys:

- `slug` (or a plain string): a page in `docs/`, by its path without the extension;
- `href`: a link;
- `items`: a group;
- `autogenerate`: every page in a folder of `docs/`;
- `api`: an API's reference page;
- `catalog`: the API catalog.

See [Navigation](/docs/configuration/navigation/).

## Strict by design

The schema rejects unknown keys. A typo fails the build with its path and, where it can, the key you meant:

```text
navigation[0].items[2]: unknown key "path" (use href (links) or slug (doc pages))
```

## Autocomplete in your editor

The starter's config already starts with this line. It points editors that understand YAML schemas (VS Code with the YAML extension, JetBrains IDEs) at the JSON Schema that ships as `@rapidoc/portal/schema.json`:

```yaml title="rapidoc.config.yaml"
# yaml-language-server: $schema=./node_modules/@rapidoc/portal/schema.json
```

You get completion, descriptions on hover, and errors as you type.

## Other formats

The engine also reads `rapidoc.config.yml`, `.json`, `.js`, `.mjs` and `.ts`. A JavaScript or TypeScript config default-exports the same object.

## The sections

- [Site](/docs/configuration/site/): title, logo, favicon, URL, banner
- [Theme](/docs/configuration/theme/): accent color, mode, fonts
- [Header](/docs/configuration/header/): links, dropdowns, mega-menus
- [Navigation](/docs/configuration/navigation/): tabs and sidebars
- [APIs](/docs/configuration/apis/): specs, ids, categories
- [Workflows](/docs/configuration/workflows/): Arazzo files, drawn and runnable in the docs
- [Footer](/docs/configuration/footer/): call to action, columns, social links, newsletter
- [Docs, search and redirects](/docs/configuration/docs-search-redirects/): the docs folder, edit links, search, old URLs
- [LLM output](/docs/configuration/llms/): `llms.txt` and Markdown copies of every page
- [Single sign-on (SSO)](/docs/access/overview/): `auth` and `access`, for private pages and APIs

Every key in one table: [Configuration keys](/docs/reference/config/).
