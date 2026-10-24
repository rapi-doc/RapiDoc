/**
 * The temp workspace is the throwaway Astro project a portal is built from. It lives in the
 * portal project while `rapidoc build` / `rapidoc dev` runs and is deleted when they finish.
 * Every run gets its own folder, so a build never touches a running dev server's workspace:
 *
 *   <project>/.rapidoc-temp/<dev|build>-<pid>-<n>/
 *     node_modules -> symlink to the folder Astro is installed in
 *     package.json             lists the dependencies Astro must bundle (Starlight, portal, rapidoc)
 *     markdoc.config.mjs       Markdoc tags for .mdoc docs (src/markdoc/astro-config.js)
 *     src/content.config.ts
 *     src/content/docs/docs/   normalized copy of the project's docs/ (.markdoc renamed to .mdoc)
 *     src/content/docs/index.* docs/index.*, the home page (if the project has one)
 *     public/                  the project's public/ folder (logo, favicon, images)
 *     public/specs/            OpenAPI specs from `apis:`
 *     public/assets/           rapidoc-min.js
 *     public/search-index.json
 *
 * It must sit inside the project rather than in the OS temp folder: Astro only compiles
 * .astro files (Starlight's and this package's) that share a parent folder with the root.
 *
 * A run killed before it could clean up leaves its folder behind; the next run removes the folders
 * of processes that are no longer running (the pid is in the folder name).
 * Pages, components and Astro config come from this package (see astro-integration.js).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig } from '../config/loader.js';
import { listDocFiles, syncDocs } from './sync-docs.js';
import { copyRapidocBundle, copySpecs, writeSearchIndex } from './sync-assets.js';

export const WORKSPACE_DIRNAME = '.rapidoc-temp';

const RUN_DIR_PATTERN = /^(?:dev|build)-(\d+)-\d+$/;
let runCounter = 0;

function isProcessAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return err.code === 'EPERM'; // alive, owned by another user
  }
}

/** Removes run folders whose process has exited, and anything else that is not a run folder. */
function removeStaleWorkspaces(parentDir) {
  if (!fs.existsSync(parentDir)) return;
  for (const name of fs.readdirSync(parentDir)) {
    const pid = Number(RUN_DIR_PATTERN.exec(name)?.[1]);
    if (pid && (pid === process.pid || isProcessAlive(pid))) continue;
    fs.rmSync(path.join(parentDir, name), { recursive: true, force: true, maxRetries: 3 });
  }
}

// Astro reads the root package.json to find packages with .astro files that must be bundled
// for server rendering; without it Starlight is loaded unbundled and its astro:* imports fail.
const WORKSPACE_PACKAGE_JSON = {
  name: 'rapidoc-portal-workspace',
  private: true,
  type: 'module',
  dependencies: {
    '@astrojs/markdoc': '*',
    '@astrojs/starlight': '*',
    '@astrojs/starlight-markdoc': '*',
    '@rapidoc/portal': '*',
    astro: '*',
    rapidoc: '*',
  },
};

// Read by @astrojs/markdoc from the project root: renders .mdoc docs (synced from .markdoc).
const MARKDOC_CONFIG_MJS = `import { defineMarkdocConfig } from '@astrojs/markdoc/config';
import { portalMarkdocConfig } from '@rapidoc/portal/markdoc/astro';

export default defineMarkdocConfig(portalMarkdocConfig());
`;

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
  syncDocs(workspace.projectDocsDir, workspace.contentDir, { editUrl: workspace.config.docs.editUrl });
  try {
    writeSearchIndex(workspace.config, workspace.projectDir, listDocFiles(workspace.projectDocsDir), workspace.publicDir);
  } catch (err) {
    console.warn(`[rapidoc-portal] Search index not built: ${err.message}`);
  }
}

/**
 * Copies the project's public/ folder (logo, favicon, images) into the workspace's public/.
 */
function copyProjectPublic(projectDir, publicDir) {
  const source = path.join(projectDir, 'public');
  if (fs.existsSync(source)) fs.cpSync(source, publicDir, { recursive: true });
}

/**
 * Loads the project's config and creates a populated temp workspace for this run.
 *
 * @param {string} projectDir - Folder containing rapidoc.config.yaml
 * @param {object} [options]
 * @param {'dev' | 'build'} [options.kind='build'] - Prefix of the run folder
 * @returns {Promise<object>} workspace descriptor; pass it to removePortalWorkspace() when done
 */
export async function createPortalWorkspace(projectDir = process.cwd(), { kind = 'build' } = {}) {
  const { config, configPath } = await loadConfig(projectDir);
  const resolvedProjectDir = path.dirname(configPath);
  const parentDir = path.join(resolvedProjectDir, WORKSPACE_DIRNAME);
  removeStaleWorkspaces(parentDir);
  const root = path.join(parentDir, `${kind}-${process.pid}-${++runCounter}`);

  const workspace = {
    root,
    config,
    configPath,
    projectDir: resolvedProjectDir,
    projectDocsDir: config.docs.fullPath,
    contentDir: path.join(root, 'src', 'content', 'docs'),
    docsContentDir: path.join(root, 'src', 'content', 'docs', 'docs'),
    publicDir: path.join(root, 'public'),
  };

  fs.mkdirSync(workspace.docsContentDir, { recursive: true });

  try {
    fs.symlinkSync(resolveDependencyRoot(), path.join(root, 'node_modules'), 'junction');
    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(WORKSPACE_PACKAGE_JSON, null, 2), 'utf8');
    fs.writeFileSync(path.join(root, 'src', 'content.config.ts'), CONTENT_CONFIG_TS, 'utf8');
    fs.writeFileSync(path.join(root, 'markdoc.config.mjs'), MARKDOC_CONFIG_MJS, 'utf8');

    copyProjectPublic(resolvedProjectDir, workspace.publicDir);
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
 * Deletes the run's temp workspace, and .rapidoc-temp/ once no other run uses it. Synchronous, so it
 * can run in a process 'exit' handler. The node_modules symlink is removed, never followed.
 */
export function removePortalWorkspace(workspace) {
  const root = workspace?.root || '';
  const parentDir = path.dirname(root);
  if (path.basename(parentDir) !== WORKSPACE_DIRNAME || !RUN_DIR_PATTERN.test(path.basename(root))) return;
  fs.rmSync(root, { recursive: true, force: true, maxRetries: 3 });
  try {
    fs.rmdirSync(parentDir);
  } catch {
    // Another run's workspace is still there (or the folder is already gone).
  }
}
