import { css } from 'lit';

export default css`
  .hover-bg:hover {
    background: var(--muted);
  }
  ::selection {
    background: var(--selection-bg);
    color: var(--selection-fg);
  }
  .regular-font {
    font-family: var(--font-sans);
  }
  .mono-font {
    font-family: var(--font-mono);
  }
  .title {
    font-size: calc(var(--font-size-small) + 1.125rem);
    font-weight: normal;
    text-wrap: balance;
  }
  .sub-title {
    font-size: 1.25rem;
    text-wrap: balance;
  }
  .req-res-title {
    font-family: var(--font-sans);
    font-size: calc(var(--font-size-small) + 0.25rem);
    font-weight: bold;
    margin-bottom: 0.5rem;
    text-align: start;
    text-wrap: balance;
  }
  .tiny-title {
    font-size: calc(var(--font-size-small) + 1px);
    font-weight: bold;
  }
  .regular-font-size {
    font-size: var(--font-size-regular);
  }
  .small-font-size {
    font-size: var(--font-size-small);
  }
  .upper {
    text-transform: uppercase;
  }
  .primary-text {
    color: var(--primary);
  }
  .bold-text {
    font-weight: bold;
  }
  .gray-text {
    color: var(--muted-foreground);
  }
  .red-text {
    color: var(--destructive);
  }
  .blue-text {
    color: var(--blue);
  }
  .multiline {
    overflow: scroll;
    max-height: var(--resp-area-height);
    color: var(--muted-foreground);
  }
  .method-fg {
    color: var(--method-default);
  }
  .method-fg.put {
    color: var(--method-put);
  }
  .method-fg.post {
    color: var(--method-post);
  }
  .method-fg.get {
    color: var(--method-get);
  }
  .method-fg.delete {
    color: var(--method-delete);
  }
  .method-fg.head {
    color: var(--method-head);
  }
  .method-fg.patch {
    color: var(--method-patch);
  }
  .method-fg.options {
    color: var(--method-options);
  }
  .method-fg.trace {
    color: var(--method-trace);
  }
  .method-fg.query {
    color: var(--method-query);
  }
  .method-fg.copy {
    color: var(--method-default);
  }
  .method-fg.purge {
    color: var(--method-default);
  }

  /*
   * Headings: one scale for RapiDoc's own headings (.rapidoc-heading) and headings rendered from
   * markdown descriptions, so both line up with surrounding docs content. The custom properties and
   * their defaults are defined in theme-tokens.js; override them on the element, e.g.
   * rapi-doc { --h2-font-size: 1.8125rem; --heading-weight: 700; }
   */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  .rapidoc-heading:is(h1, h2, h3, h4, h5, h6) {
    font-family: var(--heading-font);
    font-weight: var(--heading-weight);
    line-height: var(--heading-line-height);
    letter-spacing: var(--heading-letter-spacing);
    color: var(--heading-color);
    margin-block: var(--heading-margin-top) var(--heading-margin-bottom);
    padding: 0;
    text-wrap: balance;
  }
  h1,
  h1.rapidoc-heading {
    font-size: var(--h1-font-size);
  }
  h2,
  h2.rapidoc-heading {
    font-size: var(--h2-font-size);
  }
  h3,
  h3.rapidoc-heading {
    font-size: var(--h3-font-size);
  }
  h4,
  h4.rapidoc-heading {
    font-size: var(--h4-font-size);
  }
  h5,
  h5.rapidoc-heading {
    font-size: var(--h5-font-size);
  }
  h6,
  h6.rapidoc-heading {
    font-size: var(--h6-font-size);
  }
  :is(h1, h2, h3, h4, h5, h6):first-child,
  .rapidoc-heading:is(h1, h2, h3, h4, h5, h6):first-child {
    margin-block-start: 0;
  }

  /* Compact small-caps labels (Request, Response, Path parameters, ...) */
  .rapidoc-heading.label-heading {
    font-size: var(--label-heading-font-size);
    font-weight: var(--heading-weight);
    line-height: 1.4;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-block: 16px 6px;
  }
  .rapidoc-heading.label-heading.req-res-title {
    font-size: calc(var(--font-size-small) + 0.25rem);
    margin-block: 0 0.5rem;
  }
  .rapidoc-heading.label-heading.tiny-title {
    font-size: calc(var(--font-size-small) + 1px);
    margin-block: 0 8px;
  }
  .table-title > .rapidoc-heading.label-heading {
    margin: 0;
  }
  /* Keeps the heading outline complete for assistive tech without showing a duplicate title */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }

  p {
    margin-block-start: 0.5em;
  }
  a {
    color: var(--blue);
    text-decoration: none;
    cursor: pointer;
  }
  a:hover {
    text-decoration: underline;
  }
  a.inactive-link {
    color: var(--foreground);
    text-decoration: none;
    cursor: text;
  }

  code,
  pre {
    margin: 0px;
    font-family: var(--font-mono);
    font-size: calc(var(--font-size-mono) - 1px);
  }

  .m-markdown,
  .m-markdown-small {
    display: block;
    color: var(--foreground);
    /* Long unbroken words (URL paths, ids, inline code) wrap instead of widening the page. */
    overflow-wrap: anywhere;
  }

  .m-markdown p,
  .m-markdown span {
    font-size: var(--font-size-regular);
    line-height: var(--line-height);
    color: inherit;
  }
  .m-markdown li {
    font-size: var(--font-size-regular);
    line-height: var(--line-height);
    margin-block: 0.25em;
    color: inherit;
  }

  .m-markdown-small p,
  .m-markdown-small span {
    font-size: var(--font-size-small);
    line-height: calc(var(--font-size-small) + 6px);
    color: inherit;
  }
  .m-markdown-small li {
    font-size: var(--font-size-small);
    line-height: calc(var(--font-size-small) + 8px);
    margin-block: 3px;
    color: inherit;
  }

  .m-markdown strong,
  .m-markdown b,
  .m-markdown-small strong,
  .m-markdown-small b {
    color: var(--foreground);
    font-weight: 600;
  }

  .m-markdown h1,
  .m-markdown h2,
  .m-markdown h3,
  .m-markdown h4,
  .m-markdown h5,
  .m-markdown h6,
  .m-markdown-small h1,
  .m-markdown-small h2,
  .m-markdown-small h3,
  .m-markdown-small h4,
  .m-markdown-small h5,
  .m-markdown-small h6 {
    color: var(--foreground);
  }

  .m-markdown p:not(:first-child) {
    margin-block-start: var(--paragraph-spacing);
  }

  .m-markdown-small p:not(:first-child) {
    margin-block-start: 12px;
  }
  .m-markdown-small p:first-child {
    margin-block-start: 0;
  }

  .m-markdown p,
  .m-markdown-small p {
    margin-block-end: 0;
  }

  .m-markdown code span {
    font-size: var(--font-size-mono);
  }

  .m-markdown-small code,
  .m-markdown code {
    padding: 1px 6px;
    border-radius: min(var(--radius), 0.5rem);
    color: var(--foreground);
    background-color: var(--muted);
    font-size: calc(var(--font-size-mono));
    line-height: 1.2;
  }

  .m-markdown-small code {
    font-size: calc(var(--font-size-mono) - 1px);
    padding: 1px 5px;
  }

  .m-markdown-small pre,
  .m-markdown pre {
    white-space: pre-wrap;
    overflow-wrap: normal;
    overflow-x: auto;
    line-height: normal;
    border-radius: min(var(--radius), 0.5rem);
    border: 1px solid var(--input);
  }

  .m-markdown pre {
    padding: 12px;
    background: var(--input-background);
    color: var(--foreground);

    & code {
      border: none;
      padding: 0;
      background: transparent;
      color: var(--foreground);
    }
  }

  .m-markdown-small pre {
    margin-top: 4px;
    padding: 2px 4px;
    background: var(--input-background);
    color: var(--card-foreground);

    & code {
      border: none;
      padding: 0;
      background: transparent;
      color: var(--card-foreground);
    }
  }

  .m-markdown ul,
  .m-markdown ol {
    padding-inline-start: 30px;
  }

  .m-markdown-small ul,
  .m-markdown-small ol {
    padding-inline-start: 20px;
  }

  .m-markdown-small a,
  .m-markdown a {
    color: var(--blue);
  }

  .m-markdown-small img,
  .m-markdown img {
    max-width: 100%;
  }

  /* Markdown table */

  .m-markdown-small table,
  .m-markdown table {
    border-spacing: 0;
    margin: 10px 0;
    border-collapse: separate;
    border: 1px solid var(--border);
    border-radius: min(var(--radius), 0.5rem);
    font-size: calc(var(--font-size-small) + 1px);
    line-height: calc(var(--font-size-small) + 4px);
    /* Wide tables scroll inside their own box instead of widening the page */
    display: block;
    width: max-content;
    max-width: 100%;
    overflow-x: auto;
  }

  .m-markdown-small table {
    font-size: var(--font-size-small);
    line-height: calc(var(--font-size-small) + 2px);
    margin: 8px 0;
  }

  .m-markdown-small td,
  .m-markdown-small th,
  .m-markdown td,
  .m-markdown th {
    vertical-align: top;
    border-top: 1px solid var(--border);
    line-height: calc(var(--font-size-small) + 4px);
  }

  .m-markdown-small tr:first-child th,
  .m-markdown tr:first-child th {
    border-top: 0 none;
  }

  .m-markdown th,
  .m-markdown td {
    padding: 10px 12px;
  }

  .m-markdown-small th,
  .m-markdown-small td {
    padding: 8px 8px;
  }

  .m-markdown th,
  .m-markdown-small th {
    font-weight: 600;
    background: var(--card);
    vertical-align: middle;
  }

  .m-markdown-small table code {
    font-size: calc(var(--font-size-mono) - 2px);
  }

  .m-markdown table code {
    font-size: calc(var(--font-size-mono) - 1px);
  }

  .m-markdown blockquote,
  .m-markdown-small blockquote {
    margin-inline-start: 0;
    margin-inline-end: 0;
    border-inline-start: 3px solid var(--border);
    padding: 6px 0 6px 6px;
  }
  .m-markdown hr {
    border: 1px solid var(--border);
  }
`;
