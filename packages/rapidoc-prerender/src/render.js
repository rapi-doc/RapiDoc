/**
 * The renderers of @rapidoc/prerender: a whole reference, one operation, one schema.
 *
 * Runs seamlessly in Node.js >= 22, Bun, Astro, Nuxt, Next.js, and custom SSG scripts.
 */

// Safe idempotent customElements registry in pure Node/Bun/SSR environments
if (typeof globalThis.customElements === "undefined") {
  const registry = new Map();
  globalThis.customElements = {
    define: (name, constructor) => {
      registry.set(name, constructor);
    },
    get: (name) => registry.get(name),
    whenDefined: () => Promise.resolve(),
  };
} else if (globalThis.customElements && !globalThis.customElements.__safeDefinePatched) {
  const origDefine = globalThis.customElements.define;
  globalThis.customElements.define = function (name, constructor, options) {
    if (!this.get(name)) {
      try {
        origDefine.call(this, name, constructor, options);
      } catch {
        // Safe fallback if already registered in registry
      }
    }
  };
  globalThis.customElements.__safeDefinePatched = true;
}

if (
  typeof CustomElementRegistry !== "undefined" &&
  !CustomElementRegistry.prototype.__safeDefinePatched
) {
  const origProtoDefine = CustomElementRegistry.prototype.define;
  CustomElementRegistry.prototype.define = function (name, constructor, options) {
    if (!this.get(name)) {
      try {
        origProtoDefine.call(this, name, constructor, options);
      } catch {
        // Safe fallback if already registered in registry
      }
    }
  };
  CustomElementRegistry.prototype.__safeDefinePatched = true;
}

import ProcessSpec from "../../rapidoc/src/utils/spec-parser.js";
import mainBodyTemplate from "../../rapidoc/src/templates/main-body-template.js";
import { expandedEndpointBodyTemplate } from "../../rapidoc/src/templates/expanded-endpoint-template.js";
import { schemaToAST } from "../../rapidoc/src/utils/schema-utils.js";
import SchemaTable from "../../rapidoc/src/components/schema-table.ts";
import SchemaTree from "../../rapidoc/src/components/schema-tree.ts";
import { getBundledCss } from "../../rapidoc/src/styles/css-bundle.js";
import { DEFAULT_THEME } from "../../rapidoc/src/styles/theme-tokens.js";
import { parse as parseYaml } from "yaml";
import { renderTemplateToString, escapeHtml } from "./serializer.js";
import { SPEC_OPTIONS, isTrue, pick, readOptions, toAttributeName } from "./options.js";

const isHttpUrl = (text) => /^https?:\/\//i.test(text);
const isNode = typeof process !== "undefined" && Boolean(process.versions?.node);

/** JSON or YAML text as an object. Throws with the parser's message. */
function parseSpecText(text, label) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    try {
      parsed = parseYaml(text, { maxAliasCount: -1, merge: true });
    } catch (err) {
      throw new Error(
        `Cannot load the OpenAPI spec ${label}: it is not valid JSON or YAML (${err.message})`,
        {
          cause: err,
        },
      );
    }
  }
  if (!parsed || typeof parsed !== "object") {
    throw new Error(`Cannot load the OpenAPI spec ${label}: it is not an OpenAPI document`);
  }
  return parsed;
}

/** A local spec file as an object. Throws "file not found: <path>" when there is no such file. */
async function readSpecFile(location) {
  const fs = await import("node:fs");
  const filePath = location.startsWith("file:")
    ? (await import("node:url")).fileURLToPath(location)
    : location;
  if (!fs.existsSync(filePath)) {
    throw new Error(`Cannot load the OpenAPI spec: file not found: ${filePath}`);
  }
  let text;
  try {
    text = fs.readFileSync(filePath, "utf-8");
  } catch (err) {
    throw new Error(`Cannot load the OpenAPI spec ${filePath}: ${err.message}`, { cause: err });
  }
  return parseSpecText(text, filePath);
}

