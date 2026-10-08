import { css } from 'lit';

export const THEME_PRESETS = ['default', 'amber', 'graphite', 'modern', 'emerald', 'violet', 'rose', 'blue', 'slate'];

/**
 * Checks if a string is a valid hex color code (#rgb, #rrggbb, #rrggbbaa).
 */
export function isValidHexColor(color) {
  if (!color || typeof color !== 'string') return false;
  return /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(color.trim());
}

/**
 * Checks if a theme is valid: must be from the allowed THEME_PRESETS or a valid hex color code.
 */
export function isValidTheme(theme) {
  if (!theme || typeof theme !== 'string') return false;
  const trimmed = theme.trim().toLowerCase();
  return THEME_PRESETS.includes(trimmed) || isValidHexColor(theme);
}

/**
 * Normalizes and validates the theme attribute.
 * Only allowed presets or valid hex color codes are accepted.
 * If 'light' or 'dark' is provided, it returns fallback theme 'amber' and maps colorScheme.
 * If any invalid value is provided, it falls back to 'amber'.
 *
 * @param {string} theme - The theme value to validate.
 * @returns {{ theme: string, colorScheme?: 'light' | 'dark' }}
 */
export function normalizeTheme(theme) {
  if (!theme || typeof theme !== 'string') {
    return { theme: 'amber' };
  }
  const trimmed = theme.trim();
  const lower = trimmed.toLowerCase();
  if (lower === 'light' || lower === 'dark') {
    return { theme: 'amber', colorScheme: lower };
  }
  if (THEME_PRESETS.includes(lower)) {
    return { theme: lower };
  }
  if (isValidHexColor(trimmed)) {
    return { theme: trimmed };
  }
  return { theme: 'amber' };
}

/**
 * Checks if a string is a hex color rather than a preset name.
 */
export function isCustomColor(color) {
  if (!color || typeof color !== 'string') return false;
  const trimmed = color.trim().toLowerCase();
  if (THEME_PRESETS.includes(trimmed)) return false;
  return isValidHexColor(color);
}

