interface TestList {
  [key: string]: TestItem[];
}

interface TestItem {
  title: string;
  validates?: string[];
  hidden?: boolean;
}

import yaml from 'js-yaml';
import { readDataYaml } from '../utils/readDataYaml';

const testListData = yaml.load(readDataYaml('tests.yaml')) as TestList;
export { testListData };
export type { TestList, TestItem };