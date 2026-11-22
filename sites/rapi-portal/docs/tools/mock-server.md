---
title: Mock server
description: Serve your specs with examples and generated data, validate requests, and check real OAuth scopes.
---

`rapidoc mock` serves every local spec of the portal on one port, each under `/<api id>` (a version other than the default under `/<api id>/<version>`). Readers can press **Try** before the API exists, and you can demo who may call what with real tokens.

```bash
npm install -D @rapidoc/mock
npx rapidoc mock
```

```text
http://localhost:4010/bookstore   → specs/bookstore.yaml
```

List the mock as a server in the spec, and the reference pages' **Try** calls it:

```yaml title="specs/bookstore.yaml"
servers:
  - url: http://localhost:4010/bookstore
    description: Local mock
```

This site's [example API](/apis/bookstore/) does exactly that: run `npm run mock:portal-site` in the [RapiDoc repository](https://github.com/rapi-doc/RapiDoc), where this site's source is, and **Try** answers. **Run workflow** on a [workflow](/docs/configuration/workflows/#run-against-the-mock) diagram uses the same server, so whole workflows run with no backend.

## What it answers

Examples from the spec first, else data generated from the schema; requests are validated against the spec; `Prefer` headers pick a documented response (`Prefer: code=404`); CORS is allowed for any origin. All of that, streamed responses (OpenAPI 3.2 `itemSchema`: Server-Sent Events and JSON Lines, sent one item at a time), and the options (`--port`, `--host`, `--seed`, `--stream-interval`), is on the [Mock Server](https://mock.rapidocui.com/) page of the RapiDoc docs.

## Real token checks

Each operation's `security` is enforced. Start the mock with your OpenID Connect issuer, and bearer tokens must be signed by it, unexpired, for your audience and carry the operation's scopes (else `401` or `403`):

```bash
npx rapidoc mock --issuer https://acme.us.auth0.com/ --audience https://api.acme.com
```

`--issuer` and `--audience` can also come from `RAPIDOC_MOCK_ISSUER` and `RAPIDOC_MOCK_AUDIENCE`. Without `--issuer`, any bearer token passes and scopes aren't checked. Combined with [Try with the reader's token](/docs/access/try-it/), signed-in readers see `200` or `403` depending on their own permissions.

## Without a portal

The mock also works on plain spec files:

```bash
npx rapidoc mock ./specs                      # every OpenAPI file in the folder
npx rapidoc mock orders.yaml billing.json     # these files
```

Each spec is served under its file name: `orders-api.yaml` is `/orders-api`. The mapping is printed at start. This needs only `@rapidoc/cli` and `@rapidoc/mock`, not the portal.
