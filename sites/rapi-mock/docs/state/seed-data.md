---
title: Seed data
description: The records every resource starts with, and where each value comes from.
---

With `--stateful`, every resource starts with records generated from its schema.

```bash
npx rapidoc mock openapi.yaml --stateful --rows 25 --seed 7
```

| Option | Meaning |
| :--- | :--- |
| `--rows <number>` | Records per resource. Default `10`. |
| `--seed <number>` | Seed of the generated data. Default `1`. The same spec and seed give the same records. |

## Where a value comes from

In this order:

1. **A link to another record.** `ownerId` on a pet is the id of a seeded owner. References always point at records that exist.
2. **The spec's own values.** An enum takes each of its values in turn, so every `status` has records. A `const` or `default` stands.
3. **The spec's examples**, in the first record of each resource.
4. **The field's name.** `firstName` is a first name, `city` a city, `email` an address built from the same first and last name.
5. **The shape of the example.** Where the schema says only "string" and the example is a date, a code or a five-digit number, later records get another value of that shape.
6. **The schema**: its format, pattern and limits.

A `pattern` is always respected. A readable value is used when it fits the pattern.

The [Mock UI](/docs/mock-ui/tour/) shows this per field, in a resource's **About** tab, and can generate a sample record without storing it.

## New seed data without a restart

From the Mock UI's Settings page, or over HTTP:

```bash
curl -X POST localhost:4010/__mock/reset -H "Content-Type: application/json" -d '{"rows":25,"seed":7}'
```

This replaces all stored records, in every session.
