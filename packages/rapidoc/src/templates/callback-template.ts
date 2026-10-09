/**
 * Renders OpenAPI callback requests and nested response definitions within an endpoint.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { OpenAPIV3_1 } from '@scalar/openapi-types';
import type { RapiDocElement } from '~/types/element';
import type { ResolvedCallbacks } from '~/types/spec';

export default function callbackTemplate(this: RapiDocElement, callbacks: ResolvedCallbacks): TemplateResult {
  return html`
    <div class="req-res-title" style="margin-top:12px">CALLBACKS</div>
    ${Object.entries(callbacks).map(
      (kv) => html`
        <div class="tiny-title" style="padding: 12px; border:1px solid var(--light-border-color)">
          ${kv[0]}
          ${Object.entries(kv[1]).map(
            (pathObj) => html`
              <div class="mono-font small-font-size" style="display:flex; margin-left:16px;">
                <div style="width:100%">
                  ${Object.entries(pathObj[1] as Record<string, OpenAPIV3_1.OperationObject>).map(
                    (method) => html`
                      <div>
                        <div style="margin-top:12px;">
                          <div
                            class="method method-fg ${method[0]}"
                            style="width:70px; border:none; margin:0; padding:0; line-height:20px; vertical-align: baseline;text-align:left"
                          >
                            <span style="font-size:20px;"> &#x2944; </span>
                            ${method[0]}
                          </div>
                          <span style="line-height:20px; vertical-align: baseline;">${pathObj[0]}</span>
                        </div>
                        <div class="expanded-req-resp-container">
                          <api-request
                            .config="${this.config}"
                            class="${this.renderStyle}-mode callback"
                            style="width:100%;"
                            callback="true"
                            method="${method[0] || ''}"
                            path="${pathObj[0] || ''}"
                            .parameters="${method[1]?.parameters || ''}"
                            .request_body="${method[1]?.requestBody || ''}"
                            allow-try="false"
                            schema-hide-read-only="false"
                            schema-hide-write-only="${this.schemaHideWriteOnly === 'never' ? 'false' : 'true'}"
                            exportparts="wrap-request-btn:wrap-request-btn, btn:btn, btn-fill:btn-fill, btn-outline:btn-outline, btn-try:btn-try, btn-clear:btn-clear, btn-clear-resp:btn-clear-resp,
                            tab-panel:tab-panel, tab-btn:tab-btn, tab-btn-row:tab-btn-row, tab-coontent:tab-content, 
                            file-input:file-input, textbox:textbox, textbox-param:textbox-param, textarea:textarea, textarea-param:textarea-param, 
                            anchor:anchor, anchor-param-example:anchor-param-example, schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
                          >
                          </api-request>

                          <api-response
                            .config="${this.config}"
                            style="width:100%;"
                            class="${this.renderStyle}-mode"
                            callback="true"
                            .responses="${method[1]?.responses}"
                            schema-hide-read-only="${this.schemaHideReadOnly === 'never' ? 'false' : 'true'}"
                            schema-hide-write-only="false"
                            exportparts="btn:btn, btn-response-status:btn-response-status, btn-selected-response-status:btn-selected-response-status, btn-fill:btn-fill, btn-copy:btn-copy,
                            tab-panel:tab-panel, tab-btn:tab-btn, tab-btn-row:tab-btn-row, tab-coontent:tab-content, 
                            schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
                          >
                          </api-response>
                        </div>
                      </div>
                    `
                  )}
                </div>
              </div>
            `
          )}
        </div>
      `
    )}
  `;
}
