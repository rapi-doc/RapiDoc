import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import Provider from 'oidc-provider';

/** The portal's external origin in tests; its requests go to app.fetch(), never the network. */
export const PORTAL_ORIGIN = 'http://portal.test';
export const CLIENT_ID = 'portal-web';
export const CLIENT_SECRET = 'portal-web-secret';
export const SESSION_SECRET = 'test-session-secret-0123456789-abcdef';

/**
 * A real OpenID Connect provider (oidc-provider) on a random localhost port. Every sign-in is completed
 * at once as the user set with `signInAs()`, with consent granted for the requested scopes.
 *
 * @param {object} [options]
 * @param {string} [options.portalOrigin] - Origin of the portal that signs in with it
 * @param {Record<string, string[]>} [options.claims] - Extra claims per scope, e.g. { openid: ['https://rapidoc/roles'] }
 * @param {string[]} [options.redirectUris] - Extra redirect URIs, e.g. a RapiDoc OAuth return page
 * @param {boolean} [options.cors] - Let browsers call the token endpoint from any origin (RapiDoc's Authorize flow)
 */
export async function startIssuer({ portalOrigin = PORTAL_ORIGIN, claims: extraClaims = {}, redirectUris = [], cors = false } = {}) {
  const users = new Map();
  let current = null;
  const server = http.createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const issuer = `http://localhost:${server.address().port}`;

  const provider = new Provider(issuer, {
    clients: [
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uris: [`${portalOrigin}/_rapidoc/auth/callback`, ...redirectUris],
        post_logout_redirect_uris: [`${portalOrigin}/`],
        response_types: ['code'],
        grant_types: ['authorization_code'],
      },
    ],
    pkce: { required: () => true },
    ...(cors && { clientBasedCORS: () => true }),
    scopes: ['openid', 'profile', 'email', 'groups'],
    claims: Object.fromEntries(
      Object.entries({ openid: ['sub'], profile: ['name', 'picture'], email: ['email', 'email_verified'], groups: ['groups'] }).map(
        ([scope, names]) => [scope, [...names, ...(extraClaims[scope] || [])]]
      )
    ),
    findAccount: (ctx, id) => users.has(id) && { accountId: id, claims: () => ({ sub: id, ...users.get(id) }) },
    features: { devInteractions: { enabled: false }, rpInitiatedLogout: { enabled: true } },
    interactions: { url: (ctx, interaction) => `/interaction/${interaction.uid}` },
  });
  const callback = provider.callback();

  server.on('request', async (req, res) => {
    if (!req.url.startsWith('/interaction/')) return callback(req, res);
    try {
      const details = await provider.interactionDetails(req, res);
      if (!current) {
        await provider.interactionFinished(
          req,
          res,
          { error: 'access_denied', error_description: 'no test user' },
          { mergeWithLastSubmission: false }
        );
        return;
      }
      const grant = new provider.Grant({ accountId: current, clientId: details.params.client_id });
      grant.addOIDCScope(details.params.scope);
      await provider.interactionFinished(
        req,
        res,
        { login: { accountId: current }, consent: { grantId: await grant.save() } },
        { mergeWithLastSubmission: false }
      );
    } catch (err) {
      res.statusCode = 500;
      res.end(err.message);
    }
  });

  return {
    issuer,
    /** Adds a user: claims besides sub (name, email, email_verified, groups). */
    addUser: (id, claims) => users.set(id, claims),
    /** Next sign-ins complete as this user; null makes the provider refuse (access_denied). */
    signInAs: (id) => {
      current = id;
    },
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

/**
 * Browser-like client: keeps cookies per origin and follows redirects by hand. Requests to PORTAL_ORIGIN
 * go to the app; everything else (the issuer) goes over the network.
 */
export function createBrowser(app) {
  const jars = new Map();
  const jarOf = (origin) => {
    if (!jars.has(origin)) jars.set(origin, new Map());
    return jars.get(origin);
  };

  async function send(url, init = {}) {
    const target = new URL(url, PORTAL_ORIGIN);
    const jar = jarOf(target.origin);
    const headers = new Headers(init.headers);
    if (jar.size) headers.set('cookie', [...jar].map(([k, v]) => `${k}=${v}`).join('; '));
    const request = new Request(target, { ...init, headers, redirect: 'manual' });
    const response = target.origin === PORTAL_ORIGIN ? await app.fetch(request) : await fetch(request);
    for (const cookie of response.headers.getSetCookie()) {
      const [pair, ...attrs] = cookie.split(';');
      const [name, ...rest] = pair.split('=');
      const value = rest.join('=');
      const expired = attrs.some((a) => /^\s*max-age=0\s*$/i.test(a)) || value === '';
      if (expired) jar.delete(name.trim());
      else jar.set(name.trim(), value);
    }
    return response;
  }

  return {
    cookies: (origin = PORTAL_ORIGIN) => jarOf(origin),
    send,
    /** Follows redirects; returns the last response and every URL visited. */
    async visit(url, init = {}, limit = 15) {
      const visited = [];
      let response = await send(url, init);
      let current = new URL(url, PORTAL_ORIGIN);
      visited.push(current.href);
      while ([301, 302, 303, 307, 308].includes(response.status) && limit-- > 0) {
        current = new URL(response.headers.get('location'), current);
        visited.push(current.href);
        response = await send(current.href, { headers: init.headers });
      }
      return { response, visited, url: current };
    },
  };
}

/**
 * A built portal as `rapidoc build` lays it out with sign-in (no Astro needed):
 * public pages, a signed-in page, a billing-team page and spec, search indexes per zone.
 */
export function writeFixtureBuild({ defaultZone = 'public', tryIt = false } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rapidoc-server-fixture-'));
  const write = (rel, content) => {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), content);
  };
  const page = (title) =>
    `<!doctype html><html><head><title>${title}</title></head><body><main data-pagefind-body>${title}</main></body></html>`;

  write('public/index.html', page('Home'));
  write('public/docs/intro/index.html', page('Intro'));
  write('public/_rapidoc/assets/app.abc123.js', 'console.log(1)');
  write('public/_rapidoc/access-denied/index.html', page('Access denied'));
  write('public/_rapidoc/sign-in-error/index.html', page('Sign-in error'));
  write('public/pagefind/pagefind-entry.json', '{"public":true}');
  write('public/search-index.json', JSON.stringify({ version: 1, records: [{ url: '/docs/intro', title: 'Intro' }] }));

  write('protected/docs/partners/index.html', page('Partners'));
  write('protected/docs/billing/invoices/index.html', page('Invoices'));
  write('protected/specs/billing.json', '{"openapi":"3.1.0"}');
  write(
    'protected/_rapidoc/search/signed-in/search-index.json',
    JSON.stringify({ records: [{ url: '/docs/partners', title: 'Partners' }] })
  );
  write(
    'protected/_rapidoc/search/m-billing/search-index.json',
    JSON.stringify({ records: [{ url: '/docs/billing/invoices', title: 'Invoices' }] })
  );
  write('protected/_rapidoc/search/m-billing/pagefind/pagefind-entry.json', '{"zone":"billing"}');
  write('protected/_rapidoc/search/_empty/pagefind/pagefind-entry.json', '{"zone":"empty"}');

  write(
    'rapidoc-server.json',
    JSON.stringify({
      version: 1,
      site: { url: null },
      auth: {
        provider: 'oidc',
        issuer: null,
        clientId: CLIENT_ID,
        scopes: ['openid', 'profile', 'email', 'groups'],
        claims: { groups: 'groups' },
        session: { maxAge: '1h' },
        logout: 'local',
        label: 'Sign in',
        audience: null,
        tryIt,
      },
      access: {
        defaultZone,
        zones: {
          public: { kind: 'public' },
          'signed-in': { kind: 'signed-in' },
          'm-billing': { kind: 'members', groups: ['billing-team'], emails: ['*@finance.example.com'] },
        },
        groups: ['billing-team'],
      },
      files: {
        'docs/partners/index.html': 'signed-in',
        'docs/billing/invoices/index.html': 'm-billing',
        'specs/billing.json': 'm-billing',
      },
    })
  );
  return dir;
}

export function testEnv(issuer, extra = {}) {
  return {
    RAPIDOC_AUTH_ISSUER: issuer,
    RAPIDOC_AUTH_CLIENT_SECRET: CLIENT_SECRET,
    RAPIDOC_SESSION_SECRET: SESSION_SECRET,
    RAPIDOC_PUBLIC_URL: PORTAL_ORIGIN,
    ...extra,
  };
}
