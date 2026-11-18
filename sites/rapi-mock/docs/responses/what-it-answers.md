---
title: What it answers
description: Where Rapi Mock's responses come from, and how requests are validated.
---

- **Examples first.** An operation's response example is returned when the spec has one; otherwise data is generated from the schema, respecting formats, patterns, enums and ranges. Generated data is the same on every run (change it with `--seed`).
- **Requests are validated.** Parameters and JSON, form and multipart bodies are checked against the spec. A bad request gets `400` with the list of problems (`422` when the operation documents `422` and not `400`).
- **OpenAPI 3.2 methods.** `QUERY` operations and those under `additionalOperations` (`PURGE`, `COPY`, `LINK`, ...) are served and validated like the others, and pass CORS preflight. A method Node's HTTP server doesn't accept can't be called; the mock warns about it when it starts.
- **Streams.** A response whose media type has an OpenAPI 3.2 `itemSchema` (Server-Sent Events, JSON Lines, `application/json-seq`) is sent one item at a time, `--stream-interval` apart (default 300 ms). A JSON Lines request body is checked line by line against its `itemSchema`.
- **CORS** is allowed for any origin.
- **A delay**, with `--delay <ms>`: every API response waits that long, to see loading states in a client.

## An example written the wrong way

Some specs put a named example under `example`, where it belongs under `examples`:

```yaml
example:
  Calendar example:
    id: 1
    name: Team
```

The mock returns the value under the name, not the wrapper, when the response schema confirms it. `rapidoc lint` reports it as [`example-named-map`](/docs/reference/lint-rules/).

With `--stateful`, operations that fit a resource are answered from stored records. See [Keeping state](/docs/state/overview/).
