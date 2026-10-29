import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPortal, ConfigError, resolveConfig } from '../src/index.js';
import { compilePattern, createZoneMatcher, normalizeAccess } from '../src/access/rules.js';
import { AccessRuleError, splitOutput, urlOfFile } from '../src/access/split-output.js';
import { createStarlightOptions } from '../src/engine/starlight-options.js';

const DEMO_PORTAL_DIR =
  process.env.RAPIDOC_DEMO_PORTAL_DIR ?? fileURLToPath(new URL('../../../../rapi-portal-demo/fixtures/zudoku-cosmo-cargo', import.meta.url));
// Projects that are built must share a parent folder with this package (Astro compiles .astro files only
// there), so the copy goes into tests/.test-tmp/ (git-ignored), not the OS temp folder.
const TEST_TMP = fileURLToPath(new URL('./.test-tmp/', import.meta.url));

const AUTH = { issuer: 'https://idp.example.com', clientId: 'portal-web' };

function problemsOf(raw) {
  try {
    resolveConfig(raw, '/tmp');
  } catch (err) {
    assert.ok(err instanceof ConfigError, err.message);
    return err.problems;
  }
  assert.fail('config should be rejected');
}

function writeTree(dir, files) {
  for (const [name, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    fs.writeFileSync(path.join(dir, name), content);
  }
}

describe('access rules', () => {
  it('matches * within one segment and ** across any number, ignoring a trailing slash', () => {
    const docs = compilePattern('/docs/internal/**');
    assert.ok(docs.test('/docs/internal'));
    assert.ok(docs.test('/docs/internal/a/b'));
    assert.ok(!docs.test('/docs/internal-x'));
    const one = compilePattern('/apis/*/v1');
    assert.ok(one.test('/apis/billing/v1'));
    assert.ok(!one.test('/apis/billing/x/v1'));
    assert.ok(compilePattern('/docs/a/').test('/docs/a'));
    assert.ok(compilePattern('/**').test(''), '/** covers the home page');
    assert.ok(compilePattern('/a.b').test('/a.b') && !compilePattern('/a.b').test('/axb'), 'dots are literal');
  });

  it('gives every path the zone of the first matching rule, else the default', () => {
    const access = normalizeAccess({
      default: 'signed-in',
      rules: [
        { path: '/docs/partners/faq', allow: 'public' },
        { path: '/docs/partners/**', allow: { groups: ['partners'] } },
        { path: '/docs/unused/**', allow: 'public' },
      ],
    });
    const { zoneOf, matched } = createZoneMatcher(access);
    assert.equal(zoneOf('/docs/partners/faq/'), 'public');
    assert.match(zoneOf('/docs/partners/pricing'), /^m-[0-9a-f]{10}$/);
    assert.equal(zoneOf('/docs/other'), 'signed-in');
    assert.equal(zoneOf('/docs/partners/faq#section'), 'public', 'query and hash are ignored');
    assert.deepEqual([...matched].sort(), [0, 1]);
    assert.equal(access.enabled, true);
    assert.equal(normalizeAccess({}).enabled, false, 'everything public: nothing to protect');
  });

  it('gives equal allows one zone, whatever the order of groups', () => {
    const access = normalizeAccess({
      rules: [
        { path: '/a', allow: { groups: ['x', 'y'] } },
        { path: '/b', allow: { groups: ['y', 'x', 'x'] } },
      ],
    });
    assert.equal(access.rules[0].zone, access.rules[1].zone);
    assert.equal(Object.keys(access.zones).length, 2);
  });
});

describe('auth and access in rapidoc.config.yaml', () => {
  it('fills in auth defaults and publishes specs at /specs/<api id><ext>', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rapidoc-access-config-'));
    try {
      writeTree(dir, { 'specs/orders-v2.yaml': 'openapi: 3.1.0\ninfo: { title: Orders, version: 1.0.0 }\npaths: {}\n' });
      const config = resolveConfig(
        {
          site: { title: 'Acme' },
          apis: [
            { id: 'orders', spec: './specs/orders-v2.yaml' },
            { id: 'remote', spec: 'https://example.com/openapi.json' },
          ],
          auth: AUTH,
        },
        dir
      );
      assert.deepEqual(config.auth, {
        provider: 'oidc',
        issuer: AUTH.issuer,
        clientId: AUTH.clientId,
        scopes: ['openid', 'profile', 'email'],
        claims: { groups: 'groups' },
        session: { maxAge: '8h' },
        logout: 'local',
        label: 'Sign in',
        audience: null,
        tryIt: false,
      });
      assert.equal(config.apis[0].specUrl, '/specs/orders.yaml');
      assert.equal(config.apis[1].specUrl, 'https://example.com/openapi.json');
      assert.equal(config.access.enabled, false);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('rejects protection without sign-in, reserved paths and malformed rules', () => {
    assert.deepEqual(problemsOf({ site: { title: 'A' }, access: { default: 'signed-in' } }), [
      'access.default: needs "auth"; who is signed in is only known when sign-in is configured',
    ]);
    assert.deepEqual(
      problemsOf({
        site: { title: 'A' },
        auth: AUTH,
        access: {
          rules: [
            { path: '/_rapidoc/assets/**', allow: 'signed-in' },
            { path: '/_rapidoc', allow: 'public' },
          ],
        },
        redirects: [{ from: '/_rapidoc/old', to: '/' }],
      }),
      [
        'access.rules[0].path: /_rapidoc/ holds no page content and is always public',
        'access.rules[1].path: /_rapidoc/ holds no page content and is always public',
        'redirects[0].from: /_rapidoc/ is reserved for the portal',
      ]
    );
    assert.deepEqual(problemsOf({ site: { title: 'A' }, auth: AUTH, access: { rules: [{ path: '/a', allow: {} }] } }), [
      'access.rules[0].allow: needs groups or emails',
    ]);
    assert.deepEqual(problemsOf({ site: { title: 'A' }, auth: { ...AUTH, session: { maxAge: '8 hours' } } }), [
      'auth.session.maxAge: use a number and a unit: 30m, 8h, 7d',
    ]);
    assert.ok(
      problemsOf({ site: { title: 'A' }, auth: { ...AUTH, clientSecret: 'x' } })[0].includes('unknown key "clientSecret"'),
      'no secrets in the config'
    );
  });

  it('merges one Pagefind bundle per protected zone into Starlight search', () => {
    const config = resolveConfig(
      { site: { title: 'A' }, auth: AUTH, access: { default: 'signed-in', rules: [{ path: '/docs/a/**', allow: { groups: ['g'] } }] } },
      '/tmp'
    );
    const zones = Object.keys(config.access.zones);
    assert.deepEqual(
      createStarlightOptions(config).pagefind.mergeIndex.map((m) => m.bundlePath),
      zones.map((zone) => `/_rapidoc/search/${zone}/pagefind/`)
    );
    assert.equal(createStarlightOptions(resolveConfig({ site: { title: 'A' } }, '/tmp')).pagefind, true);
  });
});

describe('splitting a build for rapidoc serve', () => {
  const page = (body) => `<html><body><main data-pagefind-body>${body}</main></body></html>`;

  /** <tmp>/project/specs/billing.json and the build output <tmp>/project/dist/ with these files. */
  function fakeBuild(files) {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), 'rapidoc-split-'));
    writeTree(project, { 'specs/billing.json': '{"openapi":"3.1.0","info":{"title":"Billing","version":"1"},"paths":{}}' });
    const dir = path.join(project, 'dist');
    writeTree(dir, files);
    return dir;
  }

  function configFor(dir, access, extra = {}) {
    return resolveConfig(
      {
        site: { title: 'Acme', url: 'https://dev.acme.test', logo: { src: '/logo.svg' } },
        apis: [
          { id: 'billing', spec: './specs/billing.json' },
          { id: 'partner', spec: 'https://partner.example.com/openapi.json' },
        ],
        auth: AUTH,
        access,
        search: false,
        ...extra,
      },
      path.dirname(dir)
    );
  }

  it('maps built files to URLs', () => {
    assert.equal(urlOfFile('index.html'), '/');
    assert.equal(urlOfFile('docs/a/index.html'), '/docs/a/');
    assert.equal(urlOfFile('specs/x.json'), '/specs/x.json');
  });

  it('moves protected files out of the public folder and records their zones', async () => {
    const dir = fakeBuild({
      'index.html': page(`Home <rapi-doc-mini spec-url="/specs/billing.json"></rapi-doc-mini>`),
      'logo.svg': '<svg/>',
      'docs/billing/index.html': page('Billing secrets'),
      'apis/billing/index.html': page('Billing API'),
      'specs/billing.json': '{}',
      '_rapidoc/assets/app.js': 'x',
      'sitemap-0.xml':
        '<urlset><url><loc>https://dev.acme.test/</loc></url><url><loc>https://dev.acme.test/docs/billing/</loc></url><url><loc>https://dev.acme.test/_rapidoc/access-denied/</loc></url></urlset>',
      'search-index.json': JSON.stringify({ version: 1, records: [{ url: '/' }, { url: '/docs/billing#a' }] }),
    });
    try {
      const config = configFor(dir, {
        default: 'signed-in',
        rules: [
          { path: '/', allow: 'public' },
          { path: '/docs/billing/**', allow: { groups: ['billing-team'] } },
          { path: '/apis/billing/**', allow: { groups: ['billing-team'] } },
          { path: '/apis/partner/**', allow: 'signed-in' },
          { path: '/sitemap-*.xml', allow: 'public' },
        ],
      });
      // /apis/partner has no built page in this fake build, so that rule would match nothing.
      writeTree(dir, { 'apis/partner/index.html': page('Partner API') });
      const result = await splitOutput(dir, config);

      assert.deepEqual(fs.readdirSync(dir).sort(), ['protected', 'public', 'rapidoc-server.json']);
      const billingZone = config.access.rules[1].zone;
      const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'rapidoc-server.json'), 'utf8'));
      assert.deepEqual(manifest.files, {
        'apis/billing/index.html': billingZone,
        'apis/partner/index.html': 'signed-in',
        'docs/billing/index.html': billingZone,
        'specs/billing.json': billingZone,
      });
      assert.deepEqual(manifest.access.groups, ['billing-team']);
      assert.equal(manifest.auth.issuer, AUTH.issuer);
      assert.ok(fs.existsSync(path.join(dir, 'public/logo.svg')), 'the logo stays public even with default signed-in');
      assert.ok(fs.existsSync(path.join(dir, 'public/_rapidoc/assets/app.js')));

      const sitemap = fs.readFileSync(path.join(dir, 'public/sitemap-0.xml'), 'utf8');
      assert.ok(sitemap.includes('https://dev.acme.test/</loc>'));
      assert.ok(!sitemap.includes('/docs/billing/') && !sitemap.includes('/_rapidoc/'));

      const publicIndex = JSON.parse(fs.readFileSync(path.join(dir, 'public/search-index.json'), 'utf8'));
      assert.deepEqual(publicIndex.records, [{ url: '/' }]);
      const zoneIndex = JSON.parse(fs.readFileSync(path.join(dir, `protected/_rapidoc/search/${billingZone}/search-index.json`), 'utf8'));
      assert.deepEqual(zoneIndex.records, [{ url: '/docs/billing#a' }]);

      assert.equal(result.protectedPages, 3);
      assert.deepEqual(result.warnings, [
        'API "partner" is protected but its spec is a URL (https://partner.example.com/openapi.json); the browser fetches it from there, so protect it there.',
        '/ is public but embeds an operation of the protected API "billing"; readers without access see an error there.',
      ]);
    } finally {
      fs.rmSync(path.dirname(dir), { recursive: true, force: true });
    }
  });

  it('fails on a rule that matches nothing, so a typo cannot leave content public', async () => {
    const dir = fakeBuild({ 'docs/partners/index.html': page('Partners') });
    try {
      const config = configFor(dir, { rules: [{ path: '/docs/partner/**', allow: 'signed-in' }] });
      await assert.rejects(splitOutput(dir, config), (err) => {
        assert.ok(err instanceof AccessRuleError);
        assert.match(err.message, /access\.rules\[0\]\.path: \/docs\/partner\/\*\*/);
        return true;
      });
    } finally {
      fs.rmSync(path.dirname(dir), { recursive: true, force: true });
    }
  });
});

