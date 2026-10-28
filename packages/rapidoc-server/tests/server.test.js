import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createApp } from '../src/index.js';
import { createBrowser, PORTAL_ORIGIN, startIssuer, testEnv, writeFixtureBuild } from './helpers.js';

const quiet = () => {};

describe('rapidoc serve: sign-in and access rules', () => {
  let issuer;
  let distDir;
  let app;

  before(async () => {
    issuer = await startIssuer();
    issuer.addUser('ann', { name: 'Ann Reader', email: 'ann@example.com', email_verified: true, groups: ['readers', 'secret-team'] });
    issuer.addUser('bob', { name: 'Bob Billing', email: 'bob@example.com', email_verified: true, groups: ['billing-team'] });
    issuer.addUser('fay', { name: 'Fay Finance', email: 'fay@finance.example.com', email_verified: true, groups: [] });
    issuer.addUser('ned', { name: 'Ned Unverified', email: 'ned@finance.example.com', email_verified: false, groups: [] });
    distDir = writeFixtureBuild();
    ({ app } = await createApp({ distDir, env: testEnv(issuer.issuer), log: quiet }));
  });

  after(async () => {
    await issuer.close();
    fs.rmSync(distDir, { recursive: true, force: true });
  });

  async function signedInBrowser(user) {
    const browser = createBrowser(app);
    issuer.signInAs(user);
    const { response, url } = await browser.visit('/_rapidoc/auth/login?returnTo=/docs/intro/');
    assert.equal(url.href, `${PORTAL_ORIGIN}/docs/intro/`, 'back where sign-in started');
    assert.equal(response.status, 200);
    return browser;
  }

  it('serves public files to everyone, with long caching only for build assets', async () => {
    const browser = createBrowser(app);
    const home = await browser.send('/');
    assert.equal(home.status, 200);
    assert.match(await home.text(), /Home/);
    assert.equal((await browser.send('/docs/intro')).status, 200, 'directory URL without slash');
    const asset = await browser.send('/_astro/app.abc123.js');
    assert.match(asset.headers.get('cache-control'), /immutable/);
    assert.match(asset.headers.get('content-type'), /javascript/);
  });

  it('sends signed-out readers of protected pages to sign-in, and answers files with 401', async () => {
    const browser = createBrowser(app);
    const page = await browser.send('/docs/partners/');
    assert.equal(page.status, 302);
    assert.equal(page.headers.get('location'), '/_rapidoc/auth/login?returnTo=%2Fdocs%2Fpartners%2F');
    assert.equal(page.headers.get('cache-control'), 'private, no-store');
    assert.equal((await browser.send('/specs/billing.json')).status, 401);
  });

  it('never serves the manifest, zone search folders or paths outside the build', async () => {
    const browser = createBrowser(app);
    assert.equal((await browser.send('/rapidoc-server.json')).status, 404);
    assert.equal((await browser.send('/_rapidoc/search/m-billing/search-index.json')).status, 404);
    assert.equal((await browser.send('/%2e%2e/rapidoc-server.json')).status, 404, 'the URL parser resolves %2e%2e itself');
    assert.equal((await browser.send('/docs/..%2f..%2frapidoc-server.json')).status, 400, 'encoded slashes are decoded, then refused');
    assert.equal((await browser.send('/docs/%00')).status, 400);
  });

  it('signs in through the provider and returns to the page that asked', async () => {
    const browser = createBrowser(app);
    issuer.signInAs('ann');
    const { response, visited, url } = await browser.visit('/docs/partners/');
    assert.ok(
      visited.some((u) => u.startsWith(issuer.issuer)),
      'went through the provider'
    );
    assert.equal(url.pathname, '/docs/partners/');
    assert.equal(response.status, 200);
    assert.match(await response.text(), /Partners/);
    assert.equal(response.headers.get('vary'), 'Cookie');

    const me = await browser.send('/_rapidoc/auth/me');
    const body = await me.json();
    assert.deepEqual(body.user, { name: 'Ann Reader', email: 'ann@example.com', picture: '' });
    assert.deepEqual(body.zones.sort(), ['public', 'signed-in']);
  });

  it('shows the access-denied page (403) to signed-in readers outside the zone', async () => {
    const browser = await signedInBrowser('ann');
    const page = await browser.send('/docs/billing/invoices/');
    assert.equal(page.status, 403);
    assert.match(await page.text(), /Access denied/);
    assert.equal((await browser.send('/specs/billing.json')).status, 403);
  });

  it('lets group members and matching verified emails in', async () => {
    const bob = await signedInBrowser('bob');
    assert.equal((await bob.send('/docs/billing/invoices/')).status, 200);
    assert.equal((await bob.send('/specs/billing.json')).status, 200);

    const fay = await signedInBrowser('fay');
    assert.equal((await fay.send('/docs/billing/invoices/')).status, 200, 'email *@finance.example.com');

    const ned = await signedInBrowser('ned');
    assert.equal((await ned.send('/docs/billing/invoices/')).status, 403, 'unverified email does not count');
  });

  it('keeps only rule groups in the session', async () => {
    const browser = await signedInBrowser('ann');
    const res = await browser.send('/_rapidoc/auth/me');
    assert.ok(!JSON.stringify(await res.json()).includes('secret-team'));
    const cookie = browser.cookies().get('rapidoc-session');
    assert.ok(cookie && cookie.length < 3900, 'encrypted session cookie');
    assert.ok(!cookie.includes('Ann'), 'not readable');
  });

  it('merges search results of the zones a reader may see', async () => {
    const anonymous = await (await createBrowser(app).send('/search-index.json')).json();
    assert.deepEqual(
      anonymous.records.map((r) => r.url),
      ['/docs/intro']
    );
    const bob = await signedInBrowser('bob');
    const merged = await (await bob.send('/search-index.json')).json();
    assert.deepEqual(merged.records.map((r) => r.url).sort(), ['/docs/billing/invoices', '/docs/intro', '/docs/partners']);
    assert.equal(merged.totalRecords, 3);
  });

  it('answers each zone Pagefind bundle with the real one or the empty one', async () => {
    const anonymous = createBrowser(app);
    assert.equal(await (await anonymous.send('/_rapidoc/search/m-billing/pagefind/pagefind-entry.json')).text(), '{"zone":"empty"}');
    assert.equal(await (await anonymous.send('/_rapidoc/search/signed-in/pagefind/pagefind-entry.json')).text(), '{"zone":"empty"}');
    assert.equal((await anonymous.send('/_rapidoc/search/nope/pagefind/pagefind-entry.json')).status, 404);
    const bob = await signedInBrowser('bob');
    assert.equal(await (await bob.send('/_rapidoc/search/m-billing/pagefind/pagefind-entry.json')).text(), '{"zone":"billing"}');
  });

  it('reports locked links for the reader', async () => {
    const check = async (browser) => {
      const res = await browser.send('/_rapidoc/access/check', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ paths: ['/docs/intro/', '/docs/partners/', '/docs/billing/invoices', '/missing/', 42] }),
      });
      return (await res.json()).locked;
    };
    assert.deepEqual(await check(createBrowser(app)), ['/docs/partners/', '/docs/billing/invoices']);
    assert.deepEqual(await check(await signedInBrowser('ann')), ['/docs/billing/invoices']);
    assert.deepEqual(await check(await signedInBrowser('bob')), []);
  });

  it('signs out only on a same-origin POST', async () => {
    const browser = await signedInBrowser('ann');
    const crossSite = await browser.send('/_rapidoc/auth/logout', { method: 'POST', headers: { 'sec-fetch-site': 'cross-site' } });
    assert.equal(crossSite.status, 403);
    assert.equal((await browser.send('/_rapidoc/auth/me')).status, 200, 'still signed in');

    const signOut = await browser.send('/_rapidoc/auth/logout', { method: 'POST', headers: { 'sec-fetch-site': 'same-origin' } });
    assert.equal(signOut.status, 303);
    assert.equal(signOut.headers.get('location'), '/');
    assert.equal((await browser.send('/_rapidoc/auth/me')).status, 401);
  });

  it('sends failed sign-ins to the sign-in error page with a reason', async () => {
    const refused = createBrowser(app);
    issuer.signInAs(null);
    const { url } = await refused.visit('/_rapidoc/auth/login');
    assert.equal(url.pathname, '/_rapidoc/sign-in-error/');
    assert.equal(url.searchParams.get('reason'), 'denied');

    const noCookie = await createBrowser(app).send('/_rapidoc/auth/callback?code=x&state=y');
    assert.equal(noCookie.headers.get('location'), '/_rapidoc/sign-in-error/?reason=expired');
  });

  it('ignores a tampered session cookie', async () => {
    const browser = await signedInBrowser('bob');
    const jar = browser.cookies();
    jar.set('rapidoc-session', `${jar.get('rapidoc-session').slice(0, -4)}AAAA`);
    assert.equal((await browser.send('/_rapidoc/auth/me')).status, 401);
  });

  it('never redirects to another site after sign-in', async () => {
    const browser = createBrowser(app);
    issuer.signInAs('ann');
    for (const returnTo of ['https://evil.example', '//evil.example/x', '/\\evil.example', '/_rapidoc/auth/logout']) {
      const { url } = await browser.visit(`/_rapidoc/auth/login?returnTo=${encodeURIComponent(returnTo)}`);
      assert.equal(url.href, `${PORTAL_ORIGIN}/`, returnTo);
    }
  });
});

