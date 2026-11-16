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
  /** The web components the example shows (rapi-doc when left out), for the gallery's product tabs */
  elements?: string[];
}

interface SubExampleList {
  [key: string]: SubExample;
}

interface SubExample {
  href: string;
}

import * as yaml from "js-yaml";
import { readDataYaml } from "../utils/readDataYaml.ts";

const exampleListData = yaml.load(readDataYaml("example-list.yaml")) as ExampleList;
export { exampleListData };
export type { ExampleList, ExampleItem, SubExampleList, SubExample };
