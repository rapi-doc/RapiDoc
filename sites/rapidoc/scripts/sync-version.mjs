/**
 * Keeps the version badge next to the logo (`site.logo.badge` in ../rapidoc.config.yaml) at RapiDoc's
 * version: `v14.2` for rapidoc 14.2.x, as the live site's header shows it; and the RapiPdf tab's own badge
 * (its `logo.badge`, the line marked "rapipdf's version") at rapipdf's. Run before every preview and
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
let updated = config;
if (current !== badge) {
  updated = updated.replace(BADGE_LINE, `$1${badge}$3`);
  console.log(`[rapidoc-site] Version badge: ${current} → ${badge} (rapidoc ${version})`);
}

// The RapiPdf tab's badge
const pdfVersion = JSON.parse(fs.readFileSync(fromHere("../../../packages/rapipdf/package.json"), "utf8")).version;
const pdfBadge = `v${pdfVersion.split(".").slice(0, 2).join(".")}`;
const PDF_BADGE_LINE = /^(\s+badge: )(\S+)(\s+# rapipdf's version.*)$/m;
const pdfCurrent = PDF_BADGE_LINE.exec(updated)?.[2];
if (pdfCurrent && pdfCurrent !== pdfBadge) {
  updated = updated.replace(PDF_BADGE_LINE, `$1${pdfBadge}$3`);
  console.log(`[rapidoc-site] RapiPdf badge: ${pdfCurrent} → ${pdfBadge} (rapipdf ${pdfVersion})`);
}

if (updated !== config) fs.writeFileSync(configFile, updated, "utf8");
