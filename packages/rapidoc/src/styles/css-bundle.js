import ThemeTokens, { DEFAULT_THEME } from "./theme-tokens.js";
import FontStyles from "./font-styles.js";
import InputStyles from "./input-styles.js";
import FlexStyles from "./flex-styles.js";
import AuthStyles from "./auth-styles.js";
import ParamListStyles from "./param-list-styles.js";
import EndpointStyles from "./endpoint-styles.js";
import MicrolighterStyles from "./microlighter-styles.js";
import TabStyles from "./tab-styles.js";
import NavStyles from "./nav-styles.js";
import InfoStyles from "./info-styles.js";
import DialogBoxStyles from "./dialog-box-styles.js";
import LayoutStyles from "./layout-styles.js";
import BorderStyles from "./border-styles.js";
import SchemaStyles from "./schema-styles.js";
import CustomStyles from "./custom-styles.js";

export const allStyles = [
  ThemeTokens,
  FontStyles,
  InputStyles,
  FlexStyles,
  AuthStyles,
  ParamListStyles,
  BorderStyles,
  EndpointStyles,
  MicrolighterStyles,
  TabStyles,
  NavStyles,
  InfoStyles,
  DialogBoxStyles,
  LayoutStyles,
  SchemaStyles,
  CustomStyles,
];

/**
 * Returns aggregated CSS text for Declarative Shadow DOM or Light DOM SSR/SSG pre-rendering.
 *
 * @param {Object} [options]
 * @param {string} [options.theme='ember'] - Theme preset name or valid hex color code
 * @param {'dark'|'light'|'system'} [options.colorScheme='dark'] - Color scheme
 * @param {string} [options.scope=''] - Optional outer selector (for Light DOM / non-shadow pre-rendering)
 * @returns {string} Fully concatenated CSS string
 */
export function getBundledCss(options = {}) {
  const { scope = "" } = options;

  let combinedCss = allStyles.map((s) => (s && s.cssText ? s.cssText : String(s || ""))).join("\n");

  // If rendering in Light DOM without Shadow DOM, adapt :host selectors to the container
  if (scope && scope !== ":host") {
    combinedCss = combinedCss
      .replace(/:host\(([^)]+)\)/g, `${scope}$1`)
      .replace(/:host\b/g, scope)
      .replace(/::slotted\(([^)]+)\)/g, `$1`);
  }

  return combinedCss;
}

/**
 * Returns RapiDoc's navigation CSS text for shared usage in @rapidoc/portal.
 *
 * @param {string} [scope=''] - Optional outer selector
 * @returns {string} Navigation CSS string
 */
export function getNavCss(scope = "") {
  let navCss = NavStyles && NavStyles.cssText ? NavStyles.cssText : String(NavStyles || "");
  if (scope && scope !== ":host") {
    navCss = navCss
      .replace(
        /:host\(\[color-scheme='([^']+)'\]\)/g,
        `[data-theme='$1'] ${scope}, ${scope}[color-scheme='$1']`,
      )
      .replace(/:host\(([^)]+)\)/g, `${scope}$1`)
      .replace(/:host\b/g, scope)
      .replace(/::slotted\(([^)]+)\)/g, `$1`)
      .replace(/^\s*\.nav-bar\s*\{/gm, "&.nav-bar, & {");
    navCss = `${scope} {\n  --sidebar-item-padding: 0.3125rem 1rem 0.3125rem 0.625rem;\n${navCss}\n}\n[data-theme='light'] ${scope} .nav-method.as-colored-block {\n  color: var(--method-badge-fg);\n}\n`;
  }
  return navCss;
}

/**
 * Returns RapiDoc's design system & theme tokens CSS text for shared usage in @rapidoc/portal.
 * Converts Web Component :host rules into Light DOM portal selectors (:root, [data-theme='dark'], [data-theme='light']).
 *
 * @param {string} [theme='ember'] - Theme preset name (see THEME_PRESETS) or hex color
 * @param {string} [scope=':root'] - Scope selector
 * @returns {string} Theme tokens CSS string
 */
export function getThemeTokensCss(theme = DEFAULT_THEME, scope = ":root") {
  let tokensCss =
    ThemeTokens && ThemeTokens.cssText ? ThemeTokens.cssText : String(ThemeTokens || "");
  const activeTheme =
    typeof theme === "string"
      ? theme.trim().toLowerCase()
      : typeof theme === "object" && theme?.theme
        ? String(theme.theme).trim().toLowerCase()
        : DEFAULT_THEME;

  tokensCss = tokensCss
    .replace(/:host\(\[theme='([^']+)'\]\[color-scheme='light'\]\)/g, (match, t) =>
      t === activeTheme ? "[data-theme='light']" : `[data-theme='light'][data-theme-preset='${t}']`,
    )
    .replace(/:host\(\[theme='([^']+)'\]\[color-scheme='system'\]\)/g, (match, t) =>
      t === activeTheme
        ? "[data-theme='system']"
        : `[data-theme='system'][data-theme-preset='${t}']`,
    )
    .replace(/:host\(\[theme='([^']+)'\]\)/g, (match, t) =>
      t === activeTheme
        ? `${scope}, [data-theme='dark']`
        : `[data-theme='dark'][data-theme-preset='${t}']`,
    )
    .replace(/:host\(:not\(\[theme\]\)\[color-scheme='light'\]\)/g, "[data-theme='light']")
    .replace(/:host\(:not\(\[theme\]\)\[color-scheme='system'\]\)/g, "[data-theme='system']")
    .replace(/:host\(:not\(\[theme\]\)\)/g, `${scope}, [data-theme='dark']`)
    .replace(/:host\(\[color-scheme='light'\]\)/g, "[data-theme='light']")
    .replace(/:host\(\[color-scheme='dark'\]\)/g, "[data-theme='dark']")
    .replace(/:host\(\[color-scheme='system'\]\)/g, "[data-theme='system']")
    .replace(/:host\(:not\(\[color-scheme\]\)\)/g, `${scope}, [data-theme='dark']`)
    .replace(/:host\b/g, scope);

  return tokensCss;
}

export default getBundledCss;
