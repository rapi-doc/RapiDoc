import { marked } from 'marked';

let configured = false;

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * When an HTML `<base>` tag is present in the page, a markdown in-page anchor link (e.g. `#link-to-a-section`) would
 * resolve against the base URL instead of the current page. This renders such links with an absolute URL
 * built from the current document location, and tags them with the `anchor-link` CSS class.
 * Every other link is rendered by marked's default renderer.
 *
 * Idempotent: safe to import and call from several entry points.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base#in-page_anchors
 */
export function configureMarkdown(): void {
  if (configured) {
    return;
  }
  configured = true;
  marked.use({
    renderer: {
      link({ href, title, tokens }) {
        if (!href?.startsWith('#') || typeof location === 'undefined') {
          return false; // fall back to marked's default link renderer
        }
        const absoluteHref = `${location.href.replace(/#.*/, '')}${href}`;
        const titleAttribute = title ? ` title="${escapeAttribute(title)}"` : '';
        return `<a class="anchor-link" href="${escapeAttribute(absoluteHref)}"${titleAttribute}>${this.parser.parseInline(tokens)}</a>`;
      },
    },
  });
}

configureMarkdown();
