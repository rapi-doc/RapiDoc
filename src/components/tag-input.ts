import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('tag-input')
export default class TagInput extends LitElement {
  @property({ type: String },)
  public placeholder?: string; 
  
  @property({ type: Array, attribute: 'value' },)
  public value?: string[];

  /* eslint-disable indent */
  override render() {
    let tagItemTmpl: TemplateResult<1> | string = '';
    if (Array.isArray(this.value)) {
      tagItemTmpl = html`${this.value
        .filter((v) => typeof v === 'string' && v.trim() !== '')
        .map((v) => html`<span class='tag'>${v}</span>`)
      }`;
    }
    return html`
      <div class='tags'>
        ${tagItemTmpl}
        <input type="text" class='editor' @paste="${(e: ClipboardEvent) => this.afterPaste(e)}" @keydown="${this.afterKeyDown}" @blur="${this.onBlur}" placeholder="${this.placeholder || ''}">
      </div>
    `;
  }

  override attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    if (name === 'value') {
      if (newVal && oldVal !== newVal) {
        this.value = newVal.split(',').filter((v) => v.trim() !== '');
      }
    }
    super.attributeChangedCallback(name, oldVal, newVal);
  }

  afterPaste(e: ClipboardEvent) {
    const clipboardData = e.clipboardData || (window as any).clipboardData;
    const pastedData = clipboardData.getData('Text') as string;
    const pastedArray = pastedData ? pastedData.split(',').filter((v) => v.trim() !== '') : '';
    if (pastedArray) {
      if (Array.isArray(this.value)) {
        this.value = [...this.value, ...pastedArray];
      } else {
        this.value = pastedArray;
      }
    }
    e.preventDefault();
  }

  afterKeyDown(e: KeyboardEvent) {
    if (e.keyCode === 13) {
      e.stopPropagation();
      e.preventDefault();
      if ((e.target as HTMLInputElement).value) {
        if (Array.isArray(this.value)) {
          this.value = [...this.value, (e.target as HTMLInputElement).value];
        } else {
          this.value = [(e.target as HTMLInputElement).value];
        }
        (e.target as HTMLInputElement).value = '';
      }
    } else if (e.keyCode === 8) {
      if ((e.target as HTMLInputElement).value.length === 0) {
        if (Array.isArray(this.value) && this.value.length > 0) {
          this.value.splice(-1);
          this.value = [...this.value];
        }
      }
    }
  }

  onBlur(e: Event) {
    if ((e.target as HTMLInputElement).value) {
      if (Array.isArray(this.value)) {
        this.value = [...this.value, (e.target as HTMLInputElement).value];
      } else {
        this.value = [(e.target as HTMLInputElement).value];
      }
      (e.target as HTMLInputElement).value = '';
    }
  }

  static override get styles() {
    return [css`
      .tags {
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
      .editor {
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
      .editor:focus-visible {
        outline: 1px solid;
      }
      .editor::placeholder {
        color: var(--placeholder-color);
        opacity:1;
      }
    `];
  }
}
