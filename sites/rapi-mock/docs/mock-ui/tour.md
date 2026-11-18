---
title: A tour of the Mock UI
description: See the records Rapi Mock holds, what it does for every operation, and how sure it is.
---

With `--stateful`, the mock serves a page at `/__mock/ui` on its own port: `http://localhost:4010/__mock/ui`. It shows what the mock made of each spec and what it holds now.

Pick an API in the header. The sidebar has four sections.

## Dashboard

How many resources, records and operations the mock found, the share of operations per label with what each label means, and the assumptions worth a look.

## Resources

Each resource the mock found, with its records in a table you can filter and sort. The header row and the key column stay in place while you scroll. Select a row to see the whole record.

The **About** tab shows:

- the resource's fields, with type, flags and example;
- how each field is seeded: "a first name", "the id of an Owner record", "shaped like the example";
- its links to other resources;
- the operations on it;
- a button that generates a sample record without storing it.

## Operations

Every operation with what the mock does for it and one of three labels: **Stateful**, **Needs review** with the reason, or **Static**. Group them by path or by resource.

**Details** opens one operation: what the mock does in a sentence, what it uses each parameter for, what the request and each response hold, and a sample response.

## Settings

How the mock was started, new seed data with another number of records or another seed, and a delay for every API response. What you change here lasts until the mock stops; the page shows the option that keeps it (`--rows`, `--seed`, `--delay`).

## In the header

- **Reset data** puts the selected API back to its seed data.
- **Session** shows the data of one [`X-Mock-Session`](/docs/state/sessions/).

Every page has its own address, so it can be reloaded or shared.

:::note
Screenshots of each section will be added here.
:::

The page reads the same [control endpoints](/docs/reference/control-api/) your tests can call. It is open to any caller, like those endpoints: don't expose the mock publicly.
