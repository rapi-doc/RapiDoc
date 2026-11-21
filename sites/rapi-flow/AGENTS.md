# AGENTS.md — `sites/rapi-flow` (the RapiFlow docs site)

The documentation site of RapiFlow, for `https://flow.rapidocui.com`, and the home of RapiDoc's Arazzo support across the family: what `<rapi-flow>` runs, the Arazzo extensions, and, as they are written, the Arazzo profile RapiDoc supports, workflows in the portal, workflows as MCP tools and their validation. The product's name is **RapiFlow** (`brand/README.md`, "Names"); the element is `<rapi-flow>`, the bundle `rapidoc-flow-min.js`, the import `rapidoc/flow`.

- **Docs only.** RapiFlow's feature page (what it is, the live demo) is `/rapi-flow/` on rapidocui.com (`sites/rapidoc/pages/rapi-flow.astro`), as every product's is. The element's API reference stays there too (`/api/rapi-flow/`, read from `packages/rapidoc/src/rapi-flow.ts`), as do the examples.
- **Built with**: RapiDoc Portal, from this repository's own `@rapidoc/cli` and `@rapidoc/portal` (not the published ones).
- **Not an npm workspace**, and nothing here is published to npm.
- **Published by**: `.github/workflows/publish-flow-site.yml`, shaped like `publish-mock-site.yml` (change them together). On a push to `master` that touches this folder or the packages the site is built from (or run by hand), it builds the site and force-pushes the built files as one commit to the `main` branch of `rapi-doc/rapi-flow-doc`, which GitHub Pages serves at `flow.rapidocui.com` (`public/CNAME`), with the deploy key in the secret `RAPI_FLOW_DOC_DEPLOY_KEY`. That repository holds only published files: never edit it.

## Commands (from the repository root)

| Command | Purpose |
| :--- | :--- |
| `npm run dev:flow-site` | Preview on `http://localhost:4330`, reloading on save |
| `npm run build:flow-site` | Build to `sites/rapi-flow/dist/` (ignored by git) |

## Layout

```text
rapidoc.config.yaml   # site, the shared header, sidebar; a page must be listed here to be reachable
docs/                 # the pages; docs/index.mdx is the home page (the overview)
public/               # logo lockups (copies of brand/), favicon, CNAME
styles/portal.css     # the amber surfaces, as on the RapiMock site
```

## Rules

1. **A change to `<rapi-flow>` or the Arazzo code (`packages/rapidoc/src/rapi-flow.ts`, `src/utils/arazzo/`) updates these pages in the same pull request.** New RapiFlow and Arazzo documentation goes here, not into `sites/rapidoc` or the Starlight site under `docs/`.
2. **The header is the one every RapiDoc site shares**: the Products menu (the same entries as `header.links` in `sites/rapidoc/rapidoc.config.yaml`, as absolute rapidocui.com links), Docs and GitHub. A change to that menu is made in every site.
3. **Links inside the site are absolute paths** (`/docs/running/`; the overview is `/`); links to the other products' docs go to their own sites (`https://rapidocui.com/docs/…`, `https://mock.rapidocui.com/docs/…`).
4. **Components** come from `@rapidoc/portal/components` (`Aside`, `CardGrid`, `LinkCard`, …), never `@astrojs/starlight/components`.
5. **Look at a changed page in a browser** (`npm run dev:flow-site`). The formatter and the tests do not cover these files.
