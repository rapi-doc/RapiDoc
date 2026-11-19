---
title: LLM output
description: Every guide as Markdown, /llms.txt and /llms-full.txt for AI tools, and Copy page buttons.
---

AI assistants and coding agents read documentation better as Markdown than as HTML. The portal publishes it for them, with nothing to configure:

| URL | Content |
| :--- | :--- |
| `/docs/<page>.md` | Each guide as Markdown. The home page is `/index.md`. |
| `/llms.txt` | An index ([llmstxt.org](https://llmstxt.org)): the site, then the pages of each documentation tab, then every API with its OpenAPI file. |
| `/llms-full.txt` | Every guide's Markdown in one file. |

Try it on this site: [/llms.txt](/llms.txt), or [this page as Markdown](/docs/configuration/llms.md).

## Page actions

Next to the title of each guide:

- **Copy page** copies the page as Markdown, ready to paste into a chat.
- **View as Markdown** opens the `.md` file.
- **Open in ChatGPT** and **Open in Claude** start a conversation that reads the page.

## Settings

```yaml title="rapidoc.config.yaml"
llms:
  description: Build on the Acme payments platform.   # top of /llms.txt (default site.description)
  pageActions: [copy, markdown, chatgpt, claude]      # default all four; false hides the buttons
```

`llms: false` turns all of it off: no `.md` files, no `llms.txt`, no buttons.

## How guides become Markdown

Guides are converted from their source, so the Markdown stays close to what you wrote:

- Frontmatter and MDX `import` lines are removed; the title and description become the first lines.
- Callouts (`:::note`, `{% callout %}`, `<Aside>`) become quotes: `> **Note:** ...`.
- `{% api-operation %}` becomes the method and path, with a link to the API page.
- Cards become linked titles, tabs and steps keep their labels, and other tags keep their text.
- Code blocks and inline code are left exactly as written.

## With sign-in

- `/llms.txt` and `/llms-full.txt` list **public pages only**, and only public APIs.
- A protected page's `.md` is protected like the page: an access rule for `/docs/internal/**` covers `/docs/internal/runbook.md`.
- On protected pages, **Open in ChatGPT** and **Open in Claude** are hidden: an assistant can't sign in to read the page. **Copy page** and **View as Markdown** still work for the signed-in reader.
