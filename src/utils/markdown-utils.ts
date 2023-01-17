import { marked } from 'marked';
/**
 * When rendering markdown provides an absolute URL for anchor link instead of just the hash url (e.g. #link-to-a-section)
 * when an <base> HTML tag is present in the page
 *
 * @param renderer The markdown Renderer
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base#in-page_anchors
 */
export function fixRenderedAnchorLinks(renderer: marked.Renderer) {
  renderer.link = (
    href: string | null,
    title: string | null,
    text: string
  ): string => {
    let isAnchor = false;
    if (href?.startsWith('#')) {
      const baseURL = location.href.replace(/#.*/, '');
      href = `${baseURL}${href}`;
      isAnchor = true;
    }
    return `<a ${isAnchor ? `class="anchor-link"` : ''} href="${href}" ${title ? `title="${title}"` : ''}>${text}</a>`;
  };
}

/**
 * When rendering markdown provides headings (h1, h2...) with `observe-me` CSS class
 *
 * @param renderer The markdown Renderer
 * @param getId A function to generate the ID attribute of the heading
 */
export function observeMeRenderedHeading(
  renderer: marked.Renderer,
  getId: (raw: string, slugger: marked.Slugger) => string
) {
  renderer.heading = (text, level, raw, slugger) =>
    `<h${level} class="observe-me" id="${getId(
      raw,
      slugger
    )}">${text}</h${level}>`;
}
