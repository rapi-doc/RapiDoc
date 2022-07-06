import { LitElement, html, css } from 'lit';

import CustomStyles from '~/styles/custom-styles';

export default class Breadcrumbs extends LitElement {
  static get properties() {
    return {
      headers: { type: Array },
    };
  }

  static get styles() {
    return [
      css`
        .container {
          display: flex;
          align-items: center;
        }

        .header {
          font-size: 16px;
          font-weight: 400;
          line-height: 18px;
          color: #A1A8B3;
        }

        .caret {
          margin: 0 2px;
        }
      `,
      CustomStyles,
    ];
  }

  render() {
    return html`
      <div class='container'>
        ${this.headers.map((header, index) => html`
          ${index > 0 ? html`
            <svg class="caret" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.66602 10.6654L9.33268 7.9987L6.66602 5.33203"
                stroke="#CCCED8"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          ` : ''}

          <div class='header'>${header}</div>
        `)}
      </div>
    `;
  }
}

customElements.define('bread-crumbs', Breadcrumbs);
