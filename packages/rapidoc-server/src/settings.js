import fs from 'node:fs';
import path from 'node:path';

/**
 * Runtime settings of `rapidoc serve`: the build's rapidoc-server.json (written by @rapidoc/portal when
 * the portal has `auth`) plus environment variables. Secrets exist only here, never in the build.
 *
 *   RAPIDOC_SESSION_SECRET      key of the session cookie, 32+ characters (required with auth)
 *   RAPIDOC_AUTH_CLIENT_SECRET  for a confidential client; unset for a public client (PKCE only)
 *   RAPIDOC_AUTH_ISSUER, RAPIDOC_AUTH_CLIENT_ID, RAPIDOC_AUTH_AUDIENCE   override auth.issuer / clientId / audience
 *   RAPIDOC_PUBLIC_URL          external origin (redirect URL, Secure cookies); default site.url
 *   RAPIDOC_MOUNT_PATH          path the server receives requests under, when a proxy strips part of the
 *                               portal's path (default: the portal's base path, the path of site.url)
 *
 * A build without rapidoc-server.json is served as plain static files.
 */

export const SERVER_MANIFEST = 'rapidoc-server.json';
const MIN_SECRET_LENGTH = 32;
const UNIT_SECONDS = { s: 1, m: 60, h: 3600, d: 86400 };

export class SettingsError extends Error {
  constructor(problems) {
    super(['rapidoc serve cannot start:', ...problems.map((p) => `  - ${p}`)].join('\n'));
    this.name = 'SettingsError';
    this.problems = problems;
  }
}

/** `8h` → 28800 */
export function parseDuration(text) {
  const match = /^(\d+)([smhd])$/.exec(text || '');
  return match ? Number(match[1]) * UNIT_SECONDS[match[2]] : null;
}

function readManifest(distDir) {
  const file = path.join(distDir, SERVER_MANIFEST);
  if (!fs.existsSync(file)) return null;
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (manifest.version !== 1) throw new SettingsError([`${file}: unsupported version ${manifest.version}; rebuild with rapidoc build`]);
  return manifest;
}

/** `/developers/` or `developers` → `/developers`; `/` or nothing → '' (the root). */
export function normalizePath(value) {
  const trimmed = String(value || '')
    .trim()
    .replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}` : '';
}

function publicUrlOf(value, problems) {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    problems.push(`RAPIDOC_PUBLIC_URL: "${value}" is not a URL`);
    return null;
  }
}

/**
 * @param {string} distDir - Output of `rapidoc build`
 * @param {Record<string, string | undefined>} [env]
 * @param {{ mountPath?: string }} [options] - mountPath: `--mount-path`, wins over RAPIDOC_MOUNT_PATH
 */
export function loadSettings(distDir, env = process.env, options = {}) {
  const root = path.resolve(distDir);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory())
    throw new SettingsError([`${root} is not a folder; run rapidoc build first`]);

  const manifest = readManifest(root);
  // basePath: where the browser sees the portal (links, redirects); mountPath: where requests arrive. They differ
  // only behind a proxy that strips part of the path. A static build has no manifest, so its mount path is the option.
  const mountOption = options.mountPath ?? env.RAPIDOC_MOUNT_PATH;
  if (!manifest) {
    const mountPath = normalizePath(mountOption);
    return {
      mode: 'static',
      distDir: root,
      publicDir: root,
      protectedDir: null,
      manifest: null,
      auth: null,
      basePath: mountPath,
      mountPath,
    };
  }
  const basePath = normalizePath(manifest.site?.basePath);
  const mountPath = mountOption === undefined ? basePath : normalizePath(mountOption);

  const problems = [];
  const publicDir = path.join(root, 'public');
  const protectedDir = path.join(root, 'protected');
  for (const dir of [publicDir, protectedDir]) {
    if (!fs.existsSync(dir)) problems.push(`${dir} is missing; rebuild with rapidoc build`);
  }

  let auth = null;
  if (manifest.auth) {
    const issuer = env.RAPIDOC_AUTH_ISSUER || manifest.auth.issuer;
    const clientId = env.RAPIDOC_AUTH_CLIENT_ID || manifest.auth.clientId;
    const sessionSecret = env.RAPIDOC_SESSION_SECRET || '';
    if (!issuer) problems.push('No sign-in issuer: set auth.issuer in rapidoc.config.yaml or RAPIDOC_AUTH_ISSUER');
    if (!clientId) problems.push('No client ID: set auth.clientId in rapidoc.config.yaml or RAPIDOC_AUTH_CLIENT_ID');
    if (sessionSecret.length < MIN_SECRET_LENGTH) {
      problems.push(`RAPIDOC_SESSION_SECRET must be at least ${MIN_SECRET_LENGTH} characters (it encrypts the session cookie)`);
    }
    auth = {
      ...manifest.auth,
      issuer,
      clientId,
      clientSecret: env.RAPIDOC_AUTH_CLIENT_SECRET || null,
      audience: env.RAPIDOC_AUTH_AUDIENCE || manifest.auth.audience || null,
      tryIt: manifest.auth.tryIt === true,
      sessionSecret,
      sessionMaxAge: parseDuration(manifest.auth.session?.maxAge) || 8 * 3600,
    };
  }

  const publicUrl = publicUrlOf(env.RAPIDOC_PUBLIC_URL || manifest.site?.url, problems);
  if (problems.length) throw new SettingsError(problems);

  return { mode: 'portal', distDir: root, publicDir, protectedDir, manifest, auth, publicUrl, basePath, mountPath };
}
