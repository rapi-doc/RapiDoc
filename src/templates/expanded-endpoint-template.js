import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';
import { invalidCharsRegEx } from '@/utils/common-utils';
import { pathSecurityTemplate } from '@/templates/security-scheme-template';
import codeSamplesTemplate from '@/templates/code-samples-template';
import '@/components/api-request';
import '@/components/api-response';

/* eslint-disable indent */
export function callbackTemplate(data, callbacks) {
  return html`
    <div class="req-res-title" style="margin-top:12px">CALLBACKS</div>
    ${Object.entries(callbacks).map((kv) => html`
      <div class="tiny-title" style="padding: 12px; border:1px solid var(--light-border-color)"> 
        ${kv[0]}
        ${Object.entries(kv[1]).map((pathObj) => html`
          <div class="mono-font small-font-size" style="display:flex; margin-left:16px;">
            <div> 
              ${Object.entries(pathObj[1]).map((method) => html`
                <div>
                  <div style="margin-top:12px;">
                    <div class="method method-fg ${method[0]}" style="width:70px; border:none; margin:0; padding:0; line-height:20px; vertical-align: baseline;text-align:left"> 
                      <span style="font-size:20px;"> &#x2944; </span> 
                      ${method[0]} 
                    </div>
                    <span style="line-height:20px; vertical-align: baseline;">${pathObj[0]} </span>
                  </div>  
                  <div class='expanded-req-resp-container'>
                    <api-request  class="request-panel"
                      callback = "true"
                      method = "${method[0]}", 
                      path = "${pathObj[0]}" 
                      .parameters = "${method[1].parameters}" 
                      .request_body = "${method[1].requestBody}"
                      allow-try = "false"
                      render-style="${data.renderStyle}" 
                      schema-style = "${data.schemaStyle}"
                      active-schema-tab = "${data.defaultSchemaTab}"
                      schema-expand-level = "${data.schemaExpandLevel}"
                      schema-description-expanded = "${data.schemaDescriptionExpanded}"
                    > </api-request>

                    <api-response
                      callback = "true"
                      .responses="${method[1].responses}"
                      render-style="${data.renderStyle}"
                      schema-style="${data.schemaStyle}"
                      active-schema-tab = "${data.defaultSchemaTab}"
                      schema-expand-level = "${data.schemaExpandLevel}"
                      schema-description-expanded = "${data.schemaDescriptionExpanded}"
                    > </api-response>
                  </div>
                </div>  
              `)}
            </div>  
          </div>  
        `)}
      </div>  
    `)}
  `;
}

function endpointBodyTemplate(data, path) {
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
  <div class='divider'></div>
  <div class='expanded-endpoint-body observe-me ${path.method} ${path.deprecated ? 'deprecated' : ''} ' id='${path.method}-${path.path.replace(invalidCharsRegEx, '-')}' >
    
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
      ${tag.paths.map((path) => endpointBodyTemplate(data, path))}
    </div>
    `)
  }
`;
}
/* eslint-enable indent */
