import fs from "node:fs";
import path from "node:path";
import { loadPdf, loadPortal } from "../lib/engines.js";
import { ProblemError, UsageError } from "../lib/errors.js";
import { icon, info, success } from "../lib/output.js";

/*
 * rapidoc pdf <spec>: the API reference of a spec as a PDF, the document <rapi-pdf> makes in the
 * browser: a cover page, a table of contents, the security schemes and every operation with its
 * parameters, request bodies and responses. rapipdf (an optional peer) does the work.
 */

const isUrl = (target) => /^https?:\/\//i.test(target);
/** A URL as is; a path relative to the current folder, or absolute when it's outside it. */
function displayPath(location) {
  if (isUrl(location)) return location;
  const relative = path.relative(process.cwd(), location);
  return relative.startsWith("..") ? location : relative || ".";
}

/** The spec of the API `id` in the portal config of the current folder. */
async function specOfApi(id) {
  const portal = await loadPortal("pdf --api");
  let config;
  try {
    ({ config } = await portal.loadConfig(process.cwd()));
  } catch (err) {
    throw new ProblemError(err.message);
  }
  const api = (config.apis ?? []).find((entry) => entry.id === id);
  if (!api) {
    const ids = (config.apis ?? []).map((entry) => entry.id).join(", ") || "none";
    throw new ProblemError(`No API "${id}" in rapidoc.config.* (APIs: ${ids})`);
  }
  const [version] = api.versions;
  return version.isRemote ? version.spec : version.fullPath;
}

/** `openapi.yaml` → `openapi.pdf` in the current folder; a URL's last path segment likewise. */
function defaultOutput(entry) {
  const name = isUrl(entry) ? new URL(entry).pathname.split("/").filter(Boolean).pop() : entry;
  const base = path.basename(name ?? "", path.extname(name ?? "")) || "api";
  return `${base}.pdf`;
}

/** The labels file: a JSON object of label name to text. */
function readLabels(file) {
  const location = path.resolve(file);
  if (!fs.existsSync(location)) throw new ProblemError(`File not found: ${location}`);
  let labels;
  try {
    labels = JSON.parse(fs.readFileSync(location, "utf8"));
  } catch (err) {
    throw new ProblemError(`${displayPath(location)} is not valid JSON: ${err.message}`);
  }
  if (labels === null || typeof labels !== "object" || Array.isArray(labels))
    throw new ProblemError(`${displayPath(location)} must be a JSON object of label to text`);
  return labels;
}

