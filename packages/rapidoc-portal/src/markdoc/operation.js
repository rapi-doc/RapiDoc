/**
 * `match-paths` pattern (with `match-type="regex"`) that makes <rapi-doc-mini> show exactly one
 * operation. RapiDoc matches against "<method> <path>"; the anchors keep /orders from also
 * matching /orders/{id}.
 *
 * @param {string} method - HTTP method, any case
 * @param {string} path - OpenAPI path, e.g. /shipments/{trackingNumber}
 */
export function operationMatchPattern(method, path) {
  const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return `^${method.toLowerCase()} ${escaped}$`;
}
