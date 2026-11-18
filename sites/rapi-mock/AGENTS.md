# AGENTS.md — `sites/rapi-mock` (the Rapi Mock site)

The product and documentation site of the mock server, for `https://mock.rapidocui.com`. The product's name is **Rapi Mock**; the command stays `rapidoc mock` and the package `@rapidoc/mock`.

- **Built with**: RapiDoc Portal, from this repository's own `@rapidoc/cli` and `@rapidoc/portal` (not the published ones).
- **Not an npm workspace**, and nothing here is published to npm.
- **Published by**: a separate repository, `rapi-mock-doc`, with GitHub Pages. The publishing workflow is not written yet.

## Commands (from the repository root)

| Command | Purpose |
| :--- | :--- |
| `npm run dev:mock-site` | Preview on `http://localhost:4327`, reloading on save |
| `npm run build:mock-site` | Build to `sites/rapi-mock/dist/` (ignored by git) |
| `npm run build:spec-check` | Build the spec check into `public/spec-check/` (ignored by git); the two commands above run it first |

## Layout

```text
rapidoc.config.yaml   # site, header, tabs and sidebar; a page must be listed here to be reachable
docs/                 # the pages; docs/index.markdoc is the home page
public/               # logo, CNAME; public/spec-check/ is built, never edited
spec-check/           # the source of /spec-check/: the page, its script, the example spec, its Vite config
styles/portal.css     # the amber surfaces, as on rapidocui.com and the portal's site
```

## Rules

1. **A change to the mock updates these pages in the same pull request.** This is why the site's source is in this repository. New mock documentation goes here, not into the Starlight site under `docs/`.
2. **Say "Rapi Mock"** for the product. Use `rapidoc mock` only as the command.
3. **`docs/state/api-styles.md` states what the mock handles, with measured numbers.** Update it when the baseline in `packages/rapidoc-mock/tests/core-specs.test.js` moves or a new spec is measured, and say how the numbers were obtained. Never round them up.
4. **Links inside the site are absolute paths** (`/docs/state/overview/`); links to RapiDoc's other products go to their own sites.
5. **Look at a changed page in a browser** (`npm run dev:mock-site`). The formatter and the tests do not cover these files.
6. **The spec check (`/spec-check/index.html`) has no code of its own for what it shows.** `spec-check/check.js` strings together this repository's validator and lint rules (`packages/rapidoc-cli/src/lint`, `src/validate`) and `createBrowserMock` (`packages/rapidoc-mock/src/browser.js`), bundled by relative path; the page then shows the result in the Mock UI, the same `mock-ui.js` the mock server serves, copied from `packages/rapidoc-mock/dist/ui` at build time. A change to what it shows is made in those packages, not here. Its page is plain HTML outside the portal's layout, so the portal's dev server does not reload it: run `npm run build:spec-check` and restart `dev:mock-site` after a change. Link to it as `/spec-check/index.html` (the dev server does not serve a folder's index). It promises that the spec is not sent anywhere: nothing on that page may call a server with the spec or with anything derived from it.
7. **Pages still to come** are marked with a note where they will go (screenshots in the Mock UI tour, the control API's interactive reference). Don't list a page in the sidebar before it exists.
