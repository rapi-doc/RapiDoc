import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import { marked } from 'marked';
import '../components/api-request';
import '../components/api-response';
import '../components/content-copy-button';
import codeSamplesTemplate from './code-samples-template';
import callbackTemplate from './callback-template';
import { pathSecurityTemplate } from './security-scheme-template';
import { pathIsInSearch, rapidocApiKey } from '../utils/common-utils';
import processPathDescription from '../utils/magic-block-utils';
import { joinURLandPath } from '../utils/url';

function toggleExpand(path) {
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

export function expandCollapseAll(operationsRootEl, action = 'expand-all') {
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

function onExpandCollapseAll(e, action = 'expand-all') {
  expandCollapseAll.call(this, e.target.closest('.operations-root'), action);
}

/* eslint-disable indent */
function endpointHeadTemplate(path, pathsExpanded = false) {
  return html`
  <summary @click="${(e) => { toggleExpand.call(this, path, e); }}" part="section-endpoint-head-${path.expanded ? 'expanded' : 'collapsed'}" class='endpoint-head ${path.method} ${path.deprecated ? 'deprecated' : ''} ${pathsExpanded || path.expanded ? 'expanded' : 'collapsed'}'>
    <div part="section-endpoint-head-method" class="method ${path.method} ${path.deprecated ? 'deprecated' : ''}"> ${path.method} </div> 
    <div  part="section-endpoint-head-path" class="path ${path.deprecated ? 'deprecated' : ''}"> 
      ${path.path} 
      ${path.isWebhook ? html`<span style="font-family: var(--font-regular); font-size: var(--); font-size: var(--font-size-small); color:var(--primary-color); margin-left: 16px"> Webhook</span>` : ''}
    </div>
    ${path.deprecated
      ? html`
        <span style="font-size:var(--font-size-small); text-transform:uppercase; font-weight:bold; color:var(--red); margin:2px 0 0 5px;"> 
          deprecated 
        </span>`
      : ''
    }
    ${this.showSummaryWhenCollapsed
      ? html`
        <div class="only-large-screen" style="min-width:60px; flex:1"></div>
        <div part="section-endpoint-head-description" class="descr">${path.summary || path.shortSummary} </div>`
      : ''
    }
  </summary>
  `;
}

function endpointBodyTemplate(path) {
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

  const codeSampleTabPanel = path.xCodeSamples ? codeSamplesTemplate(path.xCodeSamples) : '';
  path.description = processPathDescription(path.description);
  return html`
  <style>
      .label-operation-container {
        text-align: left;
        direction: ltr;
        color: var(--fg3);
        display: flex;
        width: 100%;
        overflow: hidden;
        margin-bottom: 24px;
      }

      .label-operation-path-container {
        display: inline-flex;
        flex-direction: row;
        flex-grow: 1;
        justify-content: space-between;
        align-items: stretch;
        width: auto;
        height: 28px;
        left: 0;
        top: 0;
        border: 1px solid var(--border-color);
        border-radius: 0px 4px 4px 0px;
        flex-wrap: nowrap;
        overflow-x: auto;
        position: relative;
        scrollbar-color: transparent transparent;
      }

      .label-operation-path-container::-webkit-scrollbar {
        display: none;
      }

      .label-operation-path-item {
        flex: 0 0 auto;
      }

      .label-operation-method-container {
        display: inline-flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 4px 8px;
        width: auto;
        height: 28px;
        left: 0;
        top: 0;
        border-width: 1px 0px 1px 1px;
        border-style: solid;
        border-radius: 4px 0px 0px 4px;
      }
  </style>
  <div part="section-endpoint-body-${path.expanded ? 'expanded' : 'collapsed'}" class='endpoint-body ${path.method} ${path.deprecated ? 'deprecated' : ''}'>
    <div class="summary">
      ${path.summary
        ? html`<div class="title" part="section-endpoint-body-title">${path.summary}</div>`
        : path.shortSummary !== path.description
          ? html`<div class="title" part="section-endpoint-body-title">${path.shortSummary}</div>`
          : ''
      }
      ${path.xBadges && path.xBadges?.length > 0
        ? html`
          <div style="display:flex; flex-wrap:wrap;font-size: var(--font-size-small);">
            ${path.xBadges.map((v) => (
                html`<span part="endpoint-badge" style="margin:1px; margin-right:5px; padding:1px 8px; font-weight:bold; border-radius:12px;  background-color: var(--light-${v.color}, var(--input-bg)); color:var(--${v.color}); border:1px solid var(--${v.color})">${v.label}</span>`
              ))
            }
          </div>
          `
        : ''
      }
      <div class='mono-font regular-font-size label-operation-container'>
        <div class='label-operation-method-container' style='border-color: var(--${path.method}-border-color); background-color: var(--${path.method}-bg-color);'>
          <span class='regular-font upper method-fg bold-text ${path.method}'>${path.method}</span>
        </div>
        <div class='label-operation-path-container'>
          <content-copy-button id='${path.method}${path.path}' content='${joinURLandPath(this.selectedServer.url, path.path)}'></content-copy-button>
        </div>
      </div>
      ${path.description ? html`<div part="section-endpoint-body-description" class="path-description"> ${unsafeHTML(path.description)}</div>` : ''}
      <slot name="${path.elementId}"></slot>
      ${pathSecurityTemplate.call(this, path.security)}
      ${codeSampleTabPanel}
    </div>  
    <div class='req-resp-container'> 
      <div style="display:flex; flex-direction:column" class="view-mode-request ${this.layout}-layout">
        <api-request
          class = "${this.renderStyle}-mode ${this.layout}-layout"
          style = "width:100%;"
          schema-short-summary="${path.shortSummary}"
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
          server-url = "${path.servers && path.servers.length > 0 ? path.servers[0].url : this.selectedServer.computedUrl}" 
          active-schema-tab = "${this.defaultSchemaTab}"
          fill-request-fields-with-example = "${this.fillRequestFieldsWithExample}"
          allow-try = "${this.allowTry}"
          show-curl-before-try = "${this.showCurlBeforeTry}"
          accept = "${accept}"
          render-style="${this.renderStyle}" 
          schema-style = "${this.schemaStyle}" 
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
        </div>  

        <api-response
          class = "${this.renderStyle}-mode"
          style = "width:100%;"
          webhook = "${path.isWebhook}"
          .responses="${path.responses}"
          active-schema-tab = "${this.defaultSchemaTab}" 
          render-style="${this.renderStyle}" 
          schema-style="${this.schemaStyle}"
          schema-expand-level = "${this.schemaExpandLevel}"
          schema-description-expanded = "${this.schemaDescriptionExpanded}"
          allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}"
          schema-hide-read-only = "${this.schemaHideReadOnly === 'never' ? 'false' : path.isWebhook ? 'true' : 'false'}"
          schema-hide-write-only = "${this.schemaHideWriteOnly === 'never' ? 'false' : path.isWebhook ? 'false' : 'true'}"
          selected-status = "${Object.keys(path.responses || {})[0] || ''}"
          exportparts = "btn:btn, btn-fill:btn-fill, btn-outline:btn-outline, btn-try:btn-try, file-input:file-input, 
          textbox:textbox, textbox-param:textbox-param, textarea:textarea, textarea-param:textarea-param, anchor:anchor, anchor-param-example:anchor-param-example, btn-clear-resp:btn-clear-resp,
          schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
        > </api-response>
      </div>
  </div>`;
}

export default function endpointTemplate(showExpandCollapse = true, showTags = true, pathsExpanded = false) {
  if (!this.resolvedSpec) { return ''; }
  return html`
    ${showExpandCollapse
      ? html`
        <div style="display:flex; justify-content:flex-end;"> 
          <span @click="${(e) => onExpandCollapseAll(e, 'expand-all')}" style="color:var(--primary-color); cursor:pointer;">
            Expand all
          </span> 
          &nbsp;|&nbsp; 
          <span @click="${(e) => onExpandCollapseAll(e, 'collapse-all')}" style="color:var(--primary-color); cursor:pointer;" >
            Collapse all
          </span> 
          &nbsp; sections
        </div>`
      : ''
    }
    ${this.resolvedSpec.tags.map((tag) => html`
      ${showTags
        ? html` 
          <div class='regular-font section-gap section-tag ${tag.expanded ? 'expanded' : 'collapsed'}'> 
            <div class='section-tag-header' @click="${() => { tag.expanded = !tag.expanded; this.requestUpdate(); }}">
              <div id='${tag.elementId}' class="sub-title tag" style="color:var(--primary-color)">${tag.name}</div>
            </div>
            <div class='section-tag-body'>
              <slot name="${tag.elementId}"></slot>
              <div class="regular-font regular-font-size m-markdown" style="padding-bottom:12px">
                ${unsafeHTML(marked(tag.description || ''))}
              </div>
              ${tag.paths.filter((v) => {
                if (this.matchPaths) {
                  return pathIsInSearch(this.matchPaths, v, this.matchType);
                }
                return true;
                }).map((path) => html`
                <section part="section-endpoint" id='${path.elementId}' class='m-endpoint regular-font ${path.method} ${pathsExpanded || path.expanded ? 'expanded' : 'collapsed'}'>
                  <!--${endpointHeadTemplate.call(this, path, pathsExpanded)}-->
                  ${pathsExpanded || path.expanded ? endpointBodyTemplate.call(this, path) : ''}
                </section>`)
              }
            </div>
          </div>`
        : html`
          <div class='section-tag-body'>
          ${tag.paths.filter((v) => {
            if (this.matchPaths) {
              return pathIsInSearch(this.matchPaths, v, 'exactly');
            }
            return true;
            }).map((path) => html`
            <section id='${path.elementId}' class='m-endpoint regular-font ${path.method} ${pathsExpanded || path.expanded ? 'expanded' : 'collapsed'}'>
              <!--${endpointHeadTemplate.call(this, path, pathsExpanded)}-->
              ${pathsExpanded || path.expanded ? endpointBodyTemplate.call(this, path) : ''}
            </section>`)
          }
          </div>
        `
      }
  `)
  }`;
}
/* eslint-enable indent */
