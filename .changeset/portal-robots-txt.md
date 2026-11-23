---
"@rapidoc/portal": minor
---

With `site.url` set, a build writes a `robots.txt` that names the sitemap, so search engines and AI crawlers find every page. A `robots.txt` in the project's `public/` folder still replaces it, and `site.noindex` still writes one that keeps crawlers out.
