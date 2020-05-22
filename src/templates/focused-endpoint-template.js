import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';
import { invalidCharsRegEx } from '@/utils/common-utils';
import { pathSecurityTemplate } from '@/templates/security-scheme-template';
import codeSamplesTemplate from '@/templates/code-samples-template';
import { callbackTemplate } from '@/templates/expanded-endpoint-template';

import '@/components/api-request';
import '@/components/api-response';

/* eslint-disable indent */
function focusedTagBodyTemplate(data, tag) {
  return html`
    <h1 id="tag-${tag.name}">${tag.name}</h1>
    ${tag.description ? html`<div class="m-markdown"> ${unsafeHTML(marked(tag.description || ''))}</div>` : ''}
  `;
}

function focusedPathBodyTemplate(data, path) {
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

export default function focusedEndpointTemplate(data) {
  let itemToFocus = '';
  let selectedPathObj = {};
  let selectedTagObj = {};
  let i = 0;
  if (data.selectedContentId) {
    itemToFocus = data.selectedContentId;
  } else {
    itemToFocus = 'overview';
  }
  if (itemToFocus === 'overview' || itemToFocus === 'authentication' || itemToFocus === 'api-servers') {
    selectedPathObj = {};
    selectedTagObj = {};
  } else if (itemToFocus.startsWith('tag-')) {
    const tag = itemToFocus.replace('tag-', '');
    selectedTagObj = data.resolvedSpec.tags.find((v) => v.name === tag);
  } else {
    for (i = 0; i < data.resolvedSpec.tags.length; i += 1) {
      selectedPathObj = data.resolvedSpec.tags[i].paths.find((v) => `${v.method}-${v.path}` === itemToFocus);
      selectedTagObj = data.resolvedSpec.tags[i];
      if (selectedPathObj) {
        break;
      }
    }
  }

  return html`
    ${itemToFocus === 'overview' || itemToFocus === 'authentication' || itemToFocus === 'api-servers'
      ? html``
      : itemToFocus.startsWith('tag-')
        ? html`
          <div class='regular-font section-gap--focused-mode'>
            ${focusedTagBodyTemplate(data, selectedTagObj)}
          </div>`
        : html`
          <div class='regular-font section-gap--focused-mode'>
            ${focusedPathBodyTemplate(data, selectedPathObj)}
          </div>
        `
    }
  `;
}
/* eslint-enable indent */
