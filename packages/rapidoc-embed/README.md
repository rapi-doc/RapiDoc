# @rapidoc/embed

The shared core of RapiDoc integrations: plugins and middleware that add a [`<rapi-doc>`](https://rapidocui.com) API reference to a web framework, a documentation site or another tool. It renders the standard host page, lists the routes to serve and finds the files of the installed `rapidoc` build, so every integration takes the same options and sends the same HTML.

If you only want `<rapi-doc>` on a page, you don't need this package: see the [Quickstart](https://rapidocui.com/docs/rapidoc/get-started/quickstart/).

```bash
npm install @rapidoc/embed
```

```js
import { embedRoutes, renderHostPage, renderOAuthReceiverPage } from "@rapidoc/embed";
import { readAsset } from "@rapidoc/embed/node";

const options = { uiPath: "/docs", specUrl: "/openapi.json", options: { renderStyle: "focused" } };

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
const response = await respond({ method, path, mount, ifNoneMatch }); // null: not for RapiDoc
// otherwise { status, headers, body }
```

[`examples/node-server.js`](./examples/node-server.js) is a complete integration on `node:http`.

## Options

| Option          | Default         |                                                                                                                                                                                                    |
| :-------------- | :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `uiPath`        | `/docs`         | URL path of the reference page. An integration takes it as the path within the app or mount it is registered in; the render functions write it into the page, so they take the public path (below) |
| `specUrl`       |                 | URL of the OpenAPI document, which the browser fetches when the page opens                                                                                                                         |
| `spec`          |                 | The OpenAPI document itself (object or JSON text), written into the page so the browser makes no request for it. With both, `spec` is shown and `specUrl` is the download link                     |
| `title`         | `API Reference` | Page title                                                                                                                                                                                         |
| `assets`        | `"bundled"`     | `"bundled"` (you serve the bundle), `"cdn"` (jsDelivr, pinned version with SRI hash) or `{ scriptUrl, integrity? }`                                                                                |
| `options`       |                 | Attributes of `<rapi-doc>`, in kebab-case or camelCase                                                                                                                                             |
| `head`, `css`   |                 | Markup and CSS added to the page as given                                                                                                                                                          |
| `lang`, `nonce` | `en`, none      | Page language; Content-Security-Policy nonce                                                                                                                                                       |

An option that is `null` or an empty string counts as absent, so its default applies.

## Paths under a mount

`uiPath` is what the integration's user writes: the path within the app, router or plugin the integration is registered in. `renderHostPage`, `renderOAuthReceiverPage` and `embedUrls` write the path they are given into the page, so they need the public path, the one the browser requests. `createResponder` joins the two: pass the prefix the framework took off the request as `mount`, and the pages get `mount` + `uiPath`.

```js
const respond = createResponder({ uiPath: "/docs" }, { readAsset });
await respond({ method, path: "/docs", mount: "/api" }); // the page's script is /api/docs/rapidoc-min.js
```

Behind a proxy that strips a prefix the app never sees, set the option `publicUiPath` to the page's whole public path.

## Caching

`createResponder` sends the pages and the bundle with `cache-control: no-cache`, and the bundle with an `ETag` (its SRI hash). The browser asks on every visit and gets a `304` until a deploy brings another RapiDoc build, so nobody keeps an old bundle next to a new page. Every response has `x-content-type-options: nosniff`.

## Versions

Each release serves the current major of RapiDoc (`rapidocManifest.version`). A new RapiDoc major arrives as a minor release of this package and of the integrations built on it.

The contract has a version of its own (`CONTRACT_VERSION`), which is not this package's version: see the [contract](./conformance/README.md).

## Entry points

- `@rapidoc/embed`: the render functions, using the manifest of the `rapidoc` version this package depends on (`rapidocManifest`).
- `@rapidoc/embed/core`: the same functions with no imports, for runtimes without JSON imports. Pass `manifest` yourself for `assets: "cdn"`.
- `@rapidoc/embed/node`: `rapidocDistDir()`, `assetPath(file)`, `readAsset(file)`.
- `@rapidoc/embed/sidebar`: `methodLabel`, `operationClass`, `sidebarCss`, for docs-site integrations that show operations in their own sidebar. No JSON import, so `require()` can load it.
- `@rapidoc/embed/conformance/`: the [contract and its fixtures](./conformance/README.md), for integrations written in other languages.

Node.js 22.12 or later. MIT.
