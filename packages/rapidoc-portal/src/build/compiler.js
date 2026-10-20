import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig } from '../config/loader.js';
import { compileMarkdoc } from '../markdoc/compiler.js';
import { generateShell } from '../shell/template.js';
import { buildSearchIndex } from '../search/indexer.js';
import { parseSpecFile, extractApiMetadata } from '../openapi/index.js';
import { getNavBarHtml, getNavCss, toKebabCase } from 'rapidoc/static';

function escapeHtml(str = '') {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORTAL_ROOT = path.resolve(__dirname, '../../');

/**
 * Recursively scans a directory for files matching given extensions.
 */
function findDocFiles(dir, exts = ['.md', '.markdoc', '.mdx']) {
  const files = [];
  if (!fs.existsSync(dir)) return files;

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (exts.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }

  walk(dir);
  return files;
}

/**
 * Static Site Generator for @rapidoc/portal.
 * Compiles all OpenAPI specs, Markdoc, Markdown, and MDX into pre-rendered static HTML in dist/.
 *
 * @param {string} projectDir - Path to project directory containing rapidoc.config.yaml
 * @param {object} [options] - Build options ({ outDir, clean })
 * @returns {Promise<{ success: boolean, pagesCount: number, apisCount: number, durationMs: number, outDir: string }>}
 */
export async function buildPortal(projectDir = process.cwd(), options = {}) {
  const startTime = Date.now();
  const { config, configPath } = await loadConfig(projectDir);
  const baseDir = path.dirname(configPath);

  const outDir = path.resolve(baseDir, options.outDir || 'dist');

  // 1. Clean & prepare output directories
  if (fs.existsSync(outDir)) {
    try {
      fs.rmSync(outDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 });
    } catch {
      // Ignore directory busy race condition
    }
  }
  fs.mkdirSync(outDir, { recursive: true });

  const assetsOutDir = path.join(outDir, 'assets');
  const specsOutDir = path.join(outDir, 'specs');
  fs.mkdirSync(assetsOutDir, { recursive: true });
  fs.mkdirSync(specsOutDir, { recursive: true });

  // 2. Export & copy CSS & Client runtime assets
  const assetsSrcDir = path.join(PORTAL_ROOT, 'assets');
  let sharedNavCss = '';
  try {
    sharedNavCss = getNavCss('.portal-sidebar');
  } catch (err) {
    console.warn('[compiler] Could not extract getNavCss:', err.message);
  }
  if (sharedNavCss) {
    fs.writeFileSync(path.join(assetsOutDir, 'rapidoc-nav.css'), sharedNavCss, 'utf8');
  }

  if (fs.existsSync(assetsSrcDir)) {
    const cssPath = path.join(assetsSrcDir, 'portal.css');
    const jsPath = path.join(assetsSrcDir, 'portal.js');
    if (fs.existsSync(cssPath)) fs.copyFileSync(cssPath, path.join(assetsOutDir, 'portal.css'));
    if (fs.existsSync(jsPath)) fs.copyFileSync(jsPath, path.join(assetsOutDir, 'portal.js'));
  }

  // 3. Copy RapiDoc Web Component bundle
  const rapidocBundleCandidates = [
    path.join(PORTAL_ROOT, '../rapidoc/dist/rapidoc-min.js'),
    path.join(PORTAL_ROOT, 'node_modules/rapidoc/dist/rapidoc-min.js'),
  ];
  let rapidocBundleFound = false;
  for (const candidate of rapidocBundleCandidates) {
    if (fs.existsSync(candidate)) {
      fs.copyFileSync(candidate, path.join(assetsOutDir, 'rapidoc-min.js'));
      rapidocBundleFound = true;
      break;
    }
  }

  // Fallback: If local rapidoc-min.js is not yet built, write a proxy module that imports unpkg
  if (!rapidocBundleFound) {
    fs.writeFileSync(path.join(assetsOutDir, 'rapidoc-min.js'), 'import "https://unpkg.com/rapidoc/dist/rapidoc-min.js";', 'utf8');
  }

  // 4. Copy OpenAPI specifications into dist/specs/
  const specUrlMap = new Map();
  for (const api of config.apis) {
    if (api.isRemote) {
      specUrlMap.set(api.id, api.root);
    } else if (fs.existsSync(api.fullPath)) {
      const fileName = path.basename(api.fullPath);
      const destPath = path.join(specsOutDir, fileName);
      fs.copyFileSync(api.fullPath, destPath);
      specUrlMap.set(api.id, `/specs/${fileName}`);
    }
  }

  let pagesCount = 0;

  // 5. Pre-render API Reference pages
  for (const api of config.apis) {
    const routePath = api.path.replace(/^\//, '');
    const apiTargetDir = path.join(outDir, routePath);
    fs.mkdirSync(apiTargetDir, { recursive: true });

    const specUrl = specUrlMap.get(api.id) || api.root;
    const baseAssetsPath = path.relative(apiTargetDir, assetsOutDir).replace(/\\/g, '/') || './assets';

    // Parse spec and generate contextual navigation and metadata sidecar directly
    const specData = parseSpecFile(api.fullPath || api.root);
    const routingMode = api.routing?.mode || 'tag-pages';
    const sidebarNavHtml = await getNavBarHtml(api.fullPath || specData, {
      basePath: api.path,
      activeHref: api.path,
      routingMode,
      includeSearch: true,
      searchPlaceholder: 'Filter endpoints...',
      backToDocsHref: '',
      backToDocsLabel: 'Documentation',
      itemClassName: 'portal-sidebar-op-item',
    });
    const apiSidecar = extractApiMetadata(specData);

    // Compute endpoint count and enrich api object for catalog grid
    let opCount = 0;
    if (specData?.paths) {
      for (const p of Object.values(specData.paths)) {
        if (!p) continue;
        for (const m of ['get', 'post', 'put', 'delete', 'patch']) {
          if (p[m]) opCount++;
        }
      }
    }
    api.endpointCount = opCount;
    if (specData?.info?.version && !api.version) api.version = specData.info.version;
    if (specData?.info?.description && !api.description) api.description = specData.info.description;
    if (specData?.info?.title && (!api.title || api.title === api.id)) api.title = specData.info.title;

    const initialColorScheme = config.rapidoc?.['color-scheme'] || 'dark';
    const rapidocAttrs = Object.entries(config.rapidoc || {})
      .filter(([k]) => k !== 'color-scheme')
      .map(([k, v]) => `${k}="${v}"`)
      .join(' ');

    const createApiContent = (gotoPath = '') => `
      <div class="portal-rapidoc-fullview">
        <rapi-doc
          spec-url="${specUrl}"
          color-scheme="${initialColorScheme}"
          show-side-nav="false"
          show-header="false"
          update-route="false"
          render-style="read"
          auto-height="true"
          allow-authentication="true"
          allow-server-selection="false"
          allow-try="true"
          schema-style="table"
          use-path-in-nav-bar="true"
          nav-item-spacing="compact"
          scale="sm"
          style="--content-padding: 24px 32px;"
          ${gotoPath ? `goto-path="${gotoPath}"` : ''}
          ${rapidocAttrs}
        ></rapi-doc>
      </div>`;

    const html = generateShell({
      config,
      title: api.title || `${api.id} API`,
      description: api.description || `Interactive OpenAPI documentation for ${api.title}`,
      content: createApiContent(),
      toc: [],
      currentPath: api.path,
      layout: 'docs', // 3-column unified layout: left API tree, center RapiDoc headless, right API Sidecar
      baseAssetsPath,
      isApiPage: true,
      sidebarNavHtml,
      apiSidecar,
    });

    fs.writeFileSync(path.join(apiTargetDir, 'index.html'), html, 'utf8');
    pagesCount++;

    // In tag-pages mode, pre-render dedicated HTML pages for each tag: dist/{api.path}/{tagSlug}/index.html
    if (routingMode === 'tag-pages') {
      const tagsList = [];
      if (specData?.tags && Array.isArray(specData.tags)) {
        specData.tags.forEach((t) => {
          if (t && t.name) tagsList.push(t);
        });
      } else if (specData?.paths) {
        const seenTags = new Set();
        Object.values(specData.paths).forEach((p) => {
          if (!p || typeof p !== 'object') return;
          ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].forEach((m) => {
            if (p[m]?.tags && Array.isArray(p[m].tags)) {
              p[m].tags.forEach((t) => seenTags.add(t));
            }
          });
        });
        seenTags.forEach((name) => tagsList.push({ name }));
      }

      for (const t of tagsList) {
        const tagSlug = toKebabCase(t.name);
        if (!tagSlug || tagSlug === 'general') continue;
        const tagPath = `${api.path}/${tagSlug}`;
        const tagTargetDir = path.join(outDir, routePath, tagSlug);
        fs.mkdirSync(tagTargetDir, { recursive: true });

        const tagAssetsPath = path.relative(tagTargetDir, assetsOutDir).replace(/\\/g, '/') || '../../assets';
        const tagSidebarNavHtml = await getNavBarHtml(api.fullPath || specData, {
          basePath: api.path,
          activeHref: tagPath,
          routingMode,
          includeSearch: true,
          searchPlaceholder: 'Filter endpoints...',
          backToDocsHref: '',
          backToDocsLabel: 'Documentation',
          itemClassName: 'portal-sidebar-op-item',
        });

        const tagHtml = generateShell({
          config,
          title: `${t['x-displayName'] || t.name} — ${api.title || api.id}`,
          description: t.description || api.description || `Interactive OpenAPI documentation for ${t.name}`,
          content: createApiContent(`tag--${tagSlug}`),
          toc: [],
          currentPath: tagPath,
          layout: 'docs',
          baseAssetsPath: tagAssetsPath,
          isApiPage: true,
          sidebarNavHtml: tagSidebarNavHtml,
          apiSidecar,
        });

        fs.writeFileSync(path.join(tagTargetDir, 'index.html'), tagHtml, 'utf8');
        pagesCount++;
      }
    }
  }

  // 6. Pre-render Documentation pages (.md, .markdoc, .mdx)
  const docFiles = findDocFiles(config.docs.fullPath);
  let firstDocPage = null;

  for (const docFile of docFiles) {
    const rawContent = fs.readFileSync(docFile, 'utf8');
    const compiled = compileMarkdoc(rawContent);

    // Compute route path relative to docs directory
    const relToDocs = path.relative(config.docs.fullPath, docFile);
    const parsedPath = path.parse(relToDocs);
    const routeDirName = path.join(parsedPath.dir, parsedPath.name).replace(/\\/g, '/');
    const routePath = `/docs/${routeDirName}`;

    const docTargetDir = path.join(outDir, 'docs', routeDirName);
    fs.mkdirSync(docTargetDir, { recursive: true });

    const baseAssetsPath = path.relative(docTargetDir, assetsOutDir).replace(/\\/g, '/') || './assets';
    const pageTitle = compiled.frontmatter.title || parsedPath.name.replace(/-/g, ' ');

    const html = generateShell({
      config,
      title: pageTitle,
      description: compiled.frontmatter.description || '',
      content: compiled.html,
      toc: compiled.toc,
      currentPath: routePath,
      layout: compiled.frontmatter.layout || 'docs',
      baseAssetsPath,
      heroImage: compiled.frontmatter.heroImage || null,
    });

    fs.writeFileSync(path.join(docTargetDir, 'index.html'), html, 'utf8');
    pagesCount++;

    if (!firstDocPage || routePath === '/docs/documentation') {
      firstDocPage = { routePath, html: compiled.html, title: pageTitle, toc: compiled.toc };
    }
  }

  // Also write dist/docs/index.html to redirect or display documentation
  if (firstDocPage) {
    const docsRootDir = path.join(outDir, 'docs');
    fs.mkdirSync(docsRootDir, { recursive: true });
    const docsRootHtml = generateShell({
      config,
      title: firstDocPage.title,
      description: '',
      content: firstDocPage.html,
      toc: firstDocPage.toc,
      currentPath: '/docs',
      layout: 'docs',
      baseAssetsPath: '../assets',
    });
    fs.writeFileSync(path.join(docsRootDir, 'index.html'), docsRootHtml, 'utf8');
  }

  // 7. Pre-render API Catalog page (Zudoku Screenshot 4)
  const catalogTargetDir = path.join(outDir, 'catalog');
  fs.mkdirSync(catalogTargetDir, { recursive: true });
  const catalogAssetsPath = path.relative(catalogTargetDir, assetsOutDir).replace(/\\/g, '/') || './assets';

  const allCategories = Array.from(new Set(config.apis.map((a) => a.category).filter(Boolean)));
  const avatarColors = ['avatar-gold', 'avatar-blue', 'avatar-green', 'avatar-purple', 'avatar-rose'];

  const catalogContent = `
    <div class="portal-catalog-header">
      <h1 class="portal-catalog-title">${escapeHtml(config.catalog?.title || 'API Catalog')}</h1>
      <p class="portal-catalog-subtitle">Explore all available Cosmo Cargo APIs and developer services across the fleet.</p>
      <div class="portal-catalog-filter-bar">
        <div class="portal-catalog-search-row">
          <input type="text" placeholder="Search APIs..." class="portal-catalog-search-input" aria-label="Search APIs" />
        </div>
        <div class="portal-catalog-chips">
          <button type="button" class="portal-catalog-chip active" data-category="all">All</button>
          ${allCategories.map((c) => `<button type="button" class="portal-catalog-chip" data-category="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join('')}
        </div>
      </div>
    </div>

    <div class="portal-catalog-grid">
      ${config.apis
        .map((api, idx) => {
          const avatarClass = avatarColors[idx % avatarColors.length];
          const firstLetter = (api.title || api.id).charAt(0).toUpperCase();
          return `
        <a href="${escapeHtml(api.path)}" class="portal-catalog-card" data-category="${escapeHtml(api.category || 'General')}" data-search="${escapeHtml(api.title)} ${escapeHtml(api.description)}">
          <div class="portal-catalog-card-header">
            <div class="portal-catalog-avatar ${avatarClass}">${firstLetter}</div>
            <div class="portal-catalog-title-col">
              <span class="portal-catalog-card-title">${escapeHtml(api.title)}</span>
              <span class="portal-catalog-version">v${escapeHtml(api.version || '1.0.0')}</span>
            </div>
          </div>
          <p class="portal-catalog-card-desc">${escapeHtml(api.description || 'Explore the API reference and interactive console.')}</p>
          <div class="portal-catalog-card-footer">
            <span class="portal-catalog-category-pill">${escapeHtml(api.category || 'General')}</span>
            <span class="portal-catalog-ops-pill">${api.endpointCount || 0} endpoints &rarr;</span>
          </div>
        </a>`;
        })
        .join('')}
    </div>`;

  const catalogHtml = generateShell({
    config,
    title: config.catalog?.title || 'API Catalog',
    description: 'Explore all available Cosmo Cargo APIs and developer services across the fleet.',
    content: catalogContent,
    toc: [],
    currentPath: '/catalog',
    layout: 'landing', // Full width without sidebar for the 3-column card grid
    baseAssetsPath: catalogAssetsPath,
  });

  fs.writeFileSync(path.join(catalogTargetDir, 'index.html'), catalogHtml, 'utf8');
  pagesCount++;

  // Also write to dist/apis/index.html so /apis also opens the catalog
  const apisTargetDir = path.join(outDir, 'apis');
  fs.mkdirSync(apisTargetDir, { recursive: true });
  fs.writeFileSync(path.join(apisTargetDir, 'index.html'), catalogHtml, 'utf8');

  // 8. Pre-render Root Landing Page (dist/index.html - Zudoku Screenshot 1)
  const homeContent = `
    <div class="portal-landing-hero">
      <div class="portal-landing-grid">
        <div class="portal-landing-col-text">
          <h1 class="portal-landing-title">
            Ship anywhere in the <span class="portal-badge-pill">whole universe</span>
          </h1>
          <div class="portal-landing-lead">
            <p>
              <a href="/apis/shipments" class="portal-link-accent">Get started</a> and get access to our comprehensive shipping API. Create and
              manage shipments, track packages in real-time, and integrate with multiple carriers through a
              single, powerful interface. <a href="/docs/documentation" class="portal-link-accent">Read our documentation</a> to learn
              more.
            </p>
            <p>
              Whether you're shipping across town or across galaxies, our platform provides the tools you need
              to deliver with confidence. From automated label generation to real-time tracking and
              interplanetary logistics, we've got your shipping needs covered.
            </p>
            <p>
              Join thousands of businesses who trust Cosmo Cargo for their shipping operations. Our API
              supports everything from small local deliveries to complex intergalactic supply chains.
            </p>
          </div>
          <div class="portal-landing-cta-group">
            <a href="/docs/documentation" class="portal-btn portal-btn-outline">Explore Documentation</a>
            <span class="portal-cta-sep">or</span>
            <a href="/apis/shipments" class="portal-btn portal-btn-primary">Get started &rarr;</a>
          </div>
        </div>
        <div class="portal-landing-col-card">
          <div class="portal-cosmo-card">
            <div class="portal-cosmo-card-graphic">🚀</div>
            <div class="portal-cosmo-card-badge">Interplanetary Logistics</div>
            <h3 class="portal-cosmo-card-title">Cosmo Cargo v1.2</h3>
            <p class="portal-cosmo-card-desc">Warp-speed delivery across 8 star systems with automated customs and quantum tracking.</p>
            <div class="portal-cosmo-card-stats">
              <div class="portal-stat-item"><span class="portal-stat-num">99.98%</span><span class="portal-stat-lbl">Warp Reliability</span></div>
              <div class="portal-stat-item"><span class="portal-stat-num">8</span><span class="portal-stat-lbl">Galactic Sectors</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  const rootHtml = generateShell({
    config,
    title: config.site.title || 'Developer Portal',
    description: config.site.description || config.site.tagline || '',
    content: homeContent,
    toc: [],
    currentPath: '/',
    layout: 'landing',
    baseAssetsPath: './assets',
  });

  fs.writeFileSync(path.join(outDir, 'index.html'), rootHtml, 'utf8');
  pagesCount++;

  // 8. Generate Full-Text Search Index across all docs and OpenAPI specifications
  const searchIndex = buildSearchIndex(config, baseDir, docFiles);
  fs.mkdirSync(assetsOutDir, { recursive: true });
  fs.writeFileSync(path.join(assetsOutDir, 'search-index.json'), JSON.stringify(searchIndex), 'utf8');

  const durationMs = Date.now() - startTime;
  return {
    success: true,
    pagesCount,
    apisCount: config.apis.length,
    searchRecordsCount: searchIndex.totalRecords,
    durationMs,
    outDir,
  };
}
