// type definition for our RapiDocs API Docu

// Attributes and Groups
interface RapidocAttribute {
  name: string;
  allowed?: string[];
  description: string;
  /** One line, for places too small for the description. */
  summary?: string;
  type?: "string" | "number";
  default?: string | number;
  example?: string;
  code?: string;
  hidden?: boolean;
  deprecated?: boolean;
}

interface AttributesGroup {
  [groupName: string]: RapidocAttribute[];
}

// Methods
interface RapidocMethod {
  name: string;
  description: string;
  example?: string;
  code?: string;
  hidden?: boolean;
}

interface RapidocMethodSection {
  description: string;
  items: RapidocMethod[];
}

// Events
interface RapidocEvent {
  name: string;
  description: string;
  example?: string;
  code?: string;
  hidden?: boolean;
}
interface RapidocEventSection {
  description: string;
  items: RapidocEvent[];
}

// Slots
interface RapidocSlot {
  name: string;
  description: string;
  example?: string;
  code?: string;
  hidden?: boolean;
}
interface RapidocSlotSection {
  description: string;
  items: RapidocSlot[];
}

// Extentions
interface RapidocExtension {
  name: string;
  allowed?: string[];
  description?: string;
  example?: string;
  code?: string;
  hidden?: boolean;
  rowspan?: string;
}
interface RapidocExtensionSection {
  description: string;
  items: RapidocExtension[];
}

interface RapidocApi {
  Attributes: AttributesGroup[];
  Methods: RapidocMethodSection;
  Events: RapidocEventSection;
  Slots: RapidocSlotSection;
  Extensions: RapidocExtensionSection;
}

import * as yaml from "js-yaml";
import { resolve } from "path";
import { readDataYaml } from "../utils/readDataYaml";
import { projectDir } from "virtual:rapidoc-portal/project";
// @ts-ignore: a plain JS build script, shared with the rapidoc build
import { readApiManifest } from "../../../scripts/rapidoc-api.js";

// Attributes, methods, events and slots are read from each element's own declarations and doc comments
// (scripts/rapidoc-api.js), so the /api pages cannot differ from the source. For <rapi-doc>, the section
// introductions and the spec extensions, which the element does not declare, are in the extras file.
// Source paths are resolved from the site's folder (sites/rapidoc, two levels under the repository root):
// in a production build this module is bundled, so a path relative to the script would point into dist/.
function repoFile(file: string): string {
  return resolve(projectDir, "../..", file);
}

/** An element with a page under /api: the same elements as DOCUMENTED_ELEMENTS of scripts/rapidoc-api.js. */
interface ApiElement {
  tag: string;
  className: string;
  /** Source file, from the repository root */
  file: string;
  /** The page's path segment under /api; "" for /api itself */
  slug: string;
  /** Product name, as in the Products menu (page-data/products.ts) */
  product: string;
  /** npm package and how a page loads the element */
  packageName: string;
  scriptTag: string;
  /** One sentence under the page title */
  intro: string;
  /** The element's docs, linked from the page header */
  guide: { label: string; href: string };
  /** Optional examples above the methods and events tables */
  methodCode?: string;
  eventCode?: string;
}

