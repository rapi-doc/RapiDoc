// Machine-readable descriptions of <rapi-doc>, written to packages/rapidoc/dist by every build:
//
//   rapidoc-options.schema.json  JSON Schema of the attributes (config validation, typed options in other languages)
//   custom-elements.json         Custom Elements Manifest (editors, framework tooling)
//   rapidoc.d.ts, flow.d.ts, react.d.ts, vue.d.ts  TypeScript types (`rapidoc`, `rapidoc/flow`, `rapidoc/react`, `rapidoc/vue`)
//   oauth-receiver.html          the page the `oauth-receiver` attribute points to
//   integration.json             version, files, sizes and SRI hashes: what an integration needs to serve the bundle
//
// All of it comes from the declarations and doc comments of the elements in packages/rapidoc/src
// (rapidoc.ts, rapidoc-mini.ts, rapi-flow.ts; the schema is of <rapi-doc> only)
// (scripts/rapidoc-api.js), which the docs site's /api page also renders.
// The files are data, not code: `rapidoc` still has no runtime dependencies.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { ELEMENTS, readApiManifest } from "./rapidoc-api.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rapidocDir = path.join(rootDir, "packages/rapidoc");

/** Version of the integration contract (integration.json and the host page of @rapidoc/embed). */
export const CONTRACT_VERSION = 1;

const GENERATED = "Generated from the element sources by scripts/rapidoc-metadata.js. Do not edit.";

export { readApiManifest };

/** The manifest of every element `rapidoc` publishes: `[{ tag, className, bundle, manifest }]`. */
export function readElementManifests() {
  return ELEMENTS.map((element) => ({
    ...element,
    manifest: readApiManifest(element.file, element.className),
  }));
}

const DESCRIPTIONS = {
  "rapi-doc": "OpenAPI spec viewer with a built-in console.",
  "rapi-doc-mini": "The operations you pick from an OpenAPI document, with their Try console.",
  "rapi-flow": "Draws the workflows of an Arazzo document and can run them.",
};

/** A value written in parentheses is a note for readers ("(empty)"), not a value. */
const isNote = (value) => /^\(.*\)$/s.test(String(value).trim());

/** The manifest's descriptions are HTML for the docs page; metadata gets plain text. */
export function plainText(html = "") {
  return String(html)
    .replace(/<li>/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The attributes of <rapi-doc>, in manifest order, hidden ones included.
 * `kind` is `boolean` (the strings "true" and "false"), `enum` (`values`; `open` when other strings
 * are accepted too), `number` or `string`. `default` is set only when the manifest gives a real value.
 */
export function listAttributes(manifest) {
  const attributes = [];
  for (const group of manifest.Attributes) {
    const [groupName, items] = Object.entries(group)[0];
    for (const item of items) {
      const allowed = (item.allowed ?? []).map(String);
      const values = allowed.filter((value) => !isNote(value));
      let kind = item.type === "number" ? "number" : "string";
      if (values.length === 2 && values.includes("true") && values.includes("false")) {
        kind = "boolean";
      } else if (values.length > 0) {
        kind = "enum";
      }
      const attribute = {
        name: item.name,
        group: groupName.replace(/ Attributes$/, ""),
        kind,
        description: plainText(item.description),
      };
      if (item.summary) attribute.summary = item.summary;
      if (kind === "enum") {
        attribute.values = values;
        if (values.length < allowed.length) attribute.open = true;
      }
      if (item.default !== undefined && !isNote(item.default)) {
        const value = kind === "number" ? Number(item.default) : String(item.default);
        const known = kind === "boolean" ? ["true", "false"] : attribute.values;
        if (!known || known.includes(value)) attribute.default = value;
      }
      if (item.deprecated) attribute.deprecated = true;
      if (item.hidden) attribute.hidden = true;
      attributes.push(attribute);
    }
  }
  return attributes;
}

/** `loadSpec(spec)` → `{ name: "loadSpec", parameters: ["spec"] }`. */
function parseSignature(signature) {
  const match = /^([\w$]+)\s*\(([^)]*)\)/.exec(signature);
  if (!match) return { name: signature, parameters: [] };
  const parameters = match[2]
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
  return { name: match[1], parameters };
}

const visible = (section) => (section?.items ?? []).filter((item) => item.hidden !== true);

export function buildOptionsSchema(manifest, pkg) {
  const properties = {};
  for (const attribute of listAttributes(manifest)) {
    const property = { description: attribute.description };
    if (attribute.kind === "boolean") {
      property.type = ["boolean", "string"];
      property.enum = [true, false, "true", "false"];
    } else if (attribute.kind === "enum" && !attribute.open) {
      property.type = "string";
      property.enum = attribute.values;
    } else if (attribute.kind === "enum") {
      property.type = "string";
      property.examples = attribute.values;
    } else if (attribute.kind === "number") {
      property.type = "number";
    } else {
      property.type = "string";
    }
    if (attribute.default !== undefined) property.default = attribute.default;
    if (attribute.deprecated) property.deprecated = true;
    property["x-rapidoc-kind"] = attribute.kind;
    properties[attribute.name] = property;
  }
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: `https://cdn.jsdelivr.net/npm/rapidoc@${pkg.version}/dist/rapidoc-options.schema.json`,
    title: "<rapi-doc> attributes",
    description: `Attributes of the <rapi-doc> element of rapidoc ${pkg.version}. Booleans may be given as booleans or as the strings "true" and "false"; the element reads strings.`,
    type: "object",
    properties,
    additionalProperties: { type: ["string", "number", "boolean"] },
  };
}

