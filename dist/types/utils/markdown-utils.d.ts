import { marked } from 'marked';
/**
 * When rendering markdown provides an absolute URL for anchor link instead of just the hash url (e.g. #link-to-a-section)
 * when an <base> HTML tag is present in the page
 *
 * @param renderer The markdown Renderer
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base#in-page_anchors
 */
export declare function fixRenderedAnchorLinks(renderer: marked.Renderer): void;
/**
 * When rendering markdown provides headings (h1, h2...) with `observe-me` CSS class
 *
 * @param renderer The markdown Renderer
 * @param getId A function to generate the ID attribute of the heading
 */
export declare function observeMeRenderedHeading(renderer: marked.Renderer, getId: (raw: string, slugger: marked.Slugger) => string): void;
//# sourceMappingURL=markdown-utils.d.ts.map