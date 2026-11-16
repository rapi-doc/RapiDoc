/*
 * The part of <rapi-pdf> that does the work: the spec loader, the core and pdfmake with its fonts.
 * The element imports it on first use, so in the ES build (dist/rapipdf.js) a page pays for these
 * two megabytes only when someone asks for a PDF. The single-file build inlines it.
 */
import { buildDocDefinition } from "./core/index.js";
import { loadSpecInBrowser } from "./load-browser.js";
import { createPdf } from "./render-browser.js";

/**
 * A spec as pdfmake's output object (`open(win)`, `download(name)`, `getBlob()`).
 * @param {string | object} spec a URL (relative to the page), spec text or a spec object
 * @param {object} options the options of buildDocDefinition
 */
export async function createPdfDocument(spec, options) {
  return createPdf(buildDocDefinition(await loadSpecInBrowser(spec), options));
}
