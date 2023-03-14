import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property} from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import { marked } from 'marked';
import FontStyles from '../styles/font-styles';
import SchemaStyles from '../styles/schema-styles';
import BorderStyles from '../styles/border-styles';
import CustomStyles from '../styles/custom-styles';
import { ObjectNotationSchema } from '../utils/schema-utils';

@customElement('schema-tree')
export default class SchemaTree extends LitElement {
  @property({ type: Object })
  public data?: ObjectNotationSchema;
  
  @property({ type: Number, attribute: 'schema-expand-level' })
  public schemaExpandLevel: number = 999;

  @property({ type: String, attribute: 'schema-description-expanded' })
  public schemaDescriptionExpanded?: string;
  
  @property({ type: String, attribute: 'allow-schema-description-expand-toggle' })
  public allowSchemaDescriptionExpandToggle?: string;
  
  @property({ type: String, attribute: 'schema-hide-read-only' })
  public schemaHideReadOnly?: string;
  
  @property({ type: String, attribute: 'schema-hide-write-only' })
  public schemaHideWriteOnly?: string;

  override connectedCallback() {
    super.connectedCallback();
    if (!this.schemaExpandLevel || this.schemaExpandLevel < 1) { this.schemaExpandLevel = 99999; }
    if (!this.schemaDescriptionExpanded || !'true false'.includes(this.schemaDescriptionExpanded)) { this.schemaDescriptionExpanded = 'false'; }
    if (!this.schemaHideReadOnly || !'true false'.includes(this.schemaHideReadOnly)) { this.schemaHideReadOnly = 'true'; }
    if (!this.schemaHideWriteOnly || !'true false'.includes(this.schemaHideWriteOnly)) { this.schemaHideWriteOnly = 'true'; }
  }

  static override get styles() {
    return [
      FontStyles,
      SchemaStyles,
      BorderStyles,
      css`
      .tree {
        font-size:var(--font-size-small);
        text-align: left;
        direction: ltr;
        line-height:calc(var(--font-size-small) + 6px);
      }
      .tree .tr:hover{
        background-color:var(--hover-color);
      }
      .collapsed-all-descr .tr:not(.expanded-descr) {
        overflow: hidden;
        max-height:calc(var(--font-size-small) + 8px);
      }
      .tree .key {
        max-width: 300px;
      }
      .key.deprecated .key-label {
        color: var(--red);
      }
      .tr.expanded:hover > .td.key > .open-bracket {
        color: var(--primary-color);
      }
      .tr.expanded:hover + .inside-bracket {
        border-left: 1px solid var(--fg3);
      }
      .tr.expanded:hover + .inside-bracket + .close-bracket {
        color: var(--primary-color);
      }
      .inside-bracket.xxx-of-option {
        border-left: 1px solid transparent;
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
        overflow: hidden;
        display:none;
      }
      .inside-bracket.object,
      .inside-bracket.array {
        border-left: 1px dotted var(--border-color);
      }`,
      CustomStyles,
    ];
  }

  /* eslint-disable indent */
  override render() {
    return html`
      <div class="tree ${this.schemaDescriptionExpanded === 'true' ? 'expanded-all-descr' : 'collapsed-all-descr'}" @click="${(e: MouseEvent) => this.handleAllEvents(e)}">
        <div class="toolbar">
          <div class="toolbar-item schema-root-type ${this.data?.['::type'] || ''} "> ${this.data?.['::type'] || ''} </div>
          ${this.allowSchemaDescriptionExpandToggle === 'true'
            ? html`
              <div style="flex:1"></div>
              <div part="schema-toolbar-item schema-multiline-toggle" class='toolbar-item schema-multiline-toggle'> 
                ${this.schemaDescriptionExpanded === 'true' ? 'Single line description' : 'Multiline description'}
              </div>`
            : ''
          }
        </div>
        <span part="schema-description" class='m-markdown'> ${unsafeHTML(marked((this.data && '::description' in this.data) ? (this.data['::description'] as string) : ''))}</span>
        ${this.data
          ? html`
            ${this.generateTree(
              (this.data['::type'] === 'array' ? this.data['::props'] : this.data) as ObjectNotationSchema,
              this.data['::type'],
              (this.data['::type'] === 'array' ? this.data['::array-type'] : '') as string,
            )}`
          : html`<span class='mono-font' style='color:var(--red)'> Schema not found </span>`
        }
      </div>  
    `;
  }

