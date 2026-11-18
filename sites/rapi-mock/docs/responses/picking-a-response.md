---
title: Picking a response
description: Choose which documented response the mock returns, with the Prefer header.
---

Clients choose which documented response they get with a `Prefer` header:

| Header | Effect |
| :--- | :--- |
| `Prefer: code=404` | The documented `404` response (else `4XX`, else `default`). |
| `Prefer: example=empty` | The example named `empty`. |
| `Prefer: dynamic=true` | Generated data, even when the spec has an example. |

The response's `Preference-Applied` header tells you which preferences were used.

```bash
curl localhost:4010/openapi/pets/7 -H "Prefer: code=404"
```

With `--stateful`, a request with `Prefer: code=` or `Prefer: example=` gets that response as the spec writes it, and nothing is read or stored. This is how a test forces an error path.
