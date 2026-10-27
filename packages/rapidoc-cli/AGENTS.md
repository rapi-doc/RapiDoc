# AGENTS.md — `packages/rapidoc-cli` (Command Line Utility)

## 1. Package Scope & Identity
`packages/rapidoc-cli` provides the `rapidoc` command, the one tool users run: `rapidoc init` (scaffold a portal, optionally around existing OpenAPI files), `rapidoc dev` (local preview), `rapidoc build` (static portal build), `rapidoc serve` (serve a build with sign-in and access rules), `rapidoc validate` (OpenAPI validation), and `rapidoc migrate --from redocly|zudoku` (config migration). Future tools (linting, mock server) belong here too.

- **Package Name**: `@rapidoc/cli`
- **Binary Name**: `rapidoc`
- **Entry Point**: `src/index.js`
- **Module Type**: ESM (`"type": "module"`)

---

## 2. Technology Stack & Dependencies

- **Runtime**: Node.js >= 22.12.0
- **Parser**: `@scalar/openapi-parser` for OpenAPI specification loading and validation
- **Scaffolding**: `create-rapidoc` (`create-rapidoc/scaffold`: `scaffoldProject`, `findOpenApiSpecs`), imported lazily by `init`
- **Portal Engine**: `@rapidoc/portal`, an **optional peer dependency** (`^0.1.0`). Load it only through `loadPortal()` / `tryLoadPortal()` (dynamic `import()`), never with a top-level import: `dev`, `build`, `migrate` and folder-wide `validate` need it and print `npm install -D @rapidoc/portal` when it is missing; `init` and single-spec `validate` work without it. Tests simulate a missing engine with `RAPIDOC_PORTAL_MODULE`.
- **Server**: `@rapidoc/server`, the other **optional peer dependency** (`^0.1.0`), behind `rapidoc serve` only. Load it only through `loadServer()` (dynamic `import()`); when missing, `serve` prints `npm install @rapidoc/server`. Tests simulate a missing server with `RAPIDOC_SERVER_MODULE`. `serve` prints the server's `SettingsError` problems (missing secrets, unreachable provider) and exits 1.
- **Shebang**: `#!/usr/bin/env node`

---

## 3. Local Commands

Run these commands from `packages/rapidoc-cli`:

| Command | Purpose |
| :--- | :--- |
| `npm start` | Executes `node src/index.js` |
| `node src/index.js <args>` | Directly test CLI arguments during development |
| `npm test` | Runs `tests/**/*.test.js` |

---

## 4. Coding & Architecture Guidelines

1. **Pure Node ESM**: Use native Node.js APIs (e.g., `node:fs`, `node:path`, `node:process`).
2. **CLI Output & Error Handling**:
   - Provide clean, readable terminal output.
   - Use standard process exit codes (`0` for success, non-zero for validation/runtime failures).
   - Gracefully handle file reading errors, network timeouts, and OpenAPI parse errors.
3. **Execution Permissions**:
   - Ensure `src/index.js` retains executable permissions (`chmod +x src/index.js`).
