import { LitElement, html, css } from 'lit-element';
import marked from 'marked';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import FontStyles from '@/styles/font-styles';
import SchemaStyles from '@/styles/schema-styles';
import CustomStyles from '@/styles/custom-styles';

export default class SchemaTable extends LitElement {
  static get properties() {
    return {
      schemaExpandLevel: { type: Number, attribute: 'schema-expand-level' },
      schemaDescriptionExpanded: { type: String, attribute: 'schema-description-expanded' },
      data: { type: Object },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.schemaExpandLevel || this.schemaExpandLevel < 1) { this.schemaExpandLevel = 99999; }
    if (!this.schemaDescriptionExpanded || !'true false'.includes(this.schemaDescriptionExpanded)) { this.schemaDescriptionExpanded = 'false'; }
  }

  static get styles() {
    return [
      FontStyles,
      SchemaStyles,
      css`
      .table {
        font-size: var(--font-size-small);
        text-align: left;
        line-height: calc(var(--font-size-small) + 6px);
      }
      .table .tr {
        width: calc(100% - 5px);
        padding: 0 0 0 5px;
        border-bottom: 1px dotted var(--light-border-color);
      }
      .table .td {
        padding: 4px 0;
      }
      .table .key {
        width: 240px;
      }
      .table .key-type {
        white-space: normal;
        width: 70px;
      }
      .collapsed-descr .tr {
        max-height: calc(var(--font-size-small) + var(--font-size-small) + 4px);
      }

      .obj-toggle {
        padding: 0 2px;
        border-radius:2px;
        border: 1px solid transparent;
        display: inline-block;
        margin-left: -16px;
        color:var(--primary-color);
        cursor:pointer;
        font-size: calc(var(--font-size-small) + 4px);
        font-family: var(--font-mono);
        background-clip: border-box;
      }
      .obj-toggle:hover {
        border-color: var(--primary-color);
      }
      .tr.expanded + .object-body {
        display:block;
      }
      .tr.collapsed + .object-body {
        display:none;
      }`,
      CustomStyles,
    ];
  }

  /* eslint-disable indent */
  render() {
    return html`
      <div class="table ${this.schemaDescriptionExpanded === 'true' ? 'expanded-descr' : 'collapsed-descr'}">
        <div class='toolbar'> 
          <div style="flex:1"></div>
          <div class='toolbar-item' @click='${() => { this.schemaDescriptionExpanded = (this.schemaDescriptionExpanded === 'true' ? 'false' : 'true'); }}'> 
            ${this.schemaDescriptionExpanded === 'true' ? 'Single line description' : 'Multiline description'}
          </div>
        </div>
          <div style='padding: 5px 0; color:var(--fg2)'> 
            <span class='bold-text upper'> ${this.data ? this.data['::type'] : ''}</span> 
            <span class='m-markdown' >${this.data ? unsafeHTML(marked(this.data['::description'] || '')) : ''}</span>
          </div>
          <div style = "border:1px solid var(--light-border-color)">
            <div style='display:flex; height:calc(var(--font-size-small) + 6px); background-color: var(--bg2); line-height:calc(var(--font-size-small) + 6px); padding:8px 2px; border-bottom:1px solid var(--light-border-color);'>
              <div class='td key' style='font-family:var(--font-regular); font-weight:bold; color:var(--fg)'> Field</div>
              <div class='td key-type' style='font-family:var(--font-regular); font-weight:bold; color:var(--fg)'> Type </div>
              <div class='td key-descr' style='font-family:var(--font-regular); font-weight:bold; color:var(--fg)'>Description</div>
            </div>
            ${this.data
              ? html`
                ${this.generateTree(
                  this.data['::type'] === 'array' ? this.data['::props'] : this.data,
                  this.data['::type'],
                )}`
              : ''
            }  
          </div>
      </div>  
    `;
  }

