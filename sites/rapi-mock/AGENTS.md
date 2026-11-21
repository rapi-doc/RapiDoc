# AGENTS.md — `sites/rapi-mock` (the RapiMock site)

The documentation site of the mock server, for `https://mock.rapidocui.com`. Its feature page (what it is, how it compares with the in-browser mock) is `/rapi-mock/` on rapidocui.com (`sites/rapidoc/pages/rapi-mock.astro`); the home page here is the docs introduction. The product's name is **RapiMock**; the command stays `rapidoc mock` and the package `@rapidoc/mock`.

- **Built with**: RapiDoc Portal, from this repository's own `@rapidoc/cli` and `@rapidoc/portal` (not the published ones).
- **Not an npm workspace**, and nothing here is published to npm.
- **Published by**: `.github/workflows/publish-mock-site.yml` in this repository. On a push to `master` that touches this folder or the packages the site is built from (or run by hand), it builds the site and force-pushes the built files as one commit to the `main` branch of `rapi-doc/rapi-mock-doc`, which GitHub Pages serves at `mock.rapidocui.com` (`public/CNAME`). That repository holds only published files: never edit it. The workflow pushes with the deploy key in the secret `RAPI_MOCK_DOC_DEPLOY_KEY`; it checks that the build has the home page and the spec check before it pushes. `publish-portal-site.yml` has the same shape: change them together.

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
2. **Say "RapiMock"** for the product. Use `rapidoc mock` only as the command.
3. **`docs/state/api-styles.md` states what the mock handles, with measured numbers.** Update it when the baseline in `packages/rapidoc-mock/tests/core-specs.test.js` moves or a new spec is measured, and say how the numbers were obtained. Never round them up.
4. **Links inside the site are absolute paths** (`/docs/state/overview/`); links to RapiDoc's other products go to their own sites.
5. **Look at a changed page in a browser** (`npm run dev:mock-site`). The formatter and the tests do not cover these files.
6. **The spec check (`/spec-check/index.html`) has no code of its own for what it shows.** `spec-check/check.js` strings together this repository's validator and lint rules (`packages/rapidoc-cli/src/lint`, `src/validate`) and `createBrowserMock` (`packages/rapidoc-mock/src/browser.js`), bundled by relative path, and shows the lint result by category with the share of checks that passed (`summarize` of the CLI's `lint/summary.js`); the page then shows the result in the Mock UI (the lint result as its Lint section and the Lint card of its Dashboard: the in-page mock answers `/lint/<id>` with it, as `rapidoc mock` does), the same `mock-ui.js` the mock server serves, copied from `packages/rapidoc-mock/dist/ui` at build time. A change to what it shows is made in those packages, not here. Its colors are the Mock UI's tokens (`packages/rapidoc-mock/ui/styles/tokens.js`), which the build writes into the page's `:root` rule in place of the `/* mock-ui-tokens */` comment: never write a color into `index.html`. Its page is plain HTML outside the portal's layout, so the portal's dev server does not reload it: run `npm run build:spec-check` and restart `dev:mock-site` after a change. Link to it as `/spec-check/index.html` (the dev server does not serve a folder's index). It promises that the spec is not sent anywhere: nothing on that page may call a server with the spec or with anything derived from it. A spec can also come from an address (the field over the box, a dropped link, or `?url=`, which makes a check a link to share): the browser fetches it straight from that address, without cookies, so it works only where that server allows other sites to read it (CORS). Never add a proxy or any server of ours to get around that: it would see the spec.
7. **Pages still to come** are marked with a note where they will go (screenshots in the Mock UI tour, the control API's interactive reference). Don't list a page in the sidebar before it exists.
8. **The header is the one every RapiDoc site shares**: the Products menu (the same entries as `header.links` in `sites/rapidoc/rapidoc.config.yaml`, as absolute rapidocui.com links), Docs and GitHub, plus this site's "Check a spec", with the menu's styles copied from `sites/rapidoc/styles/portal.css`. A change to that menu is made in every site.
