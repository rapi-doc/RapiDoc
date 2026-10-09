/**
 * Renders individual API operation rows and expanded panels (summary, description, parameters, request, response, try-it console).
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { OpenAPIV3_1 } from '@scalar/openapi-types';
import type { RapiDocSpecElement } from '~/types/element';
import type { ResolvedPath } from '~/types/spec';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { sanitizeHTML } from '../utils/sanitize.ts';
import { marked } from 'marked';
import '~/components/api-request';
import '~/components/api-response';
import codeSamplesTemplate from '~/templates/code-samples-template';
import callbackTemplate from '~/templates/callback-template';
import { pathSecurityTemplate } from '~/templates/security-scheme-template';
import { getMatchedPaths, rapidocApiKey } from '~/utils/common-utils';

// the click event is passed by the caller but never read
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function toggleExpand(this: RapiDocSpecElement, path: ResolvedPath, _e?: Event) {
  if (path.expanded) {
    path.expanded = false; // collapse
    if (this.updateRoute === 'true') {
      this.replaceHistoryState('');
    }
  } else {
    path.expanded = true; // Expand
    if (this.updateRoute === 'true') {
      const newHash = `${this.routePrefix || '#'}${path.elementId}`;
      if (window.location.hash !== newHash) {
        this.replaceHistoryState(path.elementId);
      }
    }
  }
  this.requestUpdate();
}

export function expandCollapseAll(operationsRootEl: Element, action = 'expand-all'): void {
  const elList = [...operationsRootEl.querySelectorAll('.section-tag')];
  if (action === 'expand-all') {
    elList.map((el) => {
      el.classList.replace('collapsed', 'expanded');
    });
  } else {
    elList.map((el) => {
      el.classList.replace('expanded', 'collapsed');
    });
  }
}

function onExpandCollapseAll(this: unknown, e: Event, action = 'expand-all') {
  expandCollapseAll.call(this, (e.target as HTMLElement).closest('.operations-root')!, action);
}

function endpointHeadTemplate(this: RapiDocSpecElement, path: ResolvedPath, pathsExpanded: boolean | string = false): TemplateResult {
  return html`
    <summary
      @click="${(e: Event) => {
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
            ? html`<span
                style="font-family: var(--font-regular); font-size: var(--); font-size: var(--font-size-small); color:var(--primary-color); margin-left: 16px"
              >
                Webhook</span
              >`
            : ''
        }
      </div>
      ${
        path.deprecated
          ? html` <span
              style="font-size:var(--font-size-small); text-transform:uppercase; font-weight:bold; color:var(--red); margin:2px 0 0 5px;"
            >
              deprecated
            </span>`
          : ''
      }
      ${
        this.showSummaryWhenCollapsed
          ? html` <div class="only-large-screen" style="min-width:60px; flex:1"></div>
              <div part="section-endpoint-head-description" class="descr">${path.summary || path.shortSummary}</div>`
          : ''
      }
    </summary>
  `;
}

function endpointBodyTemplate(this: RapiDocSpecElement, path: ResolvedPath): TemplateResult {
  const acceptContentTypes = new Set<string>();
  for (const respStatus in path.responses) {
    for (const acceptContentType in (path.responses![respStatus] as OpenAPIV3_1.ResponseObject | undefined)?.content) {
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
          ? html`<div class="title" part="section-endpoint-body-title">${path.summary}</div>`
          : path.shortSummary !== path.description
            ? html`<div class="title" part="section-endpoint-body-title">${path.shortSummary}</div>`
            : ''
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
                        style="margin:1px; margin-right:5px; padding:1px 8px; font-weight:bold; border-radius:12px;  background: color-mix(in srgb, var(--${v.color}) 10%, transparent); color:var(--${v.color}); border:1px solid var(--${v.color})"
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
      ${
        path.externalDocs?.url || path.externalDocs?.description
          ? html`<div style="background:var(--bg3); padding:2px 8px 8px 8px; margin:8px 0; border-radius:var(--border-radius)">
              <div class="m-markdown">${unsafeHTML(sanitizeHTML(marked(path.externalDocs?.description || '')))}</div>
              ${
                path.externalDocs?.url
                  ? html`<a
                      style="font-family:var(--font-mono); font-size:var(--font-size-small)"
                      href="${path.externalDocs?.url}"
                      target="_blank"
                    >
                      ${path.externalDocs?.url}
                      <div style="transform: rotate(270deg) scale(1.5); display: inline-block; margin-left:5px">⇲</div>
                    </a>`
                  : ''
              }
            </div>`
          : ''
      }
      <slot name="${path.elementId}"></slot>
      ${pathSecurityTemplate.call(this, path.security)} ${codeSampleTabPanel}
    </div>
    <div class="req-resp-container">
      <div style="display:flex; flex-direction:column" class="view-mode-request ${this.layout}-layout">
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
          accept="${accept}"
          exportparts="wrap-request-btn:wrap-request-btn, btn:btn, btn-fill:btn-fill, btn-outline:btn-outline, btn-try:btn-try, btn-clear:btn-clear, btn-clear-resp:btn-clear-resp,
          tab-panel:tab-panel, tab-btn:tab-btn, tab-btn-row:tab-btn-row, tab-coontent:tab-content, 
          file-input:file-input, textbox:textbox, textbox-param:textbox-param, textarea:textarea, textarea-param:textarea-param, 
          anchor:anchor, anchor-param-example:anchor-param-example, schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
        >
        </api-request>

        ${path.callbacks ? callbackTemplate.call(this, path.callbacks) : ''}
      </div>

      <api-response
        .config="${this.config}"
        class="${this.renderStyle}-mode"
        style="width:100%;"
        webhook="${path.isWebhook}"
        .responses="${path.responses}"
        selected-status="${Object.keys(path.responses || {})[0] || ''}"
        exportparts="btn:btn, btn-fill:btn-fill, btn-outline:btn-outline, btn-try:btn-try, file-input:file-input, 
        textbox:textbox, textbox-param:textbox-param, textarea:textarea, textarea-param:textarea-param, anchor:anchor, anchor-param-example:anchor-param-example, btn-clear-resp:btn-clear-resp,
        tab-panel:tab-panel, tab-btn:tab-btn, tab-btn-row:tab-btn-row, tab-coontent:tab-content, 
        schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
      >
      </api-response>
    </div>
  </div>`;
}

export default function endpointTemplate(
  this: RapiDocSpecElement,
  isMini = false,
  pathsExpanded: boolean | string = false
): TemplateResult | string {
  if (!this.resolvedSpec) {
    return '';
  }
  return html`${
    isMini
      ? ''
      : html`<div style="display:flex; justify-content:flex-end;">
          <span @click="${(e: Event) => onExpandCollapseAll(e, 'expand-all')}" style="color:var(--primary-color); cursor:pointer;">
            Expand all
          </span>
          &nbsp;|&nbsp;
          <span @click="${(e: Event) => onExpandCollapseAll(e, 'collapse-all')}" style="color:var(--primary-color); cursor:pointer;">
            Collapse all
          </span>
          &nbsp; sections
        </div>`
  }
  ${this.resolvedSpec.tags.map(
    (tag) => html`
      ${
        isMini
          ? html`
              <div class="section-tag-body">
                ${tag.paths
                  .filter((path) => {
                    if (this.searchVal) {
                      return getMatchedPaths(this.searchVal, path, tag.name);
                    }
                    return true;
                  })
                  .map(
                    (path) =>
                      html` <section
                        id="${path.elementId}"
                        class="m-endpoint regular-font ${path.method} ${pathsExpanded || path.expanded ? 'expanded' : 'collapsed'}"
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
                  <div id="${tag.elementId}" class="sub-title tag" style="color:var(--primary-color)">${tag.displayName || tag.name}</div>
                </div>
                <div class="section-tag-body">
                  <slot name="${tag.elementId}"></slot>
                  <div class="regular-font regular-font-size m-markdown" style="padding-bottom:12px">
                    ${unsafeHTML(sanitizeHTML(marked(tag.description || '')))}
                  </div>
                  ${tag.paths
                    .filter((v) => {
                      if (this.searchVal) {
                        return getMatchedPaths(this.searchVal, v, tag.name);
                      }
                      return true;
                    })
                    .map(
                      (path) =>
                        html` <section
                          part="section-endpoint"
                          id="${path.elementId}"
                          class="m-endpoint regular-font ${path.method} ${pathsExpanded || path.expanded ? 'expanded' : 'collapsed'}"
                        >
                          ${endpointHeadTemplate.call(this, path, pathsExpanded)}
                          ${pathsExpanded || path.expanded ? endpointBodyTemplate.call(this, path) : ''}
                        </section>`
                    )}
                </div>
              </div>
            `
      }
    `
  )}`;
}
