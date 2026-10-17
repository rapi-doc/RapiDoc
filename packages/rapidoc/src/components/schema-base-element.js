import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { marked } from 'marked';
import { sanitizeHTML } from '../utils/sanitize.js';

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
        trEl.classList.toggle('expanded-descr');
        if (trEl.classList.contains('expanded-descr')) {
          trEl.style.maxHeight = `${trEl.scrollHeight}px`;
        } else {
          trEl.style.maxHeight = '';
        }
      }
    }
  }

  toggleObjectExpand(targetEl) {
    const rowEl = targetEl.closest('.tr');
    if (!rowEl) {
      return;
    }
    if (rowEl.classList.contains('expanded')) {
      rowEl.classList.replace('expanded', 'collapsed');
    } else {
      rowEl.classList.replace('collapsed', 'expanded');
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

  renderDescrExpander(hasText, hasExtra) {
    return hasText && hasExtra
      ? html`<span class="descr-expand-toggle ${this.schemaDescriptionExpanded === 'true' ? 'expanded-descr' : ''}">➔</span>`
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
