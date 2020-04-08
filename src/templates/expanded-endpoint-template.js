import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';
import '@/components/api-request';
import '@/components/api-response';
import '@/components/tab-panel';

function endpointDescriptionRenderer() {
  /*
  Enables you to add the following to the api spec endpoint description markdown:
  <!--
  {
    "rapidocComponent": "tab-panel",
    "panels": [
      {
        "id": "tab1",
        "label": "TAB 1",
        "markdown": "Tab 1 content"
      },
      {
        "id": "tab2",
        "label": "TAB 2",
        "markdown": "# Tab 2 Content\nMore content here"
      },
      {
        "id": "tab3",
        "label": "TAB 3",
        "markdown": "```javascript\nlogin(\"fake.user@example.com\", \"password\")\n# See login for options\n```"
      },
      {
        "id": "tab4",
        "label": "TAB 4",
        "markdown": "my dog is `very` small"
      }
    ],
    "activePanelId": "tab3"
  }
  -->
  */
  const renderer = new marked.Renderer();
  renderer.html = (text) => {
    if (text.search('rapidocComponent') > -1) {
      const component = JSON.parse(text.replace('<!--', '').replace('-->', ''));
      switch (component.rapidocComponent) {
        case 'tab-panel':
          return `
            <tab-panel panels='${JSON.stringify(component.panels)}' active-panel-id='${component.activePanelId}'></tab-panel>
          `;
        default:
      }
    }
    return text;
  };
  return renderer;
}

/* eslint-disable indent */
export function callbackTemplate(callbacks) {
  return html`
    <div class="req-res-title" style="margin-top:12px">CALLBACKS</div>
    ${Object.entries(callbacks).map((kv) => html`
      <div class="tiny-title" style="padding: 12px; border:1px solid var(--light-border-color)"> 
        ${kv[0]}
        ${Object.entries(kv[1]).map((pathObj) => html`
          <div class="mono-font small-font-size" style="display:flex; margin-left:16px;">
            <div> 
              ${Object.entries(pathObj[1]).map((method) => html`
                <div>
                  <div style="margin-top:12px;">
                    <div class="method method-fg ${method[0]}" style="width:70px; border:none; margin:0; padding:0; line-height:20px; vertical-align: baseline;text-align:left"> 
                      <span style="font-size:20px;"> &#x2944; </span> 
                      ${method[0]} 
                    </div>
                    <span style="line-height:20px; vertical-align: baseline;">${pathObj[0]} </span>
                  </div>  
                  <div class='expanded-req-resp-container'>
                    <api-request  class="request-panel"
                      callback = "true"
                      method = "${method[0]}", 
                      path = "${pathObj[0]}" 
                      .parameters = "${method[1].parameters}" 
                      .request_body = "${method[1].requestBody}"
                      allow-try = "false"
                      render-style="${this.renderStyle}" 
                      schema-style = "${this.schemaStyle}"
                      active-schema-tab = "${this.defaultSchemaTab}"
                      schema-expand-level = "${this.schemaExpandLevel}"
                      schema-description-expanded = "${this.schemaDescriptionExpanded}"
                    > </api-request>

                    <api-response
                      callback = "true"
                      .responses="${method[1].responses}"
                      render-style="${this.renderStyle}"
                      schema-style="${this.schemaStyle}"
                      active-schema-tab = "${this.defaultSchemaTab}"
                      schema-expand-level = "${this.schemaExpandLevel}"
                      schema-description-expanded = "${this.schemaDescriptionExpanded}"
                    > </api-response>
                  </div>
                </div>  
              `)}
            </div>  
          </div>  
        `)}
      </div>  
    `)}
  `;
}

