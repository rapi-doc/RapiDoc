/**
 * Astro configuration for a portal: Starlight plus the rapidocPortal integration, which
 * injects the portal pages shipped in src/pages/ and exposes the portal config and theme
 * CSS to them as virtual modules (nothing is read from process.cwd()).
 */

import fs from 'node:fs';
import path from 'node:path';
import markdoc from '@astrojs/markdoc';
import starlight from '@astrojs/starlight';
import { createStarlightOptions, THEME_CSS_MODULE } from './starlight-options.js';
import { renderThemeCss } from './theme-css.js';
import { resolveDependencyRoot } from './temp-workspace.js';

export const CONFIG_MODULE = 'virtual:rapidoc-portal/config';

// File URLs, not path strings: Astro reads a string entrypoint as relative to the project root.
const pageUrl = (name) => new URL(`../pages/${name}`, import.meta.url);

const PORTAL_ROUTES = [
  { pattern: '/', entrypoint: pageUrl('home.astro') },
  { pattern: '/catalog', entrypoint: pageUrl('catalog.astro') },
  { pattern: '/docs', entrypoint: pageUrl('docs-index-redirect.astro') },
  { pattern: '/[...apiRoute]', entrypoint: pageUrl('api-reference.astro') },
];

function virtualModulesPlugin(portalConfig) {
  const modules = {
    [CONFIG_MODULE]: `export default ${JSON.stringify(portalConfig)};`,
    [THEME_CSS_MODULE]: renderThemeCss(portalConfig),
  };
  return {
    name: 'rapidoc-portal:virtual-modules',
    resolveId(id) {
      if (id in modules) return `\0${id}`;
    },
    load(id) {
      if (id.startsWith('\0') && id.slice(1) in modules) return modules[id.slice(1)];
    },
  };
}

/**
 * Folders the dev server may serve files from: the workspace plus the real locations of
 * its dependencies (npm workspace packages are symlinks that resolve outside node_modules).
 */
function allowedServeDirs(workspaceRoot) {
  const dependencyRoot = fs.realpathSync(resolveDependencyRoot());
  const dirs = [workspaceRoot, dependencyRoot];
  for (const pkg of ['rapidoc', '@rapidoc/portal', '@astrojs/starlight', 'astro']) {
    const linked = path.join(dependencyRoot, pkg);
    if (fs.existsSync(linked)) dirs.push(fs.realpathSync(linked));
  }
  return [...new Set(dirs)];
}

/**
 * @param {object} options
 * @param {object} options.portalConfig - Normalized rapidoc.config.yaml
 * @returns {import('astro').AstroIntegration}
 */
export function rapidocPortal({ portalConfig }) {
  return {
    name: '@rapidoc/portal',
    hooks: {
      'astro:config:setup': ({ injectRoute, updateConfig }) => {
        for (const route of PORTAL_ROUTES) injectRoute(route);
        updateConfig({ vite: { plugins: [virtualModulesPlugin(portalConfig)] } });
      },
    },
  };
}

/**
 * Inline Astro config for building or serving a portal from a temp workspace.
 *
 * @param {object} workspace - From createPortalWorkspace()
 * @param {object} [overrides] - Extra inline config (e.g. outDir, server)
 */
export function createAstroConfig(workspace, overrides = {}) {
  return {
    root: workspace.root,
    configFile: false,
    site: 'https://developer.portal',
    build: { format: 'directory' },
    // markdoc() renders .mdoc docs with the workspace's markdoc.config.mjs; it must come before Starlight.
    integrations: [markdoc(), starlight(createStarlightOptions(workspace.config)), rapidocPortal({ portalConfig: workspace.config })],
    vite: { server: { fs: { allow: allowedServeDirs(workspace.root) } } },
    ...overrides,
  };
}
