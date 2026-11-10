/**
 * The EXAMPLE / SCHEMA tab buttons of a request body, response or object parameter.
 */
import { html, nothing } from "lit";

/**
 * The two buttons, the configured default tab (`default-schema-tab`) first, so with "schema" the row reads
 * SCHEMA | EXAMPLE. The order follows the configured default, never the tab the reader selects, so the buttons
 * don't swap places under the pointer.
 *
 * @param {string} defaultTab - "example" or "schema" (config.defaultSchemaTab)
 * @param {string} activeTab - the selected tab; anything but "example" selects SCHEMA
 * @param {object} [options]
 * @param {string} [options.cls="tab-btn"] - button class ("v-tab-btn" for the vertical tabs)
 * @param {boolean} [options.part=true] - adds part="tab-btn"
 */
export function schemaTabButtons(defaultTab, activeTab, { cls = "tab-btn", part = true } = {}) {
  const partValue = part ? "tab-btn" : nothing;
  const example = html`<button part="${partValue}" class="${cls} ${activeTab === "example" ? "active" : ""}" data-tab="example">EXAMPLE</button>`;
  const schema = html`<button part="${partValue}" class="${cls} ${activeTab !== "example" ? "active" : ""}" data-tab="schema">SCHEMA</button>`;
  return defaultTab === "schema" ? [schema, example] : [example, schema];
}
