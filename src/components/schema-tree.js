import { LitElement, html } from 'lit-element';
import marked from 'marked';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import FontStyles from '@/styles/font-styles';
import SchemaStyles from '@/styles/schema-styles';

export default class SchemaTree extends LitElement {
  static get properties() {
    return {
      data: { type: Object },
      renderStyle: { type: String, attribute: 'render-style' },
      schemaExpandLevel: { type: Number, attribute: 'schema-expand-level' },
      schemaDescriptionExpanded: { type: String, attribute: 'schema-description-expanded' },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.schemaExpandLevel || this.schemaExpandLevel < 1) { this.schemaExpandLevel = 99999; }
    if (!this.schemaDescriptionExpanded || !'true false'.includes(this.schemaDescriptionExpanded)) { this.schemaDescriptionExpanded = 'false'; }
  }

  /* eslint-disable indent */
  render() {
    return html`
      ${FontStyles}
      ${SchemaStyles}
      <style>
      .tree {
        font-size:12px;
        text-align: left;
        line-height:18px;
      }
      .tree-border {
        border: 1px solid var(--border-color);
        padding: 8px 16px 16px 16px;
      }
      .tree .tr:hover{
        background-color:rgba(128,128,128, 0.07);
      }
      .collapsed-descr .tr {
        max-height:20px;
      }
      .collapsed-descr .tr {
        max-height:20px;
      }
      .collapsed-descr .m-markdown-small p {
        line-height:20px;
      }

      .tree .key {
        max-width: 300px;
      }

      .open-bracket{
        display:inline-block;
        padding: 0 20px 0 0;
        cursor:pointer;
        border: 1px solid transparent;
        border-radius:3px;
      }
      .open-bracket:hover {
        color:var(--primary-color);
        background-color:var(--hover-color);
        border: 1px solid var(--border-color);
      }
      .close-bracket{
        display:inline-block;
        font-family: var(--font-mono);
      }
      .tr.collapsed + .inside-bracket,
      .tr.collapsed + .inside-bracket + .close-bracket{
        display:none;
      }
      .inside-bracket.object,
      .inside-bracket.array {
        border-left: 1px dotted var(--border-color);
      }
      .inside-bracket.xxx-of {
        padding:5px 0px;
        border-style: dotted;
        border-width: 0 0 1px 0;
        border-color:var(--primary-color);
      }
      </style>
      <div class="tree ${this.renderStyle === 'read' ? 'tree-border' : ''} ${this.schemaDescriptionExpanded === 'true' ? 'expanded-descr' : 'collapsed-descr'}">
        <div class='toolbar'>
          <div class='toolbar-item bold-text upper' style='cursor:auto; color:var(--fg3)'> ${this.data ? this.data['::type'] : ''} </div>
          <div style="flex:1"></div>
          <div class='toolbar-item' @click='${() => { this.schemaDescriptionExpanded = (this.schemaDescriptionExpanded === 'true' ? 'false' : 'true'); }}'> 
            ${this.schemaDescriptionExpanded === 'true' ? 'Collapse Details' : 'Expand Details'}
          </div>
        </div>
        <div style='color:var(--fg3)'> ${this.data ? this.data['::description'] : ''}</div>
        ${this.data
          ? html`
            ${this.generateTree(
              this.data['::type'] === 'array' ? this.data['::props'] : this.data,
              this.data['::type'],
              '',
              '',
            )}`
          : html`<span class='mono-font' style='color:var(--red)'> Schema not found </span>`
        }
      </div>  
    `;
  }

