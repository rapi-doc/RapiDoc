---
title: Introduction
description: What RapiMock is, what it is for, and how it differs from the in-browser mock.
---

RapiMock is a mock server for the APIs you describe with OpenAPI. Give it a spec and it answers every operation over HTTP, so a frontend, a test suite or another service can call your API before it exists.

It is the `rapidoc mock` command of the RapiDoc CLI, backed by the `@rapidoc/mock` package.

## What it does

- **Answers every operation** from the spec's examples, or with data generated from its schemas.
- **Validates requests** against the spec: a bad request gets a `400` with the problems listed.
- **Checks tokens**: OAuth and bearer tokens are verified against your issuer, with the operation's scopes.
- **Keeps state**, with `--stateful`: it works out the resources in your spec, starts with generated records, and remembers what you create, change and delete.
- **Shows you what it holds**: the Mock UI lists the records, and what the mock does for every operation.
- **Works with tests in any language**: reset, read and load the data over HTTP.

## What it is not

- **Not a copy of your backend.** It knows what the spec says: shapes, required fields, which paths belong together. It does not know your business rules, such as "an order can't ship before it is paid".
- **Not a database.** Data lives in memory and starts fresh on every run.
- **Not for production traffic.** Its control endpoints are open by design. Run it on a developer's machine or in CI.

## Next

- [Quickstart](/docs/getting-started/quickstart/): running in two minutes.
- [How it works](/docs/getting-started/how-it-works/): how it reads a data model off a spec.
