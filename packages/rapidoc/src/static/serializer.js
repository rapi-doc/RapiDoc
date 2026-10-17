/**
 * Isomorphic HTML serializer for Lit TemplateResult in Node.js, Bun, and SSR/SSG runtimes.
 *
 * Flattens declarative Lit templates into pure, static HTML strings without requiring
 * a browser window, headless browser, or full DOM emulator (JSDOM/HappyDOM).
 */

// Minimal polyfill for customElements registry in pure Node/Bun environments
if (typeof globalThis.customElements === 'undefined') {
  globalThis.customElements = {
    define: () => {},
    get: () => undefined,
    whenDefined: () => Promise.resolve(),
  };
}

/**
 * Escapes characters for HTML text nodes and attribute values to prevent injection.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/**
 * Recursively serializes a Lit TemplateResult, directive, CSSResult, primitive, or array
 * into a pure static HTML string.
 *
 * - Event listeners (`@click="..."`) are stripped.
 * - Non-attribute property bindings (`.prop="..."`) are stripped.
 * - Boolean attributes (`?disabled="..."`) are converted to standard HTML attributes if truthy, or omitted if falsy.
 * - Lit directives (`unsafeHTML`, `ifDefined`, `guard`) are evaluated transparently.
 * - CSSResult instances (`css\`...\``) are resolved via their `.cssText` property.
 *
 * @param {any} result - The value or TemplateResult to serialize.
 * @param {Object} [options]
 * @param {boolean} [options.stripComments=false] - Whether to strip HTML comments.
 * @returns {string} Serialized HTML string.
 */
export function renderTemplateToString(result, options = {}) {
  if (result == null || result === false) {
    return '';
  }

  if (typeof result === 'string') {
    return result;
  }

  if (typeof result === 'number' || typeof result === 'bigint') {
    return String(result);
  }

  if (typeof result === 'symbol') {
    return '';
  }

  if (Array.isArray(result)) {
    return result.map((item) => renderTemplateToString(item, options)).join('');
  }

  // Handle Lit CSSResult
  if (typeof result === 'object' && result.cssText) {
    return result.cssText;
  }

  // Handle Lit directives (unsafeHTML, guard, ifDefined)
  if (typeof result === 'object' && result._$litDirective$) {
    // guard([deps], () => fn)
    if (result.values && typeof result.values[1] === 'function') {
      return renderTemplateToString(result.values[1](), options);
    }
    // unsafeHTML(str)
    if (result.values && result.values.length > 0) {
      return renderTemplateToString(result.values[0], options);
    }
    return '';
  }

  // Handle Lit TemplateResult
  if (typeof result === 'object' && 'strings' in result && 'values' in result) {
    let out = '';
    let skipNextLeadingQuote = false;

    for (let i = 0; i < result.strings.length; i++) {
      let str = result.strings[i];

      // Strip matching quote from previous expression if skipped
      if (skipNextLeadingQuote) {
        if (str.startsWith('"') || str.startsWith("'")) {
          str = str.slice(1);
        }
        skipNextLeadingQuote = false;
      }

      if (i < result.values.length) {
        const val = result.values[i];

        // 1. Event bindings: e.g. @click="..." or @click=...
        const eventMatch = str.match(/@([\w.-]+)=(["']?)$/);
        if (eventMatch) {
          str = str.slice(0, eventMatch.index).trimEnd();
          if (eventMatch[2]) {
            skipNextLeadingQuote = true;
          }
          out += str;
          continue;
        }

        // 2. Property bindings: e.g. .config="..." or .config=...
        const propMatch = str.match(/\.([\w.-]+)=(["']?)$/);
        if (propMatch) {
          str = str.slice(0, propMatch.index).trimEnd();
          if (propMatch[2]) {
            skipNextLeadingQuote = true;
          }
          out += str;
          continue;
        }

        // 3. Boolean attributes: e.g. ?disabled="..." or ?disabled=...
        const boolMatch = str.match(/\?([\w.-]+)=(["']?)$/);
        if (boolMatch) {
          const attrName = boolMatch[1];
          const hasQuote = Boolean(boolMatch[2]);
          str = str.slice(0, boolMatch.index).trimEnd();
          if (hasQuote) {
            skipNextLeadingQuote = true;
          }
          const isTruthy = Boolean(val && val !== 'false');
          out += str + (isTruthy ? ` ${attrName}` : '');
          continue;
        }

        // 4. Regular attribute or text node
        out += str;
        out += renderTemplateToString(val, options);
      } else {
        out += str;
      }
    }

    if (options.stripComments) {
      out = out.replace(/<!--[\s\S]*?-->/g, '');
    }

    return out;
  }

  return '';
}

export default renderTemplateToString;
