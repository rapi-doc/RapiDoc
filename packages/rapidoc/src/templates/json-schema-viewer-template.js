/**
 * Renders standalone JSON Schema Viewer interface with navigation sidebar, schema AST tree, and sample example generator.
 */
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { sanitizeHTML } from '../utils/sanitize.js';
import { marked } from 'marked';

// Templates
import overviewTemplate from '~/templates/overview-template';
import headerTemplate from '~/templates/header-template';
import { schemaToAST, generateExample, standardizeExample } from '~/utils/schema-utils';
import '~/components/json-tree';
import '~/components/schema-tree';

// Json Schema Nav Template
function jsonSchemaNavTemplate() {
  return html`
    <nav class="nav-bar" part="section-navbar">
      <slot name="nav-logo" class="logo"></slot>
      <nav style="flex:1" class="nav-scroll" part="section-navbar-scroll">
        <div class="nav-bar-search-container has-bottom-border" part="section-navbar-search">
          <div class="nav-bar-search-input-wrapper">
            <input
              id="nav-bar-search"
              part="textbox textbox-nav-filter"
              class="nav-bar-search-input"
              type="text"
              placeholder="Filter"
              @change="${this.onSearchChange}"
              spellcheck="false"
            />
            <div class="nav-bar-search-icon" @click="${this.onSearchChange}">&#x21a9;</div>
          </div>
        </div>
        ${this.resolvedSpec.schemaAndExamples.map(
          (v) =>
            html` <div
              class="nav-bar-path"
              data-content-id="${v.elementId}"
              id="link-${v.elementId}"
              @click="${(e) => {
                this.scrollToEventTarget(e, false);
              }}"
            >
              ${v.name}
            </div>`
        )}
      </nav>
    </nav>
  `;
}

// Json Schema Body Template
function jsonSchemaBodyTemplate() {
  return html` ${this.showInfo === 'true' ? overviewTemplate.call(this) : ''}
    <div style="font-size:var(--font-size-regular);">
      ${this.resolvedSpec.schemaAndExamples.map((jSchemaBody) => {
        const examplesObj = generateExample(
          jSchemaBody.schema,
          'json',
          standardizeExample(jSchemaBody.examples),
          standardizeExample(jSchemaBody.example),
          true,
          false,
          'json',
          true
        );
        jSchemaBody.selectedExample = examplesObj[0]?.exampleId;
        return html`<section
          id="${jSchemaBody.elementId}"
          class="json-schema-and-example regular-font"
          style="display:flex; flex-direction: column; border:1px solid var(--border); margin-bottom:32px; border-top: 5px solid var(--border)"
        >
          <div style="padding:16px; border-bottom: 1px solid var(--border)">
            <div style="font-size:var(--font-size-small); font-weight:bold">${jSchemaBody.name}</div>
            <span class="json-schema-description m-markdown ">${unsafeHTML(sanitizeHTML(marked(jSchemaBody.description || '')))}</span>
          </div>
          <div style="display:flex; flex-direction: row; gap:16px;">
            <div class="json-schema-def" style="flex:1; padding:16px 0 16px 16px; ">
              <schema-tree
                .data="${schemaToAST(jSchemaBody.schema)}"
                schema-expand-level="${this.schemaExpandLevel}"
                schema-description-expanded="${this.schemaDescriptionExpanded}"
                allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
                schema-hide-read-only="false"
                schema-hide-write-only="false"
              >
              </schema-tree>
            </div>
            <div
              class="json-schema-example-panel"
              style="width:400px; background: var(--input); padding:16px 0 16px 16px; border-left: 1px dashed var(--border);"
            >
              ${
                examplesObj.length > 1
                  ? html`<select style="min-width:100px; max-width:100%" @change="${(e) => this.onSelectExample(e, jSchemaBody)}">
                      ${examplesObj.map(
                        (v) =>
                          html` <option value="${v.exampleId}" ?selected=${v.exampleId === jSchemaBody.selectedExample}>
                            ${v.exampleSummary.length > 80 ? v.exampleId : v.exampleSummary}
                          </option>`
                      )}
                    </select>`
                  : html`<div style="font-size: var(--font-size-small);font-weight:700; margin:5px 0">
                      ${examplesObj[0].exampleSummary}
                    </div>`
              }
              ${examplesObj.map(
                (v) =>
                  html`<json-tree
                    .data="${v.exampleValue}"
                    data-example="${v.exampleId}"
                    class="example"
                    style="margin-top:16px; display: ${v.exampleId === jSchemaBody.selectedExample ? 'flex' : 'none'}"
                  ></json-tree>`
              )}
            </div>
          </div>
        </section>`;
      })}
    </div>`;
}

// Json Schema Root Template
export default function jsonSchemaViewerTemplate(isMini = false) {
  // export default function jsonSchemaViewerTemplate(isMini = false, pathsExpanded = false) {
  if (!this.resolvedSpec) {
    return '';
  }
  if (this.resolvedSpec.specLoadError) {
    if (isMini) {
      return html`
        <div
          style="display:flex; align-items:center; border:1px dashed var(--border); height:42px; padding:5px; font-size:var(--font-size-small); color:var(--red); font-family:var(--font-mono)"
        >
          ${this.resolvedSpec.info.description}
        </div>
      `;
    }
    return html`
      <!-- Header -->
      ${headerTemplate.call(this)}
      <h1>Header</h1>
      <main class="main-content regular-font" part="section-main-content">
        <slot></slot>
        <div style="margin:24px; text-align: center;">
          <h1 style="color: var(--red)">${this.resolvedSpec.info.title}</h1>
          <div style="font-family:var(--font-mono)">${this.resolvedSpec.info.description}</div>
        </div>
      </main>
    `;
  }
  if (this.resolvedSpec.isSpecLoading) {
    return html`
      <main class="main-content regular-font" part="section-main-content">
        <slot></slot>
        <div class="main-content-inner--${this.renderStyle}-mode">
          <div class="loader"></div>
        </div>
      </main>
    `;
  }

  return html`
    <!-- Header -->
    ${this.showHeader === 'false' ? '' : headerTemplate.call(this)}

    <div id="the-main-body" class="body ${this.cssClasses}" dir=${this.pageDirection}>
      <!-- Side Nav -->
      ${jsonSchemaNavTemplate.call(this)}

      <!-- Main Content -->
      <main class="main-content regular-font" part="section-main-content">
        <slot></slot>
        <div class="main-content-inner--${this.renderStyle}-mode">
          ${
            this.loading === true
              ? html`<div class="loader"></div>`
              : html` ${
                  this.loadFailed === true
                    ? html`<div style="text-align: center;margin: 16px;">Unable to load the Spec</div>`
                    : html`
                        <div
                          class="operations-root"
                          @click="${(e) => {
                            this.handleHref(e);
                          }}"
                        >
                          ${jsonSchemaBodyTemplate.call(this)}
                        </div>
                      `
                }`
          }
        </div>
        <slot name="footer"></slot>
      </main>
    </div>
  `;
}
