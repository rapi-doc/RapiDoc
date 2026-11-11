// Node only: the files of the installed rapidoc build, for integrations that serve them (assets "bundled").
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** rapidoc's dist/ folder. */
export function rapidocDistDir() {
  return path.dirname(fileURLToPath(import.meta.resolve("rapidoc/integration.json")));
}

/** Absolute path of a file an `embedRoutes` route names (`route.file`). */
export function assetPath(file) {
  if (path.basename(file) !== file) {
    throw new TypeError(`@rapidoc/embed: "${file}" is not a file of rapidoc's dist folder`);
  }
  return path.join(rapidocDistDir(), file);
}

export function readAsset(file) {
  return fs.readFileSync(assetPath(file));
}