  generateTree(data: ObjectNotationSchema, dataType = 'object', arrayType = '', key = '', description = '', schemaLevel = 0, indentLevel = 0, readOrWrite = ''): TemplateResult<any> | undefined {
    if (this.schemaHideReadOnly === 'true') {
      if (dataType === 'array') {
        if (readOrWrite === 'readonly') {
          return;
        }
      }
      if (data?.['::readwrite'] === 'readonly') {
        return;
      }
    }
    if (this.schemaHideWriteOnly === 'true') {
      if (dataType === 'array') {
        if (readOrWrite === 'writeonly') {
          return;
        }
      }
      if (data?.['::readwrite'] === 'writeonly') {
        return;
      }
    }

    if (!data) {
      return html`<div class="null" style="display:inline;">
        <span class="key-label xxx-of-key"> ${key.replace('::OPTION~', '')}</span>
        ${
          dataType === 'array'
            ? html`<span class='mono-font'> [ ] </span>`
            : dataType === 'object'
              ? html`<span class='mono-font'> { } </span>`
              : html`<span class='mono-font'> schema undefined </span>`
        }
      </div>`;
    }
    if (Object.keys(data).length === 0) {
      return html`<span class="key object">${key}:{ }</span>`;
    }
    let keyLabel = '';
    let keyDescr = '';
    if (key.startsWith('::ONE~OF') || key.startsWith('::ANY~OF')) {
      keyLabel = key.replace('::', '').replace('~', ' ');
    } else if (key.startsWith('::OPTION')) {
      const parts = key.split('~');
      [, keyLabel, keyDescr] = parts;
    } else {
      keyLabel = key;
    }

    const leftPadding = 12;
    const minFieldColWidth = 400 - (indentLevel * leftPadding);
    let openBracket: TemplateResult<any> = html``;
    let closeBracket = '';
    const newSchemaLevel = data['::type']?.startsWith('xxx-of') ? schemaLevel : (schemaLevel + 1);
    // const newIndentLevel = dataType === 'xxx-of-option' || data['::type'] === 'xxx-of-option' ? indentLevel : (indentLevel + 1);
    const newIndentLevel = dataType === 'xxx-of-option' || data['::type'] === 'xxx-of-option' || key.startsWith('::OPTION') ? indentLevel : (indentLevel + 1);
    if (data['::type'] === 'object') {
      if (dataType === 'array') {
        if (schemaLevel < this.schemaExpandLevel) {
          openBracket = html`<span class="open-bracket array-of-object" >[{</span>`;
        } else {
          openBracket = html`<span class="open-bracket array-of-object">[{...}]</span>`;
        }
        closeBracket = '}]';
      } else {
        if (schemaLevel < this.schemaExpandLevel) {
          openBracket = html`<span class="open-bracket object">${data['::nullable'] ? 'null┃' : ''}{</span>`;
        } else {
          openBracket = html`<span class="open-bracket object">${data['::nullable'] ? 'null┃' : ''}{...}</span>`;
        }
        closeBracket = '}';
      }
    } else if (data['::type'] === 'array') {
      if (dataType === 'array') {
        const arrType = arrayType !== 'object' ? arrayType : '';
        if (schemaLevel < this.schemaExpandLevel) {
          openBracket = html`<span class="open-bracket array-of-array" data-array-type="${arrType}">[[ ${arrType} </span>`;
        } else {
          openBracket = html`<span class="open-bracket array-of-array"  data-array-type="${arrType}">[[...]]</span>`;
        }
        closeBracket = ']]';
      } else {
        if (schemaLevel < this.schemaExpandLevel) {
          openBracket = html`<span class="open-bracket array">[</span>`;
        } else {
          openBracket = html`<span class="open-bracket array">[...]</span>`;
        }
        closeBracket = ']';
      }
    }
    if (typeof data === 'object') {
      return html`
        <div class="tr ${schemaLevel < this.schemaExpandLevel || data['::type']?.startsWith('xxx-of') ? 'expanded' : 'collapsed'} ${data['::type'] || 'no-type-info'}" title="${data['::deprecated'] ? 'Deprecated' : ''}">
          <div class="td key ${data['::deprecated'] ? 'deprecated' : ''}" style='min-width:${minFieldColWidth}px'>
            ${data['::type'] === 'xxx-of-option' || data['::type'] === 'xxx-of-array' || key.startsWith('::OPTION')
              ? html`<span class='key-label xxx-of-key'> ${keyLabel}</span><span class="xxx-of-descr">${keyDescr}</span>`
              : keyLabel === '::props' || keyLabel === '::ARRAY~OF'
                ? ''
                : schemaLevel > 0
                  ? html`<span class="key-label" title="${readOrWrite === 'readonly' ? 'Read-Only' : readOrWrite === 'writeonly' ? 'Write-Only' : ''}">
                      ${data['::deprecated'] ? '✗' : ''}
                      ${keyLabel.replace(/\*$/, '')}${keyLabel.endsWith('*') ? html`<span style="color:var(--red)">*</span>` : ''}${readOrWrite === 'readonly' ? html` 🆁` : readOrWrite === 'writeonly' ? html` 🆆` : readOrWrite}:
                    </span>`
                  : ''
            }
            ${openBracket}
          </div>
          <div class='td key-descr m-markdown-small'>${unsafeHTML(marked(description || ''))}</div>
        </div>
        <div class='inside-bracket ${data['::type'] || 'no-type-info'}' style='padding-left:${data['::type'] === 'xxx-of-option' || data['::type'] === 'xxx-of-array' ? 0 : leftPadding}px;'>
          ${Array.isArray(data) && data[0]
            ? html`${this.generateTree(data[0], 'xxx-of-option', '', '::ARRAY~OF', '', newSchemaLevel, newIndentLevel, data[0]['::readwrite'])}`
            : html`
              ${Object.keys(data).map((dataKey) => html`
                ${['::title', '::description', '::type', '::props', '::deprecated', '::array-type', '::readwrite', '::dataTypeLabel'].includes(dataKey)
                  ? (data[dataKey] as ObjectNotationSchema)['::type'] === 'array' || (data[dataKey] as ObjectNotationSchema)['::type'] === 'object'
                    ? html`${this.generateTree(
                      ((data[dataKey] as ObjectNotationSchema)['::type'] === 'array' ? (data[dataKey] as ObjectNotationSchema)['::props'] : (data[dataKey])) as ObjectNotationSchema,
                        (data[dataKey] as ObjectNotationSchema)['::type'],
                        ((data[dataKey] as ObjectNotationSchema)['::array-type'] || '') as string,
                        dataKey,
                        (data[dataKey] as ObjectNotationSchema)['::description'],
                        newSchemaLevel,
                        newIndentLevel,
                        (data[dataKey] as ObjectNotationSchema)['::readwrite'] ? (data[dataKey] as ObjectNotationSchema)['::readwrite'] : '',
                      )}`
                    : ''
                  : html`${this.generateTree(
                    ((data[dataKey] as ObjectNotationSchema)['::type'] === 'array' ? (data[dataKey] as ObjectNotationSchema)['::props'] : (data[dataKey])) as ObjectNotationSchema,
                    (data[dataKey] as ObjectNotationSchema)['::type'],
                    ((data[dataKey] as ObjectNotationSchema)['::array-type'] || '') as string,
                    dataKey,
                    (data[dataKey] as ObjectNotationSchema)?.['::description'] || '',
                    newSchemaLevel,
                    newIndentLevel,
                    (data[dataKey] as ObjectNotationSchema)['::readwrite'] ? (data[dataKey] as ObjectNotationSchema)['::readwrite'] : '',
                  )}`
                }
              `)}
            `
          }
        </div>
        ${data['::type'] && data['::type'].includes('xxx-of')
          ? ''
          : html`<div class='close-bracket'> ${closeBracket} </div>`
        }
      `;
    }

    // For Primitive types and array of Primitives
    // eslint-disable-next-line no-unused-vars
    const [type, primitiveReadOrWrite, constraint, defaultValue, allowedValues, pattern, schemaDescription, schemaTitle, deprecated] = (data as string).split('~|~');
    if (primitiveReadOrWrite === '🆁' && this.schemaHideReadOnly === 'true') {
      return;
    }
    if (primitiveReadOrWrite === '🆆' && this.schemaHideWriteOnly === 'true') {
      return;
    }
    const dataTypeCss = type.replace(/┃.*/g, '').replace(/[^a-zA-Z0-9+]/g, '').substring(0, 4).toLowerCase();
    const descrExpander = `${constraint || defaultValue || allowedValues || pattern ? `<span class="descr-expand-toggle ${this.schemaDescriptionExpanded === 'true' ? 'expanded-descr' : ''}">➔</span>` : ''}`;
    let finalReadWriteText = '';
    let finalReadWriteTip = '';
    if (dataType === 'array') {
      if (readOrWrite === 'readonly') {
        finalReadWriteText = '🆁';
        finalReadWriteTip = 'Read-Only';
      } else if (readOrWrite === 'writeonly') {
        finalReadWriteText = '🆆';
        finalReadWriteTip = 'Write-Only';
      }
    } else if (primitiveReadOrWrite === '🆁') {
      finalReadWriteText = '🆁';
      finalReadWriteTip = 'Read-Only';
    } else if (primitiveReadOrWrite === '🆆') {
      finalReadWriteText = '🆆';
      finalReadWriteTip = 'Write-Only';
    }

    return html`
      <div class = "tr primitive" title="${deprecated ? 'Deprecated' : ''}">
        <div class="td key ${deprecated}" style='min-width:${minFieldColWidth}px'>
          ${deprecated ? html`<span style='color:var(--red);'>✗</span>` : ''}
          ${keyLabel.endsWith('*')
            ? html`<span class="key-label">${keyLabel.substring(0, keyLabel.length - 1)}</span><span style='color:var(--red);'>*</span>:`
            : key.startsWith('::OPTION')
              ? html`<span class='key-label xxx-of-key'>${keyLabel}</span><span class="xxx-of-descr">${keyDescr}</span>`
              : html`<span class="key-label">${keyLabel}:</span>`
          }
          <span class="${dataTypeCss}" title="${finalReadWriteTip}"> 
            ${dataType === 'array' ? `[${type}]` : `${type}`}
            ${finalReadWriteText}
          </span>
        </div>
        <div class='td key-descr'>
          ${description || schemaTitle || schemaDescription
            ? html`${html`<span class="m-markdown-small">
                ${unsafeHTML(marked(dataType === 'array'
                  ? `${descrExpander} ${description}`
                  : schemaTitle
                    ? `${descrExpander} <b>${schemaTitle}:</b> ${schemaDescription}`
                    : `${descrExpander} ${schemaDescription}`))}
              </span>`
              }`
            : ''
          }  
          ${constraint ? html`<div style='display:inline-block; line-break:anywhere; margin-right:8px'><span class='bold-text'>Constraints: </span>${constraint}</div>` : ''}
          ${defaultValue ? html`<div style='display:inline-block; line-break:anywhere; margin-right:8px'><span class='bold-text'>Default: </span>${defaultValue}</div>` : ''}
          ${allowedValues ? html`<div style='display:inline-block; line-break:anywhere; margin-right:8px'><span class='bold-text'>${type === 'const' ? 'Value' : 'Allowed'}: </span>${allowedValues}</div>` : ''}
          ${pattern ? html`<div style='display:inline-block; line-break: anywhere; margin-right:8px'><span class='bold-text'>Pattern: </span>${pattern}</div>` : ''}
        </div>
      </div>
    `;
  }
  /* eslint-enable indent */

