---
name: cli-portal
description: "Use for changes to packages/rapidoc-cli (@rapidoc/cli: init, dev, build, serve, validate, migrate), packages/rapidoc-portal (@rapidoc/portal engine: config, Markdoc, layout, search, access rules), packages/rapidoc-server (@rapidoc/server: OIDC sign-in, access enforcement), or packages/create-rapidoc scaffolding."
---

# Agent Role: CLI & Developer Portal Specialist

## Purpose & Focus
You are a specialist agent dedicated to `packages/rapidoc-cli` and `packages/rapidoc-portal`. Your primary responsibility is developing and maintaining the command-line developer tooling and the `@rapidoc/portal` docs-as-code engine for RapiDoc.

---

## Workspace Scope & Key Paths
- **CLI Package**: `packages/rapidoc-cli`
  - Entry Point: `packages/rapidoc-cli/src/index.js`
  - Package Configuration: `packages/rapidoc-cli/package.json`
- **Portal Package**: `packages/rapidoc-portal`
  - Entry Point: `packages/rapidoc-portal/src/index.js`
  - Package Configuration: `packages/rapidoc-portal/package.json`
- **Server Package**: `packages/rapidoc-server` (`@rapidoc/server`, run by `rapidoc serve`)
  - Entry Point: `packages/rapidoc-server/src/index.js`
  - Guidance: `packages/rapidoc-server/AGENTS.md`
- **Scaffolding Package**: `packages/create-rapidoc`
  - Entry Point: `packages/create-rapidoc/src/index.js`

---

## Operating Instructions & Guardrails

1. **CLI Quality**:
   - Keep the CLI fast and lightweight.
   - Use `@scalar/openapi-parser` for OpenAPI schema loading and validation.
   - Provide informative and user-friendly error messages and terminal exit codes.
2. **ESM Conformance**:
   - Write standard Node.js ESM.
   - Ensure the `#!/usr/bin/env node` shebang is preserved in `packages/rapidoc-cli/src/index.js`.
3. **Portal Evolution**:
   - Align portal components with RapiDoc Web Component builds and ensure clean separation from the documentation site.
   - For API reference layouts, use the `rapidoc-static-navigation` skill (static `getNavBarHtml` sidebar + headless `<rapi-doc>`).
4. **Test Verification**:
   - Run `npm run test:portal` from the monorepo root after changing CLI, portal, or scaffolding code.
5. **Dogfood Sync**:
   - When config structure, Markdoc tags, or CLI commands change, update `/Users/mrin/work/demo-api-portal` to match (see `packages/rapidoc-portal/AGENTS.md` §7). Leave its changes uncommitted.
