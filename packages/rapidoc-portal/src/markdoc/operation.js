/**
 * The `filter-operations` term that makes <rapi-doc-mini> show exactly one operation: its method and
 * path, e.g. `POST /shipments`.
 *
 * @param {string} method - HTTP method, any case
 * @param {string} path - OpenAPI path, e.g. /shipments/{trackingNumber}
 */
export function operationFilter(method, path) {
  return `${method.toUpperCase()} ${path}`;
}
