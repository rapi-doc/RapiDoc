import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import FontStyles from '../styles/font-styles.js';
import SchemaStyles from '../styles/schema-styles.js';
import CustomStyles from '../styles/custom-styles.js';
import SchemaBaseElement from './schema-base-element';

@customElement('schema-table')
export default class SchemaTable extends SchemaBaseElement {
  static get styles() {
    return [
      FontStyles,
      SchemaStyles,
      css`
        .table {
          font-size: var(--font-size-small);
          text-align: left;
          line-height: calc(var(--font-size-small) + 6px);

          & .table-container {
            border: 1px solid var(--border);
            overflow-x: auto;
            max-width: 100%;
          }
          & .table-header {
            display: flex;
            background: var(--card);
            padding: 8px 4px;
            border-bottom: 1px solid var(--border);

            & .td {
              font-family: var(--font-sans);
              font-weight: bold;
              color: var(--foreground);
            }
          }
          & .tr {
            width: calc(100% - 5px);
            padding: 0 0 0 5px;
            border-bottom: 1px dotted var(--border);

            &.expanded {
              & .obj-toggle::after {
                content: '-';
              }
              & + .object-body {
                display: block;
              }
            }
            &.collapsed {
              & .obj-toggle::after {
                content: '+';
              }
              & + .object-body {
                display: none;
              }
            }
          }
          & .td {
            padding: 4px 0;
          }
          & .key {
            width: var(--table-schema-key-width);
            text-overflow: var(--table-schema-key-text-overflow);
            white-space: var(--table-schema-key-whitespace);
            overflow: hidden;

            & .key-label {
              font-size: var(--font-size-mono);
            }
            &.deprecated .key-label {
              color: var(--destructive);
            }
          }
          & .key-type {
            white-space: normal;
            width: 150px;
          }
          &.collapsed-all-descr .tr:not(.expanded-descr) {
            overflow: hidden;
            max-height: calc(var(--font-size-small) + 16px);
          }
        }

        .obj-toggle {
          background: transparent;
          border: 1px solid transparent;
          padding: 0;
          border-radius: 2px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-left: -16px;
          margin-top: -2px;
          color: var(--primary);
          cursor: pointer;
          font-size: 14px;
          font-family: var(--font-mono);
          line-height: 12px;
          width: 14px;
          height: 14px;
          min-width: 14px;
          text-align: center;
          user-select: none;
          box-sizing: border-box;
          vertical-align: middle;

          &:hover {
            border-color: var(--primary);
          }
          &:focus-visible {
            outline: 2px solid var(--primary);
            border-color: var(--primary);
          }
        }

        @supports (grid-template-columns: subgrid) {
          .table {
            & .table-container {
              display: grid;
              grid-template-columns: minmax(var(--table-schema-key-width), auto) minmax(150px, auto) 1fr;
            }
            & .table-header,
            & .tr {
              display: grid;
              grid-column: 1 / -1;
              grid-template-columns: subgrid;
              width: 100%;
              padding: 0 4px;
              box-sizing: border-box;

              & .key,
              & .key-type {
                width: auto;
              }
              & .key-descr {
                min-width: 0;
              }
            }
            & .object-body {
              display: contents;
            }
            & .tr.collapsed + .object-body {
              display: none;
            }
            & .tr.expanded + .object-body {
              display: contents;
            }
          }
        }
      `,
      CustomStyles,
    ];
  }

  render() {
    if (!this.data) {
      return '';
    }

    const rootType = this.data.kind === 'primitive' ? this.data.type : this.data.kind || '';
    const rootDescription = this.data.description || '';

    return html`
      <div
        class="table ${this.schemaDescriptionExpanded === 'true' ? 'expanded-all-descr' : 'collapsed-all-descr'}"
        @click="${(e) => this.handleAllEvents(e)}"
        @keydown="${(e) => this.handleKeyDown(e)}"
      >
        ${this.renderToolbar(rootType)}
        <span part="schema-description" class="m-markdown"> ${this.renderDescriptionHtml(rootDescription)} </span>
        <div class="table-container">
          <div class="tr table-header">
            <div class="td key">Field</div>
            <div class="td key-type">Type</div>
            <div class="td key-descr">Description</div>
          </div>
          ${this.renderAST(this.data)}
        </div>
      </div>
    `;
  }

