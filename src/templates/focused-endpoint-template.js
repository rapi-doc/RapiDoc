import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';
import { expandedEndpointBodyTemplate } from '@/templates/expanded-endpoint-template';
import '@/components/api-request';
import '@/components/api-response';

/* eslint-disable indent */
function focusedTagBodyTemplate(tag) {
  return html`
    <h1 id="${tag.elementId}">${tag.name}</h1>
    ${tag.description ? html`<div class="m-markdown"> ${unsafeHTML(marked(tag.description || ''))}</div>` : ''}
  `;
}

export default function focusedEndpointTemplate() {
  let itemToFocus = '';
  let selectedPathObj = {};
  let selectedTagObj = {};
  let i = 0;
  if (this.selectedContentId) {
    itemToFocus = this.selectedContentId;
  } else {
    itemToFocus = 'overview';
  }
  if (itemToFocus === 'overview' || itemToFocus === 'authentication' || itemToFocus === 'api-servers') {
    selectedPathObj = {};
    selectedTagObj = {};
  } else if (itemToFocus.startsWith('tag--')) {
    selectedTagObj = this.resolvedSpec.tags.find((v) => v.elementId === itemToFocus);
  } else {
    for (i = 0; i < this.resolvedSpec.tags.length; i += 1) {
      selectedTagObj = this.resolvedSpec.tags[i];
      selectedPathObj = this.resolvedSpec.tags[i].paths.find((v) => `${v.elementId}` === itemToFocus);
      if (selectedPathObj) {
        break;
      }
    }
    if (!selectedPathObj) {
      selectedTagObj = this.resolvedSpec.tags[0];
      selectedPathObj = this.resolvedSpec.tags[0]?.paths[0];
    }
  }

  return itemToFocus === 'overview' || itemToFocus === 'authentication' || itemToFocus === 'api-servers'
    ? ''
    : itemToFocus.startsWith('tag--')
      ? html`
        <div class='regular-font section-gap--focused-mode'>
          ${focusedTagBodyTemplate.call(this, selectedTagObj)}
        </div>`
      : html`
        <div class='regular-font section-gap--focused-mode'>
          ${expandedEndpointBodyTemplate.call(this, selectedPathObj, selectedTagObj.name)}
        </div>
      `;
}
/* eslint-enable indent */