/** Why a spec URL could not be loaded, for the error: asked of the server again, after the parser failed. */
async function whyUrlFails(url, parserSaid) {
  let response;
  try {
    response = await fetch(url);
  } catch (err) {
    return `it could not be fetched (${err.cause?.message || err.message})`;
  }
  if (!response.ok) return `the server answered ${response.status} ${response.statusText}`.trim();
  try {
    parseSpecText(await response.text(), url);
  } catch (err) {
    return err.message.slice(err.message.lastIndexOf(": it is") + 2);
  }
  return /^\d+$|Not Found/.test(parserSaid)
    ? "it or a file it refers to could not be read"
    : parserSaid;
}

/**
 * Loads an OpenAPI spec and parses it into the model the templates render (not public API: its shape
 * follows the parser of packages/rapidoc).
 *
 * A string is a URL when it starts with `http://` or `https://`, spec text when it starts with `{` or
 * `[` or has more than one line, and otherwise the path of a local file (in Node and Bun). A spec that
 * cannot be loaded or parsed throws; a path that is not a file throws "file not found".
 *
 * @param {string|Object} specInput - URL, file path, JSON or YAML text, a spec object, or an already parsed model
 * @param {Object} [options] - The spec options (`sortTags`, `filterOperations`, `showUnusedTags`, ...)
 * @returns {Promise<Object>} The parsed model
 */
export async function resolveSpecInput(specInput, options) {
  if (!specInput) {
    throw new Error(
      "An OpenAPI spec is required: a file path, a URL, JSON or YAML text, or an object.",
    );
  }
  if (typeof specInput !== "string" && typeof specInput !== "object") {
    throw new TypeError("The OpenAPI spec must be a string or an object.");
  }

  // Already the parsed model
  if (typeof specInput === "object" && Array.isArray(specInput.securitySchemes)) {
    return specInput;
  }

  const o = readOptions("resolveSpecInput", options, { attributes: SPEC_OPTIONS });

  let rawSpec = specInput;
  let label = "(the object given)";
  if (typeof specInput === "string") {
    const trimmed = specInput.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[") || trimmed.includes("\n")) {
      label = "(the text given)";
      rawSpec = parseSpecText(trimmed, label);
    } else if (isHttpUrl(trimmed)) {
      label = trimmed;
      rawSpec = trimmed;
    } else if (isNode) {
      label = trimmed;
      rawSpec = await readSpecFile(trimmed);
    } else {
      // Not Node or Bun: there is no file system, so the parser fetches it
      label = trimmed;
      rawSpec = trimmed;
    }
  }

  const resolved = await ProcessSpec(
    rawSpec,
    isTrue(o.generateMissingTags),
    isTrue(o.sortTags),
    isTrue(o.sortSchemas),
    o.sortEndpointsBy ?? "none",
    o.apiKeyName ?? "",
    o.apiKeyLocation ?? "",
    o.apiKeyValue ?? "",
    o.serverUrl ?? "",
    o.filterOperations ?? "",
    isTrue(o.showUnusedTags),
  );

  // The parser reports a failure as a stub (what <rapi-doc> shows in the page); at build time it is an error
  if (!resolved || resolved.specLoadError) {
    const said = String(resolved?.info?.description || "").trim();
    let reason =
      said === "Invalid Spec Definition" || !said
        ? "it is not an OpenAPI document (no info, paths, components, servers or tags)"
        : said.split("┃").pop().trim();
    // The parser reports any failed fetch as 404; ask the server what really happened
    if (typeof rawSpec === "string" && isHttpUrl(rawSpec))
      reason = await whyUrlFails(rawSpec, reason);
    throw new Error(`Cannot load the OpenAPI spec ${label}: ${reason}`);
  }
  return resolved;
}

/** What `<rapi-doc>` uses when an attribute is not set; renderRapiDoc renders with the same values. */
const ELEMENT_DEFAULTS = {
  renderStyle: "read",
  layout: "row",
  theme: DEFAULT_THEME,
  colorScheme: "dark",
  showHeader: "true",
  showSideNav: "true",
  showInfo: "true",
  allowSearch: "true",
  allowAdvancedSearch: "true",
  allowServerSelection: "true",
  allowAuthentication: "true",
  allowTry: "true",
  schemaStyle: "tree",
  schemaExpandLevel: 99999,
  defaultSchemaTab: "example",
  pageDirection: "ltr",
};

