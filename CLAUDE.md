# CLAUDE.md — RapiDoc Monorepo

`AGENTS.md` is the single source of project guidance (shared with other coding agents). It is imported in full below; keep edits there, and keep this file limited to Claude Code specifics and a quick reference.

@AGENTS.md

---

## Quick Reference

### Entry Points

| Workspace | Package | Entry |
| :--- | :--- | :--- |
| `packages/rapidoc` | `rapidoc` | `src/index.js` → `<rapi-doc>` in `src/rapidoc.ts`; static renderer in `src/static/index.js` (`rapidoc/static`); bundles `dist/rapidoc-min.js`, `dist/rapidoc-static-min.js` |
| `packages/rapidoc-portal` | `@rapidoc/portal` | `src/index.js` (+ `./config`, `./markdoc`, `./search`, `./components`); build engine in `src/engine/`, portal pages in `src/pages/` |
| `packages/rapidoc-cli` | `@rapidoc/cli` | `src/index.js` (bin `rapidoc`: `init`, `dev`, `build`, `serve`, `mock`, `validate`, `migrate`; loads `@rapidoc/portal`, `@rapidoc/server` and `@rapidoc/mock`, optional peers, only when needed) |
| `packages/rapidoc-server` | `@rapidoc/server` | `src/index.js` (`createApp`, `startServer`): serves a built portal with OIDC sign-in and the access zones from `dist/rapidoc-server.json` |
| `packages/rapidoc-mock` | `@rapidoc/mock` | `src/index.js` (`createMockApp`, `startMockServer`): mocks the portal's APIs under `/<api id>` (default port 4010); examples, generated data, request validation, JWT scope checks; libraries behind `src/engine/` |
| `packages/create-rapidoc` | `create-rapidoc` | `src/index.js` (bin `create-rapidoc`); `src/scaffold.js` (`scaffoldProject`, `findOpenApiSpecs`, also used by `rapidoc init`) |
| `docs` | `docs` (private) | `astro.config.mjs`; content in `src/content/docs/`, pages in `src/pages/` |

### Most-Used Commands (from repo root)

- `npm run dev` / `npm run stop` — docs dev server on `http://localhost:4321`, live-reloading `packages/rapidoc/src/`
- `npm run build:rapidoc` — rebuild `rapidoc` bundles (never `git checkout`/`git restore` `dist/rapidoc-min.js`)
- `npm run test:unit` — run before and after parser/schema changes
- `npm run test:portal` — portal, CLI, and `create-rapidoc` tests
- `npm run lint` and `npm run format-fix` — after edits

The full command tables are in `AGENTS.md` §3.

---

## Dogfood Repo

`/Users/mrin/work/demo-api-portal` is a working directory in this project (via `.claude/settings.local.json`). It is a separate git repo that consumes `@rapidoc/portal`: the **Rapid Parcels** demo at its root (with sign-in), and the **Cosmo Cargo** test fixture in `fixtures/zudoku-cosmo-cargo/`, which the monorepo tests build. When portal config structure, Markdoc tags, or CLI commands change, propose and make the matching edits there too (rules: `packages/rapidoc-portal/AGENTS.md` §7). Don't commit in either repo unless asked.

## Claude Code Configuration

- **Package context**: each workspace has a `CLAUDE.md` that imports its own `AGENTS.md`; Claude Code loads it when working on files in that package.
- **Subagents** (`.claude/agents/`):
  - `rapidoc-core` — `packages/rapidoc` (component, parser, schema, bundle)
  - `docs-maintainer` — `docs/` (Astro + Starlight site, examples, redirects)
  - `cli-portal` — `packages/rapidoc-cli`, `packages/rapidoc-portal`, `packages/rapidoc-server`, `packages/rapidoc-mock`, `packages/create-rapidoc`
- **Skills**:
  - `rapidoc-static-navigation` (`packages/rapidoc-portal/.claude/skills/`) — static `getNavBarHtml` sidebar + headless `<rapi-doc>` with independent scrolling. Loads once Claude touches files under `packages/rapidoc-portal/`.
