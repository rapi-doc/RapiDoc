import { css } from 'lit';

export const THEME_PRESETS = ['default', 'amber', 'graphite', 'modern', 'emerald', 'violet', 'rose', 'blue', 'slate'];

/**
 * Checks if a string is a hex or css color rather than a preset name.
 */
export function isCustomColor(color) {
  if (!color || typeof color !== 'string') return false;
  const trimmed = color.trim().toLowerCase();
  if (THEME_PRESETS.includes(trimmed)) return false;
  return (
    /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(trimmed) ||
    trimmed.startsWith('rgb(') ||
    trimmed.startsWith('rgba(') ||
    trimmed.startsWith('hsl(') ||
    trimmed.startsWith('oklch(')
  );
}

/**
 * Calculates whether a hex or oklch color is light to set appropriate foreground contrast.
 */
export function isLightColor(color) {
  if (!color || typeof color !== 'string') return false;
  const trimmed = color.trim();
  if (trimmed.startsWith('oklch(')) {
    const match = trimmed.match(/oklch\(\s*([\d.]+)/);
    if (match) {
      return parseFloat(match[1]) > 0.6;
    }
  }
  let hex = trimmed.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128;
  }
  return false;
}

/**
 * Applies custom brand color to the host element if theme is not a preset name.
 */
export function applyCustomTheme(element, themeVal) {
  if (!element || !element.style) return;
  if (!themeVal || THEME_PRESETS.includes(themeVal.trim().toLowerCase())) {
    element.style.removeProperty('--primary');
    element.style.removeProperty('--ring');
    element.style.removeProperty('--primary-foreground');
    return;
  }
  element.style.setProperty('--primary', themeVal);
  element.style.setProperty('--ring', themeVal);
  const fg = isLightColor(themeVal) ? '#000000' : '#ffffff';
  element.style.setProperty('--primary-foreground', fg);
}

export default css`
  :host {
    /* Typography: supports shadcn --font-sans or --font-regular */
    --font-mono: Monaco, 'Andale Mono', 'Roboto Mono', Consolas, monospace;
    --font-regular: var(--font-sans, 'Open Sans', Avenir, 'Segoe UI', Arial, sans-serif);

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

    /* Method colors in nav */
    --nav-get-color: var(--method-get);
    --nav-post-color: var(--method-post);
    --nav-put-color: var(--method-put);
    --nav-delete-color: var(--method-delete);
    --nav-head-color: var(--method-head);
    --nav-patch-color: var(--method-patch);
    --nav-options-color: var(--method-options);
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
    --card-radius: 4px;
  }
  :host([radius='lg']) {
    --radius: 0.5rem;
    --card-radius: 6px;
  }
  :host([radius='full']) {
    --radius: 9999px;
    --card-radius: 6px;
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
    --input-background: color-mix(in srgb, var(--background) 95%, var(--foreground));
    --input-border: color-mix(in srgb, var(--border) 60%, var(--background));
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
      --input-background: color-mix(in srgb, var(--background) 95%, var(--foreground));
      --input-border: color-mix(in srgb, var(--border) 60%, var(--background));
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
  :host(:not([theme])) {
    --primary: #3b82f6;
    --primary-foreground: #ffffff;
    --ring: #3b82f6;
  }
  :host([theme='default'][color-scheme='light']),
  :host([theme='blue'][color-scheme='light']) {
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
    --input-background: color-mix(in srgb, var(--background) 95%, var(--foreground));
    --input-border: color-mix(in srgb, var(--border) 60%, var(--background));
    --input: var(--input-background);
    --primary: oklch(0.7686 0.1647 70.0804);
    --primary-foreground: oklch(0 0 0);
    --ring: oklch(0.7686 0.1647 70.0804);
  }

  /* 3. GRAPHITE (Monochrome Minimalist) */
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

  /* 4. EMERALD / MODERN (Clean Emerald Accent) */
  :host([theme='emerald']),
  :host([theme='modern']) {
    --primary: #10b981;
    --primary-foreground: #ffffff;
    --ring: #10b981;
  }
  :host([theme='emerald'][color-scheme='light']),
  :host([theme='modern'][color-scheme='light']) {
    --primary: #059669;
    --primary-foreground: #ffffff;
    --ring: #059669;
  }

  /* 5. VIOLET (Purple / Indigo Accent) */
  :host([theme='violet']) {
    --primary: #8b5cf6;
    --primary-foreground: #ffffff;
    --ring: #8b5cf6;
  }
  :host([theme='violet'][color-scheme='light']) {
    --primary: #7c3aed;
    --primary-foreground: #ffffff;
    --ring: #7c3aed;
  }

  /* 6. ROSE (Ruby / Rose Accent) */
  :host([theme='rose']) {
    --primary: #f43f5e;
    --primary-foreground: #ffffff;
    --ring: #f43f5e;
  }
  :host([theme='rose'][color-scheme='light']) {
    --primary: #e11d48;
    --primary-foreground: #ffffff;
    --ring: #e11d48;
  }

  /* 7. SLATE (Slate / Neutral Grey Accent) */
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

  /* System Color Scheme Preset Light Overrides */
  @media (prefers-color-scheme: light) {
    :host([theme='default'][color-scheme='system']),
    :host([theme='blue'][color-scheme='system']) {
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
      --input-background: color-mix(in srgb, var(--background) 95%, var(--foreground));
      --input-border: color-mix(in srgb, var(--border) 60%, var(--background));
      --input: var(--input-background);
      --primary: oklch(0.7686 0.1647 70.0804);
      --primary-foreground: oklch(0 0 0);
      --ring: oklch(0.7686 0.1647 70.0804);
    }
    :host([theme='graphite'][color-scheme='system']) {
      --primary: #18181b;
      --primary-foreground: #fafafa;
      --ring: #27272a;
    }
    :host([theme='emerald'][color-scheme='system']),
    :host([theme='modern'][color-scheme='system']) {
      --primary: #059669;
      --primary-foreground: #ffffff;
      --ring: #059669;
    }
    :host([theme='violet'][color-scheme='system']) {
      --primary: #7c3aed;
      --primary-foreground: #ffffff;
      --ring: #7c3aed;
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
