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
        }
        .tree .tr:hover {
          background: var(--muted);
        }
        .collapsed-all-descr .tr:not(.expanded-descr) {
          overflow: hidden;
          max-height: calc(var(--font-size-small) + 8px);
        }
        .collapsed-all-descr .tr:not(.expanded-descr) .key {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .tree .tr.expanded-descr {
          max-height: none;
        }
        .tree .key {
          max-width: 300px;
        }
        .tr.expanded:hover > .td.key > .open-bracket {
          color: var(--primary);
        }
        .tr.expanded:hover + .inside-bracket {
          border-left: 1px solid var(--muted-foreground);
        }
        .tr.expanded:hover + .inside-bracket + .close-bracket {
          color: var(--primary);
        }
        .inside-bracket.xxx-of-option {
          border-left: 1px solid transparent;
        }
        .open-bracket {
          display: inline-block;
          padding: 0 20px 0 0;
          cursor: pointer;
          border: 1px solid transparent;
          border-radius: var(--card-radius);
        }
        .open-bracket:hover {
          color: var(--primary);
          background: var(--muted);
          border: 1px solid var(--border);
        }
        .open-bracket:focus-visible {
          outline: 2px solid var(--primary);
          border-color: var(--primary);
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
          border-left: 1px dotted var(--border);
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
    const { fieldNameThreshold } = this.getThresholds();
    const isLongName = Boolean(node.name && typeof node.name === 'string' && node.name.length > fieldNameThreshold);

    // 1. Array kind
    if (node.kind === 'array') {
      const items = node.items;
      if (!items) {
        const fieldTitle = node.name ? `${node.name}${readWriteTip ? ` (${readWriteTip})` : ''}` : '';
        return html`
          <div class="tr ${isExpanded ? 'expanded' : 'collapsed'} array ${nullClass}" title="${node.deprecated ? 'Deprecated' : ''}">
            <div class="td key ${node.deprecated ? 'deprecated' : ''}" style="min-width:${minFieldColWidth}px">
              ${deprecatedIcon}
              ${node.name ? html`<span class="key-label" title="${fieldTitle}">${node.name}${node.required ? html`<span style="color:var(--red)">*</span>` : ''}${readWriteBadge}:</span>` : ''}
              <span class="open-bracket array">${nullMarker}[ ]</span>
            </div>
            <div class="td key-descr m-markdown-small">${this.renderDescriptionHtml(node.description || '')}</div>
          </div>
        `;
      }

      // If array of primitives
      if (items.kind === 'primitive') {
        const itemType = items.format || items.contentMediaType || items.type || 'string';
        const dataTypeCss = this.getDataTypeCss(itemType);
        const hasText = !!(node.description || items.description || isLongName);
        const hasItemChips = this.hasDetailChips(items);
        const hasExtra = this.isDescriptionExpandable(node.description, hasItemChips, items.description, node.name);
        const descrExpander = this.renderDescrExpander(hasText, hasExtra);
        const detailChips = this.renderDetailChips(items);
        const fieldTitle = node.name ? `${node.name}${readWriteTip ? ` (${readWriteTip})` : ''}` : '';

        return html`
          <div class="tr primitive ${nullClass}" title="${node.deprecated || items.deprecated ? 'Deprecated' : ''}">
            <div class="td key ${node.deprecated || items.deprecated ? 'deprecated' : ''}" style="min-width:${minFieldColWidth}px">
              ${deprecatedIcon}
              ${node.name ? html`<span class="key-label" title="${fieldTitle}">${node.name}${node.required ? html`<span style="color:var(--red)">*</span>` : ''}:</span>` : ''}
              <span class="${dataTypeCss}" title="${readWriteTip}">${nullMarker}[${itemType}]${readWriteBadge}</span>
            </div>
            <div class="td key-descr">
              ${
                hasText
                  ? html`<span class="m-markdown-small"
                      >${descrExpander} ${this.renderDescriptionHtml(node.description || items.description)}</span
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
        const openBracket = html`<span
          class="open-bracket array-of-object"
          role="button"
          tabindex="0"
          aria-label="Toggle ${node.name || 'object'}"
          aria-expanded="${isExpanded ? 'true' : 'false'}"
          >${nullMarker}<span class="open-bracket-expanded">[{</span><span class="open-bracket-collapsed">[{...}]</span></span
        >`;
        const closeBracket = '}]';

        const hasText = !!(node.description || items.description || isLongName);
        const hasExtra = this.isDescriptionExpandable(node.description, false, items.description, node.name);
        const descrExpander = this.renderDescrExpander(hasText, hasExtra);
        const fieldTitle = node.name ? `${node.name}${readWriteTip ? ` (${readWriteTip})` : ''}` : '';

        return html`
          <div
            class="tr ${isExpanded ? 'expanded' : 'collapsed'} object ${nullClass}"
            title="${node.deprecated || items.deprecated ? 'Deprecated' : ''}"
          >
            <div class="td key ${node.deprecated || items.deprecated ? 'deprecated' : ''}" style="min-width:${minFieldColWidth}px">
              ${deprecatedIcon}
              ${node.name ? html`<span class="key-label" title="${fieldTitle}">${node.name}${node.required ? html`<span style="color:var(--red)">*</span>` : ''}${readWriteBadge}:</span>` : ''}
              ${openBracket}
            </div>
            <div class="td key-descr m-markdown-small">
              ${descrExpander} ${this.renderDescriptionHtml(node.description || items.description || '')}
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

        const hasText = !!(node.description || items?.description || isLongName);
        const hasExtra = this.isDescriptionExpandable(node.description, false, items?.description, node.name);
        const descrExpander = this.renderDescrExpander(hasText, hasExtra);
        const fieldTitle = node.name ? `${node.name}${readWriteTip ? ` (${readWriteTip})` : ''}` : '';

        return html`
          <div class="tr ${isExpanded ? 'expanded' : 'collapsed'} array ${nullClass}" title="${node.deprecated ? 'Deprecated' : ''}">
            <div class="td key ${node.deprecated ? 'deprecated' : ''}" style="min-width:${minFieldColWidth}px">
              ${deprecatedIcon}
              ${node.name ? html`<span class="key-label" title="${fieldTitle}">${node.name}${node.required ? html`<span style="color:var(--red)">*</span>` : ''}${readWriteBadge}:</span>` : ''}
              ${openBracket}
            </div>
            <div class="td key-descr m-markdown-small">${descrExpander} ${this.renderDescriptionHtml(node.description || '')}</div>
          </div>
          <div class="inside-bracket array" style="padding-left:${leftPadding}px;">
            ${this.renderAST(items, 'array', schemaLevel + 1, indentLevel + 1)}
          </div>
          <div class="close-bracket">${closeBracket}</div>
        `;
      }

      // If array of unions or others
      const hasText = !!(node.description || isLongName);
      const hasExtra = this.isDescriptionExpandable(node.description, false, '', node.name);
      const descrExpander = this.renderDescrExpander(hasText, hasExtra);
      const fieldTitle = node.name ? `${node.name}${readWriteTip ? ` (${readWriteTip})` : ''}` : '';
      return html`
        <div class="tr ${isExpanded ? 'expanded' : 'collapsed'} array ${nullClass}" title="${node.deprecated ? 'Deprecated' : ''}">
          <div class="td key ${node.deprecated ? 'deprecated' : ''}" style="min-width:${minFieldColWidth}px">
            ${deprecatedIcon}
            ${node.name ? html`<span class="key-label" title="${fieldTitle}">${node.name}${node.required ? html`<span style="color:var(--red)">*</span>` : ''}${readWriteBadge}:</span>` : ''}
            <span
              class="open-bracket array"
              role="button"
              tabindex="0"
              aria-label="Toggle ${node.name || 'array'}"
              aria-expanded="${isExpanded ? 'true' : 'false'}"
              >${nullMarker}<span class="open-bracket-expanded">[</span><span class="open-bracket-collapsed">[...]</span></span
            >
          </div>
          <div class="td key-descr m-markdown-small">${descrExpander} ${this.renderDescriptionHtml(node.description || '')}</div>
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

      const hasText = !!(node.description || isLongName);
      const hasExtra = this.isDescriptionExpandable(node.description, false, '', node.name);
      const descrExpander = this.renderDescrExpander(hasText, hasExtra);
      const fieldTitle = node.name ? `${node.name}${readWriteTip ? ` (${readWriteTip})` : ''}` : '';

      return html`
        <div class="tr ${isExpanded ? 'expanded' : 'collapsed'} object ${nullClass}" title="${node.deprecated ? 'Deprecated' : ''}">
          <div class="td key ${node.deprecated ? 'deprecated' : ''}" style="min-width:${minFieldColWidth}px">
            ${deprecatedIcon}
            ${node.name ? html`<span class="key-label" title="${fieldTitle}">${node.name}${node.required ? html`<span style="color:var(--red)">*</span>` : ''}${readWriteBadge}:</span>` : ''}
            ${openBracket}
          </div>
          <div class="td key-descr m-markdown-small">${descrExpander} ${this.renderDescriptionHtml(node.description || '')}</div>
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
      const hasExtra = this.isDescriptionExpandable(node.description);
      const descrExpander = this.renderDescrExpander(hasText, hasExtra);

      return html`
        ${node.properties?.map((p) => this.renderAST(p, 'object', schemaLevel, indentLevel))}
        <div class="tr expanded xxx-of-option">
          <div class="td key" style="min-width:${minFieldColWidth}px">
            <span class="key-label xxx-of-key">${opLabel}</span>
          </div>
          <div class="td key-descr m-markdown-small">${descrExpander} ${this.renderDescriptionHtml(node.description || '')}</div>
        </div>
        <div class="inside-bracket xxx-of-option" style="padding-left:0px;">
          ${node.options?.map(
            (opt, i) => html`
              <div>
                <div class="tr expanded xxx-of-option">
                  <div class="td key" style="min-width:${minFieldColWidth}px">
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
    }

    // 4. Primitive kind
    if (node.kind === 'primitive') {
      const dataTypeCss = this.getDataTypeCss(node.type);
      const hasText = !!(node.description || node.title || isLongName);
      const hasDetailChips = this.hasDetailChips(node);
      const hasExtra = this.isDescriptionExpandable(node.description, hasDetailChips, '', node.name);
      const descrExpander = this.renderDescrExpander(hasText, hasExtra);
      const detailChips = this.renderDetailChips(node);
      const fieldTitle = node.name ? `${node.name}${readWriteTip ? ` (${readWriteTip})` : ''}` : '';

      return html`
        <div class="tr primitive" title="${node.deprecated ? 'Deprecated' : ''}">
          <div class="td key ${node.deprecated ? 'deprecated' : ''}" style="min-width:${minFieldColWidth}px">
            ${deprecatedIcon}
            ${node.name ? html`<span class="key-label" title="${fieldTitle}">${node.name}${node.required ? html`<span style="color:var(--red);">*</span>` : ''}:</span>` : ''}
            <span class="${dataTypeCss}" title="${readWriteTip}">
              ${parentType === 'array' ? `[${node.type}]` : node.type}${readWriteBadge}
            </span>
          </div>
          <div class="td key-descr">
            ${
              hasText
                ? html`<span class="m-markdown-small">${descrExpander} ${this.renderDescriptionHtml(node.description, node.title)}</span>`
                : ''
            }
            ${hasText && hasDetailChips ? html`<div class="item-details">${detailChips}</div>` : detailChips}
          </div>
        </div>
      `;
    }

    return '';
  }
}
