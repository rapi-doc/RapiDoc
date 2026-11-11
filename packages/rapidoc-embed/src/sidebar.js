// What the documentation-site integrations share for their sidebars: the short label of an HTTP method and
// the CSS that draws it in RapiDoc's method colours. Each site draws its sidebar with its own theme, so
// the plugins only add a class to an operation's item; the selectors differ per theme and are passed in.
// Not part of the contract.

const LABELS = {
  get: "GET",
  post: "POST",
  put: "PUT",
  delete: "DEL",
  patch: "PATCH",
  head: "HEAD",
  options: "OPT",
  trace: "TRACE",
  query: "QUERY",
};

/** `--method-*` of <rapi-doc>'s themes: readable as text on a light and on a dark background. */
const COLORS = {
  light: {
    get: "#2563eb",
    post: "#047857",
    put: "#c2410c",
    delete: "#b91c1c",
    patch: "#7c3aed",
    head: "#b45309",
    options: "#0e7490",
    trace: "#be185d",
    query: "#4f46e5",
  },
  dark: {
    get: "#5c98f9",
    post: "#68cc97",
    put: "#f59e0b",
    delete: "#f75252",
    patch: "#a78bfa",
    head: "#eab308",
    options: "#06b6d4",
    trace: "#ec4899",
    query: "#818cf8",
  },
};

/** How a sidebar shows an operation's method: the values of <rapi-doc>'s `show-method-in-nav-bar`. */
export const SIDEBAR_METHOD_STYLES = [
  "false",
  "as-plain-text",
  "as-colored-text",
  "as-colored-block",
];
export const DEFAULT_SIDEBAR_METHODS = "as-colored-text";

/**
 * The `methods` option of a docs-site integration as one of SIDEBAR_METHOD_STYLES. `false` (or "false")
 * shows no method; `true` or nothing is the default, the method in its colour.
 */
export function sidebarMethods(value) {
  if (value === undefined || value === null || value === true) return DEFAULT_SIDEBAR_METHODS;
  const style = String(value);
  if (!SIDEBAR_METHOD_STYLES.includes(style)) {
    throw new TypeError(
      `rapidoc: "methods" is ${SIDEBAR_METHOD_STYLES.map((name) => `"${name}"`).join(", ")} or false, not "${style}"`,
    );
  }
  return style;
}

/** The methods that get a label and a colour. */
export const SIDEBAR_METHODS = Object.keys(LABELS);

/** `delete` → `DEL`: short enough to sit in front of a sidebar link. Empty for an unknown method. */
export function methodLabel(method) {
  return LABELS[String(method).toLowerCase()] ?? "";
}

/**
 * The class names of an operation's sidebar item: `rapidoc-op rapidoc-op--get`, plus
 * `rapidoc-op--deprecated`. `methods` (see sidebarMethods) leaves the method class out when "false", and
 * adds `rapidoc-op--plain` or `rapidoc-op--block` for the two styles other than the default.
 */
export function operationClass(operation, methods) {
  const method = String(operation.method ?? "").toLowerCase();
  const style = sidebarMethods(methods);
  const names = ["rapidoc-op"];
  if (LABELS[method] && style !== "false") {
    names.push(`rapidoc-op--${method}`);
    if (style === "as-plain-text") names.push("rapidoc-op--plain");
    if (style === "as-colored-block") names.push("rapidoc-op--block");
  }
  if (operation.deprecated) names.push("rapidoc-op--deprecated");
  return names.join(" ");
}

const LABEL_STYLE =
  "display:inline-block;min-width:3.4em;margin-inline-end:.4em;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.7em;font-weight:700;letter-spacing:.02em;line-height:1;vertical-align:.1em;text-decoration:none";

/**
 * CSS for the method labels and the deprecated mark.
 * @param {object} theme
 * @param {(className: string) => string} theme.label selector of the element (or pseudo-element) that
 *   shows the method, given the item's class: `(c) => \`a.${c}::before\`` draws it with generated content;
 *   a selector without `::before` or `::after` styles an element whose text is already the label
 * @param {(className: string) => string} theme.text selector of the link text, to strike it through when deprecated
 * @param {string} theme.dark selector that holds while the site is in dark mode, e.g. `[data-theme='dark']`
 * @param {string} [theme.active] selector of the label inside the current item, for a theme that fills
 *   the current item with a colour: the label then takes the item's text colour, to stay readable
 */
export function sidebarCss({ label, text, dark, active }) {
  // the text on a filled block is the page's background tone: white on the light colours, black on the dark
  const vars = (colors, blockText) =>
    [
      ...SIDEBAR_METHODS.map((method) => `--rapidoc-method-${method}:${colors[method]}`),
      `--rapidoc-method-block-text:${blockText}`,
    ].join(";");
  const generated = /::(before|after)$/.test(label("rapidoc-op"));
  const rules = [`:root{${vars(COLORS.light, "#fff")}}`, `${dark}{${vars(COLORS.dark, "#000")}}`];
  rules.push(`${label("rapidoc-op")}{${LABEL_STYLE}}`);
  for (const method of SIDEBAR_METHODS) {
    const content = generated ? `content:"${LABELS[method]}";` : "";
    rules.push(
      `${label(`rapidoc-op--${method}`)}{${content}--rapidoc-m:var(--rapidoc-method-${method});color:var(--rapidoc-m)}`,
    );
  }
  if (active) rules.push(`${active}{color:inherit}`);
  // after the colours, so they win: plain text, and a filled block
  rules.push(`${label("rapidoc-op--plain")}{color:inherit;opacity:.75}`);
  rules.push(
    `${label("rapidoc-op--block")}{background:var(--rapidoc-m);color:var(--rapidoc-method-block-text);padding:.3em .45em;border-radius:.3em;text-align:center}`,
  );
  rules.push(`${text("rapidoc-op--deprecated")}{text-decoration:line-through;opacity:.7}`);
  return rules.join("\n");
}
