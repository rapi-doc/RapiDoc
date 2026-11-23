<p align="center">
  <img alt="RapiDoc logo" src="https://github.com/rapi-doc/RapiDoc/blob/master/logo.png" width="80px" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/rapidoc"><img alt="npm" src="https://img.shields.io/npm/v/rapidoc?style=flat-square&label=rapidoc"/></a>
  <a href="https://www.npmjs.com/package/@rapidoc/portal"><img alt="npm" src="https://img.shields.io/npm/v/@rapidoc/portal?style=flat-square&label=%40rapidoc%2Fportal"/></a>
  <img alt="MIT license" src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square"/>
</p>

# RapiDoc

**Open-source tools for OpenAPI and Arazzo: interactive API references, embedded endpoints, PDFs, a mock server, workflows and developer portals.**

RapiDoc started as `<rapi-doc>`, a web component that turns an OpenAPI spec into an interactive API reference. It is now a family of tools that share one spec reader, one look and one set of names, from a single HTML element to a complete developer portal with sign-in. Everything here is MIT-licensed. Website: [rapidocui.com](https://rapidocui.com).

## The RapiDoc family

| Product | What it does | Package | Docs |
| :-- | :-- | :-- | :-- |
| **RapiDoc** `<rapi-doc>` | Interactive API reference from an OpenAPI 3.0, 3.1 or Swagger 2.0 spec, with Try, an in-browser mock, themes and MCP server export. One HTML element, no runtime dependencies. | [`rapidoc`](https://www.npmjs.com/package/rapidoc) | [rapidocui.com/docs](https://rapidocui.com/docs/rapidoc/get-started/quickstart/) |
| **RapiDoc Mini** `<rapi-doc-mini>` | A few operations, with Try, inside a blog post, guide or dashboard. | [`rapidoc`](https://www.npmjs.com/package/rapidoc) | [Docs](https://rapidocui.com/docs/rapidoc-mini/) |
| **RapiFlow** `<rapi-flow>` | Draws the workflows of an Arazzo spec next to the API reference and runs them in the browser, against the API or a mock. | [`rapidoc`](https://www.npmjs.com/package/rapidoc) (`rapidoc/flow`) | [flow.rapidocui.com](https://flow.rapidocui.com/) |
| **RapiDoc Portal** | A docs-as-code developer portal: OpenAPI specs and Markdown or Markdoc guides become one static site with an API catalog, references, search, workflows, MCP manifests and `llms.txt`, plus optional single sign-on (OpenID Connect) with access rules. | [`@rapidoc/portal`](https://www.npmjs.com/package/@rapidoc/portal), [`@rapidoc/server`](https://www.npmjs.com/package/@rapidoc/server) | [portal.rapidocui.com](https://portal.rapidocui.com/) |
| **RapiMock** | A mock server from an OpenAPI spec: request validation, token and scope checks, state between requests, a UI to look inside, and endpoints for tests in any language. | [`@rapidoc/mock`](https://www.npmjs.com/package/@rapidoc/mock) | [mock.rapidocui.com](https://mock.rapidocui.com/) |
| **RapiPdf** `<rapi-pdf>` | Turns an OpenAPI spec into a PDF, in the browser or in Node. | [`rapipdf`](https://www.npmjs.com/package/rapipdf) | [Docs](https://rapidocui.com/docs/rapipdf/) |
| **RapiDoc CLI** | The `rapidoc` command: preview, validate, lint and bundle specs, write PDFs, run the mock, turn specs into MCP servers, and build portals. | [`@rapidoc/cli`](https://www.npmjs.com/package/@rapidoc/cli) | [Docs](https://rapidocui.com/docs/cli/) |
| **Integrations** | RapiDoc for Express, Fastify, Hono, FastAPI, ASP.NET Core, Go, Starlight, VitePress and Docusaurus. | [below](#integrations) | [Docs](https://rapidocui.com/docs/integrations/front-end/) |

**See it running:** the [examples](https://rapidocui.com/examples/) on rapidocui.com, and [Rapid Parcels](https://parcels.rapidocui.com/), a demo developer portal with several APIs, guides, workflows and sign-in.

---

## RapiDoc in one HTML file

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <script type="module" src="https://unpkg.com/rapidoc/dist/rapidoc-min.js"></script>
  </head>
  <body>
    <rapi-doc spec-url="https://petstore3.swagger.io/api/v3/openapi.json" color-scheme="dark"></rapi-doc>
  </body>
</html>
```

- **OpenAPI 3.0, 3.1 and Swagger 2.0,** with large specs (thousands of operations) kept fast by three render styles: `read`, `view` and `focused`.
- **Try every operation** from the page, with API keys, HTTP Basic, bearer tokens and OAuth 2.0, or answer requests in the page with the built-in mock (`mock-server`).
- **Any framework:** plain HTML, React, Vue, Angular, Svelte or Lit. `<rapi-doc>` is a standard custom element, with TypeScript types for React and Vue.
- **Your brand:** light and dark color schemes, theme presets, CSS custom properties, CSS parts and slots for your own markup.
- **For AI agents:** an Export MCP Server button turns the spec on the page into an MCP server project.
- **Accessible:** the sidebar works with a keyboard and a screen reader.

Every attribute, method and event: [the reference](https://rapidocui.com/docs/rapidoc/reference/).

---

## A developer portal with RapiDoc Portal

```bash
npm create rapidoc@latest my-portal
cd my-portal && npm install
npx rapidoc dev        # http://localhost:4321
npx rapidoc build      # a static site in ./dist
```

Specs go in `specs/`, guides in `docs/`, and `rapidoc.config.yaml` ties them together:

```yaml
site:
  title: Acme Developer Portal
  url: https://developers.acme.com
navigation:
  - label: Guides
    items:
      - getting-started         # docs/getting-started.md
  - label: Orders API
    api: orders
apis:
  - id: orders
    spec: ./specs/orders.yaml   # the reference page at /apis/orders
```

- **Guides and references in one site,** with one sidebar, one search and live API operations inside guides (`{% api-operation %}`).
- **Arazzo workflows** drawn and runnable in a guide (`{% workflow %}`).
- **For AI agents:** every page as Markdown, `llms.txt` and `llms-full.txt`, MCP manifests for each API, and a `/mcp` endpoint with `rapidoc serve`.
- **Sign-in and access rules:** with an OpenID Connect provider, `rapidoc serve` keeps pages, specs and search results for signed-in readers, groups or emails.
- **Static output** for any host: GitHub Pages, Netlify, S3, Nginx.
- **Coming from Redocly or Zudoku?** `npx rapidoc migrate --from redocly|zudoku` converts the config.

Quickstart and configuration: [portal.rapidocui.com](https://portal.rapidocui.com/docs/getting-started/quickstart/).

---

## A mock server with RapiMock

```bash
npx @rapidoc/cli mock ./openapi.yaml
```

Validates requests against the spec, checks tokens and OAuth scopes, keeps state between requests (`--stateful`), and has a UI to look inside. Docs: [mock.rapidocui.com](https://mock.rapidocui.com/).

---

## Integrations

Official packages that add a RapiDoc reference to your app or docs site. Each one ships a pinned RapiDoc bundle (nothing is loaded from another site unless you ask for a CDN), takes the same options, and serves the OAuth sign-in return page for you.

**Server frameworks**: the reference at `/docs`, reading your app's OpenAPI document.

| Framework | Install | Use |
| :--- | :--- | :--- |
| [Hono](packages/rapidoc-hono) | `npm i @rapidoc/hono` | `app.use(rapidoc({ specUrl: "/openapi.json" }))` |
| [Express](packages/rapidoc-express) | `npm i @rapidoc/express` | `app.use(rapidoc({ specUrl: "/openapi.json" }))` |
| [Fastify](packages/rapidoc-fastify) | `npm i @rapidoc/fastify` | `await fastify.register(rapidoc, { specUrl: "/openapi.json" })` |
| [FastAPI, Starlette](integrations/rapidoc-python) | `pip install rapidoc` | `setup_rapidoc(app)` |
| [ASP.NET Core](integrations/rapidoc-dotnet) | `dotnet add package RapiDoc.AspNetCore` | `app.MapRapiDoc();` |
| [Go (`net/http`, chi, Gin, Echo, Fiber, Huma)](https://github.com/rapi-doc/rapidoc-go) | `go get github.com/rapi-doc/rapidoc-go` | `rapidoc.Handler(rapidoc.Options{SpecURL: "/openapi.json"})` |

**Documentation sites**: API reference pages in your site's own layout, with the operations in its sidebar.

| Site generator | Install |
| :--- | :--- |
| [Starlight](packages/rapidoc-starlight) | `npm i @rapidoc/starlight` |
| [VitePress](packages/rapidoc-vitepress) | `npm i @rapidoc/vitepress` |
| [Docusaurus](packages/rapidoc-docusaurus) | `npm i @rapidoc/docusaurus` |

React, Next.js, Vue, Nuxt, Angular and Svelte need no package: `<rapi-doc>` is a standard custom element. Setup for all of the above is in the [framework integration guide](https://rapidocui.com/docs/integrations/front-end/).

Building one for another framework or language? Start from [`@rapidoc/embed`](packages/rapidoc-embed) and the [integration guide](https://rapidocui.com/docs/integrations/build-your-own/): it defines the options, routes and HTML every integration shares, with fixtures to test a port against.

---

## Contributing

This repository holds every package of the family, the four websites and their tests. How to set it up, build, test and release: [CONTRIBUTING.md](CONTRIBUTING.md).

## Sponsors

- Hosting sponsored by [Simafri](https://www.simafri.com/en/managed-vps/) (managed VPS)
- AI coding tools sponsored by [Anthropic](https://www.anthropic.com) (Claude)

## License

MIT © [Mrinmoy Majumdar](https://github.com/mrin9)
