/* eslint-disable max-len */
import { LitElement, html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { joinURLandPath } from '../utils/url';
import checkSymbol from './assets/check-symbol';
import copySymbol from './assets/copy-symbol';
import './toast-component';

/* eslint-disable indent */
// eslint-disable-next-line import/prefer-default-export
export class BaseUrl extends LitElement {
    static properties = {
        id: { type: String },
        url: { type: String },
        path: { type: String },
        computedUrl: { type: String },
        copied: { type: Boolean },
        showButton: { type: Boolean },
        showToast: { type: Boolean },
    };

    constructor(id, url, path, computedUrl, variables) {
        super();
        this.id = id;
        this.url = url;
        this.path = path;
        this.computedUrl = computedUrl;
        this.variables = variables;
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
        navigator.clipboard.writeText(joinURLandPath(this.computedUrl, this.path));
        this.copied = true;
        this.showToast = true;
    }

    onTextClick() {
        navigator.clipboard.writeText(joinURLandPath(this.computedUrl, this.path));
        this.showToast = true;
    }

    onMouseOver() {
        this.showButton = true;
    }

    onMouseLeave() {
        this.showButton = false;
        this.copied = false;
    }

    parseURL() {
        if (!this.variables) return this.url;

        let { url } = this;
        const spanVar = '<span class="variable">{var}</span>';

        for (const [key, value] of Object.entries(this.variables)) {
            const regex = new RegExp(`{${key}}`, 'g');
            url = url.replace(regex, spanVar.replace('{var}', value.value));
        }

        return joinURLandPath(url, this.path);
    }

    render() {
        return html`
            <div class='container'>
                <div @mouseover="${this.onMouseOver}" @mouseleave="${this.onMouseLeave}" class="content-copy-container">
                    ${html`<span @click="${this.onTextClick}" part="label-operation-path" class="url">${unsafeHTML(this.parseURL())}</span>`}
                    <button @click="${this.onButtonClick}" style=${this.showButton ? 'opacity: 1;' : 'opacity: 0.2;'}>
                        <div class="svg-container">
                            ${
                                this.copied
                                ? checkSymbol()
                                : copySymbol()
                            }
                        </div>
                    </button>
                </div>
                <slot></slot>
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

            .url {
                flex: 1 0 auto;
                padding: 4px 8px;
                font-family: var(--font-mono);
                font-size: var(--font-size-mono)
            }

            .url:hover {
                cursor: pointer;
            }

            .variable {
                background-color: rgb(248, 247, 252);
                border: 1px solid rgb(204, 206, 216);
                border-radius: 4px;
                padding: 0px 2px;
            }

            .container {
                height: 42px;
                font-size:14px;
                border: 1px solid var(--border-color);
                border-radius: 4px;
                margin: 4px 0px;
                position: relative;
            }

            .container slot {
                visibility: hidden;
            }

            .container:hover slot {
                visibility: visible;
            }

            .container::-webkit-scrollbar {
                display: none;
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

if (!customElements.get('base-url')) customElements.define('base-url', BaseUrl);
