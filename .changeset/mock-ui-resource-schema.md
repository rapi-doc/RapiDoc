---
"@rapidoc/mock": patch
---

In the Mock UI, a resource's About tab is now its Schema tab, and an object field there opens to its own fields. The resource list marks a count that requests changed from the seed data ("11 (+1)"). On an operation's page, selecting a response shows its sample. The control API gives each resource's `seeded` count, the nested `fields` of a resource's fields, and an operation's sample for another response with `?code=`. The stateful mock now keeps records whose schema is one of several objects (a `oneOf` or `anyOf`, such as Nylas' redirect URIs): their fields are all of their shapes', so they get a key, and seeded records take each shape in turn; the model gives such a resource's `shape` and, per field, the shapes it is `onlyIn`.
