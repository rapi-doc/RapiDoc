# AGENTS.md — `packages/rapidoc-vitepress` (`@rapidoc/vitepress`)

## 1. Package Scope & Identity

`@rapidoc/vitepress` is the RapiDoc integration for VitePress: `<rapi-doc>` inside the site's theme, with the API's operations in its sidebar. `@rapidoc/starlight` is the reference for documentation sites; this follows it where VitePress allows.

- **Package Name**: `@rapidoc/vitepress`
- **Module Type**: ESM, published as source (`src/`, no build)
- **Dependencies**: `@rapidoc/embed` (attribute rules, OAuth return page), `@rapidoc/prerender` (a spec's tags and operations), `rapidoc` (the bundle the component imports), `yaml`; `vitepress` is a peer
- **Versioning**: its own semver, outside the fixed group (root `AGENTS.md` §6)

| File                         | Role                                                                                                                                                                                                                                                                                     |
| :--------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/index.js`               | Node, used from `.vitepress/config`: `withRapidoc(config, { apis })` (Vite plugin with the specs as `virtual:rapidoc-vitepress`, `isCustomElement` for `rapi-*`, `ssr.noExternal` for this package, OAuth return page in `buildEnd` and the dev server) and `rapidocSidebar(spec, link)` |
| `src/client.js` (`./client`) | Browser and SSR: the `RapidocReference` component, a render function (no `.vue` file, so nothing to compile from `node_modules`)                                                                                                                                                         |
| `example/`                   | A VitePress site with one guide and one API; the build test builds it (launch config `vitepress-example`, port 4406). Not published                                                                                                                                                      |

---

## 2. Boundaries and Invariants

- **VitePress has no plugin API**, unlike Starlight: there is no way to inject a route or a sidebar entry. So the user wraps the config, calls `rapidocSidebar` and writes the page; keep those three steps small rather than hiding them.
- **The component loads the element in the browser only** (`import("rapidoc")` in `onMounted`) and hands it the spec with `loadSpec`; on the server it renders the bare tag.
- **Operation links change only the hash, and VitePress handles them itself**, so the component watches the route's hash (and `hashchange`) and calls `scrollToPath`. The overview link is `<link>#overview`, the hash the element sets on open, so that exactly one sidebar link is active.
- **Sidebar links and `<rapi-doc>` agree on ids**: `elementId` from `@rapidoc/prerender`'s `getSpecNavigation`.
- **`vitepress` in `devDependencies` is the 2.0 alpha on purpose**: 1.x pins Vite 5 and an esbuild with open advisories, which `npm audit` and Dependabot report for the whole monorepo. The package supports 1.x (peer `>=1.0.0`); check a 1.x site by hand after changes to `src/` (it was built and browsed on 1.6.4).

---

## 3. Commands and Tests

| Command                      | Purpose                                                                                                                                                      |
| :--------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm test`                   | `tests/vitepress.test.js`: sidebar, config wrapper, and a `vitepress build` of `example/`; needs `npm run build:rapidoc` and `npm run build:prerender` first |
| `npm run test:portal` (root) | Runs these with the other package tests                                                                                                                      |
