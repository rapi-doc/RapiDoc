import { css, unsafeCSS } from 'lit';

export const DEFAULT_THEME = 'ember';

/**
 * Brand theme presets (the `theme` attribute), as CSS declaration lists. Each one sets the accent and, where the theme tints
 * its surfaces, the background and foreground for the dark and the light color scheme; every other
 * token (card, muted, border, input, ...) is derived from those two in section 3. A theme rule outranks the
 * shared color-scheme rules, so a theme that sets a surface for one scheme must set it for the other too.
 *
 * - 'ember'  (default): orange-red accent over neutral charcoal
 * - 'carbon': monochrome, near-black surfaces and a white accent
 * - 'cobalt': matte steel-blue accent over grey-blue slate, with cards darker than the page
 * - 'jade':   daisyUI-style green accent over slate-navy, with cards darker than the page
 * - 'indigo': indigo accent over indigo-black
 */
export const THEMES = {
  ember: {
    dark: `
      --primary: #f76b39;
      --primary-foreground: #000000;
    `,
    light: `
      --primary: #f76b39;
      --primary-foreground: #000000;
    `,
  },
  carbon: {
    dark: `
      --primary: #fafafa;
      --primary-foreground: #18181b;
      --ring: #a1a1aa;
      --background: #121214;
      --foreground: #e4e4e7;
    `,
    light: `
      --primary: #18181b;
      --primary-foreground: #fafafa;
      --ring: #52525b;
      --background: #ffffff;
      --foreground: #18181b;
    `,
  },
  cobalt: {
    dark: `
      --primary: #7aa2d6;
      --primary-foreground: #0f1a2a;
      --background: #1e2530;
      --foreground: #b4bcc8;
      --card: #181e27;
      --card-foreground: #ced5df;
    `,
    light: `
      --primary: #3a6cb0;
      --primary-foreground: #ffffff;
      --background: #ffffff;
      --foreground: #243244;
      --card: color-mix(in srgb, var(--background) 94%, var(--foreground));
      --card-foreground: color-mix(in srgb, var(--foreground) 90%, #000000);
    `,
  },
  jade: {
    dark: `
      --primary: #00d390;
      --primary-foreground: #0b1f17;
      --background: #1d232a;
      --foreground: #a6adbb;
      --card: #181e25;
      --card-foreground: #c8cfd9;
    `,
    light: `
      --primary: #047857;
      --primary-foreground: #ffffff;
      --background: #ffffff;
      --foreground: #1a2e26;
      --card: color-mix(in srgb, var(--background) 94%, var(--foreground));
      --card-foreground: color-mix(in srgb, var(--foreground) 90%, #000000);
    `,
  },
  indigo: {
    dark: `
      --primary: #818cf8;
      --primary-foreground: #1e1b4b;
      --background: #0f0e1c;
      --foreground: #e4e2f5;
    `,
    light: `
      --primary: #4f46e5;
      --primary-foreground: #ffffff;
      --background: #ffffff;
      --foreground: #1e1b3a;
    `,
  },
};

export const THEME_PRESETS = Object.keys(THEMES);

/**
 * The :host rules for one preset: dark (the default scheme), light, and light again for
 * color-scheme="system" when the OS prefers light. The default preset also applies without a theme attribute.
 * The selector shapes are what getThemeTokensCss (css-bundle.js) rewrites for the portal's light DOM.
 */
function presetCss(name, { dark, light }) {
  const selector = (scheme) => {
    const suffix = scheme ? `[color-scheme='${scheme}']` : '';
    const hosts = [`:host([theme='${name}']${suffix})`];
    if (name === DEFAULT_THEME) hosts.push(`:host(:not([theme])${suffix})`);
    return hosts.join(',\n  ');
  };
  return `
  /* --------- ${name.toUpperCase()}${name === DEFAULT_THEME ? ' (default)' : ''} --------- */
  ${selector()} {${dark}}
  ${selector('light')} {${light}}
  @media (prefers-color-scheme: light) {
    ${selector('system')} {${light}}
  }
`;
}

const presetsCss = unsafeCSS(
  Object.entries(THEMES)
    .map(([name, schemes]) => presetCss(name, schemes))
    .join('')
);

