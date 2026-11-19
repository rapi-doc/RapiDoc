---
title: A tour of the Mock UI
description: See the records Rapi Mock holds, what it does for every operation, and how sure it is.
---

With `--stateful`, the mock serves a page at `/__mock/ui` on its own port: `http://localhost:4010/__mock/ui`. It shows what the mock made of each spec and what it holds now.

Pick an API in the header. The sidebar has five sections.

## Dashboard

How many operations, resources and records the mock found, the lint summary, the share of operations per label with what each label means, and a table of the assumptions the mock made that need your review: what it guessed about each resource or operation, with a link to it.

## Operations

Every operation with what the mock does for it and one of three labels: **Stateful**, **Needs review** with the reason, or **Static**. Each path is written once, beside its methods, so the list reads like the spec. Group them by path or by resource. The list scrolls under its header, so the filters stay in view.

Select an operation's row, or a path to open its first operation, to see one operation: what the mock does in a sentence, what it uses each parameter for, and what the request holds. The other methods of the same path are tabs at the top. Each response shows its status, its schema, its data source (the spec's example, a named example, or data generated from the schema), and whether a request gets it by default or with `Prefer: code=`. Select a response to see its sample in a drawer beside the table; its close button, or Esc, hides it.

## Resources

Each resource the mock found, with how many records it holds now; a dot marks one that needs review, with the reason on hover. The count is plain while it is what the mock was seeded with, and marked with the difference once requests create or delete records ("11 (+1)"); **Reset data** puts it back. It follows the session in the header and updates when the page reads the data again (**Refresh**).

The section is one panel: the list of resources on the left, and beside it the **Records** and **Schema** tabs with the records' filter on one row. The list and the records each scroll on their own, so the records stay in view.

The **Records** tab shows the records in a table you can filter and sort. The header row and the key column, marked `key`, stay in place while you scroll; a shadow at an edge shows there are more columns that way. Select a row to see the whole record in a drawer over the table; its close button, or Esc, hides it.

The **Schema** tab shows:

- the resource's fields, the key first, with type, flags and example; a field that holds an object, or a list of objects, opens to its own fields (**Expand all** opens every one);
- how each field is seeded: "a first name", "the id of an Owner record", "shaped like the example";
- the operations on the resource;
- its links to other resources: each field that points at one, and how the mock matched it (or why it could not), then the fields of other resources that point here.

## Lint

What [lint](/docs/correcting/lint/) found in the spec, as `rapidoc lint --stateful` reports it: the share of checks that passed, each category and its rules, and every finding with its line. Pick a category or a rule to see its findings alone. The Dashboard shows the same summary in a card. The spec is linted when the page first asks, so a large one takes a few seconds to show.

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
