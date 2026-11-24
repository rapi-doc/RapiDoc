/**
 * Renders the portal theme stylesheet (styles/portal-theme.css) for a portal config.
 */

import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { DEFAULT_PRIMARY_COLOR, DEFAULT_LIGHT_ACCENT } from "../config/normalizer.js";
import { accentColors } from "./accent-colors.js";

export { DEFAULT_PRIMARY_COLOR };

const THEME_CSS_PATH = fileURLToPath(new URL("../styles/portal-theme.css", import.meta.url));

const SYSTEM_SANS_STACK = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`;
const SYSTEM_MONO_STACK = `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
const DEFAULT_MONO_STACK = `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Roboto Mono', monospace`;

/**
 * @param {object} portalConfig - Normalized rapidoc.config.yaml
 * @returns {string} CSS with the accent colors and font stacks filled in
 */
export function renderThemeCss(portalConfig = {}) {
  const primaryColor = portalConfig.theme?.primary || DEFAULT_PRIMARY_COLOR;
  const primaryLight =
    portalConfig.theme?.primaryLight || portalConfig.theme?.primary || DEFAULT_LIGHT_ACCENT.primary;
  const accent = accentColors(primaryColor);
  const accentLight = accentColors(primaryLight);
  // White on amber's light accent, as in RapiDoc's amber theme (4.52:1; black measures a little higher)
  const onPrimaryLight =
    primaryLight === DEFAULT_LIGHT_ACCENT.primary
      ? DEFAULT_LIGHT_ACCENT.onPrimary
      : accentLight.onPrimary;
  const fonts = portalConfig.theme?.fonts || {};
  const fontSans = fonts.sans ? `'${fonts.sans.family}', ${SYSTEM_SANS_STACK}` : SYSTEM_SANS_STACK;
  const fontMono = fonts.mono ? `'${fonts.mono.family}', ${SYSTEM_MONO_STACK}` : DEFAULT_MONO_STACK;

  return fs
    .readFileSync(THEME_CSS_PATH, "utf8")
    .replaceAll("__PORTAL_PRIMARY_COLOR__", primaryColor)
    .replaceAll("__PORTAL_ON_PRIMARY__", accent.onPrimary)
    .replaceAll("__PORTAL_PRIMARY_LIGHT__", primaryLight)
    .replaceAll("__PORTAL_ON_PRIMARY_LIGHT__", onPrimaryLight)
    .replaceAll("__PORTAL_PRIMARY_TEXT_LIGHT__", accentLight.textLight)
    .replaceAll("__PORTAL_PRIMARY_TEXT_DARK__", accent.textDark)
    .replaceAll("__FONT_SANS_STACK__", fontSans)
    .replaceAll("__FONT_MONO_STACK__", fontMono);
}
