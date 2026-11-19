# AGENTS.md — `sites/rapi-portal` (the RapiDoc Portal site)

The product and documentation site of RapiDoc Portal, for `https://portal.rapidocui.com`. It moved here from the repository `rapi-doc/rapi-portal-doc` (its source there, before the move, is at the tag `source-before-move`).

- **Built with**: RapiDoc Portal, from this repository's own `@rapidoc/cli` and `@rapidoc/portal` (not the published ones). The site can therefore describe what is not on npm yet; that is accepted.
- **Not an npm workspace**, and nothing here is published to npm.
- **Published by**: `.github/workflows/publish-portal-site.yml` in this repository. On a push to `master` that touches this folder or the packages the site is built from (or run by hand), it builds the site and force-pushes the built files as one commit to the `main` branch of `rapi-doc/rapi-portal-doc`, which GitHub Pages serves at `portal.rapidocui.com` (`public/CNAME`). That repository holds only published files: never edit it. The workflow pushes with the deploy key in the secret `RAPI_PORTAL_DOC_DEPLOY_KEY`. It has the same shape as `publish-mock-site.yml`: change them together.

## Commands (from the repository root)

| Command | Purpose |
| :--- | :--- |
| `npm run dev:portal-site` | Preview on `http://localhost:4328`, reloading on save |
| `npm run build:portal-site` | Build to `sites/rapi-portal/dist/` (ignored by git) |
| `npm run mock:portal-site` | The mock for the site's example API (Bookstore), which Try and Run workflow on its pages call |

## Layout

```text
rapidoc.config.yaml   # site, header, tabs and sidebar; a page must be listed here to be reachable
docs/                 # the pages; docs/index.markdoc is the home page
specs/                # the example API (Bookstore) shown under /apis/bookstore/
workflows/            # its Arazzo workflow
public/               # logos, CNAME
styles/portal.css     # the amber surfaces, as on rapidocui.com
```

## Rules

1. **A change to the portal, the server or a CLI command the portal's users run updates these pages in the same pull request.** This is why the site's source is in this repository.
2. **The site is its own example.** It uses the portal's features on itself (tabs, cards, an API reference, a workflow, search). When a config key or Markdoc tag changes, this site's `rapidoc.config.yaml` and pages change with it, as the example portals in `rapi-portal-demo` do (`packages/rapidoc-portal/AGENTS.md` §7).
3. **`styles/portal.css` is shared in spirit with `sites/rapi-mock/styles/portal.css`.** A color set on `:root` there applies to both schemes: the light block must take back every one of them.
4. **Links inside the site are absolute paths** (`/docs/tools/lint/`); links to RapiDoc's other products go to their own sites (the mock: `https://mock.rapidocui.com`).
5. **Look at a changed page in a browser** (`npm run dev:portal-site`). The formatter and the tests do not cover these files.
