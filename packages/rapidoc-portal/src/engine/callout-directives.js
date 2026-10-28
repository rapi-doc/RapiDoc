/**
 * Sätteri mdast plugin: `:::tip` blocks in Markdown and MDX become the same markup as
 * components/Callout.astro. It runs before Starlight's asides plugin, which then has nothing left
 * to convert. A title comes from `:::tip[Title]` (Starlight) or `:::tip{title="Title"}` (Zudoku);
 * `{icon="name"}` picks another Phosphor icon.
 */

import { CALLOUT_ICONS } from '../components/callout-types.js';
import { readIconSvg } from '../components/icon-files.js';

/** An mdast node that rehype turns into `<tagName ...properties>`. */
const element = (tagName, properties, children = []) => ({
  type: 'paragraph',
  data: { hName: tagName, hProperties: properties },
  children,
});

/** Raw HTML in Markdown; in MDX, where raw HTML is not allowed, a `<Fragment set:html>`. */
const rawHtml = (html, sourceFormat) =>
  sourceFormat === 'mdx'
    ? { type: 'mdxJsxTextElement', name: 'Fragment', attributes: [{ type: 'mdxJsxAttribute', name: 'set:html', value: html }] }
    : { type: 'html', value: html };

/**
 * @param {string} iconsDir - Phosphor's assets/ folder
 * @returns A Sätteri plugin factory, for `markdown.processor.options.mdastPlugins`
 */
export function calloutDirectives(iconsDir) {
  return ({ sourceFormat }) => ({
    name: 'rapidoc-callouts',
    containerDirective(node) {
      if (!(node.name in CALLOUT_ICONS)) return;
      const children = [...node.children];
      let title = node.attributes?.title ? [{ type: 'text', value: node.attributes.title }] : [];
      if (children[0]?.type === 'paragraph' && children[0].data?.directiveLabel) title = children.shift().children;

      const paths = readIconSvg(iconsDir, node.attributes?.icon || CALLOUT_ICONS[node.name], 'bold');
      const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16" fill="currentColor" aria-hidden="true" class="portal-callout-icon">${paths}</svg>`;
      return element('div', { class: 'portal-callout', role: 'note', 'data-type': node.name }, [
        rawHtml(icon, sourceFormat),
        element('div', { class: 'portal-callout-body' }, [
          ...(title.length ? [element('p', { class: 'portal-callout-title' }, title)] : []),
          ...children,
        ]),
      ]);
    },
  });
}
