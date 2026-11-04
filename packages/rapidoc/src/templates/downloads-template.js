/**
 * Dedicated Download & Export Action Bar for OpenAPI specs and curated MCP servers.
 * Rendered independently of show-info to guarantee accessibility across all render modes.
 */
import { html } from "lit";
import { downloadResource, viewResource } from "~/utils/common-utils";
import { parseMcpEnabled } from "~/utils/mcp-generator";

export default function downloadsTemplate() {
  const showSpecDownload = this.specUrl && this.allowSpecFileDownload === "true";
  const showMcpExport = parseMcpEnabled(this.mcp);

  if (!showSpecDownload && !showMcpExport) {
    return "";
  }

  let sectionClass = "section-gap";
  if (this.renderStyle === "focused") {
    sectionClass = "section-gap--focused-mode";
  } else if (this.renderStyle === "read") {
    sectionClass = "section-gap--read-mode";
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
                  downloadResource(this.specUrl, "openapi-spec");
                }}"
              >
                Download OpenAPI spec
              </button>
              ${
                this.specUrl?.trim().toLowerCase().endsWith("json")
                  ? html`<button
                      class="btn btn-outline download-btn view-spec"
                      part="btn btn-outline"
                      @click="${() => {
                        viewResource(this.specUrl);
                      }}"
                    >
                      View OpenAPI spec (New Tab)
                    </button>`
                  : ""
              }
            `
          : ""
      }
      ${
        showMcpExport
          ? html`<button
              class="btn btn-outline download-btn"
              part="btn btn-outline btn-mcp-export"
              title="Download an MCP server project (manifest, runtime and stdio server) as a zip"
              @click="${() => {
                this.downloadMcpServer();
              }}"
            >
              Export MCP Server
            </button>`
          : ""
      }
    </section>
  `;
}