export default {
  name: "pdf",
  usage: "pdf <spec>",
  summary: "Writes the API reference of a spec as a PDF",
  description:
    "Loads the spec (OpenAPI 3.x or Swagger 2.0, a file or a URL, with the files its $refs reach) and\nwrites a PDF: a cover page, a table of contents, the security schemes and every operation with its\nparameters, request bodies and responses. The same document <rapi-pdf> makes in the browser.",
  positionals: { name: "spec", max: 1 },
  options: {
    output: {
      type: "string",
      short: "o",
      value: "file",
      description: "Write here (default: the spec's name with .pdf, in the current folder)",
    },
    api: {
      type: "string",
      value: "id",
      description: "Use the spec of this API from rapidoc.config.* instead of a file",
    },
    title: {
      type: "string",
      value: "text",
      description: 'Title on the cover page (default: "API Reference")',
    },
    footer: {
      type: "string",
      value: "text",
      description: "Text at the bottom left of every page",
    },
    "schema-style": {
      type: "string",
      value: "style",
      choices: ["object", "table"],
      description: "Schemas as an indented object tree or as a table (default: object)",
    },
    examples: {
      type: "boolean",
      description: "Include request and response examples",
    },
    "api-list": {
      type: "boolean",
      description: "Add a closing list of every operation, by tag",
    },
    info: {
      type: "boolean",
      negatable: true,
      default: true,
      description: "Leave out the cover page",
    },
    toc: {
      type: "boolean",
      negatable: true,
      default: true,
      description: "Leave out the table of contents",
    },
    security: {
      type: "boolean",
      negatable: true,
      default: true,
      description: "Leave out the security schemes",
    },
    "api-details": {
      type: "boolean",
      negatable: true,
      default: true,
      description: "Leave out the operations",
    },
    "sort-tags": {
      type: "boolean",
      negatable: true,
      default: true,
      description: "Keep the tags in the spec's order instead of sorting them by name",
    },
    "primary-color": {
      type: "string",
      value: "color",
      description: "Color of headings and operation titles (default: #b44646)",
    },
    "alternate-color": {
      type: "string",
      value: "color",
      description: "Color of section labels and table headers (default: #005b96)",
    },
    labels: {
      type: "string",
      value: "file",
      description: "A JSON file of labels to replace, for a PDF in another language",
    },
    font: {
      type: "string",
      value: "file",
      description: "A .ttf or .otf font in place of Roboto (for Chinese, Japanese, Korean, ...)",
    },
    "mono-font": {
      type: "string",
      value: "file",
      description: "A .ttf or .otf font in place of Roboto Mono",
    },
  },
  examples: [
    "rapidoc pdf openapi.yaml",
    "rapidoc pdf openapi.yaml -o dist/reference.pdf --title 'Orders API' --examples",
    "rapidoc pdf https://example.com/openapi.json --schema-style table",
    "rapidoc pdf --api orders -o orders.pdf",
  ],

  async run({ values, positionals }) {
    const [target] = positionals;
    if (target && values.api)
      throw new UsageError("Give a spec or --api <id>, not both", { command: "pdf" });
    if (!target && !values.api)
      throw new UsageError("rapidoc pdf needs a spec: rapidoc pdf <spec>", { command: "pdf" });

    let entry = values.api ? await specOfApi(values.api) : target;
    if (!isUrl(entry)) {
      entry = path.resolve(entry);
      if (!fs.existsSync(entry) || !fs.statSync(entry).isFile())
        throw new ProblemError(`File not found: ${entry}`);
    }
    for (const font of [values.font, values["mono-font"]]) {
      if (font && !fs.existsSync(path.resolve(font)))
        throw new ProblemError(`Font file not found: ${path.resolve(font)}`);
    }
    const localize = values.labels ? readLabels(values.labels) : undefined;

    const { generatePdf } = await loadPdf();
    const options = {
      includeInfo: values.info,
      includeToc: values.toc,
      includeSecurity: values.security,
      includeApiDetails: values["api-details"],
      includeApiList: Boolean(values["api-list"]),
      includeExample: Boolean(values.examples),
      pdfSortTags: values["sort-tags"],
      ...(values.title !== undefined ? { pdfTitle: values.title } : {}),
      ...(values.footer !== undefined ? { pdfFooterText: values.footer } : {}),
      ...(values["schema-style"] ? { pdfSchemaStyle: values["schema-style"] } : {}),
      ...(values["primary-color"] ? { pdfPrimaryColor: values["primary-color"] } : {}),
      ...(values["alternate-color"] ? { pdfAlternateColor: values["alternate-color"] } : {}),
      ...(localize ? { localize } : {}),
      ...(values.font ? { font: values.font } : {}),
      ...(values["mono-font"] ? { monoFont: values["mono-font"] } : {}),
    };

    let pdf;
    try {
      pdf = await generatePdf(entry, options);
    } catch (err) {
      throw new ProblemError(`${displayPath(entry)}: ${err.message}`);
    }

    const output = path.resolve(values.output ?? defaultOutput(entry));
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, pdf);

    const pages = (pdf.toString("latin1").match(/\/Type \/Page\b/g) ?? []).length;
    const size = (pdf.length / 1024).toFixed(1);
    info(`\n${icon("📄")}${displayPath(entry)} → ${displayPath(output)}`);
    success(`${pages} page(s), ${size} KB.\n`, "   ");
  },
};
