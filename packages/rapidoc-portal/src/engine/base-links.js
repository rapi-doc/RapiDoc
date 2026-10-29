/**
 * Docs pages link with paths relative to the portal (`[Intro](/docs/intro/)`, `![](/images/a.png)`,
 * `<img src="/a.png">`). When the portal is served under a base path (the path of `site.url`), these add it:
 * a Sätteri mdast plugin for Markdown and MDX (links, images, definitions, HTML and JSX `href`/`src`), and the
 * Markdoc link and image nodes (markdoc/astro-config.js). Astro doesn't do this for content.
 *
 * The portal's components (Link, Button, Card, OpenPlaygroundButton, {% card %}) add the base themselves.
 */

import { withBase } from "../components/base-path.js";

const URL_ATTRIBUTES = new Set(["href", "src", "poster"]);

/**
 * @param {string} base - e.g. /developers ('' when the portal is at the root)
 * @returns A Sätteri plugin factory, for `markdown.processor.options.mdastPlugins`
 */
export function baseLinks(base) {
  const withUrl = (node) => {
    const url = withBase(node.url, base);
    return url === node.url ? undefined : { ...node, url };
  };
  // Raw HTML in Markdown: href="/..." and src="/..." attributes.
  const html = (node) => {
    const value = node.value.replace(/(\s(?:href|src|poster)=["'])(\/(?!\/))/g, `$1${base}$2`);
    return value === node.value ? undefined : { ...node, value };
  };
  // JSX in MDX (<img src="/a.png" />): string attributes only; expressions are left alone.
  const jsx = (node) => {
    let changed = false;
    const attributes = (node.attributes || []).map((attr) => {
      if (
        attr.type !== "mdxJsxAttribute" ||
        !URL_ATTRIBUTES.has(attr.name) ||
        typeof attr.value !== "string"
      )
        return attr;
      const value = withBase(attr.value, base);
      if (value === attr.value) return attr;
      changed = true;
      return { ...attr, value };
    });
    return changed ? { ...node, attributes } : undefined;
  };
  return () => ({
    name: "rapidoc-base-links",
    link: withUrl,
    image: withUrl,
    definition: withUrl,
    html,
    mdxJsxFlowElement: jsx,
    mdxJsxTextElement: jsx,
  });
}