  generateTree(data, dataType = 'object', key = '', description = '', level = 0) {
    const leftPadding = 16 * level; // 2 space indentation at each level
    if (!data) {
      return html`<div class="null" style="display:inline;">null</div>`;
    }
    if (Object.keys(data).length === 0) {
      return html`<span class="td key object" style='padding-left:${leftPadding}px'>${key}</span>`;
    }
    let label = '';
    let optionNumber = '';
    let isOneOfLabel = false;
    if (key.startsWith('::ONE~OF') || key.startsWith('::ANY~OF')) {
      label = key.replace('::', '').replace('~', ' ');
      isOneOfLabel = true;
    } else if (key.startsWith('::OPTION')) {
      const parts = key.split('~');
      optionNumber = parts[1];
      label = parts[2];
    } else {
      label = key;
    }
    if (typeof data === 'object') {
      return html`
        ${level > 0
          ? html`
            <div class='tr ${level < this.schemaExpandLevel ? 'expanded' : 'collapsed'} ${data['::type']}' data-obj='${label}'>
              <div class='td key' style='padding-left:${leftPadding}px'>
                ${label || optionNumber
                  ? html`
                    <span 
                      class='obj-toggle ${level < this.schemaExpandLevel ? 'expanded' : 'collapsed'}'
                      data-obj='${label}'
                      @click= ${(e) => this.toggleObjectExpand(e, label)} 
                    >
                      ${level < this.schemaExpandLevel ? '-' : '+'}
                    </span>`
                  : ''
                }
                ${data['::type'] === 'xxx-of-option' || data['::type'] === 'xxx-of-array' || key.startsWith('::OPTION')
                  ? html`<span class="xxx-of-key" style="margin-left:-6px">${optionNumber}</span><span class="${isOneOfLabel ? 'xxx-of-key' : 'xxx-of-descr'}">${label}</span>`
                  : label.endsWith('*')
                    ? html`<span style="display:inline-block; margin-left:-6px;"> ${label.substring(0, label.length - 1)}</span><span style='color:var(--red);'>*</span>`
                    : html`<span style="display:inline-block; margin-left:-6px;">${label}</span>`
                }
              </div>
              <div class='td key-type'>${(data['::type'] || '').includes('xxx-of') ? '' : data['::type']}</div>
              <div class='td key-descr m-markdown-small' style='line-height:1.7'>${unsafeHTML(marked(description || ''))}</div>
            </div>`
          : ''
        }
        <div class='object-body'>
          ${Object.keys(data).map((dataKey) => html`
            ${['::description', '::type', '::props'].includes(dataKey)
              ? ''
              : html`${this.generateTree(
                data[dataKey]['::type'] === 'array' ? data[dataKey]['::props'] : data[dataKey],
                data[dataKey]['::type'],
                dataKey,
                data[dataKey]['::description'],
                (level + 1),
              )}`
            }
          `)}
        <div>
      `;
    }

    // For Primitive Data types
    const itemParts = data.split('~|~');
    const dataTypeCss = itemParts[0].replace('{', '').substring(0, 4).toLowerCase();
    return html`
      <div class = "tr primitive">
        <div class='td key' style='padding-left:${leftPadding}px' >
          ${label?.endsWith('*')
            ? html`${label.substring(0, label.length - 1)}<span style='color:var(--red);'>*</span>`
            : key.startsWith('::OPTION')
              ? html`<span class='xxx-of-key'>${optionNumber}</span><span class="xxx-of-descr">${label}</span>`
              : html`${label || html`<span class="xxx-of-descr">${itemParts[7]}</span>`}`
          }
        </div>
        <div class='td key-type ${dataTypeCss}'>
          ${dataType === 'array' ? `[${itemParts[0]}]` : itemParts[0]} 
          <span style="font-family: var(--font-mono);">${itemParts[1]} </span> </div>
        <div class='td key-descr'>
          ${dataType === 'array' ? description : ''}
          ${itemParts[2] ? html`<div style='color: var(--fg2); padding-bottom:3px;'>${itemParts[4]}</div>` : ''}
          ${itemParts[3] ? html`<div style='color: var(--fg2); padding-bottom:3px;' ><span class='bold-text'>Default:</span> ${itemParts[3]}</div>` : ''}
          ${itemParts[4] ? html`<div style='color: var(--fg2); padding-bottom:3px;'><span class='bold-text'>Allowed: </span> &nbsp; ${itemParts[4]}</div>` : ''}
          ${itemParts[5] ? html`<div style='color: var(--fg2); padding-bottom:3px;'><span class='bold-text'>Pattern:</span>  &nbsp; ${itemParts[5]}</div>` : ''}
          ${itemParts[6] ? html`<span class="m-markdown-small">${unsafeHTML(marked(itemParts[6]))}</span>` : ''}
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
      e.target.innerText = '+';
    } else {
      rowEl.classList.remove('collapsed');
      rowEl.classList.add('expanded');
      e.target.innerText = '-';
    }
  }
}
customElements.define('schema-table', SchemaTable);
