import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('tag-input')
export default class TagInput extends LitElement {
  @property({ type: String }) placeholder = '';

  @property({
    type: Array,
    attribute: 'value',
    hasChanged(newVal, oldVal) {
      if (newVal === oldVal) return false;
      if (!Array.isArray(newVal) || !Array.isArray(oldVal)) return true;
      if (newVal.length !== oldVal.length) return true;
      return newVal.some((v, i) => v !== oldVal[i]);
    },
  })
  value = [];

  // For backwards compatibility with static properties inspection in tests
  static get properties() {
    return Object.fromEntries(this.elementProperties || []);
  }

  render() {
    let tagItemTmpl = '';
    if (Array.isArray(this.value)) {
      tagItemTmpl = html`${this.value
        .filter((v) => v !== '' && v !== null && v !== undefined && String(v).trim() !== '')
        .map((v) => html`<span class="tag">${v}</span>`)}`;
    }
    return html`<div class="tags" @click="${(e) => this.focusEditor(e)}">
      ${tagItemTmpl}
      <input
        type="text"
        class="editor"
        @paste="${(e) => this.afterPaste(e)}"
        @keydown="${(e) => this.afterKeyDown(e)}"
        @blur="${(e) => this.onBlur(e)}"
        placeholder="${this.placeholder || ''}"
      />
    </div>`;
  }

  focusEditor(e) {
    if (e.target.classList.contains('tags')) {
      this.shadowRoot?.querySelector('.editor')?.focus();
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'value') {
      if (newVal && oldVal !== newVal) {
        this.value = newVal.split(',').filter((v) => v.trim() !== '');
      }
    }
    super.attributeChangedCallback(name, oldVal, newVal);
  }

  dispatchEvents() {
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { value: this.value } }));
    this.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true, detail: { value: this.value } }));
  }

  afterPaste(e) {
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('Text');
    const pastedArray = pastedData ? pastedData.split(',').filter((v) => v.trim() !== '') : '';
    if (pastedArray) {
      if (Array.isArray(this.value)) {
        this.value = [...this.value, ...pastedArray];
      } else {
        this.value = pastedArray;
      }
      this.dispatchEvents();
    }
    e.preventDefault();
  }

  afterKeyDown(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.stopPropagation();
      e.preventDefault();
      const val = e.target.value ? e.target.value.trim() : '';
      if (val) {
        if (Array.isArray(this.value)) {
          this.value = [...this.value, val];
        } else {
          this.value = [val];
        }
        e.target.value = '';
        this.dispatchEvents();
      }
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.keyCode === 8 || e.keyCode === 46) {
      if (!e.target.value || e.target.value.length === 0) {
        if (Array.isArray(this.value) && this.value.length > 0) {
          e.preventDefault();
          this.value = this.value.slice(0, -1);
          this.dispatchEvents();
        }
      }
    }
  }

  onBlur(e) {
    const val = e.target.value ? e.target.value.trim() : '';
    if (val) {
      if (Array.isArray(this.value)) {
        this.value = [...this.value, val];
      } else {
        this.value = [val];
      }
      e.target.value = '';
      this.dispatchEvents();
    }
  }

  static get styles() {
    return [
      css`
        .tags {
          display: flex;
          flex-wrap: wrap;
          outline: none;
          padding: 0;
          border-radius: var(--border-radius);
          border: 1px solid var(--input-border);
          cursor: text;
          overflow: hidden;
          background: var(--input-background);
        }
        .tag,
        .editor {
          padding: 3px;
          margin: 2px;
        }
        .tag {
          border: 1px solid var(--border);
          background: var(--muted);
          color: var(--muted-foreground);
          border-radius: var(--border-radius);
          word-break: break-all;
          font-size: var(--font-size-small);
        }
        .tag:hover ~ #cursor {
          display: block;
        }
        .editor {
          flex: 1;
          border: 1px solid transparent;
          color: var(--foreground);
          min-width: 60px;
          outline: none;
          line-height: inherit;
          font-family: inherit;
          background: transparent;
          font-size: calc(var(--font-size-small) + 1px);
        }
        .editor:focus-visible {
          outline: 1px solid;
        }
        .editor::placeholder {
          color: var(--muted-foreground);
          opacity: 1;
        }
      `,
    ];
  }
}
