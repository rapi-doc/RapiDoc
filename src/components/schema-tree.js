import { LitElement, html } from 'lit-element';
import marked from 'marked';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import FontStyles from '@/styles/font-styles';

export default class SchemaTree extends LitElement {
  /* eslint-disable indent */
  render() {
    return html`
      ${FontStyles}
      <style>
      .tree {
        font-size:12px;
        text-align: left;
        line-height:18px;
      }
      .tr {
        display: flex;
        flex: none;
        width: 100%;
        border-bottom: 1px dotted transparent;
      }
      .tr:hover{
        background-color:rgba(128,128,128, 0.07);
      }
      .td {
        display: block;
        flex: 0 0 auto;
        box-sizing: border-box;
        background-color:transparent;
      }
      .key {
        font-family: var(--font-mono);
        white-space: normal;
        word-break: break-all;
        max-width: 300px;
      }
      .key-descr {
        font-family:var(--font-regular);
        color:var(--light-fg);
        flex-shrink: 1;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .expanded-descr .key-descr{
        max-height:auto;
        overflow:hidden;
      }
      .collapsed-descr .tr {
        max-height:20px;
      }
      .collapsed-descr .m-markdown-small p {
        line-height:20px;
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
      .inside-bracket.xxx-of{
        padding:5px 0px;
        border-style: solid;
        border-width: 1px 0;
        border-color:var(--primary-color);
      }
      .xxx-of-key {
        font-size:10px; 
        font-weight:bold; 
        background-color:var(--primary-color); 
        color:var(--primary-text); 
        border-radius:2px;
        line-height:18px;
        padding:0px 5px; 
        margin-bottom:1px; 
        display:inline-block;
      }
      .stri, .string, .uri, .url, .byte, .bina, .date, .pass, .ipv4, .ipv4, .uuid, .emai, .host {color:#86b300;}
      .inte, .numb, .number, .int6, .int3, .floa, .doub, .deci .blue {color:#47afe8;}
      .null {color:orangered;}
      .bool, .boolean{color:#b96ff1}
      .enum {color:orange}
      .recu {color:#D4AC0D}
      .toolbar {
        display:flex;
        width:100%;
        padding: 2px 0;
        color:var(--primary-color);
      }
      .toolbar-item{
        cursor:pointer;
        padding:5px 0;
        margin:0 2px;
      }
      .seperator{
        width:1px;
        align-self:streatch;
        border-left: 1px solid var(--border-color);
        margin : 5px 5px;
      }
      </style>
      <div class="tree expanded-descr">
        <div class='toolbar'> 
          <div style="flex:1"></div>
          <div class='toolbar-item' @click='${this.toggleDescrExpand}'> 
            Copy
          </div>
          <div class='seperator'></div>
          <div class='toolbar-item' @click='${this.toggleDescrExpand}'> 
            Collapse Descriptions
          </div>
        </div>

        <div style='padding: 5px 0; color:var(--fg2)'> <span class='bold-text upper'> ${this.data['::type']}: </span> ${this.data['::description']}</div>
        ${this.generateTree(
          this.data['::type'] === 'array' ? this.data['::props'] : this.data,
          this.data['::type'],
          '',
          '',
        )}
      </div>  
    `;
  }

  generateTree(data, prevDataType = 'object', prevKey = '', prevDescr = '', level = 0) {
    if (!data) {
      return html`<div class="null" style="display:inline;">null</div>`;
    }
    let newPrevKey = '';
    if (['::ONE~OF', '::ONE~OF'].includes(prevKey)) {
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
        openBracket = html`<span class="open-bracket array" @click="${this.toggleObjectExpand}">[{</span>`;
        closeBracket = '}]';
      } else {
        openBracket = html`<span class="open-bracket object" @click="${this.toggleObjectExpand}">{</span>`;
        closeBracket = '}';
      }
    }

    if (typeof data === 'object') {
      return html`
        <div class="tr expanded ${data['::type']}">
          <div class='td key' style='min-width:${minFieldColWidth}px'>
            ${data['::type'] === 'xxx-of-option' || prevKey.startsWith('::OPTION')
              ? html`<span class='xxx-of-key'>${newPrevKey}</span>`
              : newPrevKey.endsWith('*')
                ? html`<span style='color:var(--delete-color);margin-left:-6px'>*</span>${newPrevKey.substring(0, newPrevKey.length - 1)}`
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
            ? html`<span style='color:var(--delete-color); margin-left:-6px'>*</span>${newPrevKey.substring(0, newPrevKey.length - 1)}`
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
            ? html`<div style='color: var(--fg2)'><span class='bold-text'>Default:</span> ${itemParts[3]}</div>`
            : ''
          }
          ${itemParts[4]
            ? html`<div style='color: var(--fg2)'><span class='bold-text'>Allowed:</span>(${itemParts[4]})</div>`
            : ''
          }
          ${itemParts[5]
            ? html`<div style='color: var(--fg2)'><span class='bold-text'>Pattern:</span> ${itemParts[5]}</div>`
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

  static get properties() {
    return {
      data: { type: Object },
    };
  }

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

  toggleDescrExpand(e) {
    const treeEl = e.target.closest('.tree');
    if (treeEl.classList.contains('expanded-descr')) {
      treeEl.classList.add('collapsed-descr');
      treeEl.classList.remove('expanded-descr');
      e.target.innerHTML = 'Expand Descriptions';
    } else {
      treeEl.classList.remove('collapsed-descr');
      treeEl.classList.add('expanded-descr');
      e.target.innerHTML = 'Collapse Descriptions';
    }
  }
}
customElements.define('schema-tree', SchemaTree);
