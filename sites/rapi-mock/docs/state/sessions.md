---
title: Sessions
description: Give each test its own copy of the data with the X-Mock-Session header.
tableOfContents: false
---

Send an `X-Mock-Session` header to get your own copy of the data. Tests that run at the same time then never see each other's changes:

```bash
curl -X POST localhost:4010/openapi/pets \
  -H "X-Mock-Session: test-1" -H "Content-Type: application/json" \
  -d '{"name":"Biscuit"}'

curl localhost:4010/openapi/pets -H "X-Mock-Session: test-1"   # has Biscuit
curl localhost:4010/openapi/pets                               # does not
```

- A session starts as a copy of the seed data, made when it first writes.
- Requests without the header share the default data.
- The [control endpoints](/docs/reference/control-api/) follow the header too: a reset or a read of the state with `X-Mock-Session` works on that session only.

Any value works as a session id. A test's own name is a good one.

## How many sessions

The mock keeps the data of 1000 sessions per API. When one more session writes, the session used longest ago is dropped: its header then reads the seed data again, as a new session would. A session that only reads holds no copy and does not count. A test run that starts thousands of sessions and comes back to an early one much later should `POST /__mock/reset` with its header first, or use fewer session ids.
