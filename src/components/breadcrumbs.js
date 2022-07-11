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
          text-decoration: none;
        }

        .header:hover {
          color: #4A596B;
        }

        .header:active {
          color: #0C1522;
        }

        .caret {
          margin: 0 2px;
        }
      `,
      CustomStyles,
    ];
  }

  render() {
    const headers = this.headers.map(({ title, link }) => ({
      title: title.slice(0, 25) + (title.length > 25 ? '...' : ''),
      link,
    }));

    return html`
      <div class='container'>
        ${headers.map((header, index) => html`
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

          <a class='header' href=${header.link}>${header.title}</a>
        `)}
      </div>
    `;
  }
}

customElements.define('bread-crumbs', Breadcrumbs);
