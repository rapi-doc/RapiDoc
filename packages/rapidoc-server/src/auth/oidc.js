import * as client from "openid-client";

/**
 * OpenID Connect against the configured provider, server side: authorization code flow with PKCE,
 * state and nonce. Tokens never reach the browser; only the user's identity goes into the session.
 */

const CLOCK_TOLERANCE_SECONDS = 60;
const DISCOVERY_TIMEOUT_SECONDS = 10;
const REQUEST_TIMEOUT_SECONDS = 30;
const FIRST_RETRY_MS = 5000;
const MAX_RETRY_MS = 60000;
const isLocalhost = (url) => ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);

/**
 * Discovers the provider (/.well-known/openid-configuration). Throws when it can't be reached or its
 * answer is not this issuer's; `isUnreachable(err)` tells the two apart.
 *
 * @param {{issuer: string, clientId: string, clientSecret: string | null}} auth
 */
export async function discoverProvider(auth) {
  const issuer = new URL(auth.issuer);
  const metadata = {
    [client.clockTolerance]: CLOCK_TOLERANCE_SECONDS,
    ...(auth.clientSecret && { client_secret: auth.clientSecret }),
  };
  const options = {
    timeout: DISCOVERY_TIMEOUT_SECONDS,
    // Plain http is only allowed for a provider on this machine (development, tests).
    ...(issuer.protocol === "http:" &&
      isLocalhost(issuer) && { execute: [client.allowInsecureRequests] }),
  };
  const config = await client.discovery(
    issuer,
    auth.clientId,
    metadata,
    auth.clientSecret ? undefined : client.None(),
    options,
  );
  // The short timeout is for discovery only: a reader waits for it. Later requests keep the library's.
  config.timeout = REQUEST_TIMEOUT_SECONDS;
  return config;
}

/**
 * Whether a discovery error means the provider is down (no connection, a timeout, a 5xx answer) and not
 * that the settings are wrong (a 4xx answer, a document for another issuer, something that is no
 * discovery document). Down is worth trying again; wrong is not.
 */
export function isUnreachable(err) {
  if (err?.code === "OAUTH_TIMEOUT") return true;
  if (err?.code === "OAUTH_RESPONSE_IS_NOT_CONFORM")
    return typeof err.cause?.status === "number" && err.cause.status >= 500;
  // fetch() itself failed: DNS, connection refused or reset, TLS
  return err instanceof TypeError && !err.code;
}

/** A discovery error in one line, with the network reason fetch() keeps in `cause`. */
export function discoveryErrorText(err) {
  const status = typeof err?.cause?.status === "number" ? ` (HTTP ${err.cause.status})` : "";
  const reason = err?.cause?.code || err?.cause?.cause?.code;
  return `${err?.message || err}${status}${reason ? ` (${reason})` : ""}`;
}

/**
 * The provider, discovered when first needed and again after a failure, for a server that started while
 * the provider was down. `get()` answers the configuration or null; after a failed try it answers null
 * without asking the provider until the back-off is over (5 seconds, doubling to a minute), so a provider
 * that is down is not asked once per reader. Requests that arrive during a try share it.
 *
 * @param {object} auth - Settings of the provider (see discoverProvider)
 * @param {object} [options]
 * @param {object | null} [options.provider] - A configuration discovered already
 * @param {(line: string) => void} [options.log]
 * @param {() => number} [options.now] - Clock in milliseconds (tests)
 * @param {(auth: object) => Promise<object>} [options.discover] - Default discoverProvider (tests)
 */
export function createProviderSource(
  auth,
  { provider = null, log = () => {}, now = Date.now, discover = discoverProvider } = {},
) {
  let current = provider;
  let pending = null;
  let retryAt = 0;
  let delay = FIRST_RETRY_MS;
  return {
    /** The configuration when it is known, without asking the provider. */
    current: () => current,
    async get() {
      if (current) return current;
      if (pending) return pending;
      if (now() < retryAt) return null;
      pending = discover(auth)
        .then((config) => {
          current = config;
          log(`sign-in provider ${auth.issuer} discovered: sign-in works again`);
          return config;
        })
        .catch((err) => {
          retryAt = now() + delay;
          delay = Math.min(delay * 2, MAX_RETRY_MS);
          log(
            `sign-in provider ${auth.issuer} ${isUnreachable(err) ? "is still unreachable" : "could not be discovered"}: ${discoveryErrorText(err)}`,
          );
          return null;
        })
        .finally(() => {
          pending = null;
        });
      return pending;
    },
  };
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

const isTrue = (value) => value === true || value === "true" || value === 1;

/**
 * Whether the provider vouches for the email, so email rules may match it. Only an explicit
 * `email_verified: true` counts, or Microsoft Entra ID's `xms_edov: true` (the email's domain is verified
 * by the user's tenant): Entra ID sends no `email_verified`, and its `email` is editable by the tenant's
 * administrators, so in a multi-tenant app another organization could claim any address.
 */
export function emailVerified(claims) {
  return isTrue(claims.email_verified) || isTrue(claims.xms_edov);
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
