/**
 * Isomorphic HTML serializer for Lit TemplateResult in Node.js, Bun, and SSR/SSG runtimes.
 *
 * Flattens declarative Lit templates into pure, static HTML strings without requiring
 * a browser window, headless browser, or full DOM emulator (JSDOM/HappyDOM).
 */

// Minimal polyfill for customElements registry in pure Node/Bun environments
if (typeof globalThis.customElements === "undefined") {
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
  if (typeof str !== "string") return String(str ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Escapes characters for HTML text nodes (quotes are left as is, since they are inert in text).
 * @param {string} str
 * @returns {string}
 */
function escapeText(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Directives whose value is inserted as markup, matching Lit's behavior in the browser.
 * Matched by the static `directiveName` (survives minification, unlike class names).
 */
const RAW_MARKUP_DIRECTIVES = new Set(["unsafeHTML", "unsafeSVG"]);

/**
 * Recursively serializes a Lit TemplateResult, directive, CSSResult, primitive, or array
 * into a pure static HTML string.
 *
 * - Event listeners (`@click="..."`) are stripped.
 * - Non-attribute property bindings (`.prop="..."`) are stripped.
 * - Boolean attributes (`?disabled="..."`) are converted to standard HTML attributes if truthy, or omitted if falsy.
 * - Strings from plain bindings are HTML-escaped, as Lit does in the browser (`&<>` in text,
 *   plus quotes in attribute values). Unquoted attribute bindings (`value=${x}`) are quoted.
 * - Lit directives (`unsafeHTML`, `ifDefined`, `guard`) are evaluated transparently; only
 *   `unsafeHTML` / `unsafeSVG` values are inserted as raw markup. An attribute whose whole value is
 *   `nothing` (e.g. `ifDefined(undefined)`) is omitted.
 * - CSSResult instances (`css\`...\``) are resolved via their `.cssText` property.
 *
 * @param {any} result - The value or TemplateResult to serialize.
 * @param {Object} [options]
 * @param {boolean} [options.stripComments=false] - Whether to strip HTML comments.
 * @returns {string} Serialized HTML string.
 */
export function renderTemplateToString(result, options = {}) {
  return serializeValue(result, options, false);
}

/**
 * @param {any} result
 * @param {Object} options
 * @param {boolean} inAttribute - Whether the value is bound inside an attribute value.
 * @returns {string}
 */
function serializeValue(result, options, inAttribute) {
  if (result == null || result === false) {
    return "";
  }

  if (typeof result === "string") {
    return inAttribute ? escapeHtml(result) : escapeText(result);
  }

  if (typeof result === "number" || typeof result === "bigint") {
    return String(result);
  }

  if (typeof result === "symbol") {
    return "";
  }

  if (Array.isArray(result)) {
    return result.map((item) => serializeValue(item, options, inAttribute)).join("");
  }

  // Handle Lit CSSResult
  if (typeof result === "object" && result.cssText) {
    return result.cssText;
  }

  // Handle Lit directives (unsafeHTML, guard, live)
  if (typeof result === "object" && result._$litDirective$) {
    // unsafeHTML(str) / unsafeSVG(str): inserted as markup, never escaped
    if (RAW_MARKUP_DIRECTIVES.has(result._$litDirective$.directiveName)) {
      const markup = result.values?.[0];
      return typeof markup === "string" ? markup : serializeValue(markup, options, inAttribute);
    }
    // guard([deps], () => fn)
    if (result.values && typeof result.values[1] === "function") {
      return serializeValue(result.values[1](), options, inAttribute);
    }
    // live(value) and other value-passing directives
    if (result.values && result.values.length > 0) {
      return serializeValue(result.values[0], options, inAttribute);
    }
    return "";
  }

  // Handle Lit TemplateResult
  if (typeof result === "object" && "strings" in result && "values" in result) {
    let out = "";
    let skipNextLeadingQuote = false;
    // Whether the parser position is inside a start tag (between `<` and `>`), so a binding is an attribute value
    let inTag = false;

    for (let i = 0; i < result.strings.length; i++) {
      let str = result.strings[i];
      const lastOpen = str.lastIndexOf("<");
      const lastClose = str.lastIndexOf(">");
      if (lastOpen !== lastClose) {
        inTag = lastOpen > lastClose;
      }

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
          const isTruthy = Boolean(val && val !== "false");
          out += str + (isTruthy ? ` ${attrName}` : "");
          continue;
        }

        // 4. Regular attribute or text node
        const attrMatch = inTag ? str.match(/\s[^\s"'>/=]+=(["']?)$/) : null;
        if (
          attrMatch &&
          typeof val === "symbol" &&
          (!attrMatch[1] || result.strings[i + 1]?.startsWith(attrMatch[1]))
        ) {
          // `nothing` (e.g. ifDefined(undefined)) as the whole attribute value removes the attribute, as Lit does
          out += str.slice(0, attrMatch.index);
          skipNextLeadingQuote = Boolean(attrMatch[1]);
          continue;
        }
        if (attrMatch && !attrMatch[1]) {
          // Unquoted attribute binding: quote it so an escaped value cannot break out into new attributes
          out += `${str}"${serializeValue(val, options, true)}"`;
        } else {
          out += str;
          out += serializeValue(val, options, inTag);
        }
      } else {
        out += str;
      }
    }

    if (options.stripComments) {
      out = out.replace(/<!--[\s\S]*?-->/g, "");
    }

    return out;
  }

  return "";
}

export default renderTemplateToString;
