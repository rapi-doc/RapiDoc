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
    font-family: var(--font-regular);
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
    font-family: var(--font-regular);
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
    color: var(--red);
  }
  .blue-text {
    color: var(--blue);
  }
  .multiline {
    overflow: scroll;
    max-height: var(--resp-area-height, 400px);
    color: var(--muted-foreground);
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
  .method-fg.options,
  .method-fg.head,
  .method-fg.patch {
    color: var(--method-patch);
  }

  h1 {
    font-family: var(--font-regular);
    font-size: 1.75rem;
    padding-top: 0.625rem;
    letter-spacing: normal;
    font-weight: normal;
  }
  h2 {
    font-family: var(--font-regular);
    font-size: 1.5rem;
    padding-top: 0.625rem;
    letter-spacing: normal;
    font-weight: normal;
  }
  h3 {
    font-family: var(--font-regular);
    font-size: 1.25rem;
    padding-top: 0.625rem;
    letter-spacing: normal;
    font-weight: normal;
  }
  h4 {
    font-family: var(--font-regular);
    font-size: 1rem;
    padding-top: 0.625rem;
    letter-spacing: normal;
    font-weight: normal;
  }
  h5 {
    font-family: var(--font-regular);
    font-size: 0.875rem;
    padding-top: 0.625rem;
    letter-spacing: normal;
    font-weight: normal;
  }
  h6 {
    font-family: var(--font-regular);
    font-size: 0.75rem;
    padding-top: 0.625rem;
    letter-spacing: normal;
    font-weight: normal;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-block-end: 0.2em;
    text-wrap: balance;
  }
  p {
    margin-block-start: 0.5em;
  }
  a {
    color: var(--blue);
    cursor: pointer;
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
  }

  .m-markdown p,
  .m-markdown span {
    font-size: var(--font-size-regular);
    line-height: calc(var(--font-size-regular) + 8px);
  }
  .m-markdown li {
    font-size: var(--font-size-regular);
    line-height: calc(var(--font-size-regular) + 10px);
  }

  .m-markdown-small p,
  .m-markdown-small span,
  .m-markdown-small li {
    font-size: var(--font-size-small);
    line-height: calc(var(--font-size-small) + 6px);
  }
  .m-markdown-small li {
    line-height: calc(var(--font-size-small) + 8px);
  }

  .m-markdown p:not(:first-child) {
    margin-block-start: 24px;
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
    border-radius: var(--card-radius);
    color: var(--inline-code-fg);
    font-size: calc(var(--font-size-mono));
    line-height: 1.2;
  }

  .m-markdown-small code {
    font-size: calc(var(--font-size-mono) - 1px);
  }

  .m-markdown-small pre,
  .m-markdown pre {
    white-space: pre-wrap;
    overflow-x: auto;
    line-height: normal;
    border-radius: var(--card-radius);
    border: 1px solid var(--input-border);
  }

  .m-markdown pre {
    padding: 12px;
    background: var(--input-background);
    color: var(--foreground);
  }

  .m-markdown-small pre {
    margin-top: 4px;
    padding: 2px 4px;
    background: var(--input-background);
    color: var(--card-foreground);
  }

  .m-markdown-small pre code,
  .m-markdown pre code {
    border: none;
    padding: 0;
  }

  .m-markdown pre code {
    color: var(--code-fg);
  }

  .m-markdown-small pre code {
    color: var(--card-foreground);
    background: var(--muted);
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
    border-radius: var(--card-radius);
    font-size: calc(var(--font-size-small) + 1px);
    line-height: calc(var(--font-size-small) + 4px);
    max-width: 100%;
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
