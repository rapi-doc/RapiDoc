// @ts-nocheck
import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { sanitizeHTML } from '../utils/sanitize.ts';
import { marked } from 'marked';
import FontStyles from '~/styles/font-styles';
import SchemaStyles from '~/styles/schema-styles';
import BorderStyles from '~/styles/border-styles';
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

export default class SchemaTree extends LitElement {
  static get properties() {
    return {
      config: { type: Object },
      data: { type: Object },
      schemaExpandLevel: { type: Number, attribute: 'schema-expand-level' },
      schemaDescriptionExpanded: { type: String, attribute: 'schema-description-expanded' },
      allowSchemaDescriptionExpandToggle: { type: String, attribute: 'allow-schema-description-expand-toggle' },
      schemaHideReadOnly: { type: String, attribute: 'schema-hide-read-only' },
      schemaHideWriteOnly: { type: String, attribute: 'schema-hide-write-only' },
    };
  }

  willUpdate(changedProperties) {
    super.willUpdate?.(changedProperties);
    if (this.config) {
      this.schemaExpandLevel ??= this.config.schemaExpandLevel;
      this.schemaDescriptionExpanded ??= this.config.schemaDescriptionExpanded;
      this.allowSchemaDescriptionExpandToggle ??= this.config.allowSchemaDescriptionExpandToggle;
      this.schemaHideReadOnly ??= this.config.schemaHideReadOnly;
      this.schemaHideWriteOnly ??= this.config.schemaHideWriteOnly;
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
      BorderStyles,
      css`
        .tree {
          font-size: var(--font-size-small);
          text-align: left;
          direction: ltr;
          line-height: calc(var(--font-size-small) + 6px);
        }
        .tree .tr:hover {
          background: var(--hover-color);
        }
        .collapsed-all-descr .tr:not(.expanded-descr) {
          overflow: hidden;
          max-height: calc(var(--font-size-small) + 8px);
        }
        .tree .tr.expanded-descr {
          max-height: none;
        }
        .tree .key {
          max-width: 300px;
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
        .open-bracket {
          display: inline-block;
          padding: 0 20px 0 0;
          cursor: pointer;
          border: 1px solid transparent;
          border-radius: 3px;
        }
        .open-bracket:hover {
          color: var(--primary-color);
          background: var(--hover-color);
          border: 1px solid var(--border-color);
        }
        .close-bracket {
          display: inline-block;
          font-family: var(--font-mono);
        }
        .tr.collapsed + .inside-bracket,
        .tr.collapsed + .inside-bracket + .close-bracket {
          overflow: hidden;
          display: none;
        }
        .inside-bracket.object,
        .inside-bracket.array {
          border-left: 1px dotted var(--border-color);
        }
        .tr.expanded .open-bracket .open-bracket-collapsed {
          display: none;
        }
        .tr.collapsed .open-bracket .open-bracket-expanded {
          display: none;
        }
      `,
      CustomStyles,
    ];
  }

