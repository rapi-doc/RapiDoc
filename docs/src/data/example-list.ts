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
}

interface SubExampleList {
  [key: string]: SubExample;
}

interface SubExample {
  href: string;
}

  
import yaml from 'js-yaml';
import fs from 'fs';

const exampleListData = yaml.load(fs.readFileSync('./docs/src/data/example-list.yaml', 'utf8')) as ExampleList;
export { exampleListData };
export type { ExampleList, ExampleItem, SubExampleList, SubExample };