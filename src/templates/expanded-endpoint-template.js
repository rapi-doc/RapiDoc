import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';
import '@/components/api-request';
import '@/components/api-response';

/* eslint-disable indent */
function callbackTemplate(callbacks) {
  const callbackPaths = [];
  Object.keys(callbacks).forEach((cb) => {
    Object.keys(callbacks[cb]).forEach((p) => {
      callbackPaths.push({
        path: p,
      });
    });
  });

  return html`
    <div class="req-res-title">CALLBACKS</div>
  `;
}

function endpointBodyTemplate(path) {
  let accept = '';
  for (const respStatus in path.responses) {
    for (const acceptContentType in (path.responses[respStatus].content)) {
      accept = `${accept + acceptContentType}, `;
    }
  }
  accept = accept.replace(/,\s*$/, ''); // remove trailing comma
  const nonEmptyApiKeys = this.resolvedSpec.securitySchemes.filter((v) => (v.finalKeyValue)) || [];
  return html`
  <div class='divider'></div>
  <div class='expanded-endpoint-body observe-me ${path.method}' id='${path.method}-${path.path.replace(/[\s#:?&=]/g, '-')}' >
    ${html`
      <h1> ${path.summary || html`<span class='upper method-fg ${path.method}'> ${path.method}</span> ${path.path}`} </h1>
      ${path.summary
        ? html`
          <div class='mono-font regular-font-size' style='padding: 8px 0; color:var(--fg3)'> 
            <span class='regular-font upper bold-text method-fg ${path.method}'>${path.method}</span> 
            ${path.path} 
          </div>`
        : ''
      }
    `
    }
    ${path.description
      ? html`
          <div class="m-markdown"> 
            ${unsafeHTML(marked(path.description || ''))}
          </div>`
      : ''
    }
    <div class='expanded-req-resp-container'>
      <api-request  class="request-panel"  
        method = "${path.method}", 
        path = "${path.path}" 
        .parameters = "${path.parameters}" 
        .request_body = "${path.requestBody}"
        .api_keys = "${nonEmptyApiKeys}"
        server-url = "${this.selectedServer.computedUrl}" 
        allow-try = "${this.allowTry}"
        accept = "${accept}"
        render-style="${this.renderStyle}" 
        schema-style = "${this.schemaStyle}"
        active-schema-tab = "${this.defaultSchemaTab}"
        schema-expand-level = "${this.schemaExpandLevel}"
        schema-description-expanded = "${this.schemaDescriptionExpanded}"
      > </api-request>

      ${path.callbacks ? callbackTemplate.call(this, path.callbacks) : ''}

      <api-response
        class = 'response-panel'
        .responses="${path.responses}"
        render-style="${this.renderStyle}"
        schema-style="${this.schemaStyle}"
        active-schema-tab = "${this.defaultSchemaTab}"
        schema-expand-level = "${this.schemaExpandLevel}"
        schema-description-expanded = "${this.schemaDescriptionExpanded}"
      > </api-response>
    </div>
  </div>
  `;
}

export default function expandedEndpointTemplate() {
  return html`
  ${this.resolvedSpec.tags.map((tag) => html`
    <div id="${tag.name.replace(/[\s#:?&=]/g, '-')}" class='regular-font section-gap--read-mode observe-me' style="border-top:1px solid var(--primary-color);">
      <div class="title tag">${tag.name}</div>
      <div class="regular-font-size">
        ${unsafeHTML(`<div class='m-markdown regular-font'>${marked(tag.description ? tag.description : '')}</div>`)}
      </div>
    </div>
    <div class='regular-font section-gap--read-mode'>
      ${tag.paths.map((path) => endpointBodyTemplate.call(this, path))}
    </div>
    `)
  }
`;
}
