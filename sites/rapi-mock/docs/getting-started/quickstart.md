---
title: Quickstart
description: Install Rapi Mock, start it on a spec, create a record and read it back.
---

You need Node.js 22.12 or later and an OpenAPI 3.0, 3.1 or 3.2 file.

## 1. Install

```bash
npm install -D @rapidoc/cli @rapidoc/mock
```

## 2. Start it

```bash
npx rapidoc mock openapi.yaml --stateful
```

The server listens on `http://localhost:4010` and serves each API under its own path, named after the file: `openapi.yaml` is served at `http://localhost:4010/openapi`. It prints what it found:

```text
• State:    openapi: 3 resource(s), 30 record(s). Operations: 14 stateful, 2 needs review, 3 static
• Mock UI:  http://localhost:4010/__mock/ui
```

## 3. Create something and read it back

```bash
curl -X POST localhost:4010/openapi/pets -H "Content-Type: application/json" -d '{"name":"Biscuit"}'
curl localhost:4010/openapi/pets
```

The second call lists the seeded pets and the one you created.

## 4. Look inside

Open `http://localhost:4010/__mock/ui` to see the records and what the mock does for each operation. See the [Mock UI tour](/docs/mock-ui/tour/).

## More than one spec

```bash
npx rapidoc mock orders.yaml billing.yaml   # /orders and /billing
npx rapidoc mock ./specs --port 4011        # every OpenAPI file in the folder
npx rapidoc mock                            # in a portal folder: the local specs under apis:
```

When two files would get the same name, their parent folders are added until the names differ (`billing-v1/openapi.yaml` becomes `/billing-v1-openapi`). The mapping is printed at start, and `GET /` lists the APIs served.

## Without state

Leave out `--stateful` and every call is answered on its own, from examples or generated data. Request validation and token checks work the same. See [What it answers](/docs/responses/what-it-answers/).
