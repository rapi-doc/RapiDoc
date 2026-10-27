import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { claimList, endSessionUrl, finishSignIn, startSignIn } from './oidc.js';
import { cookieNames, SIGN_IN_MAX_AGE } from './session.js';
import { visibleZones } from '../access.js';
import { NO_STORE } from '../static.js';

/**
 * Sign-in routes under /_rapidoc/auth/:
 *
 *   GET  login?returnTo=/path   redirect to the provider (PKCE, state, nonce in a 10-minute cookie)
 *   GET  callback               verify, set the session cookie, go back to returnTo
 *   POST logout                 same-origin only; clear the session (and end it at the provider with logout: idp)
 *   GET  me                     { user, zones } or 401
 */

export const AUTH_PREFIX = '/_rapidoc/auth';
const SIGN_IN_ERROR_PAGE = '/_rapidoc/sign-in-error/';

/** A same-site path to return to after sign-in; anything else (other origins, `//host`, auth routes) becomes `/`. */
export function safeReturnTo(value) {
  if (typeof value !== 'string' || value.length > 2048) return '/';
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/';
  if ([...value].some((char) => char.charCodeAt(0) < 0x20)) return '/'; // control characters (header injection)
  if (value.startsWith(`${AUTH_PREFIX}/`)) return '/';
  return value;
}

/** POST from a page of this portal: Sec-Fetch-Site, or the Origin header where a browser doesn't send it. */
export function isSameOrigin(c, origin) {
  const site = c.req.header('sec-fetch-site');
  if (site) return site === 'same-origin';
  const requestOrigin = c.req.header('origin');
  return Boolean(requestOrigin) && (requestOrigin === origin || requestOrigin === new URL(c.req.url).origin);
}

/**
 * @param {import('hono').Hono} app
 * @param {object} ctx
 * @param {object} ctx.settings - From loadSettings()
 * @param {object} ctx.provider - From discoverProvider()
 * @param {object} ctx.sealer - From createSealer()
 * @param {(c) => Promise<object | null>} ctx.userOf - The request's session user
 * @param {(c) => string} ctx.originOf - External origin of the portal
 * @param {(line: string) => void} ctx.log
 */
export function registerAuthRoutes(app, { settings, provider, sealer, userOf, originOf, log }) {
  const { auth, manifest } = settings;
  const ruleGroups = new Set(manifest.access.groups || []);
  const cookieOptions = (c, maxAge) => ({
    path: '/',
    httpOnly: true,
    secure: originOf(c).startsWith('https:'),
    sameSite: 'Lax',
    ...(maxAge !== undefined && { maxAge }),
  });
  const names = (c) => cookieNames(originOf(c).startsWith('https:'));
  const redirectUri = (c) => `${originOf(c)}${AUTH_PREFIX}/callback`;
  const signInError = (c, reason) => {
    c.header('cache-control', NO_STORE);
    return c.redirect(`${SIGN_IN_ERROR_PAGE}?reason=${reason}`, 302);
  };

  app.get(`${AUTH_PREFIX}/login`, async (c) => {
    const returnTo = safeReturnTo(c.req.query('returnTo'));
    const { url, checks } = await startSignIn(provider, { redirectUri: redirectUri(c), scopes: auth.scopes });
    setCookie(c, names(c).signIn, await sealer.seal({ ...checks, returnTo }, SIGN_IN_MAX_AGE), cookieOptions(c, SIGN_IN_MAX_AGE));
    c.header('cache-control', NO_STORE);
    return c.redirect(url.href, 302);
  });

  app.get(`${AUTH_PREFIX}/callback`, async (c) => {
    const cookieName = names(c).signIn;
    const checks = await sealer.open(getCookie(c, cookieName));
    deleteCookie(c, cookieName, cookieOptions(c));
    const providerError = c.req.query('error');
    if (providerError) {
      log(`sign-in refused by the provider: ${providerError}`);
      return signInError(c, providerError === 'access_denied' ? 'denied' : 'provider');
    }
    if (!checks) return signInError(c, 'expired');

    let claims;
    try {
      const callbackUrl = new URL(redirectUri(c));
      callbackUrl.search = new URL(c.req.url).search;
      claims = await finishSignIn(provider, callbackUrl, checks);
    } catch (err) {
      log(`sign-in failed: ${err.message}`);
      return signInError(c, 'provider');
    }

    const user = {
      sub: claims.sub,
      name: typeof claims.name === 'string' ? claims.name : '',
      email: typeof claims.email === 'string' ? claims.email : '',
      emailVerified: claims.email_verified !== false && claims.email_verified !== 'false',
      picture: typeof claims.picture === 'string' ? claims.picture : '',
      // Only groups that some access rule names: keeps the cookie small and other group names out of it.
      groups: claimList(claims, auth.claims.groups).filter((group) => ruleGroups.has(group)),
    };
    try {
      setCookie(c, names(c).session, await sealer.seal(user, auth.sessionMaxAge), cookieOptions(c, auth.sessionMaxAge));
    } catch (err) {
      log(`sign-in failed for ${user.sub}: ${err.message}`);
      return signInError(c, 'provider');
    }
    log(`signed in: ${user.sub}${user.email ? ` <${user.email}>` : ''}`);
    if (ruleGroups.size && !claimList(claims, auth.claims.groups).length) {
      log(
        `no "${auth.claims.groups}" claim for ${user.sub}: group rules can't match. Check auth.claims.groups, and auth.scopes if the provider needs a scope for groups.`
      );
    }
    c.header('cache-control', NO_STORE);
    return c.redirect(safeReturnTo(checks.returnTo), 302);
  });

  app.post(`${AUTH_PREFIX}/logout`, async (c) => {
    if (!isSameOrigin(c, originOf(c))) return c.text('Sign-out must come from this portal', 403);
    const user = await userOf(c);
    deleteCookie(c, names(c).session, cookieOptions(c));
    if (user) log(`signed out: ${user.sub}`);
    const providerLogout =
      auth.logout === 'idp' && endSessionUrl(provider, { postLogoutRedirectUri: `${originOf(c)}/`, clientId: auth.clientId });
    c.header('cache-control', NO_STORE);
    return c.redirect(providerLogout ? providerLogout.href : '/', 303);
  });

  app.get(`${AUTH_PREFIX}/me`, async (c) => {
    const user = await userOf(c);
    c.header('cache-control', NO_STORE);
    c.header('vary', 'Cookie');
    if (!user) return c.json({ user: null }, 401);
    return c.json({
      user: { name: user.name, email: user.email, picture: user.picture },
      zones: visibleZones(manifest.access.zones, user),
    });
  });
}