describe('rapidoc serve: a portal for signed-in readers only', () => {
  let issuer;
  let distDir;
  let app;

  before(async () => {
    issuer = await startIssuer();
    distDir = writeFixtureBuild({ defaultZone: 'signed-in' });
    ({ app } = await createApp({ distDir, env: testEnv(issuer.issuer), log: quiet }));
  });

  after(async () => {
    await issuer.close();
    fs.rmSync(distDir, { recursive: true, force: true });
  });

  it('does not reveal whether a page exists to signed-out readers', async () => {
    const browser = createBrowser(app);
    const missing = await browser.send('/docs/does-not-exist/', { headers: { accept: 'text/html' } });
    assert.equal(missing.status, 302, 'same answer as a protected page');
    assert.equal((await browser.send('/does-not-exist.json')).status, 401);
  });
});

describe('rapidoc serve: startup', () => {
  it('refuses to start without the secrets it needs', async () => {
    const distDir = writeFixtureBuild();
    try {
      await assert.rejects(createApp({ distDir, env: { RAPIDOC_SESSION_SECRET: 'short' }, log: quiet }), (err) => {
        assert.equal(err.name, 'SettingsError');
        assert.ok(err.problems.some((p) => p.includes('issuer')));
        assert.ok(err.problems.some((p) => p.includes('RAPIDOC_SESSION_SECRET')));
        return true;
      });
    } finally {
      fs.rmSync(distDir, { recursive: true, force: true });
    }
  });

  it('fails clearly when the provider cannot be discovered', async () => {
    const distDir = writeFixtureBuild();
    try {
      await assert.rejects(createApp({ distDir, env: testEnv('http://127.0.0.1:9/'), log: quiet }), /could not be discovered/);
    } finally {
      fs.rmSync(distDir, { recursive: true, force: true });
    }
  });

  it('serves a build without sign-in as plain static files', async () => {
    const distDir = writeFixtureBuild();
    try {
      fs.rmSync(`${distDir}/rapidoc-server.json`);
      const { app, settings } = await createApp({ distDir: `${distDir}/public`, env: {}, log: quiet });
      assert.equal(settings.mode, 'static');
      const browser = createBrowser(app);
      assert.equal((await browser.send('/docs/intro/')).status, 200);
      assert.equal((await browser.send('/_rapidoc/auth/me')).status, 404);
    } finally {
      fs.rmSync(distDir, { recursive: true, force: true });
    }
  });
});

