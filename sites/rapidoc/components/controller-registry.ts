// The controls of the tuner (RapidocTuner.astro). A control for an attribute takes its name, values, default,
// kind (toggle or list), group and tip from the element's own declaration (packages/rapidoc/src/rapidoc.ts,
// read through page-data/rapidoc-api). Written here is only what the element does not declare: which
// attributes get a control, the presets, sample values for free-form attributes, swatch colours, and the
// controls that are not attributes (fonts, slots).
import { rapidocApiData, type RapidocAttribute } from "../page-data/rapidoc-api";

export interface ControlOption {
  /** The value as written in HTML; `default` for the empty value. Font options show the family name. */
  label: string;
  rawVal: string;
  dotColor?: string;
  isDefault?: boolean;
  /** Stylesheet that loads this font option. Tuners add it to the page the first time the option is picked. */
  fontCss?: string;
}

/** Google Fonts stylesheet for the weights RapiDoc uses (400-700). */
const googleFontCss = (family: string) =>
  `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@400;500;600;700&display=swap`;

/** An attribute group of the element (its `@group`), or one of the tuner's own: `Fonts`, `Slots`. */
export type ControlCategory = string;

export interface SegmentedControl {
  type: "segmented";
  attr: string;
  /** The API name: the attribute, CSS variable or slot. */
  label: string;
  /** One line under the label: the attribute's `@summary`, else the first sentence of its description. */
  tip?: string;
  /** The attribute's full description (HTML), when it says more than the tip. */
  description?: string;
  /** The attribute's default as documented: a value, or a note such as `(empty)`. */
  defaultText?: string;
  info?: string;
  category: ControlCategory;
  options: ControlOption[];
}

export interface ToggleControl {
  type: "toggle";
  attr: string;
  label: string;
  tip?: string;
  description?: string;
  defaultText?: string;
  info?: string;
  category: ControlCategory;
  defaultOn?: boolean;
}

export type ControlDef = SegmentedControl | ToggleControl;

export type ControllerPreset =
  | "all"
  | "minimal"
  | "schema"
  | "nav"
  | "sections"
  | "colors"
  | "color"
  | "slots"
  | "slot"
  | "demo"
  | "mcp"
  | "none"
  | "auto";

/** What a control adds to the element's declaration of its attribute. */
interface AttributeControl {
  /** Values to offer for an attribute that takes any string or number. */
  values?: string[];
  /** Values to offer after the element's own list, for an attribute that also takes other values. */
  extraValues?: string[];
  /** A colour to show next to a value. */
  swatches?: Record<string, string>;
  info?: string;
}

/** The attributes the tuner has a control for, in display order within each group. */
const ATTRIBUTE_CONTROLS: Record<string, AttributeControl> = {
  "render-style": {},
  "schema-style": {},
  layout: {},
  "heading-text": { values: ["", "API Explorer"] },
  "color-scheme": {},
  theme: {
    swatches: {
      ember: "#f76b39",
      carbon: "#a1a1aa",
      cobalt: "#7aa2d6",
      jade: "#00d390",
      indigo: "#818cf8",
      amber: "#f6a821",
      "#8EA66B": "#8EA66B",
    },
    // theme also takes any hex colour: one example
    extraValues: ["#8EA66B"],
  },
  radius: {},
  scale: {},
  "use-path-in-nav-bar": {},
  "show-method-in-nav-bar": {},
  "show-badges-in-nav-bar": {},
  "sort-tags": {},
  "info-description-headings-in-navbar": {},
  "update-route": {},
  "default-schema-tab": {},
  "schema-expand-level": { values: ["1", "2", "3", "99999"] },
  "schema-hide-read-only": {},
  "schema-hide-write-only": {},
  "schema-description-expanded": {},
  "allow-schema-description-expand-toggle": {},
  "fill-request-fields-with-example": {},
  "show-header": {},
  "show-info": {},
  // Also takes filter-operations terms: two examples (the Try page's reqres spec has a deprecated
  // operation and a Beta badge)
  "allow-try": { values: ["true", "false", "!deprecated", "!deprecated !badge:Beta"] },
  "show-curl-before-try": {},
  "allow-server-selection": {},
  "allow-authentication": {},
  "persist-auth": {},
  "allow-search": {},
  "allow-advanced-search": {},
  "show-components": {},
  "allow-spec-url-load": {},
  "allow-spec-file-load": {},
  "allow-spec-file-download": {},
  mcp: {},
  "mock-server": {},
};

