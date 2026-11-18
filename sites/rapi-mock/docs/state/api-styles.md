---
title: API styles
description: Which kinds of API Rapi Mock keeps state for with no configuration, and which need a few lines.
---

Rapi Mock reads the data model off your spec. How much it finds depends on how the API is written. This page says plainly where it works and where it needs help.

## Works with no configuration

APIs where:

- a record has its own path, with its id in it: `/pets/{petId}`;
- the key is a field at the top of the record: `id`, `slug`, `username`;
- the collection is at the path above: `/pets`.

The list may be a bare array, sit under `data`, `items` or `results`, in a page object under `values`, or under a property named after the resource (`load_balancers`).

## Needs a few lines of config

| The API... | What happens without config | What to state |
| :--- | :--- | :--- |
| keeps the key inside the record (Kubernetes: `metadata.name`) | Lists and creates work; reading, updating or deleting one record keeps no state | `resources.<Name>.key: metadata.name` |
| passes the id in the query string (`DELETE /videos?id=7`) | Lists, creates and updates work; deletes keep no state | `operations.<id>` with `key: query.id` |
| describes records with inline schemas, without a name | Those operations stay plain mock | Name the schema in the spec |

See [`mock.config.yaml`](/docs/correcting/config-file/).

## Not supported yet

- **One-of-a-kind records**, read and written at a fixed path, such as `/settings/vacation`. They are answered as a plain mock.
- **Swagger 2.0.** The mock reads OpenAPI 3.0, 3.1 and 3.2. Convert a 2.0 spec first.
- **APIs that are not resource-style**, such as `chat.postMessage`. These are answered as a plain mock throughout, which is the right outcome: there are no resources to keep.

## How we know

These statements come from running the mock on public specs outside the set it was built on, and checking the results by hand. The first runs found gaps; the figures below are after the fixes those runs led to, so they show where it stands, not how it does on a spec nobody has tried.

| Spec | Records that work completely |
| :--- | :--- |
| Gmail | 11 of 12 |
| DigitalOcean | 83 of 120 |
| Jira Cloud | 41 of 58 |
| Kubernetes | None without config; its key is nested |

"Completely" means reading, listing, creating, updating and deleting all use the store, wherever the spec has those operations. Where the mock labelled an operation **Confident**, it was right in 58 of 60 cases checked by hand on the first runs.

To see where your own spec stands before running the mock, use [`rapidoc lint --stateful`](/docs/correcting/lint/).
