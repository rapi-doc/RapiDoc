import type { StarlightPlugin } from "@astrojs/starlight/types";
import type { RapiDocOptions, SidebarMethods } from "@rapidoc/embed";

export interface StarlightRapidocApi {
  /** The URL path of the reference page, for example `/api`. Required. */
  uiPath?: string;
  /** @deprecated Renamed to `uiPath`. */
  path?: string;
  /** The OpenAPI document: a file (JSON or YAML, relative to the project root), a URL, or the object. Read at build time. */
  spec: string | object;
  /** Page title. Default: the document's `info.title`. */
  title?: string;
  /** Sidebar group label. Default: the title. */
  label?: string;
  /** Attributes of `<rapi-doc>`, in kebab-case or camelCase. They win over the plugin's own. */
  options?: RapiDocOptions;
  /**
   * `false` adds nothing to the sidebar. `collapsed: true` starts the tag groups collapsed. `methods` is
   * how each operation's HTTP method is shown, with the values of `<rapi-doc>`'s `show-method-in-nav-bar`:
   * `"as-colored-text"` (default), `"as-plain-text"`, `"as-colored-block"`, or `false` for none.
   */
  sidebar?: false | { collapsed?: boolean; methods?: SidebarMethods };
}

export type StarlightRapidocOptions = StarlightRapidocApi | { apis: StarlightRapidocApi[] };

/** Starlight plugin: an API reference page per OpenAPI document, with its operations in the sidebar. */
export default function starlightRapidoc(options: StarlightRapidocOptions): StarlightPlugin;