function endpointBodyTemplate(path) {
  let accept = '';
  for (const respStatus in path.responses) {
    for (const acceptContentType in (path.responses[respStatus].content)) {
      accept = `${accept + acceptContentType}, `;
    }
  }
  accept = accept.replace(/,\s*$/, ''); // remove trailing comma
  const nonEmptyApiKeys = this.resolvedSpec.securitySchemes.filter((v) => (v.finalKeyValue)) || [];
  // create xCodeSamples tab panel
  let xCodeSamplesTabPanel = '';
  const panels = [];
  if (path.xCodeSamples !== undefined && path.xCodeSamples.length > 0) {
    path.xCodeSamples.forEach((item) => {
      panels.push({
        id: item.lang,
        label: item.lang,
        markdown: `\`\`\`${item.syntaxLang || 'javascript'}\n${item.source}\n\`\`\``,
      });
    });
    xCodeSamplesTabPanel += `<div class="req-res-title" style="margin-top: 24px;">CODE SAMPLES</div><tab-panel panels='${JSON.stringify(panels)}' active-panel-id='${path.xCodeSamples[0].lang}'></tab-panel>`;
  }
  return html`
  <div class='divider'></div>
  <div class='expanded-endpoint-body observe-me ${path.method} ${path.deprecated ? 'deprecated' : ''} ' id='${path.method}-${path.path.replace(/[\s#:?&=]/g, '-')}' >
    
    ${path.deprecated ? html`<div class="bold-text red-text" > DEPRECATED </div>` : ''}
    ${html`
      <h1 class = "${path.deprecated ? 'gray-text' : ''}"> 
        ${path.summary || html`<span class='upper ${path.deprecated ? ' method-fg gray-text' : path.method}  '> ${path.method}</span> ${path.path}`} 
      </h1>
      ${path.summary
        ? html`
          <div class='mono-font regular-font-size' style='padding: 8px 0; color:var(--fg3)'> 
            <span class='regular-font upper method-fg  ${path.deprecated ? ' gray-text' : ` bold-text ${path.method}`} '>${path.method}</span> 
            <span class = '${path.deprecated ? 'gray-text' : ''}'> ${path.path} </span>
          </div>`
        : ''
      }
    `
    }
    ${path.description
      ? html`
          <div class="m-markdown"> 
            ${unsafeHTML(marked(path.description || '', { renderer: endpointDescriptionRenderer() }))}
          </div>`
      : ''
    }
    ${unsafeHTML(xCodeSamplesTabPanel)}
    <div class='expanded-req-resp-container'>
      <api-request  class="request-panel"  
        method = "${path.method}", 
        path = "${path.path}" 
        .parameters = "${path.parameters}" 
        .request_body = "${path.requestBody}"
        .api_keys = "${nonEmptyApiKeys}"
        .servers = "${path.servers}" 
        server-url = "${path.servers && path.servers.length > 0 ? path.servers[0].url : this.selectedServer.computedUrl}" 
        allow-try = "${this.allowTry}"
        accept = "${accept}"
        render-style="${this.renderStyle}" 
        schema-style = "${this.schemaStyle}"
        active-schema-tab = "${this.defaultSchemaTab}"
        schema-expand-level = "${this.schemaExpandLevel}"
        schema-description-expanded = "${this.schemaDescriptionExpanded}"
      > </api-request>

      ${path.callbacks ? callbackTemplate.call(this, path.callbacks) : ''}

      <api-response
        class = 'response-panel'
        .responses="${path.responses}"
        render-style="${this.renderStyle}"
        schema-style="${this.schemaStyle}"
        active-schema-tab = "${this.defaultSchemaTab}"
        schema-expand-level = "${this.schemaExpandLevel}"
        schema-description-expanded = "${this.schemaDescriptionExpanded}"
      > </api-response>
    </div>
  </div>
  `;
}

export default function expandedEndpointTemplate() {
  return html`
  ${this.resolvedSpec.tags.map((tag) => html`
    <div id="${tag.name.replace(/[\s#:?&=]/g, '-')}" class='regular-font section-gap--read-mode observe-me' style="border-top:1px solid var(--primary-color);">
      <div class="title tag">${tag.name}</div>
      <div class="regular-font-size">
        ${unsafeHTML(`<div class='m-markdown regular-font'>${marked(tag.description ? tag.description : '')}</div>`)}
      </div>
    </div>
    <div class='regular-font section-gap--read-mode'>
      ${tag.paths.map((path) => endpointBodyTemplate.call(this, path))}
    </div>
    `)
  }
`;
}
/* eslint-enable indent */
