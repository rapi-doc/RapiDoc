/**
 * Callout types and their Phosphor icons, shared by Callout.astro (`<Callout>`, `{% callout %}`,
 * `{% aside %}`) and engine/callout-directives.js (`:::type` blocks). The colors are in portal-theme.css.
 * Starlight's (note, tip, caution, danger) and Zudoku's (info, warning, sparkles, rocket, ...) names
 * both work, so migrated docs render as they did.
 */
export const CALLOUT_ICONS = {
  note: 'info',
  info: 'info',
  tip: 'lightbulb',
  success: 'check-circle',
  caution: 'warning',
  warning: 'warning',
  danger: 'shield-warning',
  sparkles: 'sparkle',
  rocket: 'rocket',
  settings: 'gear',
  zap: 'lightning',
  lock: 'lock',
  megaphone: 'megaphone',
};

export const CALLOUT_TYPES = Object.keys(CALLOUT_ICONS);
