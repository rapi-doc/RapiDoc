# AGENTS.md — `packages/rapidoc-cli` (Command Line Utility)

## 1. Package Scope & Identity
`packages/rapidoc-cli` provides the `rapidoc` command-line interface for `@rapidoc/portal`: `rapidoc dev` (local preview), `rapidoc build` (static portal build), `rapidoc validate` (OpenAPI validation), and `rapidoc migrate --from redocly|zudoku` (config migration).

- **Package Name**: `@rapidoc/cli`
- **Binary Name**: `rapidoc`
- **Entry Point**: `src/index.js`
- **Module Type**: ESM (`"type": "module"`)

---

## 2. Technology Stack & Dependencies

- **Runtime**: Node.js >= 22.12.0
- **Parser**: `@scalar/openapi-parser` for OpenAPI specification loading and validation
- **Portal Engine**: `@rapidoc/portal` (dev server and build are delegated to it)
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
