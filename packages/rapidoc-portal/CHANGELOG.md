# @rapidoc/portal

## 0.1.6

### Patch Changes

- 3d9a081: `.mdx` pages can import your own Astro components and modules from the project with a relative path, such as `import Hello from '../components/Hello.astro'`. These imports failed before, because the portal builds from a copy of `docs/`. Importing a React, Vue or Svelte component stops the build with an error that names the page and the import.
- @rapidoc/mcp@0.1.6
  - @rapidoc/prerender@0.1.6

## 0.1.5

### Patch Changes

- 3e15e56: A closed `site.banner` stays closed after a reload and on later visits, until its message or link changes. Before, it came back on every reload.
- ef165dc: API reference pages use `<rapi-doc>`'s own `scale="default"` instead of `lg`. Body text and headings keep the portal's sizes; code, descriptions and small labels are 1–2px smaller (code 13px instead of 15px). Set `scale: lg` under `rapidoc:` to keep the previous sizes.
- 918988a: The "On this page" rail bends with rounded curves at nested headings, and its highlight covers every section on screen, growing, shrinking and gliding along the rail as the page scrolls instead of jumping (no animation with reduced motion).
- Updated dependencies [7f698d8]
- Updated dependencies [5931b08]
- Updated dependencies [11e945c]
- Updated dependencies [2ddb480]
- Updated dependencies [6283526]
- Updated dependencies [0095bb9]
  - rapidoc@12.1.2
  - @rapidoc/prerender@0.1.5
  - @rapidoc/mcp@0.1.5

## 0.1.4

### Patch Changes

- c109c23: A portal without `navigation:` builds again: its default sidebar (every page in `docs/`) uses the group format current Starlight versions require.
- 98c5872: Uses Starlight 0.42.10.
- @rapidoc/mcp@0.1.4
  - @rapidoc/prerender@0.1.4

## 0.1.3

### Patch Changes

- fa36d7d: `{% api-operation %}` takes `collapsed=true`: the embed shows only the operation's method and path, and opens when the reader clicks it.
- Updated dependencies [691aeff]
- Updated dependencies [9deb938]
  - rapidoc@12.1.1
  - @rapidoc/prerender@0.1.3
  - @rapidoc/mcp@0.1.3

## 0.1.2

### Patch Changes

- @rapidoc/mcp@0.1.2
  - @rapidoc/prerender@0.1.2
