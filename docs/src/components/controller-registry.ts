export interface ControlOption {
  label: string;
  rawVal: string;
  dotColor?: string;
  isDefault?: boolean;
}

export type ControlCategory = 'appearance' | 'theming' | 'navigation' | 'schema' | 'sections';

export interface SegmentedControl {
  type: 'segmented';
  attr: string;
  label: string;
  tip?: string;
  info?: string;
  category: ControlCategory;
  options: ControlOption[];
}

export interface ToggleControl {
  type: 'toggle';
  attr: string;
  label: string;
  tip?: string;
  info?: string;
  category: ControlCategory;
  defaultOn?: boolean;
}

export type ControlDef = SegmentedControl | ToggleControl;

export type ControllerPreset = 'all' | 'minimal' | 'schema' | 'nav' | 'sections' | 'colors' | 'demo' | 'none' | 'auto';

export const CONTROL_REGISTRY: Record<string, ControlDef> = {
  // Appearance & Layout
  'render-style': {
    type: 'segmented',
    attr: 'render-style',
    label: 'Render Style',
    tip: 'Display mode: Read for docs, View with tabs, Focused for single endpoint',
    category: 'appearance',
    options: [
      { label: 'Read', rawVal: 'read' },
      { label: 'View', rawVal: 'view', isDefault: true },
      { label: 'Focused', rawVal: 'focused' },
    ],
  },
  'schema-style': {
    type: 'segmented',
    attr: 'schema-style',
    label: 'Schema Style',
    tip: 'Display schemas as visual table or tree hierarchy',
    category: 'appearance',
    options: [
      { label: 'Table', rawVal: 'table', isDefault: true },
      { label: 'Tree', rawVal: 'tree' },
    ],
  },
  scale: {
    type: 'segmented',
    attr: 'scale',
    label: 'UI Scale',
    tip: 'Global scale for typography and spacing',
    category: 'appearance',
    options: [
      { label: 'Compact', rawVal: 'sm' },
      { label: 'Default', rawVal: 'default', isDefault: true },
      { label: 'Large', rawVal: 'lg' },
    ],
  },
  layout: {
    type: 'segmented',
    attr: 'layout',
    label: 'Req/Res Layout',
    tip: 'Request and response layout arrangement in read mode',
    category: 'appearance',
    options: [
      { label: 'Row', rawVal: 'row', isDefault: true },
      { label: 'Column', rawVal: 'column' },
    ],
  },
  'heading-text': {
    type: 'segmented',
    attr: 'heading-text',
    label: 'Heading Text',
    tip: 'Top header title text',
    category: 'appearance',
    options: [
      { label: 'Default', rawVal: '', isDefault: true },
      { label: 'API Explorer', rawVal: 'API Explorer' },
    ],
  },

  // Colors & Fonts
  theme: {
    type: 'segmented',
    attr: 'theme',
    label: 'Theme',
    tip: 'Color palette preset',
    category: 'theming',
    options: [
      { label: 'Amber', rawVal: 'amber', isDefault: true, dotColor: '#f59e0b' },
      { label: 'Graphite', rawVal: 'graphite', dotColor: '#71717a' },
      { label: 'Slate', rawVal: 'slate', dotColor: '#38bdf8' },
      { label: 'Emerald', rawVal: 'emerald', dotColor: '#10b981' },
      { label: 'Violet', rawVal: 'violet', dotColor: '#8b5cf6' },
      { label: 'Rose', rawVal: 'rose', dotColor: '#fb7185' },
      { label: 'Blue', rawVal: 'blue', dotColor: '#3b82f6' },
    ],
  },
  'color-scheme': {
    type: 'segmented',
    attr: 'color-scheme',
    label: 'Color Scheme',
    tip: 'Light or dark luminance scheme',
    category: 'theming',
    options: [
      { label: 'Dark', rawVal: 'dark', isDefault: true },
      { label: 'Light', rawVal: 'light' },
      { label: 'System', rawVal: 'system' },
    ],
  },
  radius: {
    type: 'segmented',
    attr: 'radius',
    label: 'Radius',
    tip: 'Border radius for cards, inputs, and buttons',
    category: 'theming',
    options: [
      { label: 'None', rawVal: 'none' },
      { label: 'Small', rawVal: 'sm', isDefault: true },
      { label: 'Medium', rawVal: 'md' },
      { label: 'Large', rawVal: 'lg' },
      { label: 'Full', rawVal: 'full' },
    ],
  },
  'regular-font': {
    type: 'segmented',
    attr: 'regular-font',
    label: 'Regular Font',
    tip: 'Main document body and heading font family',
    category: 'theming',
    options: [
      { label: 'Default', rawVal: '', isDefault: true },
      { label: 'Nunito', rawVal: 'Nunito' },
      { label: 'Roboto Mono', rawVal: 'Roboto Mono' },
    ],
  },
  'mono-font': {
    type: 'segmented',
    attr: 'mono-font',
    label: 'Mono Font',
    tip: 'Monospace font family for code blocks and schema types',
    category: 'theming',
    options: [
      { label: 'Default', rawVal: '', isDefault: true },
      { label: 'Courier', rawVal: 'Courier' },
    ],
  },

  // Navigation & Methods
  'use-path-in-nav-bar': {
    type: 'segmented',
    attr: 'use-path-in-nav-bar',
    label: 'Nav Text',
    tip: 'Display endpoint URL path or summary in sidebar',
    category: 'navigation',
    options: [
      { label: 'Path', rawVal: 'true' },
      { label: 'Summary', rawVal: 'false', isDefault: true },
    ],
  },
  'show-method-in-nav-bar': {
    type: 'segmented',
    attr: 'show-method-in-nav-bar',
    label: 'Method Display',
    tip: 'Sidebar HTTP method badge presentation style',
    category: 'navigation',
    options: [
      { label: 'None', rawVal: 'false', isDefault: true },
      { label: 'Plain', rawVal: 'as-plain-text' },
      { label: 'Colored', rawVal: 'as-colored-text' },
      { label: 'Block', rawVal: 'as-colored-block' },
    ],
  },
  'nav-active-item-marker': {
    type: 'segmented',
    attr: 'nav-active-item-marker',
    label: 'Nav Marker',
    tip: 'Visual marker indicating active endpoint in sidebar',
    category: 'navigation',
    options: [
      { label: 'Left Bar', rawVal: 'left-bar', isDefault: true },
      { label: 'Block', rawVal: 'colored-block' },
    ],
  },
  'nav-item-spacing': {
    type: 'segmented',
    attr: 'nav-item-spacing',
    label: 'Nav Spacing',
    tip: 'Vertical spacing between sidebar navigation items',
    category: 'navigation',
    options: [
      { label: 'Compact', rawVal: 'compact' },
      { label: 'Default', rawVal: 'default', isDefault: true },
      { label: 'Relaxed', rawVal: 'relaxed' },
    ],
  },

  'sort-tags': {
    type: 'segmented',
    attr: 'sort-tags',
    label: 'Sort Tags',
    tip: 'Alphabetically sort tag sections in sidebar',
    category: 'navigation',
    options: [
      { label: 'False', rawVal: 'false', isDefault: true },
      { label: 'True', rawVal: 'true' },
    ],
  },
  'info-description-headings-in-navbar': {
    type: 'segmented',
    attr: 'info-description-headings-in-navbar',
    label: 'Nav Headings',
    tip: 'Extract H1 and H2 markdown headings into sidebar navigation',
    category: 'navigation',
    options: [
      { label: 'True', rawVal: 'true' },
      { label: 'False', rawVal: 'false', isDefault: true },
    ],
  },
  'update-route': {
    type: 'segmented',
    attr: 'update-route',
    label: 'Update Route',
    tip: 'Update browser URL hash when navigating endpoints',
    category: 'navigation',
    options: [
      { label: 'True', rawVal: 'true', isDefault: true },
      { label: 'False', rawVal: 'false' },
    ],
  },
  'route-prefix': {
    type: 'segmented',
    attr: 'route-prefix',
    label: 'Route Prefix',
    tip: 'URL hash prefix for endpoint routing',
    category: 'navigation',
    options: [
      { label: '#', rawVal: '#', isDefault: true },
      { label: '#/', rawVal: '#/' },
      { label: '#!', rawVal: '#!' },
    ],
  },
  'on-nav-tag-click': {
    type: 'segmented',
    attr: 'on-nav-tag-click',
    label: 'Tag Click',
    tip: 'Behavior when clicking a tag header in the sidebar',
    info: 'Works only when render-style = focused',
    category: 'navigation',
    options: [
      { label: 'Expand', rawVal: 'expand-collapse', isDefault: true },
      { label: 'Description', rawVal: 'show-description' },
    ],
  },

  // Schema & Models
  'default-schema-tab': {
    type: 'segmented',
    attr: 'default-schema-tab',
    label: 'Schema Tab',
    tip: 'Default active tab in request and response bodies',
    category: 'schema',
    options: [
      { label: 'Schema', rawVal: 'schema' },
      { label: 'Example', rawVal: 'example', isDefault: true },
    ],
  },
  'schema-expand-level': {
    type: 'segmented',
    attr: 'schema-expand-level',
    label: 'Expand Level',
    tip: 'Initial expansion depth for nested schemas (max 999)',
    category: 'schema',
    options: [
      { label: '1', rawVal: '1' },
      { label: '2', rawVal: '2' },
      { label: '3', rawVal: '3' },
      { label: '9', rawVal: '9', isDefault: true },
    ],
  },
  'schema-hide-read-only': {
    type: 'segmented',
    attr: 'schema-hide-read-only',
    label: 'Hide Read-Only',
    tip: 'Hide read-only fields from request body schemas',
    category: 'schema',
    options: [
      { label: 'Default', rawVal: 'default', isDefault: true },
      { label: 'Never', rawVal: 'never' },
    ],
  },
  'schema-hide-write-only': {
    type: 'segmented',
    attr: 'schema-hide-write-only',
    label: 'Hide Write-Only',
    tip: 'Hide write-only fields from response body schemas',
    category: 'schema',
    options: [
      { label: 'Default', rawVal: 'default', isDefault: true },
      { label: 'Never', rawVal: 'never' },
    ],
  },
  'schema-description-expanded': {
    type: 'toggle',
    attr: 'schema-description-expanded',
    label: 'Desc Expanded',
    tip: 'Display full multiline schema property descriptions by default',
    category: 'schema',
  },
  'allow-schema-description-expand-toggle': {
    type: 'toggle',
    attr: 'allow-schema-description-expand-toggle',
    label: 'Desc Toggle',
    tip: 'Show toggle button for multiline schema descriptions',
    category: 'schema',
    defaultOn: true,
  },
  'fill-request-fields-with-example': {
    type: 'toggle',
    attr: 'fill-request-fields-with-example',
    label: 'Fill Examples',
    tip: 'Pre-populate "Try" console parameters with sample values',
    category: 'schema',
    defaultOn: true,
  },

  // Sections & Toggles
  'show-header': {
    type: 'toggle',
    attr: 'show-header',
    label: 'Header',
    tip: 'Display the top navbar header',
    category: 'sections',
    defaultOn: true,
  },
  'show-info': {
    type: 'toggle',
    attr: 'show-info',
    label: 'Info Section',
    tip: 'Display OpenAPI document title and overview info',
    category: 'sections',
    defaultOn: true,
  },
  'allow-try': {
    type: 'toggle',
    attr: 'allow-try',
    label: 'Try Console',
    tip: 'Live interactive endpoint testing console',
    category: 'sections',
    defaultOn: true,
  },
  'show-curl-before-try': {
    type: 'toggle',
    attr: 'show-curl-before-try',
    label: 'Show cURL',
    tip: 'Display cURL command before invoking API',
    category: 'sections',
  },
  'allow-server-selection': {
    type: 'toggle',
    attr: 'allow-server-selection',
    label: 'Servers',
    tip: 'Allow switching between configured API server URLs',
    category: 'sections',
    defaultOn: true,
  },
  'allow-authentication': {
    type: 'toggle',
    attr: 'allow-authentication',
    label: 'Auth Section',
    tip: 'Display authentication button and credential modal',
    category: 'sections',
    defaultOn: true,
  },
  'persist-auth': {
    type: 'toggle',
    attr: 'persist-auth',
    label: 'Persist Auth',
    tip: 'Persist API keys and tokens in browser localStorage',
    category: 'sections',
  },
  'allow-search': {
    type: 'toggle',
    attr: 'allow-search',
    label: 'Search',
    tip: 'Enable quick endpoint search bar',
    category: 'sections',
    defaultOn: true,
  },
  'allow-advanced-search': {
    type: 'toggle',
    attr: 'allow-advanced-search',
    label: 'Adv Search',
    tip: 'Enable advanced full-text schema and parameter search',
    category: 'sections',
    defaultOn: true,
  },
  'show-components': {
    type: 'toggle',
    attr: 'show-components',
    label: 'Components',
    tip: 'Display Schemas and Models in navigation',
    category: 'sections',
  },
  'allow-spec-url-load': {
    type: 'toggle',
    attr: 'allow-spec-url-load',
    label: 'Spec URL Load',
    tip: 'Allow loading arbitrary OpenAPI spec by URL',
    category: 'sections',
    defaultOn: true,
  },
  'allow-spec-file-load': {
    type: 'toggle',
    attr: 'allow-spec-file-load',
    label: 'Spec File Load',
    tip: 'Allow uploading and viewing local OpenAPI spec file',
    category: 'sections',
    defaultOn: true,
  },
  'allow-spec-file-download': {
    type: 'toggle',
    attr: 'allow-spec-file-download',
    label: 'Spec Download',
    tip: 'Show download button for the active OpenAPI spec',
    category: 'sections',
  },
  'mock-server': {
    type: 'toggle',
    attr: 'mock-server',
    label: 'Mock Server',
    tip: 'Route requests through local or hosted mock server',
    category: 'sections',
  },
};

