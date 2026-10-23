/**
 * The temp workspace is the throwaway Astro project a portal is built from. It lives in the
 * portal project while `rapidoc build` / `rapidoc dev` runs and is deleted when they finish:
 *
 *   <project>/.rapidoc-temp/
 *     node_modules -> symlink to the folder Astro is installed in
 *     package.json             lists the dependencies Astro must bundle (Starlight, portal, rapidoc)
 *     src/content.config.ts
 *     src/content/docs/docs/   normalized copy of the project's docs/
 *     public/specs/            OpenAPI specs from `apis:`
 *     public/assets/           rapidoc-min.js
 *     public/search-index.json
 *
 * It must sit next to the project rather than in the OS temp folder: Astro only compiles
 * .astro files (Starlight's and this package's) that share a parent folder with the root.
 * Pages, components and Astro config come from this package (see astro-integration.js).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig } from '../config/loader.js';
import { listDocFiles, syncDocs } from './sync-docs.js';
import { copyRapidocBundle, copySpecs, writeSearchIndex } from './sync-assets.js';

export const WORKSPACE_DIRNAME = '.rapidoc-temp';

// Astro reads the root package.json to find packages with .astro files that must be bundled
// for server rendering; without it Starlight is loaded unbundled and its astro:* imports fail.
const WORKSPACE_PACKAGE_JSON = {
  name: 'rapidoc-portal-workspace',
  private: true,
  type: 'module',
  dependencies: { '@astrojs/starlight': '*', '@rapidoc/portal': '*', astro: '*', rapidoc: '*' },
};

const CONTENT_CONFIG_TS = `import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema(),
  }),
};
`;

/**
 * The node_modules folder that contains Astro, Starlight and @rapidoc/portal.
 */
export function resolveDependencyRoot() {
  const astroPackageJson = fileURLToPath(import.meta.resolve('astro/package.json'));
  return path.dirname(path.dirname(astroPackageJson));
}

/**
 * Re-syncs the docs copy and the search index from the project. Used on start and on docs changes.
 */
export function refreshDocs(workspace) {
  syncDocs(workspace.projectDocsDir, workspace.docsContentDir);
  try {
    writeSearchIndex(workspace.config, workspace.projectDir, listDocFiles(workspace.projectDocsDir), workspace.publicDir);
  } catch (err) {
    console.warn(`[rapidoc-portal] Search index not built: ${err.message}`);
  }
}

/**
 * Loads the project's config and creates a populated temp workspace for it.
 * A workspace left behind by a crashed run is replaced.
 *
 * @param {string} projectDir - Folder containing rapidoc.config.yaml
 * @returns {Promise<object>} workspace descriptor; pass it to removePortalWorkspace() when done
 */
export async function createPortalWorkspace(projectDir = process.cwd()) {
  const { config, configPath } = await loadConfig(projectDir);
  const resolvedProjectDir = path.dirname(configPath);
  const root = path.join(resolvedProjectDir, WORKSPACE_DIRNAME);

  const workspace = {
    root,
    config,
    configPath,
    projectDir: resolvedProjectDir,
    projectDocsDir: config.docs?.fullPath || path.join(resolvedProjectDir, 'docs'),
    docsContentDir: path.join(root, 'src', 'content', 'docs', 'docs'),
    publicDir: path.join(root, 'public'),
  };

  removePortalWorkspace(workspace);
  fs.mkdirSync(workspace.docsContentDir, { recursive: true });

  try {
    fs.symlinkSync(resolveDependencyRoot(), path.join(root, 'node_modules'), 'junction');
    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(WORKSPACE_PACKAGE_JSON, null, 2), 'utf8');
    fs.writeFileSync(path.join(root, 'src', 'content.config.ts'), CONTENT_CONFIG_TS, 'utf8');

    copySpecs(config, workspace.publicDir);
    copyRapidocBundle(workspace.publicDir);
    refreshDocs(workspace);
  } catch (err) {
    removePortalWorkspace(workspace);
    throw err;
  }

  return workspace;
}

/**
 * Deletes the temp workspace. The node_modules symlink is removed, never followed.
 */
export function removePortalWorkspace(workspace) {
  if (path.basename(workspace?.root || '') !== WORKSPACE_DIRNAME) return;
  fs.rmSync(workspace.root, { recursive: true, force: true, maxRetries: 3 });
}
