import crypto from "node:crypto";
import { EncryptJWT, jwtDecrypt } from "jose";

/**
 * Encrypted, stateless cookies (JWE, dir + A256GCM): the session, and the short-lived sign-in
 * transaction (PKCE verifier, state, nonce, return path). Any instance with the same
 * RAPIDOC_SESSION_SECRET can read them, so the server scales without shared storage.
 */

/** Browsers drop cookies over 4096 bytes; stay below with room for the attributes. */
export const MAX_COOKIE_BYTES = 3900;
export const SIGN_IN_MAX_AGE = 10 * 60;

export class CookieTooLargeError extends Error {
  constructor(bytes) {
    super(`Session cookie would be ${bytes} bytes (limit ${MAX_COOKIE_BYTES})`);
    this.name = "CookieTooLargeError";
  }
}

/** Cookie names. `__Host-` needs Secure, so plain-http development uses unprefixed names. */
export function cookieNames(secure) {
  const prefix = secure ? "__Host-" : "";
  return {
    session: `${prefix}rapidoc-session`,
    signIn: `${prefix}rapidoc-signin`,
    apiToken: `${prefix}rapidoc-api-token`,
  };
}

/**
 * @param {string} secret - RAPIDOC_SESSION_SECRET
 */
export function createSealer(secret) {
  const key = crypto.createHash("sha256").update(`rapidoc-session:${secret}`).digest();

  return {
    /** @returns {Promise<string>} */
    async seal(payload, maxAgeSeconds) {
      const token = await new EncryptJWT(payload)
        .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
        .setIssuedAt()
        .setExpirationTime(Math.floor(Date.now() / 1000) + maxAgeSeconds)
        .encrypt(key);
      if (token.length > MAX_COOKIE_BYTES) throw new CookieTooLargeError(token.length);
      return token;
    },
    /** The payload, or null for a missing, tampered or expired token. */
    async open(token) {
      if (!token) return null;
      try {
        const { payload } = await jwtDecrypt(token, key, {
          contentEncryptionAlgorithms: ["A256GCM"],
          keyManagementAlgorithms: ["dir"],
        });
        return payload;
      } catch {
        return null;
      }
    },
  };
}
