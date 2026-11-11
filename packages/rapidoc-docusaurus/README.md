# @rapidoc/docusaurus

Adds API reference pages to a [Docusaurus](https://docusaurus.io) site. An OpenAPI document becomes a doc page drawn by [RapiDoc](https://rapidocui.com) inside your theme, with the API's tags and operations in the docs sidebar.

```bash
npm install @rapidoc/docusaurus
```

**1. Add the plugin** and name your OpenAPI documents:

```js
// docusaurus.config.js
export default {
  // ...
  plugins: [["@rapidoc/docusaurus", { apis: { pets: "./openapi.yaml" } }]],
};
```

**2. Add the page**, for example `docs/api.mdx`:

```mdx
---
title: Pets API
hide_table_of_contents: true
---

import RapidocReference from '@rapidoc/docusaurus/client';

<RapidocReference api="pets" />
```

**3. List the operations in the sidebar:**

```js
// sidebars.js
import { rapidocSidebarSync } from "@rapidoc/docusaurus";

export default {
  docs: [
    "intro",
    {
      type: "category",
      label: "Pets API",
      items: rapidocSidebarSync({ spec: "./openapi.yaml", uiPath: "/docs/api", docId: "api" }),
    },
  ],
};
```

`docId` is the id of the doc from step 2. Docusaurus shows a sidebar only on docs that are in it, so the first item is that doc, labelled "Overview".

## What you get

- **Your theme's layout**: its navbar, sidebar and dark-mode switch stay; RapiDoc's own header and sidebar are off, and the reference follows the theme's light and dark modes.
- **Operations in the sidebar**: a category per tag with a link per operation. Each shows its HTTP method (GET, POST, DEL) in RapiDoc's colours, and deprecated operations are struck through. An operation link is a section of the page (`/docs/api#list-pets`), so moving between operations does not reload it, and the link of the operation that is showing is highlighted.
- **No request for the spec**: the documents in `apis` are read at build time, and each is loaded only by the page that shows it.
- **Try it and OAuth**: the console works as in RapiDoc; the OAuth return page is the route `rapidoc/oauth-receiver`.

## API

**Plugin options**: `apis` maps a name to an OpenAPI document: a JSON or YAML file (relative to the site folder), a URL or an object.

**`rapidocSidebarSync({ spec, uiPath, ... })`** returns sidebar items for one API. `sidebars.js` cannot wait for a promise, so this reads the spec in a short-lived Node process. `rapidocSidebar` is the same function returning a promise, for code that can wait.

| Option      | Default               |                                                                                                                                                                                        |
| :---------- | :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `spec`      | required              | The OpenAPI document: a JSON or YAML file (relative to `root`), a URL, or the object. It is read when the site is built                                                                |
| `uiPath`    | required              | URL path of the page that shows the reference, for example `/docs/api`. Operation links point to sections of it                                                                        |
| `methods`   | `"as-colored-text"`   | How each operation's HTTP method is shown: `"as-colored-text"`, `"as-plain-text"`, `"as-colored-block"`, or `false` for no method. Deprecated operations are struck through either way |
| `collapsed` |                       | `true` starts the tag groups collapsed                                                                                                                                                 |
| `docId`     |                       | Id of the doc that holds `<RapidocReference>`. It becomes the first item, which is what makes Docusaurus show this sidebar on that page                                                |
| `root`      | the working directory | Folder a relative `spec` file is resolved from                                                                                                                                         |

**`<RapidocReference>`** props:

| Prop      |                                                                                                                                                                         |
| :-------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api`     | A name from the plugin's `apis`                                                                                                                                         |
| `spec`    | The OpenAPI document as an object, instead of `api`                                                                                                                     |
| `options` | [Attributes of `<rapi-doc>`](https://rapidocui.com/api/), in kebab-case or camelCase: `options={{ allowTry: false, theme: 'jade' }}`. They win over the component's own |

## Notes

- The component sets `render-style="focused"`, `show-header="false"`, `show-side-nav="false"`, `auto-height="true"` and `color-scheme="auto"`. Change any of them through `options`.
- `hide_table_of_contents: true` gives the reference the width of the table-of-contents column.
- API pages are not in the site search: their content is drawn in the browser.
- Docusaurus 3. MIT.
