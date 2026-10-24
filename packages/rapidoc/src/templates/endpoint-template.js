/**
 * Renders individual API operation rows and expanded panels (summary, description, parameters, request, response, try-it console).
 */
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { sanitizeHTML } from '../utils/sanitize.js';
import { marked } from 'marked';
import '~/components/api-request';
import '~/components/api-response';
import codeSamplesTemplate from '~/templates/code-samples-template';
import callbackTemplate from '~/templates/callback-template';
import { pathSecurityTemplate } from '~/templates/security-scheme-template';
import { getMatchedPaths, rapidocApiKey } from '~/utils/common-utils';

function toggleExpand(path) {
  if (path.expanded) {
    path.expanded = false; // collapse
    if (this.updateRoute === 'true') {
      this.replaceHistoryState('');
    }
  } else {
    path.expanded = true; // Expand
    if (this.updateRoute === 'true') {
      const newHash = `#${path.elementId}`;
      if (window.location.hash !== newHash) {
        this.replaceHistoryState(path.elementId);
      }
    }
  }
  this.requestUpdate();
}

export function expandCollapseAll(operationsRootEl, action = 'expand-all') {
  const groupList = [...operationsRootEl.querySelectorAll('.section-tag-group')];
  const elList = [...operationsRootEl.querySelectorAll('.section-tag')];
  if (action === 'expand-all') {
    groupList.forEach((el) => {
      el.classList.replace('collapsed', 'expanded');
    });
    elList.forEach((el) => {
      el.classList.replace('collapsed', 'expanded');
    });
  } else {
    groupList.forEach((el) => {
      el.classList.replace('expanded', 'collapsed');
    });
    elList.forEach((el) => {
      el.classList.replace('expanded', 'collapsed');
    });
  }
}

function onExpandCollapseAll(e, action = 'expand-all') {
  expandCollapseAll.call(this, e.target.closest('.operations-root'), action);
}

function endpointHeadTemplate(path, pathsExpanded = false) {
  return html`
    <summary
      @click="${(e) => {
        toggleExpand.call(this, path, e);
      }}"
      part="section-endpoint-head-${path.expanded ? 'expanded' : 'collapsed'}"
      class="endpoint-head ${path.method} ${path.deprecated ? 'deprecated' : ''} ${
        pathsExpanded || path.expanded ? 'expanded' : 'collapsed'
      }"
    >
      <div part="section-endpoint-head-method" class="method ${path.method} ${path.deprecated ? 'deprecated' : ''}">${path.method}</div>
      <div part="section-endpoint-head-path" class="path ${path.deprecated ? 'deprecated' : ''}">
        ${path.path}
        ${
          path.isWebhook
            ? html`<span style="font-family: var(--font-sans); font-size: var(--font-size-small); color:var(--primary); margin-left: 16px">
                Webhook</span
              >`
            : ''
        }
      </div>
      ${
        path.deprecated
          ? html` <span
              style="font-size:var(--font-size-small); text-transform:uppercase; font-weight:bold; color:var(--destructive); margin:2px 0 0 5px;"
            >
              deprecated
            </span>`
          : ''
      }
      ${
        this.showSummaryWhenCollapsed
          ? html`<div part="section-endpoint-head-description" class="descr">${path.summary || path.shortSummary}</div>`
          : ''
      }
    </summary>
  `;
}

