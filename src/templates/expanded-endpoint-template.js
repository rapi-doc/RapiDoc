import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import { marked } from 'marked';
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

function expandCollapseTagDescription(e) {
  const tagDescriptionEl = e.target.closest('.tag-container').querySelector('.tag-description');
  const tagIconEl = e.target.closest('.tag-container').querySelector('.tag-icon');
  if (tagDescriptionEl && tagIconEl) {
    const isExpanded = tagDescriptionEl.classList.contains('expanded');
    if (isExpanded) {
      tagDescriptionEl.style.maxHeight = 0;
      tagDescriptionEl.classList.replace('expanded', 'collapsed');
      tagIconEl.classList.replace('expanded', 'collapsed');
    } else {
      tagDescriptionEl.style.maxHeight = `${tagDescriptionEl.scrollHeight}px`;
      tagDescriptionEl.classList.replace('collapsed', 'expanded');
      tagIconEl.classList.replace('collapsed', 'expanded');
    }
  }
}

export function expandedEndpointBodyTemplate(path, tagName = '', tagDescription = '') {
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

  const codeSampleTabPanel = path.xCodeSamples ? codeSamplesTemplate.call(this, path.xCodeSamples) : '';
  return html`
    ${this.renderStyle === 'read' ? html`<div class='divider' part="operation-divider"></div>` : ''}
    <div class='expanded-endpoint-body observe-me ${path.method} ${path.deprecated ? 'deprecated' : ''} ' part="section-operation ${path.elementId}" id='${path.elementId}'>
      ${(this.renderStyle === 'focused' && tagName !== 'General ⦂')
        ? html`
          <div class="tag-container" part="section-operation-tag"> 
            <span class="upper" style="font-weight:bold; font-size:18px;"> ${tagName} </span>
            ${tagDescription
              ? html`
                <svg class="tag-icon collapsed" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" fill="none" style="stroke:var(--primary-color); vertical-align:top; cursor:pointer"
                @click="${(e) => { expandCollapseTagDescription.call(this, e); }}"
                >
                  <path d="M12 20h-6a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h8"></path><path d="M18 4v17"></path><path d="M15 18l3 3l3 -3"></path>
                </svg>
                <div class="tag-description collapsed" style="max-height:0px; overflow:hidden; margin-top:16px; border:1px solid var(--border-color)"> 
                  <div class="m-markdown" style="padding:8px"> ${unsafeHTML(marked(tagDescription))}</div>  
                </div>`
              : ''
            }  
          </div>
        `
        : ''
      }
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
        <h2 part="section-operation-summary"> ${path.shortSummary || `${path.method.toUpperCase()} ${path.path}`}</h2>
        ${path.isWebhook
          ? html`<span part="section-operation-webhook" style="color:var(--primary-color); font-weight:bold; font-size: var(--font-size-regular);"> WEBHOOK </span>`
          : html`
            <div part="section-operation-webhook-method" class="mono-font regular-font-size" style="text-align:left; direction:ltr; padding: 8px 0; color:var(--fg3)"> 
              <span part="label-operation-method" class="regular-font upper method-fg bold-text ${path.method}">${path.method}</span> 
              <span part="label-operation-path">${path.path}</span>
            </div>
          `
        }
        <slot name="${path.elementId}"></slot>`
      }
      ${path.description ? html`<div class="m-markdown"> ${unsafeHTML(marked(path.description))}</div>` : ''}
      ${pathSecurityTemplate.call(this, path.security)}
      ${path.externalDocs?.url || path.externalDocs?.description
        ? html`<div style="background-color:var(--bg3); padding:2px 8px 8px 8px; margin:8px 0; border-radius:var(--border-radius)"> 
            <div class="m-markdown"> ${unsafeHTML(marked(path.externalDocs?.description || ''))} </div>
            ${path.externalDocs?.url
              ? html`<a style="font-family:var(--font-mono); font-size:var(--font-size-small)" href="${path.externalDocs?.url}" target="_blank">
                  ${path.externalDocs?.url} <div style="transform: rotate(270deg) scale(1.5); display: inline-block; margin-left:5px">⇲</div>
                </a>`
              : ''
            }
          </div>`
        : ''
      }
      ${codeSampleTabPanel}
      <div class='expanded-req-resp-container'>
        <api-request
          class = "${this.renderStyle}-mode"
          style = "width:100%;"
          webhook = "${path.isWebhook}"
          method = "${path.method}"
          path = "${path.path}"
          .security = "${path.security}"
          .parameters = "${path.parameters}"
          .request_body = "${path.requestBody}"
          .api_keys = "${nonEmptyApiKeys}"
          .servers = "${path.servers}"
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
      ${
        unsafeHTML(`
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
