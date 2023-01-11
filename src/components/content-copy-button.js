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
                ${
                    this.showButton
                    ? html`
                    <div @mouseleave="${this.onMouseLeave}" class="content-copy-container">
                        <span @click="${this.onTextClick}" part="label-operation-path">${this.content}</span>
                        <button @click="${this.onButtonClick}">
                            <div class="svg-container">
                                ${
                                    this.copied
                                    ? checkSymbol()
                                    : copySymbol()
                                }
                            </div>
                        </button>
                    </div>
                    `
                    : html`
                    <div class="content-copy-container">
                        <span part="label-operation-path">${this.content}</span>
                    </div>
                    <div class='copy-container' @mouseover="${this.onMouseover}"></div>
                    `
                }
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
            }

            span {
                flex: 0 0 auto;
                width: calc(100% - 28px);
                padding: 4px 20px 4px 8px;
                word-break: break-word;
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
            }
          `,
        ];
      }
}

customElements.define('content-copy-button', ContentCopyButton);
