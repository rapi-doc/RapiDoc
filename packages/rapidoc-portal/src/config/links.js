/**
 * Links as written in the config and in pages: a path on this site (/docs/intro) or a full address.
 */

/** A link to somewhere else: anything with a scheme (https:, mailto:), not a path on this site. */
export function isExternal(href) {
  return /^[a-z][a-z0-9+.-]*:/i.test(href || "");
}

/** The attributes that open an external link in a new tab; none for a link on this site. */
export function externalAttrs(href) {
  return isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
