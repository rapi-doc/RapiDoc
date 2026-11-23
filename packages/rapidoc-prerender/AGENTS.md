# AGENTS.md — `packages/rapidoc-prerender` (`@rapidoc/prerender`)

## 1. Package Scope & Identity

`packages/rapidoc-prerender` is RapiDoc's build-time renderer for Node: pre-rendered `<rapi-doc>` (Declarative Shadow DOM or light DOM), the static sidebar `@rapidoc/portal` places beside a headless `<rapi-doc>`, and Arazzo workflow diagrams.

- **Package Name**: `@rapidoc/prerender`
- **Module Type**: ESM (`"type": "module"`)
- **Entry Point**: `src/index.js`, built into `dist/index.js`; types in `src/index.d.ts`; folder contract in `src/README.md`
- **Internal entry**: `src/internal.js`, built into `dist/internal.js` (`@rapidoc/prerender/internal`, types in `src/internal.d.ts`): what the portal and the tests use beyond the public API (`resolveSpecInput`, `renderNavBarHtml`, `renderTemplateToString`, `escapeHtml`, `OperationSlugger`). Not covered by semver; nothing outside this repository should import it
- **Dependencies**: `lit`, `@scalar/openapi-parser`, `marked`, `yaml` (OpenAPI specs), `js-yaml` (Arazzo documents), `github-slugger`, `microlighter`, all external at runtime.
- **Users**: `@rapidoc/portal` (`src/pages/api-reference.astro`, `src/engine/`, `src/markdoc/`), the docs site's prerender guide, `scripts/prerender-demo.mjs`, and many unit tests.

---

## 2. Boundaries

- **Owns the renderer, not what it renders.** `src/` (render, navigation, serializer) is this package's; the templates, components, styles and utilities it renders are in `packages/rapidoc/src`, imported by relative path (and `~` inside those files, aliased in `vite.config.mjs`). Change rendering there so `<rapi-doc>` and this package stay identical.
- **Never imported by `rapidoc`.** The dependency runs one way: this package bundles code from `packages/rapidoc/src`, and nothing there imports `packages/rapidoc-prerender`.
- **The published package ships `dist/`, `src/index.d.ts` and `src/internal.d.ts` only**: `src/` imports files outside the package, so it runs only through the build (or the monorepo's `scripts/test-loader.mjs`, the docs site's alias).
- **Build before use in the monorepo.** The portal and `prerender-demo` import `dist/index.js`; `npm run build:prerender` (root) builds it, and `pretest:portal`, `build` and `build:demo` run it.

---

## 3. Commands and Tests

| Command                          | Purpose                                                                                                  |
| :------------------------------- | :------------------------------------------------------------------------------------------------------- |
| `npm run build`                  | Builds `dist/index.js`                                                                                   |
| `npm run build:prerender` (root) | Same, from the monorepo root                                                                             |
| `npm run test:unit` (root)       | `static-renderer`, `semantic-markup`, `unused-tags` and the other tests that import `@rapidoc/prerender` |

When the exported names or options change, update `src/index.d.ts`, `src/README.md` and the docs page (`sites/rapidoc/docs/prerender/index.mdx`). Options go through `src/options.js` (`readOptions`): camelCase names as `<rapi-doc>`'s properties, kebab-case too for those that are attributes, unknown names rejected, no aliases. The unit tests import the internal names by path (`packages/rapidoc-prerender/src/internal.js`).
