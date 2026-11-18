---
title: In JavaScript, without a port
description: Use @rapidoc/mock as a library - in-process in your tests, or inside your own server.
---

`@rapidoc/mock` runs without the CLI, for test setups and your own servers.

## In a test, in-process

`createMockApp` returns an app you can call directly. No port, no separate process:

```javascript
import { createMockApp } from "@rapidoc/mock";

const { app } = await createMockApp({
  apis: [{ id: "orders", fullPath: "/abs/path/orders.yaml" }],
  stateful: true,
});

const created = await app.request("/orders/orders", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ item: "tea" }),
});
```

The control endpoints work the same way: `app.request("/__mock/reset", { method: "POST" })`.

## On a port

```javascript
import { startMockServer } from "@rapidoc/mock";

const server = await startMockServer({
  apis: [{ id: "orders", fullPath: "/abs/path/orders.yaml" }],
  stateful: { rows: 25 },
  port: 0, // a free port
});
console.log(server.url);
await server.close();
```

## Options

| Option | Meaning |
| :--- | :--- |
| `apis` | `[{ id, fullPath, title? }]`: each spec, and the path prefix it is served under |
| `stateful` | `true`, or `{ rows, config }`. `config` is a parsed [`mock.config.yaml`](/docs/reference/config-file/) |
| `seed` | Seed of generated data. Default `1` |
| `delay` | Milliseconds every API response waits. Default `0` |
| `issuer`, `audience` | Token checks, as in [Tokens and scopes](/docs/responses/tokens-and-scopes/) |
| `streamInterval` | Gap between the items of a streamed response |
| `origin` | Origins allowed by CORS. Default `*` |
| `port`, `host` | `startMockServer` only. Defaults `4010` and `0.0.0.0` |

The app is a [Hono](https://hono.dev) app, so it can be mounted under a path of a server you already have.
