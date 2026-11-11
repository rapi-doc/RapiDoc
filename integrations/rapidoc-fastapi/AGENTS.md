# AGENTS.md — `integrations/rapidoc-fastapi` (`rapidoc-fastapi` on PyPI)

## 1. Scope & Identity

RapiDoc for FastAPI and Starlette, and the reference integration for languages other than JavaScript: it shows that the contract of `@rapidoc/embed` can be ported and checked with the shared fixtures.

- **Distribution**: `rapidoc-fastapi`; module `rapidoc_fastapi`; depends on `starlette` only (FastAPI is not required)
- **Not an npm workspace.** It lives under `integrations/`, outside `packages/`, with its own toolchain (uv or pip, pytest, hatchling) and its own version in `pyproject.toml`. Changesets and the npm release workflow do not see it; `npm run lint`, `format` and the `test:*` scripts do not cover it.
- **Meant to be able to move to a repository of its own.** The only links to the monorepo are the two defaults noted below.

| File | Role |
| :--- | :--- |
| `src/rapidoc_fastapi/contract.py` | The contract in Python: a port of `packages/rapidoc-embed/src/core.js`, same function for function. No framework import |
| `src/rapidoc_fastapi/__init__.py` | `setup_rapidoc(app, ...)`: Python-style options, the app's `openapi_url` and `root_path`, Starlette routes |
| `src/rapidoc_fastapi/assets/` | One rapidoc release: `rapidoc-min.js`, its license file, `integration.json`. Not in git; in the wheel |
| `scripts/sync_assets.py` | Fills `assets/` from `packages/rapidoc/dist` (default), another folder, or the npm registry (`--npm VERSION`) |
| `examples/app.py` | A FastAPI app (launch config `fastapi-example`, port 4403) |

---

## 2. Boundaries and Invariants

- **`contract.py` and `core.js` change together.** Any change to the contract's output is made in `@rapidoc/embed` first (new contract version, regenerated fixtures), then ported here until `tests/test_conformance.py` passes. Never adjust a fixture to fit the port.
- **`contract.py` takes the contract's option names** (`specUrl`, `scriptUrl`), because the fixtures are read as they are. Python naming (`spec_url`, `script_url`, `render_style`) is translated in `__init__.py`.
- **The three asset files come from one rapidoc release**; `integration.json` carries the bundle's SRI hash, which is also the ETag.
- **Monorepo defaults**: `tests/test_conformance.py` reads the fixtures from `packages/rapidoc-embed/conformance/fixtures` (override with `RAPIDOC_CONFORMANCE_DIR`), and `sync_assets.py` reads `packages/rapidoc/dist`. In a repository of its own, the fixtures would be copied in and the assets synced with `--npm`.
- **No HTML in `__init__.py`**: pages come from `contract.py`.

---

## 3. Commands (from this folder)

| Command | Purpose |
| :--- | :--- |
| `uv venv && uv pip install -e ".[dev]"` | Set up `.venv` |
| `python scripts/sync_assets.py` | Copy the rapidoc build in (after `npm run build:rapidoc` at the repo root) |
| `.venv/bin/python -m pytest` | Conformance fixtures and the adapter tests |
| `.venv/bin/python -m uvicorn examples.app:app --port 4403` | Run the example |
| `uv build` | Build the sdist and wheel (run `sync_assets.py` first) |
