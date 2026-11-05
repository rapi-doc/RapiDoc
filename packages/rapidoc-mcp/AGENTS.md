# AGENTS.md — `packages/rapidoc-mcp` (`@rapidoc/mcp`)

## 1. Package Scope & Identity

`packages/rapidoc-mcp` publishes RapiDoc's MCP manifest builder, runtime and project writer for Node. It owns only its entry and build; the code is in `packages/rapidoc/src`.

- **Package Name**: `@rapidoc/mcp`
- **Module Type**: ESM (`"type": "module"`)
- **Entry Point**: `src/index.js`, built into `dist/index.js`; types in `src/index.d.ts`
- **Dependencies**: `yaml` (Arazzo parsing), external at runtime. Everything else is bundled from `packages/rapidoc/src`.
- **Users**: `@rapidoc/portal` (`src/engine/mcp-output.js`, `src/engine/spec-checks.js`) and `@rapidoc/server` (`src/mcp.js`).

---

## 2. Boundaries

- **No code of its own beyond the entry.** `src/index.js` re-exports `packages/rapidoc/src/utils/mcp-generator.js`, `utils/mcp/workflow-runtime.js` and `utils/arazzo/` by relative path and adds the workflow runtime to the project writers. Change behaviour there (see `packages/rapidoc/src/utils/mcp/README.md`), so the browser's Export MCP Server button and this package stay the same.
- **Headless only.** The modules it bundles must not import Lit, elements, templates or styles; `tests/unit/headless-boundary.test.js` walks this entry's imports and fails otherwise.
- **The published package ships `dist/` and `src/index.d.ts` only**: `src/index.js` imports files outside the package and Vite's `?raw`, so it runs only through the build (or the monorepo's `scripts/test-loader.mjs`).
- **Build before use in the monorepo.** The portal and server import `dist/index.js`; `npm run build:mcp` (root) builds it, and `pretest:portal` and `build:demo` run it.

---

## 3. Commands and Tests

| Command                    | Purpose                                                              |
| :------------------------- | :------------------------------------------------------------------- |
| `npm run build`            | Builds `dist/index.js`                                               |
| `npm run build:mcp` (root) | Same, from the monorepo root                                         |
| `npm run test:unit` (root) | `mcp-generator`, `mcp-project`, `mcp-workflows`, `headless-boundary` |

When the exported names change, update `src/index.d.ts` and the guide (`docs/src/content/docs/advanced/mcp-server.mdx`).
