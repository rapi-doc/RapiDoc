/**
 * Dedicated Download & Export Action Bar for OpenAPI specs and curated MCP servers.
 * Rendered independently of show-info to guarantee accessibility across all render modes.
 */
import { html } from 'lit';
import { downloadResource, viewResource } from '~/utils/common-utils';
import { parseMcpTargets, MCP_TARGET_LABELS } from '~/utils/mcp-generator';

export default function downloadsTemplate() {
  const mcpTargets = parseMcpTargets(this.mcp);
  const showSpecDownload = this.specUrl && this.allowSpecFileDownload === 'true';
  const showMcpExport = mcpTargets.length > 0;

  if (!showSpecDownload && !showMcpExport) {
    return '';
  }

  let sectionClass = 'section-gap';
  if (this.renderStyle === 'focused') {
    sectionClass = 'section-gap--focused-mode';
  } else if (this.renderStyle === 'read') {
    sectionClass = 'section-gap--read-mode';
  }

  return html`
    <section id="downloads" part="section-downloads" class="downloads-bar observe-me ${sectionClass}">
      ${
        showSpecDownload
          ? html`
              <button
                class="btn btn-outline download-btn"
                part="btn btn-outline"
                @click="${() => {
                  downloadResource(this.specUrl, 'openapi-spec');
                }}"
              >
                Download OpenAPI spec
              </button>
              ${
                this.specUrl?.trim().toLowerCase().endsWith('json')
                  ? html`<button
                      class="btn btn-outline download-btn view-spec"
                      part="btn btn-outline"
                      @click="${() => {
                        viewResource(this.specUrl);
                      }}"
                    >
                      View OpenAPI spec (New Tab)
                    </button>`
                  : ''
              }
            `
          : ''
      }
      ${
        showMcpExport
          ? mcpTargets.length === 1
            ? html`<button
                class="btn btn-outline download-btn"
                part="btn btn-outline btn-mcp-export"
                @click="${() => {
                  this.downloadMcpServer(mcpTargets[0]);
                }}"
              >
                Export MCP Server (${MCP_TARGET_LABELS[mcpTargets[0]] || mcpTargets[0]})
              </button>`
            : html`<select
                class="btn btn-outline download-select"
                part="btn btn-outline btn-mcp-export"
                @change="${(e) => {
                  const target = e.target.value;
                  if (target) {
                    this.downloadMcpServer(target);
                    e.target.value = '';
                  }
                }}"
              >
                <option value="" disabled selected>Export MCP Server</option>
                ${mcpTargets.map((t) => html`<option value="${t}">Export ${MCP_TARGET_LABELS[t] || t}</option>`)}
              </select>`
          : ''
      }
    </section>
  `;
}
