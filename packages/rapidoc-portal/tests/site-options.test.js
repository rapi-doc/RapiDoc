/**
 * Config batch 1 (design/config-batch-1.md): sub-path hosting, `head`, `theme.css`, the SEO keys and `llms`,
 * without a build. tests/base-path.test.js builds a portal with all of them.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ConfigError, convertConfig, resolveConfig } from '../src/index.js';
import { basePathOf } from '../src/config/normalizer.js';
import { withBase, withoutBase } from '../src/components/base-path.js';
import { pageTitle, portalHeadEntries, renderHeadHtml } from '../src/engine/page-head.js';
import { markdownUrlOf, pageUrlOfMarkdown, renderLlmsTxt, toMarkdown } from '../src/engine/llms.js';

function problemsOf(raw, baseDir = '/tmp') {
  try {
    resolveConfig(raw, baseDir);
  } catch (err) {
    assert.ok(err instanceof ConfigError, err.message);
    return err.problems;
  }
  assert.fail('config should be rejected');
}

const site = (extra = {}) => ({ title: 'Acme', ...extra });

describe('site options: config', () => {
  it('takes the base path from the path of site.url', () => {
    assert.equal(basePathOf('https://acme.com/developers/'), '/developers');
    assert.equal(basePathOf('https://acme.com/sales/developers'), '/sales/developers');
    assert.equal(basePathOf('https://developers.acme.com'), '');
    assert.equal(basePathOf(undefined), '');
    assert.equal(resolveConfig({ site: site({ url: 'https://acme.com/developers' }) }, '/tmp').site.basePath, '/developers');
  });

  it('makes site.image a full URL under site.url, and needs site.url for a file', () => {
    const config = resolveConfig({ site: site({ url: 'https://acme.com/developers', image: '/card.png' }) }, '/tmp');
    assert.equal(config.site.image, 'https://acme.com/developers/card.png');
    assert.equal(
      resolveConfig({ site: site({ image: 'https://cdn.example/card.png' }) }, '/tmp').site.image,
      'https://cdn.example/card.png'
    );
    assert.ok(problemsOf({ site: site({ image: '/card.png' }) }).some((p) => p.startsWith('site.image: needs site.url')));
  });

  it('defaults titleTemplate to "%s | <title>" and needs %s in it', () => {
    assert.equal(resolveConfig({ site: site() }, '/tmp').site.titleTemplate, '%s | Acme');
    assert.ok(problemsOf({ site: site({ titleTemplate: 'Acme Docs' }) }).some((p) => p.includes('needs %s')));
  });

  it('reads head entries: script attributes or inline code, link, meta', () => {
    const config = resolveConfig(
      {
        site: site(),
        head: [
          { script: { src: 'https://a.example/a.js', defer: true } },
          { script: 'window.a = 1;' },
          { link: { rel: 'preconnect', href: 'https://api.example' } },
          { meta: { name: 'google-site-verification', content: 'abc' } },
        ],
      },
      '/tmp'
    );
    assert.deepEqual(config.head, [
      { tag: 'script', attrs: { src: 'https://a.example/a.js', defer: true } },
      { tag: 'script', attrs: {}, content: 'window.a = 1;' },
      { tag: 'link', attrs: { rel: 'preconnect', href: 'https://api.example' } },
      { tag: 'meta', attrs: { name: 'google-site-verification', content: 'abc' } },
    ]);
    assert.ok(problemsOf({ site: site(), head: [{ style: 'a{}' }] }).length);
    assert.ok(problemsOf({ site: site(), head: [{ script: 'a', meta: { name: 'x' } }] }).length);
  });

  it('resolves theme.css next to the config and fails on a missing file', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rapidoc-css-test-'));
    try {
      fs.writeFileSync(path.join(dir, 'a.css'), '');
      assert.deepEqual(resolveConfig({ site: site(), theme: { css: './a.css' } }, dir).theme.css, [path.join(dir, 'a.css')]);
      assert.ok(problemsOf({ site: site(), theme: { css: ['./a.css', './missing.css'] } }, dir).some((p) => p.startsWith('theme.css[1]:')));
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('turns llms on by default, with every page action', () => {
    const on = resolveConfig({ site: site({ description: 'APIs.' }) }, '/tmp').llms;
    assert.deepEqual(on, { description: 'APIs.', pageActions: ['copy', 'markdown', 'chatgpt', 'claude'] });
    assert.equal(resolveConfig({ site: site(), llms: false }, '/tmp').llms, false);
    assert.deepEqual(resolveConfig({ site: site(), llms: { pageActions: false } }, '/tmp').llms.pageActions, []);
    assert.ok(problemsOf({ site: site(), llms: { pageActions: ['print'] } }).length);
  });
});

describe('site options: head and titles', () => {
  const config = resolveConfig(
    {
      site: site({ url: 'https://acme.com', image: '/card.png', noindex: true, titleTemplate: '%s · Acme' }),
      head: [{ meta: { name: 'x', content: 'a"b' } }],
    },
    '/tmp'
  );

  it('adds the preview image, the robots tag and the head entries', () => {
    const html = renderHeadHtml(portalHeadEntries(config));
    assert.match(html, /<meta property="og:image" content="https:\/\/acme.com\/card.png">/);
    assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
    assert.match(html, /<meta name="x" content="a&quot;b">/, 'attribute values are escaped');
  });

  it('titles pages with the template, and a page titled like the site with the title alone', () => {
    assert.equal(pageTitle(config, 'Quickstart'), 'Quickstart · Acme');
    assert.equal(pageTitle(config, 'Acme'), 'Acme');
  });
});

describe('site options: base path helpers', () => {
  it('adds the base to paths relative to the portal, and only to those', () => {
    assert.equal(withBase('/docs/a/', '/dev'), '/dev/docs/a/');
    assert.equal(withBase('/', '/dev'), '/dev/');
    for (const href of ['https://x.example/a', '//cdn.example/a', '#top', 'relative/a', '?q=1']) assert.equal(withBase(href, '/dev'), href);
    assert.equal(withBase('/docs/', ''), '/docs/');
  });

  it('removes the base from the current path', () => {
    assert.equal(withoutBase('/dev/docs/a/', '/dev'), '/docs/a/');
    assert.equal(withoutBase('/dev', '/dev'), '/');
    assert.equal(withoutBase('/developer/a', '/dev'), '/developer/a', 'only a whole segment');
  });
});

describe('site options: LLM output', () => {
  const portalConfig = {
    site: { basePath: '' },
    apis: [{ id: 'orders', title: 'Orders API', versions: [{ path: '/apis/orders', isDefault: true }] }],
  };

  it('maps page URLs to their Markdown and back', () => {
    assert.equal(markdownUrlOf('/'), '/index.md');
    assert.equal(markdownUrlOf('/docs/guides/a/'), '/docs/guides/a.md');
    assert.equal(pageUrlOfMarkdown('index.md'), '/');
    assert.equal(pageUrlOfMarkdown('docs/guides/a.md'), '/docs/guides/a/');
  });

  it('turns callouts, operation embeds, cards and tabs into Markdown, and leaves code alone', () => {
    const source = [
      '---',
      'title: Orders',
      '---',
      "import { Aside } from '@astrojs/starlight/components';",
      '',
      '{% callout type="tip" title="Good to know" %}',
      'Keys start with `sk_`.',
      '{% /callout %}',
      '',
      ':::caution[Limits]',
      '100 a second.',
      ':::',
      '',
      '<Aside type="note">MDX note.</Aside>',
      '',
      '{% api-operation spec="orders" path="/orders" method="post" title="Place an order" /%}',
      '',
      '{% card title="Quickstart" href="/docs/quickstart" %}Five minutes.{% /card %}',
      '',
      '{% tabs %}{% tab label="npm" %}npm i{% /tab %}{% /tabs %}',
      '',
      '```markdoc',
      '{% callout type="tip" %}example{% /callout %}',
      '```',
      'Inline `<Aside>` and `{% badge text="x" /%}` stay.',
    ].join('\n');
    const markdown = toMarkdown(source, portalConfig);
    assert.ok(!markdown.includes('title: Orders') && !markdown.includes('import {'), 'no frontmatter or imports');
    assert.match(markdown, /> \*\*Tip: Good to know\*\*\n> Keys start with `sk_`\./);
    assert.match(markdown, /> \*\*Caution: Limits\*\*\n> 100 a second\./);
    assert.match(markdown, /> \*\*Note:\*\*\n> MDX note\./);
    assert.match(markdown, /`POST \/orders` Place an order \(\[Orders API\]\(\/apis\/orders\)\)/);
    assert.match(markdown, /\*\*\[Quickstart\]\(\/docs\/quickstart\)\*\*/);
    assert.match(markdown, /\*\*npm\*\*/);
    assert.match(markdown, /```markdoc\n\{% callout type="tip" %\}example\{% \/callout %\}\n```/, 'code blocks unchanged');
    assert.match(markdown, /Inline `<Aside>` and `\{% badge text="x" \/%\}` stay\./, 'inline code unchanged');
  });

  it('adds the base path to links in the Markdown', () => {
    const markdown = toMarkdown('[Intro](/docs/intro/) and [site](https://x.example/a)\n\n[ref]: /docs/ref/', {
      ...portalConfig,
      site: { basePath: '/dev' },
    });
    assert.match(markdown, /\[Intro\]\(\/dev\/docs\/intro\/\)/);
    assert.match(markdown, /\(https:\/\/x.example\/a\)/);
    assert.match(markdown, /\[ref\]: \/dev\/docs\/ref\//);
  });

  it('lists only public APIs in llms.txt', () => {
    const config = {
      site: { title: 'Acme', url: 'https://acme.com/dev', basePath: '/dev' },
      llms: { description: 'APIs.' },
      tabs: [],
      apis: [
        {
          id: 'open',
          title: 'Open API',
          summary: 'Public.',
          versions: [{ path: '/apis/open', specUrl: '/specs/open.yaml', isDefault: true }],
        },
        { id: 'secret', title: 'Secret API', versions: [{ path: '/apis/secret', specUrl: '/specs/secret.yaml', isDefault: true }] },
      ],
    };
    const text = renderLlmsTxt(config, [], (url) => !url.startsWith('/apis/secret'));
    assert.match(text, /^# Acme\n\n> APIs\./);
    assert.match(text, /- \[Open API \(OpenAPI\)\]\(https:\/\/acme.com\/dev\/specs\/open.yaml\): Public\./);
    assert.ok(!text.includes('Secret'));
  });
});

