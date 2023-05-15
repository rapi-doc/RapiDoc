import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import { marked } from 'marked';
import { rapidocApiKey, downloadResource, viewResource } from '../utils/common-utils';
import { pathSecurityTemplate } from './security-scheme-template';
import codeSamplesTemplate from './code-samples-template';
import callbackTemplate from './callback-template';
import '../components/api-request';
import '../components/api-response';
import '../components/content-copy-button';
import processPathDescription from '../utils/magic-block-utils';
import { joinURLandPath } from '../utils/url';

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
  const nonEmptyApiKeys = this.resolvedSpec.securitySchemes.filter((v) => (v.finalKeyValue && path.security?.some((ps) => (v.securitySchemeId in ps)))) || [];

  // If a RapiDoc API Key is specified on the element and its value is not hyphen(-) then include it for all paths
  const rapiDocApiKey = this.resolvedSpec.securitySchemes.find((v) => (v.securitySchemeId === rapidocApiKey && v.value !== '-'));
  if (rapiDocApiKey) {
    nonEmptyApiKeys.push(rapiDocApiKey);
  }

  const docUrl = `https://developers.vtex.com/docs/api-reference/${this.specUrl.split('/')[3]}`;

  const codeSampleTabPanel = path.xCodeSamples ? codeSamplesTemplate.call(this, path.xCodeSamples) : '';
  path.description = processPathDescription(path.description);
  return html`
    ${this.renderStyle === 'read' ? html`<div class='divider' part="operation-divider"></div>` : ''}
    <div class='expanded-endpoint-body observe-me ${path.method} ${path.deprecated ? 'deprecated' : ''} ' part="section-operation ${path.elementId}">
    <span part="anchor-endpoint" id='${path.elementId}'></span>
      ${(this.renderStyle === 'focused' && tagName !== 'General ⦂') ? html`
      <h3 class="operation-tag" style="margin-bottom:32px; color: #6b7785" part="section-operation-tag"> <a href="${docUrl}" style="text-decoration: none; color: #6b7785">${this.resolvedSpec.info.title}</a>  ›  ${tagName} </h3>
      ` : ''}
      ${path.deprecated ? html`<div class="bold-text red-text"> DEPRECATED </div>` : ''}
      ${html`
        ${path.xBadges && path.xBadges?.length > 0
        ? html`
            <div style="display:flex; flex-wrap:wrap; margin-bottom: -24px; font-size: var(--font-size-small);">
              ${path.xBadges.map((v) => (
          html`<span style="margin:1px; margin-right:5px; padding:1px 8px; font-weight:bold; border-radius:12px;  background-color: var(--light-${v.color}, var(--input-bg)); color:var(--${v.color}); border:1px solid var(--${v.color})">${v.label}</span>`
        ))
          }
            </div>
            `
        : ''
      }
        ${(this.specUrl && this.allowSpecFileDownload) ? html`<div style="position:absolute; right:0; top:28px;"><div style="display:flex; justify-content: flex-end; margin:0px 0px 32px; gap:8px; flex-wrap: wrap;">
                <button class="m-btn m-btn-tertiary thin-border" part="btn btn-outline" @click='${(e) => { downloadResource(this.specUrl, 'openapi-spec.json', e); }}'>Download OpenAPI spec</button>
                  <button class="m-btn m-btn-secondary thin-border" part="btn btn-outline" @click='${(e) => { viewResource(this.specUrl, e); }}'>View OpenAPI spec</button>
              </div></div>` : ''}
        <h2 part="section-operation-summary"> ${path.shortSummary || `${path.method.toUpperCase()} ${path.path}`}</h2>
        ${path.isWebhook
        ? html`<span part="section-operation-webhook" style="color:var(--primary-color); font-weight:bold; font-size: var(--font-size-regular);"> WEBHOOK </span>`
        : html`
            <div class='mono-font regular-font-size label-operation-container' part="section-operation-webhook-method">
              <div class='label-operation-method-container' style='border-color: var(--${path.method}-border-color); background-color: var(--${path.method}-bg-color);'>
                <span part="label-operation-method" class='regular-font upper method-fg bold-text ${path.method}'>${path.method}</span>
              </div>
              <div class='label-operation-path-container'>
                <content-copy-button id='${path.method}${path.path}' content='${joinURLandPath(this.selectedServer.url, path.path)}'></content-copy-button>
              </div>
            </div>
          `
      }
        <slot name="${path.elementId}"></slot>`
    }
      ${path.description ? html`<div class="m-markdown"> ${unsafeHTML(marked(path.description))}</div>` : ''}
      <!-- ${pathSecurityTemplate.call(this, path.security)} -->
      ${codeSampleTabPanel}
      <div class='expanded-req-resp-container'>
        <api-request
          class = "${this.renderStyle}-mode"
          style = "width:100%;"
          schema-short-summary = "${path.shortSummary}"
          webhook = "${path.isWebhook}"
          method = "${path.method}"
          path = "${path.path}"
          .security = "${path.security}"
          .parameters = "${path.parameters}"
          .request_body = "${path.requestBody}"
          .api_keys = "${nonEmptyApiKeys}"
          .servers = "${path.servers}"
          .resolvedSpec="${this.resolvedSpec}"
          .selectedServer="${this.selectedServer}"
          server-url = "${path.servers?.[0]?.url || this.selectedServer.computedUrl}"
          fill-request-fields-with-example = "${this.fillRequestFieldsWithExample}"
          allow-try = "${this.allowTry}"
          show-curl-before-try = "${this.showCurlBeforeTry}"
          accept = "${accept}"
          render-style="${this.renderStyle}" 
          schema-style = "${this.schemaStyle}"
          active-schema-tab = "${this.defaultSchemaTab}"
          schema-expand-level = "${this.schemaExpandLevel}"
          schema-description-expanded = "${this.schemaDescriptionExpanded}"
          allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
          schema-hide-read-only = "${this.schemaHideReadOnly === 'never' ? 'false' : path.isWebhook ? 'false' : 'true'}"
          schema-hide-write-only = "${this.schemaHideWriteOnly === 'never' ? 'false' : path.isWebhook ? 'true' : 'false'}"
          fetch-credentials = "${this.fetchCredentials}"
          exportparts = "wrap-request-btn:wrap-request-btn, btn:btn, btn-fill:btn-fill, btn-outline:btn-outline, btn-try:btn-try, btn-clear:btn-clear, btn-clear-resp:btn-clear-resp,
            file-input:file-input, textbox:textbox, textbox-param:textbox-param, textarea:textarea, textarea-param:textarea-param, 
            anchor:anchor, anchor-param-example:anchor-param-example, schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
          spec-url="${this.specUrl}"
          allow-spec-file-download="${this.allowSpecFileDownload}"
        > </api-request>

        ${path.callbacks ? callbackTemplate.call(this, path.callbacks) : ''}

        <api-response
          class = "${this.renderStyle}-mode"
          style = "width:100%;"
          webhook = "${path.isWebhook}"
          .responses = "${path.responses}"
          render-style = "${this.renderStyle}"
          schema-style = "${this.schemaStyle}"
          active-schema-tab = "${this.defaultSchemaTab}"
          schema-expand-level = "${this.schemaExpandLevel}"
          schema-description-expanded = "${this.schemaDescriptionExpanded}"
          allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
          schema-hide-read-only = "${this.schemaHideReadOnly === 'never' ? 'false' : path.isWebhook ? 'true' : 'false'}"
          schema-hide-write-only = "${this.schemaHideWriteOnly === 'never' ? 'false' : path.isWebhook ? 'false' : 'true'}"
          selected-status = "${Object.keys(path.responses || {})[0] || ''}"
          exportparts = "btn:btn, btn-response-status:btn-response-status, btn-selected-response-status:btn-selected-response-status, btn-fill:btn-fill, btn-copy:btn-copy,
          schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
        > </api-response>
      </div>
    </div>
  `;
}

export default function expandedEndpointTemplate() {
  if (!this.resolvedSpec) { return ''; }
  return html`
  ${this.resolvedSpec.tags.map((tag) => html`
    <section id="${tag.elementId}" part="section-tag" class="regular-font section-gap--read-mode observe-me" style="border-top:1px solid var(--primary-color);">
      <div class="title tag" part="section-tag-title label-tag-title">${tag.name}</div>
      <slot name="${tag.elementId}"></slot>
      <div class="regular-font-size">
      ${unsafeHTML(`
          <div class="m-markdown regular-font">
          ${marked(tag.description || '', this.infoDescriptionHeadingsInNavBar === 'true' ? { renderer: headingRenderer(tag.elementId) } : undefined)}
        </div>`)
    }
      </div>
    </section>
    <section class="regular-font section-gap--read-mode" part="section-operations-in-tag">
      ${tag.paths.map((path) => expandedEndpointBodyTemplate.call(this, path))}
    </section>
    `)
    }
`;
}
/* eslint-enable indent */
