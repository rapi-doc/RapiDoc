# AGENTS.md — `packages/rapidoc-static` (`@rapidoc/static`)

## 1. Package Scope & Identity

`packages/rapidoc-static` is RapiDoc's build-time renderer for Node: pre-rendered `<rapi-doc>` (Declarative Shadow DOM or light DOM), the static sidebar `@rapidoc/portal` places beside a headless `<rapi-doc>`, and Arazzo workflow diagrams.

- **Package Name**: `@rapidoc/static`
- **Module Type**: ESM (`"type": "module"`)
- **Entry Point**: `src/index.js`, built into `dist/index.js`; types in `src/index.d.ts`; folder contract in `src/README.md`
- **Dependencies**: `lit`, `@scalar/openapi-parser`, `marked`, `yaml`, `github-slugger`, `microlighter`, all external at runtime.
- **Users**: `@rapidoc/portal` (`src/pages/api-reference.astro`, `src/engine/`, `src/markdoc/`), the docs site's prerender guide, `scripts/prerender-demo.mjs`, and many unit tests.

---

## 2. Boundaries

- **Owns the renderer, not what it renders.** `src/` (render, navigation, serializer) is this package's; the templates, components, styles and utilities it renders are in `packages/rapidoc/src`, imported by relative path (and `~` inside those files, aliased in `vite.config.mjs`). Change rendering there so `<rapi-doc>` and this package stay identical.
- **Never imported by `rapidoc`.** The dependency runs one way: this package bundles code from `packages/rapidoc/src`, and nothing there imports `packages/rapidoc-static`.
- **The published package ships `dist/` and `src/index.d.ts` only**: `src/` imports files outside the package, so it runs only through the build (or the monorepo's `scripts/test-loader.mjs`, the docs site's alias).
- **Build before use in the monorepo.** The portal and `prerender-demo` import `dist/index.js`; `npm run build:static` (root) builds it, and `pretest:portal`, `build` and `build:demo` run it.

---

## 3. Commands and Tests

| Command                       | Purpose                                                                                               |
| :---------------------------- | :---------------------------------------------------------------------------------------------------- |
| `npm run build`               | Builds `dist/index.js`                                                                                |
| `npm run build:static` (root) | Same, from the monorepo root                                                                          |
| `npm run test:unit` (root)    | `static-renderer`, `semantic-markup`, `unused-tags` and the other tests that import `@rapidoc/static` |

When the exported names or options change, update `src/index.d.ts`, `src/README.md` and the guide (`docs/src/pages/guides/prerender.astro`).