describe('rapidoc serve: Try-it tokens (auth.tryIt)', () => {
  let issuer;
  let distDir;
  let app;

  before(async () => {
    issuer = await startIssuer();
    issuer.addUser('ann', { name: 'Ann Reader', email: 'ann@example.com', email_verified: true, groups: [] });
    distDir = writeFixtureBuild({ tryIt: true });
    ({ app } = await createApp({ distDir, env: testEnv(issuer.issuer), log: quiet }));
  });

  after(async () => {
    await issuer.close();
    fs.rmSync(distDir, { recursive: true, force: true });
  });

  async function signIn() {
    const browser = createBrowser(app);
    issuer.signInAs('ann');
    await browser.visit('/_rapidoc/auth/login?returnTo=/');
    return browser;
  }

  it("gives the signed-in reader's access token to same-origin requests only", async () => {
    const browser = await signIn();
    assert.ok(browser.cookies().get('rapidoc-api-token'), 'kept in its own cookie');
    assert.ok(!browser.cookies().get('rapidoc-session').includes(browser.cookies().get('rapidoc-api-token')));

    const res = await browser.send('/_rapidoc/auth/token', { headers: { 'sec-fetch-site': 'same-origin' } });
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('cache-control'), 'private, no-store');
    const body = await res.json();
    assert.equal(typeof body.access_token, 'string');
    assert.ok(body.access_token.length > 10);
    assert.ok(body.expires_at > Date.now() / 1000);

    assert.equal((await browser.send('/_rapidoc/auth/token', { headers: { 'sec-fetch-site': 'cross-site' } })).status, 403);
    assert.equal((await browser.send('/_rapidoc/auth/token', { headers: { 'sec-fetch-site': 'same-site' } })).status, 403);
  });

  it('answers 401 when signed out, and sign-out drops the token', async () => {
    assert.equal((await createBrowser(app).send('/_rapidoc/auth/token')).status, 401);
    const browser = await signIn();
    await browser.send('/_rapidoc/auth/logout', { method: 'POST', headers: { 'sec-fetch-site': 'same-origin' } });
    assert.equal(browser.cookies().get('rapidoc-api-token'), undefined);
    assert.equal((await browser.send('/_rapidoc/auth/token')).status, 401);
  });

  it('asks the provider for the configured audience', async () => {
    const { app: withAudience } = await createApp({
      distDir,
      env: testEnv(issuer.issuer, { RAPIDOC_AUTH_AUDIENCE: 'https://api.example.com' }),
      log: quiet,
    });
    const res = await createBrowser(withAudience).send('/_rapidoc/auth/login');
    assert.equal(new URL(res.headers.get('location')).searchParams.get('audience'), 'https://api.example.com');
    const plain = await createBrowser(app).send('/_rapidoc/auth/login');
    assert.equal(new URL(plain.headers.get('location')).searchParams.get('audience'), null);
  });
});

describe('rapidoc serve: without auth.tryIt', () => {
  it('keeps no access token and has no token route', async () => {
    const issuer = await startIssuer();
    issuer.addUser('ann', { name: 'Ann', email: 'ann@example.com', email_verified: true, groups: [] });
    const distDir = writeFixtureBuild();
    try {
      const { app } = await createApp({ distDir, env: testEnv(issuer.issuer), log: quiet });
      const browser = createBrowser(app);
      issuer.signInAs('ann');
      await browser.visit('/_rapidoc/auth/login?returnTo=/');
      assert.ok(browser.cookies().get('rapidoc-session'));
      assert.equal(browser.cookies().get('rapidoc-api-token'), undefined);
      assert.equal((await browser.send('/_rapidoc/auth/token')).status, 404);
    } finally {
      await issuer.close();
      fs.rmSync(distDir, { recursive: true, force: true });
    }
  });
});
