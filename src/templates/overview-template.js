import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import { marked } from 'marked';
import { downloadResource, viewResource } from '~/utils/common-utils';

/* eslint-disable indent */
function headingRenderer() {
  const renderer = new marked.Renderer();
  renderer.heading = ((text, level, raw, slugger) => `<h${level} class="observe-me" id="overview--${slugger.slug(raw)}">${text}</h${level}>`);
  return renderer;
}

export default function overviewTemplate() {
  return html`
    <section id="overview" part="section-overview"
      class="observe-me ${this.renderStyle === 'view' ? 'section-gap' : 'section-gap--read-mode'}">
      ${this.resolvedSpec?.info
        ? html`
          <div id="api-title" part="section-overview-title" style="font-size:32px">
            ${this.resolvedSpec.info.title}
            ${!this.resolvedSpec.info.version ? '' : html`
              <span style = 'font-size:var(--font-size-small);font-weight:bold'>
                ${this.resolvedSpec.info.version}
              </span>`
            }
          </div>
          <div id="api-info" style="font-size:calc(var(--font-size-regular) - 1px); margin-top:8px;">
            ${this.resolvedSpec.info.contact?.email
              ? html`<span>${this.resolvedSpec.info.contact.name || 'Email'}: 
                <a href="mailto:${this.resolvedSpec.info.contact.email}" part="anchor anchor-overview">${this.resolvedSpec.info.contact.email}</a>
              </span>`
              : ''
            }
            ${this.resolvedSpec.info.contact?.url
              ? html`<span>URL: <a href="${this.resolvedSpec.info.contact.url}" part="anchor anchor-overview">${this.resolvedSpec.info.contact.url}</a></span>`
              : ''
            }
            ${this.resolvedSpec.info.license
              ? html`<span>License: 
                ${this.resolvedSpec.info.license.url
                ? html`<a href="${this.resolvedSpec.info.license.url}" part="anchor anchor-overview">${this.resolvedSpec.info.license.name}</a>`
                : this.resolvedSpec.info.license.name
              } </span>`
              : ''
            }
            ${this.resolvedSpec.info.termsOfService
              ? html`<span><a href="${this.resolvedSpec.info.termsOfService}" part="anchor anchor-overview">Terms of Service</a></span>`
              : ''
            }
            ${this.specUrl && this.allowSpecFileDownload === 'true'
              ? html`
                <div style="display:flex; margin:12px 0; gap:8px; justify-content: start;">
                  <button class="m-btn thin-border" style="min-width:170px" part="btn btn-outline" @click='${(e) => { downloadResource(this.specUrl, 'openapi-spec', e); }}'>Download OpenAPI spec</button>
                  ${this.specUrl?.trim().toLowerCase().endsWith('json')
                    ? html`<button class="m-btn thin-border" style="width:200px" part="btn btn-outline" @click='${(e) => { viewResource(this.specUrl, e); }}'>View OpenAPI spec (New Tab)</button>`
                    : ''
                  }
                </div>`
              : ''
            }
          </div>
          <slot name="overview"></slot>
          <div id="api-description">
          ${this.resolvedSpec.info.description
            ? html`${
              unsafeHTML(`
                <div class="m-markdown regular-font">
                ${marked(this.resolvedSpec.info.description, this.infoDescriptionHeadingsInNavBar === 'true' ? { renderer: headingRenderer() } : undefined)}
              </div>`)}`
            : ''
          }
          </div>
        `
        : ''
      }
    </section>
  `;
}
/* eslint-enable indent */
