# AGENTS.md — `packages/create-rapidoc` (Scaffolding CLI)

## 1. Package Scope & Identity
`packages/create-rapidoc` is the official scaffolding CLI for creating new RapiDoc Developer Portals.

- **Package Name**: `create-rapidoc`
- **Binary Name**: `create-rapidoc` (callable via `npm create rapidoc@latest` or `npx create-rapidoc`)
- **Entry Point**: `src/index.js`
- **Module Type**: ESM (`"type": "module"`)

---

## 2. Capabilities
1. Scaffolds new portals with a single command:
   - `rapidoc.config.yaml` (v2: site, theme, header links, navigation tabs, apis)
   - `package.json` with `@rapidoc/cli`
   - `.gitignore`
   - `README.md`
   - Valid OpenAPI 3.1 sample specification in `specs/api.yaml`
   - Home page in `docs/index.markdoc` (Starlight splash template with cards)
   - Starter Markdown guide in `docs/getting-started.md`
   - Starter Markdoc guide in `docs/guides/overview.markdoc` demonstrating callouts, tabs, step tags, and a live `api-operation` embed of the starter spec
2. Supports interactive or headless scaffolding (`--title`, `--force`).
3. Out-of-the-box buildable: freshly scaffolded projects immediately build with `rapidoc build`.

---

## 3. Local Commands

Run these commands from `packages/create-rapidoc`:

| Command | Purpose |
| :--- | :--- |
| `npm test` | Runs Node.js test runner across `tests/**/*.test.js` |
| `node src/index.js <targetDir>` | Tests scaffolding locally |

---

## 4. Coding & Architecture Guidelines
- Keep zero runtime native compilation dependencies.
- Follow root repository standards: Node.js >= 22.12.0, ESM, 2-space indentation, Prettier.
