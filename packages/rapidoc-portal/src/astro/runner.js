/**
 * Astro + Starlight Engine Runner for @rapidoc/portal.
 * Prepares the hidden .rapidoc workspace and runs Astro programmatically.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build as astroBuild, dev as astroDev } from 'astro';
import { loadConfig } from '../config/loader.js';
import { createStarlightConfig } from './config.js';
import {
  generateAstroConfigMjs,
  generateContentConfigTs,
  generateApiRouteAstro,
  generateCatalogAstro,
  generateIndexAstro,
  generateDocsRedirectAstro,
} from './templates.js';
import { buildSearchIndex } from '../search/indexer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORTAL_ROOT = path.resolve(__dirname, '../../');

/**
 * Ensures markdown/mdx content has a valid frontmatter title for Starlight's schema.
 */
function normalizeDocFrontmatter(rawContent, fileName = '') {
  let content = rawContent;
  const hasFrontmatter = content.startsWith('---');

  let sidebarLabel = '';

  if (hasFrontmatter) {
    const endMatch = content.indexOf('---', 3);
    if (endMatch !== -1) {
      const frontmatterEndIndex = endMatch + 3;
      const frontmatterText = content.slice(3, endMatch);
      const titleMatch = frontmatterText.match(/(?:^|\n)title:\s*["']?([^"'\n]+)["']?/);
      if (titleMatch) {
        const cleanTitle = titleMatch[1].replace(/<[^>]+>/g, '').trim();
        if (cleanTitle !== titleMatch[1]) {
          content = content.replace(titleMatch[0], `\ntitle: "${cleanTitle.replace(/"/g, '\\"')}"`);
        }
        // Strip duplicate # Heading in the body if it matches cleanTitle
        const bodyContent = content.slice(frontmatterEndIndex);
        const dupHeadingMatch = bodyContent.match(/(?:^|\n)#\s+([^\n#]+)/);
        if (dupHeadingMatch) {
          const bodyHeadingText = dupHeadingMatch[1].trim().replace(/<[^>]+>/g, '');
          if (bodyHeadingText.toLowerCase() === cleanTitle.toLowerCase()) {
            const bodyHeadingIdx = bodyContent.indexOf(dupHeadingMatch[0]);
            const newBody = bodyContent.slice(0, bodyHeadingIdx) + bodyContent.slice(bodyHeadingIdx + dupHeadingMatch[0].length);
            content = content.slice(0, frontmatterEndIndex) + newBody;
          }
        }
        return content; // Already has title
      }
      const labelMatch = frontmatterText.match(/(?:^|\n)sidebar_label:\s*["']?([^"'\n]+)["']?/);
      if (labelMatch) {
        sidebarLabel = labelMatch[1].trim();
      }
    }
  }

  // Extract first markdown # Heading
  let title;
  const headingMatch = content.match(/(?:^|\n)#\s+([^\n#]+)/);
  if (headingMatch) {
    title = headingMatch[1].trim();
    // Strip the # Heading line from the body so Starlight's page title doesn't duplicate it
    const headingIndex = content.indexOf(headingMatch[0]);
    if (headingIndex !== -1) {
      content = content.slice(0, headingIndex) + content.slice(headingIndex + headingMatch[0].length);
    }
  } else if (sidebarLabel) {
    title = sidebarLabel;
  } else {
    title = path.basename(fileName, path.extname(fileName)).replace(/[-_]/g, ' ');
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

  // Strip HTML / JSX tags from title
  title = title.replace(/<[^>]+>/g, '').trim();
  // Escape quotes in title
  const safeTitle = title.replace(/"/g, '\\"');

  if (hasFrontmatter) {
    // Insert title right after the opening ---
    return `---\ntitle: "${safeTitle}"\n${content.slice(4)}`;
  } else {
    // Prepend frontmatter
    return `---\ntitle: "${safeTitle}"\n---\n\n${content.trimStart()}`;
  }
}

/**
 * Prepares the .rapidoc workspace inside the user's project.
 */
export async function prepareAstroWorkspace(projectDir = process.cwd()) {
  const { config, configPath } = await loadConfig(projectDir);
  const baseDir = path.dirname(configPath);
  // Place workspace inside PORTAL_ROOT/.portal-engine so Node resolution finds monorepo dependencies naturally
  const workspaceDir = path.resolve(PORTAL_ROOT, '.portal-engine');

  // Clean previous workspace
  if (fs.existsSync(workspaceDir)) {
    try {
      fs.rmSync(workspaceDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 });
    } catch {
      // Ignore directory busy
    }
  }

  fs.mkdirSync(workspaceDir, { recursive: true });
  fs.writeFileSync(
    path.join(workspaceDir, 'package.json'),
    JSON.stringify(
      {
        name: 'rapidoc-portal-workspace',
        type: 'module',
        private: true,
        dependencies: {
          '@astrojs/starlight': '^0.42.6',
          astro: '^7.4.0',
          rapidoc: '*',
        },
      },
      null,
      2
    ),
    'utf8'
  );

  const srcDir = path.join(workspaceDir, 'src');
  const pagesDir = path.join(srcDir, 'pages');
  const stylesDir = path.join(srcDir, 'styles');
  const componentsDir = path.join(srcDir, 'components');
  const docsContentDir = path.join(srcDir, 'content', 'docs', 'docs');
  const publicDir = path.join(workspaceDir, 'public');
  const publicAssetsDir = path.join(publicDir, 'assets');
  const publicSpecsDir = path.join(publicDir, 'specs');

  fs.mkdirSync(pagesDir, { recursive: true });
  fs.mkdirSync(stylesDir, { recursive: true });
  fs.mkdirSync(componentsDir, { recursive: true });
  fs.mkdirSync(docsContentDir, { recursive: true });
  fs.mkdirSync(publicAssetsDir, { recursive: true });
  fs.mkdirSync(publicSpecsDir, { recursive: true });

  const portalComponentsDir = path.join(PORTAL_ROOT, 'src/components');
  if (fs.existsSync(portalComponentsDir)) {
    fs.cpSync(portalComponentsDir, componentsDir, { recursive: true });
  }

  // Symlink monorepo node_modules into .rapidoc so Vite & Astro resolve all packages seamlessly
  const monorepoNodeModules = path.resolve(PORTAL_ROOT, '../../node_modules');
  const workspaceNodeModules = path.join(workspaceDir, 'node_modules');
  if (fs.existsSync(monorepoNodeModules) && !fs.existsSync(workspaceNodeModules)) {
    try {
      fs.symlinkSync(monorepoNodeModules, workspaceNodeModules, 'junction');
    } catch {
      // Ignore if symlink fails
    }
  }

  // 1. Write rapidoc.portal.json for runtime access by dynamic routes
  fs.writeFileSync(path.join(workspaceDir, 'rapidoc.portal.json'), JSON.stringify(config, null, 2), 'utf8');

  // 2. Generate Starlight config & CSS
  const { starlightConfig, customCssContent } = createStarlightConfig(config);
  fs.writeFileSync(path.join(stylesDir, 'starlight-custom.css'), customCssContent, 'utf8');
  fs.writeFileSync(path.join(publicAssetsDir, 'starlight-custom.css'), customCssContent, 'utf8');

  const astroConfigMjs = generateAstroConfigMjs({
    siteTitle: config.site?.title || 'Developer Portal',
    primaryColor: config.rapidoc?.['primary-color'] || '#f76b39',
    sidebarConfigJson: JSON.stringify(starlightConfig.sidebar, null, 2),
  });
  fs.writeFileSync(path.join(workspaceDir, 'astro.config.mjs'), astroConfigMjs, 'utf8');

  // 3. Write content.config.ts
  fs.writeFileSync(path.join(srcDir, 'content.config.ts'), generateContentConfigTs(), 'utf8');

  // 4. Write Astro pages
  fs.writeFileSync(path.join(pagesDir, '[...apiRoute].astro'), generateApiRouteAstro(), 'utf8');
  fs.writeFileSync(path.join(pagesDir, 'catalog.astro'), generateCatalogAstro(), 'utf8');
  fs.writeFileSync(path.join(pagesDir, 'index.astro'), generateIndexAstro(), 'utf8');

  // Prevent directory listing exposure on /docs/ by redirecting to primary documentation route
  const defaultDocPath = config.navigation?.[0]?.items?.[0]?.path || config.navigation?.[0]?.path || '/docs/documentation';
  const targetDocUrl = defaultDocPath.startsWith('/docs') ? defaultDocPath : `/docs/${defaultDocPath.replace(/^\//, '')}`;
  const pagesDocsDir = path.join(pagesDir, 'docs');
  fs.mkdirSync(pagesDocsDir, { recursive: true });
  fs.writeFileSync(path.join(pagesDocsDir, 'index.astro'), generateDocsRedirectAstro(targetDocUrl), 'utf8');

  // 5. Copy & normalize documentation files into src/content/docs/docs/
  const userDocsDir = config.docs?.fullPath || path.resolve(baseDir, 'docs');
  if (fs.existsSync(userDocsDir)) {
    function copyDocFiles(currentSrc, currentDest) {
      const entries = fs.readdirSync(currentSrc, { withFileTypes: true });
      for (const entry of entries) {
        const srcPath = path.join(currentSrc, entry.name);
        const destPath = path.join(currentDest, entry.name);

        if (entry.isDirectory()) {
          fs.mkdirSync(destPath, { recursive: true });
          copyDocFiles(srcPath, destPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          // If a .md file has a matching .mdx sibling, prefer .mdx to avoid duplicate slugs in Starlight
          if (ext === '.md' && fs.existsSync(path.join(currentSrc, `${path.parse(entry.name).name}.mdx`))) {
            continue;
          }

          if (['.md', '.mdx', '.markdoc'].includes(ext)) {
            const raw = fs.readFileSync(srcPath, 'utf8');
            const normalized = normalizeDocFrontmatter(raw, entry.name);
            // Replace zudoku imports with @rapidoc/portal/components
            let sanitized = normalized.replace(/from\s+["']zudoku\/ui\/[^"']+["']/g, 'from "@rapidoc/portal/components"');
            sanitized = sanitized.replace(/<Stepper\b[^>]*>/g, '<Steps>').replace(/<\/Stepper>/g, '</Steps>');

            // Auto-inject imports for portal/starlight components used in MDX
            const portalComponents = [
              'Button',
              'Link',
              'Trademark',
              'SpaceWarning',
              'OpenPlaygroundButton',
              'Callout',
              'Card',
              'CardHeader',
              'CardTitle',
              'CardDescription',
              'CardContent',
              'CardFooter',
              'Steps',
              'Tabs',
              'TabItem',
              'Badge',
            ];
            const importedNames = new Set();
            for (const match of sanitized.matchAll(/import\s*\{([^}]+)\}\s*from/g)) {
              match[1].split(',').forEach((item) => {
                const name = item
                  .trim()
                  .split(/\s+as\s+/)[0]
                  .trim();
                if (name) importedNames.add(name);
              });
            }

            const neededImports = [];
            for (const comp of portalComponents) {
              const tagPattern = new RegExp(`<${comp}\\b`);
              if (tagPattern.test(sanitized) && !importedNames.has(comp)) {
                neededImports.push(comp);
              }
            }
            if (neededImports.length > 0) {
              const importStmt = `import { ${neededImports.join(', ')} } from "@rapidoc/portal/components";\n\n`;
              if (sanitized.startsWith('---')) {
                const endFm = sanitized.indexOf('---', 3);
                if (endFm !== -1) {
                  sanitized = sanitized.slice(0, endFm + 3) + '\n\n' + importStmt + sanitized.slice(endFm + 3).trimStart();
                } else {
                  sanitized = importStmt + sanitized;
                }
              } else {
                sanitized = importStmt + sanitized;
              }
            }

            fs.writeFileSync(destPath, sanitized, 'utf8');
          } else {
            // Copy static images / assets
            fs.copyFileSync(srcPath, destPath);
          }
        }
      }
    }
    copyDocFiles(userDocsDir, docsContentDir);
  }

  // 6. Copy specs to public/specs/
  for (const api of config.apis || []) {
    if (!api.isRemote && api.fullPath && fs.existsSync(api.fullPath)) {
      const destSpec = path.join(publicSpecsDir, path.basename(api.fullPath));
      fs.copyFileSync(api.fullPath, destSpec);
    }
  }

  // 7. Copy rapidoc-min.js to public/assets/
  const rapidocBundleCandidates = [
    path.join(PORTAL_ROOT, '../rapidoc/dist/rapidoc-min.js'),
    path.join(PORTAL_ROOT, 'node_modules/rapidoc/dist/rapidoc-min.js'),
  ];
  let bundleCopied = false;
  for (const candidate of rapidocBundleCandidates) {
    if (fs.existsSync(candidate)) {
      const isLocalWorkspace = candidate.includes('/rapidoc/dist/');
      if (isLocalWorkspace) {
        try {
          const content = fs.readFileSync(candidate, 'utf8');
          const isStale = !content.includes('nav-active-change') || !content.includes('slugger');
          const srcTs = path.join(PORTAL_ROOT, '../rapidoc/src/rapidoc.ts');
          const isOlderThanSrc = fs.existsSync(srcTs) && fs.statSync(srcTs).mtimeMs > fs.statSync(candidate).mtimeMs;
          if (isStale || isOlderThanSrc) {
            const { execSync } = await import('node:child_process');
            execSync('npm run build:rapidoc', { cwd: path.resolve(PORTAL_ROOT, '../..'), stdio: 'pipe' });
          }
        } catch {
          // If auto-rebuild fails, proceed with available candidate
        }
      }
      fs.copyFileSync(candidate, path.join(publicAssetsDir, 'rapidoc-min.js'));
      bundleCopied = true;
      break;
    }
  }
  if (!bundleCopied) {
    fs.writeFileSync(path.join(publicAssetsDir, 'rapidoc-min.js'), 'import "https://unpkg.com/rapidoc/dist/rapidoc-min.js";', 'utf8');
  }

  // 8. Build full-text search index across docs and OpenAPI specifications
  const docFilePaths = [];
  function collectDocFiles(dir) {
    if (!fs.existsSync(dir)) return;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) collectDocFiles(full);
      else if (['.md', '.mdx', '.markdoc'].includes(path.extname(ent.name).toLowerCase())) docFilePaths.push(full);
    }
  }
  collectDocFiles(userDocsDir);

  try {
    const searchIndex = buildSearchIndex(config, baseDir, docFilePaths);
    const searchIndexJson = JSON.stringify(searchIndex);
    fs.writeFileSync(path.join(publicDir, 'search-index.json'), searchIndexJson, 'utf8');
    fs.writeFileSync(path.join(publicAssetsDir, 'search-index.json'), searchIndexJson, 'utf8');
  } catch (err) {
    console.warn('[runner] Failed to build search index:', err.message);
  }

  return { workspaceDir, config, baseDir };
}

/**
 * Builds the portal into static HTML using Astro + Starlight.
 */
export async function buildPortalWithAstro(projectDir = process.cwd(), options = {}) {
  const startTime = Date.now();
  const { workspaceDir, config, baseDir } = await prepareAstroWorkspace(projectDir);
  const outDir = path.resolve(baseDir, options.outDir || 'dist');

  // Save current directory and switch to workspace for Astro
  const originalCwd = process.cwd();
  try {
    process.chdir(workspaceDir);
    await astroBuild({
      root: workspaceDir,
      outDir,
    });
  } finally {
    process.chdir(originalCwd);
  }

  return {
    success: true,
    apisCount: config.apis?.length || 0,
    outDir,
    durationMs: Date.now() - startTime,
  };
}

/**
 * Runs the Astro + Starlight live development server.
 */
export async function devPortalWithAstro(projectDir = process.cwd(), options = {}) {
  const { workspaceDir } = await prepareAstroWorkspace(projectDir);

  process.chdir(workspaceDir);

  const server = await astroDev({
    root: workspaceDir,
    server: {
      port: options.port || 4321,
      host: true,
    },
  });

  return server;
}