export const API_ELEMENTS: ApiElement[] = [
  {
    tag: "rapi-doc",
    className: "RapiDoc",
    file: "packages/rapidoc/src/rapidoc.ts",
    slug: "",
    product: "RapiDoc",
    packageName: "rapidoc",
    scriptTag:
      '<script type="module" src="https://unpkg.com/rapidoc/dist/rapidoc-min.js"></script>',
    intro:
      "The full API reference element: every operation of a spec, with navigation, search and a Try console.",
    guide: { label: "RapiDoc docs", href: "/docs/rapidoc/" },
  },
  {
    tag: "rapi-doc-mini",
    className: "RapiDocMini",
    file: "packages/rapidoc/src/rapidoc-mini.ts",
    slug: "rapi-doc-mini",
    product: "RapiDoc Mini",
    packageName: "rapidoc",
    scriptTag:
      '<script type="module" src="https://unpkg.com/rapidoc/dist/rapidoc-min.js"></script>',
    intro:
      "One endpoint or a few, with its Try console, inside a blog post, tutorial or changelog. It ships in the same bundle as <rapi-doc>.",
    guide: { label: "RapiDoc Mini guide", href: "/docs/rapidoc-mini/" },
    methodCode: `const mini = document.querySelector('rapi-doc-mini');

// Show another operation, as you would write it in filter-operations
mini.showOperation('POST /pet');

// Give the Try console a key, so readers don't have to
mini.setApiKey('api_key', 'demo-key');`,
  },
  {
    tag: "rapi-flow",
    className: "RapiFlow",
    file: "packages/rapidoc/src/rapi-flow.ts",
    slug: "rapi-flow",
    product: "RapiFlow",
    packageName: "rapidoc",
    scriptTag:
      '<script type="module" src="https://unpkg.com/rapidoc/dist/rapidoc-flow-min.js"></script>',
    intro:
      "Draws the workflows of an Arazzo document as a diagram, and runs them against your API. It ships in its own bundle, rapidoc-flow-min.js.",
    guide: { label: "RapiFlow guide", href: "https://flow.rapidocui.com/" },
    eventCode: `const flow = document.querySelector('rapi-flow');

// A step was clicked: show its operation somewhere else on the page
flow.addEventListener('step-click', (e) => {
  console.log(e.detail.workflowId, e.detail.stepId, e.detail.operation);
});

// A run finished: one trace entry per step attempt
flow.addEventListener('workflow-run', (e) => {
  console.table(e.detail.trace);
});`,
  },
  {
    tag: "rapi-pdf",
    className: "RapiPdf",
    file: "packages/rapipdf/src/rapipdf.js",
    slug: "rapi-pdf",
    product: "RapiPdf",
    packageName: "rapipdf",
    scriptTag: '<script src="https://unpkg.com/rapipdf/dist/rapipdf-min.js"></script>',
    intro:
      "A spec URL field and a button that turns an OpenAPI spec into a PDF, in the browser. The rapipdf package also makes the same PDF in Node.",
    guide: {
      label: "RapiPdf README",
      href: "https://github.com/rapi-doc/RapiDoc/tree/master/packages/rapipdf#readme",
    },
    methodCode: `const pdf = document.querySelector('rapi-pdf');

await pdf.generatePdf();              // open or download, as the output attribute says
await pdf.generatePdf(specObject);    // a spec object or spec text instead of spec-url
const blob = await pdf.getPdfBlob();  // the PDF itself, nothing opened or downloaded`,
    eventCode: `const pdf = document.querySelector('rapi-pdf');

pdf.addEventListener('pdf-generated', (e) => console.log('Made a PDF:', e.detail.output));
pdf.addEventListener('pdf-error', (e) => console.error(e.detail.error));`,
  },
];

const empty = { description: "", items: [] };

/** The API of one element; the spec extensions only for <rapi-doc>, which reads them. */
export function readElementApi(element: ApiElement): RapidocApi {
  const declared = readApiManifest(repoFile(element.file), element.className);
  if (element.tag !== "rapi-doc") {
    return {
      Attributes: declared.Attributes,
      Methods: { description: "", items: declared.Methods.items },
      Events: { description: "", items: declared.Events.items },
      Slots: { description: "", items: declared.Slots.items },
      Extensions: empty,
    };
  }
  const extras = yaml.load(readDataYaml("rapidoc-api-extras.yaml")) as Pick<
    RapidocApi,
    "Extensions"
  > &
    Record<"Methods" | "Events" | "Slots", { description: string }>;
  return {
    Attributes: declared.Attributes,
    Methods: { ...extras.Methods, items: declared.Methods.items },
    Events: { ...extras.Events, items: declared.Events.items },
    Slots: { ...extras.Slots, items: declared.Slots.items },
    Extensions: extras.Extensions,
  };
}

const rapidocApiData: RapidocApi = readElementApi(API_ELEMENTS[0]);

export { rapidocApiData };
export type {
  RapidocAttribute,
  AttributesGroup,
  RapidocMethod,
  RapidocEvent,
  RapidocApi,
  ApiElement,
};
