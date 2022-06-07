/* eslint-disable max-len */
import { LitElement, html, css } from 'lit';
import checkSymbol from './assets/check-symbol';
import copySymbol from './assets/copy-symbol';

/* eslint-disable indent */
// eslint-disable-next-line import/prefer-default-export
export class ContentCopyButton extends LitElement {
    static properties = {
        content: { type: String },
        copied: { type: Boolean },
        showButton: { type: Boolean },
    };

    constructor(content) {
        super();
        this.content = content;
        this.copied = false;
        this.showButton = false;
    }

    onButtonClick() {
        navigator.clipboard.writeText(this.content);
        this.copied = true;
    }

    onTextClick() {
        navigator.clipboard.writeText(this.content);
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
                flex: 0 0 auto;
                width: 100%;
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
                position: -webkit-sticky; /* Required for Safari */
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
            }
          `,
        ];
      }
}

customElements.define('content-copy-button', ContentCopyButton);
