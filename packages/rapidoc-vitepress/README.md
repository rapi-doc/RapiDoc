# @rapidoc/vitepress

Adds API reference pages to a [VitePress](https://vitepress.dev) site. An OpenAPI document becomes a page drawn by [RapiDoc](https://rapidocui.com) inside your theme, with the API's tags and operations in the sidebar.

```bash
npm install @rapidoc/vitepress
```

**1. Wrap the config** and name your OpenAPI documents:

```js
// .vitepress/config.mjs
import { defineConfig } from "vitepress";
import { withRapidoc, rapidocSidebar } from "@rapidoc/vitepress";

export default withRapidoc(
  defineConfig({
    title: "My docs",
    themeConfig: {
      sidebar: [
        { text: "Guide", items: [{ text: "Getting started", link: "/" }] },
        { text: "Pets API", items: await rapidocSidebar("./openapi.yaml", "/api") },
      ],
    },
  }),
  { apis: { pets: "./openapi.yaml" } },
);
```

**2. Add the page**, for example `api.md`:

```md
---
title: Pets API
layout: page
---

<script setup>
import { RapidocReference } from "@rapidoc/vitepress/client";
</script>

<RapidocReference api="pets" />
```

The reference is at `/api`. `layout: page` gives it the full content width.

## What you get

- **Your theme's layout**: its nav, sidebar and dark-mode switch stay; RapiDoc's own header and sidebar are off, and the reference follows the theme's light and dark modes.
- **Operations in the sidebar**: `rapidocSidebar(spec, link)` returns an overview link and a group per tag with a link per operation. An operation link is a section of the page (`/api#list-pets`), so moving between operations does not reload it.
- **No request for the spec**: the documents in `apis` are read at build time and shipped with the page's script.
- **Try it and OAuth**: the console works as in RapiDoc; the OAuth return page is written to `rapidoc/oauth-receiver.html`.

## API

**`withRapidoc(config, { apis, root? })`** wraps the VitePress config. `apis` maps a name to an OpenAPI document: a JSON or YAML file (relative to `root`, default the working directory), a URL or an object. It also lets you write `<rapi-doc-mini>` directly in Markdown.

**`rapidocSidebar(spec, link, { collapsed?, root? })`** returns sidebar items for one API.

**`<RapidocReference>`** props:

| Prop      |                                                                                                                                                                          |
| :-------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api`     | A name from `apis`                                                                                                                                                       |
| `spec`    | The OpenAPI document itself, instead of `api`                                                                                                                            |
| `options` | [Attributes of `<rapi-doc>`](https://rapidocui.com/api/), in kebab-case or camelCase: `:options="{ allowTry: false, theme: 'jade' }"`. They win over the component's own |

## Notes

- The component sets `render-style="focused"`, `show-header="false"`, `show-side-nav="false"`, `auto-height="true"` and `color-scheme="auto"`. Change any of them through `options`.
- The OAuth return page loads the pinned `rapidoc` version from jsDelivr, because the site's own copy of the bundle has a hashed file name.
- API pages are not in the local search index: their content is drawn in the browser.
- Tested on VitePress 1.6 and 2.0 alpha. MIT.
