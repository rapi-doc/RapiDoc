// The RapiDoc integration contract, version 1: how an integration turns its options into the page that
// hosts <rapi-doc>. Pure string functions, no Node or DOM APIs and no imports, so this file runs in any
// JavaScript runtime and is short enough to port to another language. Ports are checked against
// conformance/fixtures/, which this file's tests also run. Change the output only with a new contract
// version.

export const CONTRACT_VERSION = 1;

export const DEFAULT_PATH = "/docs";
export const DEFAULT_TITLE = "API Reference";

/** File names under the page's path. The bundle keeps its name so the copied license file still matches. */
export const SCRIPT_FILE = "rapidoc-min.js";
export const LICENSE_FILE = "rapidoc-min.js.LICENSE.txt";
export const OAUTH_RECEIVER_FILE = "oauth-receiver.html";

const BASE_STYLE = "html,body{height:100%;margin:0}rapi-doc{height:100vh;width:100%}";

const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };

/** Escapes text for HTML content and double-quoted attribute values. */
export function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (char) => HTML_ESCAPES[char]);
}

/** Compact JSON that cannot end the <script> element it is written into. */
export function inlineJson(spec) {
  const json = typeof spec === "string" ? JSON.stringify(JSON.parse(spec)) : JSON.stringify(spec);
  return json
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/** The page's public URL path without a trailing slash; the site root is the empty string. */
export function normalizePath(path = DEFAULT_PATH) {
  const trimmed = String(path).trim().replace(/\/+$/, "");
  if (trimmed === "") return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

/** `allowTry` → `allow-try`; names already in kebab-case pass through. */
export function attributeName(key) {
  const name = String(key).replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    throw new TypeError(`@rapidoc/embed: "${key}" is not a valid attribute name`);
  }
  return name;
}

function attributeValue(value) {
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/** Where the page, the bundle and the OAuth return page are, and how the bundle is loaded. */
export function embedUrls(options = {}) {
  const path = normalizePath(options.path);
  const assets = options.assets ?? "bundled";
  const urls = {
    page: path === "" ? "/" : path,
    script: `${path}/${SCRIPT_FILE}`,
    integrity: undefined,
    oauthReceiver: `${path}/${OAUTH_RECEIVER_FILE}`,
  };
  if (assets === "cdn") {
    const manifest = options.manifest;
    if (!manifest?.cdn || !manifest.files?.[SCRIPT_FILE]) {
      throw new TypeError('@rapidoc/embed: assets "cdn" needs the integration manifest of rapidoc');
    }
    urls.script = `${manifest.cdn}${SCRIPT_FILE}`;
    urls.integrity = manifest.files[SCRIPT_FILE].integrity;
  } else if (assets && typeof assets === "object") {
    if (!assets.scriptUrl) {
      throw new TypeError("@rapidoc/embed: assets.scriptUrl is required");
    }
    urls.script = String(assets.scriptUrl);
    urls.integrity = assets.integrity || undefined;
  } else if (assets !== "bundled") {
    throw new TypeError('@rapidoc/embed: assets must be "bundled", "cdn" or { scriptUrl }');
  }
  return urls;
}

/**
 * The attributes of <rapi-doc> as [name, value] pairs, sorted by name.
 * `spec-url` and `oauth-receiver` come from the embed options; `options.options` adds to them and wins.
 * null and undefined leave an attribute out, so `{ "oauth-receiver": null }` removes that default.
 */
export function toAttributes(options = {}) {
  const attributes = new Map();
  if (options.specUrl) attributes.set("spec-url", options.specUrl);
  attributes.set("oauth-receiver", embedUrls(options).oauthReceiver);
  for (const [key, value] of Object.entries(options.options ?? {})) {
    attributes.set(attributeName(key), value);
  }
  return [...attributes]
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([name, value]) => [name, attributeValue(value)])
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
}

function scriptTag(urls, nonce) {
  let tag = `<script type="module" src="${escapeHtml(urls.script)}"`;
  if (urls.integrity) tag += ` integrity="${escapeHtml(urls.integrity)}" crossorigin="anonymous"`;
  if (nonce) tag += ` nonce="${escapeHtml(nonce)}"`;
  return `${tag}></script>`;
}

/** Text for a <style> element: it must not close the element. */
const styleText = (css) => String(css).replace(/<\/(style)/gi, "<\\/$1");

/**
 * The HTML page that hosts <rapi-doc>.
 * `head` and `css` are written as given: they are the developer's own markup, never user input.
 */
export function renderHostPage(options = {}) {
  const urls = embedUrls(options);
  const nonce = options.nonce ? ` nonce="${escapeHtml(options.nonce)}"` : "";
  const lines = [
    "<!doctype html>",
    `<html lang="${escapeHtml(options.lang ?? "en")}">`,
    "  <head>",
    '    <meta charset="utf-8">',
    '    <meta name="viewport" content="width=device-width, initial-scale=1">',
    `    <title>${escapeHtml(options.title ?? DEFAULT_TITLE)}</title>`,
    `    <style${nonce}>${BASE_STYLE}</style>`,
  ];
  if (options.css) lines.push(`    <style${nonce}>${styleText(options.css)}</style>`);
  lines.push(`    ${scriptTag(urls, options.nonce)}`);
  if (options.head) lines.push(`    ${options.head}`);
  lines.push("  </head>", "  <body>");

  const attributes = toAttributes(options);
  const hasSpec = options.spec !== null && options.spec !== undefined;
  if (attributes.length === 0) {
    lines.push(hasSpec ? "    <rapi-doc>" : "    <rapi-doc></rapi-doc>");
  } else {
    lines.push("    <rapi-doc");
    for (const [name, value] of attributes) lines.push(`      ${name}="${escapeHtml(value)}"`);
    lines.push(hasSpec ? "    >" : "    ></rapi-doc>");
  }
  if (hasSpec) {
    lines.push(
      `      <script type="application/json" slot="rapidoc-spec">${inlineJson(options.spec)}</script>`,
      "    </rapi-doc>",
    );
  }
  lines.push("  </body>", "</html>", "");
  return lines.join("\n");
}

/**
 * The page the OAuth provider sends the sign-in popup back to. It must be served from the same origin as
 * the host page, also when the bundle comes from a CDN.
 */
export function renderOAuthReceiverPage(options = {}) {
  return [
    "<!doctype html>",
    `<html lang="${escapeHtml(options.lang ?? "en")}">`,
    "  <head>",
    '    <meta charset="utf-8">',
    "    <title>OAuth sign-in</title>",
    `    ${scriptTag(embedUrls(options), options.nonce)}`,
    "  </head>",
    "  <body>",
    "    <oauth-receiver></oauth-receiver>",
    "  </body>",
    "</html>",
    "",
  ].join("\n");
}

const HTML_TYPE = "text/html; charset=utf-8";

/**
 * The routes an integration serves. `page` and `oauth-receiver` are rendered (renderHostPage,
 * renderOAuthReceiverPage); `file` is a file of rapidoc's dist/, served only when assets are "bundled".
 */
export function embedRoutes(options = {}) {
  const path = normalizePath(options.path);
  const urls = embedUrls(options);
  const routes = [
    { path: urls.page, kind: "page", contentType: HTML_TYPE },
    { path: urls.oauthReceiver, kind: "oauth-receiver", contentType: HTML_TYPE },
  ];
  if ((options.assets ?? "bundled") === "bundled") {
    routes.push(
      {
        path: urls.script,
        kind: "file",
        file: SCRIPT_FILE,
        contentType: "text/javascript; charset=utf-8",
      },
      {
        path: `${path}/${LICENSE_FILE}`,
        kind: "file",
        file: LICENSE_FILE,
        contentType: "text/plain; charset=utf-8",
      },
    );
  }
  return routes;
}
