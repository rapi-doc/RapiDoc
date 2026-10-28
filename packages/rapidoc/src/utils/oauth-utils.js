/**
 * Helpers for the OAuth popup flow (Authorize button): unguessable values, PKCE, reading the reply the
 * provider sends to the return page (`<oauth-receiver>`), and checking that reply before it is trusted.
 */

/** BroadcastChannel the return page also replies on: still works when the provider's page cuts `window.opener`. */
export const OAUTH_CHANNEL = 'rapidoc-oauth';

function base64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * A random URL-safe string from the platform's cryptographic random generator.
 * 32 bytes give a 43-character value, the shortest a PKCE code_verifier may be.
 *
 * @param {number} [bytes]
 */
export function randomUrlSafe(bytes = 32) {
  return base64Url(crypto.getRandomValues(new Uint8Array(bytes)));
}

/**
 * PKCE S256 code_challenge for a code_verifier (RFC 7636): base64url(SHA-256(verifier)).
 *
 * @param {string} verifier
 * @returns {Promise<string>}
 */
export async function pkceChallenge(verifier) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return base64Url(new Uint8Array(digest));
}

/**
 * The provider's reply as the return page sees it: authorization code flow in the query, implicit flow in the
 * fragment. `state` is read in both, so the opener can check it.
 *
 * @param {{search: string, hash: string}} location
 */
export function readOAuthReply(location) {
  if (location.search && location.search.length > 1) {
    const params = new URLSearchParams(location.search);
    return {
      responseType: 'code',
      code: params.get('code'),
      state: params.get('state'),
      error: params.get('error'),
      errorDescription: params.get('error_description'),
    };
  }
  if (location.hash && location.hash.length > 1) {
    const params = new URLSearchParams(location.hash.slice(1));
    return {
      responseType: 'token',
      accessToken: params.get('access_token'),
      tokenType: params.get('token_type'),
      state: params.get('state'),
      error: params.get('error'),
      errorDescription: params.get('error_description'),
    };
  }
  return null;
}

/**
 * Is this the reply to the sign-in we started? It must look like a reply, carry the `state` we sent, and, when it
 * came as a window message, come from this site and from the popup we opened. Anything else is ignored, so a
 * message from another frame or window can neither inject a code or token nor end the wait.
 *
 * @param {object} reply - message data
 * @param {object} expected
 * @param {string} expected.state
 * @param {string} [expected.origin] - for window messages: this page's origin
 * @param {string} [origin] - for window messages: MessageEvent.origin
 * @param {*} [source] - for window messages: MessageEvent.source
 * @param {*} [expectedSource] - the popup window
 */
export function isExpectedOAuthReply(reply, expected, origin, source, expectedSource) {
  if (!reply || typeof reply !== 'object') return false;
  if (reply.responseType !== 'code' && reply.responseType !== 'token') return false;
  if (!expected.state || reply.state !== expected.state) return false;
  if (expected.origin !== undefined && origin !== expected.origin) return false;
  if (expectedSource !== undefined && source !== expectedSource) return false;
  return true;
}