/** Options of renderRapiDoc that are not attributes of <rapi-doc>. */
const RENDER_OWN_OPTIONS = [
  "spec",
  "outputMode",
  "includeStyles",
  "inlineSpec",
  "focusedElementId",
];

/**
 * Pre-renders a whole API reference.
 *
 * Output modes:
 * - 'dsd' (default): `<rapi-doc ...><template shadowrootmode="open">...</template></rapi-doc>`, which
 *   the element takes over when its script loads. Only the options the caller passed are written as
 *   attributes, so for the rest the element's own defaults apply, and the HTML is rendered with those
 *   same defaults.
 * - 'html' / 'light': plain light-DOM HTML in `<div class="rapidoc-prerender-container">`.
 *
 * Besides the options below, any attribute of `<rapi-doc>` is accepted (camelCase or kebab-case) and
 * written to the element, so an unknown option name is not an error here.
 *
 * @param {Object} options
 * @param {string|Object} options.spec - File path, URL, JSON or YAML text, or object
 * @param {'read'|'view'|'focused'} [options.renderStyle='read']
 * @param {string} [options.theme='amber'] - A preset ('ember', 'carbon', 'cobalt', 'jade', 'indigo', 'amber') or a hex color
 * @param {'dark'|'light'|'system'|'auto'} [options.colorScheme='dark']
 * @param {'row'|'column'} [options.layout='row']
 * @param {boolean|string} [options.showHeader=true]
 * @param {boolean|string} [options.showSideNav=true]
 * @param {boolean|string} [options.showInfo=true]
 * @param {boolean|string} [options.allowSearch=true]
 * @param {boolean|string} [options.allowAdvancedSearch=true]
 * @param {boolean|string} [options.allowServerSelection=true]
 * @param {boolean|string} [options.allowAuthentication=true]
 * @param {boolean|string} [options.allowTry=true]
 * @param {'tree'|'table'} [options.schemaStyle='tree']
 * @param {number} [options.schemaExpandLevel=99999]
 * @param {'example'|'schema'} [options.defaultSchemaTab='example']
 * @param {'dsd'|'html'|'light'} [options.outputMode='dsd']
 * @param {boolean} [options.includeStyles=true] - Inline the element's CSS in the output
 * @param {boolean} [options.inlineSpec=true] - Inline an object `spec` for the element (DSD)
 * @param {string} [options.focusedElementId] - The operation shown first in focused mode
 * @returns {Promise<string>} HTML
 */
