import { marked } from 'marked';

let configured = false;

function escapeAttribute(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * When an HTML `<base>` tag is present in the page, a markdown in-page anchor link (e.g. `#link-to-a-section`) would
 * resolve against the base URL instead of the current page. This renders such links with an absolute URL
 * built from the current document location, and tags them with the `anchor-link` CSS class.
 *
 * @param {import('marked').Renderer} renderer
 * @param {import('marked').Tokens.Link} token
 * @returns {string | false} the rendered link, or `false` when the link is not an in-page anchor (use the default renderer)
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base#in-page_anchors
 */
function renderAnchorLink(renderer, { href, title, tokens }) {
  if (!href?.startsWith('#') || typeof location === 'undefined') {
    return false;
  }
  const absoluteHref = `${location.href.replace(/#.*/, '')}${href}`;
  const titleAttribute = title ? ` title="${escapeAttribute(title)}"` : '';
  return `<a class="anchor-link" href="${escapeAttribute(absoluteHref)}"${titleAttribute}>${renderer.parser.parseInline(tokens)}</a>`;
}

/**
 * Applies the in-page anchor fix to a custom renderer. A renderer passed per call, `marked(text, { renderer })`,
 * replaces the global one configured by {@link configureMarkdown}, so custom renderers need it too.
 *
 * @param {import('marked').Renderer} renderer
 */
export function fixRenderedAnchorLinks(renderer) {
  const defaultLink = renderer.link;
  renderer.link = function link(token) {
    const anchorLink = renderAnchorLink(this, token);
    return anchorLink === false ? defaultLink.call(this, token) : anchorLink;
  };
}

/**
 * Configures the global `marked` instance used by every `marked(...)` call that has no custom renderer.
 * Idempotent: safe to import and call from several entry points.
 */
export function configureMarkdown() {
  if (configured) {
    return;
  }
  configured = true;
  marked.use({
    renderer: {
      link(token) {
        return renderAnchorLink(this, token); // `false` falls back to marked's default link renderer
      },
    },
  });
}

configureMarkdown();
