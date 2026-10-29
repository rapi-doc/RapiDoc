import * as client from "openid-client";

/**
 * OpenID Connect against the configured provider, server side: authorization code flow with PKCE,
 * state and nonce. Tokens never reach the browser; only the user's identity goes into the session.
 */

const CLOCK_TOLERANCE_SECONDS = 60;
const isLocalhost = (url) => ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);

/**
 * Discovers the provider (/.well-known/openid-configuration). Throws when it can't be reached.
 *
 * @param {{issuer: string, clientId: string, clientSecret: string | null}} auth
 */
export async function discoverProvider(auth) {
  const issuer = new URL(auth.issuer);
  const metadata = {
    [client.clockTolerance]: CLOCK_TOLERANCE_SECONDS,
    ...(auth.clientSecret && { client_secret: auth.clientSecret }),
  };
  // Plain http is only allowed for a provider on this machine (development, tests).
  const options =
    issuer.protocol === "http:" && isLocalhost(issuer)
      ? { execute: [client.allowInsecureRequests] }
      : undefined;
  return client.discovery(
    issuer,
    auth.clientId,
    metadata,
    auth.clientSecret ? undefined : client.None(),
    options,
  );
}

/**
 * Starts a sign-in: the provider URL to redirect to, and the checks to keep in the sign-in cookie.
 */
export async function startSignIn(config, { redirectUri, scopes, audience }) {
  const codeVerifier = client.randomPKCECodeVerifier();
  const state = client.randomState();
  const nonce = client.randomNonce();
  const url = client.buildAuthorizationUrl(config, {
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
    code_challenge: await client.calculatePKCECodeChallenge(codeVerifier),
    code_challenge_method: "S256",
    state,
    nonce,
    // Which API the access token is for (Auth0 and some others; standard OIDC has no such parameter).
    ...(audience && { audience }),
  });
  return { url, checks: { codeVerifier, state, nonce } };
}

/**
 * Finishes a sign-in: exchanges the code, validates the ID token, and returns its claims merged with
 * the userinfo claims (some providers put groups only in one of them), plus the access token and its
 * lifetime for Try-it (`auth.tryIt`). The ID and refresh tokens are not returned.
 *
 * @param {URL} callbackUrl - The callback URL as the provider called it (with code and state)
 */
export async function finishSignIn(config, callbackUrl, checks) {
  const tokens = await client.authorizationCodeGrant(config, callbackUrl, {
    pkceCodeVerifier: checks.codeVerifier,
    expectedState: checks.state,
    expectedNonce: checks.nonce,
    idTokenExpected: true,
  });
  const claims = tokens.claims();
  let userinfo = {};
  if (config.serverMetadata().userinfo_endpoint && tokens.access_token) {
    try {
      userinfo = await client.fetchUserInfo(config, tokens.access_token, claims.sub);
    } catch {
      // The ID token alone is enough to sign in.
    }
  }
  return {
    claims: { ...userinfo, ...claims },
    accessToken: tokens.access_token || null,
    expiresIn: typeof tokens.expires_in === "number" ? tokens.expires_in : null,
  };
}

/** Provider sign-out URL (RP-initiated logout), or null when the provider has none. */
export function endSessionUrl(config, { postLogoutRedirectUri, clientId }) {
  if (!config.serverMetadata().end_session_endpoint) return null;
  return client.buildEndSessionUrl(config, {
    post_logout_redirect_uri: postLogoutRedirectUri,
    client_id: clientId,
  });
}

/** Value at a dotted claim path (`realm_access.roles`), as a list of strings. */
export function claimList(claims, claimPath) {
  const value = claimPath
    .split(".")
    .reduce((node, key) => (node == null ? undefined : node[key]), claims);
  if (Array.isArray(value)) return value.filter((item) => typeof item === "string");
  if (typeof value === "string") return value.split(/[\s,]+/).filter(Boolean);
  return [];
}
