import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';
import { rapidocApiKey } from '~/utils/common-utils';
import { pathSecurityTemplate } from '~/templates/security-scheme-template';
import codeSamplesTemplate from '~/templates/code-samples-template';
import callbackTemplate from '~/templates/callback-template';
import '~/components/api-request';
import '~/components/api-response';

/* eslint-disable indent */
function headingRenderer(tagElementId) {
  const renderer = new marked.Renderer();
  renderer.heading = ((text, level, raw, slugger) => `<h${level} class="observe-me" id="${tagElementId}--${slugger.slug(raw)}">${text}</h${level}>`);
  return renderer;
}

export function expandedEndpointBodyTemplate(path, tagName = '') {
  const acceptContentTypes = new Set();
  for (const respStatus in path.responses) {
    for (const acceptContentType in (path.responses[respStatus]?.content)) {
      acceptContentTypes.add(acceptContentType.trim());
    }
  }
  const accept = [...acceptContentTypes].join(', ');

  // Filter API Keys that are non-empty and are applicable to the the path
  const nonEmptyApiKeys = this.resolvedSpec.securitySchemes.filter((v) => (v.finalKeyValue && path.security?.some((ps) => (v.apiKeyId in ps)))) || [];

  // If a RapiDoc API Key is specified on the element and its value is not hyphen(-) then include it for all paths
  const rapiDocApiKey = this.resolvedSpec.securitySchemes.find((v) => (v.apiKeyId === rapidocApiKey && v.value !== '-'));
  if (rapiDocApiKey) {
    nonEmptyApiKeys.push(rapiDocApiKey);
  }

  const codeSampleTabPanel = path.xCodeSamples ? codeSamplesTemplate.call(this, path.xCodeSamples) : '';
  return html`
    ${this.renderStyle === 'read' ? html`<div class='divider'></div>` : ''}
    <div class='expanded-endpoint-body observe-me ${path.method} ${path.deprecated ? 'deprecated' : ''} ' id='${path.elementId}'>
    ${this.renderStyle === 'focused' ? html`<h3 class="upper" style="font-weight:bold"> ${tagName} </h3>` : ''}
    ${path.deprecated ? html`<div class="bold-text red-text"> DEPRECATED </div>` : ''}
    ${html`
      <h2> ${path.shortSummary || `${path.method.toUpperCase()} ${path.path}`}</h2>
      <div class='mono-font regular-font-size' style='padding: 8px 0; color:var(--fg3)'> 
        <span class='regular-font upper method-fg bold-text ${path.method}'>${path.method}</span> 
        <span>${path.path}</span>
      </div>
      <slot name="${path.elementId}"></slot>`
    }
    ${path.description ? html`<div class="m-markdown"> ${unsafeHTML(marked(path.description))}</div>` : ''}
    ${pathSecurityTemplate.call(this, path.security)}
    ${codeSampleTabPanel}
    <div class='expanded-req-resp-container'>
      <api-request  class="request-panel"
        method = "${path.method}"
        path = "${path.path}"
        .parameters = "${path.parameters}"
        .request_body = "${path.requestBody}"
        .api_keys = "${nonEmptyApiKeys}"
        .servers = "${path.servers}"
        server-url = "${path.servers?.[0]?.url || this.selectedServer.computedUrl}"
        fill-request-fields-with-example = "${this.fillRequestFieldsWithExample}"
        allow-try = "${this.allowTry}"
        accept = "${accept}"
        render-style="${this.renderStyle}" 
        schema-style = "${this.schemaStyle}"
        active-schema-tab = "${this.defaultSchemaTab}"
        schema-expand-level = "${this.schemaExpandLevel}"
        schema-description-expanded = "${this.schemaDescriptionExpanded}"
        schema-hide-read-only = "${this.schemaHideReadOnly}"
      > </api-request>

      ${path.callbacks ? callbackTemplate.call(this, path.callbacks) : ''}

      <api-response
        class = 'response-panel'
        .responses = "${path.responses}"
        render-style = "${this.renderStyle}"
        schema-style = "${this.schemaStyle}"
        active-schema-tab = "${this.defaultSchemaTab}"
        schema-expand-level = "${this.schemaExpandLevel}"
        schema-description-expanded = "${this.schemaDescriptionExpanded}"
        schema-hide-write-only = "${this.schemaHideWriteOnly}"
        selected-status = "${Object.keys(path.responses || {})[0] || ''}"
      > </api-response>
    </div>
  </div>
  `;
}

export default function expandedEndpointTemplate() {
  return html`
  ${this.resolvedSpec.tags.map((tag) => html`
    <section id="${tag.elementId}" class='regular-font section-gap--read-mode observe-me' style="border-top:1px solid var(--primary-color);">
      <div class="title tag">${tag.name}</div>
      <slot name="${tag.elementId}"></slot>
      <div class="regular-font-size">
      ${
        unsafeHTML(`
          <div class="m-markdown regular-font">
          ${marked(tag.description || '', this.infoDescriptionHeadingsInNavBar === 'true' ? { renderer: headingRenderer(tag.elementId) } : undefined)}
        </div>`)
      }
      </div>
    </section>
    <section class='regular-font section-gap--read-mode'>
      ${tag.paths.map((path) => expandedEndpointBodyTemplate.call(this, path, 'BBB'))}
    </section>
    `)
  }
`;
}
/* eslint-enable indent */
