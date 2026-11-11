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
import { existsSync } from "fs";
import { resolve } from "path";
import { readDataYaml } from "../utils/readDataYaml";
// @ts-ignore: a plain JS build script, shared with the rapidoc build
import { readApiManifest } from "../../../scripts/rapidoc-api.js";

// Attributes, methods, events and slots are read from the element's own declarations and doc comments
// (packages/rapidoc/src/rapidoc.ts), so this page cannot differ from the source. The section
// introductions and the spec extensions, which the element does not declare, are in the extras file.
// The source path is resolved from process.cwd() (docs/ or the repo root): in a production build this
// module is bundled, so a path relative to the script would point into dist/.
function rapidocSource(): string {
  const file = "packages/rapidoc/src/rapidoc.ts";
  for (const candidate of [resolve(process.cwd(), "..", file), resolve(process.cwd(), file)]) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error(`Cannot find ${file} from process.cwd: ${process.cwd()}`);
}

const declared = readApiManifest(rapidocSource());
const extras = yaml.load(readDataYaml("rapidoc-api-extras.yaml")) as Pick<
  RapidocApi,
  "Extensions"
> &
  Record<"Methods" | "Events" | "Slots", { description: string }>;

const rapidocApiData: RapidocApi = {
  Attributes: declared.Attributes,
  Methods: { ...extras.Methods, items: declared.Methods.items },
  Events: { ...extras.Events, items: declared.Events.items },
  Slots: { ...extras.Slots, items: declared.Slots.items },
  Extensions: extras.Extensions,
};

export { rapidocApiData };
export type { RapidocAttribute, AttributesGroup, RapidocMethod, RapidocEvent, RapidocApi };
