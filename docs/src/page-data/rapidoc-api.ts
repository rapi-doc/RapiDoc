// type definition for our RapiDocs API Docu

// Attributes and Groups
interface RapidocAttribute {
  name: string;
  allowed?: string[];
  description: string;
  default?: string;
  example?: string;
  code?: string;
  hidden?: boolean;
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

import yaml from 'js-yaml';
import { readDataYaml } from '../utils/readDataYaml';

const rapidocApiData = yaml.load(readDataYaml('rapidoc-api.yaml')) as RapidocApi;

export { rapidocApiData };
export type { RapidocAttribute, AttributesGroup, RapidocMethod, RapidocEvent, RapidocApi };
