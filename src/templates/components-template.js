/* eslint-disable no-console */
import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';
import '@/components/json-tree';
import '@/components/schema-tree';

function componentBodyTemplate(data, sComponent) {
  return html`
  <div class='divider'></div>
  <div class='expanded-endpoint-body observe-me ${sComponent.name}' id='cmp-${sComponent.id}' >
    ${html`
      <h1> 
        ${sComponent.name || html`<span class='upper ${sComponent.name}'> ${sComponent.name}</span> ${sComponent.component}`} 
      </h1>
      ${sComponent.component
    ? html`
      <div class='mono-font regular-font-size' style='padding: 8px 0; color:var(--fg3)'> 
        
      <json-tree
        class="border tree"
        render-style='${data.renderStyle}'
        .data="${sComponent.component}"
        isLast="true"
      ></json-tree>
        
      </div>`
    : ''}
    `}
    
  </div>
  `;
}

export default function componentsTemplate(data) {
  return html`
  ${data.resolvedSpec.components.map((component) => html`
    <div id="cmp-${component.name.toLowerCase()}" class='regular-font section-gap--read-mode observe-me' style="border-top:1px solid var(--primary-color);">
      <div class="title tag">${component.name}</div>
      <div class="regular-font-size">
        ${unsafeHTML(`<div class='m-markdown regular-font'>${marked(component.description ? component.description : '')}</div>`)}
      </div>
    </div>
    <div class='regular-font section-gap--read-mode'>
      ${component.subComponents.map((sComponent) => componentBodyTemplate(data, sComponent))}
    </div>
    `)
}
`;
}
/* eslint-enable indent */
