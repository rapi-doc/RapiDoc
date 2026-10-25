/**
 * Renders all API operations in an expanded continuous documentation layout grouped by tags.
 */
import { fixRenderedAnchorLinks } from '~/utils/markdown-utils';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { sanitizeHTML } from '../utils/sanitize.js';
import { marked } from 'marked';
import Slugger from 'github-slugger';
import { rapidocApiKey } from '~/utils/common-utils';
import { pathSecurityTemplate } from '~/templates/security-scheme-template';
import codeSamplesTemplate from '~/templates/code-samples-template';
import callbackTemplate from '~/templates/callback-template';
import '~/components/api-request';
import '~/components/api-response';

function headingRenderer(tagElementId) {
  const slugger = new Slugger();
  const renderer = new marked.Renderer();
  renderer.heading = ({ text, depth }) => `<h${depth} class="observe-me" id="${tagElementId}--${slugger.slug(text)}">${text}</h${depth}>`;
  fixRenderedAnchorLinks(renderer);
  return renderer;
}

export function expandedEndpointBodyTemplate(path, tagName = '', tagDescription = '', isFirst = false) {
  const acceptContentTypes = new Set();
  for (const respStatus in path.responses) {
    for (const acceptContentType in path.responses[respStatus]?.content) {
      acceptContentTypes.add(acceptContentType.trim());
    }
  }
  const accept = [...acceptContentTypes].join(', ');

  // Filter API Keys that are non-empty and are applicable to the the path
  const nonEmptyApiKeys =
    this.resolvedSpec.securitySchemes.filter((v) => v.finalKeyValue && path.security?.some((ps) => v.securitySchemeId in ps)) || [];

  // If a RapiDoc API Key is specified on the element and its value is not hyphen(-) then include it for all paths
  const rapiDocApiKey = this.resolvedSpec.securitySchemes.find((v) => v.securitySchemeId === rapidocApiKey && v.value !== '-');
  if (rapiDocApiKey) {
    nonEmptyApiKeys.push(rapiDocApiKey);
  }

  const codeSampleTabPanel = path.xCodeSamples ? codeSamplesTemplate.call(this, path.xCodeSamples) : '';
  return html`
    ${this.renderStyle === 'read' && !isFirst ? html`<div class="divider" part="operation-divider"></div>` : ''}
    <div
      class="expanded-endpoint-body observe-me ${path.method} ${path.deprecated ? 'deprecated' : ''} "
      part="section-operation ${path.elementId}"
      id="${path.elementId}"
      data-first-operation-in-tag="${isFirst ? 'true' : undefined}"
    >
      ${
        this.renderStyle === 'focused' && tagName
          ? html`
              <div class="tag-container" part="section-operation-tag" style="margin-bottom: 16px;">
                <h2 class="rapidoc-heading upper" part="heading heading-2" style="font-size:var(--h3-font-size); margin:0;">${tagName}</h2>
                ${
                  isFirst && tagDescription
                    ? html`
                        <div
                          class="tag-description regular-font"
                          part="section-tag-description"
                          style="margin-top:12px; padding:12px 14px; background:var(--code-bg); border-radius:min(var(--radius), 0.5rem); border:1px solid var(--border);"
                        >
                          <div class="m-markdown">${unsafeHTML(sanitizeHTML(marked(tagDescription)))}</div>
                        </div>
                      `
                    : ''
                }
              </div>
            `
          : ''
      }
      ${path.deprecated ? html`<div class="bold-text red-text">DEPRECATED</div>` : ''}
      ${html` ${
          path.xBadges && path.xBadges?.length > 0
            ? html`
                <div style="display:flex; flex-wrap:wrap; margin-bottom: -24px; font-size: var(--font-size-small);">
                  ${path.xBadges.map((v) =>
                    v.color === 'none'
                      ? ''
                      : html`<span
                          style="margin:1px; margin-right:5px; padding:1px 8px; font-weight:bold; border-radius:var(--radius); background: color-mix(in srgb, var(--${v.color}) 10%, transparent); color:var(--${v.color}); border:1px solid var(--${v.color})"
                          >${v.label}</span
                        >`
                  )}
                </div>
              `
            : ''
        }
        <h3 class="rapidoc-heading operation-summary" part="section-operation-summary heading heading-3">
          ${path.shortSummary || `${path.method.toUpperCase()} ${path.path}`}
        </h3>
        ${
          path.isWebhook
            ? html`<span
                part="section-operation-webhook"
                style="color:var(--primary); font-weight:bold; font-size: var(--font-size-regular);"
              >
                WEBHOOK
              </span>`
            : html`
                <div
                  part="section-operation-webhook-method"
                  class="mono-font regular-font-size"
                  style="text-align:left; direction:ltr; padding: 8px 0; color:var(--muted-foreground)"
                >
                  <span part="label-operation-method" class="regular-font upper method-fg bold-text ${path.method}">${path.method}</span>
                  <span style="overflow-wrap: break-word;" part="label-operation-path">${path.path}</span>
                </div>
              `
        }
        ${pathSecurityTemplate.call(this, path.security, path.elementId)}
        <slot name="${path.elementId}"></slot>`}
      ${path.description ? html`<div class="m-markdown">${unsafeHTML(sanitizeHTML(marked(path.description)))}</div>` : ''}
      ${
        path.externalDocs?.url || path.externalDocs?.description
          ? html`<div class="external-docs-box">
              <div class="m-markdown">${unsafeHTML(sanitizeHTML(marked(path.externalDocs?.description || '')))}</div>
              ${
                path.externalDocs?.url
                  ? html`<a class="external-docs-link" href="${path.externalDocs?.url}" target="_blank">
                      ${path.externalDocs?.url}
                      <span class="external-docs-arrow">⇲</span>
                    </a>`
                  : ''
              }
            </div>`
          : ''
      }
      ${codeSampleTabPanel}
      <div class="req-resp-container expanded-req-resp-container ${this.layout}-layout" part="section-req-resp-container">
        <div class="request-panel view-mode-request ${this.renderStyle}-mode ${this.layout}-layout" part="section-request-panel">
          <api-request
            .config="${this.config}"
            class="${this.renderStyle}-mode ${this.layout}-layout"
            style="width:100%;"
            webhook="${path.isWebhook}"
            method="${path.method}"
            path="${path.path}"
            .security="${path.security}"
            .parameters="${path.parameters}"
            .request_body="${path.requestBody}"
            .api_keys="${nonEmptyApiKeys}"
            .servers="${path.servers}"
            server-url="${path.servers?.[0]?.url || this.selectedServer?.computedUrl}"
            fill-request-fields-with-example="${this.fillRequestFieldsWithExample}"
            allow-try="${this.allowTry}"
            show-curl-before-try="${this.showCurlBeforeTry}"
            accept="${accept}"
            render-style="${this.renderStyle}"
            schema-style="${this.schemaStyle}"
            active-schema-tab="${this.defaultSchemaTab}"
            schema-expand-level="${this.schemaExpandLevel}"
            schema-description-expanded="${this.schemaDescriptionExpanded}"
            allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
            schema-hide-read-only="${this.schemaHideReadOnly === 'never' ? 'false' : path.isWebhook ? 'false' : 'true'}"
            schema-hide-write-only="${this.schemaHideWriteOnly === 'never' ? 'false' : path.isWebhook ? 'true' : 'false'}"
            fetch-credentials="${this.fetchCredentials}"
            exportparts="section-request-title:section-request-title, heading:heading, heading-4:heading-4, heading-5:heading-5, heading-6:heading-6,
            wrap-request-btn:wrap-request-btn, btn:btn, btn-fill:btn-fill, btn-outline:btn-outline, btn-try:btn-try, btn-clear:btn-clear, btn-clear-resp:btn-clear-resp,
            tab-panel:tab-panel, tab-btn:tab-btn, tab-btn-row:tab-btn-row, tab-content:tab-content, 
            file-input:file-input, textbox:textbox, textbox-param:textbox-param, textarea:textarea, textarea-param:textarea-param, 
            anchor:anchor, anchor-param-example:anchor-param-example, anchor-param-constraint:anchor-param-constraint, param-list:param-list, param:param, param-label:param-label, param-name:param-name, param-type:param-type, param-input:param-input, param-constraint:param-constraint, param-constraint-label:param-constraint-label, param-details:param-details, param-example-list:param-example-list, value-list:value-list, value-list-label:value-list-label, value-list-items:value-list-items, schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
          >
          </api-request>

          ${path.callbacks ? callbackTemplate.call(this, path.callbacks) : ''}
        </div>

        <api-response
          .config="${this.config}"
          class="response-panel ${this.renderStyle}-mode ${this.layout}-layout"
          style="width:100%;"
          webhook="${path.isWebhook}"
          .responses="${path.responses}"
          render-style="${this.renderStyle}"
          schema-style="${this.schemaStyle}"
          active-schema-tab="${this.defaultSchemaTab}"
          schema-expand-level="${this.schemaExpandLevel}"
          schema-description-expanded="${this.schemaDescriptionExpanded}"
          allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
          schema-hide-read-only="${this.schemaHideReadOnly === 'never' ? 'false' : path.isWebhook ? 'true' : 'false'}"
          schema-hide-write-only="${this.schemaHideWriteOnly === 'never' ? 'false' : path.isWebhook ? 'false' : 'true'}"
          selected-status="${Object.keys(path.responses || {})[0] || ''}"
          exportparts="section-response-title:section-response-title, heading:heading, heading-4:heading-4, heading-5:heading-5, heading-6:heading-6,
            btn:btn, btn-response-status:btn-response-status, btn-selected-response-status:btn-selected-response-status, btn-fill:btn-fill, btn-outline:btn-outline, btn-copy:btn-copy,
          tab-panel:tab-panel, tab-btn:tab-btn, tab-btn-row:tab-btn-row, tab-content:tab-content, 
          schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle, param-list:param-list, param:param, param-label:param-label, param-name:param-name, param-type:param-type, param-constraint:param-constraint, param-constraint-label:param-constraint-label, param-details:param-details, param-example-list:param-example-list, value-list:value-list, value-list-label:value-list-label, value-list-items:value-list-items"
        >
        </api-response>
      </div>
    </div>
  `;
}