/**
 * Checks if a string is a valid CSS hex color code (#rgb, #rrggbb, #rrggbbaa).
 * @param {string} color - Color string to validate.
 * @returns {boolean} True if the string is a valid hex color code.
 */
export function isValidHexColor(color) {
  if (!color || typeof color !== 'string') return false;
  return /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(color.trim());
}

/**
 * Checks if a theme string is valid: must match an allowed preset name or be a valid hex color code.
 * @param {string} theme - Theme name or hex string to validate.
 * @returns {boolean} True if theme is supported.
 */
export function isValidTheme(theme) {
  if (!theme || typeof theme !== 'string') return false;
  const trimmed = theme.trim().toLowerCase();
  return THEME_PRESETS.includes(trimmed) || isValidHexColor(theme);
}

/**
 * Normalizes and validates the theme attribute value.
 * - Allowed presets are normalized to lowercase.
 * - Valid hex color codes are preserved as-is.
 * - Any invalid, unrecognized, or missing value defaults to DEFAULT_THEME.
 *
 * @param {string} theme - The raw theme attribute value.
 * @returns {{ theme: string }}
 */
export function normalizeTheme(theme) {
  if (!theme || typeof theme !== 'string') {
    return { theme: DEFAULT_THEME };
  }
  const trimmed = theme.trim();
  const lower = trimmed.toLowerCase();
  if (THEME_PRESETS.includes(lower)) {
    return { theme: lower };
  }
  if (isValidHexColor(trimmed)) {
    return { theme: trimmed };
  }
  return { theme: DEFAULT_THEME };
}

/**
 * Determines whether a color parameter is a custom brand hex code rather than a preset name.
 * @param {string} color - Theme identifier or color code.
 * @returns {boolean}
 */
export function isCustomColor(color) {
  if (!color || typeof color !== 'string') return false;
  const trimmed = color.trim().toLowerCase();
  if (THEME_PRESETS.includes(trimmed)) return false;
  return isValidHexColor(color);
}

/**
 * Calculates whether a hex color is perceived as light using standard YIQ luminance formula.
 * Used to ensure accessible high-contrast text foreground (pure black on light vs white on dark).
 * @param {string} color - Hex color code (#rgb, #rrggbb, #rrggbbaa).
 * @returns {boolean} True if color luminance >= 128 (light).
 */
export function isLightColor(color) {
  if (!color || typeof color !== 'string') return false;
  let hex = color.trim().replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (hex.length === 6 || hex.length === 8) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128;
  }
  return false;
}

/**
 * Dynamically applies custom corporate brand hex colors to the host element.
 * Calculates luminance and injects `--primary` and `--primary-foreground` (`--ring` follows `--primary`).
 * @param {HTMLElement} element - Custom element host target.
 * @param {string} themeVal - User-supplied theme attribute value.
 */
export function applyCustomTheme(element, themeVal) {
  if (!element || !element.style) return;
  if (!themeVal || THEME_PRESETS.includes(themeVal.trim().toLowerCase()) || !isValidHexColor(themeVal)) {
    element.style.removeProperty('--primary');
    element.style.removeProperty('--primary-foreground');
    return;
  }
  const hex = themeVal.trim();
  element.style.setProperty('--primary', hex);
  const fg = isLightColor(hex) ? '#000000' : '#ffffff';
  element.style.setProperty('--primary-foreground', fg);
}

