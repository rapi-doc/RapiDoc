import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { marked } from 'marked';
import { sanitizeHTML } from '../utils/sanitize.js';
import FontStyles from '~/styles/font-styles';
import SchemaStyles from '~/styles/schema-styles';
import CustomStyles from '~/styles/custom-styles';

function hasMultilineDescription(desc) {
  if (!desc || typeof desc !== 'string') {
    return false;
  }
  const cleaned = desc
    .trim()
    .replace(/<br\s*\/?>$/i, '')
    .trim();
  return cleaned.includes('<br') || cleaned.includes('\n');
}

export default class SchemaTable extends LitElement {
  static get properties() {
    return {
      config: { type: Object },
      schemaExpandLevel: { type: Number, attribute: 'schema-expand-level' },
      schemaDescriptionExpanded: { type: String, attribute: 'schema-description-expanded' },
      allowSchemaDescriptionExpandToggle: { type: String, attribute: 'allow-schema-description-expand-toggle' },
      schemaHideReadOnly: { type: String, attribute: 'schema-hide-read-only' },
      schemaHideWriteOnly: { type: String, attribute: 'schema-hide-write-only' },
      data: { type: Object },
    };
  }

  willUpdate(changedProperties) {
    super.willUpdate?.(changedProperties);
    if (this.config && changedProperties.has('config')) {
      if (this.config.schemaExpandLevel !== undefined) this.schemaExpandLevel = this.config.schemaExpandLevel;
      if (this.config.schemaDescriptionExpanded !== undefined) this.schemaDescriptionExpanded = this.config.schemaDescriptionExpanded;
      if (this.config.allowSchemaDescriptionExpandToggle !== undefined)
        this.allowSchemaDescriptionExpandToggle = this.config.allowSchemaDescriptionExpandToggle;
      if (this.config.schemaHideReadOnly !== undefined) this.schemaHideReadOnly = this.config.schemaHideReadOnly;
      if (this.config.schemaHideWriteOnly !== undefined) this.schemaHideWriteOnly = this.config.schemaHideWriteOnly;
    }
    if (!this.schemaExpandLevel || this.schemaExpandLevel < 1) {
      this.schemaExpandLevel = 99999;
    }
    if (!this.schemaDescriptionExpanded || !'true false'.includes(this.schemaDescriptionExpanded)) {
      this.schemaDescriptionExpanded = 'false';
    }
    if (!this.schemaHideReadOnly || !'true false'.includes(this.schemaHideReadOnly)) {
      this.schemaHideReadOnly = 'true';
    }
    if (!this.schemaHideWriteOnly || !'true false'.includes(this.schemaHideWriteOnly)) {
      this.schemaHideWriteOnly = 'true';
    }
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
          border-bottom: 1px dotted var(--border);
        }
        .table .td {
          padding: 4px 0;
        }
        .table .key {
          width: var(--table-schema-key-width, 240px);
          text-overflow: var(--table-schema-key-text-overflow, ellipsis);
          white-space: var(--table-schema-key-whitespace, nowrap);
        }
        .key .key-label {
          font-size: var(--font-size-mono);
        }
        .key.deprecated .key-label {
          color: var(--red);
        }

        .table .key-type {
          white-space: normal;
          width: 150px;
        }
        .collapsed-all-descr .tr:not(.expanded-descr) {
          overflow: hidden;
          max-height: calc(var(--font-size-small) + var(--font-size-small));
        }
        .table .tr.expanded-descr {
          max-height: none;
        }

