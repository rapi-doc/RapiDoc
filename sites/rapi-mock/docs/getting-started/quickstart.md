---
title: Quickstart
description: Install RapiMock, start it on a spec, create a record and read it back.
---

RapiMock turns an OpenAPI spec into a mock API on your computer. At the end of this page, a mock of a sample library API runs locally and holds an author you created. You need Node.js 22.12 or later, an internet connection (the [sample spec](https://mock.rapidocui.com/spec-check/example.yaml) is fetched at start) and `curl`; the commands are for macOS and Linux shells. The steps are written for the sample; with your own OpenAPI 3.0, 3.1 or 3.2 file, use its file name and one of its paths.

## 1. Install

In your project folder (in an empty one, run `npm init -y` first):

```bash frame="terminal" title="terminal"
npm install -D @rapidoc/cli @rapidoc/mock
```

## 2. Start the mock server

```bash frame="terminal" title="terminal"
npx rapidoc mock https://mock.rapidocui.com/spec-check/example.yaml --stateful
```

`--stateful` keeps records. Each resource (here Author, Book and Loan) starts with 10 generated seed records, and what you create, change or delete shows up in later reads.

The server listens on `http://localhost:4010` (if that port is taken, it asks to use the next free one; then use the address it prints). Each API is served under a path named after its file, so `example.yaml` is at `http://localhost:4010/example`. The output includes:

```text
   • http://localhost:4010/example  City Library, 13 operation(s)  (https://mock.rapidocui.com/spec-check/example.yaml)
   • State:    example: 3 resource(s), 30 record(s). Operations: 10 stateful, 1 needs review, 2 static
   • Mock UI:  http://localhost:4010/__mock/ui
```

Each operation gets a label: `stateful`, `needs review` (it works, but the mock guessed something the spec left open) or `static`; see [How it works](/docs/getting-started/how-it-works/). The sample's one `needs review` is `listBooks`: its `sortedBy` parameter matches no field of Book.

Leave it running, and use a second terminal for the next steps. `Ctrl+C` stops it.

## 3. Create something and read it back

```bash frame="terminal" title="terminal"
curl -i -X POST http://localhost:4010/example/authors -H "Content-Type: application/json" -d '{"name":"Ursula K. Le Guin"}'
```

The mock answers `201 Created` with the new record and its id:

```text
HTTP/1.1 201 Created
...

{
  "name": "Ursula K. Le Guin",
  "id": 11
}
```

```bash frame="terminal" title="terminal"
curl http://localhost:4010/example/authors
```

The list has 11 authors: the 10 seed records, then yours.

## 4. Open the Mock UI

Open `http://localhost:4010/__mock/ui`. Its **Resources** section lists Author, Book and Loan with their records, including the author you created, and **Operations** shows each operation's label and the resource and action it maps to. See the [Mock UI tour](/docs/mock-ui/tour/).

## More than one spec

With your own files, each served under its file's name:

```bash frame="terminal" title="terminal"
npx rapidoc mock openapi.yaml --stateful    # /openapi
npx rapidoc mock orders.yaml billing.yaml   # /orders and /billing
npx rapidoc mock ./specs                    # every OpenAPI file in the folder
```

The port, a folder or [RapiDoc Portal](https://portal.rapidocui.com/) project with no argument, and the other options are in [CLI options](/docs/reference/cli/).

## Without state

Leave out `--stateful` and nothing is stored: each call gets the spec's example or generated data. Operations with `security` need a bearer token in both modes; without an issuer, any token is accepted unverified. See [What it answers](/docs/responses/what-it-answers/).

## Next steps

- [Keeping state](/docs/state/overview/): how resources and records work.
- [Seed data](/docs/state/seed-data/): start from your own records.
- [Picking a response](/docs/responses/picking-a-response/): ask for an error or a named example.
- [Tokens and scopes](/docs/responses/tokens-and-scopes/): verify tokens and scopes against your identity provider.
- [CLI options](/docs/reference/cli/): every option of `rapidoc mock`.
- [In JavaScript, without a port](/docs/testing/javascript/): use the mock in your test suite.
