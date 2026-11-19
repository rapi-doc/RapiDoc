---
title: How a build works
description: What rapidoc dev and rapidoc build do, step by step.
sidebar:
  order: 4
---

You don't need this page to write or deploy a portal. It explains what the commands do behind the scenes, for debugging a build or a leftover folder.

`rapidoc build` runs five steps:

1. **Load and validate** `rapidoc.config.yaml`. An unknown key or a wrong value stops the build with its path.
2. **Create a temporary workspace** at `<project>/.rapidoc-temp/<dev|build>-<pid>-<n>/`, one per run, so a build never disturbs a running `rapidoc dev`. It holds a normalized copy of `docs/`, the `public/` folder, the specs, the RapiDoc bundle and the search index.
3. **Render the site** from the workspace with [Astro](https://astro.build/) and its documentation theme, Starlight. The pages (home, guides, catalog, API reference) and their components come from `@rapidoc/portal`.
4. **Write the static site** to `dist/` (or `--out-dir`). With sign-in configured, the output is then split into `public/`, `protected/` and `rapidoc-server.json` for `rapidoc serve`.
5. **Delete the workspace**, even when the build fails. Your project ends up exactly as it was, plus `dist/`.

`rapidoc dev` runs steps 1 to 3 and serves the site on `http://localhost:4321`. It watches the project: guide edits appear immediately, and a change to the config or a spec restarts the server. Its workspace is removed when the server stops, including with Ctrl+C.

:::note[A leftover .rapidoc-temp folder]
A run killed before it can clean up (`kill -9`, a crash) leaves its folder behind. The next run removes the folders of processes that are no longer running.
:::

## Why not the OS temp folder?

Astro only compiles pages that share a parent folder with the site root, so the workspace has to live inside your project.

## Debugging the engine

```bash
npx rapidoc build --debug
```

`--debug` keeps the workspace and prints its path, so you can inspect the generated site.