export async function renderRapiDoc(options) {
  const o = readOptions("renderRapiDoc", options, {
    own: RENDER_OWN_OPTIONS,
    attributes: [...Object.keys(ELEMENT_DEFAULTS), ...SPEC_OPTIONS],
    passThrough: true,
  });
  const { spec, outputMode = "dsd", includeStyles = true, inlineSpec = true } = o;

  // What the caller passed for the element: booleans as the attribute's text
  const passed = {};
  for (const [name, value] of Object.entries(o)) {
    if (!RENDER_OWN_OPTIONS.includes(name)) {
      passed[name] = typeof value === "boolean" ? String(value) : value;
    }
  }
  const settings = { ...ELEMENT_DEFAULTS, ...passed };
  const { renderStyle, layout, theme, colorScheme, schemaStyle } = settings;

  const resolvedSpec = await resolveSpecInput(spec, pick(o, SPEC_OPTIONS));

  const context = {
    ...settings,
    resolvedSpec,
    config: {
      renderStyle,
      schemaStyle,
      schemaExpandLevel: settings.schemaExpandLevel,
      defaultSchemaTab: settings.defaultSchemaTab,
      allowTry: settings.allowTry,
    },
    selectedServer: resolvedSpec.servers?.[0],
    focusedElementId:
      o.focusedElementId ||
      (settings.showInfo === "false"
        ? resolvedSpec.tags?.[0]?.paths?.[0]?.elementId || ""
        : "overview"),
    handleHref: () => {},
  };

  const templateResult = mainBodyTemplate.call(context);
  const serializedBody = renderTemplateToString(templateResult);

  if (outputMode === "html" || outputMode === "light") {
    const scopeClass = "rapidoc-prerender-container";
    const cssText = includeStyles
      ? `<style>${getBundledCss({ scope: `.${scopeClass}` })}</style>`
      : "";
    return `<div class="${scopeClass}" data-theme="${escapeHtml(theme)}" data-color-scheme="${escapeHtml(colorScheme)}" data-render-style="${escapeHtml(renderStyle)}" data-layout="${escapeHtml(layout)}" data-schema-style="${escapeHtml(schemaStyle)}">
${cssText}
${serializedBody}
</div>`;
  }

  // Default: Declarative Shadow DOM (DSD)
  const cssText = includeStyles ? `<style>${getBundledCss()}</style>` : "";
  const specScript =
    inlineSpec !== false && typeof spec === "object" && spec !== null
      ? `  <script type="application/json" slot="rapidoc-spec">${JSON.stringify(spec).replace(/</g, "\\u003c")}</script>\n`
      : "";

  // Only what the caller passed: for everything else the element's defaults apply, as rendered above
  const attrsMap = new Map();
  for (const [name, value] of Object.entries(passed)) {
    attrsMap.set(toAttributeName(name), String(value));
  }
  if (typeof spec === "string" && isHttpUrl(spec.trim())) {
    attrsMap.set("spec-url", spec.trim());
  }

  const attrsString = Array.from(attrsMap.entries())
    .map(([name, value]) => ` ${name}="${escapeHtml(value)}"`)
    .join("");

  return `<rapi-doc${attrsString}>
${specScript}  <template shadowrootmode="open">
${cssText}
${serializedBody}
  </template>
</rapi-doc>`;
}

/**
 * Pre-renders one operation as light-DOM HTML with its own styles, for a guide or a blog post.
 *
 * @param {Object} options
 * @param {string|Object} options.spec - File path, URL, JSON or YAML text, or object
 * @param {string} options.path - The operation's path (e.g. '/pet/{petId}'), matched exactly
 * @param {string} options.method - The HTTP method, in any case
 * @param {'read'|'view'} [options.renderStyle='read']
 * @param {'row'|'column'} [options.layout='column']
 * @param {string} [options.theme='amber'] - A preset or a hex color
 * @param {'dark'|'light'|'system'} [options.colorScheme='dark']
 * @param {boolean} [options.includeStyles=true] - Prepend the scoped CSS
 * @param {boolean|string} [options.allowTry=false]
 * @param {'table'|'tree'} [options.schemaStyle='table']
 * @returns {Promise<string>} HTML
 */
export async function renderEndpoint(options) {
  const o = readOptions("renderEndpoint", options, {
    own: ["spec", "path", "method", "includeStyles"],
    attributes: [
      "renderStyle",
      "layout",
      "theme",
      "colorScheme",
      "allowTry",
      "schemaStyle",
      ...SPEC_OPTIONS,
    ],
  });
  const {
    spec,
    path: targetPathStr,
    method: targetMethodStr,
    renderStyle = "read",
    layout = "column",
    theme = DEFAULT_THEME,
    colorScheme = "dark",
    includeStyles = true,
    allowTry = false,
    schemaStyle = "table",
  } = o;

  if (!targetPathStr || !targetMethodStr) {
    throw new Error("Both `path` and `method` are required for renderEndpoint().");
  }

  const normalizedMethod = targetMethodStr.toLowerCase().trim();
  const resolvedSpec = await resolveSpecInput(spec, pick(o, SPEC_OPTIONS));

  // Search across tags for matching operation
  let matchedPath = null;
  let matchedTagName = "";
  let matchedTagDescription = "";
  let isFirstOperation = false;

  for (const tag of resolvedSpec.tags || []) {
    const foundIdx = (tag.paths || []).findIndex(
      (p) => p.path === targetPathStr && p.method.toLowerCase() === normalizedMethod,
    );
    if (foundIdx !== -1) {
      matchedPath = tag.paths[foundIdx];
      matchedTagName = tag.name;
      matchedTagDescription = tag.description || "";
      isFirstOperation = foundIdx === 0;
      break;
    }
  }

  if (!matchedPath) {
    throw new Error(
      `Endpoint not found in spec: ${targetMethodStr.toUpperCase()} ${targetPathStr}`,
    );
  }

  const context = {
    resolvedSpec,
    renderStyle,
    layout,
    theme,
    colorScheme,
    fillRequestFieldsWithExample: "true",
    allowTry: String(allowTry),
    config: {
      renderStyle,
      schemaStyle,
      allowTry: String(allowTry),
    },
    selectedServer: resolvedSpec.servers?.[0],
  };

  const renderedTemplate = expandedEndpointBodyTemplate.call(
    context,
    matchedPath,
    matchedTagName,
    matchedTagDescription,
    isFirstOperation,
  );
  const serializedHtml = renderTemplateToString(renderedTemplate);

  const containerClass = "rapidoc-endpoint-container";
  const cssText = includeStyles
    ? `<style>${getBundledCss({ scope: `.${containerClass}` })}</style>`
    : "";

  return `<div class="${containerClass} ${escapeHtml(renderStyle)}-mode" data-theme="${escapeHtml(theme)}" data-color-scheme="${escapeHtml(colorScheme)}">
${cssText}
${serializedHtml}
</div>`;
}