function elementDeclaration({ tag, className, manifest }) {
  return {
    kind: "class",
    name: className,
    tagName: tag,
    customElement: true,
    description: DESCRIPTIONS[tag],
    attributes: listAttributes(manifest).map((attribute) => {
      let text = "string";
      if (attribute.kind === "boolean") text = '"true" | "false"';
      if (attribute.kind === "number") text = "number";
      if (attribute.kind === "enum") {
        text = attribute.values.map((value) => JSON.stringify(value)).join(" | ");
        if (attribute.open) text += " | string";
      }
      const entry = { name: attribute.name, description: attribute.description, type: { text } };
      if (attribute.summary) entry.summary = attribute.summary;
      if (attribute.default !== undefined) entry.default = JSON.stringify(attribute.default);
      if (attribute.deprecated) entry.deprecated = true;
      return entry;
    }),
    events: visible(manifest.Events).map((event) => ({
      name: event.name,
      description: plainText(event.description),
      type: { text: "CustomEvent" },
    })),
    slots: visible(manifest.Slots).map((slot) => ({
      name: slot.name === "(default)" ? "" : slot.name,
      description: plainText(slot.description),
    })),
    members: visible(manifest.Methods).map((method) => {
      const { name, parameters } = parseSignature(method.name);
      return {
        kind: "method",
        name,
        description: plainText(method.description),
        parameters: parameters.map((parameter) => ({ name: parameter })),
      };
    }),
  };
}

/** One module per bundle, with a declaration for each element it defines. */
export function buildCustomElementsManifest(elements) {
  const bundles = [...new Set(elements.map((element) => element.bundle))];
  return {
    schemaVersion: "1.0.0",
    readme: "README.md",
    modules: bundles.map((bundle) => {
      const modulePath = `dist/${bundle}`;
      const defined = elements.filter((element) => element.bundle === bundle);
      return {
        kind: "javascript-module",
        path: modulePath,
        declarations: defined.map(elementDeclaration),
        exports: defined.map((element) => ({
          kind: "custom-element-definition",
          name: element.tag,
          declaration: { name: element.className, module: modulePath },
        })),
      };
    }),
  };
}

const docComment = (text, indent = "  ") =>
  text ? `${indent}/** ${text.replace(/\*\//g, "*\\/")} */\n` : "";

/** Names of the types generated for an element. */
const typeNames = (className) => ({
  attributes: `${className}Attributes`,
  events: `${className}EventMap`,
  element: `${className}Element`,
});

