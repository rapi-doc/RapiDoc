import fs from "node:fs";
import path from "node:path";

/** The suffix of the notices file written next to each bundle: rapidoc-min.js → rapidoc-min.js.LICENSE.txt. */
export const LICENSE_FILE_SUFFIX = ".LICENSE.txt";

const LICENSE_FILE = /^(licen[cs]e|copying|notice)(\.(md|txt))?$/i;

/** The npm package a bundled module came from: its folder under the last node_modules/, or null for own code. */
function packageDirOf(moduleId) {
  const file = moduleId.replace(/^\0/, "").split("?")[0];
  const marker = `${path.sep}node_modules${path.sep}`;
  const at = file.lastIndexOf(marker);
  if (at === -1) return null;
  const rest = file.slice(at + marker.length).split(path.sep);
  const depth = rest[0].startsWith("@") ? 2 : 1;
  return file.slice(0, at + marker.length) + rest.slice(0, depth).join(path.sep);
}

function readPackage(dir) {
  const pkg = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
  const licenseFiles = fs.readdirSync(dir).filter((name) => LICENSE_FILE.test(name));
  const text = licenseFiles
    .map((name) => fs.readFileSync(path.join(dir, name), "utf8").trim())
    .join("\n\n");
  const repository = typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url;
  return {
    name: pkg.name,
    version: pkg.version,
    license: typeof pkg.license === "string" ? pkg.license : pkg.license?.type || "UNKNOWN",
    url: pkg.homepage || repository || `https://www.npmjs.com/package/${pkg.name}`,
    text: text || `No license file in the package; its package.json declares ${pkg.license}.`,
  };
}

/** The notices file for one bundle: every third-party package whose code it contains, by name. */
export function formatNotices(bundleName, owner, packages) {
  const title = `Third-party software bundled in ${bundleName} (${owner})`;
  const header = [
    title,
    "=".repeat(title.length),
    "",
    `${bundleName} contains code from the packages below. Their licenses require their`,
    "copyright and license notices to accompany the code; they follow in full.",
    "",
    ...packages.map((p) => `- ${p.name} ${p.version} (${p.license})`),
  ];
  const sections = packages.map((p) =>
    [`${p.name} ${p.version}`, `License: ${p.license}`, p.url, "-".repeat(72), p.text].join("\n"),
  );
  return [header.join("\n"), ...sections].join(`\n\n${"=".repeat(72)}\n\n`) + "\n";
}

/**
 * Vite plugin: for each JavaScript chunk, writes `<chunk>.LICENSE.txt` beside it with the name,
 * version, license and full license text of every npm package bundled into it. Minification drops
 * those packages' license comments, so this file carries the notices their licenses require.
 * Built from the modules actually in the chunk, so it stays exact when dependencies change.
 */
export function thirdPartyLicenses({ owner }) {
  return {
    name: "third-party-licenses",
    generateBundle(_options, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== "chunk") continue;
        const moduleIds = chunk.moduleIds ?? Object.keys(chunk.modules ?? {});
        const dirs = new Set(moduleIds.map(packageDirOf).filter(Boolean));
        const packages = [...dirs].map(readPackage).sort((a, b) => a.name.localeCompare(b.name));
        if (!packages.length) continue;
        this.emitFile({
          type: "asset",
          fileName: `${chunk.fileName}${LICENSE_FILE_SUFFIX}`,
          source: formatNotices(chunk.fileName, owner, packages),
        });
      }
    },
  };
}
