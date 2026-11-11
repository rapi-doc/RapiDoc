# AGENTS.md — `integrations/rapidoc-python` (`rapidoc` on PyPI)

## 1. Scope & Identity

RapiDoc for Python web frameworks (FastAPI and Starlette so far), and the reference integration for languages other than JavaScript: it shows that the contract of `@rapidoc/embed` can be ported and checked with the shared fixtures.

- **Distribution**: `rapidoc`; module `rapidoc`, with one submodule per framework (`rapidoc.fastapi`, `rapidoc.starlette`). No required dependency: a framework module imports the framework the app already has. The name `rapidoc_fastapi` is avoided on purpose: another PyPI package (`fastapi-rapidoc-router`) installs a module of that name
- **Not an npm workspace.** It lives under `integrations/`, outside `packages/`, with its own toolchain (uv or pip, pytest, hatchling) and its own version in `pyproject.toml`. Changesets and the npm release workflow do not see it; `npm run lint`, `format` and the `test:*` scripts do not cover it.
- **Meant to be able to move to a repository of its own.** The only links to the monorepo are the two defaults noted below.

| File | Role |
| :--- | :--- |
| `src/rapidoc/contract.py` | The contract in Python: a port of `packages/rapidoc-embed/src/core.js`, same function for function. No framework import |
| `src/rapidoc/__init__.py` | `rapidoc_version()`, `rapidoc_manifest()`, `ASSETS`. Imports no framework |
| `src/rapidoc/starlette.py` | `setup_rapidoc(app, ...)`: Python-style options, the app's `openapi_url` and `root_path`, Starlette routes |
| `src/rapidoc/fastapi.py` | Re-exports `setup_rapidoc` (a FastAPI app is a Starlette app) |
| `src/rapidoc/assets/` | One rapidoc release: `rapidoc-min.js`, its license file, `integration.json`. Not in git; in the wheel |
| `scripts/sync_assets.py` | Fills `assets/` from `packages/rapidoc/dist` (default), another folder, or the npm registry (`--npm VERSION`) |
| `examples/app.py` | A FastAPI app (launch config `fastapi-example`, port 4403) |

---

## 2. Boundaries and Invariants

- **`contract.py` and `core.js` change together.** Any change to the contract's output is made in `@rapidoc/embed` first (new contract version, regenerated fixtures), then ported here until `tests/test_conformance.py` passes. Never adjust a fixture to fit the port.
- **`contract.py` takes the contract's option names** (`specUrl`, `scriptUrl`), because the fixtures are read as they are. Python naming (`spec_url`, `script_url`, `render_style`) is translated in `starlette.py`.
- **The three asset files come from one rapidoc release**; `integration.json` carries the bundle's SRI hash, which is also the ETag.
- **Monorepo defaults**: `tests/test_conformance.py` reads the fixtures from `packages/rapidoc-embed/conformance/fixtures` (override with `RAPIDOC_CONFORMANCE_DIR`), and `sync_assets.py` reads `packages/rapidoc/dist`. In a repository of its own, the fixtures would be copied in and the assets synced with `--npm`.
- **No HTML in a framework module**: pages come from `contract.py`. A new framework (Flask, Django) is a new submodule over the same contract, not a new distribution.

---

## 3. Commands (from this folder)

| Command | Purpose |
| :--- | :--- |
| `uv venv && uv pip install -e ".[dev]"` | Set up `.venv` |
| `python scripts/sync_assets.py` | Copy the rapidoc build in (after `npm run build:rapidoc` at the repo root) |
| `.venv/bin/python -m pytest` | Conformance fixtures and the adapter tests |
| `.venv/bin/python -m uvicorn examples.app:app --port 4403` | Run the example |
| `uv build` | Build the sdist and wheel (run `sync_assets.py` first) |
