# @rapidoc/fastify

Serves a [RapiDoc](https://rapidocui.com) API reference from your [Fastify](https://fastify.dev) app: an interactive page for your OpenAPI document, with a console to try requests.

```bash
npm install @rapidoc/fastify
```

```js
import Fastify from "fastify";
import { rapidoc } from "@rapidoc/fastify";

const fastify = Fastify();

await fastify.register(rapidoc, { specUrl: "/openapi.json" });
```

Open `/docs`. With `@fastify/swagger`, point `specUrl` at the document it serves; RapiDoc's own routes are marked `hide`, so they stay out of that document.

Registered with a prefix, the routes and the page's links include it:

```js
await fastify.register(rapidoc, { prefix: "/api", specUrl: "/api/openapi.json" }); // at /api/docs
```

## Options

| Option         | Default         |                                                                                                                                                                                            |
| :------------- | :-------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `uiPath`       | `/docs`         | URL path the reference page is served at, within the plugin's `prefix`                                                                                                                     |
| `specUrl`      |                 | URL of your OpenAPI document, which the browser fetches when the page opens. Use it when the app already serves the document                                                               |
| `spec`         |                 | The OpenAPI document itself, as an object or JSON text. It is written into the page, so the browser makes no request for it. With both, `spec` is shown and `specUrl` is the download link |
| `title`        | `API Reference` | Page title                                                                                                                                                                                 |
| `assets`       | `"bundled"`     | `"bundled"`: the app serves `rapidoc-min.js`. `"cdn"`: the browser loads the same version from jsDelivr, checked against its SRI hash. `{ scriptUrl, integrity? }`: a URL of your own      |
| `options`      |                 | [Attributes of `<rapi-doc>`](https://rapidocui.com/docs/rapidoc/reference/), in kebab-case or camelCase: `{ renderStyle: "focused", allowTry: false }`                                     |
| `head`, `css`  |                 | Markup and CSS added to the page as given                                                                                                                                                  |
| `lang`         | `en`            | Language of the page                                                                                                                                                                       |
| `nonce`        |                 | Content-Security-Policy nonce, or a function that reads it from the request                                                                                                                |
| `publicUiPath` |                 | The page's whole path as the browser sees it. Only for a proxy that strips a prefix before the request reaches the app; a prefix inside the app is added without it                        |
| `enabled`      | `true`          | `false` serves nothing, for example outside development                                                                                                                                    |

These are the options of every RapiDoc integration. An empty string counts as an option that is not set.

## With @fastify/helmet

```js
await fastify.register(rapidoc, {
  specUrl: "/openapi.json",
  nonce: (request, reply) => reply.cspNonce.script,
});
```

`<rapi-doc>` also needs `connect-src` to allow the API servers it sends requests to.

## Notes

- Works with Fastify 4 and 5. The plugin is also the default export.
- The page answers at `{uiPath}` and `{uiPath}/`.
- Each release serves one version of `rapidoc`, exported as `rapidocVersion`. The package serves the current major of RapiDoc; a new RapiDoc major arrives as a minor release of this package.
- The bundle is sent with `cache-control: no-cache` and an `ETag`, so browsers pick up a new RapiDoc build on the first visit after a deploy and get a `304` otherwise.
- OAuth sign-in returns to `{uiPath}/oauth-receiver.html`, which the plugin serves on your own origin, also with `assets: "cdn"`.
- [`examples/server.js`](./examples/server.js) is a complete app.

Node.js 22.12 or later. MIT.