  handleAllEvents(e: MouseEvent) {
    const element = e.target as HTMLElement;
    if (element.classList.contains('open-bracket')) {
      this.toggleObjectExpand(e);
    } else if (element.classList.contains('schema-multiline-toggle')) {
      this.schemaDescriptionExpanded = (this.schemaDescriptionExpanded === 'true' ? 'false' : 'true');
    } else if (element.classList.contains('descr-expand-toggle')) {
      const trEl = element.closest('.tr') as HTMLElement;
      if (trEl) {
        trEl.classList.toggle('expanded-descr');
        trEl.style.maxHeight = `${trEl.scrollHeight}`;
      }
    }
  }

  toggleObjectExpand(e: MouseEvent) {
    const element = e.target as HTMLElement;
    const rowEl = element.closest('.tr') as HTMLElement;
    if (rowEl.classList.contains('expanded')) {
      rowEl.classList.replace('expanded', 'collapsed');
      element.innerHTML = element.classList.contains('array-of-object')
        ? '[{...}]'
        : element.classList.contains('array-of-array')
          ? '[[...]]'
          : element.classList.contains('array')
            ? '[...]'
            : '{...}';
    } else {
      rowEl.classList.replace('collapsed', 'expanded');
      element.innerHTML = element.classList.contains('array-of-object')
        ? '[{'
        : element.classList.contains('array-of-array')
          ? `[[ ${element.dataset.arrayType}`
          : element.classList.contains('object')
            ? '{'
            : '[';
    }
  }
}
