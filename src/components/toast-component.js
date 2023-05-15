/* eslint-disable max-len */
import { LitElement, html, css } from 'lit';
import checkSymbol from './assets/check-symbol';
import closeSymbol from './assets/close-symbol';

// eslint-disable-next-line import/prefer-default-export
export class Toast extends LitElement {
  static properties = {
    tone: { type: String },
    tones: { type: {} },
    message: { type: String },
    active: { type: Boolean },
  };

  constructor(tone, message) {
    super();
    this.active = true;
    this.message = message ?? '';
    this.tone = tone ?? 'positive';
    this.tones = {
      info: {
        borderColor: css`#7CBBEA`,
        bgColor: css`#DEECF7`,
        icon: checkSymbol,
      },
      positive: {
        borderColor: css`#83D187`,
        bgColor: css`#DFF1E0`,
        icon: checkSymbol,
      },
      warning: {
        borderColor: css`#F5AE70`,
        bgColor: css`#FFEBD7`,
        icon: checkSymbol,
      },
      critical: {
        borderColor: css`#F49494`,
        bgColor: css`#F8E3E3`,
        icon: checkSymbol,
      },
    };
  }

  firstUpdated() {
    const onFadeOut = (event) => {
      if (this.renderRoot.querySelectorAll('.toast-active').length > 0 && event.animationName === 'fadeOut') {
        this.onClose();
      }
    };
    this.renderRoot.getElementById('toast').addEventListener('animationend', onFadeOut);
    this.renderRoot.getElementById('toast').addEventListener('webkitAnimationEnd', onFadeOut);
  }

  onClose() {
    this.active = false;
    const options = {
      detail: 'closed toast',
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('closed-toast', options));
  }

  render() {
    return html`
            <output role="status" class="toast${this.active ? '-active' : ''}" id="toast"
                style="border-color: ${this.tones[this.tone].borderColor}; background: ${this.tones[this.tone].bgColor}">
                <div class="toast-icon-text">
                    ${this.tones[this.tone].icon({ width: 24, height: 24 })}
                    <p class="text">${this.message}</p>
                </div>
                <div class="close-button" @click="${this.onClose}">
                    ${closeSymbol({})}
                </div>
            </output>
        `;
  }

  static get styles() {
    return [
      css`
            .close-button {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                border-radius: 4px;
                padding: 0px;
                width: 44px;
                height: 36px;
            }

            .close-button:hover {
                cursor: pointer;
                background-color: rgba(0, 0, 0, 0.05);
            }

            .toast-icon-text {
                display: flex;
                flex-direction: row;
                align-items: center;
                padding: 0px 0px 0px 4px;
                gap: 12px;
                width: auto;
                min-height: 40px;
            }

            .text {
                overflow-wrap: break-word;
                font-style: normal;
                font-family:var(--font-regular); 
                font-weight: 400;
                font-size: 14px;
                line-height: 20px;
                display: flex;
                align-items: center;
                letter-spacing: 0.002em;
                color: black;
                margin: 0;
            }

            .toast {
                opacity: 0;
                pointer-events: none;
                display: none;
            }

            .toast-active {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                padding: 16px 16px 16px 20px;
                gap: 12px;
                min-width: 16.125rem;
                width: auto;
                border: 1px solid;
                box-shadow: 0px 12px 16px rgba(0, 0, 0, 0.16);
                border-radius: 4px;
                position: fixed;
                overflow: hidden;
                pointer-events: all;
                bottom: 32px;
                right: 50%;
                transform: translateX(50%);
                z-index: 1001;
                -webkit-animation:
                    fadeIn .3s ease,
                    slideIn .3s ease,
                    fadeOut .3s ease 10s forwards;
                animation:
                    fadeIn .3s ease,
                    slideIn .3s ease,
                    fadeOut .3s ease 10s forwards;
            }

            @media only screen and (min-width: 768px) {
                .toast-active {
                    right: 96px;
                    transform: none;
                }
            }
            
            @keyframes slideIn {
                from { transform: translateY(0, 10px) }
            }

            @keyframes fadeIn {
                from { opacity: 0 }
            }
            
            @keyframes fadeOut {
                to {
                    opacity: 0;
                    pointer-events: none;
                    display: none;
                }
            }

            @-webkit-keyframes slideIn {
                from { transform: translateY(0, 10px) }
            }

            @-webkit-keyframes fadeIn {
                from { opacity: 0 }
            }
            
            @-webkit-keyframes fadeOut {
                to {
                    opacity: 0;
                    pointer-events: none;
                    display: none;
                }
            }
            `,
    ];
  }
}

if (!customElements.get('toast-component')) customElements.define('toast-component', Toast);
