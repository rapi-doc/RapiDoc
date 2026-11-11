# @rapidoc/hono

Serves a [RapiDoc](https://rapidocui.com) API reference from your [Hono](https://hono.dev) app: an interactive page for your OpenAPI document, with a console to try requests.

```bash
npm install @rapidoc/hono
```

```js
import { Hono } from "hono";
import { rapidoc } from "@rapidoc/hono";

const app = new Hono();

app.get("/openapi.json", (c) => c.json(openApiDocument));
app.use(rapidoc({ specUrl: "/openapi.json" }));
```

Open `/docs`. The middleware answers `GET` and `HEAD` on that path and the files under it, and passes every other request on.

## Options

| Option         | Default         |                                                                                                                                                                                            |
| :------------- | :-------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `uiPath`       | `/docs`         | URL path the reference page is served at. Give the full path, including any base path the app is mounted under. `path` is its old name, still read                                         |
| `specUrl`      |                 | URL of your OpenAPI document, which the browser fetches when the page opens. Use it when the app already serves the document                                                               |
| `spec`         |                 | The OpenAPI document itself, as an object or JSON text. It is written into the page, so the browser makes no request for it. With both, `spec` is shown and `specUrl` is the download link |
| `title`        | `API Reference` | Page title                                                                                                                                                                                 |
| `assets`       | `"bundled"`     | `"bundled"`: the app serves `rapidoc-min.js`. `"cdn"`: the browser loads the same version from jsDelivr, checked against its SRI hash. `{ scriptUrl, integrity? }`: a URL of your own      |
| `options`      |                 | [Attributes of `<rapi-doc>`](https://rapidocui.com/api/), in kebab-case or camelCase: `{ renderStyle: "focused", allowTry: false }`                                                        |
| `head`, `css`  |                 | Markup and CSS added to the page as given                                                                                                                                                  |
| `lang`         | `en`            | Language of the page                                                                                                                                                                       |
| `nonce`        |                 | Content-Security-Policy nonce, or a function that reads it from the request                                                                                                                |
| `publicUiPath` | `uiPath`        | `uiPath` as the browser sees it, when a proxy strips a prefix before the request reaches the app. `publicPath` is its old name, still read                                                 |
| `enabled`      | `true`          | `false` serves nothing, for example outside development                                                                                                                                    |

These are the options of every RapiDoc integration; `publicUiPath` and the `nonce` function are specific to this one.

## Cloudflare Workers and other runtimes without a file system

Import from `@rapidoc/hono/edge`. It is the same middleware, but the browser loads the bundle from the CDN (`assets: "cdn"` is the default there), so nothing is read from disk:

```js
import { rapidoc } from "@rapidoc/hono/edge";

app.use(rapidoc({ specUrl: "/openapi.json" }));
```

## With a Content-Security-Policy

```js
import { secureHeaders, NONCE } from "hono/secure-headers";

app.use(secureHeaders({ contentSecurityPolicy: { scriptSrc: [NONCE], styleSrc: [NONCE] } }));
app.use(rapidoc({ specUrl: "/openapi.json", nonce: (c) => c.get("secureHeadersNonce") }));
```

`<rapi-doc>` also needs `connect-src` to allow the API servers it sends requests to.

## Notes

- Each release serves one version of `rapidoc`, exported as `rapidocVersion`.
- OAuth sign-in returns to `{uiPath}/oauth-receiver.html`, which the middleware serves on your own origin, also with `assets: "cdn"`.
- [`examples/server.js`](./examples/server.js) is a complete app.

Node.js 22.12 or later, Bun or Deno; Hono 4. MIT.
