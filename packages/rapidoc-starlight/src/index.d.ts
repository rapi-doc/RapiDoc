import type { StarlightPlugin } from "@astrojs/starlight/types";
import type { RapiDocOptions } from "@rapidoc/embed";

export interface StarlightRapidocApi {
  /** Where the reference page is served, for example `/api`. */
  path: string;
  /** The OpenAPI document: a file (JSON or YAML, relative to the project root), a URL, or the object. Read at build time. */
  spec: string | object;
  /** Page title. Default: the document's `info.title`. */
  title?: string;
  /** Sidebar group label. Default: the title. */
  label?: string;
  /** Attributes of `<rapi-doc>`, in kebab-case or camelCase. They win over the plugin's own. */
  options?: RapiDocOptions;
  /** `false` adds nothing to the sidebar; `{ collapsed: true }` starts the tag groups collapsed. */
  sidebar?: false | { collapsed?: boolean };
}

export type StarlightRapidocOptions = StarlightRapidocApi | { apis: StarlightRapidocApi[] };

/** Starlight plugin: an API reference page per OpenAPI document, with its operations in the sidebar. */
export default function starlightRapidoc(options: StarlightRapidocOptions): StarlightPlugin;
