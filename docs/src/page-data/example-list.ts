interface ExampleList {
  [key: string]: ExampleItem[];
}

interface ExampleItem {
  href?: string;
  img?: string;
  description?: string;
  subExamples?: SubExampleList[];
  isWide?: boolean;
  isDoc?: boolean;
  category?: string;
}

interface SubExampleList {
  [key: string]: SubExample;
}

interface SubExample {
  href: string;
}

import yaml from 'js-yaml';
import { readDataYaml } from '../utils/readDataYaml';

const exampleListData = yaml.load(readDataYaml('example-list.yaml')) as ExampleList;
export { exampleListData };
export type { ExampleList, ExampleItem, SubExampleList, SubExample };
