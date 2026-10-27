import { createRemoteJWKSet, jwtVerify } from 'jose';
import { resolve, securityOf } from './spec.js';

/**
 * Bearer token verification against an OpenID Connect issuer: the JWKS comes from its discovery document, and a
 * token must be signed by it, unexpired, from that issuer and (when set) for that audience.
 *
 * @param {object} options
 * @param {string} options.issuer - e.g. https://example.us.auth0.com/
 * @param {string} [options.audience] - The API identifier tokens must be issued for
 * @returns {Promise<{issuer: string, audience?: string, verify: (token: string) => Promise<object>}>} verify
 *   resolves to the token's claims and rejects when the token isn't valid
 */
export async function createVerifier({ issuer, audience }) {
  const discoveryUrl = `${issuer.replace(/\/$/, '')}/.well-known/openid-configuration`;
  let metadata;
  try {
    const response = await fetch(discoveryUrl, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(10_000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    metadata = await response.json();
  } catch (err) {
    throw new Error(`Token issuer ${issuer} could not be discovered (${discoveryUrl}): ${err.message}`, { cause: err });
  }
  if (!metadata.jwks_uri) throw new Error(`Token issuer ${issuer} publishes no jwks_uri in ${discoveryUrl}`);
  const jwks = createRemoteJWKSet(new URL(metadata.jwks_uri));
  return {
    issuer,
    audience,
    async verify(token) {
      const { payload } = await jwtVerify(token, jwks, { issuer, ...(audience ? { audience } : {}), clockTolerance: 5 });
      return payload;
    },
  };
}

/** Scopes a token grants: OAuth `scope` (space-separated), `scp` (Okta, Entra ID) and `permissions` (Auth0 RBAC). */
export function tokenScopes(claims) {
  const scopes = new Set();
  const add = (value) => {
    if (typeof value === 'string') value.split(/\s+/).forEach((scope) => scope && scopes.add(scope));
    else if (Array.isArray(value)) value.forEach((scope) => typeof scope === 'string' && scopes.add(scope));
  };
  add(claims.scope);
  add(claims.scp);
  add(claims.permissions);
  return scopes;
}

const isTokenScheme = (scheme) =>
  scheme.type === 'oauth2' || scheme.type === 'openIdConnect' || (scheme.type === 'http' && /^bearer$/i.test(scheme.scheme || ''));

/**
 * The checks for one API. `check(request, operation)` answers `null` when the request may call the operation,
 * otherwise the error response to send.
 *
 * Security requirements are alternatives (any one will do); the schemes inside one are all needed.
 * - apiKey: the header, query parameter or cookie is present.
 * - http basic: a well-formed `Basic` credential.
 * - oauth2, openIdConnect, http bearer: a valid bearer token (with a verifier) that has the requirement's scopes.
 *   A bearer requirement without scopes needs the operation's OAuth scopes: they name the permission the
 *   operation needs, whichever scheme carries the token. Without a verifier any bearer token is accepted.
 *
 * @param {object} doc - Bundled OpenAPI document
 * @param {object | null} verifier - createVerifier(), or null to accept bearer tokens unchecked
 */
export function createAuth(doc, verifier) {
  const schemes = {};
  for (const [name, raw] of Object.entries(doc.components?.securitySchemes || {})) schemes[name] = resolve(doc, raw).node || {};

  return {
    async check(request, operation) {
      const requirements = securityOf(doc, operation);
      if (!requirements.length) return null;

      const operationScopes = new Set();
      for (const requirement of requirements) {
        for (const [name, scopes] of Object.entries(requirement)) {
          if (schemes[name]?.type === 'oauth2' || schemes[name]?.type === 'openIdConnect') scopes.forEach((s) => operationScopes.add(s));
        }
      }

      let token; // { claims } | { error } | undefined until the first token scheme needs it
      const readToken = async () => {
        if (token) return token;
        const match = /^Bearer\s+(\S+)\s*$/i.exec(request.headers.authorization || '');
        if (!match) return (token = { missing: true });
        if (!verifier) return (token = { claims: null });
        try {
          return (token = { claims: await verifier.verify(match[1]) });
        } catch (err) {
          return (token = { error: err.code === 'ERR_JWT_EXPIRED' ? 'The access token has expired' : 'The access token is not valid' });
        }
      };

      const outcomes = []; // per requirement: { ok } | { missingScopes } | { unauthorized }
      for (const requirement of requirements) {
        let outcome = { ok: true };
        for (const [name, listed] of Object.entries(requirement)) {
          const scheme = schemes[name];
          if (!scheme) continue; // an undefined scheme is a spec error the validator reports; don't block on it
          let result = { ok: true };
          if (scheme.type === 'apiKey') {
            const key = scheme.name?.toLowerCase();
            const present =
              scheme.in === 'query'
                ? request.query.has(scheme.name)
                : scheme.in === 'cookie'
                  ? request.cookies[scheme.name]
                  : request.headers[key];
            if (!present) result = { unauthorized: `${scheme.name} ${scheme.in === 'header' ? 'header' : scheme.in} missing` };
          } else if (scheme.type === 'http' && /^basic$/i.test(scheme.scheme || '')) {
            if (!/^Basic\s+\S+/i.test(request.headers.authorization || '')) result = { unauthorized: 'Basic credentials missing' };
          } else if (isTokenScheme(scheme)) {
            const needed = listed.length || scheme.type !== 'http' ? listed : [...operationScopes];
            const { missing, error, claims } = await readToken();
            if (missing) result = { unauthorized: 'Bearer token missing' };
            else if (error) result = { unauthorized: error, invalidToken: true };
            else if (claims) {
              const granted = tokenScopes(claims);
              const lacking = needed.filter((scope) => !granted.has(scope));
              if (lacking.length) result = { missingScopes: lacking, granted: [...granted] };
            }
          }
          if (!result.ok) {
            outcome = result;
            break;
          }
        }
        if (outcome.ok) return null;
        outcomes.push(outcome);
      }

      const forbidden = outcomes.find((outcome) => outcome.missingScopes);
      if (forbidden) {
        const scope = forbidden.missingScopes.join(' ');
        return problem(
          403,
          'Forbidden',
          `This operation needs the ${listOf(forbidden.missingScopes)} permission; the token has ${forbidden.granted.length ? listOf(forbidden.granted) : 'none'}.`,
          {
            'WWW-Authenticate': `Bearer error="insufficient_scope", scope="${scope}"`,
          },
          { required: forbidden.missingScopes, granted: forbidden.granted }
        );
      }
      const invalid = outcomes.find((outcome) => outcome.invalidToken);
      const challenge = invalid
        ? `Bearer realm="rapidoc-mock", error="invalid_token", error_description="${invalid.unauthorized}"`
        : 'Bearer realm="rapidoc-mock"';
      const reasons = [...new Set(outcomes.map((outcome) => outcome.unauthorized))];
      return problem(401, 'Unauthorized', invalid ? `${invalid.unauthorized}.` : `Credentials needed: ${reasons.join(', or ')}.`, {
        'WWW-Authenticate': challenge,
      });
    },
  };
}

const listOf = (items) => items.join(', ');

/** An RFC 9457 problem response. */
export function problem(status, title, detail, headers = {}, extra = {}) {
  return {
    status,
    headers: { 'Content-Type': 'application/problem+json', ...headers },
    body: JSON.stringify({ type: 'about:blank', title, status, detail, ...extra }, null, 2),
  };
}
