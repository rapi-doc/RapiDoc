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
    border-radius: min(var(--radius), 0.5rem);
    background: var(--code-bg);
    border: 1px solid var(--input);
  }

  /* Inline code */
  :not(pre) > code[class*='language-'] {
    white-space: normal;
    border-radius: min(var(--radius), 0.5rem);
  }

  /* GitHub Syntax Highlighting (Dark & Light) */
  ::highlight(comment),
  ::highlight(quote) {
    color: var(--syntax-comment);
  }
  ::highlight(keyword),
  ::highlight(storage),
  ::highlight(at-rule),
  ::highlight(doctype),
  ::highlight(important),
  ::highlight(section) {
    color: var(--syntax-keyword);
  }
  ::highlight(operator),
  ::highlight(punctuation) {
    color: var(--syntax-operator);
  }
  ::highlight(string),
  ::highlight(regexp),
  ::highlight(attribute-value),
  ::highlight(link),
  ::highlight(raw) {
    color: var(--syntax-string);
  }
  ::highlight(numeric),
  ::highlight(boolean),
  ::highlight(constant),
  ::highlight(symbol),
  ::highlight(character-entity),
  ::highlight(anchor),
  ::highlight(entity) {
    color: var(--syntax-constant);
  }
  ::highlight(function),
  ::highlight(decorator),
  ::highlight(animation) {
    color: var(--syntax-function);
  }
  ::highlight(type),
  ::highlight(support) {
    color: var(--syntax-type);
  }
  ::highlight(variable),
  ::highlight(interpolation) {
    color: var(--syntax-variable);
  }
  ::highlight(property),
  ::highlight(key),
  ::highlight(attribute-name) {
    color: var(--syntax-property);
  }
  ::highlight(tag) {
    color: var(--syntax-tag);
  }
  ::highlight(selector) {
    color: var(--syntax-selector);
  }
  ::highlight(inserted) {
    color: var(--syntax-inserted);
  }
  ::highlight(deleted) {
    color: var(--syntax-deleted);
  }
`;
