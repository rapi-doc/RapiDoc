import type { UserConfig, DefaultTheme } from "vitepress";

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

/** Sidebar items for one API: an overview link, then a group per tag with a link per operation. */
export declare function rapidocSidebar(
  spec: string | object,
  link: string,
  options?: { root?: string; collapsed?: boolean },
): Promise<DefaultTheme.SidebarItem[]>;

export declare function loadSpec(spec: string | object, root?: string): Promise<object>;

/** Where the OAuth return page is served, under the site's base. */
export declare const OAUTH_RECEIVER_PATH: string;
