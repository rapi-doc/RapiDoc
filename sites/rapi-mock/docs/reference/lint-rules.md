---
title: Lint rules
description: The rapidoc lint rules about mocking - examples, and what the stateful mock assumes.
---

These are the `rapidoc lint` rules that concern the mock. The full list is in the [RapiDoc CLI docs](https://rapidocui.com/docs/cli/lint/).

## Examples

On by default, as warnings.

| Rule | It reports |
| :--- | :--- |
| `example-named-map` | A media type's `example` that is a map of named examples, which belongs under `examples`. |
| `example-matches-schema` | A request or response example that does not fit its schema. Needs `@rapidoc/mock` installed. |

## The stateful mock

Off by default. `--stateful` turns on the first six as warnings; a severity set by name (`--rule`, or the lint config) wins. They need `@rapidoc/mock` installed.

| Rule | It reports |
| :--- | :--- |
| `stateful-resource-key` | A resource whose key the spec doesn't show: no path parameter matches a field, or there is no item path such as `/things/{id}`. |
| `stateful-list-filter` | A query parameter of a list that matches no field of what it returns. Paging and sorting parameters are fine. |
| `stateful-write-unmapped` | A `PUT`, `PATCH` or `DELETE` that fits no resource. |
| `stateful-reference-target` | A field that looks like a reference (`owner_id`) to a resource the spec doesn't have. |
| `stateful-response-unnamed` | A collection and its item path whose records are described by an inline schema. |
| `stateful-operation-assumed` | Another assumption about what an operation does. |
| `stateful-relation-assumed` | A link between resources matched by more than the field's plain name. Not turned on by `--stateful`. |

## `mock-config`

Not a rule you set: an entry of [`mock.config.yaml`](/docs/reference/config-file/) that no longer fits the spec, reported with the file's name.

## Options

| Option | Meaning |
| :--- | :--- |
| `--stateful` | Turn on the stateful mock's rules. |
| `--mock-config <file>` | The corrections file to read. Default: `mock.config.yaml` beside the spec or in the folder. |
| `--rule name=severity` | Set one rule: `error`, `warn` or `off`. |
