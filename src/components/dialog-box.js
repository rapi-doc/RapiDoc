import { LitElement, html } from 'lit';
import DialogBoxStyles from '~/styles/dialog-box-styles';

export default class DialogBox extends LitElement {
  static get properties() {
    return {
      heading: { type: String, attribute: 'heading' },
      show: { type: String, attribute: 'show' },
    };
  }

  static get styles() {
    return [DialogBoxStyles];
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        this.onClose();
      }
    });
  }

  attributeChangedCallback(name, oldVal, newVal) {
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
  render() {
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
