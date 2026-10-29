/**
 * Builds the Cosmo Cargo fixture served under a path (`site.url: https://cosmocargo.example/dev`) with every
 * option of config batch 1 (design/config-batch-1.md): head entries, theme.css, the SEO keys and llms.
 */
import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { buildPortal } from '../src/index.js';

const DEMO_PORTAL_DIR =
  process.env.RAPIDOC_DEMO_PORTAL_DIR ??
  fileURLToPath(new URL('../../../../rapi-portal-demo/fixtures/zudoku-cosmo-cargo', import.meta.url));
const TEST_TMP = fileURLToPath(new URL('./.test-tmp/', import.meta.url));
const BASE = '/dev';

/** Every built page, as [path relative to the output, html]. */
function builtPages(outDir) {
  return fs
    .readdirSync(outDir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => {
      const file = path.join(entry.parentPath, entry.name);
      return [path.relative(outDir, file), fs.readFileSync(file, 'utf8')];
    });
}

describe('a portal served under a path, with head entries, theme.css, SEO keys and llms', () => {
  let projectDir;
  let outDir;

  before(async () => {
    projectDir = path.join(TEST_TMP, `base-path-${process.pid}`);
    outDir = path.join(TEST_TMP, `base-path-dist-${process.pid}`);
    fs.rmSync(projectDir, { recursive: true, force: true });
    fs.cpSync(DEMO_PORTAL_DIR, projectDir, {
      recursive: true,
      filter: (src) => !/[\\/](dist|node_modules|\.git|\.rapidoc-temp)$/.test(src),
    });
    const configFile = path.join(projectDir, 'rapidoc.config.yaml');
    const config = YAML.parse(fs.readFileSync(configFile, 'utf8'));
    Object.assign(config.site, {
      url: `https://cosmocargo.example${BASE}`,
      image: '/social-card.png',
      titleTemplate: '%s · Cosmo Cargo',
      noindex: true,
    });
    config.theme = { ...config.theme, css: './styles/portal.css' };
    config.rapidoc = { ...config.rapidoc, 'show-method-in-nav-bar': 'as-colored-text', 'use-path-in-nav-bar': true };
    config.head = [
      { script: { src: 'https://analytics.example/a.js', defer: true } },
      { meta: { name: 'google-site-verification', content: 'abc123' } },
    ];
    fs.mkdirSync(path.join(projectDir, 'styles'));
    fs.writeFileSync(path.join(projectDir, 'styles', 'portal.css'), '.base-path-test-marker { color: rebeccapurple; }\n');
    fs.writeFileSync(configFile, YAML.stringify(config));
    await buildPortal(projectDir, { outDir });
  });

  after(() => {
    fs.rmSync(projectDir, { recursive: true, force: true });
    fs.rmSync(outDir, { recursive: true, force: true });
  });

  it('puts every root-relative link, script and image under the base path', () => {
    const outside = new Set();
    for (const [file, html] of builtPages(outDir)) {
      // Code samples show paths as written in a config or a guide; they aren't links.
      const markup = html.replace(/<(pre|code)\b[\s\S]*?<\/\1>/g, '');
      for (const [, attr, url] of markup.matchAll(/\s(href|src|action|spec-url|oauth-receiver)="(\/[^"]*)"/g)) {
        if (!url.startsWith('//') && !url.startsWith(`${BASE}/`)) outside.add(`${file}: ${attr}="${url}"`);
      }
    }
    assert.deepEqual([...outside].slice(0, 20), []);
  });

  it('redirects under the base path', () => {
    assert.match(fs.readFileSync(path.join(outDir, 'apis', 'index.html'), 'utf8'), new RegExp(`url=${BASE}/catalog`));
  });

  it('adds the head entries, preview image, robots tag and page titles to docs, catalog and API pages', () => {
    const pages = {
      docs: fs.readFileSync(path.join(outDir, 'docs', 'getting-started', 'index.html'), 'utf8'),
      catalog: fs.readFileSync(path.join(outDir, 'catalog', 'index.html'), 'utf8'),
      api: fs.readFileSync(path.join(outDir, 'apis', 'labels', 'index.html'), 'utf8'),
    };
    for (const [kind, html] of Object.entries(pages)) {
      assert.match(html, /<script src="https:\/\/analytics.example\/a.js" defer>/, kind);
      assert.match(html, /<meta name="google-site-verification" content="abc123"/, kind);
      assert.match(html, /<meta property="og:image" content="https:\/\/cosmocargo.example\/dev\/social-card.png"/, kind);
      assert.match(html, /<meta name="robots" content="noindex, nofollow"/, kind);
      assert.match(html, /<title>[^<]+ · Cosmo Cargo<\/title>/, kind);
      assert.match(html, /<meta property="og:title"/, kind);
    }
  });

  it('loads theme.css on every kind of page', () => {
    const css = fs
      .readdirSync(path.join(outDir, '_rapidoc', 'assets'))
      .filter(
        (name) =>
          name.endsWith('.css') && fs.readFileSync(path.join(outDir, '_rapidoc', 'assets', name), 'utf8').includes('base-path-test-marker')
      )
      .map((name) => `${BASE}/_rapidoc/assets/${name}`);
    assert.ok(css.length, 'theme.css is in a built stylesheet');
    for (const page of [['docs', 'getting-started'], ['catalog'], ['apis', 'labels']]) {
      const html = fs.readFileSync(path.join(outDir, ...page, 'index.html'), 'utf8');
      assert.ok(
        css.some((href) => html.includes(href)),
        `${page.join('/')} links theme.css`
      );
    }
  });

  it('keeps search engines out with noindex: robots.txt, no sitemap', () => {
    assert.equal(fs.readFileSync(path.join(outDir, 'robots.txt'), 'utf8'), 'User-agent: *\nDisallow: /\n');
    assert.deepEqual(
      fs.readdirSync(outDir).filter((name) => name.startsWith('sitemap')),
      []
    );
  });

  it('draws the API sidebar with the navigation attributes of rapidoc:', () => {
    const html = fs.readFileSync(path.join(outDir, 'apis', 'labels', 'index.html'), 'utf8');
    const sidebar = html.slice(html.indexOf('id="portal-api-sidebar"'), html.indexOf('<rapi-doc'));
    assert.match(sidebar, /<span class="nav-method as-colored-text (get|post|put|patch|delete)">(GET|POST|PUT|PATCH|DELETE)<\/span>/);
    assert.ok(!sidebar.includes('as-colored-block'));
    assert.match(sidebar, /<span class="nav-bar-path-label"><span class="mono-font">\/[^<]*<\/span><\/span>/, 'paths, not summaries');
    assert.match(html, /<rapi-doc[^>]* show-method-in-nav-bar="as-colored-text"/);
  });

  it('publishes docs pages as Markdown, llms.txt and llms-full.txt, with page actions', () => {
    const markdown = fs.readFileSync(path.join(outDir, 'docs', 'getting-started.md'), 'utf8');
    assert.match(markdown, /^# /);
    assert.ok(!markdown.startsWith('---'), 'no frontmatter');
    const llms = fs.readFileSync(path.join(outDir, 'llms.txt'), 'utf8');
    assert.match(llms, /^# Cosmo Cargo Inc\./);
    assert.match(llms, /\(https:\/\/cosmocargo.example\/dev\/docs\/getting-started.md\)/);
    assert.match(llms, /## APIs\n\n- \[.+\(OpenAPI\)\]\(https:\/\/cosmocargo.example\/dev\/specs\//);
    assert.ok(fs.readFileSync(path.join(outDir, 'llms-full.txt'), 'utf8').includes(markdown.split('\n')[0]));

    const page = fs.readFileSync(path.join(outDir, 'docs', 'getting-started', 'index.html'), 'utf8');
    assert.match(page, new RegExp(`class="portal-page-actions[^"]*" data-markdown-url="${BASE}/docs/getting-started.md"`));
    assert.match(page, /aria-controls="portal-page-actions-panel"/);
  });
});