        .obj-toggle {
          padding: 0 2px;
          border-radius: 2px;
          border: 1px solid transparent;
          display: inline-block;
          margin-left: -16px;
          color: var(--primary);
          cursor: pointer;
          font-size: calc(var(--font-size-small) + 4px);
          font-family: var(--font-mono);
          background-clip: border-box;
          min-width: 14px;
          text-align: center;
          user-select: none;
        }
        .obj-toggle:hover {
          border-color: var(--primary);
        }
        .tr.expanded .obj-toggle::after {
          content: '-';
        }
        .tr.collapsed .obj-toggle::after {
          content: '+';
        }
        .tr.expanded + .object-body {
          display: block;
        }
        .tr.collapsed + .object-body {
          display: none;
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
      >
        <div class="toolbar">
          <div class="toolbar-item schema-root-type ${rootType} ">${rootType}</div>
          ${
            this.allowSchemaDescriptionExpandToggle === 'true'
              ? html`
                  <div style="flex:1"></div>
                  <div part="schema-multiline-toggle" class="toolbar-item schema-multiline-toggle">
                    ${this.schemaDescriptionExpanded === 'true' ? 'Single line description' : 'Multiline description'}
                  </div>
                `
              : ''
          }
        </div>
        <span part="schema-description" class="m-markdown"> ${unsafeHTML(sanitizeHTML(marked(rootDescription)))} </span>
        <div style="border:1px solid var(--border)">
          <div style="display:flex; background: var(--card); padding:8px 4px; border-bottom:1px solid var(--border);">
            <div class="key" style="font-family:var(--font-regular); font-weight:bold; color:var(--foreground);">Field</div>
            <div class="key-type" style="font-family:var(--font-regular); font-weight:bold; color:var(--foreground);">Type</div>
            <div class="key-descr" style="font-family:var(--font-regular); font-weight:bold; color:var(--foreground);">Description</div>
          </div>
          ${this.renderAST(this.data)}
        </div>
      </div>
    `;
  }

  renderAST(node, parentType = '', schemaLevel = 0, indentLevel = 0) {
    if (!node) {
      return '';
    }

    if (this.schemaHideReadOnly === 'true' && node.readOnly) {
      return '';
    }
    if (this.schemaHideWriteOnly === 'true' && node.writeOnly) {
      return '';
    }

    const leftPadding = 16 * (indentLevel + 1);
    const isExpanded = schemaLevel < this.schemaExpandLevel;
    const deprecatedIcon = node.deprecated
      ? html`<svg viewBox="0 0 10 10" width="10" height="10" style="stroke:var(--red); margin-right:-6px">
          <path d="M2 2L8 8M2 8L8 2" />
        </svg>`
      : '';
    const readWriteBadge = node.readOnly ? ' 🆁' : node.writeOnly ? ' 🆆' : '';
    const readWriteTip = node.readOnly ? 'Read-Only' : node.writeOnly ? 'Write-Only' : '';

    // 1. Array kind
    if (node.kind === 'array') {
      const items = node.items;
      if (!items) {
        const hasText = !!node.description;
        const hasExtra = hasMultilineDescription(node.description);
        const descrExpander =
          hasText && hasExtra
            ? html`<span class="descr-expand-toggle ${this.schemaDescriptionExpanded === 'true' ? 'expanded-descr' : ''}">➔</span>`
            : '';
        return html`
          <div class="tr array" data-obj="${node.name || ''}">
            <div class="td key" style="padding-left:${leftPadding}px">
              <span class="key-label">${deprecatedIcon}${node.name || ''}</span>
              ${node.required ? html`<span style="color:var(--red);">*</span>` : ''}
            </div>
            <div class="td key-type" title="${readWriteTip}">array${readWriteBadge}</div>
            <div class="td key-descr" style="font-size: var(--font-size-small)">
              ${hasText ? html`<span class="m-markdown-small">${descrExpander} ${unsafeHTML(sanitizeHTML(marked(node.description)))}</span>` : ''}
            </div>
          </div>
        `;
      }

      if (items.kind === 'primitive') {
        const itemType = items.format || items.contentMediaType || items.type || 'string';
        const dataTypeCss = itemType
          .replace(/┃.*/g, '')
          .replace(/[^a-zA-Z0-9+]/g, '')
          .substring(0, 4)
          .toLowerCase();
        const hasText = !!(node.description || items.description);
        const hasItemChips = !!(
          items.constraints ||
          items.defaultValue ||
          items.allowedValues ||
          items.pattern ||
          items.contentMediaType ||
          items.contentEncoding
        );
        const hasExtra = hasItemChips || hasMultilineDescription(node.description) || hasMultilineDescription(items.description);
        const descrExpander =
          hasText && hasExtra
            ? html`<span class="descr-expand-toggle ${this.schemaDescriptionExpanded === 'true' ? 'expanded-descr' : ''}">➔</span>`
            : '';

        const detailChips = html`
          ${items.constraints ? html`<div style="display:inline-block; line-break:anywhere; margin-right:8px"><span class="bold-text">Constraints: </span>${items.constraints}</div>` : ''}
          ${items.defaultValue ? html`<div style="display:inline-block; line-break:anywhere; margin-right:8px"><span class="bold-text">Default: </span>${items.defaultValue}</div>` : ''}
          ${items.allowedValues ? html`<div style="display:inline-block; line-break:anywhere; margin-right:8px"><span class="bold-text">${items.type === 'const' ? 'Value' : 'Allowed'}: </span>${items.allowedValues}</div>` : ''}
          ${items.pattern ? html`<div style="display:inline-block; line-break:anywhere; margin-right:8px"><span class="bold-text">Pattern: </span>${items.pattern}</div>` : ''}
          ${items.contentMediaType ? html`<div style="display:inline-block; line-break:anywhere; margin-right:8px"><span class="bold-text">Media-Type: </span>${items.contentMediaType}</div>` : ''}
          ${items.contentEncoding ? html`<div style="display:inline-block; line-break:anywhere; margin-right:8px"><span class="bold-text">Encoding: </span>${items.contentEncoding}</div>` : ''}
        `;

        return html`
          <div class="tr primitive" title="${node.deprecated || items.deprecated ? 'Deprecated' : ''}">
            <div class="td key ${node.deprecated || items.deprecated ? 'deprecated' : ''}" style="padding-left:${leftPadding}px">
              ${deprecatedIcon} ${node.name ? html`<span class="key-label">${node.name}</span>` : ''}
              ${node.required ? html`<span style="color:var(--red);">*</span>` : ''}
            </div>
            <div class="td key-type ${dataTypeCss}" title="${readWriteTip}">[${itemType}]${readWriteBadge}</div>
            <div class="td key-descr" style="font-size: var(--font-size-small)">
              ${
                hasText
                  ? html`<span class="m-markdown-small"
                      >${descrExpander} ${unsafeHTML(sanitizeHTML(marked(node.description || items.description)))}</span
                    >`
                  : ''
              }
              ${hasText && hasItemChips ? html`<div class="item-details">${detailChips}</div>` : detailChips}
            </div>
          </div>
        `;
      }

      const arrLabel = items.kind === 'object' ? 'array of object' : `array of array ${node.arrayType ? `of ${node.arrayType}` : ''}`;
      const hasText = !!(node.description || items.description);
      const hasExtra = hasMultilineDescription(node.description) || hasMultilineDescription(items.description);
      const descrExpander =
        hasText && hasExtra
          ? html`<span class="descr-expand-toggle ${this.schemaDescriptionExpanded === 'true' ? 'expanded-descr' : ''}">➔</span>`
          : '';

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
          class="tr ${isExpanded ? 'expanded' : 'collapsed'} array"
          data-obj="${node.name || ''}"
          title="${node.deprecated ? `Deprecated ${node.name}` : node.name || ''}"
        >
          <div class="td key ${node.deprecated ? 'deprecated' : ''}" style="padding-left:${leftPadding}px">
            ${node.name && hasChildren ? html`<span class="obj-toggle" data-obj="${node.name}"></span>` : ''}
            <span class="key-label" style="display:inline-block; ${hasChildren ? 'margin-left:-6px;' : ''}">
              ${deprecatedIcon}${node.name || ''}
            </span>
            ${node.required ? html`<span style="color:var(--red);">*</span>` : ''}
          </div>
          <div class="td key-type" title="${readWriteTip}">${arrLabel}${readWriteBadge}</div>
          <div class="td key-descr" style="font-size: var(--font-size-small)">
            ${
              hasText
                ? html`<span class="m-markdown-small"
                    >${descrExpander} ${unsafeHTML(sanitizeHTML(marked(node.description || items.description || '')))}</span
                  >`
                : ''
            }
          </div>
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
      const typeLabel = node.dataTypeLabel || 'object';
      const hasText = !!node.description;
      const hasExtra = hasMultilineDescription(node.description);
      const descrExpander =
        hasText && hasExtra
          ? html`<span class="descr-expand-toggle ${this.schemaDescriptionExpanded === 'true' ? 'expanded-descr' : ''}">➔</span>`
          : '';

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
                  class="tr ${isExpanded ? 'expanded' : 'collapsed'} object"
                  data-obj="${node.name}"
                  title="${node.deprecated ? `Deprecated ${node.name}` : node.name}"
                >
                  <div class="td key ${node.deprecated ? 'deprecated' : ''}" style="padding-left:${leftPadding}px">
                    ${hasChildren ? html`<span class="obj-toggle" data-obj="${node.name}"></span>` : ''}
                    <span class="key-label" style="display:inline-block; ${hasChildren ? 'margin-left:-6px;' : ''}">
                      ${deprecatedIcon}${node.name}
                    </span>
                    ${node.required ? html`<span style="color:var(--red);">*</span>` : ''}
                  </div>
                  <div class="td key-type" title="${readWriteTip}">${typeLabel}${readWriteBadge}</div>
                  <div class="td key-descr" style="font-size: var(--font-size-small)">
                    ${
                      hasText
                        ? html`<span class="m-markdown-small"
                            >${descrExpander} ${unsafeHTML(sanitizeHTML(marked(node.description || '')))}</span
                          >`
                        : ''
                    }
                  </div>
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
      const hasText = !!node.description;
      const hasExtra = hasMultilineDescription(node.description);
      const descrExpander =
        hasText && hasExtra
          ? html`<span class="descr-expand-toggle ${this.schemaDescriptionExpanded === 'true' ? 'expanded-descr' : ''}">➔</span>`
          : '';

      return html`
        ${node.properties?.map((p) => this.renderAST(p, 'object', schemaLevel, indentLevel))}
        <div class="tr expanded xxx-of" data-obj="${opLabel}">
          <div class="td key" style="padding-left:${leftPadding}px">
            <span class="xxx-of-key" style="margin-left:-6px">${opLabel}</span>
          </div>
          <div class="td key-type"></div>
          <div class="td key-descr" style="font-size: var(--font-size-small)">
            ${hasText ? html`<span class="m-markdown-small">${descrExpander} ${unsafeHTML(sanitizeHTML(marked(node.description || '')))}</span>` : ''}
          </div>
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
      const dataTypeCss = (node.type || '')
        .replace(/┃.*/g, '')
        .replace(/[^a-zA-Z0-9+]/g, '')
        .substring(0, 4)
        .toLowerCase();
      const hasText = !!(node.description || node.title);
      const hasDetailChips = !!(
        node.constraints ||
        node.defaultValue ||
        node.allowedValues ||
        node.pattern ||
        node.contentMediaType ||
        node.contentEncoding
      );
      const hasExtra = hasDetailChips || hasMultilineDescription(node.description);
      const descrExpander =
        hasText && hasExtra
          ? html`<span class="descr-expand-toggle ${this.schemaDescriptionExpanded === 'true' ? 'expanded-descr' : ''}">➔</span>`
          : '';

      const detailChips = html`
        ${node.constraints ? html`<div style="display:inline-block; line-break:anywhere; margin-right:8px"><span class="bold-text">Constraints: </span>${node.constraints}</div>` : ''}
        ${node.defaultValue ? html`<div style="display:inline-block; line-break:anywhere; margin-right:8px"><span class="bold-text">Default: </span>${node.defaultValue}</div>` : ''}
        ${node.allowedValues ? html`<div style="display:inline-block; line-break:anywhere; margin-right:8px"><span class="bold-text">${node.type === 'const' ? 'Value' : 'Allowed'}: </span>${node.allowedValues}</div>` : ''}
        ${node.pattern ? html`<div style="display:inline-block; line-break:anywhere; margin-right:8px"><span class="bold-text">Pattern: </span>${node.pattern}</div>` : ''}
        ${node.contentMediaType ? html`<div style="display:inline-block; line-break:anywhere; margin-right:8px"><span class="bold-text">Media-Type: </span>${node.contentMediaType}</div>` : ''}
        ${node.contentEncoding ? html`<div style="display:inline-block; line-break:anywhere; margin-right:8px"><span class="bold-text">Encoding: </span>${node.contentEncoding}</div>` : ''}
      `;

      return html`
        <div class="tr primitive" title="${node.deprecated ? 'Deprecated' : ''}">
          <div class="td key ${node.deprecated ? 'deprecated' : ''}" style="padding-left:${leftPadding}px">
            ${deprecatedIcon} ${node.name ? html`<span class="key-label">${node.name}</span>` : ''}
            ${node.required ? html`<span style="color:var(--red);">*</span>` : ''}
          </div>
          <div class="td key-type ${dataTypeCss}" title="${readWriteTip}">
            ${parentType === 'array' ? `[${node.type}]` : node.type}${readWriteBadge}
          </div>
          <div class="td key-descr" style="font-size: var(--font-size-small)">
            ${
              hasText
                ? html`<span class="m-markdown-small"
                    >${descrExpander}
                    ${unsafeHTML(
                      sanitizeHTML(
                        marked(
                          node.title
                            ? node.description
                              ? `<b>${node.title}:</b> ${node.description}`
                              : `<b>${node.title}</b>`
                            : node.description
                        )
                      )
                    )}</span
                  >`
                : ''
            }
            ${hasText && hasDetailChips ? html`<div class="item-details">${detailChips}</div>` : detailChips}
          </div>
        </div>
      `;
    }

    return '';
  }

  handleAllEvents(e) {
    if (e.target.classList.contains('obj-toggle')) {
      this.toggleObjectExpand(e);
    } else if (e.target.classList.contains('schema-multiline-toggle')) {
      this.schemaDescriptionExpanded = this.schemaDescriptionExpanded === 'true' ? 'false' : 'true';
    } else if (e.target.classList.contains('descr-expand-toggle')) {
      const trEl = e.target.closest('.tr');
      if (trEl) {
        trEl.classList.toggle('expanded-descr');
        if (trEl.classList.contains('expanded-descr')) {
          trEl.style.maxHeight = `${trEl.scrollHeight}px`;
        } else {
          trEl.style.maxHeight = '';
        }
      }
    }
  }

  toggleObjectExpand(e) {
    const rowEl = e.target.closest('.tr');
    if (!rowEl) {
      return;
    }
    if (rowEl.classList.contains('expanded')) {
      rowEl.classList.replace('expanded', 'collapsed');
    } else {
      rowEl.classList.replace('collapsed', 'expanded');
    }
  }
}
customElements.define('schema-table', SchemaTable);
