import { buildSpecModel } from "./spec-model.js";
import { getInfoDef, getSecurityDef, getApiDef, getApiListDef } from "./sections.js";
import { DEFAULT_LOCALIZE } from "./localize.js";

const isBlank = (item) => item === "" || item === null || item === undefined;

/**
 * Removes the empty placeholders the sections leave where a part is absent (`condition ? node : ""`)
 * from every list of blocks: a nested array or a `stack`. pdfmake prints each as an empty line.
 * Table cells and the runs of a `text` are left alone.
 */
function withoutBlankBlocks(node) {
  if (Array.isArray(node)) return node.filter((item) => !isBlank(item)).map(withoutBlankBlocks);
  if (node === null || typeof node !== "object") return node;
  if (Array.isArray(node.stack)) node.stack = withoutBlankBlocks(node.stack);
  for (const list of ["ul", "ol", "columns"]) {
    if (Array.isArray(node[list])) node[list] = node[list].map(withoutBlankBlocks);
  }
  if (Array.isArray(node.table?.body)) {
    node.table.body = node.table.body.map((row) =>
      Array.isArray(row)
        ? row.map((cell) => (isBlank(cell) ? cell : withoutBlankBlocks(cell)))
        : row,
    );
  }
  return node;
}

/** The options of buildDocDefinition and their defaults (the element's attributes map onto these). */
export const DEFAULT_OPTIONS = {
  pdfSortTags: true,
  pdfPrimaryColor: "",
  pdfAlternateColor: "",
  pdfTitle: "API Reference",
  pdfSchemaStyle: "object",
  pdfFooterText: "",
  includeInfo: true,
  includeToc: true,
  includeSecurity: true,
  includeExample: false,
  includeApiDetails: true,
  includeApiList: false,
  localize: DEFAULT_LOCALIZE,
};

/**
 * The pdfmake document definition for a spec. Pure: no DOM, network or file access, so it runs the
 * same in the browser and in Node.
 *
 * @param {object} spec a resolved OpenAPI 3 document (what `loadSpec` returns)
 * @param {Partial<typeof DEFAULT_OPTIONS>} [userOptions]
 */
export function buildDocDefinition(spec, userOptions = {}) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...userOptions,
    localize: { ...DEFAULT_LOCALIZE, ...userOptions.localize },
  };
  const parsedSpec = buildSpecModel(spec, options.pdfSortTags);

  const pdfStyles = {
    title: { fontSize: 32 },
    h1: { fontSize: 22 },
    h2: { fontSize: 20 },
    h3: { fontSize: 18 },
    h4: { fontSize: 16 },
    h5: { fontSize: 14 },
    h6: { fontSize: 12, bold: true },
    p: { fontSize: 12 },
    small: { fontSize: 10 },
    sub: { fontSize: 8 },
    right: { alignment: "right" },
    left: { alignment: "left" },
    topMargin1: { margin: [0, 180, 0, 10] },
    topMargin2: { margin: [0, 60, 0, 5] },
    topMargin3: { margin: [0, 20, 0, 3] },
    topMargin4: { margin: [0, 15, 0, 3] },
    topMarginRegular: { margin: [0, 3, 0, 0] },
    tableMargin: { margin: [0, 5, 0, 15] },
    b: { bold: true },
    i: { italics: true },
    primary: { color: options.pdfPrimaryColor ? options.pdfPrimaryColor : "#b44646" },
    alternate: { color: options.pdfAlternateColor ? options.pdfAlternateColor : "#005b96" },
    gray: { color: "gray" },
    lightGray: { color: "#aaaaaa" },
    darkGray: { color: "#666666" },
    red: { color: "orangered" },
    blue: { color: "#005b96" },
    mono: { font: "RobotoMono", fontSize: 10 },
    monoSub: { font: "RobotoMono", fontSize: 8 },
  };

  const allContent = [];
  let infoDef = {};
  let tocDef = {};
  let securityDef = {};
  let apiListDef = {};
  let apiDef = {};

  if (options.includeInfo) {
    infoDef = getInfoDef(parsedSpec, options.pdfTitle, options.localize);
    allContent.push(infoDef);
  }
  if (options.includeToc) {
    tocDef = {
      toc: {
        title: { text: options.localize.index, style: ["b", "h2"] },
        numberStyle: { bold: true },
        style: ["small"],
      },
      pageBreak: "after",
    };
    // allContent.push({text:'', pageBreak:'after'});
    allContent.push(tocDef);
  }
  if (options.includeSecurity) {
    securityDef = getSecurityDef(parsedSpec, options.localize);
    allContent.push(securityDef);
  }
  if (options.includeApiDetails) {
    apiDef = getApiDef(
      parsedSpec,
      "",
      options.pdfSchemaStyle,
      options.localize,
      options.includeExample,
      options.includeApiList,
    );
    allContent.push(apiDef);
  }
  if (options.includeApiList) {
    apiListDef = getApiListDef(parsedSpec, options.localize.apiList, options.localize);
    allContent.push(apiListDef);
  }

  const finalDocDef = {
    footer(currentPage, pageCount) {
      return {
        margin: 10,
        columns: [
          { text: options.pdfFooterText, style: ["sub", "gray", "left"] },
          { text: `${currentPage} of ${pageCount}`, style: ["sub", "gray", "right"] },
        ],
      };
    },
    content: withoutBlankBlocks(allContent),
    styles: pdfStyles,
  };

  return finalDocDef;
}
