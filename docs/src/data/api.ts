// type definition for our RapiDocs API Docu
interface ApiItem {
  name?: string;
  id: string;
  description?: string;
  default?: string;
  items?: any[];
}

interface ApiSection {
  id: string;
  items: ApiItem[];
}

interface ApiData {
  Attributes: ApiSection;
  Methods: ApiSection;
  Events: ApiSection;
}

// If you're using the YAML directly, you'll need to import it
// Make sure you have the yaml package installed: npm install js-yaml
import yaml from 'js-yaml';
import fs from 'fs';

const apiData = yaml.load(fs.readFileSync('./docs/src/data/api.yaml', 'utf8')) as ApiData;

export { apiData };
export type { ApiItem, ApiSection, ApiData };