function endpointBodyTemplate(path) {
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

  const codeSampleTabPanel = path.xCodeSamples ? codeSamplesTemplate(path.xCodeSamples) : '';
  return html` <div
    part="section-endpoint-body-${path.expanded ? 'expanded' : 'collapsed'}"
    class="endpoint-body ${path.method} ${path.deprecated ? 'deprecated' : ''}"
  >
    <div class="summary">
      ${
        path.summary
          ? html`<h3 class="rapidoc-heading title" part="section-endpoint-body-title heading heading-3">${path.summary}</h3>`
          : path.shortSummary !== path.description
            ? html`<h3 class="rapidoc-heading title" part="section-endpoint-body-title heading heading-3">${path.shortSummary}</h3>`
            : html`<h3 class="visually-hidden">${path.method.toUpperCase()} ${path.path}</h3>`
      }
      ${
        path.xBadges && path.xBadges?.length > 0
          ? html`
              <div style="display:flex; flex-wrap:wrap;font-size: var(--font-size-small);">
                ${path.xBadges.map((v) =>
                  v.color === 'none'
                    ? ''
                    : html`<span
                        part="endpoint-badge"
                        style="margin:1px; margin-right:5px; padding:1px 8px; font-weight:bold; border-radius:var(--radius);  background: color-mix(in srgb, var(--${v.color}) 20%, transparent); color:var(--${v.color}); border:1px solid var(--${v.color})"
                        >${v.label}</span
                      >`
                )}
              </div>
            `
          : ''
      }
      ${
        path.description
          ? html`<div part="section-endpoint-body-description" class="m-markdown">
              ${unsafeHTML(sanitizeHTML(marked(path.description)))}
            </div>`
          : ''
      }
      ${pathSecurityTemplate.call(this, path.security, path.elementId)}
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
      <slot name="${path.elementId}"></slot>
      ${codeSampleTabPanel}
    </div>
    <div class="req-resp-container ${this.layout}-layout" part="section-req-resp-container">
      <div class="request-panel view-mode-request ${this.layout}-layout" part="section-request-panel">
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
          server-url="${path.servers?.length > 0 ? path.servers[0].url : this.selectedServer?.computedUrl}"
          active-schema-tab="${this.defaultSchemaTab}"
          fill-request-fields-with-example="${this.fillRequestFieldsWithExample}"
          allow-try="${this.allowTry}"
          show-curl-before-try="${this.showCurlBeforeTry}"
          accept="${accept}"
          render-style="${this.renderStyle}"
          schema-style="${this.schemaStyle}"
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
        part="section-response-panel"
        style="width:100%;"
        webhook="${path.isWebhook}"
        .responses="${path.responses}"
        active-schema-tab="${this.defaultSchemaTab}"
        render-style="${this.renderStyle}"
        schema-style="${this.schemaStyle}"
        schema-expand-level="${this.schemaExpandLevel}"
        schema-description-expanded="${this.schemaDescriptionExpanded}"
        allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
        schema-hide-read-only="${this.schemaHideReadOnly === 'never' ? 'false' : path.isWebhook ? 'true' : 'false'}"
        schema-hide-write-only="${this.schemaHideWriteOnly === 'never' ? 'false' : path.isWebhook ? 'false' : 'true'}"
        selected-status="${Object.keys(path.responses || {})[0] || ''}"
        exportparts="section-response-title:section-response-title, heading:heading, heading-4:heading-4, heading-5:heading-5, heading-6:heading-6,
            btn:btn, btn-fill:btn-fill, btn-outline:btn-outline, btn-try:btn-try, file-input:file-input, 
        textbox:textbox, textbox-param:textbox-param, textarea:textarea, textarea-param:textarea-param, anchor:anchor, anchor-param-example:anchor-param-example, anchor-param-constraint:anchor-param-constraint, param-list:param-list, param:param, param-label:param-label, param-name:param-name, param-type:param-type, param-input:param-input, param-constraint:param-constraint, param-constraint-label:param-constraint-label, param-details:param-details, param-example-list:param-example-list, value-list:value-list, value-list-label:value-list-label, value-list-items:value-list-items, btn-clear-resp:btn-clear-resp,
        tab-panel:tab-panel, tab-btn:tab-btn, tab-btn-row:tab-btn-row, tab-content:tab-content, 
        schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
      >
      </api-response>
    </div>
  </div>`;
}

