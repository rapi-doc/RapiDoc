---
title: Lint your spec for the mock
description: rapidoc lint --stateful reports what the mock had to assume about your spec, before you run it.
---

`rapidoc lint --stateful` reports where your spec leaves the data model unclear, at the line where it happens, without starting the mock:

```bash
npx rapidoc lint openapi.yaml --stateful
```

```text
openapi.yaml:12:5   GET /pets: query parameter color matches no field of Pet: the mock ignores it when listing  [stateful-list-filter]
openapi.yaml:163:5  Resource Widget: no key field found for {code}: the mock can't tell one record from another  [stateful-resource-key]
```

The findings are the mock's own, the same as the **Needs review** labels in its UI, so they need `@rapidoc/mock` installed.

## What to do with a finding

| Finding | Fix |
| :--- | :--- |
| A resource has no visible key | Name the path parameter after the field (`{petId}` and `id`), or set the key in [`mock.config.yaml`](/docs/correcting/config-file/) |
| A list's query parameter matches no field | Name it after the field it filters by; otherwise the mock ignores it |
| A write fits no resource | Nothing, if it is an action and not a change to a record |
| A field looks like a reference to a resource the spec doesn't have | Nothing, if that resource lives in another API |
| Records are described by an inline schema | Move the schema under `components.schemas` and refer to it |

All the rules are in the [reference](/docs/reference/lint-rules/).

## It reads your corrections

Lint reads `mock.config.yaml` beside the spec (or the one `--mock-config` names). What the file states is not reported, and an entry in it that no longer fits the spec is reported as `mock-config`.

## Examples too

Two more rules check the examples the mock answers with, and are on by default:

- `example-named-map`: an `example` written as a map of named examples.
- `example-matches-schema`: an example that does not fit its schema.

`rapidoc lint` has many more rules for what a good API reference needs. They are documented with the [RapiDoc CLI](https://rapidocui.com/docs/cli/lint/).
