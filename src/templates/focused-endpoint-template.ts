import { html, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import { marked } from 'marked';
import { expandedEndpointBodyTemplate } from './expanded-endpoint-template';
import '../components/api-request';
import '../components/api-response';
import componentsTemplate from './components-template';
import overviewTemplate from './overview-template';
import serverTemplate from './server-template';
import securitySchemeTemplate from './security-scheme-template';
import { expandCollapseNavBarTag } from './navbar-template';
import { RapiDocElement, RapiDocTag } from '@rapidoc-types';
import { fixRenderedAnchorLinks, observeMeRenderedHeading } from '../utils/markdown-utils';

function headingRenderer(tagElementId: string) {
  const renderer = new marked.Renderer();
  observeMeRenderedHeading(renderer, (raw: string, slugger: marked.Slugger) => `${tagElementId}--${slugger.slug(raw)}`);
  fixRenderedAnchorLinks(renderer);
  return renderer;
}

function wrapFocusedTemplate(templateToWrap: TemplateResult<1> | string) {
  return html`
    <div class='regular-font section-gap--focused-mode' part="section-operations-in-tag">
      ${templateToWrap}
    </div>`;
}

function defaultContentTemplate(this: RapiDocElement) {
  // In focused mode default content is overview or first path
  if (this.showInfo === 'true') {
    return wrapFocusedTemplate(overviewTemplate.call(this));
  }
  const selectedTagObj = this.resolvedSpec?.tags?.[0];
  const selectedPathObj = this.resolvedSpec?.tags?.[0]?.paths[0];
  return (selectedTagObj && selectedPathObj)
    ? wrapFocusedTemplate(expandedEndpointBodyTemplate.call(this, selectedPathObj, selectedTagObj.name))
    : wrapFocusedTemplate('');
}

/* eslint-disable indent */
function focusedTagBodyTemplate(this: RapiDocElement, tag: RapiDocTag) {
  return html`
    <h1 id="${tag.elementId}">${tag.name}</h1>
    ${this.onNavTagClick === 'show-description' && tag.description
      ? html`
        <div class="m-markdown">
          ${
            unsafeHTML(`
            <div class="m-markdown regular-font">
              ${marked(tag.description || '', this.infoDescriptionHeadingsInNavBar === 'true' ? { renderer: headingRenderer(tag.elementId) } : undefined)}
            </div>`)
          }
        </div>`
      : ''
    }
  `;
}

export default function focusedEndpointTemplate(this: RapiDocElement) {
  if (!this.focusedElementId || !this.resolvedSpec) {
    return;
  }
  const focusElId = this.focusedElementId;
  let selectedPathObj = null;
  let selectedTagObj = null;
  let focusedTemplate;
  let i = 0;
  if (focusElId.startsWith('overview') && this.showInfo === 'true') {
    focusedTemplate = overviewTemplate.call(this);
  } else if (focusElId === 'auth' && this.allowAuthentication === 'true') {
    focusedTemplate = securitySchemeTemplate.call(this);
  } else if (focusElId === 'servers' && this.allowServerSelection === 'true') {
    focusedTemplate = serverTemplate.call(this);
  } else if (focusElId === 'operations-top') {
    focusedTemplate = html`
    <div id="operations-top" class="observe-me">
      <slot name="operations-top"></slot>
    </div>`;
  } else if (focusElId.startsWith('cmp--') && this.showComponents === 'true') {
    focusedTemplate = componentsTemplate.call(this);
  } else if (focusElId.startsWith('tag--')) {
    const idToFocus = focusElId.indexOf('--', 4) > 0 ? focusElId.substring(0, focusElId.indexOf('--', 5)) : focusElId;
    selectedTagObj = this.resolvedSpec.tags?.find((v) => v.elementId === idToFocus);
    if (selectedTagObj) {
      focusedTemplate = wrapFocusedTemplate.call(this, focusedTagBodyTemplate.call(this, selectedTagObj));
    } else {
      focusedTemplate = defaultContentTemplate.call(this);
    }
  } else {
    for (i = 0; i < (this.resolvedSpec.tags?.length || 0); i += 1) {
      selectedTagObj = this.resolvedSpec.tags?.[i];
      selectedPathObj = this.resolvedSpec.tags?.[i].paths.find((v) => `${v.elementId}` === focusElId);
      if (selectedPathObj) {
        break;
      }
    }
    if (selectedPathObj) {
      // In focused mode we must expand the nav-bar tag element if it is collapsed
      const newNavEl = this.shadowRoot?.getElementById(`link-${focusElId}`) as HTMLElement;
      expandCollapseNavBarTag(newNavEl, 'expand');
      focusedTemplate = wrapFocusedTemplate.call(
        this,
        expandedEndpointBodyTemplate.call(this, selectedPathObj, (selectedTagObj?.name || ''), (selectedTagObj?.description || '')),
      );
    } else {
      // if focusedElementId is not found then show the default content (overview or first-path)
      focusedTemplate = defaultContentTemplate.call(this);
    }
  }
  return focusedTemplate;
}
/* eslint-enable indent */
