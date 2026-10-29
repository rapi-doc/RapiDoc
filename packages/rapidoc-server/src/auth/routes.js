import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { claimList, endSessionUrl, finishSignIn, startSignIn } from "./oidc.js";
import { cookieNames, SIGN_IN_MAX_AGE } from "./session.js";
import { visibleZones } from "../access.js";
import { NO_STORE } from "../static.js";

/**
 * Sign-in routes under /_rapidoc/auth/:
 *
 *   GET  login?returnTo=/path   redirect to the provider (PKCE, state, nonce in a 10-minute cookie)
 *   GET  callback               verify, set the session cookie, go back to returnTo
 *   POST logout                 same-origin only; clear the session (and end it at the provider with logout: idp)
 *   GET  me                     { user, zones } or 401
 *   GET  token                  { access_token, expires_at } for Try-it (auth.tryIt only), same-origin only
 */

export const AUTH_PREFIX = "/_rapidoc/auth";
const SIGN_IN_ERROR_PAGE = "/_rapidoc/sign-in-error/";

/**
 * A same-site path to return to after sign-in; anything else (other origins, `//host`, auth routes, paths outside
 * the portal's base path) becomes the portal's home.
 *
 * @param {string} value
 * @param {string} [base] - The portal's base path ('' at the root)
 */
export function safeReturnTo(value, base = "") {
  const home = `${base}/`;
  if (typeof value !== "string" || value.length > 2048) return home;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return home;
  if ([...value].some((char) => char.charCodeAt(0) < 0x20)) return home; // control characters (header injection)
  if (base && value !== base && !value.startsWith(`${base}/`)) return home;
  if (value.startsWith(`${base}${AUTH_PREFIX}/`)) return home;
  return value;
}

/** POST from a page of this portal: Sec-Fetch-Site, or the Origin header where a browser doesn't send it. */
export function isSameOrigin(c, origin) {
  const site = c.req.header("sec-fetch-site");
  if (site) return site === "same-origin";
  const requestOrigin = c.req.header("origin");
  return (
    Boolean(requestOrigin) &&
    (requestOrigin === origin || requestOrigin === new URL(c.req.url).origin)
  );
}

/**
 * @param {import('hono').Hono} app
 * @param {object} ctx
 * @param {object} ctx.settings - From loadSettings()
 * @param {object} ctx.provider - From discoverProvider()
 * @param {object} ctx.sealer - From createSealer()
 * @param {(c) => Promise<object | null>} ctx.userOf - The request's session user
 * @param {(c) => string} ctx.originOf - External origin of the portal
 * @param {string} [ctx.base] - The portal's base path: the routes get requests without it, URLs sent back need it
 * @param {(line: string) => void} ctx.log
 */