/** The attributes interface, event map and element class of one element. */
function elementTypes({ tag, className, manifest }) {
  const names = typeNames(className);
  const attributes = listAttributes(manifest)
    .map((attribute) => {
      let type = "string";
      if (attribute.kind === "boolean") type = '"true" | "false"';
      if (attribute.kind === "number") type = "number | string";
      if (attribute.kind === "enum") {
        type = attribute.values.map((value) => JSON.stringify(value)).join(" | ");
        if (attribute.open) type += " | (string & {})";
      }
      const note = attribute.deprecated
        ? `@deprecated ${attribute.description}`
        : attribute.description;
      return `${docComment(note)}  ${JSON.stringify(attribute.name)}?: ${type};\n`;
    })
    .join("");
  const events = visible(manifest.Events)
    .map(
      (event) =>
        `${docComment(plainText(event.description))}  ${JSON.stringify(event.name)}: CustomEvent;\n`,
    )
    .join("");
  const methods = visible(manifest.Methods)
    .map((method) => {
      const { name, parameters } = parseSignature(method.name);
      const args = parameters.map((parameter) => `${parameter}?: any`).join(", ");
      return `${docComment(plainText(method.description))}  ${name}(${args}): any;\n`;
    })
    .join("");
  return `/** The attributes of \`<${tag}>\`, as written in HTML: every value is a string. */
export interface ${names.attributes} {
${attributes}}

/** The events \`<${tag}>\` dispatches. */
export interface ${names.events} extends HTMLElementEventMap {
${events}}

/** The \`<${tag}>\` element. Method arguments and results are not typed yet. */
export declare class ${names.element} extends HTMLElement {
${methods}  addEventListener<K extends keyof ${names.events}>(
    type: K,
    listener: (this: ${names.element}, ev: ${names.events}[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof ${names.events}>(
    type: K,
    listener: (this: ${names.element}, ev: ${names.events}[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}
`;
}

const byTag = (elements, tag) => elements.find((element) => element.tag === tag);

/** \`rapidoc\`: the elements of rapidoc-min.js. */
export function buildTypes(elements) {
  const main = byTag(elements, "rapi-doc");
  const mini = byTag(elements, "rapi-doc-mini");
  return `// ${GENERATED}

${elementTypes(main)}
${elementTypes(mini)}
/** Importing \`rapidoc\` registers \`<rapi-doc>\`, \`<rapi-doc-mini>\` and \`<oauth-receiver>\`. */
declare const _default: { RapiDoc: typeof RapiDocElement };
export default _default;
export declare const RapiDocMini: typeof RapiDocMiniElement;
export declare const OAuthReceiver: CustomElementConstructor;

declare global {
  interface HTMLElementTagNameMap {
    "rapi-doc": RapiDocElement;
    "rapi-doc-mini": RapiDocMiniElement;
    "oauth-receiver": HTMLElement;
  }
}
`;
}

/** \`rapidoc/flow\`: the element of rapidoc-flow-min.js. */
export function buildFlowTypes(elements) {
  return `// ${GENERATED}

${elementTypes(byTag(elements, "rapi-flow"))}
/** Importing \`rapidoc/flow\` registers \`<rapi-flow>\`. */
declare const _default: typeof RapiFlowElement;
export default _default;

declare global {
  interface HTMLElementTagNameMap {
    "rapi-flow": RapiFlowElement;
  }
}
`;
}

/** \`rapidoc/react\`: the elements in JSX. */
export function buildReactTypes() {
  return `// ${GENERATED}
import type { DetailedHTMLProps, HTMLAttributes } from "react";
import type {
  RapiDocAttributes,
  RapiDocElement,
  RapiDocMiniAttributes,
  RapiDocMiniElement,
} from "./rapidoc.js";
import type { RapiFlowAttributes, RapiFlowElement } from "./flow.js";

type ElementProps<E extends HTMLElement, A> = DetailedHTMLProps<HTMLAttributes<E>, E> &
  A & { class?: string };

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "rapi-doc": ElementProps<RapiDocElement, RapiDocAttributes>;
      "rapi-doc-mini": ElementProps<RapiDocMiniElement, RapiDocMiniAttributes>;
      "rapi-flow": ElementProps<RapiFlowElement, RapiFlowAttributes>;
    }
  }
}
`;
}

