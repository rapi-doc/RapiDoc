interface TestList {
  [key: string]: TestItem[];
}

interface TestItem {
  title: string;
  validates?: string[];
  hidden?: boolean;
}

import yaml from 'js-yaml';
import fs from 'fs';

const testListData = yaml.load(fs.readFileSync('./docs/src/data/tests.yaml', 'utf8')) as TestList;
export { testListData };
export type { TestList, TestItem };