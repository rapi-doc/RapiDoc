/**
 * Writes schema.json (JSON Schema of rapidoc.config.yaml) from src/config/schema.js.
 * Editors use it for autocomplete via `# yaml-language-server: $schema=./node_modules/@rapidoc/portal/schema.json`.
 *
 * Run: npm run schema (tests/config.test.js fails when schema.json is out of date).
 */

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { configJsonSchema } from '../src/config/json-schema.js';

const outFile = fileURLToPath(new URL('../schema.json', import.meta.url));
fs.writeFileSync(outFile, `${JSON.stringify(configJsonSchema(), null, 2)}\n`, 'utf8');
console.log(`Wrote ${outFile}`);
