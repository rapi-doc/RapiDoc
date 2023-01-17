/* eslint-disable max-len */
import { LitElement, html, css } from 'lit';
import checkSymbol from './assets/check-symbol';
import copySymbol from './assets/copy-symbol';
import './toast-component';

/* eslint-disable indent */
// eslint-disable-next-line import/prefer-default-export
export class ContentCopyButton extends LitElement {
    static properties = {
        id: { type: String },
        content: { type: String },
        copied: { type: Boolean },
        showButton: { type: Boolean },
        showToast: { type: Boolean },
    };

    constructor(id, content) {
        super();
        this.id = id;
        this.content = content;
        this.copied = false;
        this.showButton = false;
        this.showToast = false;
        this.addEventListener('closed-toast', () => { this.showToast = false; });
    }

    reset() {
        this.copied = false;
        this.showButton = false;
    }

    willUpdate(changedProperties) {
        if (changedProperties.has('id')) {
            this.reset();
        }
    }

    onButtonClick() {
        navigator.clipboard.writeText(this.content);
        this.copied = true;
    }

    onTextClick() {
        navigator.clipboard.writeText(this.content);
        this.showToast = true;
    }

    onMouseover() {
        this.showButton = true;
    }

    onMouseLeave() {
        this.showButton = !!this.copied;
    }

    render() {
        return html`
                <div @mouseover="${this.onMouseover}" @mouseleave="${this.onMouseLeave}" class="content-copy-container">
                    <span @click="${this.onTextClick}" part="label-operation-path">${this.content}</span>
                    <button @click="${this.onButtonClick}" style=${this.showButton ? 'visibility: visible;' : 'visibility: hidden;'}>
                        <div class="svg-container">
                            ${
                                this.copied
                                ? checkSymbol()
                                : copySymbol()
                            }
                        </div>
                    </button>
                </div>
                ${
                    this.showToast
                    ? html`<toast-component tone="positive" message="Copied to clipboard"></toast-component>`
                    : ''
                }
        `;
    }

    static get styles() {
        return [
          css`
            .svg-container {
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
                align-items: flex-start;
                padding: 0px 8px 0px 0px;
                gap: 10px;
                width: 57px;
                height: 20px;
                background: linear-gradient(270deg, #FFFFFF 51.22%, rgba(255, 255, 255, 0) 104.88%);
            }

            span {
                flex: 1 0 auto;
                padding: 4px 8px;
            }

            span:hover {
                cursor: pointer;
            }

            button {
                background: none;
                color: inherit;
                border: none;
                padding: 0;
                cursor: pointer;
                outline: inherit;
                right: 0;
                display: block;
                position: -webkit-sticky;
                position: sticky;
            }

            .copy-container {
                width: inherit;
                height: inherit;
                opacity: 0;
                filter: alpha(opacity = 0);
                position: absolute;
                top:0; bottom:0; left:0; right:0;
                display: block;
                z-index: 2;
                background: transparent;
            }

            .content-copy-container {
                width: inherit;
                height: inherit;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                display: flex;
                flex-wrap: nowrap;
                font-size: 14px;
                white-space: nowrap;
                overflow-y: hidden;
                overflow-x: auto;
                align-items: center;
            }

            .content-copy-container::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }

            .content-copy-container::-webkit-scrollbar-track {
                background:var(--input-bg);
            }
            
            .content-copy-container::-webkit-scrollbar-thumb {
                border-radius: 2px;
                background-color: var(--border-color);
            }
          `,
        ];
      }
}

customElements.define('content-copy-button', ContentCopyButton);
