import * as yaml from 'js-yaml';
import { readDataYaml } from '../utils/readDataYaml';

export interface ComparisonItem {
  feature: string;
  rapidoc: string;
  rapidocMini: string;
}

export interface RapidocMiniComparisonData {
  comparison: ComparisonItem[];
}

const comparisonData = yaml.load(readDataYaml('rapidoc-mini-comparison.yaml')) as RapidocMiniComparisonData;

export { comparisonData };
