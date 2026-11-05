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
  reportSpecWarnings(workspace.config);
  const outDir = path.resolve(workspace.projectDir, options.outDir || "dist");

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
