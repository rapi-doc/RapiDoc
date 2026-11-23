---
title: Programmatic API
description: Build, serve and mock portals from your own Node.js scripts.
sidebar:
  order: 3
---

Every CLI command is a function you can call from Node.js 22.12 or later. All packages are ES modules.

## `@rapidoc/portal`

```js title="build.mjs"
import { buildPortal, startDevServer, loadConfig } from '@rapidoc/portal';

const result = await buildPortal('./my-portal', { outDir: 'dist' });
// { success, apisCount, outDir, durationMs, access? }

const server = await startDevServer('./my-portal', { port: 4321 });
await server.stop(); // stops the server and removes its workspace

const { config } = await loadConfig('./my-portal'); // the normalized config
```

With sign-in, `result.access` is `{ protectedPages, protectedFiles, zones, warnings }`.

Both `buildPortal` and `startDevServer` take `keepWorkspace: true` (the CLI's `--debug`) to keep the generated site in `.rapidoc-temp/`.

Other exports:

| Export | Does |
| :--- | :--- |
| `resolveConfig(raw, baseDir)` | Validates a config object and returns the normalized config, as `loadConfig` does for a file. Throws a `ConfigError` that lists every problem. |
| `migrateConfig`, `RapidocConfigSchema`, `defineConfig` | The Redocly and Zudoku converter, the zod schema, and the typing helper for a JavaScript config. |
| `buildSearchIndex` | The search index of guides and operations. |
| `checkPortalSpecs`, `checkApiSpec` | What `rapidoc validate` runs. |

Subpath exports: `@rapidoc/portal/config`, `/search`, `/components` (MDX components), `/components/PortalHead.astro`, `/components/PortalPageHeader.astro` and `/components/PortalPageFooter.astro` (for [your own pages](/docs/writing/pages/)) and `/schema.json`. Paths under `@rapidoc/portal/internal/` are for the build itself and can change in any release.

## `@rapidoc/server`

```js title="serve.mjs"
import { createApp, startServer } from '@rapidoc/server';

const { app, summary } = await createApp({ distDir: 'dist' }); // app: a Hono app, mount it or add middleware
const server = await startServer({ distDir: 'dist', port: 8080 }); // { url, port, summary, close }
await server.close();
```

`summary` describes the running server and holds no secret: `mode`, `basePath`, `mountPath`, `publicUrl`, `issuer`, `clientId`, `providerReady`, `access` (`{ files, zones }`, counts) and `mcp` (`{ enabled, tools }`).

## `@rapidoc/mock`

```js title="mock.mjs"
import { createMockApp, startMockServer } from '@rapidoc/mock';

const { app } = await createMockApp({
  apis: [{ id: 'orders', fullPath: '/abs/path/orders.yaml' }],
  issuer: 'https://example.us.auth0.com/',
  audience: 'https://api.example.com',
});
// app.fetch(request), or mount it in your own server

const mock = await startMockServer({ apis, port: 4010 });
// { url, port, apis, skipped, close }
```

## `create-rapidoc`

```js title="scaffold.mjs"
import { scaffoldProject, findOpenApiSpecs } from 'create-rapidoc/scaffold';

const specs = findOpenApiSpecs('./my-portal');
scaffoldProject('./my-portal', { title: 'Acme Developers', specs });
```
