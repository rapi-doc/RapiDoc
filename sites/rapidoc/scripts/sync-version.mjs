/**
 * Keeps the version badge next to the logo (`site.logo.badge` in ../rapidoc.config.yaml) at RapiDoc's
 * version: `v14.2` for rapidoc 14.2.x, as the live site's header shows it. Run before every preview and
 * build of this site (`dev:rapidoc-site`, `build:rapidoc-site` in the root package.json), so a published
 * site never carries an old version. It rewrites that one line, and only when the version has changed;
 * commit the change with the release that caused it.
 */

import fs from "node:fs";
import { fileURLToPath } from "node:url";

const fromHere = (relPath) => fileURLToPath(new URL(relPath, import.meta.url));
const configFile = fromHere("../rapidoc.config.yaml");
const { version } = JSON.parse(fs.readFileSync(fromHere("../../../packages/rapidoc/package.json"), "utf8"));
const badge = `v${version.split(".").slice(0, 2).join(".")}`;

// The badge line under `site.logo`, with whatever comment follows it
const BADGE_LINE = /^( {4}badge: )(\S+)(.*)$/m;
const config = fs.readFileSync(configFile, "utf8");
const current = BADGE_LINE.exec(config)?.[2];

if (!current) {
  console.error("[rapidoc-site] No `site.logo.badge` line in rapidoc.config.yaml: the version badge was not set.");
  process.exit(1);
}
if (current !== badge) {
  fs.writeFileSync(configFile, config.replace(BADGE_LINE, `$1${badge}$3`), "utf8");
  console.log(`[rapidoc-site] Version badge: ${current} → ${badge} (rapidoc ${version})`);
}
