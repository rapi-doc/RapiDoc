# @rapidoc/embed

The shared core of RapiDoc integrations: plugins and middleware that add a [`<rapi-doc>`](https://rapidocui.com) API reference to a web framework, a documentation site or another tool. It renders the standard host page, lists the routes to serve and finds the files of the installed `rapidoc` build, so every integration takes the same options and sends the same HTML.

If you only want `<rapi-doc>` on a page, you don't need this package: see the [Quickstart](https://rapidocui.com/docs/get-started/quickstart/).

```bash
npm install @rapidoc/embed
```

```js
import { embedRoutes, renderHostPage, renderOAuthReceiverPage } from "@rapidoc/embed";
import { readAsset } from "@rapidoc/embed/node";

const options = { path: "/docs", specUrl: "/openapi.json", options: { renderStyle: "focused" } };

for (const route of embedRoutes(options)) {
  // route.kind: "page" → renderHostPage(options)
  //             "oauth-receiver" → renderOAuthReceiverPage(options)
  //             "file" → readAsset(route.file)
}
```

For a server framework there is a shorter way: `createResponder` matches the request and produces the response, so the integration only passes values in and out.

```js
import { createResponder } from "@rapidoc/embed";
import { readAsset } from "@rapidoc/embed/node";

const respond = createResponder(options, { readAsset });
const response = await respond({ method, path, ifNoneMatch }); // null: not for RapiDoc
// otherwise { status, headers, body }
```

[`examples/node-server.js`](./examples/node-server.js) is a complete integration on `node:http`.

## Options

| Option          | Default         |                                                                                                                     |
| :-------------- | :-------------- | :------------------------------------------------------------------------------------------------------------------ |
| `path`          | `/docs`         | Public URL path of the docs page, including any prefix the app is mounted under                                     |
| `specUrl`       |                 | URL of the OpenAPI document                                                                                         |
| `spec`          |                 | The OpenAPI document itself (object or JSON text), written into the page                                            |
| `title`         | `API Reference` | Page title                                                                                                          |
| `assets`        | `"bundled"`     | `"bundled"` (you serve the bundle), `"cdn"` (jsDelivr, pinned version with SRI hash) or `{ scriptUrl, integrity? }` |
| `options`       |                 | Attributes of `<rapi-doc>`, in kebab-case or camelCase                                                              |
| `head`, `css`   |                 | Markup and CSS added to the page as given                                                                           |
| `lang`, `nonce` | `en`, none      | Page language; Content-Security-Policy nonce                                                                        |

## Entry points

- `@rapidoc/embed`: the render functions, using the manifest of the `rapidoc` version this package depends on (`rapidocManifest`).
- `@rapidoc/embed/core`: the same functions with no imports, for runtimes without JSON imports. Pass `manifest` yourself for `assets: "cdn"`.
- `@rapidoc/embed/node`: `rapidocDistDir()`, `assetPath(file)`, `readAsset(file)`.
- `@rapidoc/embed/conformance/`: the [contract and its fixtures](./conformance/README.md), for integrations written in other languages.

Node.js 22.12 or later. MIT.
