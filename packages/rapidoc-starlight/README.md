# @rapidoc/starlight

Adds API reference pages to a [Starlight](https://starlight.astro.build) site. Each OpenAPI document becomes a page drawn by [RapiDoc](https://rapidocui.com), inside Starlight's own layout, with the API's tags and operations in Starlight's sidebar.

```bash
npm install @rapidoc/starlight
```

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightRapidoc from "@rapidoc/starlight";

export default defineConfig({
  integrations: [
    starlight({
      title: "My docs",
      plugins: [starlightRapidoc({ path: "/api", spec: "./openapi.yaml" })],
    }),
  ],
});
```

The reference is at `/api`. The sidebar gets a group named after the API, with an overview link and a link for every operation, grouped by tag.

## What you get

- **Starlight's layout**: its header, sidebar, search and theme switch stay; RapiDoc's own header and sidebar are off.
- **The site's colours**: the reference follows Starlight's light and dark themes and sits on its background.
- **One page per API**: an operation link is a section of that page (`/api/#list-pets`), so moving between operations does not reload it.
- **No request for the spec**: the document is read at build time and written into the page.
- **Try it and OAuth**: the console works as in RapiDoc; the OAuth return page is built at `{path}/oauth-receiver/`.

## Options

| Option    | Default                     |                                                                                                                                                            |
| :-------- | :-------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `path`    | required                    | Where the reference page is served, for example `/api`                                                                                                     |
| `spec`    | required                    | The OpenAPI document: a JSON or YAML file (relative to the project root), a URL, or the object. It is read when the site is built                          |
| `title`   | the document's `info.title` | Page title                                                                                                                                                 |
| `label`   | the title                   | Sidebar group label                                                                                                                                        |
| `options` |                             | [Attributes of `<rapi-doc>`](https://rapidocui.com/api/), in kebab-case or camelCase: `{ allowTry: false, theme: "jade" }`. They win over the plugin's own |
| `sidebar` |                             | `false` adds nothing to the sidebar (link to the page yourself); `{ collapsed: true }` starts the tag groups collapsed                                     |

For several APIs, pass `{ apis: [{ path, spec }, { path, spec }] }`.

The sidebar group is added after your own `sidebar` entries. If your config has no `sidebar`, Starlight generates one from your files; adding the API group replaces that generated sidebar, so list your pages in `sidebar` too, for example with `{ label: "Guides", autogenerate: { directory: "guides" } }`.

## Notes

- The plugin sets `render-style="focused"`, `show-header="false"`, `show-side-nav="false"`, `auto-height="true"` and `color-scheme="auto"`. Change any of them through `options`.
- API pages are not in the site search (Pagefind): their content is drawn in the browser.
- Starlight 0.32 or later; Astro 5 or later. MIT.
