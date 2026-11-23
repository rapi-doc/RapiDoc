/**
 * Static build: project -> temp workspace -> `astro build` -> <project>/dist. The temp
 * workspace is always deleted afterwards unless `keepWorkspace` is set for debugging.
 */

import fs from "node:fs";
import path from "node:path";
import { build as astroBuild } from "astro";
import { splitOutput, usesServerLayout, SERVER_MANIFEST } from "../access/split-output.js";
import { createZoneMatcher } from "../access/rules.js";
import { writeMcpOutput } from "./mcp-output.js";
import { createAstroConfig } from "./astro-integration.js";
import { createPortalWorkspace, removePortalWorkspace } from "./temp-workspace.js";
import { reportSpecWarnings } from "./spec-checks.js";
import { indexBuiltPages } from "../search/indexer.js";

const isInside = (child, parent) => {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
};

/**
 * Why `outDir` cannot be the output folder, or null when it can. The build empties its output folder
 * first, so it must not be, hold, or sit inside anything the portal is built from: the project folder
 * itself, `docs/`, `public/`, `pages/`, the config, a spec, a workflow file or the stylesheet.
 *
 * @param {string} outDir - Absolute path
 * @param {{ projectDir: string, configPath: string, config: object }} workspace
 * @returns {string | null}
 */
export function outDirProblem(outDir, { projectDir, configPath, config }) {
  const shown = path.relative(projectDir, outDir) || ".";
  const refuse = (what) =>
    `The output folder "${shown}" ${what}. A build empties its output folder first: choose a folder of its own, such as dist.`;
  if (isInside(projectDir, outDir))
    return refuse(outDir === projectDir ? "is the portal's folder" : "holds the portal's folder");

  const folders = [
    [config.docs?.fullPath, "the docs folder"],
    [path.join(projectDir, "public"), "the public folder"],
    [path.join(projectDir, "pages"), "the pages folder"],
    [path.join(projectDir, "node_modules"), "node_modules"],
    [path.join(projectDir, ".rapidoc-temp"), "the build's own workspace"],
  ];
  for (const [folder, name] of folders) {
    if (!folder) continue;
    if (outDir === folder) return refuse(`is ${name}`);
    if (isInside(outDir, folder)) return refuse(`is inside ${name}`);
    if (isInside(folder, outDir)) return refuse(`holds ${name}`);
  }

  const files = [
    [configPath, "the config file"],
    ...[config.theme?.css || []].flat().map((file) => [file, "a stylesheet (theme.css)"]),
    ...(config.apis || []).flatMap((api) =>
      (api.versions || []).map((version) => [
        version.isRemote ? null : version.fullPath,
        `the spec of the API "${api.id}"`,
      ]),
    ),
    ...(config.workflows || []).map((workflow) => [
      workflow.fullPath,
      `the workflow file "${workflow.id}"`,
    ]),
  ];
  for (const [file, name] of files) {
    if (file && isInside(file, outDir)) return refuse(`holds ${name}`);
  }
  return null;
}

/**
 * @param {string} [projectDir] - Folder containing rapidoc.config.yaml
 * @param {object} [options]
 * @param {string} [options.outDir='dist'] - Output folder, relative to the project or absolute
 * @param {boolean} [options.keepWorkspace=false] - Keep the temp workspace and return its path (debugging)
 * @returns {Promise<{success: boolean, apisCount: number, outDir: string, durationMs: number, access?: object, workspaceDir?: string}>}
 *   `access` (when `auth` is configured): protected pages and files, zones and warnings from splitOutput().
 */
export async function buildPortal(projectDir = process.cwd(), options = {}) {
  const startTime = Date.now();
  const workspace = await createPortalWorkspace(projectDir, { kind: "build" });
  const outDir = path.resolve(workspace.projectDir, options.outDir || "dist");
  const problem = outDirProblem(outDir, workspace);
  if (problem) {
    removePortalWorkspace(workspace);
    throw new Error(problem);
  }
  reportSpecWarnings(workspace.config);
  const { site } = workspace.config;
  if (!site.url && !site.noindex)
    console.log(
      "[rapidoc-portal] Note: no site.url in the config, so the pages have no canonical link and there is no sitemap. Set site.url to the portal's public address to get both.",
    );

  // Astro writes its prerender chunks to <outDir>/.prerender when outDir is under the cwd, and to
  // <cwd>/.astro/ otherwise. Running from the workspace puts them in <workspace>/.astro/, where
  // they resolve dependencies through the workspace's node_modules and get deleted with it.
  const previousCwd = process.cwd();
  try {
    process.chdir(workspace.root);
    await astroBuild(createAstroConfig(workspace, { outDir }));
  } finally {
    process.chdir(previousCwd);
    if (!options.keepWorkspace) removePortalWorkspace(workspace);
  }

  // The project's own pages (pages/*.astro) have no Markdown source: the search index gets them from
  // the pages just built, before the split sorts its records by zone.
  if (workspace.config.search)
    indexBuiltPages(outDir, workspace.pages, { siteTitle: workspace.config.site.title });

  // With sign-in, the output is split into public/ and protected/ for `rapidoc serve`. If that fails,
  // the unsplit output (protected pages next to public ones) must not be left for someone to deploy.
  let access;
  if (usesServerLayout(workspace.config)) {
    try {
      access = await splitOutput(outDir, workspace.config);
    } catch (err) {
      fs.rmSync(outDir, { recursive: true, force: true });
      throw err;
    }
  }

  // MCP manifests next to the site (and, with sign-in, in rapidoc-server.json with each API's zone)
  const mcp = writeMcpOutput(outDir, workspace.config, {
    warn: (line) => console.warn(`[rapidoc-portal] Warning: ${line}`),
  });
  if (access) {
    const matcher = createZoneMatcher(workspace.config.access);
    const manifestFile = path.join(outDir, SERVER_MANIFEST);
    const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
    manifest.mcp = {
      apis: Object.fromEntries(
        Object.entries(mcp.apis).map(([id, entry]) => {
          const api = workspace.config.apis.find((a) => a.id === id);
          return [id, { ...entry, zone: matcher.zoneOf(api.path) }];
        }),
      ),
      workflows: mcp.workflows,
    };
    fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2), "utf8");
  }

  return {
    success: true,
    apisCount: workspace.config.apis?.length || 0,
    mcp,
    outDir,
    durationMs: Date.now() - startTime,
    ...(access ? { access } : {}),
    ...(options.keepWorkspace ? { workspaceDir: workspace.root } : {}),
  };
}