/** Controls that are not attributes: the font CSS variables and the demo slots. */
const TUNER_CONTROLS: Record<string, ControlDef> = {
  "regular-font": {
    type: "segmented",
    attr: "regular-font",
    label: "--font-sans",
    tip: "Main document body and heading font family",
    category: "Fonts",
    options: [
      { label: "default", rawVal: "", isDefault: true },
      { label: "Inter", rawVal: "Inter, sans-serif", fontCss: googleFontCss("Inter") },
      {
        label: "IBM Plex Sans",
        rawVal: "'IBM Plex Sans', sans-serif",
        fontCss: googleFontCss("IBM Plex Sans"),
      },
      {
        label: "Source Sans 3",
        rawVal: "'Source Sans 3', sans-serif",
        fontCss: googleFontCss("Source Sans 3"),
      },
      { label: "Nunito", rawVal: "Nunito" },
      { label: "Roboto Mono", rawVal: "Roboto Mono" },
    ],
  },
  "mono-font": {
    type: "segmented",
    attr: "mono-font",
    label: "--font-mono",
    tip: "Monospace font family for code blocks and schema types",
    category: "Fonts",
    options: [
      { label: "default", rawVal: "", isDefault: true },
      {
        label: "JetBrains Mono",
        rawVal: "'JetBrains Mono', monospace",
        fontCss: googleFontCss("JetBrains Mono"),
      },
      {
        label: "IBM Plex Mono",
        rawVal: "'IBM Plex Mono', monospace",
        fontCss: googleFontCss("IBM Plex Mono"),
      },
      {
        label: "Source Code Pro",
        rawVal: "'Source Code Pro', monospace",
        fontCss: googleFontCss("Source Code Pro"),
      },
      { label: "Courier", rawVal: "Courier" },
    ],
  },
  "slot-nav-logo": {
    type: "toggle",
    attr: "slot-nav-logo",
    label: 'slot="nav-logo"',
    tip: "Inject custom logo & text HTML into sidebar navigation",
    category: "Slots",
  },
  "slot-fixed-header": {
    type: "toggle",
    attr: "slot-fixed-header",
    label: 'slot="fixed-header"',
    tip: "Inject custom sticky top banner HTML above documentation",
    category: "Slots",
  },
  "slot-default": {
    type: "toggle",
    attr: "slot-default",
    label: 'slot="(default)"',
    tip: "Inject custom content and disclaimer cards into main body",
    category: "Slots",
  },
};

const isNote = (value: unknown) => /^\(.*\)$/s.test(String(value).trim());

/** The element's attributes by name, each with its group. */
const ATTRIBUTES = new Map<string, RapidocAttribute & { group: string }>();
/** The element's attribute groups, in the order of the /api page. */
const ATTRIBUTE_GROUPS: string[] = [];
for (const entry of rapidocApiData.Attributes) {
  const [title, items] = Object.entries(entry)[0];
  const group = title.replace(/ Attributes$/, "");
  ATTRIBUTE_GROUPS.push(group);
  for (const item of items) ATTRIBUTES.set(item.name, { ...item, group });
}

const plainText = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

