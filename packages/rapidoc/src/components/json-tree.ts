import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { copyToClipboard } from '~/utils/common-utils';
import FontStyles from '~/styles/font-styles';
import BorderStyles from '~/styles/border-styles';
import InputStyles from '~/styles/input-styles';
import CustomStyles from '~/styles/custom-styles';

@customElement('json-tree')
export default class JsonTree extends LitElement {
  @property({ type: Object }) data = null;
  @property({ type: String, attribute: 'render-style' }) renderStyle = '';

  static get styles() {
    return [
      FontStyles,
      BorderStyles,
      InputStyles,
      css`
        :host {
          display: flex;
        }
        :where(button, input[type='checkbox'], [tabindex='0']):focus-visible {
          box-shadow: var(--focus-shadow);
        }
        :where(input[type='text'], input[type='password'], select, textarea):focus-visible {
          border-color: var(--primary);
        }
        .json-tree {
          position: relative;
          font-family: var(--font-mono);
          font-size: var(--font-size-small);
          display: inline-block;
          overflow: hidden;
          word-break: break-all;
          flex: 1;
          line-height: calc(var(--font-size-small) + 6px);
          min-height: 40px;
          direction: ltr;
          text-align: left;
        }

        .open-bracket {
          display: inline-block;
          padding: 0 20px 0 0;
          cursor: pointer;
          border: 1px solid transparent;
          border-radius: min(var(--radius), 0.5rem);

          &:hover {
            color: var(--primary);
            border: 1px solid var(--border);
          }

          &.expanded:hover ~ .inside-bracket {
            border-left: 1px solid var(--muted-foreground);
          }
          &.expanded:hover ~ .close-bracket {
            color: var(--primary);
          }
          &.collapsed + .inside-bracket,
          &.collapsed + .inside-bracket + .close-bracket {
            display: none;
          }
          &.expanded .open-bracket-collapsed {
            display: none;
          }
          &.collapsed .open-bracket-expanded {
            display: none;
          }
        }
        .close-bracket {
          border: 1px solid transparent;
          border-radius: min(var(--radius), 0.5rem);
          display: inline-block;
        }
        .inside-bracket {
          padding-left: 12px;
          overflow: hidden;
          border-left: 1px dotted var(--border);
        }

        .string {
          color: var(--green);
        }
        .number {
          color: var(--blue);
        }
        .null {
          color: var(--destructive);
        }
        .boolean {
          color: var(--purple);
        }
        .object {
          color: var(--foreground);
        }
        .toolbar {
          position: absolute;
          top: 5px;
          right: 6px;
          display: flex;
          padding: 2px;
          align-items: center;
        }
      `,
      CustomStyles,
    ];
  }

  render() {
    return html`
      <div
        class="json-tree"
        @click="${(e) => {
          if (e.target.classList.contains('btn-copy')) {
            copyToClipboard(JSON.stringify(this.data, null, 2), e);
          } else {
            this.toggleExpand(e);
          }
        }}"
      >
        <div class="toolbar">
          <button class="btn btn-sm btn-outline toolbar-btn btn-copy" part="btn btn-outline btn-copy">Copy</button>
        </div>
        ${this.generateTree(this.data, true)}
      </div>
    `;
  }

  generateTree(data, isLast = false) {
    if (data === null) {
      return html`<span class="null">null</span>${isLast ? '' : ','}`;
    }
    if (typeof data === 'object' && data instanceof Date === false) {
      const detailType = Array.isArray(data) ? 'array' : 'pure_object';
      if (Object.keys(data).length === 0) {
        return html`${Array.isArray(data) ? '[ ],' : '{ },'}`;
      }
      return html`
        <div class="open-bracket expanded ${detailType === 'array' ? 'array' : 'object'}">
          <span class="open-bracket-expanded">${detailType === 'array' ? '[' : '{'}</span>
          <span class="open-bracket-collapsed">${detailType === 'array' ? '[...]' : '{...}'}</span>
        </div>
        <div class="inside-bracket">
          ${Object.keys(data).map(
            (key, i, a) =>
              html`<div class="item">
                ${detailType === 'pure_object' ? html`"${key}":` : ''} ${this.generateTree(data[key], i === a.length - 1)}
              </div>`
          )}
        </div>
        <div class="close-bracket">${detailType === 'array' ? ']' : '}'}${isLast ? '' : ','}</div>
      `;
    }
    return typeof data === 'string' || data instanceof Date
      ? html`<span class="${typeof data}">"${data}"</span>${isLast ? '' : ','}`
      : html`<span class="${typeof data}">${data}</span>${isLast ? '' : ','}`;
  }

  toggleExpand(e) {
    const openBracketEl = e.target.closest('.open-bracket');
    if (openBracketEl) {
      if (openBracketEl.classList.contains('expanded')) {
        openBracketEl.classList.replace('expanded', 'collapsed');
      } else {
        openBracketEl.classList.replace('collapsed', 'expanded');
      }
    }
  }
}
