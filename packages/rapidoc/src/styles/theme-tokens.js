import { css } from 'lit';

/**
 * Supported brand theme presets in RapiDoc.
 * - 'amber': Warm minimal developer aesthetic (default)
 * - 'blue': Classic developer portal palette with neutral dark surfaces
 * - 'emerald': Fintech & documentation palette (deep navy slate surfaces)
 * - 'violet': Web3 & SaaS palette (deep purple surfaces)
 * - 'graphite': Ultra-clean monochrome minimal palette
 * - 'rose': Ruby accent palette (warm charcoal surfaces)
 * - 'slate': Understated corporate enterprise palette
 */
export const THEME_PRESETS = ['amber', 'blue', 'emerald', 'violet', 'graphite', 'rose', 'slate'];

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
 * - Any invalid, unrecognized, or missing value defaults to 'amber'.
 *
 * @param {string} theme - The raw theme attribute value.
 * @returns {{ theme: string }}
 */
export function normalizeTheme(theme) {
  if (!theme || typeof theme !== 'string') {
    return { theme: 'amber' };
  }
  const trimmed = theme.trim();
  const lower = trimmed.toLowerCase();
  if (THEME_PRESETS.includes(lower)) {
    return { theme: lower };
  }
  if (lower === '#f76b39') {
    return { theme: 'amber' };
  }
  if (isValidHexColor(trimmed)) {
    return { theme: trimmed };
  }
  return { theme: 'amber' };
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
    --font-size-small: 12px;
    --font-size-mono: 13px;
    --font-size-regular: 14px;
    --resp-area-height: 400px;
    --table-schema-key-width: 240px;
    --table-schema-key-text-overflow: ellipsis;
    --table-schema-key-whitespace: nowrap;
    --scroll-margin-top: 120px;

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
    --font-size-small: 11px;
    --font-size-mono: 12px;
    --font-size-regular: 13px;
    --sidebar-width: 17rem;
  }
  :host([scale='default']),
  :host(:not([scale])) {
    --font-size-small: 12px;
    --font-size-mono: 13px;
    --font-size-regular: 14px;
    --sidebar-width: 18.75rem;
  }
  :host([scale='lg']) {
    --font-size-small: 14px;
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
    /* Surfaces */
    --background: oklch(0.2613 0.0134 272.84);
    --foreground: #cccccc;

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
    --border: color-mix(in srgb, var(--background) 90%, var(--foreground));

    --sidebar-accent: color-mix(in srgb, var(--background) 88%, var(--foreground));

    --input: oklch(from var(--border) calc(l - 0.05) c h);
    --input-background: color-mix(in srgb, var(--background) 80%, #000000);

    /* HTTP Method Badges (Dark Mode: High Vibrancy) */
    --method-get: #5c98f9ff;
    --method-post: #68cc97;
    --method-put: #f59e0b;
    --method-delete: #f75252ff;
    --method-patch: #8b5cf6;
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
    --foreground: #444444;

    /* Card Vars:
      card (bg)       : dialog/modal popups, table headers (th), floating tooltips, and catalog cards
      card-foreground : Text & icon color on elevated surfaces
    */
    --card: color-mix(in srgb, var(--background) 96%, var(--foreground));
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
    --border: color-mix(in srgb, var(--background) 88%, var(--foreground));

    --sidebar-accent: color-mix(in srgb, var(--background) 92%, var(--foreground));

    --input: color-mix(in srgb, var(--border) 75%, var(--foreground));
    --input-background: color-mix(in srgb, var(--background) 96%, var(--foreground));

    /* HTTP Method Badges (Light Mode: High Contrast) */
    --method-get: #099cff;
    --method-post: #2da963;
    --method-put: #c2410c;
    --method-delete: #fd2c4fff;
    --method-patch: #7c3aed;
    --method-head: #b45309;
    --method-options: #0e7490;
    --method-trace: #db2777;
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

    --code-bg: var(--input-background);
  }

  /* --------- 3C. SYSTEM --------- */
  @media (prefers-color-scheme: light) {
    :host([color-scheme='system']) {
      --background: #ffffff;
      --foreground: #333333;
      --card: #f4f4f5;
      --card-foreground: #444444;
      --muted: #f4f4f5;
      --muted-foreground: #71717a;
      --border: #e4e4e7;
      --sidebar-accent: oklch(from var(--background) calc(l - 0.04) c h);
      --input: color-mix(in srgb, var(--border) 80%, var(--foreground));
      --input-background: color-mix(in srgb, var(--background) 94%, var(--foreground));

      --method-get: #2563eb;
      --method-post: #059669;
      --method-put: #c2410c;
      --method-delete: #dc2626;
      --method-patch: #7c3aed;
      --method-head: #b45309;
      --method-options: #0e7490;
      --method-trace: #db2777;
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

      --code-bg: var(--input-background);
    }
  }

  /* =========================================================================
     4. BRAND THEME PRESETS (theme)
     ========================================================================= */

  /* --------- 1. AMBER (Default) --------- */
  :host,
  :host([theme='amber']),
  :host(:not([theme])) {
    --primary: #f76b39;
    --primary-foreground: #000000;
  }
  :host([theme='amber'][color-scheme='light']),
  :host(:not([theme])[color-scheme='light']) {
    --primary: #f76b39;
    --primary-foreground: #000000;
  }

  /* --------- 2. BLUE --------- */
  :host([theme='blue']) {
    --primary: #488bf8ff;
    --primary-foreground: #ffffff;
    --background: #1c1b1bff;
    --foreground: #e5e5e5;
    --border: #414146ff;
  }
  :host([theme='blue'][color-scheme='light']) {
    --primary: #2563eb;
    --primary-foreground: #ffffff;
    --foreground: #333333;
    --background: #ffffff;
    --card: #f4f4f5;
    --card-foreground: #444444;
    --border: #e4e4e7;
  }

  /* --------- 3. EMERALD --------- */
  :host([theme='emerald']) {
    --primary: #03bf80ff;
    --primary-foreground: #0f331dff;
    --background: #060913;
    --foreground: #e2e8f0;
    --card: #0f172a;
    --card-foreground: #f8fafc;
    --muted: #1e293b;
    --border: #242c29ff;
  }
  :host([theme='emerald'][color-scheme='light']) {
    --primary: #059669;
    --primary-foreground: #ffffff;
    --foreground: #333333;
    --background: #ffffff;
    --card: #f4f4f5;
    --card-foreground: #444444;
    --muted: #f4f4f5;
    --border: #e4e4e7;
  }

  /* --------- 4. VIOLET --------- */
  :host([theme='violet']) {
    --primary: #8b5cf6;
    --primary-foreground: #ffffff;
    --background: #130e20;
    --foreground: #f5f3ff;
    --card: #1e1633;
    --card-foreground: #f5f3ff;
    --muted: #2a2045;
    --border: #342854;
  }
  :host([theme='violet'][color-scheme='light']) {
    --primary: #7c3aed;
    --primary-foreground: #ffffff;
    --foreground: #333333;
    --background: #ffffff;
    --card: #f4f4f5;
    --card-foreground: #444444;
    --muted: #f4f4f5;
    --border: #e4e4e7;
  }

  /* --------- 5. GRAPHITE --------- */
  :host([theme='graphite']) {
    --primary: #fafafa;
    --primary-foreground: #18181b;
    --ring: #d4d4d8;
  }
  :host([theme='graphite'][color-scheme='light']) {
    --primary: #18181b;
    --primary-foreground: #fafafa;
    --foreground: #111111;
    --background: #ffffff;
    --card: #f4f4f5;
    --card-foreground: #444444;
    --border: #e4e4e7;
    --muted-foreground: #222222;
    --ring: #27272a;
  }

  /* --------- 6. ROSE --------- */
  :host([theme='rose']) {
    --primary: #ee5d7cff;
    --background: oklch(0.2613 0.0134 272.84);
    --card: oklch(0.2613 0.0134 272.84);
  }
  :host([theme='rose'][color-scheme='light']) {
    --primary: #e11d48;
    --primary-foreground: #ffffff;
    --foreground: #333333;
    --background: #ffffff;
    --card: #f4f4f5;
    --card-foreground: #444444;
    --border: #e4e4e7;
  }

  /* --------- 7. SLATE --------- */
  :host([theme='slate']) {
    --primary: #64748b;
    --primary-foreground: #ffffff;
    --sidebar-primary: #ffffff;
  }
  :host([theme='slate'][color-scheme='light']) {
    --primary: #475569;
    --primary-foreground: #ffffff;
    --foreground: #333333;
    --background: #ffffff;
    --card: #f4f4f5;
    --card-foreground: #444444;
    --border: #e4e4e7;
  }

  /* =========================================================================
     5. SYSTEM COLOR SCHEME PRESET OVERRIDES
     ========================================================================= */
  @media (prefers-color-scheme: light) {
    :host([theme='amber'][color-scheme='system']),
    :host(:not([theme])[color-scheme='system']) {
      --primary: #d97706;
      --primary-foreground: #ffffff;
    }

    :host([theme='blue'][color-scheme='system']) {
      --primary: #2563eb;
      --primary-foreground: #ffffff;
      --foreground: #333333;
      --background: #ffffff;
      --card: #f4f4f5;
      --card-foreground: #444444;
      --border: #e4e4e7;
    }

    :host([theme='emerald'][color-scheme='system']) {
      --primary: #059669;
      --primary-foreground: #ffffff;
      --foreground: #333333;
      --background: #ffffff;
      --card: #f4f4f5;
      --card-foreground: #444444;
      --muted: #f4f4f5;
      --border: #e4e4e7;
    }

    :host([theme='violet'][color-scheme='system']) {
      --primary: #7c3aed;
      --primary-foreground: #ffffff;
      --foreground: #333333;
      --background: #ffffff;
      --card: #f4f4f5;
      --card-foreground: #444444;
      --muted: #f4f4f5;
      --border: #e4e4e7;
    }

    :host([theme='graphite'][color-scheme='system']) {
      --primary: #18181b;
      --primary-foreground: #fafafa;
      --ring: #27272a;
      --foreground: #111111;
      --background: #ffffff;
      --card: #f4f4f5;
      --card-foreground: #444444;
      --border: #e4e4e7;
      --muted-foreground: #222222;
    }

    :host([theme='rose'][color-scheme='system']) {
      --primary: #e11d48;
      --primary-foreground: #ffffff;
      --foreground: #333333;
      --background: #ffffff;
      --card: #f4f4f5;
      --card-foreground: #444444;
      --border: #e4e4e7;
    }

    :host([theme='slate'][color-scheme='system']) {
      --primary: #475569;
      --primary-foreground: #ffffff;
      --foreground: #333333;
      --background: #ffffff;
      --card: #f4f4f5;
      --card-foreground: #444444;
      --border: #e4e4e7;
    }
  }
`;
