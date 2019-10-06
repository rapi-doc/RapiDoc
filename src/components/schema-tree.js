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
          font-family: var(--font-mono);
          font-size:var(--font-mono-size);
          display:inline-block;
          overflow:hidden;
          width:100%;
        }
        .item {
          white-space: nowrap;
          display: table;
        }
        .item__key {
          display:inline;
        }
        .item__value {
          display: table-cell;
          white-space: nowrap;
        }
        .item__type {
          display: table-cell;
          white-space: nowrap;
        }
        .item__constraints {
          display: table-cell;
          font-family:var(--font-regular);
          color:var(--delete-color);
          padding: 2px 2px 2px 10px;
          margin-left:5px;
        }
        .item__descr {
          color:var(--light-fg);
          display: table-cell;
          padding-left:12px;
          min-width: 125px;
          font-family:var(--font-regular);
          white-space:normal;
        }
        .obj-descr {
          color:var(--light-fg);
          font-family:var(--font-regular);
          display:inline;
          white-space:normal;
        }
        .left-bracket {
          display:inline-block;
          padding: 0 20px 0 0;
          cursor:pointer;
          border: 1px solid transparent;
          border-radius:3px;
        }
        .left-bracket:hover {
          color:var(--primary-color);
          background-color:var(--hover-color);
          border: 1px solid var(--border-color);
        }
        .inside-bracket {
          padding-left:12px;
          border-left:1px dotted var(--border-color);
        }
        .stri, .string, .uri, .url, .byte, .bina, .date, .pass, .ipv4, .ipv4, .uuid, .emai, .host {color:#86b300;}
        .inte, .numb, .number, .int6, .int3, .floa, .doub, .deci .blue {color:#47afe8;}
        .null {color:orangered;}
        .bool, .boolean{color:#b96ff1}
        .enum {color:orange}
        .recu {color:#D4AC0D} 
        .any-of-one-of{
          font-size:10px; 
          font-weight:bold; 
          background-color:var(--primary-color); 
          color:var(--primary-text); 
          border-radius:2px; 
          padding:2px 4px; 
          margin-bottom:1px; 
          display:inline-block;
        }
        .bold {font-weight:bold }
        @media only screen and (min-width: 768px){
          .item-descr{
            padding-left:24px;
          }
        }
      </style>
      <div class="tree">
        ${this.generateTree(this.data['::type'] === 'array' ? this.data['::props'] : this.data, this.data['::type'])}
      </div>  
    `;
  }

  generateTree(data, prevDataType = 'object') {
    if (!data) {
      return html`<div class="null" style="display:inline;">null</div>`;
    }
    if (typeof data === 'object') {
      const dataType = prevDataType === 'array' ? 'array' : 'object';
      if (Object.keys(data).length === 0) {
        return html`${(Array.isArray(data) ? '[ ]' : '{ }')}`;
      }
      if ((Object.keys(data).length === 1) && Object.keys(data)[0] === ':description') {
        return html`{ } <span class='obj-descr'> ${data['::description']} </span>`;
      }
      if (dataType === 'array' && data[0] === '~|~') {
        return html`[ ]`;
      }

      let openBracket;
      let closeBracket;
      if (Object.keys(data)[0].startsWith('OPTION') || Object.keys(data)[0] === 'ANY_OF' || Object.keys(data)[0] === 'ONE_OF') {
        if (Object.keys(data)[0] === 'ANY_OF' || Object.keys(data)[0] === 'ONE_OF') {
          openBracket = html`<div width="100%" style="border-bottom: 1px solid var(--primary-color); margin: 5px 0;"></div>`;
          closeBracket = html`<div width="100%" style="border-bottom: 1px solid var(--primary-color); margin: 5px 0;"></div>`;
        } else {
          closeBracket = '';
          openBracket = '';
        }
      } else {
        openBracket = html`<div class="left-bracket expanded ${dataType === 'array' ? 'array' : 'object'} " @click="${this.toggleExpand}" > ${dataType === 'array' ? '[{' : '{'}</div>`;
        closeBracket = html`<div class="right-bracket obj-content-part">${dataType === 'array' ? '}]' : '}'}</div>`;
      }
      return html`
        ${openBracket}
        ${data['::description'] ? html`<span class='obj-descr obj-content-part'> ${data['::description']} </span>` : ''}
        <div class="${Object.keys(data)[0].startsWith('OPTION') ? '' : 'inside-bracket'} obj-content-part" >
          ${Object.keys(data).map((key) => html`
            ${['::description', '::type', '::props'].includes(key)
              ? ''
              : html`
                <div class="item"> 
                  <span class="item__key"> 
                    ${key === 'ANY_OF' || key === 'ONE_OF'
                      ? html`
                        <span class="any-of-one-of" >${key.replace('_', ' ')}</span>`
                      : key.startsWith('OPTION')
                        ? html`<span class="any-of-one-of" >${key.replace('OPTION_', ' ')}</span>`
                        : key.endsWith('*')
                          ? html`<span style='color:var(--delete-color)'>*</span>${key.substring(0, key.length - 1)}:`
                          : html`${key}:`
                    } 
                  </span>
                  ${this.generateTree(data[key]['::type'] === 'array' ? data[key]['::props'] : data[key], data[key]['::type'])}
                </div>`
            }
          `)}
        </div>
        ${closeBracket}
      `;
    }

    // For Primitive Data types
    const itemParts = data.split('~|~');
    const dataTypeCss = itemParts[0].replace('{', '').substring(0, 4).toLowerCase();

    return html`
      ${itemParts.length === 7
        ? html`
            <span class="item__value">
              ${data
                ? html`
                  <div class="item__type ${dataTypeCss}"> 
                    ${prevDataType === 'array' ? '[' : ''} 
                    ${itemParts[0]} ${itemParts[1]}
                    ${prevDataType === 'array' ? ']' : ''} 
                  </div>
                  ${itemParts[2]
                    ? html`<div class="item__constraints"> ${itemParts[2]}</div>`
                    : ''
                  }
                  <span class="item__descr"> 
                    ${itemParts[3]
                      ? html`<div style='color:#47afe8;'><span class='bold'>Default:</span> ${itemParts[3]}</div>`
                      : ''
                    }
                    ${itemParts[4]
                      ? html`<div style='color:#47afe8;'><span class='bold'>Allowed:</span>(${itemParts[4]})</div>`
                      : ''
                    }
                    ${itemParts[5]
                      ? html`<div style='color:#47afe8;'><span class='bold'>Pattern:</span> ${itemParts[5]}</div>`
                      : ''
                    }
                    ${itemParts[6]
                      ? html`<span class="m-markdown m-markdown-small">${unsafeHTML(marked(itemParts[6]))}</span>`
                      : ''
                    }
                  </span>`
                : ''
              }
            </span>
          `
        : html`<span class="item__value"> Must be 7 parts but found ${itemParts.length}</span>`
      }
    `;
  }

  /* eslint-enable indent */

  static get properties() {
    return {
      data: { type: Object },
    };
  }

  toggleExpand(e) {
    if (e.target.classList.contains('expanded')) {
      e.target.classList.add('collapsed');
      e.target.classList.remove('expanded');
      e.target.innerHTML = e.target.classList.contains('array') ? '[{...}]' : '{...}';
      const els = e.target.parentNode.querySelectorAll(':scope > .obj-content-part');
      els.forEach((el) => {
        el.style.display = 'none';
      });
    } else {
      e.target.classList.remove('collapsed');
      e.target.classList.add('expanded');
      e.target.innerHTML = e.target.classList.contains('array') ? '[{' : '{';
      const els = e.target.parentNode.querySelectorAll(':scope > .obj-content-part');
      els.forEach((el) => {
        el.style.display = el.classList.contains('obj-descr') ? 'inline' : 'block';
      });
    }
  }
}
customElements.define('schema-tree', SchemaTree);