  render() {
    if (!this.data) {
      return html`
        <div class="tree">
          <span class="mono-font" style="color:var(--red)"> Schema not found </span>
        </div>
      `;
    }

    const rootType = this.data.kind === 'primitive' ? this.data.type : this.data.kind || '';
    const rootDescription = this.data.description || '';

    return html` <div
      class="tree ${this.schemaDescriptionExpanded === 'true' ? 'expanded-all-descr' : 'collapsed-all-descr'}"
      @click="${(e) => this.handleAllEvents(e)}"
    >
      <div class="toolbar">
        <div class="toolbar-item schema-root-type ${rootType} ">${rootType}</div>
        ${
          this.allowSchemaDescriptionExpandToggle === 'true'
            ? html` <div style="flex:1"></div>
                <div part="schema-toolbar-item schema-multiline-toggle" class="toolbar-item schema-multiline-toggle">
                  ${this.schemaDescriptionExpanded === 'true' ? 'Single line description' : 'Multiline description'}
                </div>`
            : ''
        }
      </div>
      <span part="schema-description" class="m-markdown"> ${unsafeHTML(sanitizeHTML(marked(rootDescription)))}</span>
      ${this.renderAST(this.data)}
    </div>`;
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

    const leftPadding = 12;
    const minFieldColWidth = 400 - indentLevel * leftPadding;
    const isExpanded = schemaLevel < this.schemaExpandLevel;
    const readWriteBadge = node.readOnly ? html` 🆁` : node.writeOnly ? html` 🆆` : '';
    const readWriteTip = node.readOnly ? 'Read-Only' : node.writeOnly ? 'Write-Only' : '';
    const deprecatedIcon = node.deprecated
      ? html`<svg viewBox="0 0 10 10" width="10" height="10" style="stroke:var(--red); margin-right:-6px">
          <path d="M2 2L8 8M2 8L8 2" />
        </svg>`
      : '';

    // 1. Array kind
    if (node.kind === 'array') {
      const items = node.items;
      if (!items) {
        return html`
          <div class="tr ${isExpanded ? 'expanded' : 'collapsed'} array" title="${node.deprecated ? 'Deprecated' : ''}">
            <div class="td key ${node.deprecated ? 'deprecated' : ''}" style="min-width:${minFieldColWidth}px">
              ${deprecatedIcon}
              ${node.name ? html`<span class="key-label" title="${readWriteTip}">${node.name}${node.required ? html`<span style="color:var(--red)">*</span>` : ''}${readWriteBadge}:</span>` : ''}
              <span class="open-bracket array">[ ]</span>
            </div>
            <div class="td key-descr m-markdown-small">${unsafeHTML(sanitizeHTML(marked(node.description || '')))}</div>
          </div>
        `;
      }

      // If array of primitives
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
            <div class="td key ${node.deprecated || items.deprecated ? 'deprecated' : ''}" style="min-width:${minFieldColWidth}px">
              ${deprecatedIcon}
              ${node.name ? html`<span class="key-label" title="${readWriteTip}">${node.name}${node.required ? html`<span style="color:var(--red)">*</span>` : ''}:</span>` : ''}
              <span class="${dataTypeCss}" title="${readWriteTip}">[${itemType}]${readWriteBadge}</span>
            </div>
            <div class="td key-descr">
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

      // If array of objects
      if (items.kind === 'object') {
        const openBracket = html`<span class="open-bracket array-of-object"
          ><span class="open-bracket-expanded">[{</span><span class="open-bracket-collapsed">[{...}]</span></span
        >`;
        const closeBracket = '}]';

        const hasExtra = hasMultilineDescription(node.description);
        const descrExpander = hasExtra
          ? html`<span class="descr-expand-toggle ${this.schemaDescriptionExpanded === 'true' ? 'expanded-descr' : ''}">➔</span>`
          : '';

        return html`
          <div
            class="tr ${isExpanded ? 'expanded' : 'collapsed'} object ${items.nullable ? 'nullable' : ''}"
            title="${node.deprecated || items.deprecated ? 'Deprecated' : ''}"
          >
            <div class="td key ${node.deprecated || items.deprecated ? 'deprecated' : ''}" style="min-width:${minFieldColWidth}px">
              ${deprecatedIcon}
              ${node.name ? html`<span class="key-label" title="${readWriteTip}">${node.name}${node.required ? html`<span style="color:var(--red)">*</span>` : ''}${readWriteBadge}:</span>` : ''}
              ${openBracket}
            </div>
            <div class="td key-descr m-markdown-small">
              ${descrExpander} ${unsafeHTML(sanitizeHTML(marked(node.description || items.description || '')))}
            </div>
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
        const openBracket = html`<span class="open-bracket array-of-array" data-array-type="${arrType}"
          ><span class="open-bracket-expanded">[[ ${arrType} </span><span class="open-bracket-collapsed">[[...]]</span></span
        >`;
        const closeBracket = ']]';

        const hasExtra = hasMultilineDescription(node.description);
        const descrExpander = hasExtra
          ? html`<span class="descr-expand-toggle ${this.schemaDescriptionExpanded === 'true' ? 'expanded-descr' : ''}">➔</span>`
          : '';

        return html`
          <div
            class="tr ${isExpanded ? 'expanded' : 'collapsed'} array ${node.nullable ? 'nullable' : ''}"
            title="${node.deprecated ? 'Deprecated' : ''}"
          >
            <div class="td key ${node.deprecated ? 'deprecated' : ''}" style="min-width:${minFieldColWidth}px">
              ${deprecatedIcon}
              ${node.name ? html`<span class="key-label" title="${readWriteTip}">${node.name}${node.required ? html`<span style="color:var(--red)">*</span>` : ''}${readWriteBadge}:</span>` : ''}
              ${openBracket}
            </div>
            <div class="td key-descr m-markdown-small">${descrExpander} ${unsafeHTML(sanitizeHTML(marked(node.description || '')))}</div>
          </div>
          <div class="inside-bracket array" style="padding-left:${leftPadding}px;">
            ${this.renderAST(items, 'array', schemaLevel + 1, indentLevel + 1)}
          </div>
          <div class="close-bracket">${closeBracket}</div>
        `;
      }

      // If array of unions or others
      const hasText = !!node.description;
      const hasExtra = hasMultilineDescription(node.description);
      const descrExpander =
        hasText && hasExtra
          ? html`<span class="descr-expand-toggle ${this.schemaDescriptionExpanded === 'true' ? 'expanded-descr' : ''}">➔</span>`
          : '';
      return html`
        <div class="tr ${isExpanded ? 'expanded' : 'collapsed'} array" title="${node.deprecated ? 'Deprecated' : ''}">
          <div class="td key ${node.deprecated ? 'deprecated' : ''}" style="min-width:${minFieldColWidth}px">
            ${deprecatedIcon}
            ${node.name ? html`<span class="key-label" title="${readWriteTip}">${node.name}${node.required ? html`<span style="color:var(--red)">*</span>` : ''}${readWriteBadge}:</span>` : ''}
            <span class="open-bracket array"
              ><span class="open-bracket-expanded">[</span><span class="open-bracket-collapsed">[...]</span></span
            >
          </div>
          <div class="td key-descr m-markdown-small">${descrExpander} ${unsafeHTML(sanitizeHTML(marked(node.description || '')))}</div>
        </div>
        <div class="inside-bracket array" style="padding-left:${leftPadding}px;">
          ${this.renderAST(items, 'array', schemaLevel + 1, indentLevel + 1)}
        </div>
        <div class="close-bracket">]</div>
      `;
    }

    // 2. Object kind
    if (node.kind === 'object') {
      const openBracket = html`<span class="open-bracket object"
        >${node.nullable ? 'null┃' : ''}<span class="open-bracket-expanded">{</span><span class="open-bracket-collapsed">{...}</span></span
      >`;
      const closeBracket = '}';

      const hasExtra = hasMultilineDescription(node.description);
      const descrExpander = hasExtra
        ? html`<span class="descr-expand-toggle ${this.schemaDescriptionExpanded === 'true' ? 'expanded-descr' : ''}">➔</span>`
        : '';

      return html`
        <div
          class="tr ${isExpanded ? 'expanded' : 'collapsed'} object ${node.nullable ? 'nullable' : ''}"
          title="${node.deprecated ? 'Deprecated' : ''}"
        >
          <div class="td key ${node.deprecated ? 'deprecated' : ''}" style="min-width:${minFieldColWidth}px">
            ${deprecatedIcon}
            ${node.name ? html`<span class="key-label" title="${readWriteTip}">${node.name}${node.required ? html`<span style="color:var(--red)">*</span>` : ''}${readWriteBadge}:</span>` : ''}
            ${openBracket}
          </div>
          <div class="td key-descr m-markdown-small">${descrExpander} ${unsafeHTML(sanitizeHTML(marked(node.description || '')))}</div>
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
      const hasText = !!node.description;
      const hasExtra = hasMultilineDescription(node.description);
      const descrExpander =
        hasText && hasExtra
          ? html`<span class="descr-expand-toggle ${this.schemaDescriptionExpanded === 'true' ? 'expanded-descr' : ''}">➔</span>`
          : '';

      return html`
        ${node.properties?.map((p) => this.renderAST(p, 'object', schemaLevel, indentLevel))}
        <div class="tr expanded xxx-of-option">
          <div class="td key" style="min-width:${minFieldColWidth}px">
            <span class="key-label xxx-of-key">${opLabel}</span>
          </div>
          <div class="td key-descr m-markdown-small">${descrExpander} ${unsafeHTML(sanitizeHTML(marked(node.description || '')))}</div>
        </div>
        <div class="inside-bracket xxx-of-option" style="padding-left:0px;">
          ${node.options?.map(
            (opt, i) => html`
              <div>
                <div class="tr expanded xxx-of-option">
                  <div class="td key" style="min-width:${minFieldColWidth}px">
                    <span class="key-label xxx-of-key">OPTION ${opt.optionIndex || i + 1}</span>
                    ${opt.optionTitle ? html`<span class="xxx-of-descr">${opt.optionTitle}</span>` : ''}
                  </div>
                </div>
                ${this.renderAST(opt, 'xxx-of-option', schemaLevel, newIndent)}
              </div>
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
          <div class="td key ${node.deprecated ? 'deprecated' : ''}" style="min-width:${minFieldColWidth}px">
            ${deprecatedIcon}
            ${node.name ? html`<span class="key-label">${node.name}${node.required ? html`<span style="color:var(--red);">*</span>` : ''}:</span>` : ''}
            <span class="${dataTypeCss}" title="${readWriteTip}">
              ${parentType === 'array' ? `[${node.type}]` : node.type}${readWriteBadge}
            </span>
          </div>
          <div class="td key-descr">
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
    const openBracketEl = e.target.closest('.open-bracket');
    if (openBracketEl) {
      this.toggleObjectExpand(openBracketEl);
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

  toggleObjectExpand(openBracketEl) {
    const rowEl = openBracketEl.closest('.tr');
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
customElements.define('schema-tree', SchemaTree);
