# CLAUDE.md — RapiDoc Monorepo

`AGENTS.md` is the single source of project guidance (shared with other coding agents). It is imported in full below; keep edits there, and keep this file limited to Claude Code specifics and a quick reference.

@AGENTS.md

---

## Quick Reference

### Entry Points

| Workspace | Package | Entry |
| :--- | :--- | :--- |
| `packages/rapidoc` | `rapidoc` | `src/index.js` → `<rapi-doc>` in `src/rapidoc.ts`; `<rapi-flow>` in `src/rapi-flow.ts` (`rapidoc/flow`); bundles `dist/rapidoc-min.js`, `dist/rapidoc-flow-min.js`; no runtime dependencies |
| `packages/rapidoc-prerender` | `@rapidoc/prerender` | `src/index.js` → `dist/index.js` (`renderRapiDoc`, `getNavBarHtml`, `getNavCss`, `renderArazzoWorkflow`): build-time renderer over the templates in `packages/rapidoc/src`; used by the portal and the prerender guide |
| `packages/rapidoc-portal` | `@rapidoc/portal` | `src/index.js` (+ `./config`, `./markdoc`, `./search`, `./components`); build engine in `src/engine/`, portal pages in `src/pages/` |
| `packages/rapidoc-cli` | `@rapidoc/cli` | `src/index.js` (bin `rapidoc`: `init`, `dev`, `build`, `serve`, `mock`, `validate`, `migrate`; loads `@rapidoc/portal`, `@rapidoc/server` and `@rapidoc/mock`, optional peers, only when needed) |
| `packages/rapidoc-server` | `@rapidoc/server` | `src/index.js` (`createApp`, `startServer`): serves a built portal with OIDC sign-in and the access zones from `dist/rapidoc-server.json` |
| `packages/rapidoc-mcp` | `@rapidoc/mcp` | `src/index.js` → `dist/index.js` (`buildMcpManifest`, `createMcpRuntime`, `writeMcpProject`, `parseArazzo`): re-exports the shared MCP and Arazzo code in `packages/rapidoc/src`, for the portal build and `@rapidoc/server` |
| `packages/rapidoc-mock` | `@rapidoc/mock` | `src/index.js` (`createMockApp`, `startMockServer`): mocks the portal's APIs under `/<api id>` (default port 4010); examples, generated data, request validation, JWT scope checks; libraries behind `src/engine/` |
| `packages/create-rapidoc` | `create-rapidoc` | `src/index.js` (bin `create-rapidoc`); `src/scaffold.js` (`scaffoldProject`, `findOpenApiSpecs`, also used by `rapidoc init`) |
| `docs` | `docs` (private) | `astro.config.mjs`; content in `src/content/docs/`, pages in `src/pages/` |

### Most-Used Commands (from repo root)

- `npm run dev` / `npm run stop` — docs dev server on `http://localhost:4321`, live-reloading `packages/rapidoc/src/`
- `npm run build:rapidoc` — rebuild `rapidoc` bundles (never `git checkout`/`git restore` `dist/rapidoc-min.js`)
- `npm run build:prerender` — rebuild `@rapidoc/prerender` after changing templates, components, styles or the renderer
- `npm run build:mcp` — rebuild `@rapidoc/mcp` after changing MCP or Arazzo code the portal or server uses
- `npm run test:unit` — run before and after parser/schema changes
- `npm run test:portal` — portal, CLI, and `create-rapidoc` tests
- `npm run lint` and `npm run format-fix` — after edits

The full command tables are in `AGENTS.md` §3.

---

## Dogfood Repo

`/Users/mrin/work/rapi-portal-demo` is a working directory in this project (via `.claude/settings.local.json`). It is a separate git repo of example portals that consume `@rapidoc/portal`, one per folder: the **Rapid Parcels** demo (`rapid-parcels/`, with sign-in), the **Cosmo Cargo** test fixture (`cosmo-cargo/`), which the monorepo tests build, and the small **Bookstore** portal (`bookstore/`). When portal config structure, Markdoc tags, or CLI commands change, propose and make the matching edits there too (rules: `packages/rapidoc-portal/AGENTS.md` §7). Don't commit in either repo unless asked.

## Claude Code Configuration

- **Package context**: each workspace has a `CLAUDE.md` that imports its own `AGENTS.md`; Claude Code loads it when working on files in that package.
- **Subagents** (`.claude/agents/`):
  - `rapidoc-core` — `packages/rapidoc` (component, parser, schema, bundle)
  - `docs-maintainer` — `docs/` (Astro + Starlight site, examples, redirects)
  - `cli-portal` — `packages/rapidoc-cli`, `packages/rapidoc-portal`, `packages/rapidoc-server`, `packages/rapidoc-mock`, `packages/create-rapidoc`
- **Skills**:
  - `rapidoc-prerender-navigation` (`packages/rapidoc-portal/.claude/skills/`) — static `getNavBarHtml` sidebar + headless `<rapi-doc>` with independent scrolling. Loads once Claude touches files under `packages/rapidoc-portal/`.
