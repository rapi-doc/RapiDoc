import { LitElement, html, css } from 'lit-element';

export default class TagInput extends LitElement {
  render() {
    return html`
    <div class='tags' tabindex="0" contenteditable="true">
      <input type="text" class='editor' @paste="${this.afterPaste}" @keydown="${this.afterKeyDown}" placeholder="${this.placeholder}"/>
    </div>
  `;
  }

  static get styles() {
    return [css`
      .tags{
        display:flex;
        flex-wrap: wrap;
        outline: none;
        padding:0;
        border-radius:var(--border-radius);
        border:1px solid var(--input-border-color);
        cursor:text;
        overflow:hidden;
      }
      .tag, .editor{
        padding:3px;
        margin:2px;
      }
      .tag{
        border:1px solid var(--border-color);
        background-color:var(--bg2);
        color:var(--fg2);
        border-radius:var(--border-radius);
        word-break: break-all;
        cursor: none;
      }
      .tag:hover ~ #cursor {
        display: block;
      }
      .editor{
        flex:1;
        border:1px solid transparent;
        background:var(--input-bg);
        color:var(--fg);
        min-width:60px;
        outline: none;
        line-height: inherit;
        font-family:inherit;
        font-size:inherit;
      }
      .editor::placeholder {
        color: var(--placeholder-color);
        opacity:1;
      }
    `];
  }

  static get properties() {
    return {
      placeholder: { type: String },
    };
  }

  afterPaste(e) {
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('Text');
    console.log(pastedData); // eslint-disable-line no-console
  }

  afterKeyDown(e) {
    if (e.keyCode === 13) {
      e.stopPropagation();
      e.preventDefault();
      const spanEl = document.createElement('span');
      if (e.target.value.trim() !== '') {
        spanEl.innerText = e.target.value;
        e.target.value = '';
        spanEl.classList.add('tag');
        spanEl.setAttribute('contenteditable', 'false');
        this.shadowRoot.querySelector('.tags').insertBefore(spanEl, e.target);
      }
    } else if (e.keyCode === 8) {
      if (e.target.selectionStart === 0 && e.target.previousSibling) {
        e.target.previousSibling.remove();
      }
    }
  }

  getValues() {
    const vals = [];
    const tags = this.shadowRoot.querySelectorAll('.tag');
    for (const tagEl of tags) {
      vals.push(tagEl.innerText);
    }
    return vals;
  }
}
// Register the element with the browser
customElements.define('tag-input', TagInput);
