import type { LoadContext, Plugin } from "@docusaurus/types";
import type { SidebarMethods } from "@rapidoc/embed";

export interface RapidocDocusaurusOptions {
  /** The OpenAPI documents the pages show, by name: a file (JSON or YAML, relative to the site folder), a URL or the object. Read at build time. */
  apis?: Record<string, string | object>;
}

/** The Docusaurus plugin: `plugins: [["@rapidoc/docusaurus", { apis: { pets: "./openapi.yaml" } }]]`. */
export default function rapidocDocusaurus(
  context: LoadContext,
  options?: RapidocDocusaurusOptions,
): Plugin<Record<string, object>>;

export type RapidocSidebarItem =
  | { type: "doc"; id: string; label: string }
  | { type: "link"; label: string; href: string; className?: string }
  | { type: "category"; label: string; collapsed: boolean; items: RapidocSidebarItem[] };

export interface RapidocSidebarOptions {
  /** The OpenAPI document: a file (JSON or YAML, relative to `root`), a URL or the object. Read when the site is built. */
  spec: string | object;
  /** The URL path of the page that shows the API, for example `/docs/api`. */
  uiPath: string;
  /** The id of the doc that holds the page (`api` for `docs/api.mdx`), so the sidebar shows on it. */
  docId?: string;
  /**
   * How each operation's HTTP method is shown, with the values of `<rapi-doc>`'s `show-method-in-nav-bar`:
   * `"as-colored-text"` (default), `"as-plain-text"`, `"as-colored-block"`, or `false` for none.
   */
  methods?: SidebarMethods;
  /** Start the tag categories collapsed. */
  collapsed?: boolean;
  /** Folder that a relative `spec` starts from. Default: the working directory. */
  root?: string;
}

/** Sidebar items for one API: an overview item, then a category per tag with a link per operation. */
export declare function rapidocSidebar(
  options: RapidocSidebarOptions,
): Promise<RapidocSidebarItem[]>;

/**
 * The same items, returned directly, for `sidebars.js` (which cannot wait for a promise). It reads the spec
 * in a short-lived Node process.
 */
export declare function rapidocSidebarSync(options: RapidocSidebarOptions): RapidocSidebarItem[];

export declare function loadSpec(spec: string | object, root?: string): Promise<object>;
export declare const PLUGIN_NAME: string;
/** The route of the OAuth return page, under the site's baseUrl. */
export declare const OAUTH_RECEIVER_PATH: string;
