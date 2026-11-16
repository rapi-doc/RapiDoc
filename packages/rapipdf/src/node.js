/*
 * RapiPdf for Node (`rapipdf/node`): a spec in, the PDF's bytes out. The same loading and the same
 * document definition as <rapi-pdf>, rendered with pdfmake's Node build. `rapidoc pdf` uses it.
 */
import fs from "node:fs";
import path from "node:path";
import pdfmake from "pdfmake";
import { readFiles } from "@scalar/openapi-parser/plugins/read-files";
import { fetchUrls } from "@scalar/openapi-parser/plugins/fetch-urls";
import { buildDocDefinition } from "./core/index.js";
import { loadSpec } from "./load-spec.js";
import fontFiles from "./vfs_fonts.js";

export {
  buildDocDefinition,
  buildSpecModel,
  markdownToPdfmake,
  DEFAULT_LOCALIZE,
  DEFAULT_OPTIONS,
} from "./core/index.js";

const isUrl = (text) => /^https?:\/\//i.test(text);
const looksLikeText = (text) => /^\s*[{[]/.test(text) || text.includes("\n");

/**
 * Loads a spec in Node. `spec` is a file path, an http(s) URL, the text of a spec (JSON or YAML) or
 * a spec object; $refs to other files and URLs are followed.
 */
export function loadSpecFile(spec) {
  let input = spec;
  if (typeof spec === "string" && !isUrl(spec) && !looksLikeText(spec)) {
    input = path.resolve(spec);
    if (!fs.existsSync(input) || !fs.statSync(input).isFile()) {
      throw new Error(`File not found: ${input}`);
    }
  }
  return loadSpec(input, {
    plugins: [readFiles(), fetchUrls()],
    isLocation: (text) => isUrl(text) || !looksLikeText(text),
  });
}

// The fonts <rapi-pdf> embeds, registered in pdfmake's virtual file system under these names
const BUILT_IN_FONTS = {
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Medium.ttf",
    italics: "Roboto-Italic.ttf",
    bolditalics: "Roboto-Medium.ttf",
  },
  RobotoMono: {
    normal: "RobotoMono-Regular.ttf",
    bold: "RobotoMono-Regular.ttf",
    italics: "RobotoMono-Regular.ttf",
    bolditalics: "RobotoMono-Regular.ttf",
  },
};
let builtInFontsWritten = false;

/** One font file for every style of a family. */
const family = (file) => ({ normal: file, bold: file, italics: file, bolditalics: file });

/**
 * pdfmake's font table for a render, and the font files on disk it may read.
 * `font` and `monoFont` are TrueType/OpenType files that replace Roboto and Roboto Mono (for text
 * Roboto has no glyphs for, such as Chinese, Japanese or Korean).
 */
function fontsFor({ font, monoFont }) {
  const fonts = { ...BUILT_IN_FONTS };
  const files = new Set();
  for (const [name, file] of [
    ["Roboto", font],
    ["RobotoMono", monoFont],
  ]) {
    if (!file) continue;
    const resolved = path.resolve(file);
    if (!fs.existsSync(resolved)) throw new Error(`Font file not found: ${resolved}`);
    fonts[name] = family(resolved);
    files.add(resolved);
  }
  return { fonts, files };
}

/**
 * Renders a pdfmake document definition (from `buildDocDefinition`) to a PDF.
 *
 * @param {object} docDefinition
 * @param {{ font?: string, monoFont?: string }} [options]
 * @returns {Promise<Buffer>}
 */
export async function renderPdf(docDefinition, options = {}) {
  if (!builtInFontsWritten) {
    for (const [name, base64] of Object.entries(fontFiles)) {
      pdfmake.sharedVirtualfs.writeFileSync(name, base64, "base64");
    }
    builtInFontsWritten = true;
  }
  const { fonts, files } = fontsFor(options);
  pdfmake.setFonts(fonts);
  // The document is built from a spec someone else may have written: nothing in it may make pdfmake
  // download a URL or read a file, apart from the fonts asked for.
  pdfmake.setUrlAccessPolicy(() => false);
  pdfmake.setLocalAccessPolicy((file) => files.has(path.resolve(String(file))));
  return pdfmake.createPdf(docDefinition).getBuffer();
}

/**
 * A spec as a PDF.
 *
 * @param {string | object} spec a file path, an http(s) URL, spec text or a spec object
 * @param {object} [options] the options of `buildDocDefinition` (`DEFAULT_OPTIONS`), plus `font` and
 *   `monoFont`: font files that replace the built-in Roboto and Roboto Mono
 * @returns {Promise<Buffer>} the PDF
 */
export async function generatePdf(spec, options = {}) {
  const { font, monoFont, ...definitionOptions } = options;
  const resolved = await loadSpecFile(spec);
  return renderPdf(buildDocDefinition(resolved, definitionOptions), { font, monoFont });
}