describe('site options: migrate', () => {
  it('maps Zudoku basePath, metadata.title and publishMarkdown', () => {
    const { config, warnings } = convertConfig(
      {
        basePath: '/developers',
        canonicalUrlOrigin: 'https://acme.com',
        metadata: { title: '%s - Acme', defaultTitle: 'Acme' },
        docs: { publishMarkdown: false },
      },
      'zudoku'
    );
    assert.equal(config.site.url, 'https://acme.com/developers');
    assert.equal(config.site.titleTemplate, '%s - Acme');
    assert.equal(config.site.title, 'Acme');
    assert.equal(config.llms, false);
    assert.deepEqual(warnings, []);
    assert.ok(convertConfig({ basePath: '/x' }, 'zudoku').warnings.some((w) => w.startsWith('basePath:')));
  });

  it('maps Redocly seo and head scripts and links', () => {
    const { config, problems } = convertConfig(
      {
        seo: { title: 'Acme', siteUrl: 'https://acme.com', image: '/card.png', projectTitle: 'Acme Dev' },
        scripts: { head: [{ src: 'https://a.example/a.js', async: true, consent: 'analytics' }] },
        links: [{ rel: 'preconnect', href: 'https://api.example' }],
      },
      'redocly'
    );
    assert.deepEqual(problems, []);
    assert.equal(config.site.image, '/card.png');
    assert.equal(config.site.titleTemplate, '%s | Acme Dev');
    assert.deepEqual(config.head, [
      { script: { src: 'https://a.example/a.js', async: true } },
      { link: { rel: 'preconnect', href: 'https://api.example' } },
    ]);
  });
});