export default function endpointTemplate(isMini = false, pathsExpanded = false) {
  if (!this.resolvedSpec) {
    return '';
  }
  const renderTagSection = (tag) => html`
    ${
      isMini
        ? html`
            <div class="section-tag-body">
              ${
                tag.description
                  ? html`<div class="regular-font regular-font-size m-markdown" style="padding-bottom:12px">
                      ${unsafeHTML(sanitizeHTML(marked(tag.description || '')))}
                    </div>`
                  : ''
              }
              ${tag.paths
                .filter((path) => {
                  if (this.searchVal) {
                    return getMatchedPaths(this.searchVal, path, tag.name);
                  }
                  return true;
                })
                .map(
                  (path, idx) =>
                    html` <section
                      id="${path.elementId}"
                      class="m-endpoint regular-font ${path.method} ${pathsExpanded || path.expanded ? 'expanded' : 'collapsed'}"
                      data-first-operation-in-tag="${idx === 0 ? 'true' : undefined}"
                    >
                      ${endpointHeadTemplate.call(this, path, pathsExpanded)}
                      ${pathsExpanded || path.expanded ? endpointBodyTemplate.call(this, path) : ''}
                    </section>`
                )}
            </div>
          `
        : html`
            <div class="regular-font section-gap section-tag ${tag.expanded ? 'expanded' : 'collapsed'}">
              <div
                class="section-tag-header"
                @click="${() => {
                  tag.expanded = !tag.expanded;
                  this.requestUpdate();
                }}"
              >
                <h2 id="${tag.elementId}" class="rapidoc-heading sub-title tag" part="heading heading-2" style="color:var(--primary)">
                  ${tag.displayName || tag.name}
                </h2>
              </div>
              <div class="section-tag-body">
                <slot name="${tag.elementId}"></slot>
                ${
                  tag.description
                    ? html`<div class="regular-font regular-font-size m-markdown" style="padding-bottom:12px">
                        ${unsafeHTML(sanitizeHTML(marked(tag.description || '')))}
                      </div>`
                    : ''
                }
                ${tag.paths
                  .filter((v) => {
                    if (this.searchVal) {
                      return getMatchedPaths(this.searchVal, v, tag.name);
                    }
                    return true;
                  })
                  .map(
                    (path, idx) =>
                      html` <section
                        part="section-endpoint"
                        id="${path.elementId}"
                        class="m-endpoint regular-font ${path.method} ${pathsExpanded || path.expanded ? 'expanded' : 'collapsed'}"
                        data-first-operation-in-tag="${idx === 0 ? 'true' : undefined}"
                      >
                        ${endpointHeadTemplate.call(this, path, pathsExpanded)}
                        ${pathsExpanded || path.expanded ? endpointBodyTemplate.call(this, path) : ''}
                      </section>`
                  )}
              </div>
            </div>
          `
    }
  `;

  const hasTagGroups = this.resolvedSpec.tagGroups && this.resolvedSpec.tagGroups.length > 0;
  const assignedTagNames = new Set();
  if (hasTagGroups) {
    this.resolvedSpec.tagGroups.forEach((group) => {
      (group.tags || []).forEach((tag) => assignedTagNames.add(tag.name.toLowerCase()));
    });
  }
  const remainingTags = hasTagGroups ? (this.resolvedSpec.tags || []).filter((tag) => !assignedTagNames.has(tag.name.toLowerCase())) : [];

  return html`${
    isMini
      ? ''
      : html`<div class="section-expand-collapse-container">
          <span @click="${(e) => onExpandCollapseAll(e, 'expand-all')}" style="color:var(--primary); cursor:pointer;"> Expand all </span>
          &nbsp;|&nbsp;
          <span @click="${(e) => onExpandCollapseAll(e, 'collapse-all')}" style="color:var(--primary); cursor:pointer;">
            Collapse all
          </span>
          &nbsp; sections
        </div>`
  }
  ${
    hasTagGroups
      ? html`
          ${this.resolvedSpec.tagGroups.map(
            (group) => html`
              <div class="regular-font section-gap section-tag-group ${group.expanded ? 'expanded' : 'collapsed'}" id="${group.elementId}">
                <div
                  class="section-tag-group-header"
                  @click="${() => {
                    group.expanded = !group.expanded;
                    this.requestUpdate();
                  }}"
                >
                  <h2
                    class="rapidoc-heading sub-title tag-group"
                    part="heading heading-2"
                    style="color:var(--foreground); font-size:var(--h4-font-size); font-weight:700; text-transform:uppercase; letter-spacing:0.05em;"
                  >
                    ${group.displayName || group.name}
                  </h2>
                  <div class="section-tag-group-icon"></div>
                </div>
                <div class="section-tag-group-body">
                  ${
                    group.description
                      ? html`<div class="regular-font regular-font-size m-markdown" style="padding-bottom:12px">
                          ${unsafeHTML(sanitizeHTML(marked(group.description || '')))}
                        </div>`
                      : ''
                  }
                  ${group.tags.map((tag) => renderTagSection(tag))}
                </div>
              </div>
            `
          )}
          ${remainingTags.map((tag) => renderTagSection(tag))}
        `
      : this.resolvedSpec.tags.map((tag) => renderTagSection(tag))
  }`;
}
