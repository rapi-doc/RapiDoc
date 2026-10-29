import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import YAML from 'yaml';
import { ConfigError, compileMarkdoc, convertConfig, loadConfig, migrateConfig, resolveConfig } from '../src/index.js';
import { activeTab } from '../src/components/header-nav.js';
import { apiReferencePaths } from '../src/engine/api-routes.js';
import { copySpecs } from '../src/engine/sync-assets.js';
import { checkPortalSpecs } from '../src/engine/spec-checks.js';
import { buildSearchIndex } from '../src/search/indexer.js';

/** A spec with one operation per tag. */
const spec = (version, tags = ['Labels']) =>
  JSON.stringify({
    openapi: '3.1.0',
    info: { title: 'Labels API', version },
    paths: Object.fromEntries(
      tags.map((tag) => [`/${tag.toLowerCase()}`, { get: { operationId: `list${tag}`, summary: `List ${tag}`, tags: [tag] } }])
    ),
  });

const SPECS = {
  'specs/labels-v3.json': spec('3.0.0', ['Labels', 'Stamps']),
  'specs/labels-v2.json': spec('2.0.0', ['Labels']),
  'specs/labels-v1.json': spec('1.0.0'),
};

async function withProject(files, fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rapidoc-versioning-test-'));
  try {
    for (const [name, content] of Object.entries({ ...SPECS, ...files })) {
      fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
      fs.writeFileSync(path.join(dir, name), typeof content === 'string' ? content : YAML.stringify(content));
    }
    return await fn(dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

const config = (apis, extra = {}) => ({ site: { title: 'Versions' }, apis, ...extra });
const LABELS = {
  id: 'labels',
  versions: [
    { spec: './specs/labels-v3.json', version: 'v3', label: 'v3 (latest)' },
    './specs/labels-v2.json',
    { spec: './specs/labels-v1.json', version: 'v1' },
  ],
};

function problemsOf(raw, baseDir = '/tmp') {
  try {
    resolveConfig(raw, baseDir);
  } catch (err) {
    assert.ok(err instanceof ConfigError, err.message);
    return err.problems;
  }
  assert.fail('config should be rejected');
}

describe('API versions: config', () => {
  it('gives each version its URL, label and spec URLs; the first is the default', async () => {
    await withProject({ 'rapidoc.config.yaml': config([LABELS]) }, async (dir) => {
      const { config: portal } = await loadConfig(dir);
      const [api] = portal.apis;
      assert.equal(api.versioned, true);
      assert.deepEqual(
        api.versions.map((v) => [v.version, v.label, v.path, v.specUrl, v.pinnedSpecUrl, v.isDefault]),
        [
          ['v3', 'v3 (latest)', '/apis/labels', '/specs/labels.json', '/specs/labels/v3.json', true],
          ['2.0.0', '2.0.0', '/apis/labels/2.0.0', '/specs/labels/2.0.0.json', '/specs/labels/2.0.0.json', false],
          ['v1', '1.0.0', '/apis/labels/v1', '/specs/labels/v1.json', '/specs/labels/v1.json', false],
        ],
        'version and label default to info.version'
      );
      // The API itself describes its default version, as an API with `spec:` does
      assert.deepEqual([api.path, api.specUrl, api.version, api.title], ['/apis/labels', '/specs/labels.json', '3.0.0', 'Labels API']);
    });
  });

  it('gives an API with spec: one version and no pinned URLs', async () => {
    await withProject({ 'rapidoc.config.yaml': config([{ id: 'labels', spec: './specs/labels-v1.json' }]) }, async (dir) => {
      const [api] = (await loadConfig(dir)).config.apis;
      assert.equal(api.versioned, false);
      assert.equal(api.versions.length, 1);
      assert.equal(api.versions[0].pinnedSpecUrl, null);
    });
  });

  it('rejects spec with versions, a URL version without version, and version without api', () => {
    assert.deepEqual(problemsOf(config([{ id: 'a', spec: './a.json', versions: ['./b.json'] }])), [
      'apis[0]: An API can have only one of: spec, versions (found spec, versions)',
    ]);
    assert.deepEqual(problemsOf(config([{ id: 'a' }])), ['apis[0]: An API needs one of: spec, versions']);
    assert.deepEqual(problemsOf(config([{ id: 'a', versions: [{ spec: 'https://example.com/a.json' }] }])), [
      'apis[0].versions[0].version: a version whose spec is a URL needs `version`',
    ]);
    assert.deepEqual(problemsOf(config([{ id: 'a', versions: [{ spec: './a.json', version: 'V2' }] }])), [
      'apis[0].versions[0].version: use lowercase letters, digits, dots and dashes',
    ]);
    assert.deepEqual(problemsOf(config([], { navigation: [{ label: 'Docs', href: '/docs/', version: 'v1' }] })), [
      'navigation[0].version: `version` needs `api`',
    ]);
  });

  it('rejects versions without a usable info.version, duplicate versions and unknown versions in navigation', async () => {
    await withProject(
      { 'specs/odd.json': spec('Version 2'), 'specs/none.json': '{"openapi":"3.1.0","info":{"title":"x"}}' },
      async (dir) => {
        assert.deepEqual(problemsOf(config([{ id: 'a', versions: ['./specs/odd.json', './specs/none.json'] }]), dir), [
          'apis[0].versions[0].version: info.version "Version 2" of ./specs/odd.json is not a URL segment; set version (lowercase letters, digits, dots, dashes)',
          'apis[0].versions[1].version: ./specs/none.json has no info.version; set version',
        ]);
        assert.deepEqual(
          problemsOf(
            config([{ id: 'a', versions: ['./specs/labels-v1.json', { spec: './specs/labels-v2.json', version: '1.0.0' }] }]),
            dir
          ),
          ['apis[0].versions[1].version: "1.0.0" is used by another version']
        );
        assert.deepEqual(problemsOf(config([LABELS], { navigation: [{ label: 'Old', api: 'labels', version: 'v9' }] }), dir), [
          'navigation: API "labels" has no version "v9" (versions: v3, 2.0.0, v1)',
        ]);
      }
    );
  });

  it('links navigation to the default version, or to the version it names, and marks the matching tab', async () => {
    const navigation = [
      { label: 'Labels', api: 'labels' },
      { label: 'Labels v1', api: 'labels', version: 'v1' },
      { label: 'Guides', items: [{ api: 'labels', version: 'v1', label: 'Old labels' }] },
    ];
    await withProject({ 'rapidoc.config.yaml': config([LABELS], { navigation }) }, async (dir) => {
      const { config: portal } = await loadConfig(dir);
      assert.deepEqual(
        portal.tabs.map((t) => [t.label, t.href]),
        [
          ['Labels', '/apis/labels'],
          ['Labels v1', '/apis/labels/v1'],
          ['Guides', '/apis/labels/v1'],
        ]
      );
      assert.equal(portal.tabs[2].sidebar[0].link, '/apis/labels/v1');
      assert.equal(activeTab(portal.tabs, '/apis/labels/stamps').label, 'Labels');
      assert.equal(activeTab(portal.tabs, '/apis/labels/2.0.0/labels').label, 'Labels', 'other versions belong to the API tab');
      assert.equal(activeTab(portal.tabs, '/apis/labels/v1/labels').label, 'Labels v1', 'a version tab wins on its own pages');
    });
  });

  it('keeps an API with only a version tab in the catalog tab', async () => {
    const navigation = [
      { label: 'Catalog', catalog: true },
      { label: 'Labels v1', api: 'labels', version: 'v1' },
    ];
    await withProject({ 'rapidoc.config.yaml': config([LABELS], { navigation }) }, async (dir) => {
      const { tabs } = (await loadConfig(dir)).config;
      assert.equal(activeTab(tabs, '/apis/labels').label, 'Catalog');
      assert.equal(activeTab(tabs, '/apis/labels/v1').label, 'Labels v1');
    });
  });
});

describe('API versions: pages, specs and search', () => {
  it('builds pages per version, and redirects pinned URLs of the default version', async () => {
    await withProject({ 'rapidoc.config.yaml': config([LABELS]) }, async (dir) => {
      const { config: portal } = await loadConfig(dir);
      const paths = await apiReferencePaths(portal.apis);
      const pages = paths
        .filter((p) => !p.props.redirectTo)
        .map((p) => [p.params.apiRoute, p.props.version.version, p.props.activeTagSlug]);
      assert.deepEqual(pages, [
        ['labels', 'v3', ''],
        ['labels/labels', 'v3', 'labels'],
        ['labels/stamps', 'v3', 'stamps'],
        ['labels/2.0.0', '2.0.0', ''],
        ['labels/2.0.0/labels', '2.0.0', 'labels'],
        ['labels/v1', 'v1', ''],
        ['labels/v1/labels', 'v1', 'labels'],
      ]);
      assert.deepEqual(
        paths.filter((p) => p.props.redirectTo).map((p) => [p.params.apiRoute, p.props.redirectTo]),
        [
          ['labels/v3', '/apis/labels'],
          ['labels/v3/labels', '/apis/labels/labels'],
          ['labels/v3/stamps', '/apis/labels/stamps'],
        ]
      );
      assert.deepEqual(
        paths[0].props.versionTags,
        [['labels', 'stamps'], ['labels'], ['labels']],
        'the picker knows the tags of each version'
      );
    });
  });

  it('fails when a version has the URL of a tag page of the default version', async () => {
    const apis = [{ id: 'labels', versions: ['./specs/labels-v3.json', { spec: './specs/labels-v1.json', version: 'stamps' }] }];
    await withProject({ 'rapidoc.config.yaml': config(apis) }, async (dir) => {
      const { config: portal } = await loadConfig(dir);
      await assert.rejects(apiReferencePaths(portal.apis), /version "stamps" has the URL of a tag page of the default version/);
    });
  });

  it('publishes every version under /specs, the default also at /specs/<id><ext>', async () => {
    await withProject({ 'rapidoc.config.yaml': config([LABELS]) }, async (dir) => {
      const { config: portal } = await loadConfig(dir);
      const publicDir = path.join(dir, 'out');
      copySpecs(portal, publicDir);
      const files = fs.readdirSync(path.join(publicDir, 'specs'), { recursive: true }).sort();
      assert.deepEqual(files, ['labels', 'labels.json', 'labels/2.0.0.json', 'labels/v1.json', 'labels/v3.json']);
      assert.equal(JSON.parse(fs.readFileSync(path.join(publicDir, 'specs/labels/v1.json'), 'utf8')).info.version, '1.0.0');
    });
  });

  it('indexes every version, versions other than the default at their own URLs', async () => {
    await withProject({ 'rapidoc.config.yaml': config([LABELS]) }, async (dir) => {
      const { config: portal } = await loadConfig(dir);
      const records = buildSearchIndex(portal, dir).records.map((r) => [r.id, r.url, r.category]);
      assert.deepEqual(records, [
        ['api-labels-get-/labels', '/apis/labels#listLabels', 'Labels API'],
        ['api-labels-get-/stamps', '/apis/labels#listStamps', 'Labels API'],
        ['api-labels@2.0.0-get-/labels', '/apis/labels/2.0.0#listLabels', 'Labels API · 2.0.0'],
        ['api-labels@v1-get-/labels', '/apis/labels/v1#listLabels', 'Labels API · 1.0.0'],
      ]);
    });
  });

  it('checks the spec of every version', async () => {
    const noIds = JSON.stringify({ openapi: '3.1.0', info: { title: 'x', version: '1' }, paths: { '/a': { get: { summary: 'A' } } } });
    const apis = [{ id: 'labels', versions: ['./specs/labels-v2.json', { spec: './specs/old.json', version: 'v1' }] }];
    await withProject({ 'specs/old.json': noIds, 'rapidoc.config.yaml': config(apis) }, async (dir) => {
      const warnings = checkPortalSpecs((await loadConfig(dir)).config);
      assert.equal(warnings.length, 1);
      assert.match(warnings[0], /^labels v1: 1 operation has no operationId/);
    });
  });

  it('embeds an operation of a version with compileMarkdoc()', () => {
    const { html } = compileMarkdoc('{% api-operation spec="labels" version="v1" path="/labels" method="get" /%}', {
      variables: { specUrls: { labels: '/specs/labels.json', 'labels@v1': '/specs/labels/v1.json' } },
    });
    assert.match(html, /data-version="v1"/);
    assert.match(html, /spec-url="\/specs\/labels\/v1\.json"/);
  });
});

describe('API versions: rapidoc migrate --from zudoku', () => {
  it('turns an input list into versions, with redirects from the old version URLs', () => {
    const {
      config: migrated,
      problems,
      warnings,
    } = convertConfig(
      {
        site: { title: 'Z' },
        navigation: [{ type: 'link', label: 'Labels', to: '/api' }],
        apis: [
          {
            type: 'file',
            path: '/api',
            input: [
              { path: 'v3', label: 'Version 3', input: './label-v3.json' },
              './label-v2.json',
              { path: 'v1', input: './all.json?prefix=/v1' },
            ],
          },
          { type: 'file', path: '/tracking', input: ['./tracking.json'] },
          { type: 'url', input: [{ path: 'v2', input: 'https://example.com/b.json?token=1' }] },
        ],
      },
      'zudoku'
    );
    assert.deepEqual(problems, []);
    assert.deepEqual(migrated.apis, [
      {
        id: 'api',
        versions: [
          { spec: './label-v3.json', version: 'v3', label: 'Version 3' },
          './label-v2.json',
          { spec: './all.json', version: 'v1' },
        ],
      },
      { id: 'tracking', spec: './tracking.json' },
      { id: 'b', versions: [{ spec: 'https://example.com/b.json?token=1', version: 'v2' }] },
    ]);
    assert.deepEqual(migrated.navigation, [{ label: 'Labels', api: 'api' }]);
    assert.deepEqual(migrated.redirects, [
      { from: '/api', to: '/apis/api' },
      { from: '/api/v3', to: '/apis/api' },
      { from: '/api/v1', to: '/apis/api/v1' },
      { from: '/tracking', to: '/apis/tracking' },
    ]);
    assert.deepEqual(warnings, [
      'apis[0].input[2]: "./all.json?prefix=/v1" selects part of a spec (?prefix=/v1), which RapiDoc Portal doesn\'t do; it now shows all of ./all.json',
    ]);
  });

  it('takes the id of a versioned API without a path from its first file, without the version', () => {
    const { config: migrated } = convertConfig({ apis: { type: 'file', input: ['./label-v3.json', './label-v2.json'] } }, 'zudoku');
    assert.equal(migrated.apis[0].id, 'label');
  });

  it('migrates a zudoku.config.mjs with versions into a config that loads', async () => {
    const zudoku = `export default {
  apis: { type: 'file', path: '/labels', input: [{ path: 'v3', input: './specs/labels-v3.json' }, './specs/labels-v2.json'] },
};\n`;
    await withProject({ 'zudoku.config.mjs': zudoku }, async (dir) => {
      const result = await migrateConfig(dir, { from: 'zudoku' });
      assert.deepEqual(result.problems, []);
      const { config: portal } = await loadConfig(dir);
      assert.deepEqual(
        portal.apis[0].versions.map((v) => v.path),
        ['/apis/labels', '/apis/labels/2.0.0']
      );
    });
  });
});
