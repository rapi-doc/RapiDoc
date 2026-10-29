/**
 * The path the portal is served under (the path of `site.url`, e.g. /developers). Every path in the
 * config, the docs and the normalized config is relative to the portal (`/docs/intro`); these helpers add
 * the base when a link is rendered and remove it from the URL of the current page before it is matched
 * against the config. Starlight adds the base to its own links (sidebar, pagination) itself.
 *
 * In Astro pages and client scripts the base comes from `import.meta.env.BASE_URL`; Node code passes it.
 */

const envBase = () => (import.meta.env?.BASE_URL || "/").replace(/\/+$/, "");

/** `/docs/intro` → `/developers/docs/intro`. Full URLs, `#anchors`, `?queries` and relative paths are unchanged. */
export function withBase(href, base = envBase()) {
  if (typeof href !== "string" || !base || !href.startsWith("/") || href.startsWith("//"))
    return href;
  return href === "/" ? `${base}/` : `${base}${href}`;
}

/** `/developers/docs/intro/` → `/docs/intro/`: the current page's path as the config writes paths. */
export function withoutBase(pathname, base = envBase()) {
  if (!base || typeof pathname !== "string") return pathname;
  if (pathname === base) return "/";
  return pathname.startsWith(`${base}/`) ? pathname.slice(base.length) : pathname;
}
