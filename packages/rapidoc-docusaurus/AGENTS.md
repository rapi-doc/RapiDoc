# AGENTS.md — `packages/rapidoc-docusaurus` (`@rapidoc/docusaurus`)

## 1. Package Scope & Identity

`@rapidoc/docusaurus` is the RapiDoc integration for Docusaurus: `<rapi-doc>` in a doc page of the site, with the API's operations in the docs sidebar. `@rapidoc/starlight` is the reference for documentation sites; this follows it where Docusaurus allows.

- **Package Name**: `@rapidoc/docusaurus`
- **Module Type**: ESM, published as source (`src/`, no build)
- **Dependencies**: `@rapidoc/embed` (attribute rules), `@rapidoc/prerender` (a spec's tags and operations), `rapidoc` (the bundle the component imports), `yaml`. `@docusaurus/core` and `react` are **optional** peers, so that `npm install` in this monorepo does not install Docusaurus
- **Versioning**: its own semver, outside the fixed group (root `AGENTS.md` §6)

| File                                         | Role                                                                                                                                                        |
| :------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/index.js`                               | Node: the plugin (reads the named specs, writes one data file each and `specs.js`, adds the OAuth return route) and `rapidocSidebar` / `rapidocSidebarSync` |
| `src/sidebar-cli.js`                         | The process `rapidocSidebarSync` runs: JSON in on stdin, sidebar items out on stdout                                                                        |
| `src/client.js` (`./client`)                 | The `RapidocReference` React component, written with `createElement` (no JSX)                                                                               |
| `src/oauth-receiver.js` (`./oauth-receiver`) | The component of the route `rapidoc/oauth-receiver`                                                                                                         |

---

## 2. Boundaries and Invariants

These come from how Docusaurus loads and compiles a package; each cost a failed build or a broken page to find.

- **The plugin file and `sidebars.js` are loaded with `require()`.** `@rapidoc/prerender` can only be imported, so `src/index.js` imports it inside `rapidocSidebar`, never at the top. A test checks this.
- **`sidebars.js` must export an object**: a function or a top-level `await` is not accepted, and a function is ignored without an error (no sidebar at all). Hence `rapidocSidebarSync`, which runs `rapidocSidebar` in a child process.
- **A doc shows a sidebar only if it is in one.** `rapidocSidebar({ ..., docId })` makes the first item that doc; link items alone leave the page without a sidebar.
- **Docusaurus compiles `src/client.js` with loose array spread**: `[...nodeList]` becomes `[].concat(nodeList)`, one item instead of many. Use `Array.from`. A test rejects array spreads in the client files.
- **The specs reach the component through `@generated/rapidoc-docusaurus/default/specs`** (written with `createData`), one lazily imported file per API, not through global data, which every page would download.
- **Hash links go through the site's router**, so the component follows `useLocation().hash` and calls `scrollToPath`; no hash means the overview. It marks the active sidebar link itself (`markActive`), because Docusaurus only knows the page's own item.
- **Sidebar links and `<rapi-doc>` agree on ids**: `elementId` from `@rapidoc/prerender`'s `getSpecNavigation`.

---

## 3. Commands and Tests

| Command                      | Purpose                                                                                                                                                         |
| :--------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm test`                   | `tests/docusaurus.test.js`: sidebar (async and sync), the plugin's data files and route, and the two source checks above; needs `npm run build:prerender` first |
| `npm run test:portal` (root) | Runs these with the other package tests                                                                                                                         |

**The component is not covered by automated tests**, because Docusaurus is not installed here. After changing `src/client.js` or the plugin, check it in a real site: create a Docusaurus 3 site, `npm pack` this package and install the tarball there (a symlink does not work: the component must resolve `react` and `@docusaurus/*` from the site), then `docusaurus build` and `docusaurus serve`. Check a deep link to an operation, clicking between operations and back to Overview, the highlighted sidebar link, and dark mode. Run `docusaurus clear` between changes; it caches compiled packages.
