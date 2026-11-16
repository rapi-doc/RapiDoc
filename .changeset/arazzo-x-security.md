---
"rapidoc": minor
"@rapidoc/mcp": patch
"@rapidoc/prerender": patch
---

`<rapi-flow>` supports the `x-security` extension of Arazzo (as Redocly Respect defines it): credentials on a workflow or a step, naming a scheme of the OpenAPI source or defining one inline (API key, HTTP Basic, bearer), with values from inputs or earlier steps. Runs and MCP exports send them; the diagram lists them under Security without showing secrets; inputs with `format: password` get a password field and are masked in the run log.
