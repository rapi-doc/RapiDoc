# AGENTS.md — `packages/rapidoc-starlight` (`@rapidoc/starlight`)

## 1. Package Scope & Identity

`@rapidoc/starlight` is the RapiDoc plugin for Starlight, and the reference integration for documentation sites: `<rapi-doc>` inside the site's own layout, with the API's operations in the site's sidebar.

- **Package Name**: `@rapidoc/starlight`
- **Module Type**: ESM, published as source (`src/`, no build)
- **Dependencies**: `@rapidoc/embed` (attribute rules), `@rapidoc/prerender` (a spec's tags and operations), `rapidoc` (the bundle the pages import), `yaml`; `@astrojs/starlight` and `astro` are peers
- **Versioning**: its own semver, outside the fixed group (root `AGENTS.md` §6)

| File                      | Role                                                                                                                                                                                            |
| :------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/apis.js`             | `resolveApis(options, site)`: loads each spec and returns the pages' data and the sidebar groups. No Astro or Starlight import                                                                  |
| `src/index.js`            | The Starlight plugin (`config:setup`): appends the sidebar groups and adds an Astro integration that injects the routes and a virtual module (`virtual:rapidoc-starlight`) with the pages' data |
| `src/ApiPage.astro`       | One API's page: `<rapi-doc>` in `StarlightPage`, the spec inlined, a script that marks the current operation in the sidebar                                                                     |
| `src/OAuthReceiver.astro` | `{path}/oauth-receiver/`, a bare page with `<oauth-receiver>`                                                                                                                                   |
| `example/`                | A Starlight site with one guide and one API; the build test builds it (launch config `starlight-example`, port 4402). Not published                                                             |

---

## 2. Boundaries and Invariants

- **Sidebar links and `<rapi-doc>` agree on ids.** A link is `{page}#{elementId}` with `elementId` from `@rapidoc/prerender`'s `getSpecNavigation`, the same slugs the element gives its sections. The page script marks the link whose `data-rapidoc-op` equals the id in `nav-active-change`.
- **Attributes go through `@rapidoc/embed`'s `toAttributes`**, so names, booleans and order follow the contract. The page defaults (`PAGE_ATTRIBUTES`) come first and the user's `options` last.
- **Routes are relative to the site's `base`; links include it.** `api.path` is the route pattern; `pageUrl()` adds `base` and the trailing slash the site uses.
- **The CSS in `ApiPage.astro` reaches into Starlight** (`--sl-content-width`, `.content-panel`, `h1#_top`, `--sl-color-bg`). When it stops matching a Starlight release, the page still works but shows Starlight's title above the reference or a narrower column; recheck against the example after a Starlight upgrade.
- **The example needs `vite.resolve.noExternal` for `cookie` and `js-yaml`** in this monorepo only (other workspaces hoist different majors to the root); do not copy it into the README.

---

## 3. Commands and Tests

| Command                      | Purpose                                                                                                                                                                                  |
| :--------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm test`                   | `tests/apis.test.js` (options, attributes, sidebar) and `tests/build.test.js`, which runs `astro build` on `example/`; needs `npm run build:rapidoc` and `npm run build:prerender` first |
| `npm run test:portal` (root) | Runs these with the other package tests                                                                                                                                                  |
