import { html } from 'lit-html';
import { LitElement } from 'lit-element';

import DialogBoxStyles from '@/styles/dialog-box-styles';

export default class DialogBox extends LitElement {
  static get properties() {
    return {
      title: { type: String, attribute: 'title' },
      show: { type: Boolean, attribute: 'show' },
    };
  }

  static get styles() {
    return [DialogBoxStyles];
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.title) { this.title = 'Modal title'; }

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        this.onClose();
      }
    });
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal) {
      if (name === 'title') {
        this.title = newVal;
      }

      if (name === 'show') {
        this.show = newVal;
      }
    }
  }

  render() {
    return html`
      <div class="dialog-box-overlay" style="display: ${this.show === 'true' ? 'block' : 'none'};">
        <div class="dialog-box">
          <header class="dialog-box-header">
            <h4 class="dialog-box-title">${this.title}</h4>
            <button type="button" @click="${this.onClose}">&times;</button>
          </header>
          <div class="dialog-box-content">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

  onClose() {
    document.dispatchEvent(new CustomEvent('ondialogboxclose', {
      bubbles: true,
      composed: true,
    }));
  }
}

customElements.define('dialog-box', DialogBox);
