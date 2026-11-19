---
title: Docs, search and redirects
description: The docs folder, table of contents, edit links, site search and redirects.
---

## Docs

```yaml title="rapidoc.config.yaml"
docs:
  dir: ./docs
  toc: { minHeadingLevel: 2, maxHeadingLevel: 3 }
  editUrl: https://github.com/acme/portal/edit/main/docs/
```

| Key | Meaning |
| :--- | :--- |
| `dir` | Folder with the `.md`, `.mdx` and `.markdoc` pages. Default `./docs`. |
| `toc` | The headings shown in "On this page". Default levels 2 to 3. `false` hides it. |
| `editUrl` | Base URL of the docs folder in your repository. Each page gets an "Edit page" link to `<editUrl><path of the page>`. |

A page can override the table of contents in its frontmatter with the `tableOfContents` key (see [Markdown](/docs/writing/markdown/#title-and-frontmatter)).

## Search

```yaml title="rapidoc.config.yaml"
search: true   # default
```

The search box in the header searches guides and API operations. Both indexes are built with the site, so there is no search service to run or pay for: guides are indexed by [Pagefind](https://pagefind.app), and every operation's method, path, summary and description go into a second index.

Press `/` or `Ctrl K` (`⌘ K` on a Mac) to open it. With [access rules](/docs/access/access-rules/), readers only find what they may read.

Set `search: false` to remove the search box.

## Redirects

```yaml title="rapidoc.config.yaml"
redirects:
  - { from: /old-page, to: /docs/new-page }
  - { from: /docs/v1/auth, to: https://legacy.acme.com/auth }
```

Each redirect is a page at `from` that sends readers to `to`. Use them when you move a page or rename an API id. `rapidoc migrate` writes redirects for APIs that had a custom path in your old portal.
