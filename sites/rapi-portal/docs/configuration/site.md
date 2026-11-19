---
title: Site
description: Title, description, URL, logo, favicon, link previews, page titles, head tags and the announcement banner.
---

```yaml title="rapidoc.config.yaml"
site:
  title: Acme Developers
  description: Build on the Acme payments platform.
  url: https://developers.acme.com
  logo:
    src:
      light: /logo-light.svg   # on light backgrounds
      dark: /logo-dark.svg     # on dark backgrounds
    alt: Acme
  favicon: /favicon.svg
  image: /social-card.png
  titleTemplate: '%s · Acme Developers'
  banner:
    message: API v2 is live!
    href: /docs/changelog
```

| Key | Meaning |
| :--- | :--- |
| `title` | **Required.** The site name, in the browser tab and as the wordmark when there is no logo. |
| `description` | Default meta description of the pages. |
| `url` | Public URL of the portal, for canonical links and the sitemap. A path in it is where the portal is served; see [Serving under a path](#serving-under-a-path). `rapidoc serve` also uses it as the default external URL. |
| `logo` | The header logo; see below. |
| `favicon` | Icon in `public/`, e.g. `/favicon.svg`. |
| `image` | Preview image for links shared in Slack, X or LinkedIn (`og:image`): a file in `public/` or a URL. A file needs `url`. 1200 × 630 works best. |
| `titleTemplate` | Page titles in the browser tab and search results. `%s` is the page's own title. Default `'%s \| <title>'`. A page titled like the site shows the title alone. |
| `noindex` | `true` keeps search engines out: a robots `noindex` tag on every page, a `robots.txt` that disallows everything, and no sitemap. For staging and internal portals. |
| `banner` | An announcement bar above the header; see below. |

## Logo

One image for both themes:

```yaml title="rapidoc.config.yaml"
site:
  logo:
    src: /logo.svg          # an image in public/
    text: ACME              # optional: wordmark next to the image
    alt: Acme               # optional: default the site title
    href: /                 # optional: where the logo links to (default /)
```

Or one image per theme, when the logo has dark text that would disappear on a dark background:

```yaml title="rapidoc.config.yaml"
site:
  logo:
    src:
      light: /logo-light.svg   # shown in the light theme
      dark: /logo-dark.svg     # shown in the dark theme
    alt: Acme
```

The header and footer switch between the two as soon as the reader changes the theme, with no reload. This site does it: switch the theme and watch the logo.

With an image and no `text`, only the image is shown, and `alt` names it for screen readers. Without an image, the site title is the wordmark. The header shows the logo 28px tall; a wide logo shrinks on narrow screens.

The favicon is one file for both themes: pick an icon that reads on light and dark browser tabs.

## Serving under a path

When `url` has a path, the whole portal is served under it:

```yaml title="rapidoc.config.yaml"
site:
  url: https://acme.com/developers   # every page is under /developers/
```

Keep writing paths as if the portal were at the root: `/docs/intro` in `navigation`, `header`, `footer`, `redirects`, `access` rules, and in links and images in your guides. The portal adds `/developers` when it builds the pages. That covers Markdown links and images, and `href`/`src` in HTML or MDX tags (`<img src="/ship.png">`). Full URLs are left alone, and so is a path built in an MDX expression (`src={...}`).

With sign-in, register `https://acme.com/developers/_rapidoc/auth/callback` at your provider. Behind a proxy that strips part of the path, see [Deploy with rapidoc serve](/docs/deploy/rapidoc-serve/#behind-a-proxy-that-strips-part-of-the-path).

## Head tags

`head` (a top-level key, next to `site`) adds tags to the `<head>` of every page: analytics, site verification, preconnects.

```yaml title="rapidoc.config.yaml"
head:
  - script: { src: https://plausible.io/js/script.js, defer: true, data-domain: acme.com }
  - script: window.dataLayer = window.dataLayer || [];   # a string is an inline script
  - meta: { name: google-site-verification, content: abc123 }
  - link: { rel: preconnect, href: https://api.acme.com }
```

Each entry is one `script`, `link` or `meta` tag. Attribute values are strings, or `true` for an attribute without a value. A cookie-consent tool goes in the same way, as a script.

## Banner

```yaml title="rapidoc.config.yaml"
site:
  banner:
    message: Inter-galactic shipping is live!
    href: /docs/shipping      # optional: makes the message a link
    dismissible: true         # optional: default true; readers can close it
    background: '#f76b39'     # optional: any CSS color
    color: '#000000'          # optional: text color
```

The banner sits above the header on every page.
