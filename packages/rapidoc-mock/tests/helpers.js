import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exportJWK, generateKeyPair, SignJWT } from "jose";

export const FIXTURES = path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures");
export const AUDIENCE = "https://api.orders.test";

/**
 * A token issuer on a random localhost port: discovery document and JWKS, nothing else. `sign(claims)` issues an
 * RS256 access token; `signWithOtherKey` one the issuer's JWKS can't verify.
 */
export async function startIssuer() {
  const { privateKey, publicKey } = await generateKeyPair("RS256");
  const other = await generateKeyPair("RS256");
  const jwk = { ...(await exportJWK(publicKey)), kid: "k1", alg: "RS256", use: "sig" };
  let issuer;
  const server = http.createServer((req, res) => {
    const body =
      req.url === "/.well-known/openid-configuration"
        ? { issuer, jwks_uri: `${issuer}jwks` }
        : req.url === "/jwks"
          ? { keys: [jwk] }
          : null;
    res.writeHead(body ? 200 : 404, { "content-type": "application/json" });
    res.end(JSON.stringify(body ?? {}));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  issuer = `http://127.0.0.1:${server.address().port}/`;

  const build = (claims, { expiresIn = "5m", audience = AUDIENCE, iss = issuer } = {}) =>
    new SignJWT(claims)
      .setProtectedHeader({ alg: "RS256", kid: "k1" })
      .setIssuer(iss)
      .setAudience(audience)
      .setSubject("user-1")
      .setIssuedAt()
      .setExpirationTime(expiresIn);

  return {
    issuer,
    sign: (claims = {}, options) => build(claims, options).sign(privateKey),
    signWithOtherKey: (claims = {}) => build(claims).sign(other.privateKey),
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

/** Calls the app like a browser on the portal origin would. */
export function client(app) {
  return async (method, url, { token, headers = {}, body, json } = {}) => {
    const init = { method, headers: { origin: "http://portal.test", ...headers } };
    if (token) init.headers.authorization = `Bearer ${token}`;
    if (json !== undefined) {
      init.headers["content-type"] ??= "application/json";
      init.body = typeof json === "string" ? json : JSON.stringify(json);
    } else if (body !== undefined) {
      init.body = body;
    }
    const response = await app.fetch(new Request(`http://mock.test${url}`, init));
    const text = await response.text();
    let data = text;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      // not JSON
    }
    return { status: response.status, headers: response.headers, data, text };
  };
}

export const quiet = { log: () => {}, warn: () => {} };
