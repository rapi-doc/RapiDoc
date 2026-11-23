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
 * What a sealed token is for. Each use has its own key, so a token sealed for one use never opens as
 * another: the sign-in transaction cookie (which anyone gets from /login) is not a session.
 */
export const SEAL_USES = ["session", "sign-in", "api-token", "mcp"];

/**
 * @param {string} secret - RAPIDOC_SESSION_SECRET
 */
export function createSealer(secret) {
  const keys = new Map(
    SEAL_USES.map((use) => [
      use,
      crypto.createHash("sha256").update(`rapidoc-${use}:${secret}`).digest(),
    ]),
  );
  const keyOf = (use) => {
    const key = keys.get(use);
    if (!key) throw new Error(`Unknown seal use "${use}"`);
    return key;
  };

  return {
    /**
     * @param {object} payload
     * @param {number} maxAgeSeconds
     * @param {"session" | "sign-in" | "api-token" | "mcp"} use
     * @returns {Promise<string>}
     */
    async seal(payload, maxAgeSeconds, use) {
      const key = keyOf(use);
      const token = await new EncryptJWT(payload)
        .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
        .setIssuedAt()
        .setExpirationTime(Math.floor(Date.now() / 1000) + maxAgeSeconds)
        .encrypt(key);
      if (token.length > MAX_COOKIE_BYTES) throw new CookieTooLargeError(token.length);
      return token;
    },
    /** The payload, or null for a missing, tampered or expired token, or one sealed for another use. */
    async open(token, use) {
      const key = keyOf(use);
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
