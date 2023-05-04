import { LitElement, html, css } from 'lit';

import CustomStyles from '../styles/custom-styles';
import cornerArrowSymbol from './assets/corner-arrow-symbol';

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

        .tooltip {
          position: relative;
          display: inline-block;
        }

        .tooltip .tooltiptext {
          visibility: hidden;
          width: max-content;
          max-width: 150px;
          padding: 8px;

          border-radius: 4px;
          box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.1);

          background-color: #FFFFFF;
          color: #A1A8B3;
          
          position: absolute;
          transform: translateX(-50%);
          top: 135%;
          left: 50%;
          z-index: 1;
        }

        .tooltip:hover .tooltiptext {
          visibility: visible;
          left: 50%;
          transform: translateX(-50%);
        }

        .tooltiptext::after {
          content: "";
          position: absolute;
          bottom: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: transparent transparent #fff transparent;
        }

        @media(max-width: 1024px) {
          .header {
            font-size: 12px;
            line-height: 16px;
          }
        }
      `,
      CustomStyles,
    ];
  }

  render() {
    let headers = this.headers.map(({ title, link }) => ({
      title: title.slice(0, 25) + (title.length > 25 ? '...' : ''),
      link,
      hasTooltip: (title.length > 25),
      tooltip: [{ title, link }],
    }));

    if (headers.length > 3) {
      const ellipsis = headers.slice(1, -1).reduce((acc, curr) => {
        acc.tooltip.push({ title: curr.tooltip[0].title, link: curr.tooltip[0].link });
        return acc;
      }, { title: '...', link: '', hasTooltip: true, tooltip: [] });

      headers = [headers[0], ellipsis, headers[headers.length - 1]];
    }

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
          <div class="tooltip">
            <a class="header" onclick="return false;">${header.title}</a>
            ${header.hasTooltip ? html`
              <div class="tooltiptext">
                ${header.tooltip.map((content) => html`
                  <div style="display:flex;gap: 5px;">
                    ${header.tooltip.length > 1 ? cornerArrowSymbol() : ''}
                    <a class="header" onclick="return false;">${content.title}</a>
                  </div>
                `)}
              </div>` : ''}
          </div>
        `)}
      </div>
    `;
  }
}

customElements.define('bread-crumbs', Breadcrumbs);
