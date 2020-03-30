import { LitElement, html, css } from 'lit-element';

export default class TagInput extends LitElement {
  /* eslint-disable indent */
  render() {
    return html`
    <div class='tags' tabindex="0">
      ${Array.isArray(this.value) && this.value.length > 0
        ? html`${this.value.map((v) => html`<span class='tag'> ${v} </span>`)}`
        : ''
      }
      <input type="text" class='editor' @paste="${this.afterPaste}" @keydown="${this.afterKeyDown}" placeholder="${this.placeholder}">
    </div>
  `;
  }
  /* eslint-enable indent */

  static get properties() {
    return {
      placeholder: { type: String },
      value: { type: Array, attribute: 'value' },
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
      if (e.target.value) {
        if (Array.isArray(this.value)) {
          this.value = [...this.value, e.target.value];
        } else {
          this.value = [e.target.value];
        }
        e.target.value = '';
      }
    } else if (e.keyCode === 8) {
      if (e.target.value.length === 0) {
        if (Array.isArray(this.value) && this.value.length > 0) {
          this.value.splice(-1);
          this.value = [...this.value];
        }
      }
    }
  }

  static get styles() {
    return [css`
      .tags{
        display:flex;
        flex-wrap: wrap;
        outline: none;
        padding:0;
        border-radius:var(--border-radius);
        border:1px solid var(--border-color);
        cursor:text;
        overflow:hidden;
        background:var(--input-bg);
      }
      .tag, .editor {
        padding:3px;
        margin:2px;
      }
      .tag{
        border:1px solid var(--border-color);
        background-color:var(--bg3);
        color:var(--fg3);
        border-radius:var(--border-radius);
        word-break: break-all;
        font-size: var(--font-size-small);
      }
      .tag:hover ~ #cursor {
        display: block;
      }
      .editor{
        flex:1;
        border:1px solid transparent;
        color:var(--fg);
        min-width:60px;
        outline: none;
        line-height: inherit;
        font-family:inherit;
        background:transparent;
        font-size: calc(var(--font-size-small) + 1px);
      }
      .editor::placeholder {
        color: var(--placeholder-color);
        opacity:1;
      }
    `];
  }
}
// Register the element with the browser
customElements.define('tag-input', TagInput);
