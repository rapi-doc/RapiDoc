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
 * Calculates luminance and injects `--primary`, `--ring`, and `--primary-foreground`.
 * @param {HTMLElement} element - Custom element host target.
 * @param {string} themeVal - User-supplied theme attribute value.
 */
export function applyCustomTheme(element, themeVal) {
  if (!element || !element.style) return;
  if (!themeVal || THEME_PRESETS.includes(themeVal.trim().toLowerCase()) || !isValidHexColor(themeVal)) {
    element.style.removeProperty('--primary');
    element.style.removeProperty('--ring');
    element.style.removeProperty('--primary-foreground');
    return;
  }
  const hex = themeVal.trim();
  element.style.setProperty('--primary', hex);
  element.style.setProperty('--ring', hex);
  const fg = isLightColor(hex) ? '#000000' : '#ffffff';
  element.style.setProperty('--primary-foreground', fg);
}

export default css`
  /* =========================================================================
     1. ROOT DESIGN TOKEN DEFAULTS (:host)
     ========================================================================= */
  :host {
    /* --- Typography Tokens --- */
    --font-mono: 'Roboto Mono', Monaco, 'Andale Mono', Consolas, monospace;
    --font-regular: var(--font-sans, 'Open Sans', 'Segoe UI', Tahoma, Arial, sans-serif);

    /* --- Default Corner Radii & Geometry --- */
    --radius: 0.25rem;
    --card-radius: 4px;
    --border-radius: var(--radius);

    /* --- Layout Dimensions --- */
    --ui-base-size: 14px;
    --font-size-small: 12px;
    --font-size-mono: 13px;
    --font-size-regular: 14px;
    --nav-width: 18.75rem;
    --nav-item-padding: 0.4375rem 1rem 0.4375rem 0.625rem;
    --nav-logo-max-height: 60px;
    --resp-area-height: 400px;
    --layout: row;
    --table-schema-key-width: 240px;
    --table-schema-key-text-overflow: ellipsis;
    --table-schema-key-whitespace: nowrap;
    --scroll-bar-width: 8px;

    /* --- Focus Ring & Selection --- */
    --focus-shadow: 0 0 0 1px transparent, 0 0 0 2px color-mix(in srgb, var(--ring) 40%, transparent);
    --selection-bg: color-mix(in srgb, var(--primary) 25%, transparent);
    --selection-fg: var(--foreground);
  }

  /* =========================================================================
     2. SCALE & GEOMETRY TOKENS (radius, scale, nav-item-spacing)
     ========================================================================= */

  /* --- 2A. Corner Radius Scale (radius) --- */
  :host([radius='none']) {
    --radius: 0px;
    --card-radius: 0px;
  }
  :host([radius='sm']),
  :host(:not([radius])) {
    --radius: 0.25rem;
    --card-radius: 4px;
  }
  :host([radius='md']) {
    --radius: 0.375rem;
    --card-radius: 6px;
  }
  :host([radius='lg']) {
    --radius: 0.5rem;
    --card-radius: 8px;
  }
  :host([radius='full']) {
    --radius: 9999px;
    --card-radius: 8px;
  }

  /* --- 2B. UI Scale & Typography (scale) --- */
  :host([scale='sm']) {
    --ui-base-size: 13px;
    --font-size-small: 11px;
    --font-size-mono: 12px;
    --font-size-regular: 13px;
    --nav-width: 17rem;
  }
  :host([scale='default']),
  :host(:not([scale])) {
    --ui-base-size: 14px;
    --font-size-small: 12px;
    --font-size-mono: 13px;
    --font-size-regular: 14px;
    --nav-width: 18.75rem;
  }
  :host([scale='lg']) {
    --ui-base-size: 16px;
    --font-size-small: 14px;
    --font-size-mono: 15px;
    --font-size-regular: 16px;
    --nav-width: 21rem;
  }

  /* --- 2C. Navigation Density (nav-item-spacing) --- */
  :host([nav-item-spacing='compact']) {
    --nav-item-padding: 0.3125rem 1rem 0.3125rem 0.625rem;
  }
  :host([nav-item-spacing='default']),
  :host(:not([nav-item-spacing])) {
    --nav-item-padding: 0.4375rem 1rem 0.4375rem 0.625rem;
  }
  :host([nav-item-spacing='relaxed']) {
    --nav-item-padding: 0.625rem 1rem 0.625rem 0.625rem;
  }

  /* =========================================================================
     3. SURFACE & COLOR SCHEME (color-scheme)
     ========================================================================= */

  /* --- 3A. Dark Mode Surfaces (Default / System Dark) --- */
  :host,
  :host([color-scheme='dark']),
  :host([color-scheme='system']),
  :host(:not([color-scheme])) {
    /* Surfaces */
    --background: var(--_preset-bg, #09090b);
    --foreground: var(--_preset-fg, #fafafa);
    --card: var(--_preset-card, #18181b);
    --card-foreground: var(--_preset-card-fg, #fafafa);
    --muted: var(--_preset-muted, #27272a);
    --muted-foreground: #a1a1aa;
    --border: var(--_preset-border, #27272a);
    --nav-hover-bg: color-mix(in srgb, var(--background) 85%, #000000);
    --nav-hover-bg: oklch(from var(--background) calc(l - 0.04) c h);
    --input-background: color-mix(in srgb, var(--background) 75%, #000000);
    --input-border: color-mix(in srgb, var(--border) 60%, var(--background));
    --input: var(--input-background);

    /* HTTP Method Badges (Dark Mode: High Vibrancy) */
    --method-get: #5c98f9ff;
    --method-post: #68cc97;
    --method-put: #f59e0b;
    --method-delete: #f75252ff;
    --method-patch: #8b5cf6;
    --method-head: #eab308;
    --method-options: #06b6d4;

    /* Status Helpers */
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
    --code-fg: var(--foreground);
    --inline-code-fg: #c4c6d1;
    --inline-code-bg: #3b3c45;
    --markdown-fg: #c4c6d1;
    --code-property-color: var(--syntax-property);
    --code-keyword-color: var(--syntax-keyword);
    --code-operator-color: var(--syntax-operator);
  }

  /* --- 3B. Light Mode Surfaces --- */
  :host([color-scheme='light']) {
    /* Surfaces */
    --background: #ffffff;
    --foreground: #09090b;
    --card: #f4f4f5;
    --card-foreground: #09090b;
    --muted: #f4f4f5;
    --muted-foreground: #71717a;
    --border: #e4e4e7;
    --nav-hover-bg: color-mix(in srgb, var(--background) 95%, #000000);
    --nav-hover-bg: oklch(from var(--background) calc(l - 0.04) c h);
    --input-background: color-mix(in srgb, var(--background) 94%, var(--foreground));
    --input-border: color-mix(in srgb, var(--border) 80%, var(--foreground));
    --input: var(--input-background);

    /* HTTP Method Badges (Light Mode: High Contrast) */
    --method-get: #3573f8ff;
    --method-post: #059669;
    --method-put: #d97706;
    --method-delete: #dc2626;
    --method-patch: #7c3aed;
    --method-head: #b45309;
    --method-options: #0891b2;

    /* Status Helpers */
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
    --code-fg: var(--foreground);
    --inline-code-fg: #334155;
    --inline-code-bg: #e2e8f0;
    --markdown-fg: #475569;
    --code-property-color: var(--syntax-property);
    --code-keyword-color: var(--syntax-keyword);
    --code-operator-color: var(--syntax-operator);
  }

  /* --- 3C. System Mode Dynamic Surfaces --- */
  @media (prefers-color-scheme: light) {
    :host([color-scheme='system']) {
      --background: #ffffff;
      --foreground: #09090b;
      --card: #f4f4f5;
      --card-foreground: #09090b;
      --muted: #f4f4f5;
      --muted-foreground: #71717a;
      --border: #e4e4e7;
      --nav-hover-bg: color-mix(in srgb, var(--background) 95%, #000000);
      --nav-hover-bg: oklch(from var(--background) calc(l - 0.04) c h);
      --input-background: color-mix(in srgb, var(--background) 94%, var(--foreground));
      --input-border: color-mix(in srgb, var(--border) 80%, var(--foreground));
      --input: var(--input-background);

      --method-get: #3573f8ff;
      --method-post: #059669;
      --method-put: #d97706;
      --method-delete: #dc2626;
      --method-patch: #7c3aed;
      --method-head: #b45309;
      --method-options: #0891b2;

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
      --code-fg: var(--foreground);
      --inline-code-fg: #334155;
      --inline-code-bg: #e2e8f0;
      --markdown-fg: #475569;
      --code-property-color: var(--syntax-property);
      --code-keyword-color: var(--syntax-keyword);
      --code-operator-color: var(--syntax-operator);
    }
  }

  /* =========================================================================
     4. BRAND THEME PRESETS (theme)
     ========================================================================= */

  /* --- Preset 1: AMBER (Default) --- */
  :host,
  :host([theme='amber']),
  :host(:not([theme])) {
    --primary: #f76b39;
    --primary-foreground: #000000;
    --ring: #f76b39;
    --_preset-bg: oklch(0.2613 0.0134 272.84);
    --_preset-card: oklch(0.2613 0.0134 272.84);
    --_preset-border: #363636ff;
  }
  :host([theme='amber'][color-scheme='light']),
  :host(:not([theme])[color-scheme='light']) {
    --primary: #d97706;
    --primary-foreground: #ffffff;
    --ring: #d97706;
  }

  /* --- Preset 2: BLUE --- */
  :host([theme='blue']) {
    --primary: #488bf8ff;
    --primary-foreground: #ffffff;
    --ring: #488bf8ff;
    --_preset-bg: #1c1b1bff;
    --_preset-fg: #e5e5e5;
    --_preset-border: #414146ff;
  }
  :host([theme='blue'][color-scheme='light']) {
    --primary: #2563eb;
    --primary-foreground: #ffffff;
    --ring: #2563eb;
  }

  /* --- Preset 3: EMERALD --- */
  :host([theme='emerald']) {
    --primary: #03bf80ff;
    --primary-foreground: #0f331dff;
    --ring: #03bf80ff;
    --_preset-bg: #060913;
    --_preset-fg: #e2e8f0;
    --_preset-card: #0f172a;
    --_preset-card-fg: #f8fafc;
    --_preset-muted: #111827;
    --_preset-border: #242c29ff;
  }
  :host([theme='emerald'][color-scheme='light']) {
    --primary: #059669;
    --primary-foreground: #ffffff;
    --ring: #059669;
  }

  /* --- Preset 4: VIOLET --- */
  :host([theme='violet']) {
    --primary: #8b5cf6;
    --primary-foreground: #ffffff;
    --ring: #8b5cf6;
    --_preset-bg: #130e20;
    --_preset-fg: #f5f3ff;
    --_preset-card: #1e1633;
    --_preset-card-fg: #f5f3ff;
    --_preset-muted: #19122b;
    --_preset-border: #342854;
  }
  :host([theme='violet'][color-scheme='light']) {
    --primary: #7c3aed;
    --primary-foreground: #ffffff;
    --ring: #7c3aed;
  }

  /* --- Preset 5: GRAPHITE --- */
  :host([theme='graphite']) {
    --primary: #fafafa;
    --primary-foreground: #18181b;
    --ring: #d4d4d8;
  }
  :host([theme='graphite'][color-scheme='light']) {
    --primary: #18181b;
    --primary-foreground: #fafafa;
    --ring: #27272a;
  }

  /* --- Preset 6: ROSE --- */
  :host([theme='rose']) {
    --primary: #fb4d6a;
    --primary-foreground: #ffffff;
    --ring: #f65772ff;
    --_preset-bg: oklch(0.2613 0.0134 272.84);
    --_preset-card: oklch(0.2613 0.0134 272.84);
  }
  :host([theme='rose'][color-scheme='light']) {
    --primary: #e11d48;
    --primary-foreground: #ffffff;
    --ring: #e11d48;
  }

  /* --- Preset 7: SLATE --- */
  :host([theme='slate']) {
    --primary: #64748b;
    --primary-foreground: #ffffff;
    --ring: #64748b;
  }
  :host([theme='slate'][color-scheme='light']) {
    --primary: #475569;
    --primary-foreground: #ffffff;
    --ring: #475569;
  }

  /* =========================================================================
     5. SYSTEM COLOR SCHEME PRESET OVERRIDES
     ========================================================================= */
  @media (prefers-color-scheme: light) {
    :host([theme='amber'][color-scheme='system']),
    :host(:not([theme])[color-scheme='system']) {
      --primary: #d97706;
      --primary-foreground: #ffffff;
      --ring: #d97706;
    }

    :host([theme='blue'][color-scheme='system']) {
      --primary: #2563eb;
      --primary-foreground: #ffffff;
      --ring: #2563eb;
    }

    :host([theme='emerald'][color-scheme='system']) {
      --primary: #059669;
      --primary-foreground: #ffffff;
      --ring: #059669;
    }

    :host([theme='violet'][color-scheme='system']) {
      --primary: #7c3aed;
      --primary-foreground: #ffffff;
      --ring: #7c3aed;
    }

    :host([theme='graphite'][color-scheme='system']) {
      --primary: #18181b;
      --primary-foreground: #fafafa;
      --ring: #27272a;
    }

    :host([theme='rose'][color-scheme='system']) {
      --primary: #e11d48;
      --primary-foreground: #ffffff;
      --ring: #e11d48;
    }

    :host([theme='slate'][color-scheme='system']) {
      --primary: #475569;
      --primary-foreground: #ffffff;
      --ring: #475569;
    }
  }
`;
