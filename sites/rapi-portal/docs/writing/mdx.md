---
title: MDX
description: Use components in guides with MDX - no imports needed for the portal components.
---

[MDX](https://mdxjs.com) is Markdown with JSX components. Name the file `.mdx`.

## Components without imports

These portal components work in any `.mdx` page without an `import`: the build adds it for you.

| Component | Use |
| :--- | :--- |
| `<Callout type="tip" title="...">` | A callout; same types as [Callouts](/docs/writing/callouts/). |
| `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<CardContent>`, `<CardFooter>` | Card building blocks. |
| `<Badge text="Beta" variant="caution" />` | A small label. |
| `<Button href="/docs/quickstart" variant="default">` | A link styled as a button. Variants: `default`, `outline`, `secondary`, `ghost`; sizes `sm`, `md`, `lg`. |
| `<Link href="...">` | A link. |
| `<Steps>` | Numbered steps around an ordered list. |
| `<Tabs>`, `<TabItem label="...">` | Tabs. |
| `<OpenPlaygroundButton>` | A button that opens an API playground. |

```mdx title="docs/webhooks.mdx"
---
title: Webhooks
---

<Callout type="caution" title="Verify every request">
  Check the signature header before you trust a webhook.
</Callout>

<Tabs>
  <TabItem label="Node.js">...</TabItem>
  <TabItem label="Python">...</TabItem>
</Tabs>
```

## Components and icons

The components `Aside`, `CardGrid`, `LinkCard`, `LinkButton`, `FileTree` and `Icon` are exported from `@rapidoc/portal/components`. Import the ones you use:

```mdx
import { CardGrid, LinkCard, Icon } from '@rapidoc/portal/components';

<Icon name="rocket" /> Ready?

<CardGrid>
  <LinkCard title="Quickstart" href="/docs/getting-started/quickstart" />
  <LinkCard title="Example API" href="/apis/bookstore" />
</CardGrid>
```

`Icon` draws a [Phosphor](https://phosphoricons.com) icon at 24px; `size={16}` makes it smaller. The portal uses Phosphor icons only, so icons in guides match the header and sidebar.

## Your own components

An `.mdx` page can import Astro components (`.astro` files) and JavaScript modules from your project, for example from a `components/` folder next to `docs/`. Import them with a path relative to the page:

```astro title="components/Hello.astro"
---
const { name = "world" } = Astro.props;
---

<p class="hello">Hello, {name}!</p>

<style>
  .hello { font-weight: 600; }
</style>
```

```mdx title="docs/welcome.mdx"
---
title: Welcome
---

import Hello from '../components/Hello.astro';

<Hello name="developer" />
```

A component can import other components and use the portal's, and its `<style>` is scoped to it as in any Astro project. `rapidoc dev` reloads the page when you edit the component.

React, Vue and Svelte components (`.jsx`, `.tsx`, `.vue`, `.svelte`) are not supported: the build stops with an error that names the page and the import. Write the markup as an `.astro` component instead; a `<script>` in it can add behaviour in the browser.

## Migrated Zudoku pages

Imports from `zudoku/ui/...` and the `<Stepper>` component are rewritten automatically, so MDX pages from a Zudoku project work as-is. See [Migrating](/docs/tools/migrate/).

## Markdown or MDX?

If both `page.md` and `page.mdx` exist, the `.mdx` one is used. Prefer Markdown or Markdoc for prose: they don't break when a `<` or `{` appears in the text, which MDX treats as code.
