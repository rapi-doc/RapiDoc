/**
 * Sanitizing of HTML that comes from a spec (markdown descriptions rendered by marked) and of URLs a
 * spec supplies. Works without a DOM, so `<rapi-doc>` in a browser and `@rapidoc/prerender` in Node
 * produce the same markup.
 */

// One instance for every call: constructing it per description is measurable on large schemas
let nativeSanitizer;

/** Elements kept, with the attributes each may carry beyond the global ones */
const ALLOWED_TAGS = {
  a: ["href", "target", "rel", "name", "download"],
  abbr: [],
  b: [],
  blockquote: ["cite"],
  br: [],
  caption: [],
  code: [],
  col: ["span", "width"],
  colgroup: ["span"],
  dd: [],
  del: [],
  details: ["open"],
  div: ["align"],
  dl: [],
  dt: [],
  em: [],
  figcaption: [],
  figure: [],
  h1: ["align"],
  h2: ["align"],
  h3: ["align"],
  h4: ["align"],
  h5: ["align"],
  h6: ["align"],
  hr: [],
  i: [],
  img: ["src", "alt", "width", "height", "loading", "align"],
  input: ["type", "checked", "disabled"],
  ins: [],
  kbd: [],
  li: ["value"],
  mark: [],
  ol: ["start", "type", "reversed"],
  p: ["align"],
  pre: [],
  q: ["cite"],
  s: [],
  samp: [],
  small: [],
  span: [],
  strike: [],
  strong: [],
  sub: [],
  summary: [],
  sup: [],
  table: ["width", "align"],
  tbody: [],
  td: ["align", "valign", "colspan", "rowspan", "width"],
  tfoot: [],
  th: ["align", "valign", "colspan", "rowspan", "width", "scope"],
  thead: [],
  tr: ["align", "valign"],
  tt: [],
  u: [],
  ul: ["type"],
  var: [],
  wbr: [],
};
const GLOBAL_ATTRIBUTES = new Set(["class", "id", "title", "lang", "dir", "role", "style"]);
const VOID_TAGS = new Set(["br", "col", "hr", "img", "input", "wbr"]);
/** Elements whose content is not text to show: dropped with everything inside them */
const DROPPED_WITH_CONTENT = new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "template",
  "noscript",
  "textarea",
  "title",
  "svg",
  "math",
  "xmp",
  "plaintext",
  "noembed",
  "noframes",
  "frameset",
  "select",
  "head",
]);
const URL_ATTRIBUTES = new Set(["href", "src", "cite"]);
const SAFE_SCHEMES = new Set(["http", "https", "mailto", "tel"]);
/** In a style attribute: anything that loads a resource or runs code */
const UNSAFE_STYLE = /url\s*\(|expression\s*\(|@import|behavior\s*:|-moz-binding|javascript:/i;

const TOKEN =
  /<!--[\s\S]*?(?:-->|$)|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^\s"'<>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*\/?>|[^<]+|</g;
const ATTRIBUTE = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

const escapeAttribute = (value) =>
  value
    .replace(/&(?!#?\w+;)/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");

/** Numeric character references decoded, as a browser reads an attribute value */
function decodeNumericReferences(value) {
  return value.replace(/&#(x[0-9a-f]+|\d+);?/gi, (match, code) => {
    const point = code[0] === "x" || code[0] === "X" ? parseInt(code.slice(1), 16) : Number(code);
    try {
      return String.fromCodePoint(point);
    } catch {
      return "";
    }
  });
}

/**
 * A URL a spec supplies, when it is safe to use as a link or image address: http(s), mailto, tel, or
 * relative. Anything else (`javascript:`, `data:`, `vbscript:` ...) gives an empty string. Browsers
 * drop tabs, line breaks and leading control characters from a URL before reading its scheme, so
 * they are dropped here before the check too.
 *
 * @param {unknown} url
 * @param {{ image?: boolean }} [options] - image: also allow `data:image/...` (an `<img>` runs no script)
 * @returns {string} The URL, or "" when its scheme is not allowed
 */
export function safeUrl(url, { image = false } = {}) {
  if (typeof url !== "string") return "";
  // oxlint-disable-next-line no-control-regex -- control characters are what a browser strips
  const compact = url.replace(/[\u0000- \u007f-\u009f]+/g, "");
  const scheme = /^([a-zA-Z][a-zA-Z0-9+.-]*):/.exec(compact);
  if (!scheme) return url;
  const name = scheme[1].toLowerCase();
  if (SAFE_SCHEMES.has(name)) return url;
  if (
    image &&
    name === "data" &&
    /^data:image\/(png|gif|jpe?g|webp|avif|svg\+xml)[;,]/i.test(compact)
  )
    return url;
  return "";
}

function cleanAttributes(tag, source) {
  const allowed = ALLOWED_TAGS[tag];
  let out = "";
  const seen = new Set();
  for (const match of source.matchAll(ATTRIBUTE)) {
    const name = match[1].toLowerCase();
    if (seen.has(name)) continue;
    const isAllowed =
      GLOBAL_ATTRIBUTES.has(name) ||
      allowed.includes(name) ||
      /^aria-[a-z-]+$/.test(name) ||
      /^data-[a-z0-9-]+$/.test(name);
    if (!isAllowed) continue;
    const raw = match[2] ?? match[3] ?? match[4];
    if (raw === undefined) {
      seen.add(name);
      out += ` ${name}`;
      continue;
    }
    let value = raw;
    if (URL_ATTRIBUTES.has(name)) {
      // A named reference other than &amp; (&colon;, &Tab; ...) has no place in a real URL: refuse it
      // instead of carrying the whole table of names to decode it
      if (/&(?!amp;|#)[a-zA-Z]/.test(raw)) continue;
      const decoded = decodeNumericReferences(raw).replace(/&amp;/gi, "&");
      if (!safeUrl(decoded, { image: tag === "img" && name === "src" })) continue;
      value = decoded;
    } else if (name === "style") {
      if (UNSAFE_STYLE.test(decodeNumericReferences(raw).replace(/\\/g, ""))) continue;
    } else if (name === "type" && tag === "input") {
      if (raw.toLowerCase() !== "checkbox") continue;
    } else if (name === "target") {
      if (raw !== "_blank" && raw !== "_self") continue;
    }
    seen.add(name);
    out += ` ${name}="${escapeAttribute(value)}"`;
  }
  // A task-list checkbox is for show; any other input has no place in a description
  if (tag === "input" && !seen.has("type")) return null;
  if (tag === "input" && !seen.has("disabled")) out += " disabled";
  // A link that opens a new tab must not hand that tab a reference to this page
  if (tag === "a" && seen.has("target") && !seen.has("rel")) out += ' rel="noopener noreferrer"';
  return out;
}

/**
 * The allow-list sanitizer: keeps the elements and attributes of ALLOWED_TAGS, drops every other tag
 * (its text stays), drops script-like elements with their content, and closes what was left open, so
 * the result cannot reach outside the element it is put in.
 *
 * @param {string} htmlString
 * @returns {string}
 */
export function sanitizeMarkup(htmlString) {
  if (!htmlString.includes("<")) return htmlString;
  let out = "";
  const open = [];
  let skipUntil = "";
  TOKEN.lastIndex = 0;
  for (const token of htmlString.matchAll(TOKEN)) {
    const [text, closing, rawName, attributes] = token;
    const tag = rawName?.toLowerCase();
    if (skipUntil) {
      if (tag === skipUntil && closing) skipUntil = "";
      continue;
    }
    if (!tag) {
      if (text === "<") out += "&lt;";
      else if (!text.startsWith("<!--")) out += text;
      continue;
    }
    if (DROPPED_WITH_CONTENT.has(tag)) {
      // <embed> has no content and no closing tag
      if (!closing && !text.endsWith("/>") && tag !== "embed") skipUntil = tag;
      continue;
    }
    if (!Object.hasOwn(ALLOWED_TAGS, tag)) continue;
    if (closing) {
      const at = open.lastIndexOf(tag);
      if (at === -1) continue;
      while (open.length > at) out += `</${open.pop()}>`;
      continue;
    }
    const cleaned = cleanAttributes(tag, attributes || "");
    if (cleaned === null) continue;
    out += `<${tag}${cleaned}>`;
    if (!VOID_TAGS.has(tag)) open.push(tag);
  }
  while (open.length) out += `</${open.pop()}>`;
  return out;
}

/**
 * Sanitizes HTML from a spec before it is put in the page with unsafeHTML.
 *
 * @param {unknown} htmlString
 * @returns {string}
 */
export function sanitizeHTML(htmlString) {
  if (typeof htmlString !== "string") {
    return "";
  }

  // The browser's own sanitizer, where it exists: it reads the markup exactly as the page will
  if (typeof window !== "undefined" && window.Sanitizer && Element.prototype.setHTML) {
    try {
      const el = document.createElement("div");
      nativeSanitizer ??= new window.Sanitizer({ allowAttributes: { "*": ["*"] } });
      el.setHTML(htmlString, { sanitizer: nativeSanitizer });
      return el.innerHTML;
    } catch {
      // A browser whose Sanitizer does not take these options: the allow-list below
    }
  }

  return sanitizeMarkup(htmlString);
}
