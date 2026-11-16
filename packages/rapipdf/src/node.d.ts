/**
 * TypeScript type definitions for `rapipdf/node`.
 */

/** The labels printed in the PDF. Any of them can be replaced. */
export type Localize = Record<string, string>;

/** What goes into the PDF and how it looks. Every option has a default (`DEFAULT_OPTIONS`). */
export interface PdfOptions {
  /** Sort the tags by name (default: true). */
  pdfSortTags?: boolean;
  /** Color of headings and operation titles (default: #b44646). */
  pdfPrimaryColor?: string;
  /** Color of section labels and table headers (default: #005b96). */
  pdfAlternateColor?: string;
  /** Title on the cover page (default: "API Reference"). */
  pdfTitle?: string;
  /** Schemas as an indented object tree or as a table (default: "object"). */
  pdfSchemaStyle?: "object" | "table";
  /** Text at the bottom left of every page. */
  pdfFooterText?: string;
  /** Cover page with the API's title, version, description and contact (default: true). */
  includeInfo?: boolean;
  /** Table of contents (default: true). */
  includeToc?: boolean;
  /** Security schemes section (default: true). */
  includeSecurity?: boolean;
  /** Request and response examples (default: false). */
  includeExample?: boolean;
  /** The operations, with parameters, request bodies and responses (default: true). */
  includeApiDetails?: boolean;
  /** A closing list of every operation, by tag (default: false). */
  includeApiList?: boolean;
  /** Labels to replace. */
  localize?: Localize;
}

export interface FontOptions {
  /** A TrueType/OpenType file used in place of Roboto, for text Roboto has no glyphs for. */
  font?: string;
  /** A TrueType/OpenType file used in place of Roboto Mono. */
  monoFont?: string;
}

/** A pdfmake document definition. */
export type DocDefinition = Record<string, unknown>;

export declare const DEFAULT_OPTIONS: Required<PdfOptions>;
export declare const DEFAULT_LOCALIZE: Localize;

/**
 * A spec as a PDF. `spec` is a file path, an http(s) URL, the text of a spec (JSON or YAML) or a
 * spec object. Rejects when the spec can't be loaded.
 */
export declare function generatePdf(
  spec: string | object,
  options?: PdfOptions & FontOptions,
): Promise<Buffer>;

/** Loads a spec and resolves every $ref (Swagger 2.0 is converted to OpenAPI 3). */
export declare function loadSpecFile(spec: string | object): Promise<Record<string, unknown>>;

/** The pdfmake document definition for a resolved spec. Pure: no file or network access. */
export declare function buildDocDefinition(
  spec: Record<string, unknown>,
  options?: PdfOptions,
): DocDefinition;

/** Renders a document definition to a PDF. */
export declare function renderPdf(
  docDefinition: DocDefinition,
  options?: FontOptions,
): Promise<Buffer>;

/** The spec's operations grouped by tag, as the sections read them. */
export declare function buildSpecModel(
  spec: Record<string, unknown>,
  sortTags?: boolean,
): Record<string, unknown>;

/** Markdown as a list of pdfmake nodes. */
export declare function markdownToPdfmake(markdown: string): Record<string, unknown>[];
