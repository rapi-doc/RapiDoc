import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import { marked } from 'marked';
import { downloadResource, viewResource } from '../utils/common-utils';
import { RapiDocCallableElement } from '@rapidoc-types';
import { fixRenderedAnchorLinks, observeMeRenderedHeading } from '../utils/markdown-utils';

/* eslint-disable indent */
function headingRenderer(): marked.Renderer<never> {
  const renderer = new marked.Renderer();
  observeMeRenderedHeading(renderer, (raw: string, slugger: marked.Slugger) => `overview--${slugger.slug(raw)}`);
  fixRenderedAnchorLinks(renderer);
  return renderer;
}

export default function overviewTemplate(this: RapiDocCallableElement) {
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
                  <button class="m-btn thin-border" style="min-width:170px" part="btn btn-outline" @click='${() => { downloadResource(this.specUrl, 'openapi-spec'); }}'>Download OpenAPI spec</button>
                  ${this.specUrl?.trim().toLowerCase().endsWith('json')
                    ? html`<button class="m-btn thin-border" style="width:200px" part="btn btn-outline" @click='${() => { viewResource(this.specUrl); }}'>View OpenAPI spec (New Tab)</button>`
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
                ${marked(this.resolvedSpec.info.description, this.infoDescriptionHeadingsInNavBar === 'true' ? { renderer: headingRenderer(), baseUrl: '/toto' } : {baseUrl: '/toto'})}
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
