---
"@rapidoc/portal": patch
---

`.mdx` pages can import your own Astro components and modules from the project with a relative path, such as `import Hello from '../components/Hello.astro'`. These imports failed before, because the portal builds from a copy of `docs/`. Importing a React, Vue or Svelte component stops the build with an error that names the page and the import.
