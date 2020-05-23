import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';
import { expandedEndpointBodyTemplate } from '@/templates/expanded-endpoint-template';
import '@/components/api-request';
import '@/components/api-response';

/* eslint-disable indent */
function focusedTagBodyTemplate(data, tag) {
  return html`
    <h1 id="tag-${tag.name}">${tag.name}</h1>
    ${tag.description ? html`<div class="m-markdown"> ${unsafeHTML(marked(tag.description || ''))}</div>` : ''}
  `;
}

export default function focusedEndpointTemplate(data) {
  let itemToFocus = '';
  let selectedPathObj = {};
  let selectedTagObj = {};
  let i = 0;
  if (data.selectedContentId) {
    itemToFocus = data.selectedContentId;
  } else {
    itemToFocus = 'overview';
  }
  if (itemToFocus === 'overview' || itemToFocus === 'authentication' || itemToFocus === 'api-servers') {
    selectedPathObj = {};
    selectedTagObj = {};
  } else if (itemToFocus.startsWith('tag-')) {
    const tag = itemToFocus.replace('tag-', '');
    selectedTagObj = data.resolvedSpec.tags.find((v) => v.name === tag);
  } else {
    for (i = 0; i < data.resolvedSpec.tags.length; i += 1) {
      selectedTagObj = data.resolvedSpec.tags[i];
      selectedPathObj = data.resolvedSpec.tags[i].paths.find((v) => `${v.method}-${v.path}` === itemToFocus);
      if (selectedPathObj) {
        break;
      }
    }
    if (!selectedPathObj) {
      selectedTagObj = data.resolvedSpec.tags[0];
      selectedPathObj = data.resolvedSpec.tags[0]?.paths[0];
    }
  }

  return html`
    ${itemToFocus === 'overview' || itemToFocus === 'authentication' || itemToFocus === 'api-servers'
      ? html``
      : itemToFocus.startsWith('tag-')
        ? html`
          <div class='regular-font section-gap--focused-mode'>
            ${focusedTagBodyTemplate(data, selectedTagObj)}
          </div>`
        : html`
          <div class='regular-font section-gap--focused-mode'>
            ${expandedEndpointBodyTemplate(data, selectedPathObj)}
          </div>
        `
    }
  `;
}
/* eslint-enable indent */
