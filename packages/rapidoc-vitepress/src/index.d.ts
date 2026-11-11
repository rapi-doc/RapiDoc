import type { UserConfig, DefaultTheme } from "vitepress";
import type { SidebarMethods } from "@rapidoc/embed";

export interface WithRapidocOptions {
  /** The OpenAPI documents the pages show, by name: a file (JSON or YAML, relative to `root`), a URL or the object. Read at build time. */
  apis?: Record<string, string | object>;
  /** Folder that relative spec paths start from. Default: the working directory. */
  root?: string;
}

/** Wraps a VitePress config with what `<RapidocReference>` needs. */
export declare function withRapidoc<T extends UserConfig<any>>(
  config?: T,
  options?: WithRapidocOptions,
): T;

export interface RapidocSidebarOptions {
  /** The OpenAPI document: a file (JSON or YAML, relative to `root`), a URL or the object. Read when the site is built. */
  spec: string | object;
  /** The URL path of the page that shows the API, for example `/api`. */
  uiPath: string;
  /**
   * How each operation's HTTP method is shown, with the values of `<rapi-doc>`'s `show-method-in-nav-bar`:
   * `"as-colored-text"` (default), `"as-plain-text"`, `"as-colored-block"`, or `false` for none.
   */
  methods?: SidebarMethods;
  /** Start the tag groups collapsed. */
  collapsed?: boolean;
  /** Folder that a relative `spec` starts from. Default: the working directory. */
  root?: string;
}

/** Sidebar items for one API: an overview link, then a group per tag with a link per operation. */
export declare function rapidocSidebar(
  options: RapidocSidebarOptions,
): Promise<DefaultTheme.SidebarItem[]>;
/** @deprecated The form of version 0.1; pass one options object. */
export declare function rapidocSidebar(
  spec: string | object,
  link: string,
  options?: { root?: string; collapsed?: boolean },
): Promise<DefaultTheme.SidebarItem[]>;

export declare function loadSpec(spec: string | object, root?: string): Promise<object>;

/** Where the OAuth return page is served, under the site's base. */
export declare const OAUTH_RECEIVER_PATH: string;
