import { LitElement, html } from 'lit';
import DialogBoxStyles from '../styles/dialog-box-styles';
import { property } from 'lit/decorators.js';

export default class DialogBox extends LitElement {
  @property({ type: String, attribute: 'heading' })
  public heading?: string | null;

  @property({ type: String, attribute: 'show' })
  public show?: string | null;

  static override get styles() {
    return [DialogBoxStyles];
  }

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        this.onClose();
      }
    });
  }

  override attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal !== newVal) {
      if (name === 'heading') {
        this.heading = newVal;
      }
      if (name === 'show') {
        this.show = newVal;
        if (newVal === 'true') {
          document.dispatchEvent(new CustomEvent('open', {
            bubbles: true,
            composed: true,
            detail: this,
          }));
        }
      }
    }
    super.attributeChangedCallback(name, oldVal, newVal);
  }

  /* eslint-disable indent */
  override render() {
    return html`
    ${this.show === 'true'
      ? html`
        <div class="dialog-box-overlay">
          <div class="dialog-box">
            <header class="dialog-box-header">
              <span class="dialog-box-title">${this.heading}</span>
              <button type="button" @click="${this.onClose}">&times;</button>
            </header>
            <div class="dialog-box-content">
              <slot></slot>
            </div>
          </div>
        </div>`
      : ''
    }`;
  }
  /* eslint-enable indent */

  onClose() {
    document.dispatchEvent(new CustomEvent('close', {
      bubbles: true,
      composed: true,
    }));
  }
}

customElements.define('dialog-box', DialogBox);
