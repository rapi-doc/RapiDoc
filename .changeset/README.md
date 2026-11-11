# Changesets

Each file here (other than this one and `config.json`) is a changeset: the packages a change releases, how big the bump is, and one line for the changelog. Add one with `npm run changeset` in any pull request that changes a published package.

Versioning (`config.json`):

- `rapidoc` (the web component) has its own version.
- `@rapidoc/cli`, `portal`, `server`, `mock`, `prerender`, `mcp` and `create-rapidoc` are one `fixed` group: they always release together, with the same version.
- `@rapidoc/embed` (the integration contract) has its own version.

Releasing: [AGENTS.md](../AGENTS.md), "Releasing".
