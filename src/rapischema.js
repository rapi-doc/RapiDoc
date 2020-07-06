import { LitElement, html } from 'lit-element';
import { schemaInObjectNotation } from '@/utils/schema-utils';

export default class RapiSchema extends LitElement {
  static get properties() {
    return {
      schemaStyle: { type: String, attribute: 'schema-style' },
      schemaData: { type: Object },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.schemaStyle || !'tree, table,'.includes(`${this.schemaStyle},`)) { this.schemaStyle = 'tree'; }
  }

  handleSlotChange(e) {
    const assignedElements = e.target.assignedElements();
    if (assignedElements.length > 0) {
      const schema = assignedElements[0].textContent;
      this.schemaData = schemaInObjectNotation(JSON.parse(schema), {});
    }
  }

  render() {
    if (!this.schemaData) {
      return html`<slot @slotchange=${this.handleSlotChange}></slot>`;
    }
    if (this.schemaStyle === 'tree') {
      return html`<schema-tree .data='${this.schemaData}'></schema-tree>`;
    }
    if (this.schemaStyle === 'table') {
      return html`<schema-table .data='${this.schemaData}'></schema-table>`;
    }
  }
}

customElements.define('rapi-schema', RapiSchema);
