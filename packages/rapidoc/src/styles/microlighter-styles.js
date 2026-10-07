import { css } from 'lit';

export default css`
  code[class*='language-'],
  pre[class*='language-'] {
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;
    tab-size: 2;

    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
  }

  /* Code blocks */
  pre[class*='language-'] {
    padding: 1em;
    margin: 0.5em 0;
    overflow: auto;
    border-radius: var(--card-radius);
    background: var(--input-background);
    border: 1px solid var(--input-border);
  }

  /* Inline code */
  :not(pre) > code[class*='language-'] {
    white-space: normal;
    border-radius: var(--card-radius);
  }

  /* GitHub Syntax Highlighting (Dark & Light) */
  ::highlight(comment),
  ::highlight(quote) {
    color: var(--syntax-comment, #6e7781);
  }
  ::highlight(keyword),
  ::highlight(storage),
  ::highlight(at-rule),
  ::highlight(doctype),
  ::highlight(important),
  ::highlight(section) {
    color: var(--syntax-keyword, #cf222e);
  }
  ::highlight(operator),
  ::highlight(punctuation) {
    color: var(--syntax-operator, #24292f);
  }
  ::highlight(string),
  ::highlight(regexp),
  ::highlight(attribute-value),
  ::highlight(link),
  ::highlight(raw) {
    color: var(--syntax-string, #0a3069);
  }
  ::highlight(numeric),
  ::highlight(boolean),
  ::highlight(constant),
  ::highlight(symbol),
  ::highlight(character-entity),
  ::highlight(anchor),
  ::highlight(entity) {
    color: var(--syntax-constant, #0550ae);
  }
  ::highlight(function),
  ::highlight(decorator),
  ::highlight(animation) {
    color: var(--syntax-function, #8250df);
  }
  ::highlight(type),
  ::highlight(support) {
    color: var(--syntax-type, #8250df);
  }
  ::highlight(variable),
  ::highlight(interpolation) {
    color: var(--syntax-variable, #953800);
  }
  ::highlight(property),
  ::highlight(key),
  ::highlight(attribute-name) {
    color: var(--syntax-property, #0550ae);
  }
  ::highlight(tag) {
    color: var(--syntax-tag, #116329);
  }
  ::highlight(selector) {
    color: var(--syntax-selector, #8250df);
  }
  ::highlight(inserted) {
    color: var(--syntax-inserted, #116329);
  }
  ::highlight(deleted) {
    color: var(--syntax-deleted, #cf222e);
  }
`;
