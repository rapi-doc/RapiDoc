import { LitElement, html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import FlexStyles from '@/styles/flex-styles';
import InputStyles from '@/styles/input-styles';
import FontStyles from '@/styles/font-styles';
import BorderStyles from '@/styles/border-styles';
import TabStyles from '@/styles/tab-styles';
import PrismStyles from '@/styles/prism-styles';
import '@/components/json-tree';
import '@/components/schema-tree';
import '@/components/tag-input';
import marked from 'marked';

export default class TabPanel extends LitElement {
  constructor() {
    super();
    this.panelsString = '';
    this.activeResponseTab = '';
  }

  static get properties() {
    return {
      panelsString: { type: String, attribute: 'panels' },
      activeResponseTab: { type: String, attribute: 'active-panel-id' },
    };
  }

  render() {
    const panels = JSON.parse(this.panelsString);
    let buttons = '';
    let content = '';
    panels.forEach((item) => {
      buttons += `<button class="tab-btn ${this.activeResponseTab === item.id ? 'active' : ''}"  data-tab = '${item.id}' > ${item.label}</button>`;
      content += `<div class="tab-content col m-markdown" style="flex:1;display:${this.activeResponseTab === item.id ? 'flex' : 'none'};" >${marked(item.markdown)}</div>`;
    });
    return html`
    ${InputStyles}
    ${FontStyles}
    ${FlexStyles}
    ${BorderStyles}
    ${TabStyles}
    ${PrismStyles}
    <div class="tab-panel col" style="border-width:0 0 1px 0;">
          <div id="tab_buttons" class="tab-buttons row" @click="${(e) => { this.activeResponseTab = e.target.dataset.tab; }}">
            ${unsafeHTML(buttons)}
          </div>
          ${unsafeHTML(content)}
    </div>
    `;
  }
}

// Register the element with the browser
customElements.define('tab-panel', TabPanel);