  renderAST(node, parentType = '', schemaLevel = 0, indentLevel = 0) {
    if (this.isFieldHidden(node)) {
      return '';
    }

    const leftPadding = 16 * (indentLevel + 1);
    const isExpanded = schemaLevel < this.schemaExpandLevel;
    const nullClass = node.nullable ? 'nullable' : '';
    const deprecatedIcon = this.renderDeprecatedIcon(node);
    const readWriteBadge = this.getReadWriteBadge(node);
    const readWriteTip = this.getReadWriteTip(node);

    // 1. Array kind
    if (node.kind === 'array') {
      const items = node.items;
      if (!items) {
        const typeLabel = node.dataTypeLabel || (node.nullable ? 'array ┃ null' : 'array');
        return html`
          <div class="tr array ${nullClass}" data-obj="${node.name || ''}">
            <div class="td key" style="padding-left:${leftPadding}px">
              <span class="key-label" title="${node.name || ''}">${deprecatedIcon}${node.name || ''}</span>
              ${node.required ? html`<span style="color:var(--destructive);">*</span>` : ''}
            </div>
            <div class="td key-type" title="${readWriteTip}">${typeLabel}${readWriteBadge}</div>
            ${this.renderDescrCell(node.description)}
          </div>
        `;
      }

      if (items.kind === 'primitive') {
        const itemType = items.format || items.contentMediaType || items.type || 'string';
        const dataTypeCss = this.getDataTypeCss(itemType);

        return html`
          <div class="tr primitive ${nullClass}" title="${node.deprecated || items.deprecated ? 'Deprecated' : ''}">
            <div class="td key ${node.deprecated || items.deprecated ? 'deprecated' : ''}" style="padding-left:${leftPadding}px">
              ${deprecatedIcon} ${node.name ? html`<span class="key-label" title="${node.name}">${node.name}</span>` : ''}
              ${node.required ? html`<span style="color:var(--destructive);">*</span>` : ''}
            </div>
            <div class="td key-type ${dataTypeCss}" title="${readWriteTip}">
              [${itemType}]${node.nullable ? ' ┃ null' : ''}${readWriteBadge}
            </div>
            ${this.renderDescrCell(node.description || items.description, items)}
          </div>
        `;
      }

      let arrLabel = 'array';
      if (items.kind === 'object') {
        arrLabel = 'array of object';
      } else if (items.kind === 'array') {
        arrLabel = `array of array ${node.arrayType ? `of ${node.arrayType}` : ''}`.trim();
      } else if (items.kind === 'union') {
        arrLabel = 'array of union';
      }
      if (node.nullable) {
        arrLabel += ' ┃ null';
      }

      const hasChildren =
        items.kind === 'object'
          ? !!(
              (items.properties && items.properties.length > 0) ||
              (items.patternProperties && items.patternProperties.length > 0) ||
              items.additionalProperties ||
              (items.unions && items.unions.length > 0)
            )
          : true;

      return html`
        <div
          class="tr ${isExpanded ? 'expanded' : 'collapsed'} array ${nullClass}"
          data-obj="${node.name || ''}"
          title="${node.deprecated ? `Deprecated ${node.name}` : node.name || ''}"
        >
          <div class="td key ${node.deprecated ? 'deprecated' : ''}" style="padding-left:${leftPadding}px">
            ${
              node.name && hasChildren
                ? html`<button
                    type="button"
                    class="obj-toggle"
                    data-obj="${node.name}"
                    aria-label="Toggle ${node.name}"
                    aria-expanded="${isExpanded ? 'true' : 'false'}"
                  ></button>`
                : ''
            }
            <span class="key-label" title="${node.name || ''}" style="display:inline-block; ${hasChildren ? 'margin-left:-6px;' : ''}">
              ${deprecatedIcon}${node.name || ''}
            </span>
            ${node.required ? html`<span style="color:var(--destructive);">*</span>` : ''}
          </div>
          <div class="td key-type" title="${readWriteTip}">${arrLabel}${readWriteBadge}</div>
          ${this.renderDescrCell(node.description || items.description)}
        </div>
        ${
          hasChildren
            ? html`
                <div class="object-body">
                  ${
                    items.kind === 'object'
                      ? html`
                          ${items.properties?.map((p) => this.renderAST(p, 'object', schemaLevel + 1, indentLevel + 1))}
                          ${items.patternProperties?.map((p) => this.renderAST(p, 'object', schemaLevel + 1, indentLevel + 1))}
                          ${items.additionalProperties ? this.renderAST(items.additionalProperties, 'object', schemaLevel + 1, indentLevel + 1) : ''}
                          ${items.unions?.map((u) => this.renderAST(u, 'object', schemaLevel + 1, indentLevel + 1))}
                        `
                      : this.renderAST(items, 'array', schemaLevel + 1, indentLevel + 1)
                  }
                </div>
              `
            : ''
        }
      `;
    }

    // 2. Object kind
    if (node.kind === 'object') {
      const typeLabel = node.dataTypeLabel || (node.nullable ? 'object ┃ null' : 'object');

      const hasChildren = !!(
        (node.properties && node.properties.length > 0) ||
        (node.patternProperties && node.patternProperties.length > 0) ||
        node.additionalProperties ||
        (node.unions && node.unions.length > 0)
      );

      return html`
        ${
          node.name
            ? html`
                <div
                  class="tr ${isExpanded ? 'expanded' : 'collapsed'} object ${nullClass}"
                  data-obj="${node.name}"
                  title="${node.deprecated ? `Deprecated ${node.name}` : node.name}"
                >
                  <div class="td key ${node.deprecated ? 'deprecated' : ''}" style="padding-left:${leftPadding}px">
                    ${
                      hasChildren
                        ? html`<button
                            type="button"
                            class="obj-toggle"
                            data-obj="${node.name}"
                            aria-label="Toggle ${node.name}"
                            aria-expanded="${isExpanded ? 'true' : 'false'}"
                          ></button>`
                        : ''
                    }
                    <span
                      class="key-label"
                      title="${node.name || ''}"
                      style="display:inline-block; ${hasChildren ? 'margin-left:-6px;' : ''}"
                    >
                      ${deprecatedIcon}${node.name}
                    </span>
                    ${node.required ? html`<span style="color:var(--destructive);">*</span>` : ''}
                  </div>
                  <div class="td key-type" title="${readWriteTip}">${typeLabel}${readWriteBadge}</div>
                  ${this.renderDescrCell(node.description)}
                </div>
              `
            : ''
        }
        ${
          hasChildren
            ? html`
                <div class="object-body">
                  ${node.properties?.map((p) => this.renderAST(p, 'object', schemaLevel + 1, indentLevel + (node.name ? 1 : 0)))}
                  ${node.patternProperties?.map((p) => this.renderAST(p, 'object', schemaLevel + 1, indentLevel + (node.name ? 1 : 0)))}
                  ${node.additionalProperties ? this.renderAST(node.additionalProperties, 'object', schemaLevel + 1, indentLevel + (node.name ? 1 : 0)) : ''}
                  ${node.unions?.map((u) => this.renderAST(u, 'object', schemaLevel + 1, indentLevel + (node.name ? 1 : 0)))}
                </div>
              `
            : ''
        }
      `;
    }

    // 3. Union kind (oneOf / anyOf)
    if (node.kind === 'union') {
      const opLabel = (node.operator === 'anyOf' ? 'ANY OF' : 'ONE OF') + (node.suffix ? ` ${node.suffix}` : '');

      return html`
        ${node.properties?.map((p) => this.renderAST(p, 'object', schemaLevel, indentLevel))}
        <div class="tr expanded xxx-of" data-obj="${opLabel}">
          <div class="td key" style="padding-left:${leftPadding}px">
            <span class="xxx-of-key" style="margin-left:-6px">${opLabel}</span>
          </div>
          <div class="td key-type"></div>
          ${this.renderDescrCell(node.description)}
        </div>
        <div class="object-body">
          ${node.options?.map(
            (opt, i) => html`
              <div class="tr expanded xxx-of-option" data-obj="OPTION ${opt.optionIndex || i + 1}">
                <div class="td key" style="padding-left:${leftPadding + 16}px">
                  <span class="xxx-of-key">OPT ${opt.optionIndex || i + 1}</span>
                  ${opt.optionTitle ? html`<span class="xxx-of-descr">${opt.optionTitle}</span>` : ''}
                </div>
                <div class="td key-type"></div>
                <div class="td key-descr"></div>
              </div>
              <div class="object-body">${this.renderAST(opt, 'xxx-of-option', schemaLevel + 1, indentLevel + 1)}</div>
            `
          )}
        </div>
      `;
    }

    // 4. Primitive kind
    if (node.kind === 'primitive') {
      const dataTypeCss = this.getDataTypeCss(node.type);

      return html`
        <div class="tr primitive ${nullClass}" title="${node.deprecated ? 'Deprecated' : ''}">
          <div class="td key ${node.deprecated ? 'deprecated' : ''}" style="padding-left:${leftPadding}px">
            ${deprecatedIcon} ${node.name ? html`<span class="key-label" title="${node.name}">${node.name}</span>` : ''}
            ${node.required ? html`<span style="color:var(--destructive);">*</span>` : ''}
          </div>
          <div class="td key-type ${dataTypeCss}" title="${readWriteTip}">
            ${parentType === 'array' ? `[${node.type}]` : node.type}${readWriteBadge}
          </div>
          ${this.renderDescrCell(node.description, node, node.title)}
        </div>
      `;
    }

    return '';
  }
}
