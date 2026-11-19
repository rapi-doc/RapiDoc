---
title: Control API
description: The /__mock endpoints - health, the model, lint, settings, reset, state, snapshot and restore.
---

The mock's own endpoints are at `/__mock`, beside the APIs. With an `X-Mock-Session` header, each works on that [session](/docs/state/sessions/)'s data only.

| Endpoint | What it does |
| :--- | :--- |
| `GET /__mock/health` | Ready check: `200` with the APIs served. Works without `--stateful` too. |
| `GET /__mock/model` | What the mock made of each spec: resources, and every operation with its label. `/<api id>` for one API. |
| `GET /__mock/model/<api id>/resources/<Resource>` | One resource: fields, how each is seeded, links, operations. Add `/sample` for a generated record that is not stored (`?seed=` to repeat it). |
| `GET /__mock/model/<api id>/operations/<id>` | One operation: what the mock does, its parameters, request, responses and a sample response. `<id>` is the `id` the model lists, URL-encoded. |
| `GET /__mock/lint/<api id>` | What [lint](/docs/correcting/lint/) finds in the API's spec, as `rapidoc lint --stateful` reports it: every finding with its rule and line, and the share of checks that passed per category. The first call lints the spec, which takes a few seconds on a large one; the answer is kept. |
| `GET /__mock/settings` | How the mock was started: state, seed, rows, delay, tokens, the APIs. |
| `PATCH /__mock/settings` | Changes the response delay while the mock runs: `{ "delay": 250 }`. |
| `POST /__mock/reset` | Puts the data back to what the mock started with. `?api=<id>` resets one API. With a body `{ "rows": 25, "seed": 7 }` it makes new seed data of that size, and drops every session's records. |
| `GET /__mock/state` | The stored records. Narrow it with `/<api id>`, `/<api id>/<Resource>` or `/<api id>/<Resource>/<key>`. |
| `POST /__mock/snapshot` | Returns all stored records as one JSON document. `?api=<id>` for one API. |
| `POST /__mock/restore` | Replaces the records with the document you send: a snapshot, or data your test wrote. |
| `GET /__mock/ui` | The [Mock UI](/docs/mock-ui/tour/). |

## The state document

`snapshot` returns it and `restore` takes it:

```json
{ "<api id>": { "<Resource>": [ { "id": 1, "name": "Biscuit" } ] } }
```

- A restore replaces every resource of the APIs it names; a resource it leaves out becomes empty. Other APIs are left alone.
- A document that is wrong changes nothing.
- A record that lives under a parent without having a field for it carries the parent in `$parents`. Keep that entry when you restore.

## Errors

Problems come back as `application/problem+json`, with a `detail` that says what to do. Without `--stateful`, every endpoint except `health` returns `409`.

## Not for a public server

These endpoints are open to any caller: anyone who can reach the mock can reset or replace its data. The mock is a development tool. Don't expose it publicly.

:::note
An OpenAPI description of this API, shown here as an interactive reference, is planned.
:::
