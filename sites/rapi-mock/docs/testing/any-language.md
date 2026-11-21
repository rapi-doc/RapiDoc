---
title: Tests in any language
description: Prepare and check RapiMock's data over HTTP, from pytest, JUnit, Go or anything else.
---

The mock has its own endpoints under `/__mock`, beside the APIs. A test in any language uses them over HTTP: wait until the mock is ready, reset the data, act through the API, then check what was stored.

## The pattern

```python
# pytest
import requests

MOCK = "http://localhost:4010"

def setup_function():
    requests.post(f"{MOCK}/__mock/reset")          # back to the seed data

def test_adopting_a_pet():
    pet = requests.post(f"{MOCK}/openapi/pets", json={"name": "Biscuit"}).json()
    requests.patch(f"{MOCK}/openapi/pets/{pet['id']}", json={"status": "sold"})

    stored = requests.get(f"{MOCK}/__mock/state/openapi/Pet/{pet['id']}").json()
    assert stored["status"] == "sold"
```

## Tests that run in parallel

Give each test its own [session](/docs/state/sessions/), and it never sees another test's data. No reset is needed between them:

```python
headers = {"X-Mock-Session": "test_adopting_a_pet"}
requests.post(f"{MOCK}/openapi/pets", json={"name": "Biscuit"}, headers=headers)
```

## Starting from your own data

Load the records a test needs, in place of the generated ones:

```bash
curl -X POST localhost:4010/__mock/restore -H "Content-Type: application/json" \
  -d '{"openapi": {"Pet": [{"id": 1, "name": "Biscuit", "status": "available"}]}}'
```

`POST /__mock/snapshot` returns the current records in the same shape, to save and load again later.

## In CI

Start the mock in the background, wait for it, run the tests:

```bash
npx rapidoc mock openapi.yaml --stateful &
until curl -sf localhost:4010/__mock/health > /dev/null; do sleep 0.5; done
pytest
```

## Forcing an error

Send `Prefer: code=500` on a request to get that documented response, whatever is stored. See [Picking a response](/docs/responses/picking-a-response/).

All the endpoints are in the [Control API reference](/docs/reference/control-api/).
