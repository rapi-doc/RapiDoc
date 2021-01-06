/* eslint-disable no-console */
import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';
import '@/components/json-tree';
import '@/components/schema-tree';

function componentBodyTemplate(sComponent) {
  return html`
  <div class='divider'></div>
  <div class='expanded-endpoint-body observe-me ${sComponent.name}' id='cmp-${sComponent.id}' >
    ${html`
      <h1> ${sComponent.name} </h1>
      ${sComponent.component
    ? html`
      <div class='mono-font regular-font-size' style='padding: 8px 0; color:var(--fg2)'> 
        
      <json-tree
        class="border tree"
        render-style='${this.renderStyle}'
        .data="${sComponent.component}"
      ></json-tree>
        
      </div>`
    : ''}
    `}
    
  </div>
  `;
}

export default function componentsTemplate() {
  return html`
  ${this.resolvedSpec.components.map((component) => html`
    <div id="cmp-${component.name.toLowerCase()}" class='regular-font section-gap--read-mode observe-me' style="border-top:1px solid var(--primary-color);">
      <div class="title tag">${component.name}</div>
      <div class="regular-font-size">
        ${unsafeHTML(`<div class='m-markdown regular-font'>${marked(component.description ? component.description : '')}</div>`)}
      </div>
    </div>
    <div class='regular-font section-gap--read-mode'>
      ${component.subComponents.map((sComponent) => componentBodyTemplate.call(this, sComponent))}
    </div>
    `)
}
`;
}
/* eslint-enable indent */
