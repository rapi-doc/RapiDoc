import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import FontStyles from '../styles/font-styles.js';
import SchemaStyles from '../styles/schema-styles.js';
import BorderStyles from '../styles/border-styles.js';
import CustomStyles from '../styles/custom-styles.js';
import SchemaBaseElement from './schema-base-element';

@customElement('schema-tree')
export default class SchemaTree extends SchemaBaseElement {
  static get styles() {
    return [
      FontStyles,
      SchemaStyles,
      BorderStyles,
      css`
        .tree {
          font-size: var(--font-size-small);
          text-align: left;
          direction: ltr;
          line-height: calc(var(--font-size-small) + 6px);

          & .tr:hover {
            background-color: rgba(0, 0, 0, 0.15);
          }
          & .tr.expanded-descr {
            max-height: none;
          }
          /* faint separators where descriptions wrap: every row in multiline mode, or around a row expanded by click */
          &.expanded-all-descr .tr,
          &.collapsed-all-descr .tr.expanded-descr {
            border-bottom: 1px solid color-mix(in srgb, var(--border) 60%, transparent);
          }
          &.collapsed-all-descr .tr.expanded-descr {
            box-shadow: 0 -1px 0 color-mix(in srgb, var(--border) 60%, transparent);
          }
          & .key {
            max-width: 300px;
          }
          &.collapsed-all-descr .tr:not(.expanded-descr) {
            overflow: hidden;
            max-height: calc(var(--font-size-small) + 8px);

            & .key {
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
        }

        .tr {
          &.expanded {
            &:hover {
              & > .td.key > .open-bracket,
              & + .inside-bracket + .close-bracket {
                color: var(--primary);
              }
              & + .inside-bracket {
                border-left: 1px solid var(--muted-foreground);
              }
            }
            & .open-bracket .open-bracket-collapsed {
              display: none;
            }
          }
          &.collapsed {
            & + .inside-bracket,
            & + .inside-bracket + .close-bracket {
              overflow: hidden;
              display: none;
            }
            & .open-bracket .open-bracket-expanded {
              display: none;
            }
          }
        }

        .inside-bracket {
          &.xxx-of-option {
            border-left: 1px solid transparent;
          }
          &.object,
          &.array {
            border-left: 1px dotted var(--border);
          }
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
          &:focus-visible {
            outline: 2px solid var(--primary);
            border-color: var(--primary);
          }
        }

        .close-bracket {
          display: inline-block;
          font-family: var(--font-mono);
        }
      `,
      CustomStyles,
    ];
  }

  render() {
    if (!this.data) {
      return html`
        <div class="tree">
          <span class="mono-font" style="color:var(--destructive)"> Schema not found </span>
        </div>
      `;
    }

    const rootType = this.data.kind === 'primitive' ? this.data.type : this.data.kind || '';
    const rootDescription = this.data.description || '';

    return html` <div
      class="tree ${this.schemaDescriptionExpanded === 'true' ? 'expanded-all-descr' : 'collapsed-all-descr'}"
      @click="${(e) => this.handleAllEvents(e)}"
      @keydown="${(e) => this.handleKeyDown(e)}"
    >
      ${this.renderToolbar(rootType)}
      <span part="schema-description" class="m-markdown"> ${this.renderDescriptionHtml(rootDescription)}</span>
      ${this.renderAST(this.data)}
    </div>`;
  }

