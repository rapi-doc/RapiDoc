import yaml from 'js-yaml';
import { readDataYaml } from '../utils/readDataYaml';

export interface CssPartItem {
  name: string;
  target: string;
  description: string;
}

export interface CssPartCategory {
  category: string;
  description: string;
  items: CssPartItem[];
}

export interface CssVariableItem {
  name: string;
  default: string;
  description: string;
}

export interface CssVariableCategory {
  category: string;
  description: string;
  items: CssVariableItem[];
}

export interface SlotItem {
  name: string;
  placement: string;
  description: string;
}

export interface StylingData {
  parts: CssPartCategory[];
  variables: CssVariableCategory[];
  slots: SlotItem[];
}

const stylingData = yaml.load(readDataYaml('styling-data.yaml')) as StylingData;

export { stylingData };
