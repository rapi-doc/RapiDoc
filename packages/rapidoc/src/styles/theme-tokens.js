import { css } from 'lit';

export const THEME_PRESETS = ['amber', 'graphite', 'slate', 'emerald', 'violet', 'rose', 'blue'];

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

/**
 * Applies custom font families to the host element if attributes are specified.
 */
export function applyCustomFonts(element, regularFont, monoFont) {
  if (!element || !element.style) return;
  if (regularFont) {
    element.style.setProperty('--font-regular', regularFont);
  } else {
    element.style.removeProperty('--font-regular');
  }
  if (monoFont) {
    element.style.setProperty('--font-mono', monoFont);
  } else {
    element.style.removeProperty('--font-mono');
  }
}

export default css`
  :host {
    /* Fonts */
    --font-mono: Monaco, 'Andale Mono', 'Roboto Mono', Consolas, monospace;
    --font-regular: 'Open Sans', Avenir, 'Segoe UI', Arial, sans-serif;

    /* Base default radius (sm: 0.25rem = 4px) */
    --radius: 0.25rem;
    --card-radius: 4px;
    --border-radius: var(--radius);

    /* Base scale & fonts */
    --ui-base-size: 14px;
    --font-size-small: 12px;
    --font-size-mono: 13px;
    --font-size-regular: 14px;
    --nav-width: 18.75rem;

    /* Base nav padding */
    --nav-item-padding: 0.4375rem 1rem 0.4375rem 0.625rem;

    /* HTTP Method Badge Tokens */
    --method-get: #3b82f6;
    --method-post: #10b981;
    --method-put: #f59e0b;
    --method-delete: #ef4444;
    --method-patch: #8b5cf6;
    --method-head: #eab308;
    --method-options: #06b6d4;

    /* General status & method helpers */
    --blue: #3b82f6;
    --green: #10b981;
    --orange: #f59e0b;
    --red: #ef4444;
    --purple: #8b5cf6;
    --yellow: #eab308;
    --pink: #ec4899;
    --brown: #d97706;

    /* Scrollbar & Dialog defaults */
    --scroll-bar-width: 8px;
    --dialog-z-index: 1000;
    --table-schema-key-width: 240px;
    --table-schema-key-text-overflow: ellipsis;
    --table-schema-key-whitespace: nowrap;

    /* Legacy Bridge Mappings (ensures existing components consume new tokens) */
    --bg: var(--background);
    --bg1: var(--background);
    --bg2: var(--card);
    --bg3: var(--muted);
    --light-bg: var(--card);
    --fg: var(--foreground);
    --fg1: var(--foreground);
    --fg2: var(--card-foreground);
    --fg3: var(--muted-foreground);
    --light-fg: var(--muted-foreground);
    --primary-color: var(--primary);
    --primary-color-invert: var(--primary-foreground);
    --primary-color-trans: color-mix(in srgb, var(--primary) 35%, transparent);
    --border-color: var(--border);
    --light-border-color: var(--border);
    --code-border-color: var(--border);
    --input-bg: var(--input);
    --placeholder-color: var(--muted-foreground);
    --hover-color: var(--muted);
    --focus-shadow: 0 0 0 1px transparent, 0 0 0 2px color-mix(in srgb, var(--ring) 40%, transparent);
    --selection-bg: color-mix(in srgb, var(--primary) 25%, transparent);
    --selection-fg: var(--foreground);
    --overlay-bg: rgba(0, 0, 0, 0.5);

    /* Header & Nav Bridge */
    --header-bg: var(--background);
    --header-fg: var(--foreground);
    --header-color-border: var(--border);
    --header-color-darker: var(--muted);
    --nav-bg-color: var(--background);
    --nav-text-color: var(--muted-foreground);
    --nav-hover-bg-color: var(--muted);
    --nav-hover-text-color: var(--foreground);
    --nav-accent-color: var(--primary);
    --nav-accent-text-color: var(--primary-foreground);

    /* Method colors in nav */
    --nav-get-color: var(--method-get);
    --nav-post-color: var(--method-post);
    --nav-put-color: var(--method-put);
    --nav-delete-color: var(--method-delete);
    --nav-head-color: var(--method-head);

    /* Code & Syntax Defaults */
    --code-bg: var(--card);
    --code-fg: var(--foreground);
    --inline-code-fg: var(--primary);
    --code-property-color: var(--syntax-property);
    --code-keyword-color: var(--syntax-keyword);
    --code-operator-color: var(--syntax-operator);
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
     Scale Tokens (Replaces font-size)
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
     Syntax Highlighting Tokens
     ========================================================================= */
  /* Dark Syntax Highlighting */
  :host([color-scheme='dark']),
  :host(:not([color-scheme])) {
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

  /* Light Syntax Highlighting */
  :host([color-scheme='light']) {
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

  @media (prefers-color-scheme: dark) {
    :host([color-scheme='system']) {
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
  }

  @media (prefers-color-scheme: light) {
    :host([color-scheme='system']) {
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
     1. PRESET: AMBER (Default)
     ========================================================================= */
  :host([theme='amber'][color-scheme='dark']),
  :host(:not([theme])[color-scheme='dark']),
  :host([theme='amber']:not([color-scheme])),
  :host(:not([theme]):not([color-scheme])) {
    --background: #09090b;
    --foreground: #fafafa;
    --card: #18181b;
    --card-foreground: #fafafa;
    --muted: #27272a;
    --muted-foreground: #a1a1aa;
    --border: #27272a;
    --input: #18181b;
    --primary: #f59e0b;
    --primary-foreground: #000000;
    --ring: #f59e0b;
  }

  :host([theme='amber'][color-scheme='light']),
  :host(:not([theme])[color-scheme='light']) {
    --background: #ffffff;
    --foreground: #09090b;
    --card: #f4f4f5;
    --card-foreground: #09090b;
    --muted: #f4f4f5;
    --muted-foreground: #71717a;
    --border: #e4e4e7;
    --input: #ffffff;
    --primary: #d97706;
    --primary-foreground: #ffffff;
    --ring: #d97706;
  }

  /* =========================================================================
     2. PRESET: GRAPHITE (Monochrome Minimalist)
     ========================================================================= */
  :host([theme='graphite'][color-scheme='dark']),
  :host([theme='graphite']:not([color-scheme])) {
    --background: #09090b;
    --foreground: #f4f4f5;
    --card: #18181b;
    --card-foreground: #f4f4f5;
    --muted: #27272a;
    --muted-foreground: #a1a1aa;
    --border: #27272a;
    --input: #18181b;
    --primary: #fafafa;
    --primary-foreground: #18181b;
    --ring: #d4d4d8;
  }

  :host([theme='graphite'][color-scheme='light']) {
    --background: #ffffff;
    --foreground: #18181b;
    --card: #f4f4f5;
    --card-foreground: #18181b;
    --muted: #e4e4e7;
    --muted-foreground: #71717a;
    --border: #e4e4e7;
    --input: #ffffff;
    --primary: #18181b;
    --primary-foreground: #fafafa;
    --ring: #27272a;
  }

  /* =========================================================================
     3. PRESET: SLATE (Cloud / DevOps Steel)
     ========================================================================= */
  :host([theme='slate'][color-scheme='dark']),
  :host([theme='slate']:not([color-scheme])) {
    --background: #0f172a;
    --foreground: #f8fafc;
    --card: #1e293b;
    --card-foreground: #f8fafc;
    --muted: #334155;
    --muted-foreground: #94a3b8;
    --border: #334155;
    --input: #1e293b;
    --primary: #38bdf8;
    --primary-foreground: #0f172a;
    --ring: #38bdf8;
  }

  :host([theme='slate'][color-scheme='light']) {
    --background: #ffffff;
    --foreground: #0f172a;
    --card: #f1f5f9;
    --card-foreground: #0f172a;
    --muted: #e2e8f0;
    --muted-foreground: #64748b;
    --border: #cbd5e1;
    --input: #ffffff;
    --primary: #0284c7;
    --primary-foreground: #ffffff;
    --ring: #0284c7;
  }

  /* =========================================================================
     4. PRESET: EMERALD (Fintech / Clean Green)
     ========================================================================= */
  :host([theme='emerald'][color-scheme='dark']),
  :host([theme='emerald']:not([color-scheme])) {
    --background: #06120e;
    --foreground: #ecfdf5;
    --card: #0d281e;
    --card-foreground: #ecfdf5;
    --muted: #13392b;
    --muted-foreground: #6ee7b7;
    --border: #13392b;
    --input: #0d281e;
    --primary: #10b981;
    --primary-foreground: #06120e;
    --ring: #10b981;
  }

  :host([theme='emerald'][color-scheme='light']) {
    --background: #ffffff;
    --foreground: #064e3b;
    --card: #f0fdf4;
    --card-foreground: #064e3b;
    --muted: #dcfce7;
    --muted-foreground: #059669;
    --border: #bbf7d0;
    --input: #ffffff;
    --primary: #059669;
    --primary-foreground: #ffffff;
    --ring: #059669;
  }

  /* =========================================================================
     5. PRESET: VIOLET (AI / Creative Purple)
     ========================================================================= */
  :host([theme='violet'][color-scheme='dark']),
  :host([theme='violet']:not([color-scheme])) {
    --background: #0f0b1e;
    --foreground: #f5f3ff;
    --card: #1e173b;
    --card-foreground: #f5f3ff;
    --muted: #2e2456;
    --muted-foreground: #c4b5fd;
    --border: #2e2456;
    --input: #1e173b;
    --primary: #a78bfa;
    --primary-foreground: #0f0b1e;
    --ring: #a78bfa;
  }

  :host([theme='violet'][color-scheme='light']) {
    --background: #ffffff;
    --foreground: #2e1065;
    --card: #faf5ff;
    --card-foreground: #2e1065;
    --muted: #f3e8ff;
    --muted-foreground: #7c3aed;
    --border: #e9d5ff;
    --input: #ffffff;
    --primary: #7c3aed;
    --primary-foreground: #ffffff;
    --ring: #7c3aed;
  }

  /* =========================================================================
     6. PRESET: ROSE (Consumer / Punchy Red-Pink)
     ========================================================================= */
  :host([theme='rose'][color-scheme='dark']),
  :host([theme='rose']:not([color-scheme])) {
    --background: #140b0f;
    --foreground: #fff1f2;
    --card: #27141e;
    --card-foreground: #fff1f2;
    --muted: #3b1d2d;
    --muted-foreground: #fda4af;
    --border: #3b1d2d;
    --input: #27141e;
    --primary: #fb7185;
    --primary-foreground: #140b0f;
    --ring: #fb7185;
  }

  :host([theme='rose'][color-scheme='light']) {
    --background: #ffffff;
    --foreground: #4c0519;
    --card: #fff1f2;
    --card-foreground: #4c0519;
    --muted: #ffe4e6;
    --muted-foreground: #e11d48;
    --border: #fecdd3;
    --input: #ffffff;
    --primary: #e11d48;
    --primary-foreground: #ffffff;
    --ring: #e11d48;
  }

  /* =========================================================================
     7. PRESET: BLUE (Classic SaaS Royal Blue)
     ========================================================================= */
  :host([theme='blue'][color-scheme='dark']),
  :host([theme='blue']:not([color-scheme])) {
    --background: #090d16;
    --foreground: #eff6ff;
    --card: #111a2e;
    --card-foreground: #eff6ff;
    --muted: #1e2e4f;
    --muted-foreground: #93c5fd;
    --border: #1e2e4f;
    --input: #111a2e;
    --primary: #3b82f6;
    --primary-foreground: #ffffff;
    --ring: #3b82f6;
  }

  :host([theme='blue'][color-scheme='light']) {
    --background: #ffffff;
    --foreground: #172554;
    --card: #eff6ff;
    --card-foreground: #172554;
    --muted: #dbeafe;
    --muted-foreground: #2563eb;
    --border: #bfdbfe;
    --input: #ffffff;
    --primary: #2563eb;
    --primary-foreground: #ffffff;
    --ring: #2563eb;
  }

  /* =========================================================================
     SYSTEM COLOR-SCHEME MEDIA QUERIES
     ========================================================================= */
  @media (prefers-color-scheme: dark) {
    :host([color-scheme='system']),
    :host([theme='amber'][color-scheme='system']) {
      --background: #09090b;
      --foreground: #fafafa;
      --card: #18181b;
      --card-foreground: #fafafa;
      --muted: #27272a;
      --muted-foreground: #a1a1aa;
      --border: #27272a;
      --input: #18181b;
      --primary: #f59e0b;
      --primary-foreground: #000000;
      --ring: #f59e0b;
    }
    :host([theme='graphite'][color-scheme='system']) {
      --background: #09090b;
      --foreground: #f4f4f5;
      --card: #18181b;
      --card-foreground: #f4f4f5;
      --muted: #27272a;
      --muted-foreground: #a1a1aa;
      --border: #27272a;
      --input: #18181b;
      --primary: #fafafa;
      --primary-foreground: #18181b;
      --ring: #d4d4d8;
    }
    :host([theme='slate'][color-scheme='system']) {
      --background: #0f172a;
      --foreground: #f8fafc;
      --card: #1e293b;
      --card-foreground: #f8fafc;
      --muted: #334155;
      --muted-foreground: #94a3b8;
      --border: #334155;
      --input: #1e293b;
      --primary: #38bdf8;
      --primary-foreground: #0f172a;
      --ring: #38bdf8;
    }
    :host([theme='emerald'][color-scheme='system']) {
      --background: #06120e;
      --foreground: #ecfdf5;
      --card: #0d281e;
      --card-foreground: #ecfdf5;
      --muted: #13392b;
      --muted-foreground: #6ee7b7;
      --border: #13392b;
      --input: #0d281e;
      --primary: #10b981;
      --primary-foreground: #06120e;
      --ring: #10b981;
    }
    :host([theme='violet'][color-scheme='system']) {
      --background: #0f0b1e;
      --foreground: #f5f3ff;
      --card: #1e173b;
      --card-foreground: #f5f3ff;
      --muted: #2e2456;
      --muted-foreground: #c4b5fd;
      --border: #2e2456;
      --input: #1e173b;
      --primary: #a78bfa;
      --primary-foreground: #0f0b1e;
      --ring: #a78bfa;
    }
    :host([theme='rose'][color-scheme='system']) {
      --background: #140b0f;
      --foreground: #fff1f2;
      --card: #27141e;
      --card-foreground: #fff1f2;
      --muted: #3b1d2d;
      --muted-foreground: #fda4af;
      --border: #3b1d2d;
      --input: #27141e;
      --primary: #fb7185;
      --primary-foreground: #140b0f;
      --ring: #fb7185;
    }
    :host([theme='blue'][color-scheme='system']) {
      --background: #090d16;
      --foreground: #eff6ff;
      --card: #111a2e;
      --card-foreground: #eff6ff;
      --muted: #1e2e4f;
      --muted-foreground: #93c5fd;
      --border: #1e2e4f;
      --input: #111a2e;
      --primary: #3b82f6;
      --primary-foreground: #ffffff;
      --ring: #3b82f6;
    }
  }

  @media (prefers-color-scheme: light) {
    :host([color-scheme='system']),
    :host([theme='amber'][color-scheme='system']) {
      --background: #ffffff;
      --foreground: #09090b;
      --card: #f4f4f5;
      --card-foreground: #09090b;
      --muted: #f4f4f5;
      --muted-foreground: #71717a;
      --border: #e4e4e7;
      --input: #ffffff;
      --primary: #d97706;
      --primary-foreground: #ffffff;
      --ring: #d97706;
    }
    :host([theme='graphite'][color-scheme='system']) {
      --background: #ffffff;
      --foreground: #18181b;
      --card: #f4f4f5;
      --card-foreground: #18181b;
      --muted: #e4e4e7;
      --muted-foreground: #71717a;
      --border: #e4e4e7;
      --input: #ffffff;
      --primary: #18181b;
      --primary-foreground: #fafafa;
      --ring: #27272a;
    }
    :host([theme='slate'][color-scheme='system']) {
      --background: #ffffff;
      --foreground: #0f172a;
      --card: #f1f5f9;
      --card-foreground: #0f172a;
      --muted: #e2e8f0;
      --muted-foreground: #64748b;
      --border: #cbd5e1;
      --input: #ffffff;
      --primary: #0284c7;
      --primary-foreground: #ffffff;
      --ring: #0284c7;
    }
    :host([theme='emerald'][color-scheme='system']) {
      --background: #ffffff;
      --foreground: #064e3b;
      --card: #f0fdf4;
      --card-foreground: #064e3b;
      --muted: #dcfce7;
      --muted-foreground: #059669;
      --border: #bbf7d0;
      --input: #ffffff;
      --primary: #059669;
      --primary-foreground: #ffffff;
      --ring: #059669;
    }
    :host([theme='violet'][color-scheme='system']) {
      --background: #ffffff;
      --foreground: #2e1065;
      --card: #faf5ff;
      --card-foreground: #2e1065;
      --muted: #f3e8ff;
      --muted-foreground: #7c3aed;
      --border: #e9d5ff;
      --input: #ffffff;
      --primary: #7c3aed;
      --primary-foreground: #ffffff;
      --ring: #7c3aed;
    }
    :host([theme='rose'][color-scheme='system']) {
      --background: #ffffff;
      --foreground: #4c0519;
      --card: #fff1f2;
      --card-foreground: #4c0519;
      --muted: #ffe4e6;
      --muted-foreground: #e11d48;
      --border: #fecdd3;
      --input: #ffffff;
      --primary: #e11d48;
      --primary-foreground: #ffffff;
      --ring: #e11d48;
    }
    :host([theme='blue'][color-scheme='system']) {
      --background: #ffffff;
      --foreground: #172554;
      --card: #eff6ff;
      --card-foreground: #172554;
      --muted: #dbeafe;
      --muted-foreground: #2563eb;
      --border: #bfdbfe;
      --input: #ffffff;
      --primary: #2563eb;
      --primary-foreground: #ffffff;
      --ring: #2563eb;
    }
  }
`;
