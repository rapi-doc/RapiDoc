import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { marked } from 'marked';
import { sanitizeHTML } from '../utils/sanitize.js';
import { hasMultilineDescription } from '../utils/markdown-utils.js';

export default class SchemaBaseElement extends LitElement {
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

  connectedCallback() {
    super.connectedCallback();
    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(() => {
        const { descThreshold, fieldNameThreshold } = this.getThresholds();
        if (descThreshold !== this._lastDescThreshold || fieldNameThreshold !== this._lastFieldThreshold) {
          this._lastDescThreshold = descThreshold;
          this._lastFieldThreshold = fieldNameThreshold;
          this.requestUpdate();
        }
      });
      this._resizeObserver.observe(this);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
  }

  getThresholds() {
    if (typeof window === 'undefined' || typeof getComputedStyle === 'undefined') {
      return { descThreshold: 75, fieldNameThreshold: 48 };
    }
    try {
      const styles = getComputedStyle(this);
      const descVal = styles.getPropertyValue('--schema-description-threshold')?.trim();
      const defaultDesc = styles.getPropertyValue('--_desc-threshold-default')?.trim();
      const descThreshold = parseInt(descVal || defaultDesc, 10) || 75;

      const fieldVal = styles.getPropertyValue('--schema-field-name-threshold')?.trim();
      const defaultField = styles.getPropertyValue('--_field-threshold-default')?.trim();
      const fieldNameThreshold = parseInt(fieldVal || defaultField, 10) || 48;

      return { descThreshold, fieldNameThreshold };
    } catch {
      return { descThreshold: 75, fieldNameThreshold: 48 };
    }
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

  handleAllEvents(e) {
    const toggleTrigger = e.target.closest('.open-bracket, .obj-toggle');
    if (toggleTrigger) {
      this.toggleObjectExpand(toggleTrigger);
    } else if (e.target.classList.contains('schema-multiline-toggle')) {
      this.schemaDescriptionExpanded = this.schemaDescriptionExpanded === 'true' ? 'false' : 'true';
    } else if (e.target.classList.contains('descr-expand-toggle')) {
      const trEl = e.target.closest('.tr');
      if (trEl) {
        const isExpanded = trEl.classList.toggle('expanded-descr');
        e.target.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
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
      ? html`<svg viewBox="0 0 10 10" width="10" height="10" style="stroke:var(--red); margin-right:-6px">
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
      ${node.constraints ? html`<div style="display:inline-block; line-break:anywhere; margin-right:8px"><span class="bold-text">Constraints: </span>${node.constraints}</div>` : ''}
      ${node.defaultValue ? html`<div style="display:inline-block; line-break:anywhere; margin-right:8px"><span class="bold-text">Default: </span>${node.defaultValue}</div>` : ''}
      ${node.allowedValues ? html`<div style="display:inline-block; line-break:anywhere; margin-right:8px"><span class="bold-text">${node.type === 'const' ? 'Value' : 'Allowed'}: </span>${node.allowedValues}</div>` : ''}
      ${node.pattern ? html`<div style="display:inline-block; line-break:anywhere; margin-right:8px"><span class="bold-text">Pattern: </span>${node.pattern}</div>` : ''}
      ${node.contentMediaType ? html`<div style="display:inline-block; line-break:anywhere; margin-right:8px"><span class="bold-text">Media-Type: </span>${node.contentMediaType}</div>` : ''}
      ${node.contentEncoding ? html`<div style="display:inline-block; line-break:anywhere; margin-right:8px"><span class="bold-text">Encoding: </span>${node.contentEncoding}</div>` : ''}
    `;
  }

  renderDescriptionHtml(desc, title = '') {
    if (!desc && !title) {
      return '';
    }
    const text = title ? (desc ? `<b>${title}:</b> ${desc}` : `<b>${title}</b>`) : desc;
    return html`${unsafeHTML(sanitizeHTML(marked(text)))}`;
  }

  isDescriptionExpandable(desc, hasChips = false, extraDesc = '', fieldName = '') {
    if (hasChips) {
      return true;
    }
    const { descThreshold, fieldNameThreshold } = this.getThresholds();
    if (fieldName && typeof fieldName === 'string' && fieldName.trim().length > fieldNameThreshold) {
      return true;
    }
    const check = (d) => Boolean(d && typeof d === 'string' && (hasMultilineDescription(d) || d.trim().length > descThreshold));
    return check(desc) || check(extraDesc);
  }

  renderDescrExpander(hasText, hasExtra) {
    return hasText && hasExtra
      ? html`<span
          class="descr-expand-toggle ${this.schemaDescriptionExpanded === 'true' ? 'expanded-descr' : ''}"
          role="button"
          tabindex="0"
          aria-label="Toggle description"
          aria-expanded="${this.schemaDescriptionExpanded === 'true' ? 'true' : 'false'}"
          >➔</span
        >`
      : '';
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
