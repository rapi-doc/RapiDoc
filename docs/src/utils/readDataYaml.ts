import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

export function readDataYaml(filename: string): string {
  const candidate1 = resolve(process.cwd(), 'src/data', filename);
  if (existsSync(candidate1)) return readFileSync(candidate1, 'utf8');

  const candidate2 = resolve(process.cwd(), 'docs/src/data', filename);
  if (existsSync(candidate2)) return readFileSync(candidate2, 'utf8');

  throw new Error(`Cannot find YAML data file: ${filename} in process.cwd: ${process.cwd()}`);
}