  generateTree(data, prevDataType = 'object', prevKey = '', prevDescr = '', level = 0) {
    if (!data) {
      return html`<div class="null" style="display:inline;">null</div>`;
    }
    let newPrevKey = '';
    if (prevKey.startsWith('::ONE~OF') || prevKey.startsWith('::ANY~OF')) {
      newPrevKey = prevKey.replace('::', '').replace('~', ' ');
    } else if (prevKey.startsWith('::OPTION')) {
      newPrevKey = prevKey.replace('::OPTION~', '').replace('~', ' ');
    } else {
      newPrevKey = prevKey;
    }

    const leftPadding = 12;
    const minFieldColWidth = 300 - (level * leftPadding);

    let openBracket = '';
    let closeBracket = '';
    if (data['::type'] === 'object') {
      if (prevDataType === 'array') {
        if (level < this.schemaExpandLevel) {
          openBracket = html`<span class="open-bracket array" @click="${this.toggleObjectExpand}">[{</span>`;
        } else {
          openBracket = html`<span class="open-bracket array" @click="${this.toggleObjectExpand}">[{...}]</span>`;
        }
        closeBracket = '}]';
      } else {
        if (level < this.schemaExpandLevel) {
          openBracket = html`<span class="open-bracket object" @click="${this.toggleObjectExpand}">{</span>`;
        } else {
          openBracket = html`<span class="open-bracket object" @click="${this.toggleObjectExpand}">{...}</span>`;
        }
        closeBracket = '}';
      }
    }

    if (typeof data === 'object') {
      return html`
        <div class="tr ${level < this.schemaExpandLevel ? 'expanded' : 'collapsed'} ${data['::type']}">
          <div class='td key' style='min-width:${minFieldColWidth}px'>
            ${data['::type'] === 'xxx-of-option' || prevKey.startsWith('::OPTION')
              ? html`<span class='xxx-of-key'>${newPrevKey}</span>`
              : newPrevKey.endsWith('*')
                ? html`${newPrevKey.substring(0, newPrevKey.length - 1)}<span style='color:var(--red);margin-left:-6px'>*</span>`
                : newPrevKey
            }${level > 0 ? ':' : ''}${openBracket}
          </div>
          <div class='td key-descr'>${prevDescr}</div>
        </div>
        <div class='inside-bracket ${data['::type']}' style='padding-left:${data['::type'] !== 'xxx-of-option' ? leftPadding : 0}px;'>
          ${Object.keys(data).map((key) => html`
            ${['::description', '::type', '::props'].includes(key)
              ? ''
              : html`${this.generateTree(
                data[key]['::type'] === 'array' ? data[key]['::props'] : data[key],
                data[key]['::type'],
                key,
                data[key]['::description'],
                (level + 1),
              )}`
            }
          `)}
        </div>
        ${data['::type'].includes('xxx-of')
          ? ''
          : html`<div class='close-bracket'> ${closeBracket} </div>`
        }
      `;
    }

    // For Primitive Data types
    const itemParts = data.split('~|~');
    const dataTypeCss = itemParts[0].replace('{', '').substring(0, 4).toLowerCase();
    return html`
      <div class = "tr primitive">
        <div class='td key' style='min-width:${minFieldColWidth}px' >
          ${newPrevKey.endsWith('*')
            ? html`${newPrevKey.substring(0, newPrevKey.length - 1)}<span style='color:var(--red);'>*</span>`
            : newPrevKey
          }:
          <span class='${dataTypeCss}'> 
            ${prevDataType === 'array' ? `[${itemParts[0]}]` : itemParts[0]}
            <span>${itemParts[1]}</span>
          </span>
        </div>
        <div class='td key-descr'>
          ${prevDataType === 'array' ? prevDescr : ''}
          ${itemParts[2]
            ? html`<div style='color: var(--fg2)'>${itemParts[2]}</div>`
            : ''
          }
          ${itemParts[3]
            ? html`<div style='color: var(--fg3)'><span class='bold-text'>Default:</span> ${itemParts[3]}</div>`
            : ''
          }
          ${itemParts[4]
            ? html`<div style='color: var(--fg3)'><span class='bold-text'>Allowed:</span>(${itemParts[4]})</div>`
            : ''
          }
          ${itemParts[5]
            ? html`<div style='color: var(--fg3)'><span class='bold-text'>Pattern:</span> ${itemParts[5]}</div>`
            : ''
          }
          ${itemParts[6]
            ? html`<span class="m-markdown m-markdown-small">${unsafeHTML(marked(itemParts[6]))}</span>`
            : ''
          }
        </div>
      </div>
    `;
  }
  /* eslint-enable indent */

  toggleObjectExpand(e) {
    const rowEl = e.target.closest('.tr');
    if (rowEl.classList.contains('expanded')) {
      rowEl.classList.add('collapsed');
      rowEl.classList.remove('expanded');
      e.target.innerHTML = e.target.classList.contains('array') ? '[{...}]' : '{...}';
    } else {
      rowEl.classList.remove('collapsed');
      rowEl.classList.add('expanded');
      e.target.innerHTML = e.target.classList.contains('array') ? '[{' : '{';
    }
  }
}
customElements.define('schema-tree', SchemaTree);