export function registerAuthRoutes(
  app,
  { settings, provider, sealer, userOf, originOf, base = "", log },
) {
  const { auth, manifest } = settings;
  const ruleGroups = new Set(manifest.access.groups || []);
  const cookieOptions = (c, maxAge) => ({
    path: "/",
    httpOnly: true,
    secure: originOf(c).startsWith("https:"),
    sameSite: "Lax",
    ...(maxAge !== undefined && { maxAge }),
  });
  const names = (c) => cookieNames(originOf(c).startsWith("https:"));
  const redirectUri = (c) => `${originOf(c)}${base}${AUTH_PREFIX}/callback`;
  const signInError = (c, reason) => {
    c.header("cache-control", NO_STORE);
    return c.redirect(`${base}${SIGN_IN_ERROR_PAGE}?reason=${reason}`, 302);
  };

  app.get(`${AUTH_PREFIX}/login`, async (c) => {
    const returnTo = safeReturnTo(c.req.query("returnTo"), base);
    const { url, checks } = await startSignIn(provider, {
      redirectUri: redirectUri(c),
      scopes: auth.scopes,
      audience: auth.audience,
    });
    setCookie(
      c,
      names(c).signIn,
      await sealer.seal({ ...checks, returnTo }, SIGN_IN_MAX_AGE),
      cookieOptions(c, SIGN_IN_MAX_AGE),
    );
    c.header("cache-control", NO_STORE);
    return c.redirect(url.href, 302);
  });

  app.get(`${AUTH_PREFIX}/callback`, async (c) => {
    const cookieName = names(c).signIn;
    const checks = await sealer.open(getCookie(c, cookieName));
    deleteCookie(c, cookieName, cookieOptions(c));
    const providerError = c.req.query("error");
    if (providerError) {
      log(`sign-in refused by the provider: ${providerError}`);
      return signInError(c, providerError === "access_denied" ? "denied" : "provider");
    }
    if (!checks) return signInError(c, "expired");

    let claims;
    let accessToken;
    let expiresIn;
    try {
      const callbackUrl = new URL(redirectUri(c));
      callbackUrl.search = new URL(c.req.url).search;
      ({ claims, accessToken, expiresIn } = await finishSignIn(provider, callbackUrl, checks));
    } catch (err) {
      log(`sign-in failed: ${err.message}`);
      return signInError(c, "provider");
    }

    const user = {
      sub: claims.sub,
      name: typeof claims.name === "string" ? claims.name : "",
      email: typeof claims.email === "string" ? claims.email : "",
      emailVerified: claims.email_verified !== false && claims.email_verified !== "false",
      picture: typeof claims.picture === "string" ? claims.picture : "",
      // Only groups that some access rule names: keeps the cookie small and other group names out of it.
      groups: claimList(claims, auth.claims.groups).filter((group) => ruleGroups.has(group)),
    };
    try {
      setCookie(
        c,
        names(c).session,
        await sealer.seal(user, auth.sessionMaxAge),
        cookieOptions(c, auth.sessionMaxAge),
      );
    } catch (err) {
      log(`sign-in failed for ${user.sub}: ${err.message}`);
      return signInError(c, "provider");
    }
    // Try-it: the access token in its own cookie (a token with many permissions can be over 1 KB), for no
    // longer than both the token and the session last. Never the ID or refresh token.
    if (auth.tryIt && accessToken) {
      const maxAge = Math.min(expiresIn || auth.sessionMaxAge, auth.sessionMaxAge);
      const expiresAt = Math.floor(Date.now() / 1000) + maxAge;
      try {
        setCookie(
          c,
          names(c).apiToken,
          await sealer.seal({ token: accessToken, exp: expiresAt }, maxAge),
          cookieOptions(c, maxAge),
        );
      } catch (err) {
        log(`no Try-it token for ${user.sub}: ${err.message}`);
      }
    }
    log(`signed in: ${user.sub}${user.email ? ` <${user.email}>` : ""}`);
    if (ruleGroups.size && !claimList(claims, auth.claims.groups).length) {
      log(
        `no "${auth.claims.groups}" claim for ${user.sub}: group rules can't match. Check auth.claims.groups, and auth.scopes if the provider needs a scope for groups.`,
      );
    }
    c.header("cache-control", NO_STORE);
    return c.redirect(safeReturnTo(checks.returnTo, base), 302);
  });

  app.post(`${AUTH_PREFIX}/logout`, async (c) => {
    if (!isSameOrigin(c, originOf(c))) return c.text("Sign-out must come from this portal", 403);
    const user = await userOf(c);
    deleteCookie(c, names(c).session, cookieOptions(c));
    deleteCookie(c, names(c).apiToken, cookieOptions(c));
    if (user) log(`signed out: ${user.sub}`);
    const providerLogout =
      auth.logout === "idp" &&
      endSessionUrl(provider, {
        postLogoutRedirectUri: `${originOf(c)}${base}/`,
        clientId: auth.clientId,
      });
    c.header("cache-control", NO_STORE);
    return c.redirect(providerLogout ? providerLogout.href : `${base}/`, 303);
  });

  app.get(`${AUTH_PREFIX}/me`, async (c) => {
    const user = await userOf(c);
    c.header("cache-control", NO_STORE);
    c.header("vary", "Cookie");
    if (!user) return c.json({ user: null }, 401);
    return c.json({
      user: { name: user.name, email: user.email, picture: user.picture },
      zones: visibleZones(manifest.access.zones, user),
    });
  });

  // Try-it: the signed-in reader's access token, for the page script that fills RapiDoc's Authentication
  // section. A cross-site page can't read the answer anyway (no CORS headers); Sec-Fetch-Site refuses even asking.
  app.get(`${AUTH_PREFIX}/token`, async (c) => {
    c.header("cache-control", NO_STORE);
    c.header("vary", "Cookie");
    if (!auth.tryIt) return c.json({ error: "Try-it tokens are off (auth.tryIt)" }, 404);
    const site = c.req.header("sec-fetch-site");
    if (site && site !== "same-origin" && site !== "none")
      return c.json({ error: "same-origin only" }, 403);
    const user = await userOf(c);
    const saved = user && (await sealer.open(getCookie(c, names(c).apiToken)));
    if (!saved?.token || saved.exp <= Math.floor(Date.now() / 1000))
      return c.json({ access_token: null }, 401);
    return c.json({ access_token: saved.token, expires_at: saved.exp });
  });
}
