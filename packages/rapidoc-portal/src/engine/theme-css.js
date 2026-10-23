/**
 * Renders the portal theme stylesheet (styles/portal-theme.css) for a portal config.
 */

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const THEME_CSS_PATH = fileURLToPath(new URL('../styles/portal-theme.css', import.meta.url));

export const DEFAULT_PRIMARY_COLOR = '#f76b39';

const SYSTEM_SANS_STACK = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`;
const SYSTEM_MONO_STACK = `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
const DEFAULT_MONO_STACK = `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Roboto Mono', monospace`;

/**
 * @param {object} portalConfig - Normalized rapidoc.config.yaml
 * @returns {string} CSS with the primary color and font stacks filled in
 */
export function renderThemeCss(portalConfig = {}) {
  const primaryColor = portalConfig.rapidoc?.['primary-color'] || DEFAULT_PRIMARY_COLOR;
  const font = portalConfig.theme?.font;
  const fontSans = font?.name ? `'${font.name}', ${SYSTEM_SANS_STACK}` : SYSTEM_SANS_STACK;
  const fontMono = font?.monoName ? `'${font.monoName}', ${SYSTEM_MONO_STACK}` : DEFAULT_MONO_STACK;

  return fs
    .readFileSync(THEME_CSS_PATH, 'utf8')
    .replaceAll('__PORTAL_PRIMARY_COLOR__', primaryColor)
    .replaceAll('__FONT_SANS_STACK__', fontSans)
    .replaceAll('__FONT_MONO_STACK__', fontMono);
}