  renderAST(node, parentType = '', schemaLevel = 0, indentLevel = 0) {
    if (this.isFieldHidden(node)) {
      return '';
    }

    const leftPadding = 12;
    const minFieldColWidth = 400 - indentLevel * leftPadding;
    const isExpanded = schemaLevel < this.schemaExpandLevel;
    const readWriteBadge = this.getReadWriteBadge(node);
    const readWriteTip = this.getReadWriteTip(node);
    const nullMarker = node.nullable ? 'null┃' : '';
    const nullClass = node.nullable ? 'nullable' : '';
    const deprecatedIcon = this.renderDeprecatedIcon(node);

    // 1. Array kind
    if (node.kind === 'array') {
      const items = node.items;
      if (!items) {
        const fieldTitle = node.name ? `${node.name}${readWriteTip ? ` (${readWriteTip})` : ''}` : '';
        return html`
          <div class="tr ${isExpanded ? 'expanded' : 'collapsed'} array ${nullClass}" title="${node.deprecated ? 'Deprecated' : ''}">
            <div class="td key ${node.deprecated ? 'deprecated' : ''}" style="min-width:${minFieldColWidth}px">
              ${deprecatedIcon}
              ${node.name ? html`<span class="key-label" title="${fieldTitle}">${node.name}${node.required ? html`<span style="color:var(--destructive)">*</span>` : ''}${readWriteBadge}:</span>` : ''}
              <span class="open-bracket array">${nullMarker}[ ]</span>
            </div>
            ${this.renderDescrCell(node.description)}
          </div>
        `;
      }

      // If array of primitives
      if (items.kind === 'primitive') {
        const itemType = items.format || items.contentMediaType || items.type || 'string';
        const dataTypeCss = this.getDataTypeCss(itemType);
        const fieldTitle = node.name ? `${node.name}${readWriteTip ? ` (${readWriteTip})` : ''}` : '';

        return html`
          <div class="tr primitive ${nullClass}" title="${node.deprecated || items.deprecated ? 'Deprecated' : ''}">
            <div class="td key ${node.deprecated || items.deprecated ? 'deprecated' : ''}" style="min-width:${minFieldColWidth}px">
              ${deprecatedIcon}
              ${node.name ? html`<span class="key-label" title="${fieldTitle}">${node.name}${node.required ? html`<span style="color:var(--destructive)">*</span>` : ''}:</span>` : ''}
              <span class="${dataTypeCss}" title="${readWriteTip}">${nullMarker}[${itemType}]${readWriteBadge}</span>
            </div>
            ${this.renderDescrCell(node.description || items.description, items)}
          </div>
        `;
      }

      // If array of objects
      if (items.kind === 'object') {
        const openBracket = html`<span
          class="open-bracket array-of-object"
          role="button"
          tabindex="0"
          aria-label="Toggle ${node.name || 'object'}"
          aria-expanded="${isExpanded ? 'true' : 'false'}"
          >${nullMarker}<span class="open-bracket-expanded">[{</span><span class="open-bracket-collapsed">[{...}]</span></span
        >`;
        const closeBracket = '}]';
        const fieldTitle = node.name ? `${node.name}${readWriteTip ? ` (${readWriteTip})` : ''}` : '';

        return html`
          <div
            class="tr ${isExpanded ? 'expanded' : 'collapsed'} object ${nullClass}"
            title="${node.deprecated || items.deprecated ? 'Deprecated' : ''}"
          >
            <div class="td key ${node.deprecated || items.deprecated ? 'deprecated' : ''}" style="min-width:${minFieldColWidth}px">
              ${deprecatedIcon}
              ${node.name ? html`<span class="key-label" title="${fieldTitle}">${node.name}${node.required ? html`<span style="color:var(--destructive)">*</span>` : ''}${readWriteBadge}:</span>` : ''}
              ${openBracket}
            </div>
            ${this.renderDescrCell(node.description || items.description)}
          </div>
          <div class="inside-bracket object" style="padding-left:${leftPadding}px;">
            ${items.properties?.map((p) => this.renderAST(p, 'object', schemaLevel + 1, indentLevel + 1))}
            ${items.patternProperties?.map((p) => this.renderAST(p, 'object', schemaLevel + 1, indentLevel + 1))}
            ${items.additionalProperties ? this.renderAST(items.additionalProperties, 'object', schemaLevel + 1, indentLevel + 1) : ''}
            ${items.unions?.map((u) => this.renderAST(u, 'object', schemaLevel + 1, indentLevel + 1))}
          </div>
          <div class="close-bracket">${closeBracket}</div>
        `;
      }

      // If array of arrays
      if (items.kind === 'array') {
        const arrType = node.arrayType !== 'object' ? node.arrayType : '';
        const openBracket = html`<span
          class="open-bracket array-of-array"
          data-array-type="${arrType}"
          role="button"
          tabindex="0"
          aria-label="Toggle ${node.name || 'array'}"
          aria-expanded="${isExpanded ? 'true' : 'false'}"
          >${nullMarker}<span class="open-bracket-expanded">[[ ${arrType} </span><span class="open-bracket-collapsed">[[...]]</span></span
        >`;
        const closeBracket = ']]';
        const fieldTitle = node.name ? `${node.name}${readWriteTip ? ` (${readWriteTip})` : ''}` : '';

        return html`
          <div class="tr ${isExpanded ? 'expanded' : 'collapsed'} array ${nullClass}" title="${node.deprecated ? 'Deprecated' : ''}">
            <div class="td key ${node.deprecated ? 'deprecated' : ''}" style="min-width:${minFieldColWidth}px">
              ${deprecatedIcon}
              ${node.name ? html`<span class="key-label" title="${fieldTitle}">${node.name}${node.required ? html`<span style="color:var(--destructive)">*</span>` : ''}${readWriteBadge}:</span>` : ''}
              ${openBracket}
            </div>
            ${this.renderDescrCell(node.description)}
          </div>
          <div class="inside-bracket array" style="padding-left:${leftPadding}px;">
            ${this.renderAST(items, 'array', schemaLevel + 1, indentLevel + 1)}
          </div>
          <div class="close-bracket">${closeBracket}</div>
        `;
      }

      // If array of unions or others
      const fieldTitle = node.name ? `${node.name}${readWriteTip ? ` (${readWriteTip})` : ''}` : '';
      return html`
        <div class="tr ${isExpanded ? 'expanded' : 'collapsed'} array ${nullClass}" title="${node.deprecated ? 'Deprecated' : ''}">
          <div class="td key ${node.deprecated ? 'deprecated' : ''}" style="min-width:${minFieldColWidth}px">
            ${deprecatedIcon}
            ${node.name ? html`<span class="key-label" title="${fieldTitle}">${node.name}${node.required ? html`<span style="color:var(--destructive)">*</span>` : ''}${readWriteBadge}:</span>` : ''}
            <span
              class="open-bracket array"
              role="button"
              tabindex="0"
              aria-label="Toggle ${node.name || 'array'}"
              aria-expanded="${isExpanded ? 'true' : 'false'}"
              >${nullMarker}<span class="open-bracket-expanded">[</span><span class="open-bracket-collapsed">[...]</span></span
            >
          </div>
          ${this.renderDescrCell(node.description)}
        </div>
        <div class="inside-bracket array" style="padding-left:${leftPadding}px;">
          ${this.renderAST(items, 'array', schemaLevel + 1, indentLevel + 1)}
        </div>
        <div class="close-bracket">]</div>
      `;
    }

    // 2. Object kind
    if (node.kind === 'object') {
      const openBracket = html`<span
        class="open-bracket object"
        role="button"
        tabindex="0"
        aria-label="Toggle ${node.name || 'object'}"
        aria-expanded="${isExpanded ? 'true' : 'false'}"
        >${nullMarker}<span class="open-bracket-expanded">{</span><span class="open-bracket-collapsed">{...}</span></span
      >`;
      const closeBracket = '}';
      const fieldTitle = node.name ? `${node.name}${readWriteTip ? ` (${readWriteTip})` : ''}` : '';

      return html`
        <div class="tr ${isExpanded ? 'expanded' : 'collapsed'} object ${nullClass}" title="${node.deprecated ? 'Deprecated' : ''}">
          <div class="td key ${node.deprecated ? 'deprecated' : ''}" style="min-width:${minFieldColWidth}px">
            ${deprecatedIcon}
            ${node.name ? html`<span class="key-label" title="${fieldTitle}">${node.name}${node.required ? html`<span style="color:var(--destructive)">*</span>` : ''}${readWriteBadge}:</span>` : ''}
            ${openBracket}
          </div>
          ${this.renderDescrCell(node.description)}
        </div>
        <div class="inside-bracket object" style="padding-left:${leftPadding}px;">
          ${node.properties?.map((p) => this.renderAST(p, 'object', schemaLevel + 1, indentLevel + 1))}
          ${node.patternProperties?.map((p) => this.renderAST(p, 'object', schemaLevel + 1, indentLevel + 1))}
          ${node.additionalProperties ? this.renderAST(node.additionalProperties, 'object', schemaLevel + 1, indentLevel + 1) : ''}
          ${node.unions?.map((u) => this.renderAST(u, 'object', schemaLevel + 1, indentLevel + 1))}
        </div>
        <div class="close-bracket">${closeBracket}</div>
      `;
    }

    // 3. Union kind (oneOf / anyOf)
    if (node.kind === 'union') {
      const opLabel = (node.operator === 'anyOf' ? 'ANY OF' : 'ONE OF') + (node.suffix ? ` ${node.suffix}` : '');
      const newIndent = parentType === 'xxx-of-option' ? indentLevel : indentLevel + 1;
      // Options are already labelled by their OPT row, so only property names are shown
      const showName = node.name && parentType !== 'xxx-of-option';
      // A named union puts its label and options one level inside the property row
      const bodyFieldColWidth = showName ? minFieldColWidth - leftPadding : minFieldColWidth;

      const unionBody = html`
        <div class="tr expanded xxx-of-option">
          <div class="td key" style="min-width:${bodyFieldColWidth}px">
            <span class="key-label xxx-of-key">${opLabel}</span>
          </div>
          ${showName ? '' : this.renderDescrCell(node.description)}
        </div>
        <div class="inside-bracket xxx-of-option" style="padding-left:0px;">
          ${node.options?.map(
            (opt, i) => html`
              <div>
                <div class="tr expanded xxx-of-option">
                  <div class="td key" style="min-width:${bodyFieldColWidth}px">
                    <span class="key-label xxx-of-key">OPT ${opt.optionIndex || i + 1}</span>
                    ${opt.optionTitle ? html`<span class="xxx-of-descr">${opt.optionTitle}</span>` : ''}
                  </div>
                </div>
                ${this.renderAST(opt, 'xxx-of-option', schemaLevel, newIndent)}
              </div>
            `
          )}
        </div>
      `;

      return html`
        ${node.properties?.map((p) => this.renderAST(p, 'object', schemaLevel, indentLevel))}
        ${
          showName
            ? html`
                <div class="tr expanded xxx-of-prop">
                  <div class="td key" style="min-width:${minFieldColWidth}px">
                    <span class="key-label" title="${node.name}"
                      >${node.name}${node.required ? html`<span style="color:var(--destructive)">*</span>` : ''}:</span
                    >
                  </div>
                  ${this.renderDescrCell(node.description)}
                </div>
                <div class="inside-bracket xxx-of-option" style="padding-left:${leftPadding}px;">${unionBody}</div>
              `
            : unionBody
        }
      `;
    }

    // 4. Primitive kind
    if (node.kind === 'primitive') {
      const dataTypeCss = this.getDataTypeCss(node.type);
      const fieldTitle = node.name ? `${node.name}${readWriteTip ? ` (${readWriteTip})` : ''}` : '';

      return html`
        <div class="tr primitive" title="${node.deprecated ? 'Deprecated' : ''}">
          <div class="td key ${node.deprecated ? 'deprecated' : ''}" style="min-width:${minFieldColWidth}px">
            ${deprecatedIcon}
            ${node.name ? html`<span class="key-label" title="${fieldTitle}">${node.name}${node.required ? html`<span style="color:var(--destructive);">*</span>` : ''}:</span>` : ''}
            <span class="${dataTypeCss}" title="${readWriteTip}">
              ${parentType === 'array' ? `[${node.type}]` : node.type}${readWriteBadge}
            </span>
          </div>
          ${this.renderDescrCell(node.description, node, node.title)}
        </div>
      `;
    }

    return '';
  }
}
