# @rapidoc/express

Serves a [RapiDoc](https://rapidocui.com) API reference from your [Express](https://expressjs.com) app: an interactive page for your OpenAPI document, with a console to try requests.

```bash
npm install @rapidoc/express
```

```js
import express from "express";
import { rapidoc } from "@rapidoc/express";

const app = express();

app.get("/openapi.json", (req, res) => res.json(openApiDocument));
app.use(rapidoc({ specUrl: "/openapi.json" }));
```

Open `/docs`. The middleware answers `GET` and `HEAD` on that path and the files under it, and calls `next()` for every other request.

Mounted under a prefix, the page's links include it:

```js
app.use("/api", rapidoc({ specUrl: "/api/openapi.json" })); // the reference is at /api/docs
```

## Options

| Option        | Default         |                                                                                                                                                                                       |
| :------------ | :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `path`        | `/docs`         | Where the reference is served                                                                                                                                                         |
| `specUrl`     |                 | URL of your OpenAPI document                                                                                                                                                          |
| `spec`        |                 | The OpenAPI document itself (object or JSON text), written into the page                                                                                                              |
| `title`       | `API Reference` | Page title                                                                                                                                                                            |
| `assets`      | `"bundled"`     | `"bundled"`: the app serves `rapidoc-min.js`. `"cdn"`: the browser loads the same version from jsDelivr, checked against its SRI hash. `{ scriptUrl, integrity? }`: a URL of your own |
| `options`     |                 | [Attributes of `<rapi-doc>`](https://rapidocui.com/api/), in kebab-case or camelCase: `{ renderStyle: "focused", allowTry: false }`                                                   |
| `head`, `css` |                 | Markup and CSS added to the page as given                                                                                                                                             |
| `lang`        | `en`            | Language of the page                                                                                                                                                                  |
| `nonce`       |                 | Content-Security-Policy nonce, or a function that reads it from the request                                                                                                           |
| `publicPath`  |                 | The path as the browser sees it, when a proxy strips a prefix before the request reaches the app                                                                                      |
| `enabled`     | `true`          | `false` serves nothing, for example outside development                                                                                                                               |

These are the options of every RapiDoc integration.

## With helmet

```js
app.use(rapidoc({ specUrl: "/openapi.json", nonce: (req, res) => res.locals.cspNonce }));
```

`<rapi-doc>` also needs `connect-src` to allow the API servers it sends requests to.

## Notes

- Works with Express 4 and 5, Connect, and a plain `node:http` server (`rapidoc(options)(req, res, next)`).
- Each release serves one version of `rapidoc`, exported as `rapidocVersion`.
- OAuth sign-in returns to `{path}/oauth-receiver.html`, which the middleware serves on your own origin, also with `assets: "cdn"`.
- [`examples/server.js`](./examples/server.js) is a complete app.

Node.js 22.12 or later. MIT.