/**
 * Calculates whether a hex color is light to set appropriate foreground contrast.
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
 * Applies custom brand color to the host element if theme is a valid hex color code.
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
  :host {
    /* Typography: supports shadcn --font-sans or --font-regular */
    --font-mono: Monaco, 'Andale Mono', 'Roboto Mono', Consolas, monospace;
    --font-regular: var(--font-sans, 'Open Sans', 'Segoe UI', Tahoma, Arial, sans-serif);

    /* Radius & Spacing */
    --radius: 0.25rem;
    --card-radius: 4px;
    --border-radius: var(--radius);

    /* Scale & Layout Defaults */
    --ui-base-size: 14px;
    --font-size-small: 12px;
    --font-size-mono: 13px;
    --font-size-regular: 14px;
    --nav-width: 18.75rem;
    --nav-item-padding: 0.4375rem 1rem 0.4375rem 0.625rem;

    /* HTTP Method Badge Tokens */
    --method-get: #3b82f6;
    --method-post: #10b981;
    --method-put: #f59e0b;
    --method-delete: #ef4444;
    --method-patch: #8b5cf6;
    --method-head: #eab308;
    --method-options: #06b6d4;

    /* General Status & Helpers */
    --blue: #3b82f6;
    --green: #10b981;
    --orange: #f59e0b;
    --red: #ef4444;
    --purple: #8b5cf6;
    --yellow: #eab308;
    --pink: #ec4899;
    --brown: #d97706;

    /* Focus & Selection */
    --focus-shadow: 0 0 0 1px transparent, 0 0 0 2px color-mix(in srgb, var(--ring) 40%, transparent);
    --selection-bg: color-mix(in srgb, var(--primary) 25%, transparent);
    --selection-fg: var(--foreground);
  }

  /* =========================================================================
     Border Radius Tokens
     ========================================================================= */
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

  /* =========================================================================
     Scale Tokens
     ========================================================================= */
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

  /* =========================================================================
     Nav Item Spacing Tokens (Independent of Scale)
     ========================================================================= */
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
     Base Surfaces: Dark (Default)
     ========================================================================= */
  :host,
  :host([color-scheme='dark']),
  :host(:not([color-scheme])) {
    --background: #09090b;
    --foreground: #fafafa;
    --card: #18181b;
    --card-foreground: #fafafa;
    --muted: #27272a;
    --muted-foreground: #a1a1aa;
    --border: #27272a;
    --input-background: color-mix(in srgb, var(--background) 50%, #000000);
    --input-border: color-mix(in srgb, var(--border) 60%, var(--background));
    --input: var(--input-background);
    --primary: #f59e0b;
    --primary-foreground: #000000;
    --ring: #f59e0b;

    /* Dark Syntax Highlighting */
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
  }

  /* =========================================================================
     Base Surfaces: Light
     ========================================================================= */
  :host([color-scheme='light']) {
    --background: #ffffff;
    --foreground: #09090b;
    --card: #f4f4f5;
    --card-foreground: #09090b;
    --muted: #f4f4f5;
    --muted-foreground: #71717a;
    --border: #e4e4e7;
    --input-background: color-mix(in srgb, var(--background) 94%, var(--foreground));
    --input-border: color-mix(in srgb, var(--border) 80%, var(--foreground));
    --input: var(--input-background);
    --primary: #d97706;
    --primary-foreground: #ffffff;
    --ring: #d97706;

    /* Light Syntax Highlighting */
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
  }

  /* System Color Scheme: Flips to light if OS prefers light */
  @media (prefers-color-scheme: light) {
    :host([color-scheme='system']) {
      --background: #ffffff;
      --foreground: #09090b;
      --card: #f4f4f5;
      --card-foreground: #09090b;
      --muted: #f4f4f5;
      --muted-foreground: #71717a;
      --border: #e4e4e7;
      --input-background: color-mix(in srgb, var(--background) 94%, var(--foreground));
      --input-border: color-mix(in srgb, var(--border) 80%, var(--foreground));
      --input: var(--input-background);
      --primary: #d97706;
      --primary-foreground: #ffffff;
      --ring: #d97706;

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
    }
  }

  /* =========================================================================
     Theme Presets: Brand Accents & Overrides
     ========================================================================= */

  /* 1. DEFAULT / BLUE (Neutral / Blue Accent) */
  :host([theme='default']),
  :host([theme='blue']),
  :host(:not([theme])),
  :host([theme='default'][color-scheme='dark']),
  :host([theme='blue'][color-scheme='dark']) {
    --background: #262626;
    --foreground: #e5e5e5;
    --card: #18181b;
    --card-foreground: #fafafa;
    --muted: #27272a;
    --muted-foreground: #a1a1aa;
    --border: #414146ff;
    --input-background: color-mix(in srgb, var(--background) 80%, #000000);
    --input-border: color-mix(in srgb, var(--border) 50%, var(--background));
    --input: var(--input-background);
    --primary: #3b82f6;
    --primary-foreground: #ffffff;
    --ring: #3b82f6;
  }
  :host([theme='default'][color-scheme='light']),
  :host([theme='blue'][color-scheme='light']),
  :host(:not([theme])[color-scheme='light']) {
    --background: #ffffff;
    --foreground: #09090b;
    --card: #f4f4f5;
    --card-foreground: #09090b;
    --muted: #f4f4f5;
    --muted-foreground: #71717a;
    --border: #e4e4e7;
    --input-background: color-mix(in srgb, var(--background) 94%, var(--foreground));
    --input-border: color-mix(in srgb, var(--border) 80%, var(--foreground));
    --input: var(--input-background);
    --primary: #2563eb;
    --primary-foreground: #ffffff;
    --ring: #2563eb;
  }

  /* 2. AMBER (Warm Amber Minimal) */
  :host([theme='amber']),
  :host([theme='amber'][color-scheme='dark']) {
    --background: oklch(0.2046 0 0);
    --foreground: oklch(0.9219 0 0);
    --card: oklch(0.2686 0 0);
    --card-foreground: oklch(0.9219 0 0);
    --muted: oklch(0.2393 0 0);
    --muted-foreground: oklch(0.7155 0 0);
    --border: oklch(0.3715 0 0);
    --input-background: color-mix(in srgb, var(--background) 50%, #000000);
    --input-border: color-mix(in srgb, var(--border) 60%, var(--background));
    --input: var(--input-background);
    --primary: oklch(0.7686 0.1647 70.0804);
    --primary-foreground: oklch(0 0 0);
    --ring: oklch(0.7686 0.1647 70.0804);
  }
  :host([theme='amber'][color-scheme='light']) {
    --background: oklch(1 0 0);
    --foreground: oklch(0.2686 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.2686 0 0);
    --muted: oklch(0.9846 0.0017 247.8389);
    --muted-foreground: oklch(0.551 0.0234 264.3637);
    --border: oklch(0.9276 0.0058 264.5313);
    --input-background: color-mix(in srgb, var(--background) 94%, var(--foreground));
    --input-border: color-mix(in srgb, var(--border) 80%, var(--foreground));
    --input: var(--input-background);
    --primary: oklch(0.7686 0.1647 70.0804);
    --primary-foreground: oklch(0 0 0);
    --ring: oklch(0.7686 0.1647 70.0804);
  }

  /* 3. GRAPHITE (Monochrome Minimalist) */
  :host([theme='graphite']),
  :host([theme='graphite'][color-scheme='dark']) {
    --background: #09090b;
    --foreground: #fafafa;
    --card: #18181b;
    --card-foreground: #fafafa;
    --muted: #27272a;
    --muted-foreground: #a1a1aa;
    --border: #27272a;
    --input-background: color-mix(in srgb, var(--background) 50%, #000000);
    --input-border: color-mix(in srgb, var(--border) 60%, var(--background));
    --input: var(--input-background);
    --primary: #fafafa;
    --primary-foreground: #18181b;
    --ring: #d4d4d8;
  }
  :host([theme='graphite'][color-scheme='light']) {
    --background: #ffffff;
    --foreground: #09090b;
    --card: #f4f4f5;
    --card-foreground: #09090b;
    --muted: #f4f4f5;
    --muted-foreground: #71717a;
    --border: #e4e4e7;
    --input-background: color-mix(in srgb, var(--background) 94%, var(--foreground));
    --input-border: color-mix(in srgb, var(--border) 80%, var(--foreground));
    --input: var(--input-background);
    --primary: #18181b;
    --primary-foreground: #fafafa;
    --ring: #27272a;
  }

  /* 4. EMERALD / MODERN (Clean Emerald Accent - Astro Docs Palette) */
  :host([theme='emerald']),
  :host([theme='modern']),
  :host([theme='emerald'][color-scheme='dark']),
  :host([theme='modern'][color-scheme='dark']) {
    --background: #060913;
    --foreground: #e2e8f0;
    --card: #0f172a;
    --card-foreground: #f8fafc;
    --muted: #111827;
    --muted-foreground: #94a3b8;
    --border: #1e293b;
    --input-background: color-mix(in srgb, var(--background) 50%, #000000);
    --input-border: color-mix(in srgb, var(--border) 60%, var(--background));
    --input: var(--input-background);
    --primary: #10b981;
    --primary-foreground: #ffffff;
    --ring: #10b981;
  }
  :host([theme='emerald'][color-scheme='light']),
  :host([theme='modern'][color-scheme='light']) {
    --background: #ffffff;
    --foreground: #0f172a;
    --card: #f8fafc;
    --card-foreground: #0f172a;
    --muted: #f1f5f9;
    --muted-foreground: #64748b;
    --border: #e2e8f0;
    --input-background: color-mix(in srgb, var(--background) 94%, var(--foreground));
    --input-border: color-mix(in srgb, var(--border) 80%, var(--foreground));
    --input: var(--input-background);
    --primary: #059669;
    --primary-foreground: #ffffff;
    --ring: #059669;
  }

  /* 5. VIOLET (Purple / Indigo Accent - Deep Violet Surfaces) */
  :host([theme='violet']),
  :host([theme='violet'][color-scheme='dark']) {
    --background: #130e20;
    --foreground: #f5f3ff;
    --card: #1e1633;
    --card-foreground: #f5f3ff;
    --muted: #19122b;
    --muted-foreground: #a89bc2;
    --border: #342854;
    --input-background: color-mix(in srgb, var(--background) 50%, #000000);
    --input-border: color-mix(in srgb, var(--border) 60%, var(--background));
    --input: var(--input-background);
    --primary: #8b5cf6;
    --primary-foreground: #ffffff;
    --ring: #8b5cf6;
  }
  :host([theme='violet'][color-scheme='light']) {
    --background: #ffffff;
    --foreground: #09090b;
    --card: #f4f4f5;
    --card-foreground: #09090b;
    --muted: #f4f4f5;
    --muted-foreground: #71717a;
    --border: #e4e4e7;
    --input-background: color-mix(in srgb, var(--background) 94%, var(--foreground));
    --input-border: color-mix(in srgb, var(--border) 80%, var(--foreground));
    --input: var(--input-background);
    --primary: #7c3aed;
    --primary-foreground: #ffffff;
    --ring: #7c3aed;
  }

  /* 6. ROSE (Ruby / Rose Accent) */
  :host([theme='rose']),
  :host([theme='rose'][color-scheme='dark']) {
    --background: #2a2b2c;
    --foreground: #fafafa;
    --card: #343637;
    --card-foreground: #fafafa;
    --muted: #313233;
    --muted-foreground: #a7a8aa;
    --border: #414244;
    --input-background: color-mix(in srgb, var(--background) 80%, #000000);
    --input-border: color-mix(in srgb, var(--border) 60%, var(--background));
    --input: var(--input-background);
    --primary: #f7667eff;
    --primary-foreground: #ffffff;
    --ring: #f65772ff;
  }
  :host([theme='rose'][color-scheme='light']) {
    --background: #ffffff;
    --foreground: #09090b;
    --card: #f4f4f5;
    --card-foreground: #09090b;
    --muted: #f4f4f5;
    --muted-foreground: #71717a;
    --border: #e4e4e7;
    --input-background: color-mix(in srgb, var(--background) 94%, var(--foreground));
    --input-border: color-mix(in srgb, var(--border) 80%, var(--foreground));
    --input: var(--input-background);
    --primary: #e11d48;
    --primary-foreground: #ffffff;
    --ring: #e11d48;
  }

  /* 7. SLATE (Slate / Neutral Grey Accent) */
  :host([theme='slate']),
  :host([theme='slate'][color-scheme='dark']) {
    --background: #09090b;
    --foreground: #fafafa;
    --card: #18181b;
    --card-foreground: #fafafa;
    --muted: #27272a;
    --muted-foreground: #a1a1aa;
    --border: #27272a;
    --input-background: color-mix(in srgb, var(--background) 50%, #000000);
    --input-border: color-mix(in srgb, var(--border) 60%, var(--background));
    --input: var(--input-background);
    --primary: #64748b;
    --primary-foreground: #ffffff;
    --ring: #64748b;
  }
  :host([theme='slate'][color-scheme='light']) {
    --background: #ffffff;
    --foreground: #09090b;
    --card: #f4f4f5;
    --card-foreground: #09090b;
    --muted: #f4f4f5;
    --muted-foreground: #71717a;
    --border: #e4e4e7;
    --input-background: color-mix(in srgb, var(--background) 94%, var(--foreground));
    --input-border: color-mix(in srgb, var(--border) 80%, var(--foreground));
    --input: var(--input-background);
    --primary: #475569;
    --primary-foreground: #ffffff;
    --ring: #475569;
  }

  /* System Color Scheme Preset Light Overrides */
  @media (prefers-color-scheme: light) {
    :host([theme='default'][color-scheme='system']),
    :host([theme='blue'][color-scheme='system']),
    :host(:not([theme])[color-scheme='system']) {
      --background: #ffffff;
      --foreground: #09090b;
      --card: #f4f4f5;
      --card-foreground: #09090b;
      --muted: #f4f4f5;
      --muted-foreground: #71717a;
      --border: #e4e4e7;
      --input-background: color-mix(in srgb, var(--background) 94%, var(--foreground));
      --input-border: color-mix(in srgb, var(--border) 80%, var(--foreground));
      --input: var(--input-background);
      --primary: #2563eb;
      --primary-foreground: #ffffff;
      --ring: #2563eb;
    }
    :host([theme='amber'][color-scheme='system']) {
      --background: oklch(1 0 0);
      --foreground: oklch(0.2686 0 0);
      --card: oklch(1 0 0);
      --card-foreground: oklch(0.2686 0 0);
      --muted: oklch(0.9846 0.0017 247.8389);
      --muted-foreground: oklch(0.551 0.0234 264.3637);
      --border: oklch(0.9276 0.0058 264.5313);
      --input-background: color-mix(in srgb, var(--background) 94%, var(--foreground));
      --input-border: color-mix(in srgb, var(--border) 80%, var(--foreground));
      --input: var(--input-background);
      --primary: oklch(0.7686 0.1647 70.0804);
      --primary-foreground: oklch(0 0 0);
      --ring: oklch(0.7686 0.1647 70.0804);
    }
    :host([theme='graphite'][color-scheme='system']) {
      --background: #ffffff;
      --foreground: #09090b;
      --card: #f4f4f5;
      --card-foreground: #09090b;
      --muted: #f4f4f5;
      --muted-foreground: #71717a;
      --border: #e4e4e7;
      --input-background: color-mix(in srgb, var(--background) 94%, var(--foreground));
      --input-border: color-mix(in srgb, var(--border) 80%, var(--foreground));
      --input: var(--input-background);
      --primary: #18181b;
      --primary-foreground: #fafafa;
      --ring: #27272a;
    }
    :host([theme='emerald'][color-scheme='system']),
    :host([theme='modern'][color-scheme='system']) {
      --background: #ffffff;
      --foreground: #0f172a;
      --card: #f8fafc;
      --card-foreground: #0f172a;
      --muted: #f1f5f9;
      --muted-foreground: #64748b;
      --border: #e2e8f0;
      --input-background: color-mix(in srgb, var(--background) 94%, var(--foreground));
      --input-border: color-mix(in srgb, var(--border) 80%, var(--foreground));
      --input: var(--input-background);
      --primary: #059669;
      --primary-foreground: #ffffff;
      --ring: #059669;
    }
    :host([theme='violet'][color-scheme='system']) {
      --background: #ffffff;
      --foreground: #09090b;
      --card: #f4f4f5;
      --card-foreground: #09090b;
      --muted: #f4f4f5;
      --muted-foreground: #71717a;
      --border: #e4e4e7;
      --input-background: color-mix(in srgb, var(--background) 94%, var(--foreground));
      --input-border: color-mix(in srgb, var(--border) 80%, var(--foreground));
      --input: var(--input-background);
      --primary: #7c3aed;
      --primary-foreground: #ffffff;
      --ring: #7c3aed;
    }
    :host([theme='rose'][color-scheme='system']) {
      --background: #ffffff;
      --foreground: #09090b;
      --card: #f4f4f5;
      --card-foreground: #09090b;
      --muted: #f4f4f5;
      --muted-foreground: #71717a;
      --border: #e4e4e7;
      --input-background: color-mix(in srgb, var(--background) 94%, var(--foreground));
      --input-border: color-mix(in srgb, var(--border) 80%, var(--foreground));
      --input: var(--input-background);
      --primary: #e11d48;
      --primary-foreground: #ffffff;
      --ring: #e11d48;
    }
    :host([theme='slate'][color-scheme='system']) {
      --background: #ffffff;
      --foreground: #09090b;
      --card: #f4f4f5;
      --card-foreground: #09090b;
      --muted: #f4f4f5;
      --muted-foreground: #71717a;
      --border: #e4e4e7;
      --input-background: color-mix(in srgb, var(--background) 94%, var(--foreground));
      --input-border: color-mix(in srgb, var(--border) 80%, var(--foreground));
      --input: var(--input-background);
      --primary: #475569;
      --primary-foreground: #ffffff;
      --ring: #475569;
    }
  }
`;
