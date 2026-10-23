import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { marked } from 'marked';
import { sanitizeHTML } from '../utils/sanitize.js';

export default class SchemaBaseElement extends LitElement {
  @property({ type: Object }) config: any;
  @property({ type: Object }) data: any;
  @property({ type: Number, attribute: 'schema-expand-level' }) schemaExpandLevel = 99999;
  @property({ type: String, attribute: 'schema-description-expanded' }) schemaDescriptionExpanded = 'false';
  @property({ type: String, attribute: 'allow-schema-description-expand-toggle' }) allowSchemaDescriptionExpandToggle = 'false';
  @property({ type: String, attribute: 'schema-hide-read-only' }) schemaHideReadOnly = 'true';
  @property({ type: String, attribute: 'schema-hide-write-only' }) schemaHideWriteOnly = 'true';

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

  handleAllEvents(e) {
    const toggleTrigger = e.target.closest('.open-bracket, .obj-toggle');
    if (toggleTrigger) {
      this.toggleObjectExpand(toggleTrigger);
    } else if (e.target.classList.contains('schema-multiline-toggle')) {
      this.schemaDescriptionExpanded = this.schemaDescriptionExpanded === 'true' ? 'false' : 'true';
    } else if (e.target.closest('.descr-expand-toggle, .descr-body')) {
      // Links inside a description still navigate, and selecting text to copy it doesn't toggle the row
      if (this.schemaDescriptionExpanded === 'true' || e.target.closest('a') || window.getSelection()?.isCollapsed === false) {
        return;
      }
      const trEl = e.target.closest('.tr');
      if (trEl) {
        const isExpanded = trEl.classList.toggle('expanded-descr');
        trEl.querySelector('.descr-expand-toggle')?.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      }
    }
  }

  handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const toggleTrigger = e.target.closest('.open-bracket, .obj-toggle, .descr-expand-toggle, .schema-multiline-toggle');
      if (toggleTrigger) {
        e.preventDefault();
        toggleTrigger.click();
      }
    }
  }

  toggleObjectExpand(targetEl) {
    const rowEl = targetEl.closest('.tr');
    if (!rowEl) {
      return;
    }
    const isExpanding = rowEl.classList.contains('collapsed');
    if (isExpanding) {
      rowEl.classList.replace('collapsed', 'expanded');
    } else {
      rowEl.classList.replace('expanded', 'collapsed');
    }
    const toggleEl = rowEl.querySelector('.open-bracket, .obj-toggle');
    if (toggleEl) {
      toggleEl.setAttribute('aria-expanded', isExpanding ? 'true' : 'false');
    }
  }

  isFieldHidden(node) {
    if (!node) {
      return true;
    }
    if (this.schemaHideReadOnly === 'true' && node.readOnly) {
      return true;
    }
    if (this.schemaHideWriteOnly === 'true' && node.writeOnly) {
      return true;
    }
    return false;
  }

  renderDeprecatedIcon(node) {
    return node?.deprecated
      ? html`<svg viewBox="0 0 10 10" width="10" height="10" style="stroke:var(--destructive); margin-right:-6px">
          <path d="M2 2L8 8M2 8L8 2" />
        </svg>`
      : '';
  }

  getReadWriteBadge(node) {
    return node?.readOnly ? html` 🆁` : node?.writeOnly ? html` 🆆` : '';
  }

  getReadWriteTip(node) {
    return node?.readOnly ? 'Read-Only' : node?.writeOnly ? 'Write-Only' : '';
  }

  getDataTypeCss(type) {
    return (type || '')
      .replace(/┃.*/g, '')
      .replace(/[^a-zA-Z0-9+]/g, '')
      .substring(0, 4)
      .toLowerCase();
  }

  hasDetailChips(node) {
    return Boolean(
      node && (node.constraints || node.defaultValue || node.allowedValues || node.pattern || node.contentMediaType || node.contentEncoding)
    );
  }

  renderDetailChips(node) {
    if (!node) {
      return '';
    }
    return html`
      ${node.constraints ? html`<div class="descr-chip"><span class="descr-label">Constraints:</span> <span class="descr-value">${node.constraints}</span></div>` : ''}
      ${node.defaultValue ? html`<div class="descr-chip"><span class="descr-label">Default:</span> <span class="descr-value">${node.defaultValue}</span></div>` : ''}
      ${node.allowedValues ? html`<div class="descr-chip"><span class="descr-label">${node.type === 'const' ? 'Value' : 'Allowed'}:</span> <span class="descr-value">${node.allowedValues}</span></div>` : ''}
      ${node.pattern ? html`<div class="descr-chip"><span class="descr-label">Pattern:</span> <span class="descr-value">${node.pattern}</span></div>` : ''}
      ${node.contentMediaType ? html`<div class="descr-chip"><span class="descr-label">Media-Type:</span> <span class="descr-value">${node.contentMediaType}</span></div>` : ''}
      ${node.contentEncoding ? html`<div class="descr-chip"><span class="descr-label">Encoding:</span> <span class="descr-value">${node.contentEncoding}</span></div>` : ''}
    `;
  }

  renderDescriptionHtml(desc, title = '') {
    if (!desc && !title) {
      return '';
    }
    const text = title ? (desc ? `<b>${title}:</b> ${desc}` : `<b>${title}</b>`) : desc;
    return html`${unsafeHTML(sanitizeHTML(marked(text)))}`;
  }

  /**
   * Description cell shared by every schema row.
   * Collapsed rows show only the first markdown block (or the constraint chips, when there is no description) on one line,
   * and CSS marks a cut-off line with an ellipsis, or a "…" badge where scroll-state container queries are supported.
   * The arrow is shown only when content is known to be hidden: more markdown blocks, a line break, or chips under the text.
   *
   * @param {string} desc - Markdown description
   * @param {object} [chipsNode] - Node whose constraints, default, allowed values, etc. are shown as chips
   * @param {string} [title] - Schema title, shown in bold before the description
   */
  renderDescrCell(desc, chipsNode = null, title = '') {
    const text = typeof desc === 'string' ? desc.trim() : '';
    const hasChips = this.hasDetailChips(chipsNode);
    if (!text && !title && !hasChips) {
      return html`<div class="td key-descr"></div>`;
    }
    const markdown = title ? (text ? `<b>${title}:</b> ${text}` : `<b>${title}</b>`) : text;
    const tokens = markdown ? marked.lexer(markdown) : [];
    const blocks = tokens.filter((t: any) => t.type !== 'space');
    const hasMore =
      blocks.length > 1 ||
      (blocks[0]?.type === 'list' && blocks[0].items.length > 1) ||
      /<br\s*\/?>(?!\s*$)/i.test(markdown) ||
      (blocks.length > 0 && hasChips);
    const isExpanded = this.schemaDescriptionExpanded === 'true';
    return html`
      <div class="td key-descr">
        <span
          class="descr-expand-toggle"
          role="button"
          tabindex="0"
          aria-label="Toggle description"
          aria-expanded="${isExpanded ? 'true' : 'false'}"
          ?hidden="${!hasMore}"
          >➔</span
        >
        <div class="descr-body m-markdown-small ${hasMore ? 'has-more' : ''}">
          ${blocks.length ? unsafeHTML(sanitizeHTML(marked.parser(tokens))) : ''}
          ${hasChips ? html`<div class="item-details">${this.renderDetailChips(chipsNode)}</div>` : ''}
          <span class="descr-more" aria-hidden="true">…</span>
        </div>
      </div>
    `;
  }

  renderToolbar(rootType) {
    return html`
      <div class="toolbar">
        <div class="toolbar-item schema-root-type ${rootType} ">${rootType}</div>
        ${
          this.allowSchemaDescriptionExpandToggle === 'true'
            ? html`
                <div style="flex:1"></div>
                <div part="schema-toolbar-item schema-multiline-toggle" class="toolbar-item schema-multiline-toggle">
                  ${this.schemaDescriptionExpanded === 'true' ? 'Single line description' : 'Multiline description'}
                </div>
              `
            : ''
        }
      </div>
    `;
  }
}