/**
 * Pre-renders one schema as light-DOM HTML with its own styles.
 *
 * @param {Object} options
 * @param {Object|string} options.schema - A JSON Schema object, or a name under `components.schemas` of `spec`
 * @param {Object|string} [options.spec] - The spec a schema name is looked up in
 * @param {'table'|'tree'} [options.schemaStyle='table']
 * @param {number} [options.schemaExpandLevel=99999] - How many levels start expanded
 * @param {string} [options.theme='amber'] - A preset or a hex color
 * @param {'dark'|'light'|'system'} [options.colorScheme='dark']
 * @param {boolean} [options.includeStyles=true] - Prepend the scoped CSS
 * @returns {Promise<string>} HTML
 */
export async function renderSchema(options) {
  const {
    schema,
    spec,
    schemaStyle = "table",
    schemaExpandLevel = 99999,
    theme = DEFAULT_THEME,
    colorScheme = "dark",
    includeStyles = true,
  } = readOptions("renderSchema", options, {
    own: ["schema", "spec", "includeStyles"],
    attributes: ["schemaStyle", "schemaExpandLevel", "theme", "colorScheme"],
  });

  let resolvedSchema = schema;

  if (typeof schema === "string") {
    if (!spec) {
      throw new Error(`When schema is a string name ('${schema}'), options.spec must be provided.`);
    }
    const resolvedSpec = await resolveSpecInput(spec);
    let schemaObj = (typeof spec === "object" && spec.components?.schemas?.[schema]) || null;
    if (!schemaObj) {
      const schemasGroup = (resolvedSpec.components || []).find((c) => c.name === "Schemas");
      const found = (schemasGroup?.subComponents || []).find((sc) => sc.name === schema);
      schemaObj = found?.component;
    }
    if (!schemaObj) {
      throw new Error(`Schema '${schema}' not found in spec components.schemas.`);
    }
    resolvedSchema = schemaObj;
  }

  if (!resolvedSchema || typeof resolvedSchema !== "object") {
    throw new Error("Invalid schema provided to renderSchema().");
  }

  const ast = schemaToAST(resolvedSchema);
  const view = schemaStyle === "tree" ? new SchemaTree() : new SchemaTable();
  view.data = ast;
  view.schemaExpandLevel = schemaExpandLevel;
  const serializedHtml = renderTemplateToString(view.render());

  const containerClass = "rapidoc-schema-container";
  const cssText = includeStyles
    ? `<style>${getBundledCss({ scope: `.${containerClass}` })}</style>`
    : "";

  return `<div class="${containerClass}" data-theme="${escapeHtml(theme)}" data-color-scheme="${escapeHtml(colorScheme)}">
${cssText}
${serializedHtml}
</div>`;
}
