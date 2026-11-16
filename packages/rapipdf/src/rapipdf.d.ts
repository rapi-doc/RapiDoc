/**
 * TypeScript type definitions for `rapipdf`: the `<rapi-pdf>` element.
 */

/** `detail` of the `pdf-generated` event. */
export interface PdfGeneratedDetail {
  /** What was done with the PDF. */
  output: "open" | "download" | "blob";
}

/** `detail` of the `pdf-error` event. */
export interface PdfErrorDetail {
  error: Error;
}

/**
 * `<rapi-pdf>`: a spec URL field and a button that turns an OpenAPI or Swagger 2.0 spec into a PDF.
 * While a PDF is being made the element has the `generating` attribute.
 */
export declare class RapiPdf extends HTMLElement {
  /** The `spec-url` attribute. */
  specUrl: string | null;
  /** The labels printed in the PDF: the defaults, with those of the `<template>` child over them. */
  localize: Record<string, string>;
  /** The name a downloaded PDF gets: the `file-name` attribute, with .pdf added when missing. */
  readonly fileName: string;
  /**
   * Makes the PDF and opens it in a new tab, or downloads it when `output="download"` (also when
   * the browser blocks the tab). Rejects when the spec can't be loaded.
   * @param spec a URL, spec text or a spec object; default: the `spec-url` attribute
   */
  generatePdf(spec?: string | object): Promise<void>;
  /**
   * Makes the PDF and returns it, without opening or downloading anything.
   * @param spec a URL, spec text or a spec object; default: the `spec-url` attribute
   */
  getPdfBlob(spec?: string | object): Promise<Blob>;
}

export default RapiPdf;

declare global {
  interface HTMLElementTagNameMap {
    "rapi-pdf": RapiPdf;
  }
  interface HTMLElementEventMap {
    "pdf-generated": CustomEvent<PdfGeneratedDetail>;
    "pdf-error": CustomEvent<PdfErrorDetail>;
  }
}
