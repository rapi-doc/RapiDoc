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
| `normalizeConfig`, `migrateConfig`, `RapidocConfigSchema` | Config helpers and the zod schema. |
| `compileMarkdoc`, `markdocTags` | Render Markdoc with the portal's tags to HTML. |
| `buildSearchIndex`, `searchRecords` | The search index of guides and operations. |
| `checkPortalSpecs`, `checkApiSpec` | What `rapidoc validate` runs. |

Subpath exports: `@rapidoc/portal/config`, `/markdoc`, `/search`, `/components` (MDX components) and `/schema.json`.

## `@rapidoc/server`

```js title="serve.mjs"
import { createApp, startServer } from '@rapidoc/server';

const { app } = await createApp({ distDir: 'dist' }); // a Hono app: mount it or add middleware
const server = await startServer({ distDir: 'dist', port: 8080 });
await server.close();
```

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
