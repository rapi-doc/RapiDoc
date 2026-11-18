---
"@rapidoc/mock": patch
"@rapidoc/cli": patch
---

`rapidoc mock --stateful` keeps a record under the parent its path names, also when the record has no field for it: a comment created at `/articles/{slug}/comments` is listed and found under that article only. Seeded records of such a resource start under a few of the seeded parents, not under every one.
