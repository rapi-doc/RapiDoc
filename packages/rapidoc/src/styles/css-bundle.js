import ThemeTokens from './theme-tokens.js';
import FontStyles from './font-styles.js';
import InputStyles from './input-styles.js';
import FlexStyles from './flex-styles.js';
import TableStyles from './table-styles.js';
import EndpointStyles from './endpoint-styles.js';
import MicrolighterStyles from './microlighter-styles.js';
import TabStyles from './tab-styles.js';
import NavStyles from './nav-styles.js';
import InfoStyles from './info-styles.js';
import DialogBoxStyles from './dialog-box-styles.js';
import LayoutStyles from './layout-styles.js';
import BorderStyles from './border-styles.js';
import SchemaStyles from './schema-styles.js';
import CustomStyles from './custom-styles.js';

export const allStyles = [
  ThemeTokens,
  FontStyles,
  InputStyles,
  FlexStyles,
  TableStyles,
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
 * @param {string} [options.theme='amber'] - Theme preset name or valid hex color code
 * @param {'dark'|'light'|'system'} [options.colorScheme='dark'] - Color scheme
 * @param {string} [options.scope=''] - Optional outer selector (for Light DOM / non-shadow pre-rendering)
 * @returns {string} Fully concatenated CSS string
 */
export function getBundledCss(options = {}) {
  const { scope = '' } = options;

  let combinedCss = allStyles.map((s) => (s && s.cssText ? s.cssText : String(s || ''))).join('\n');

  // If rendering in Light DOM without Shadow DOM, adapt :host selectors to the container
  if (scope && scope !== ':host') {
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
export function getNavCss(scope = '') {
  let navCss = NavStyles && NavStyles.cssText ? NavStyles.cssText : String(NavStyles || '');
  if (scope && scope !== ':host') {
    navCss = navCss
      .replace(/:host\(\[color-scheme='([^']+)'\]\)/g, `[data-theme='$1'] ${scope}, ${scope}[color-scheme='$1']`)
      .replace(/:host\(([^)]+)\)/g, `${scope}$1`)
      .replace(/:host\b/g, scope)
      .replace(/::slotted\(([^)]+)\)/g, `$1`)
      .replace(/^\s*\.nav-bar\s*\{/gm, '&.nav-bar, & {');
    navCss = `${scope} {\n  --nav-item-padding: 0.3125rem 1rem 0.3125rem 0.625rem;\n${navCss}\n}\n[data-theme='light'] ${scope} .nav-method.as-colored-block {\n  color: var(--nav-method-badge-fg, var(--method-badge-fg, #fff));\n}\n`;
  }
  return navCss;
}

export default getBundledCss;