/** \`rapidoc/vue\`: the elements in Vue templates. */
export function buildVueTypes() {
  return `// ${GENERATED}
import type { DefineComponent } from "vue";
import type { RapiDocAttributes, RapiDocMiniAttributes } from "./rapidoc.js";
import type { RapiFlowAttributes } from "./flow.js";

declare module "vue" {
  interface GlobalComponents {
    "rapi-doc": DefineComponent<RapiDocAttributes>;
    "rapi-doc-mini": DefineComponent<RapiDocMiniAttributes>;
    "rapi-flow": DefineComponent<RapiFlowAttributes>;
  }
}
`;
}

/** The page the OAuth provider sends the sign-in popup back to. Served next to rapidoc-min.js. */
export const OAUTH_RECEIVER_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>OAuth sign-in</title>
    <script type="module" src="./rapidoc-min.js"></script>
  </head>
  <body>
    <oauth-receiver></oauth-receiver>
  </body>
</html>
`;

const FILE_ROLES = {
  "rapidoc-min.js": { role: "script", contentType: "text/javascript; charset=utf-8" },
  "rapidoc-min.js.LICENSE.txt": { role: "license", contentType: "text/plain; charset=utf-8" },
  "oauth-receiver.html": { role: "oauth-receiver", contentType: "text/html; charset=utf-8" },
  "rapidoc-flow-min.js": { role: "flow-script", contentType: "text/javascript; charset=utf-8" },
  "rapidoc-flow-min.js.LICENSE.txt": {
    role: "flow-license",
    contentType: "text/plain; charset=utf-8",
  },
};

/** What an integration needs to serve this build: each file's role, type, size and SRI hash. */
export function buildIntegrationManifest(distDir, pkg) {
  const files = {};
  for (const [name, info] of Object.entries(FILE_ROLES)) {
    const file = path.join(distDir, name);
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file);
    files[name] = {
      ...info,
      bytes: content.length,
      integrity: `sha384-${crypto.createHash("sha384").update(content).digest("base64")}`,
    };
  }
  return {
    contract: CONTRACT_VERSION,
    name: pkg.name,
    version: pkg.version,
    elements: ["rapi-doc", "rapi-doc-mini", "oauth-receiver"],
    cdn: `https://cdn.jsdelivr.net/npm/${pkg.name}@${pkg.version}/dist/`,
    files,
  };
}

/** Writes every metadata file into `distDir`; integration.json lists the bundles found there. */
export function writeRapidocMetadata(distDir = path.join(rapidocDir, "dist")) {
  const pkg = JSON.parse(fs.readFileSync(path.join(rapidocDir, "package.json"), "utf8"));
  const elements = readElementManifests();
  const manifest = byTag(elements, "rapi-doc").manifest;
  const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
  fs.mkdirSync(distDir, { recursive: true });
  const write = (name, content) => fs.writeFileSync(path.join(distDir, name), content);
  write("rapidoc-options.schema.json", json(buildOptionsSchema(manifest, pkg)));
  write("custom-elements.json", json(buildCustomElementsManifest(elements)));
  write("rapidoc.d.ts", buildTypes(elements));
  write("flow.d.ts", buildFlowTypes(elements));
  write("react.d.ts", buildReactTypes());
  write("vue.d.ts", buildVueTypes());
  write("oauth-receiver.html", OAUTH_RECEIVER_HTML);
  write("integration.json", json(buildIntegrationManifest(distDir, pkg)));
}

/** Vite plugin: writes the metadata once a bundle is on disk, so every build of either bundle has it. */
export function rapidocMetadata() {
  return {
    name: "rapidoc-metadata",
    closeBundle() {
      writeRapidocMetadata();
    },
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  writeRapidocMetadata();
}
