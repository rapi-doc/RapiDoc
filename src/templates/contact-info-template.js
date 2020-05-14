import { html } from 'lit-element';

/* eslint-disable indent */
export default function contactInfoTemplate(data) {
  return html`
  <div style="font-size:calc(var(--font-size-regular) - 1px); margin-top:8px; line-height: 18px;">
    ${data.resolvedSpec.info.contact.email
      ? html`
        <div>
          <span class='tiny-title' style="display:inline-block; width:50px"> Email: </span> 
          <span class='regular-font'> ${data.resolvedSpec.info.contact.email}</span> 
        </div>`
      : ''
    }
    ${data.resolvedSpec.info.contact.name
      ? html`
        <div>
          <span class='tiny-title' style="display:inline-block; width:50px"> Name: </span> 
          <span class='regular-font'> ${data.resolvedSpec.info.contact.name}</span> 
        </div>`
      : ''
    }
    ${data.resolvedSpec.info.contact.url
      ? html`
        <div>
          <span class='tiny-title' style="display:inline-block; width:50px"> URL: </span> 
          <span class='regular-font'> ${data.resolvedSpec.info.contact.url}</span> 
        </div>`
      : ''
    }
  </div>`;
}
/* eslint-enable indent */
