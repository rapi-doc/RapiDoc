---
"@rapidoc/mock": patch
"@rapidoc/cli": patch
---

`rapidoc mock --stateful` seeds more readable records. Schemas written with `allOf` now get named values, sequential ids and every enum value, as other schemas do. A field with a `pattern` gets a readable value when one fits (a person's name in a pattern for names). Records after the first follow the shape of a field's example where the schema says no more: a date, digits, an id of the same form, a number of that size, or the example itself for a short value such as a status.
