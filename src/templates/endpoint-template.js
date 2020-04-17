import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';
import '@/components/api-request';
import '@/components/api-response';
import codeSamplesTemplate from '@/templates/code-samples-template';
import { pathSecurityTemplate } from '@/templates/security-scheme-template';
import { pathIsInSearch, invalidCharsRegEx } from '@/utils/common-utils';
import { callbackTemplate } from '@/templates/expanded-endpoint-template';

/* eslint-disable indent */
function toggleExpand(path) {
  if (path.expanded) {
    path.expanded = false; // collapse
    window.history.replaceState(null, null, `${window.location.href.split('#')[0]}`);
  } else {
    path.expanded = true; // Expand
    const newHash = `#${path.method}-${path.path.replace(invalidCharsRegEx, '-')}`;
    const currentHash = window.location.hash;
    if (currentHash !== newHash) {
      window.history.replaceState(null, null, `${window.location.href.split('#')[0]}${newHash}`);
    }
  }
  this.requestUpdate();
}

function endpointHeadTemplate(path) {
  return html`
  <div @click="${(e) => { toggleExpand.call(this, path, e); }}" class='endpoint-head ${path.method} ${path.deprecated ? 'deprecated' : ''} ${path.expanded ? 'expanded' : 'collapsed'}'>
    <div class="method ${path.method} ${path.deprecated ? 'deprecated' : ''}"> ${path.method} </div> 
    <div class="path ${path.deprecated ? 'deprecated' : ''}"> 
      ${path.path} 
    </div>
    ${path.deprecated
      ? html`
        <span style="font-size:var(--font-size-small); text-transform:uppercase; font-weight:bold; color:var(--red); margin:2px 0 0 5px;"> 
          deprecated 
        </span>`
      : ''
    }
    <div class="only-large-screen" style="min-width:60px; flex:1"></div>
    <div class="m-markdown-small descr"> ${unsafeHTML(marked(path.summary || ''))} </div>
  </div>
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
  const codeSampleTabPanel = path.xCodeSamples ? codeSamplesTemplate(path.xCodeSamples) : '';

  const nonEmptyApiKeys = this.resolvedSpec.securitySchemes.filter((v) => (v.finalKeyValue)) || [];
  return html`
  <div class='endpoint-body ${path.method} ${path.deprecated ? 'deprecated' : ''}'>
    <div class="summary">
      ${path.summary && path.summary !== path.description ? html`<div class="title">${path.summary}</div>` : ''}
      ${path.description ? html`<div class="m-markdown"> ${unsafeHTML(marked(path.description))}</div>` : ''}
      ${pathSecurityTemplate.call(this, path.security)}
      ${codeSampleTabPanel}
    </div>  
    <div class='req-resp-container'> 
      <api-request  class="request"  
        method = "${path.method}", 
        path = "${path.path}" 
        .parameters = "${path.parameters}"
        .request_body = "${path.requestBody}"
        .api_keys = "${nonEmptyApiKeys}"
        .servers = "${path.servers}" 
        server-url = "${path.servers && path.servers.length > 0 ? path.servers[0].url : this.selectedServer.computedUrl}" 
        active-schema-tab = "${this.defaultSchemaTab}" 
        allow-try = "${this.allowTry}"
        accept = "${accept}"
        render-style="${this.renderStyle}" 
        schema-style = "${this.schemaStyle}" 
        schema-expand-level = "${this.schemaExpandLevel}"
        schema-description-expanded = "${this.schemaDescriptionExpanded}"
      > 
        ${path.callbacks ? callbackTemplate.call(this, path.callbacks) : ''}
      </api-request>
      <api-response  
        class="response" 
        .responses="${path.responses}"
        active-schema-tab = "${this.defaultSchemaTab}" 
        render-style="${this.renderStyle}" 
        schema-style="${this.schemaStyle}"
        schema-expand-level = "${this.schemaExpandLevel}"
        schema-description-expanded = "${this.schemaDescriptionExpanded}"
      > </api-response>
    </div>
  </div>`;
}

export default function endpointTemplate() {
  return html`
    ${this.resolvedSpec.tags.map((tag) => html`
    <div class='regular-font section-gap section-tag ${tag.expanded ? 'expanded' : 'collapsed'}' > 
    
      <div class='section-tag-header' @click="${() => { tag.expanded = !tag.expanded; this.requestUpdate(); }}">
        <div id='${tag.name.replace(invalidCharsRegEx, '-')}' class="sub-title tag">${tag.name}</div>
      </div>
      <div class='section-tag-body'>
        <div class="regular-font regular-font-size m-markdown" style="padding-bottom:12px">
          ${unsafeHTML(marked(tag.description || ''))}
        </div>
        ${tag.paths.filter((v) => {
          if (this.matchPaths) {
            return pathIsInSearch(this.matchPaths, v);
          }
          return true;
          }).map((path) => html`
          <div id='${path.method}-${path.path.replace(invalidCharsRegEx, '-')}' class='m-endpoint regular-font ${path.method} ${path.expanded ? 'expanded' : 'collapsed'}'>
            ${endpointHeadTemplate.call(this, path)}      
            ${path.expanded ? endpointBodyTemplate.call(this, path) : ''}
          </div>`)
        }
      </div>
    </div>
  `)
  }`;
}
/* eslint-enable indent */
