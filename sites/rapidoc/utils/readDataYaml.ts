import { readFileSync } from "fs";
import { resolve } from "path";
// The folder of rapidoc.config.yaml: the portal builds from a temp workspace, so process.cwd() is not the site.
import { projectDir } from "virtual:rapidoc-portal/project";

export function readDataYaml(filename: string): string {
  return readFileSync(resolve(projectDir, "page-data", filename), "utf8");
}
