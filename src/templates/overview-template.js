import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';
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
          <slot name="overview"></slot>
          <div id="api-description">
          ${this.resolvedSpec.info.description
          ? html`${unsafeHTML(`
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
