/**
 * Static build: project -> temp workspace -> `astro build` -> <project>/dist. The temp
 * workspace is always deleted afterwards unless `keepWorkspace` is set for debugging.
 */

import path from 'node:path';
import { build as astroBuild } from 'astro';
import { createAstroConfig } from './astro-integration.js';
import { createPortalWorkspace, removePortalWorkspace } from './temp-workspace.js';

/**
 * @param {string} [projectDir] - Folder containing rapidoc.config.yaml
 * @param {object} [options]
 * @param {string} [options.outDir='dist'] - Output folder, relative to the project or absolute
 * @param {boolean} [options.keepWorkspace=false] - Keep the temp workspace and return its path (debugging)
 * @returns {Promise<{success: boolean, apisCount: number, outDir: string, durationMs: number, workspaceDir?: string}>}
 */
export async function buildPortal(projectDir = process.cwd(), options = {}) {
  const startTime = Date.now();
  const workspace = await createPortalWorkspace(projectDir);
  const outDir = path.resolve(workspace.projectDir, options.outDir || 'dist');

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

  return {
    success: true,
    apisCount: workspace.config.apis?.length || 0,
    outDir,
    durationMs: Date.now() - startTime,
    ...(options.keepWorkspace ? { workspaceDir: workspace.root } : {}),
  };
}
