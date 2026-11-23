// Types of @rapidoc/embed/sidebar: what the docs-site integrations add to their sidebars.

/** The methods that get a label and a colour in a docs-site sidebar. */
export declare const SIDEBAR_METHODS: string[];
/** `delete` → `DEL`: the short label of an HTTP method; empty for an unknown one. */
export declare function methodLabel(method: string): string;
/** Class names for an operation's sidebar item: `rapidoc-op rapidoc-op--get`, plus `rapidoc-op--deprecated`. */
export declare function operationClass(
  operation: { method?: string; deprecated?: boolean },
  methods?: SidebarMethods | null,
): string;
/** How a docs-site sidebar shows an operation's method: the values of `show-method-in-nav-bar`, or `false`. */
export type SidebarMethods =
  | boolean
  | "false"
  | "as-plain-text"
  | "as-colored-text"
  | "as-colored-block";
export declare const SIDEBAR_METHOD_STYLES: string[];
export declare const DEFAULT_SIDEBAR_METHODS: "as-colored-text";
/** The `methods` option as one of `SIDEBAR_METHOD_STYLES`; throws on anything else. */
export declare function sidebarMethods(value?: SidebarMethods | null): string;
/** CSS for the method labels and the deprecated mark of a docs-site sidebar; the selectors are the theme's. */
export declare function sidebarCss(theme: {
  label: (className: string) => string;
  text: (className: string) => string;
  dark: string;
  /** Selector of the label inside the current item, when the theme fills that item with a colour. */
  active?: string;
}): string;