describe('building a portal with sign-in', () => {
  let projectDir;
  let outDir;
  let result;

  before(async () => {
    projectDir = path.join(TEST_TMP, `demo-auth-${process.pid}`);
    fs.rmSync(projectDir, { recursive: true, force: true });
    fs.cpSync(DEMO_PORTAL_DIR, projectDir, {
      recursive: true,
      filter: (src) => !/[\\/](dist|node_modules|\.git|\.rapidoc-temp)$/.test(src),
    });
    fs.appendFileSync(
      path.join(projectDir, 'rapidoc.config.yaml'),
      [
        'auth:',
        '  issuer: https://idp.example.com',
        '  clientId: portal-web',
        'access:',
        '  rules:',
        '    - path: /docs/billing/**',
        '      allow:',
        '        groups: [billing-team]',
        '    - path: /apis/labels/**',
        '      allow: signed-in',
        '',
      ].join('\n')
    );
    outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rapidoc-portal-auth-build-'));
    result = await buildPortal(projectDir, { outDir });
  });

  after(() => {
    fs.rmSync(projectDir, { recursive: true, force: true });
    fs.rmSync(outDir, { recursive: true, force: true });
    try {
      fs.rmdirSync(TEST_TMP);
    } catch {
      // another test run still uses it
    }
  });

  it('splits the output into public and protected folders with a server manifest', () => {
    assert.deepEqual(fs.readdirSync(outDir).sort(), ['protected', 'public', 'rapidoc-server.json']);
    assert.equal(
      result.access.protectedPages,
      16,
      '3 billing docs + every version of the labels API: v3 (3 pages and 3 redirects from /apis/labels/v3), v2 (4) and v1 (3)'
    );
    assert.ok(fs.existsSync(path.join(outDir, 'protected/docs/billing/refunds/index.html')));
    assert.ok(fs.existsSync(path.join(outDir, 'protected/apis/labels/v1/index.html')), 'a rule on /apis/<id>/** covers every version');
    for (const spec of ['labels.json', 'labels/v3.json', 'labels/v2.json', 'labels/v1.json']) {
      assert.ok(fs.existsSync(path.join(outDir, 'protected/specs', spec)), `the spec ${spec} follows its version's pages`);
    }
    assert.ok(fs.existsSync(path.join(outDir, 'public/specs/shipments.json')));
    assert.ok(fs.existsSync(path.join(outDir, 'public/_rapidoc/access-denied/index.html')));
    assert.ok(fs.existsSync(path.join(outDir, 'public/_rapidoc/sign-in-error/index.html')));
    assert.ok(fs.existsSync(path.join(outDir, 'public/oauth-receiver.html')), "RapiDoc's OAuth return page stays public");
    assert.ok(fs.readdirSync(path.join(outDir, 'public/_rapidoc/assets')).length > 0, 'build assets stay public');
    assert.ok(!fs.existsSync(path.join(outDir, 'protected/_rapidoc/assets')));
    assert.ok(fs.existsSync(path.join(outDir, 'protected/_rapidoc/search/_empty/pagefind/pagefind-entry.json')));
  });

  it('leaves no protected text anywhere in the public folder', () => {
    const secret = 'seized at customs'; // docs/billing/refunds.md
    const leaks = fs
      .readdirSync(path.join(outDir, 'public'), { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => path.join(entry.parentPath, entry.name))
      .filter((file) => fs.readFileSync(file, 'utf8').includes(secret));
    assert.deepEqual(leaks, []);
    assert.ok(fs.readFileSync(path.join(outDir, 'protected/docs/billing/refunds/index.html'), 'utf8').includes(secret));
  });

  it('adds the sign-in slot to the header', () => {
    const home = fs.readFileSync(path.join(outDir, 'public/index.html'), 'utf8');
    assert.ok(home.includes('class="portal-user"'));
    assert.ok(home.includes('/_rapidoc/auth/me'));
  });
});

describe('Try-it with the sign-in token (auth.tryIt)', () => {
  it('accepts audience and tryIt, and rejects oauth-receiver under rapidoc:', () => {
    const config = resolveConfig({ site: { title: 'A' }, auth: { ...AUTH, audience: 'https://api.example.com', tryIt: true } }, '/tmp');
    assert.equal(config.auth.audience, 'https://api.example.com');
    assert.equal(config.auth.tryIt, true);
    assert.deepEqual(problemsOf({ site: { title: 'A' }, auth: { ...AUTH, tryIt: 'yes' } }), [
      'auth.tryIt: Invalid input: expected boolean, received string',
    ]);
    assert.deepEqual(problemsOf({ site: { title: 'A' }, rapidoc: { 'oauth-receiver': '/x.html' } }), [
      'rapidoc.oauth-receiver: set by the portal',
    ]);
  });
});