/** The first sentence of a description, as plain text. */
function firstSentence(html: string): string {
  const text = plainText(html);
  return /^(.*?[^.])\.(?=\s+[A-Z(]|$)/.exec(text)?.[1] ?? text;
}

function attributeControl(attr: string, extra: AttributeControl): ControlDef {
  const declared = ATTRIBUTES.get(attr);
  if (!declared) {
    throw new Error(`controller-registry: <rapi-doc> has no attribute "${attr}"`);
  }
  const allowed = (declared.allowed ?? []).map(String).filter((value) => !isNote(value));
  const initial =
    declared.default === undefined
      ? undefined
      : isNote(declared.default)
        ? declared.default === "(empty)"
          ? ""
          : undefined
        : String(declared.default);
  const tip = declared.summary ?? firstSentence(declared.description);
  const saysMore = plainText(declared.description).replace(/\.$/, "") !== tip;
  const common = {
    attr,
    label: attr,
    tip,
    ...(saysMore ? { description: declared.description.trim() } : {}),
    ...(declared.default === undefined ? {} : { defaultText: String(declared.default) }),
    ...(extra.info ? { info: extra.info } : {}),
    category: declared.group,
  };
  const isBoolean =
    !extra.values && allowed.length === 2 && allowed.includes("true") && allowed.includes("false");
  if (isBoolean) return { type: "toggle", ...common, defaultOn: initial === "true" };

  const values = extra.values ?? [...allowed, ...(extra.extraValues ?? [])];
  if (values.length === 0) {
    throw new Error(
      `controller-registry: "${attr}" takes any value, so its control needs \`values\``,
    );
  }
  return {
    type: "segmented",
    ...common,
    options: values.map((value) => ({
      label: value === "" ? "default" : value,
      rawVal: value,
      ...(extra.swatches?.[value] ? { dotColor: extra.swatches[value] } : {}),
      ...(value === initial ? { isDefault: true } : {}),
    })),
  };
}

export const CONTROL_REGISTRY: Record<string, ControlDef> = {
  ...Object.fromEntries(
    Object.entries(ATTRIBUTE_CONTROLS).map(([attr, extra]) => [
      attr,
      attributeControl(attr, extra),
    ]),
  ),
  ...TUNER_CONTROLS,
};

/**
 * The tuner's sections, most used first. This order is the tuner's own; the /api page keeps the element's.
 * `Slots` and `Methods & Actions` have no controls here: the tuner draws them itself.
 */
const SECTION_ORDER: ControlCategory[] = [
  "Theme",
  "Layout & Scrolling",
  "Schemas",
  "Authentication",
  "Try & Servers",
  "Mock Server",
  "MCP",
  "Sidebar & Navigation",
  "Header & Sections",
  "Fonts",
  "Slots",
  "Methods & Actions",
  "Spec & Content",
];

/** SECTION_ORDER, with any group of the element it does not list placed before `Fonts`. */
export const TUNER_SECTIONS: ControlCategory[] = SECTION_ORDER.flatMap((section) =>
  section === "Fonts"
    ? [...ATTRIBUTE_GROUPS.filter((group) => !SECTION_ORDER.includes(group)), section]
    : [section],
);
const CATEGORIES = TUNER_SECTIONS;

/** Section headings; a group's name is its heading. */
export const CATEGORY_TITLES: Record<ControlCategory, string> = Object.fromEntries(
  CATEGORIES.map((category) => [category, category]),
);

export const PRESET_ALIASES: Record<string, string> = {
  color: "colors",
  slot: "slots",
  navigation: "nav",
};

export const PRESETS: Record<string, string[]> = {
  all: Object.keys(CONTROL_REGISTRY),
  demo: Object.keys(CONTROL_REGISTRY),
  minimal: ["render-style", "schema-style", "theme", "color-scheme", "radius", "scale"],
  colors: ["theme", "color-scheme", "radius", "scale", "regular-font", "mono-font"],
  color: ["theme", "color-scheme", "radius", "scale", "regular-font", "mono-font"],
  slots: ["slot-nav-logo", "slot-fixed-header", "slot-default"],
  slot: ["slot-nav-logo", "slot-fixed-header", "slot-default"],
  schema: [
    "schema-style",
    "default-schema-tab",
    "schema-expand-level",
    "schema-description-expanded",
    "allow-schema-description-expand-toggle",
    "schema-hide-read-only",
    "schema-hide-write-only",
    "fill-request-fields-with-example",
  ],
  nav: [
    "use-path-in-nav-bar",
    "show-method-in-nav-bar",
    "sort-tags",
    "update-route",
  ],
  sections: [
    "show-header",
    "show-info",
    "allow-server-selection",
    "allow-authentication",
    "allow-try",
    "show-curl-before-try",
    "show-components",
    "allow-search",
    "allow-spec-file-download",
    "mcp",
    "mock-server",
  ],
  mcp: [
    "mcp",
    "render-style",
    "theme",
    "show-info",
    "allow-server-selection",
    "allow-authentication",
    "allow-spec-file-download",
  ],
  none: [],
};

const ATTRIBUTE_ALIASES: Record<string, string> = {
  "font-size": "scale",
  "primary-color": "theme",
  "bg-color": "color-scheme",
  "nav-accent-color": "theme",
  "nav-logo": "slot-nav-logo",
  "fixed-header": "slot-fixed-header",
  default: "slot-default",
  "default-slot": "slot-default",
  "slot:nav-logo": "slot-nav-logo",
  "slot:fixed-header": "slot-fixed-header",
  "slot:default": "slot-default",
};

export function normalizePresets(
  preset?: ControllerPreset[] | ControllerPreset | string[] | string,
): string[] {
  if (!preset) return ["minimal"];
  const list = Array.isArray(preset) ? preset : [preset];
  return list.map((p) => PRESET_ALIASES[p] || p);
}

export function resolveControlKeys(
  propControls?: string[],
  preset: ControllerPreset[] | ControllerPreset | string[] | string = "minimal",
): string[] {
  if (propControls && propControls.length > 0) {
    return Array.from(new Set(propControls.map((k) => ATTRIBUTE_ALIASES[k] || k)));
  }
  const presetNames = normalizePresets(preset);
  const combined: string[] = [];
  for (const name of presetNames) {
    const list = PRESETS[name];
    if (list) {
      combined.push(...list);
    }
  }
  const isNone = presetNames.length === 1 && presetNames[0] === "none";
  if (combined.length === 0 && !isNone) {
    combined.push(...(PRESETS.minimal || []));
  }
  return Array.from(new Set(combined.map((k) => ATTRIBUTE_ALIASES[k] || k)));
}

export function resolveActiveControls(
  propControls?: string[],
  preset: ControllerPreset[] | ControllerPreset | string[] | string = "minimal",
): ControlDef[] {
  const activeKeys = resolveControlKeys(propControls, preset);
  return activeKeys.map((k) => CONTROL_REGISTRY[k]).filter((c): c is ControlDef => Boolean(c));
}

export function resolveActiveSlots(
  propControls?: string[],
  preset: ControllerPreset[] | ControllerPreset | string[] | string = "minimal",
): string[] {
  const activeKeys = resolveControlKeys(propControls, preset);
  const slots: string[] = [];
  if (activeKeys.includes("slot-nav-logo")) slots.push("nav-logo");
  if (activeKeys.includes("slot-fixed-header")) slots.push("fixed-header");
  if (activeKeys.includes("slot-default")) slots.push("default");
  return slots;
}

export function groupControlsByCategory(
  controls: ControlDef[],
  includeSlots: boolean = false,
): { id: ControlCategory; title: string; controls: ControlDef[] }[] {
  const categories = includeSlots ? CATEGORIES : CATEGORIES.filter((c) => c !== "Slots");
  return categories
    .map((cat) => ({
      id: cat,
      title: CATEGORY_TITLES[cat],
      controls: controls.filter((c) => c.category === cat),
    }))
    .filter((g) => g.controls.length > 0);
}

/**
 * How a list control is drawn, decided when the page is built so it never wraps: a segmented bar
 * when its values fit one row of the drawer, else a dropdown; and inline (the name on the left, the
 * control on the right) when both fit one row. Widths are estimates from the label lengths, at the
 * drawer's fixed font sizes, with some slack.
 */
export interface ControlLayout {
  kind: "bar" | "select";
  inline: boolean;
}

/** The drawer's content width (420px drawer, less its own and the card's padding), with slack. */
export const TUNER_ROW_WIDTH = 340;
/** Average character widths: values at 12px/500 sans, names at 12px/600 mono. */
const VALUE_CHAR = 6.8;
const NAME_CHAR = 7.3;
const SEGMENT_PADDING = 21;
/** The ⓘ icon after a name, and the gap between the name and an inline control. */
const NAME_EXTRA = 20 + 12;
const SELECT_EXTRA = 34;

export function barWidth(options: ControlOption[]): number {
  return options.reduce((sum, o) => sum + o.label.length * VALUE_CHAR + SEGMENT_PADDING, 1);
}

export function controlLayout(ctrl: SegmentedControl): ControlLayout {
  const name = ctrl.label.length * NAME_CHAR + NAME_EXTRA;
  // A colour bar's segments shrink to fit: always a bar, on its own row
  if (ctrl.options.some((o) => o.dotColor)) return { kind: "bar", inline: false };
  const bar = barWidth(ctrl.options);
  if (bar <= TUNER_ROW_WIDTH) return { kind: "bar", inline: name + bar <= TUNER_ROW_WIDTH };
  const select = Math.max(...ctrl.options.map((o) => o.label.length)) * VALUE_CHAR + SELECT_EXTRA;
  return { kind: "select", inline: name + select <= TUNER_ROW_WIDTH };
}
