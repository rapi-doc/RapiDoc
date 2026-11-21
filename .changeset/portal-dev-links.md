---
"@rapidoc/portal": patch
---

`rapidoc dev` can point links to other sites at local dev servers: set `RAPIDOC_DEV_LINKS="https://example.com=http://localhost:4321,..."` and links to those addresses in the pages it serves go to the local servers, so sites that link to each other can be tested together. Builds are not affected.
