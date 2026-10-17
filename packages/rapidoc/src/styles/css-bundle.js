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

export default getBundledCss;
