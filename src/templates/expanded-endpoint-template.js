import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';
import { invalidCharsRegEx } from '@/utils/common-utils';
import { pathSecurityTemplate } from '@/templates/security-scheme-template';
import codeSamplesTemplate from '@/templates/code-samples-template';
import callbackTemplate from '@/templates/callback-template';
import '@/components/api-request';
import '@/components/api-response';

/* eslint-disable indent */

export function expandedEndpointBodyTemplate(data, path) {
  let accept = '';
  for (const respStatus in path.responses) {
    for (const acceptContentType in (path.responses[respStatus].content)) {
      accept = `${accept + acceptContentType}, `;
    }
  }
  accept = accept.replace(/,\s*$/, ''); // remove trailing comma
  const nonEmptyApiKeys = data.resolvedSpec.securitySchemes.filter((v) => (v.finalKeyValue)) || [];
  const codeSampleTabPanel = path.xCodeSamples ? codeSamplesTemplate(path.xCodeSamples) : '';

  return html`
    ${data.renderStyle === 'read' ? html` <div class='divider'></div>` : ''}
    <div class='expanded-endpoint-body observe-me ${path.method} ${path.deprecated ? 'deprecated' : ''} ' id='${path.method}-${path.path.replace(invalidCharsRegEx, '-')}'>
    ${path.deprecated ? html`<div class="bold-text red-text" > DEPRECATED </div>` : ''}
    ${html`
      <h2 class = "${path.deprecated ? 'gray-text' : ''}"> 
        ${path.summary || html`<span class='upper ${path.deprecated ? ' method-fg gray-text' : path.method}  '> ${path.method}</span> ${path.path}`} 
      </h2>
      ${path.summary
        ? html`
          <div class='mono-font regular-font-size' style='padding: 8px 0; color:var(--fg3)'> 
            <span class='regular-font upper method-fg  ${path.deprecated ? ' gray-text' : ` bold-text ${path.method}`} '>${path.method}</span> 
            <span class = '${path.deprecated ? 'gray-text' : ''}'> ${path.path} </span>
          </div>`
        : ''
      }`
    }
    ${path.description ? html`<div class="m-markdown"> ${unsafeHTML(marked(path.description || ''))}</div>` : ''}
    ${pathSecurityTemplate(data, path.security)}
    ${codeSampleTabPanel}
    <div class='expanded-req-resp-container'>
      <api-request  class="request-panel"  
        method = "${path.method}", 
        path = "${path.path}" 
        .parameters = "${path.parameters}" 
        .request_body = "${path.requestBody}"
        .api_keys = "${nonEmptyApiKeys}"
        .servers = "${path.servers}" 
        server-url = "${path.servers && path.servers.length > 0 ? path.servers[0].url : data.selectedServer.computedUrl}" 
        allow-try = "${data.allowTry}"
        accept = "${accept}"
        render-style="${data.renderStyle}" 
        schema-style = "${data.schemaStyle}"
        active-schema-tab = "${data.defaultSchemaTab}"
        schema-expand-level = "${data.schemaExpandLevel}"
        schema-description-expanded = "${data.schemaDescriptionExpanded}"
      > </api-request>

      ${path.callbacks ? callbackTemplate(data, path.callbacks) : ''}

      <api-response
        class = 'response-panel'
        .responses="${path.responses}"
        render-style="${data.renderStyle}"
        schema-style="${data.schemaStyle}"
        active-schema-tab = "${data.defaultSchemaTab}"
        schema-expand-level = "${data.schemaExpandLevel}"
        schema-description-expanded = "${data.schemaDescriptionExpanded}"
        selected-status = "${Object.keys(path.responses)[0]}"
      > </api-response>
    </div>
  </div>
  `;
}

export default function expandedEndpointTemplate(data) {
  return html`
  ${data.resolvedSpec.tags.map((tag) => html`
    <div id="${tag.name.replace(invalidCharsRegEx, '-')}" class='regular-font section-gap--read-mode observe-me' style="border-top:1px solid var(--primary-color);">
      <div class="title tag">${tag.name}</div>
      <div class="regular-font-size">
        ${unsafeHTML(`<div class='m-markdown regular-font'>${marked(tag.description ? tag.description : '')}</div>`)}
      </div>
    </div>
    <div class='regular-font section-gap--read-mode'>
      ${tag.paths.map((path) => expandedEndpointBodyTemplate(data, path))}
    </div>
    `)
  }
`;
}
/* eslint-enable indent */
