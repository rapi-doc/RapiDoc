/**
 * Framework-agnostic static pre-rendering engine for RapiDoc.
 *
 * Runs seamlessly in Node.js >= 22, Bun, Astro, Nuxt, Next.js, and custom SSG scripts.
 */

// Safe idempotent customElements registry in pure Node/Bun/SSR environments
if (typeof globalThis.customElements === 'undefined') {
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

if (typeof CustomElementRegistry !== 'undefined' && !CustomElementRegistry.prototype.__safeDefinePatched) {
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

import ProcessSpec from '../utils/spec-parser.js';
import mainBodyTemplate from '../templates/main-body-template.js';
import { expandedEndpointBodyTemplate } from '../templates/expanded-endpoint-template.js';
import { schemaToAST } from '../utils/schema-utils.js';
import SchemaTable from '../components/schema-table.ts';
import SchemaTree from '../components/schema-tree.ts';
import { getBundledCss } from '../styles/css-bundle.js';
import { renderTemplateToString, escapeHtml } from './serializer.js';

function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function toCamelCase(str) {
  return str.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

/**
 * Resolves an OpenAPI specification from a file path, URL, JSON/YAML string, or JS object.
 *
 * @param {string|Object} specInput
 * @param {Object} [options]
 * @returns {Promise<Object>} Fully parsed and dereferenced OpenAPI specification
 */
export async function resolveSpecInput(specInput, options = {}) {
  if (!specInput) {
    throw new Error('OpenAPI specification input is required (file path, URL, string, or object).');
  }

  // Already resolved/parsed spec object (from ProcessSpec)
  if (typeof specInput === 'object' && specInput !== null && Array.isArray(specInput.securitySchemes)) {
    return specInput;
  }

  let rawSpec = specInput;

  if (typeof specInput === 'string') {
    const trimmed = specInput.trim();

    // Check if it's inlined JSON or multiline YAML
    if (trimmed.startsWith('{') || trimmed.startsWith('[') || trimmed.includes('\n')) {
      try {
        rawSpec = JSON.parse(trimmed);
      } catch {
        rawSpec = trimmed;
      }
    } else if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      // Local file path in Node.js / Bun
      if (typeof process !== 'undefined' && process.versions?.node) {
        try {
          const fs = await import('node:fs');
          if (fs.existsSync(trimmed)) {
            const content = fs.readFileSync(trimmed, 'utf-8');
            try {
              rawSpec = JSON.parse(content);
            } catch {
              rawSpec = content;
            }
          }
        } catch {
          // If filesystem read fails, fall through to default loader
        }
      }
    }
  }

  return ProcessSpec(
    rawSpec,
    options.generateMissingTags ?? options['generate-missing-tags'] ?? false,
    options.sortTags ?? options['sort-tags'] ?? false,
    options.sortSchemas ?? options['sort-schemas'] ?? false,
    options.sortEndpointsBy ?? options['sort-endpoints-by'] ?? 'none',
    options.apiKey ?? options.apiKeyName ?? options['api-key-name'] ?? '',
    options.apiKeyLocation ?? options['api-key-location'] ?? '',
    options.apiKeyValue ?? options['api-key-value'] ?? '',
    options.serverUrl ?? options['server-url'] ?? '',
    options.matchPaths ?? options['match-paths'] ?? '',
    options.matchType ?? options['match-type'] ?? '',
    options.removeEndpointsWithBadgeLabelAs ?? options['remove-endpoints-with-badge-label-as'] ?? ''
  );
}

/**
 * Pre-renders an entire OpenAPI documentation page into static HTML.
 *
 * Supported output modes:
 * - 'dsd' (default): Declarative Shadow DOM `<rapi-doc><template shadowrootmode="open">...</template></rapi-doc>`.
 *   Delivers zero FOUC, instant first paint, and automatic hydration when client bundle loads.
 * - 'html' / 'light': Semantic Light DOM `<div class="rapidoc-static-container">...</div>`.
 *
 * @param {Object} options
 * @param {string|Object} options.spec - Specification file path, URL, raw string, or parsed object
 * @param {'read'|'view'|'focused'} [options.renderStyle='read'] - Layout style
 * @param {string} [options.theme='amber'] - Theme preset ('amber', 'blue', 'emerald', 'violet', etc.) or hex
 * @param {'dark'|'light'|'system'} [options.colorScheme='dark'] - Color scheme
 * @param {'row'|'column'} [options.layout] - Layout orientation ('column' default for read/focused, 'row' for view)
 * @param {boolean|string} [options.showHeader=true] - Whether to render top header
 * @param {boolean|string} [options.showSideNav=true] - Whether to render sidebar navigation
 * @param {boolean|string} [options.showInfo=true] - Whether to render spec overview & info
 * @param {boolean|string} [options.allowSearch=true] - Whether search is available
 * @param {boolean|string} [options.allowAdvancedSearch=false] - Whether advanced search dialog is pre-rendered
 * @param {boolean|string} [options.allowServerSelection=true] - Whether to show server selection
 * @param {boolean|string} [options.allowAuthentication=true] - Whether to render auth security schemes
 * @param {boolean|string} [options.allowTry=true] - Whether try-it console is included
 * @param {'table'|'tree'} [options.schemaStyle='table'] - Default schema display style
 * @param {number} [options.schemaExpandLevel=99999] - Schema nesting expansion level
 * @param {'example'|'schema'} [options.defaultSchemaTab='example'] - Active tab in schema views
 * @param {'dsd'|'html'|'light'} [options.outputMode='dsd'] - Pre-rendered container mode
 * @param {boolean} [options.includeStyles=true] - Whether to include bundled CSS in the output
 * @returns {Promise<string>} Fully rendered static HTML string
 */
export async function renderRapiDoc(options = {}) {
  // Normalize option names to support both camelCase and kebab-case
  const normalized = {};
  for (const [key, val] of Object.entries(options)) {
    normalized[key] = val;
    normalized[toCamelCase(key)] = val;
  }

  const spec = options.spec ?? normalized.spec;
  const renderStyle = normalized.renderStyle ?? 'read';
  const theme = normalized.theme ?? 'amber';
  const colorScheme = normalized.colorScheme ?? 'dark';
  const showHeader = normalized.showHeader ?? true;
  const showSideNav = normalized.showSideNav ?? true;
  const showInfo = normalized.showInfo ?? true;
  const allowSearch = normalized.allowSearch ?? true;
  const allowAdvancedSearch = normalized.allowAdvancedSearch ?? false;
  const allowServerSelection = normalized.allowServerSelection ?? true;
  const allowAuthentication = normalized.allowAuthentication ?? true;
  const allowTry = normalized.allowTry ?? true;
  const schemaStyle = normalized.schemaStyle ?? 'table';
  const schemaExpandLevel = normalized.schemaExpandLevel ?? 99999;
  const defaultSchemaTab = normalized.defaultSchemaTab ?? 'example';
  const outputMode = normalized.outputMode ?? 'dsd';
  const includeStyles = normalized.includeStyles ?? true;
  const pageDirection = normalized.pageDirection ?? 'ltr';

  const defaultLayout = renderStyle === 'read' || renderStyle === 'focused' ? 'column' : 'row';
  const layout = normalized.layout || defaultLayout;

  const resolvedSpec = await resolveSpecInput(spec, normalized);

  const INTERNAL_KEYS = new Set(['spec', 'outputMode', 'includeStyles', 'inlineSpec', 'focusedElementId']);

  // Pass any custom options into the template context
  const customContextProps = {};
  for (const [key, val] of Object.entries(normalized)) {
    if (!INTERNAL_KEYS.has(key) && val !== undefined && val !== null) {
      customContextProps[key] = typeof val === 'boolean' ? String(val) : val;
    }
  }

  const context = {
    ...customContextProps,
    resolvedSpec,
    renderStyle,
    layout,
    theme,
    colorScheme,
    showHeader: String(showHeader),
    showSideNav: String(showSideNav),
    showInfo: String(showInfo),
    allowSearch: String(allowSearch),
    allowAdvancedSearch: String(allowAdvancedSearch),
    allowServerSelection: String(allowServerSelection),
    allowAuthentication: String(allowAuthentication),
    allowTry: String(allowTry),
    schemaStyle,
    schemaExpandLevel,
    defaultSchemaTab,
    pageDirection,
    config: {
      renderStyle,
      schemaStyle,
      schemaExpandLevel,
      defaultSchemaTab,
      allowTry: String(allowTry),
    },
    matchPaths: normalized.matchPaths || '',
    selectedServer: resolvedSpec.servers?.[0],
    focusedElementId:
      options.focusedElementId ||
      (showInfo === 'false' || showInfo === false ? resolvedSpec.tags?.[0]?.paths?.[0]?.elementId || '' : 'overview'),
    handleHref: () => {},
  };

  const templateResult = mainBodyTemplate.call(context);
  const serializedBody = renderTemplateToString(templateResult);

  if (outputMode === 'html' || outputMode === 'light') {
    const scopeClass = 'rapidoc-static-container';
    const cssText = includeStyles ? `<style>${getBundledCss({ theme, colorScheme, scope: `.${scopeClass}` })}</style>` : '';
    return `<div class="${scopeClass}" data-theme="${escapeHtml(theme)}" data-color-scheme="${escapeHtml(colorScheme)}" data-render-style="${escapeHtml(renderStyle)}" data-layout="${escapeHtml(layout)}" data-schema-style="${escapeHtml(schemaStyle)}">
${cssText}
${serializedBody}
</div>`;
  }

  // Default: Declarative Shadow DOM (DSD)
  const cssText = includeStyles ? `<style>${getBundledCss({ theme, colorScheme })}</style>` : '';
  const specScript =
    options.inlineSpec !== false && typeof spec === 'object' && spec !== null
      ? `  <script type="application/json" slot="rapidoc-spec">${JSON.stringify(spec).replace(/<\/script/gi, '<\\/script')}</script>\n`
      : '';

  // Construct complete attributes map to ensure exact client hydration parity
  const attrsMap = new Map();
  attrsMap.set('theme', theme);
  attrsMap.set('color-scheme', colorScheme);
  attrsMap.set('render-style', renderStyle);
  attrsMap.set('layout', layout);
  attrsMap.set('schema-style', schemaStyle);
  attrsMap.set('schema-expand-level', String(schemaExpandLevel));
  attrsMap.set('default-schema-tab', defaultSchemaTab);
  attrsMap.set('show-header', String(showHeader));
  attrsMap.set('show-side-nav', String(showSideNav));
  attrsMap.set('show-info', String(showInfo));
  attrsMap.set('allow-search', String(allowSearch));
  attrsMap.set('allow-advanced-search', String(allowAdvancedSearch));
  attrsMap.set('allow-server-selection', String(allowServerSelection));
  attrsMap.set('allow-authentication', String(allowAuthentication));
  attrsMap.set('allow-try', String(allowTry));
  attrsMap.set('page-direction', pageDirection);

  // Reflect any additional user-provided options to custom element attributes (converted to kebab-case)
  for (const [key, val] of Object.entries(options)) {
    const camel = toCamelCase(key);
    if (!INTERNAL_KEYS.has(camel) && !INTERNAL_KEYS.has(key) && val !== undefined && val !== null) {
      const kebab = toKebabCase(camel);
      attrsMap.set(kebab, typeof val === 'boolean' ? String(val) : String(val));
    }
  }

  if (typeof spec === 'string' && (spec.startsWith('http://') || spec.startsWith('https://'))) {
    attrsMap.set('spec-url', spec);
  }

  const attrsString = Array.from(attrsMap.entries())
    .map(([name, value]) => `${name}="${escapeHtml(value)}"`)
    .join(' ');

  return `<rapi-doc ${attrsString}>
${specScript}  <template shadowrootmode="open">
${cssText}
${serializedBody}
  </template>
</rapi-doc>`;
}

/**
 * Pre-renders a single isolated endpoint / operation into static HTML.
 * Ideal for embedding individual API operations in Markdown/MDX guides (Cosmo Cargo / Zudoku style).
 *
 * @param {Object} options
 * @param {string|Object} options.spec - Specification file path, URL, raw string, or parsed object
 * @param {string} options.path - Operation path (e.g. '/v1/shipments' or '/pet/{petId}')
 * @param {string} options.method - HTTP method ('get', 'post', 'put', 'delete', etc.)
 * @param {'read'|'view'} [options.renderStyle='read'] - Layout style
 * @param {'row'|'column'} [options.layout='column'] - Layout orientation
 * @param {string} [options.theme='amber'] - Theme preset name or hex
 * @param {'dark'|'light'|'system'} [options.colorScheme='dark'] - Color scheme
 * @param {boolean} [options.includeStyles=true] - Whether to prepend scoped CSS
 * @returns {Promise<string>} Rendered HTML string of the isolated endpoint
 */
export async function renderEndpoint(options = {}) {
  const {
    spec,
    path: targetPathStr,
    method: targetMethodStr,
    renderStyle = 'read',
    layout = 'column',
    theme = 'amber',
    colorScheme = 'dark',
    includeStyles = true,
    allowTry = false,
  } = options;

  if (!targetPathStr || !targetMethodStr) {
    throw new Error('Both `path` and `method` are required for renderEndpoint().');
  }

  const normalizedMethod = targetMethodStr.toLowerCase().trim();
  const resolvedSpec = await resolveSpecInput(spec, options);

  // Search across tags for matching operation
  let matchedPath = null;
  let matchedTagName = '';
  let matchedTagDescription = '';
  let isFirstOperation = false;

  for (const tag of resolvedSpec.tags || []) {
    const foundIdx = (tag.paths || []).findIndex((p) => p.path === targetPathStr && p.method.toLowerCase() === normalizedMethod);
    if (foundIdx !== -1) {
      matchedPath = tag.paths[foundIdx];
      matchedTagName = tag.name;
      matchedTagDescription = tag.description || '';
      isFirstOperation = foundIdx === 0;
      break;
    }
  }

  if (!matchedPath) {
    throw new Error(`Endpoint not found in spec: ${targetMethodStr.toUpperCase()} ${targetPathStr}`);
  }

  const context = {
    resolvedSpec,
    renderStyle,
    layout,
    theme,
    colorScheme,
    fillRequestFieldsWithExample: 'true',
    allowTry: String(allowTry),
    config: {
      renderStyle,
      schemaStyle: options.schemaStyle || 'table',
      allowTry: String(allowTry),
    },
    selectedServer: resolvedSpec.servers?.[0],
  };

  const renderedTemplate = expandedEndpointBodyTemplate.call(context, matchedPath, matchedTagName, matchedTagDescription, isFirstOperation);
  const serializedHtml = renderTemplateToString(renderedTemplate);

  const containerClass = 'rapidoc-endpoint-container';
  const cssText = includeStyles ? `<style>${getBundledCss({ theme, colorScheme, scope: `.${containerClass}` })}</style>` : '';

  return `<div class="${containerClass} ${renderStyle}-mode" data-theme="${theme}" data-color-scheme="${colorScheme}">
${cssText}
${serializedHtml}
</div>`;
}

/**
 * Pre-renders an isolated JSON Schema or component schema into static HTML.
 *
 * @param {Object} options
 * @param {Object|string} options.schema - JSON Schema object, or name of schema in `components.schemas`
 * @param {Object|string} [options.spec] - Optional OpenAPI spec to resolve schema names against
 * @param {'table'|'tree'} [options.style='table'] - Display style ('table' or 'tree')
 * @param {number} [options.schemaExpandLevel=99999] - Level of initial property expansion
 * @param {string} [options.theme='amber'] - Theme preset name or hex
 * @param {'dark'|'light'|'system'} [options.colorScheme='dark'] - Color scheme
 * @param {boolean} [options.includeStyles=true] - Whether to prepend scoped CSS
 * @returns {Promise<string>} Rendered schema HTML string
 */
export async function renderSchema(options = {}) {
  const { schema, spec, style = 'table', schemaExpandLevel = 99999, theme = 'amber', colorScheme = 'dark', includeStyles = true } = options;

  let resolvedSchema = schema;

  if (typeof schema === 'string') {
    if (!spec) {
      throw new Error(`When schema is a string name ('${schema}'), options.spec must be provided.`);
    }
    const resolvedSpec = await resolveSpecInput(spec);
    let schemaObj = (typeof spec === 'object' && spec.components?.schemas?.[schema]) || null;
    if (!schemaObj) {
      const schemasGroup = (resolvedSpec.components || []).find((c) => c.name === 'Schemas');
      const found = (schemasGroup?.subComponents || []).find((sc) => sc.name === schema);
      schemaObj = found?.component;
    }
    if (!schemaObj) {
      throw new Error(`Schema '${schema}' not found in spec components.schemas.`);
    }
    resolvedSchema = schemaObj;
  }

  if (!resolvedSchema || typeof resolvedSchema !== 'object') {
    throw new Error('Invalid schema provided to renderSchema().');
  }

  const ast = schemaToAST(resolvedSchema);
  let renderedTemplate;

  if (style === 'tree') {
    const tree = new SchemaTree();
    tree.data = ast;
    tree.schemaExpandLevel = schemaExpandLevel;
    renderedTemplate = tree.render();
  } else {
    const table = new SchemaTable();
    table.data = ast;
    table.schemaExpandLevel = schemaExpandLevel;
    renderedTemplate = table.render();
  }

  const serializedHtml = renderTemplateToString(renderedTemplate);
  const containerClass = 'rapidoc-schema-container';
  const cssText = includeStyles ? `<style>${getBundledCss({ theme, colorScheme, scope: `.${containerClass}` })}</style>` : '';

  return `<div class="${containerClass}" data-theme="${theme}" data-color-scheme="${colorScheme}">
${cssText}
${serializedHtml}
</div>`;
}

export default {
  resolveSpecInput,
  renderRapiDoc,
  renderEndpoint,
  renderSchema,
};
