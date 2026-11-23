---
"@rapidoc/server": patch
"@rapidoc/mock": patch
"@rapidoc/portal": patch
"@rapidoc/prerender": patch
"@rapidoc/cli": patch
"rapidoc": patch
---

Security fixes. `@rapidoc/server`: the sign-in cookie, which `/_rapidoc/auth/login` gives any visitor, was accepted as a session, opening pages for all signed-in readers without signing in (pages limited to groups or emails were not affected); every sealed cookie and token now has one use. The server also refuses a build whose `protected/` folder has no `rapidoc-server.json`, needs a public URL (`site.url` or `RAPIDOC_PUBLIC_URL`) to sign readers in anywhere but `localhost`, limits request bodies, and sends `frame-ancestors` (`RAPIDOC_FRAME_ANCESTORS`), referrer and HSTS headers. `rapidoc` and `@rapidoc/prerender`: HTML in descriptions is reduced to a fixed list of elements and attributes, in every browser and in pre-rendered pages, where it was not sanitized at all; `javascript:` addresses from a spec are no longer links; a spec value can no longer pass for a template in the prerenderer. `rapidoc build` refuses an output folder that is, holds or is inside a source folder (`--out-dir public` emptied `public/`). `rapidoc mock` and `rapidoc dev` listen on `localhost` by default (`--host 0.0.0.0` for a container or a shared server; `dev` has `--host` now), and the mock takes an imported spec only from a program on its machine or its own page, never from another site's page or through a proxy, and does not let it read other local files.