export const CATEGORY_TITLES: Record<ControlCategory, string> = {
  appearance: 'Display & Layout',
  theming: 'Colors & Fonts',
  navigation: 'Sidebar & Navigation',
  schema: 'Schema',
  sections: 'Interactive Sections',
};

export const PRESETS: Record<string, string[]> = {
  all: Object.keys(CONTROL_REGISTRY),
  demo: Object.keys(CONTROL_REGISTRY),
  minimal: ['render-style', 'schema-style', 'theme'],
  colors: ['theme', 'color-scheme', 'radius', 'scale', 'regular-font', 'mono-font'],
  schema: [
    'schema-style',
    'default-schema-tab',
    'schema-expand-level',
    'schema-description-expanded',
    'allow-schema-description-expand-toggle',
    'schema-hide-read-only',
    'schema-hide-write-only',
    'fill-request-fields-with-example',
  ],
  nav: [
    'use-path-in-nav-bar',
    'show-method-in-nav-bar',
    'on-nav-tag-click',
    'nav-active-item-marker',
    'nav-item-spacing',
    'sort-tags',
    'update-route',
    'route-prefix',
  ],
  sections: [
    'show-header',
    'show-info',
    'allow-server-selection',
    'allow-authentication',
    'allow-try',
    'show-curl-before-try',
    'show-components',
    'allow-search',
    'allow-spec-file-download',
    'mock-server',
  ],
  none: [],
};

export function resolveActiveControls(propControls?: string[], preset: string = 'minimal'): ControlDef[] {
  const baseList = propControls && propControls.length > 0 ? propControls : PRESETS[preset] || PRESETS.minimal;
  const activeKeys = Array.from(new Set(baseList));
  return activeKeys.map((k) => CONTROL_REGISTRY[k]).filter((c): c is ControlDef => Boolean(c));
}

export function groupControlsByCategory(controls: ControlDef[]): { id: ControlCategory; title: string; controls: ControlDef[] }[] {
  const categories: ControlCategory[] = ['appearance', 'theming', 'navigation', 'schema', 'sections'];
  return categories
    .map((cat) => ({
      id: cat,
      title: CATEGORY_TITLES[cat],
      controls: controls.filter((c) => c.category === cat),
    }))
    .filter((g) => g.controls.length > 0);
}
