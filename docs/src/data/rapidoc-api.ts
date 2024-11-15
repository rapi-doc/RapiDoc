// type definition for our RapiDocs API Docu

// Attributes and Groups
interface RapidocAttribute {
  name: string;
  allowed?: string[];
  description: string;
  default?: string;
}

interface AttributesGroup {
  [groupName: string]: RapidocAttribute[];
}

// Methods
interface RapidocMethod {
  name: string;
  description: string;
  example?:string
}

interface RapidocMethodSection {
  description: string;
  items: RapidocMethod[];
}

// Events
interface RapidocEvent {
  name: string;
  description: string;
  example?:string
}
interface RapidocEventSection {
  description: string;
  items: RapidocEvent[];
}

// Slots
interface RapidocSlot {
  name: string;
  description: string;
  example?:string
}
interface RapidocSlotSection {
  description: string;
  items: RapidocSlot[];
}

// Extentions
interface RapidocExtension {
  name: string;
  description: string;
  example?:string
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
import fs from 'fs';

const rapidocApiData = yaml.load(fs.readFileSync('./docs/src/data/rapidoc-api.yaml', 'utf8')) as RapidocApi;

export { rapidocApiData };
export type { RapidocAttribute, AttributesGroup, RapidocMethod, RapidocEvent, RapidocApi };