export default function expandedEndpointTemplate() {
  if (!this.resolvedSpec) {
    return '';
  }

  const renderTagSections = (tag) => html`
    <section id="${tag.elementId}" part="section-tag" class="regular-font section-gap--read-mode observe-me read-mode-tag">
      <h2 class="rapidoc-heading title tag" part="section-tag-title label-tag-title heading heading-2">${tag.displayName || tag.name}</h2>
      <slot name="${tag.elementId}"></slot>
      ${unsafeHTML(`
        <div class="m-markdown regular-font">
          ${sanitizeHTML(
            marked(
              tag.description || '',
              this.infoDescriptionHeadingsInNavBar === 'true' ? { renderer: headingRenderer(tag.elementId) } : undefined
            )
          )}
        </div>`)}
    </section>
    <section class="regular-font section-gap--read-mode" part="section-operations-in-tag">
      ${tag.paths.map((path, idx) => expandedEndpointBodyTemplate.call(this, path, tag.name, tag.description, idx === 0))}
    </section>
  `;

  if (this.resolvedSpec.tagGroups && this.resolvedSpec.tagGroups.length > 0) {
    const assignedTagNames = new Set();
    this.resolvedSpec.tagGroups.forEach((group) => {
      (group.tags || []).forEach((tag) => assignedTagNames.add(tag.name.toLowerCase()));
    });
    const remainingTags = (this.resolvedSpec.tags || []).filter((tag) => !assignedTagNames.has(tag.name.toLowerCase()));

    return html`
      ${this.resolvedSpec.tagGroups.map(
        (group) => html`
          <section id="${group.elementId}" part="section-tag-group" class="regular-font section-gap--read-mode observe-me read-mode-group">
            <h2 class="rapidoc-heading title tag-group" part="section-tag-group-title heading heading-2">
              ${group.displayName || group.name}
            </h2>
            ${
              group.description
                ? html`<div class="m-markdown tag-group-description">${unsafeHTML(sanitizeHTML(marked(group.description)))}</div>`
                : ''
            }
          </section>
          ${group.tags.map((tag) => renderTagSections(tag))}
        `
      )}
      ${remainingTags.map((tag) => renderTagSections(tag))}
    `;
  }

  return html`${this.resolvedSpec.tags.map((tag) => renderTagSections(tag))}`;
}
