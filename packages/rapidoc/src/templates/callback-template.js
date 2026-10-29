/**
 * Renders OpenAPI callback requests and nested response definitions within an endpoint.
 */
import { html } from "lit";

export default function callbackTemplate(callbacks) {
  return html`
    <h4 class="rapidoc-heading label-heading req-res-title" part="heading heading-4">Callbacks</h4>
    ${Object.entries(callbacks).map(
      (kv) => html`
        <div class="tiny-title" style="padding: 12px; border:1px solid var(--border)">
          <h5 class="rapidoc-heading callback-name" part="heading heading-5">${kv[0]}</h5>
          ${Object.entries(kv[1]).map(
            (pathObj) => html`
              <div class="callback-operation-list mono-font small-font-size">
                ${Object.entries(pathObj[1]).map(
                  (method) => html`
                    <div class="callback-operation-item">
                      <div class="callback-operation-header">
                        <div class="method method-fg ${method[0]} callback-method">
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
                          method="${method[0] || ""}"
                          path="${pathObj[0] || ""}"
                          .parameters="${method[1]?.parameters || ""}"
                          .request_body="${method[1]?.requestBody || ""}"
                          fill-request-fields-with-example="${this.fillRequestFieldsWithExample}"
                          allow-try="false"
                          render-style="${this.renderStyle}"
                          schema-style="${this.schemaStyle}"
                          active-schema-tab="${this.defaultSchemaTab}"
                          schema-expand-level="${this.schemaExpandLevel}"
                          schema-description-expanded="${this.schemaDescriptionExpanded}"
                          allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
                          schema-hide-read-only="false"
                          schema-hide-write-only="${this.schemaHideWriteOnly === "never" ? "false" : "true"}"
                          fetch-credentials="${this.fetchCredentials}"
                          exportparts="section-request-title:section-request-title, heading:heading, heading-4:heading-4, heading-5:heading-5, heading-6:heading-6,
            wrap-request-btn:wrap-request-btn, btn:btn, btn-fill:btn-fill, btn-outline:btn-outline, btn-try:btn-try, btn-clear:btn-clear, btn-clear-resp:btn-clear-resp,
                          tab-panel:tab-panel, tab-btn:tab-btn, tab-btn-row:tab-btn-row, tab-content:tab-content, 
                          file-input:file-input, textbox:textbox, textbox-param:textbox-param, textarea:textarea, textarea-param:textarea-param, 
                          anchor:anchor, anchor-param-example:anchor-param-example, anchor-param-constraint:anchor-param-constraint, param-list:param-list, param:param, param-label:param-label, param-name:param-name, param-type:param-type, param-input:param-input, param-constraint:param-constraint, param-constraint-label:param-constraint-label, param-details:param-details, param-example-list:param-example-list, value-list:value-list, value-list-label:value-list-label, value-list-items:value-list-items, schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
                        >
                        </api-request>

                        <api-response
                          .config="${this.config}"
                          style="width:100%;"
                          class="${this.renderStyle}-mode"
                          callback="true"
                          .responses="${method[1]?.responses}"
                          render-style="${this.renderStyle}"
                          schema-style="${this.schemaStyle}"
                          active-schema-tab="${this.defaultSchemaTab}"
                          schema-expand-level="${this.schemaExpandLevel}"
                          schema-description-expanded="${this.schemaDescriptionExpanded}"
                          allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
                          schema-hide-read-only="${this.schemaHideReadOnly === "never" ? "false" : "true"}"
                          schema-hide-write-only="false"
                          exportparts="section-response-title:section-response-title, heading:heading, heading-4:heading-4, heading-5:heading-5, heading-6:heading-6,
            btn:btn, btn-response-status:btn-response-status, btn-selected-response-status:btn-selected-response-status, btn-fill:btn-fill, btn-outline:btn-outline, btn-copy:btn-copy,
                          tab-panel:tab-panel, tab-btn:tab-btn, tab-btn-row:tab-btn-row, tab-content:tab-content, 
                          schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle, param-list:param-list, param:param, param-label:param-label, param-name:param-name, param-type:param-type, param-constraint:param-constraint, param-constraint-label:param-constraint-label, param-details:param-details, param-example-list:param-example-list, value-list:value-list, value-list-label:value-list-label, value-list-items:value-list-items"
                        >
                        </api-response>
                      </div>
                    </div>
                  `,
                )}
              </div>
            `,
          )}
        </div>
      `,
    )}
  `;
}