export default css`
  /* =========================================================================
     1. ROOT DESIGN TOKEN DEFAULTS (:host)
     ========================================================================= */
  :host {
    /* --- Fonts (shadcn/ui) --- */
    --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Roboto Mono', monospace;

    /* --- Headings & Prose (RapiDoc headings and markdown descriptions) --- */
    --heading-font: var(--font-sans);
    --heading-weight: 600;
    --heading-line-height: 1.25;
    --heading-letter-spacing: normal;
    --heading-color: var(--foreground);
    --heading-margin-top: 1.5em;
    --heading-margin-bottom: 0.5em;
    --h1-font-size: 2rem;
    --h2-font-size: 1.5rem;
    --h3-font-size: 1.25rem;
    --h4-font-size: 1rem;
    --h5-font-size: 0.875rem;
    --h6-font-size: 0.8125rem;
    --label-heading-font-size: var(--font-size-small);
    --line-height: 1.6;
    --paragraph-spacing: 1em;

    /* --- Corner Radius (shadcn/ui) --- */
    --radius: 0.25rem;

    /* --- Sizes & Layout --- */
    /* xs is the floor: badges, chips and tiny buttons never go below it. description is for
       short prose next to data (parameter and property descriptions). */
    --font-size-xs: 11px;
    --font-size-small: 12px;
    --font-size-description: 13px;
    --font-size-mono: 13px;
    --font-size-regular: 14px;
    --resp-area-height: 400px;
    --table-schema-key-width: 240px;
    --table-schema-key-text-overflow: ellipsis;
    --table-schema-key-whitespace: nowrap;
    --scroll-margin-top: 120px;

    /* --- Parameter lists (request parameters, form fields, response headers) --- */
    --param-label-width: 12rem;
    --param-gap: 0.5rem;
    --param-row-gap: 0.25rem;
    --param-padding: 0.5rem;
    --auth-scheme-padding: 0.75rem;
    --value-list-gap: 0.375rem;
    --value-list-row-gap: 0.125rem;
    --value-list-label-gap: 0.25rem;

    /* --- Focus Ring & Selection --- */
    --ring: var(--primary);
    --focus-shadow: 0 0 0 1px transparent, 0 0 0 2px color-mix(in srgb, var(--ring) 40%, transparent);
    --selection-bg: color-mix(in srgb, var(--primary) 25%, transparent);
    --selection-fg: var(--foreground);

    /* --- Navigation Sidebar (shadcn/ui sidebar tokens) --- */
    --sidebar-width: 18.75rem;
    --sidebar-item-padding: 0.4375rem 1rem 0.4375rem 0.625rem;
    --sidebar-logo-max-height: 60px;
    --sidebar: var(--background);
    --sidebar-foreground: var(--foreground);
    --sidebar-primary: var(--primary);
    --sidebar-accent-foreground: var(--foreground);
    --sidebar-border: var(--border);
    --sidebar-ring: var(--ring);
  }

  /* =========================================================================
     2. SCALE & GEOMETRY TOKENS (radius, scale, nav-item-spacing)
     ========================================================================= */

  /* --- 2A. Corner Radius Scale (radius) --- */
  :host([radius='none']) {
    --radius: 0px;
  }
  :host([radius='sm']),
  :host(:not([radius])) {
    --radius: 0.25rem;
  }
  :host([radius='md']) {
    --radius: 0.375rem;
  }
  :host([radius='lg']) {
    --radius: 0.5rem;
  }
  :host([radius='full']) {
    --radius: 9999px;
  }

  /* --- 2B. UI Scale & Typography (scale) --- */
  :host([scale='sm']) {
    --font-size-xs: 11px;
    --font-size-small: 11px;
    --font-size-description: 12px;
    --font-size-mono: 12px;
    --font-size-regular: 13px;
    --sidebar-width: 17rem;
  }
  :host([scale='default']),
  :host(:not([scale])) {
    --font-size-xs: 11px;
    --font-size-small: 12px;
    --font-size-description: 13px;
    --font-size-mono: 13px;
    --font-size-regular: 14px;
    --sidebar-width: 18.75rem;
  }
  :host([scale='lg']) {
    --font-size-xs: 12px;
    --font-size-small: 14px;
    --font-size-description: 15px;
    --font-size-mono: 15px;
    --font-size-regular: 16px;
    --sidebar-width: 21rem;
  }

  /* --- 2C. Navigation Density (nav-item-spacing) --- */
  :host([nav-item-spacing='compact']) {
    --sidebar-item-padding: 0.3125rem 1rem 0.3125rem 0.625rem;
  }
  :host([nav-item-spacing='default']),
  :host(:not([nav-item-spacing])) {
    --sidebar-item-padding: 0.4375rem 1rem 0.4375rem 0.625rem;
  }
  :host([nav-item-spacing='relaxed']) {
    --sidebar-item-padding: 0.625rem 1rem 0.625rem 0.625rem;
  }

  /* =========================================================================
     3. SURFACE & COLOR SCHEME (color-scheme)
     ========================================================================= */

  /* --------- 3A. DARK (Default) --------- */
  :host,
  :host([color-scheme='dark']),
  :host([color-scheme='system']),
  :host(:not([color-scheme])) {
    /* Surfaces: neutral charcoal. Tinted themes override these two; everything below is derived from them. */
    --background: #1f1f23;
    --foreground: #d4d4d8;

    /* Card Vars:
      card (bg)       : dialog/modal popups, table headers (th), floating tooltips, and catalog cards
      card-foreground : Text & icon color on elevated surfaces (dialog content, table header labels, tooltip text, schema type badges)
    */
    --card: color-mix(in srgb, var(--background) 92%, var(--foreground));
    --card-foreground: color-mix(in srgb, var(--foreground) 90%, #ffffff);

    /* Muted Vars:
      muted (bg)       : input tags, secondary buttons, table footers, and code backgrounds
      muted-foreground : inactive tabs, parameter descriptions, schema constraints, and timestamps
    */
    --muted: color-mix(in srgb, var(--background) 86%, var(--foreground));
    --muted-foreground: color-mix(in srgb, var(--foreground) 65%, var(--background));

    /* Border Vars:
      border: dividing lines for tables, cards, sections, and panels
    */
    --border: color-mix(in srgb, var(--background) 85%, var(--foreground));

    --sidebar-accent: color-mix(in srgb, var(--background) 88%, var(--foreground));

    --input: oklch(from var(--border) calc(l + 0.05) c h);
    --input-background: color-mix(in srgb, var(--background) 80%, #000000);

    /* HTTP Method Badges (Dark Mode: High Vibrancy) */
    --method-get: #5c98f9ff;
    --method-post: #68cc97;
    --method-put: #f59e0b;
    --method-delete: #f75252ff;
    --method-patch: #a78bfa; /* violet-400: 4.5:1 or more as text on the dark background */
    --method-head: #eab308;
    --method-options: #06b6d4;
    --method-trace: #ec4899;
    --method-query: #818cf8;
    --method-default: #64748b;
    --method-badge-fg: #000000;

    --destructive: #ef4444;

    /* Named colours (also used by x-badges: color: blue | green | ...) */
    --blue: #3b82f6;
    --green: #10b981;
    --orange: #f59e0b;
    --red: #ef4444;
    --purple: #8b5cf6;
    --yellow: #eab308;
    --pink: #ec4899;
    --brown: #d97706;

    /* Syntax Highlighting */
    --syntax-comment: #8b949e;
    --syntax-keyword: #ff7b72;
    --syntax-operator: #c9d1d9;
    --syntax-string: #a5d6ff;
    --syntax-constant: #79c0ff;
    --syntax-function: #d2a8ff;
    --syntax-type: #d2a8ff;
    --syntax-variable: #ffa657;
    --syntax-property: #79c0ff;
    --syntax-tag: #7ee787;
    --syntax-selector: #d2a8ff;
    --syntax-inserted: #7ee787;
    --syntax-deleted: #ff7b72;

    /* Code Blocks */

    --code-bg: var(--input-background);
  }

  /* --------- 3B. LIGHT  --------- */
  :host([color-scheme='light']) {
    /* Surfaces */
    --background: #ffffff;
    --foreground: #27272a;

    /* Card Vars:
      card (bg)       : dialog/modal popups, table headers (th), floating tooltips, and catalog cards
      card-foreground : Text & icon color on elevated surfaces
    */
    --card: color-mix(in srgb, var(--background) 94%, var(--foreground));
    --card-foreground: color-mix(in srgb, var(--foreground) 90%, #000000);

    /* Muted Vars:
      muted (bg)       : input tags, secondary buttons, table footers, and code backgrounds
      muted-foreground : inactive tabs, parameter descriptions, schema constraints, and timestamps
    */
    --muted: color-mix(in srgb, var(--background) 94%, var(--foreground));
    --muted-foreground: color-mix(in srgb, var(--foreground) 60%, var(--background));

    /* Border Vars:
      border: dividing lines for tables, cards, sections, and panels
    */
    --border: color-mix(in srgb, var(--background) 85%, var(--foreground));

    --sidebar-accent: color-mix(in srgb, var(--background) 92%, var(--foreground));

    --input: color-mix(in srgb, var(--border) 75%, var(--foreground));
    /* Light: fields are white, so they stand out on the tinted card surface */
    --input-background: var(--background);

    /* HTTP Method Badges (Light Mode: High Contrast). White badge text, and the colors used as text on
       the tinted card surface, keep WCAG AA contrast (4.5:1). */
    --method-get: #2563eb;
    --method-post: #047857;
    --method-put: #c2410c;
    --method-delete: #b91c1c;
    --method-patch: #7c3aed;
    --method-head: #b45309;
    --method-options: #0e7490;
    --method-trace: #be185d;
    --method-query: #4f46e5;
    --method-default: #475569;
    --method-badge-fg: #ffffff;

    --destructive: #dc2626;

    /* Named colours (also used by x-badges: color: blue | green | ...) */
    --blue: #2768f4ff;
    --green: #059669;
    --orange: #d97706;
    --red: #dc2626;
    --purple: #7c3aed;
    --yellow: #b45309;
    --pink: #db2777;
    --brown: #92400e;

    /* Syntax Highlighting */
    --syntax-comment: #6e7781;
    --syntax-keyword: #cf222e;
    --syntax-operator: #24292f;
    --syntax-string: #0a3069;
    --syntax-constant: #0550ae;
    --syntax-function: #8250df;
    --syntax-type: #8250df;
    --syntax-variable: #953800;
    --syntax-property: #0550ae;
    --syntax-tag: #116329;
    --syntax-selector: #8250df;
    --syntax-inserted: #116329;
    --syntax-deleted: #cf222e;

    /* Code Blocks */

    --code-bg: color-mix(in srgb, var(--background) 96%, var(--foreground));
  }

  /* --------- 3C. SYSTEM --------- */
  @media (prefers-color-scheme: light) {
    :host([color-scheme='system']) {
      --background: #ffffff;
      --foreground: #27272a;
      --card: color-mix(in srgb, var(--background) 94%, var(--foreground));
      --card-foreground: color-mix(in srgb, var(--foreground) 90%, #000000);
      --muted: color-mix(in srgb, var(--background) 94%, var(--foreground));
      --muted-foreground: color-mix(in srgb, var(--foreground) 60%, var(--background));
      --border: color-mix(in srgb, var(--background) 85%, var(--foreground));
      --sidebar-accent: color-mix(in srgb, var(--background) 92%, var(--foreground));
      --input: color-mix(in srgb, var(--border) 75%, var(--foreground));
      --input-background: var(--background);

      --method-get: #2563eb;
      --method-post: #047857;
      --method-put: #c2410c;
      --method-delete: #b91c1c;
      --method-patch: #7c3aed;
      --method-head: #b45309;
      --method-options: #0e7490;
      --method-trace: #be185d;
      --method-query: #4f46e5;
      --method-default: #475569;
      --method-badge-fg: #ffffff;

      --destructive: #dc2626;

      --blue: #2768f4ff;
      --green: #059669;
      --orange: #d97706;
      --red: #dc2626;
      --purple: #7c3aed;
      --yellow: #b45309;
      --pink: #db2777;
      --brown: #92400e;

      --syntax-comment: #6e7781;
      --syntax-keyword: #cf222e;
      --syntax-operator: #24292f;
      --syntax-string: #0a3069;
      --syntax-constant: #0550ae;
      --syntax-function: #8250df;
      --syntax-type: #8250df;
      --syntax-variable: #953800;
      --syntax-property: #0550ae;
      --syntax-tag: #116329;
      --syntax-selector: #8250df;
      --syntax-inserted: #116329;
      --syntax-deleted: #cf222e;

      --code-bg: color-mix(in srgb, var(--background) 94%, var(--foreground));
    }
  }

  /* =========================================================================
     4. BRAND THEME PRESETS (theme), generated from THEMES above
     ========================================================================= */
  ${presetsCss}
`;
