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

## Layout

```text
rapidoc.config.yaml   # site, header, tabs and sidebar; a page must be listed here to be reachable
docs/                 # the pages; docs/index.markdoc is the home page
public/               # logo, CNAME
styles/portal.css     # the amber surfaces, as on rapidocui.com and the portal's site
```

## Rules

1. **A change to the mock updates these pages in the same pull request.** This is why the site's source is in this repository. New mock documentation goes here, not into the Starlight site under `docs/`.
2. **Say "Rapi Mock"** for the product. Use `rapidoc mock` only as the command.
3. **`docs/state/api-styles.md` states what the mock handles, with measured numbers.** Update it when the baseline in `packages/rapidoc-mock/tests/core-specs.test.js` moves or a new spec is measured, and say how the numbers were obtained. Never round them up.
4. **Links inside the site are absolute paths** (`/docs/state/overview/`); links to RapiDoc's other products go to their own sites.
5. **Look at a changed page in a browser** (`npm run dev:mock-site`). The formatter and the tests do not cover these files.
6. **Pages still to come** are marked with a note where they will go (screenshots in the Mock UI tour, the control API's interactive reference). Don't list a page in the sidebar before it exists.
