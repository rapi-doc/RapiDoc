---
title: How it works
description: How Rapi Mock reads resources, keys and links off an OpenAPI spec, and what the three labels mean.
---

An OpenAPI spec describes operations. It never says "these five operations are about the same pet". Rapi Mock works that out, and tells you how sure it is.

## From paths and schemas to resources

These three paths:

```text
GET    /pets            returns a list of Pet
POST   /pets            takes a Pet
GET    /pets/{petId}    returns a Pet
```

share a schema and a path shape, so they become one **resource**, `Pet`. From that the mock derives:

- **The key**: the path parameter matched to a field, `{petId}` to `id`.
- **What each operation does**: list, create, read, update, patch or delete.
- **Links**: a field such as `ownerId` points at the `Owner` resource, so seeded pets belong to seeded owners.
- **Parents**: a comment created at `/articles/{slug}/comments` belongs to that article.

Where the records sit in a response is read from its structure: a bare array, a `data` property, a page object's `values`, or a property named after the resource.

## Three labels

Every operation gets one:

| Label | Meaning |
| :--- | :--- |
| **Stateful** | Reads and changes stored records. The spec says clearly which resource the operation works on, so what you create shows up in later calls. |
| **Needs review** | Reads and changes stored records too, but the spec left a gap and the mock filled it with a best guess, such as which field is the key. The Mock UI and `rapidoc lint --stateful` show each guess; correct a wrong one in [`mock.config.yaml`](/docs/correcting/config-file/). |
| **Static** | Keeps no data. No resource fits the operation, so it returns the spec's example, or generated data, the same on every call. Nothing you send is stored. A login, a search, a file upload. |

The mock is cautious on purpose. When it isn't sure an operation belongs to a resource, it leaves it static; it does not guess.

## Where to see it

- The start-up line counts the operations in each group.
- The [Mock UI](/docs/mock-ui/tour/) shows every operation with its label and reason.
- [`rapidoc lint --stateful`](/docs/correcting/lint/) reports the assumptions at their place in the spec.

## When it gets it wrong

State the fact in [`mock.config.yaml`](/docs/correcting/config-file/): a resource's key, or what an operation does. Not every API shows its data model in a way the mock can read; see [API styles](/docs/state/api-styles/).
