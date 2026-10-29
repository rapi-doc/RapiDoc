import { json2xml } from "./schema-utils.js";

/**
 * Replaces all occurrences of path parameters in a URL path template.
 * Example: replacePathParams('/users/{id}/details', { id: '123' }) => '/users/123/details'
 */
export function replacePathParams(pathTemplate = "", pathParams = {}) {
  let resolvedPath = pathTemplate;
  if (!pathParams || typeof pathParams !== "object") {
    return resolvedPath;
  }

  for (const [key, rawValue] of Object.entries(pathParams)) {
    const value = rawValue !== undefined && rawValue !== null ? String(rawValue) : "";
    // Replace all occurrences of {paramName}
    const token = `{${key}}`;
    resolvedPath = resolvedPath.replaceAll(token, encodeURIComponent(value));
  }

  return resolvedPath;
}

/**
 * Serializes a single query parameter into an array of [key, value] tuples based on OpenAPI style and explode rules.
 */
export function serializeQueryParam(name, rawValue, options = {}) {
  const {
    style = "form",
    explode = style === "form",
    isArray = Array.isArray(rawValue),
    isObject = false,
  } = options;

  if (rawValue === undefined || rawValue === null || rawValue === "") {
    return [];
  }

  // Handle Object types (from JSON input or object values)
  if (isObject || (typeof rawValue === "object" && !Array.isArray(rawValue))) {
    let obj = rawValue;
    if (typeof rawValue === "string") {
      try {
        obj = JSON.parse(rawValue);
      } catch {
        return [];
      }
    }

    if (!obj || typeof obj !== "object") {
      return [];
    }

    if (style === "json") {
      return [[name, JSON.stringify(obj)]];
    }
    if (style === "xml") {
      return [[name, json2xml(obj)]];
    }

    const result = [];
    for (const key of Object.keys(obj)) {
      const pKey = `${name}[${key}]`;
      const val = obj[key];

      if (val !== undefined && val !== null) {
        if (typeof val === "object" && Array.isArray(val)) {
          const filtered = val.filter((v) => v !== "" && v !== undefined && v !== null);
          if (filtered.length > 0) {
            if (style === "spaceDelimited") {
              result.push([pKey, filtered.join(" ")]);
            } else if (style === "pipeDelimited") {
              result.push([pKey, filtered.join("|")]);
            } else if (explode) {
              filtered.forEach((v) => result.push([pKey, String(v)]));
            } else {
              result.push([pKey, filtered.join(",")]);
            }
          }
        } else if (typeof val === "object") {
          result.push([pKey, JSON.stringify(val)]);
        } else {
          result.push([pKey, String(val)]);
        }
      }
    }
    return result;
  }

  // Handle Array types
  if (isArray || Array.isArray(rawValue)) {
    const rawArr = Array.isArray(rawValue) ? rawValue : [rawValue];
    const vals = rawArr.filter((v) => v !== "" && v !== undefined && v !== null);

    if (vals.length === 0) {
      return [];
    }

    if (style === "spaceDelimited") {
      return [[name, vals.join(" ")]];
    }
    if (style === "pipeDelimited") {
      return [[name, vals.join("|")]];
    }
    if (explode) {
      return vals.map((v) => [name, String(v)]);
    }
    // Default form style unexploded: comma-delimited
    return [[name, vals.join(",")]];
  }

  // Handle Primitive types
  return [[name, String(rawValue)]];
}

/**
 * RFC 3986 allowable reserved characters when allowReserved: true
 * Encodes special delimiters & and = so query string structure remains intact,
 * while leaving other reserved chars (:/?#[]@!$'()*+,;) unencoded.
 */
function encodeReservedQueryValue(value) {
  return encodeURI(value).replace(/&/g, "%26").replace(/=/g, "%3D").replace(/\+/g, "%2B");
}

/**
 * Builds the query string from a collection of query parameter descriptors.
 */
export function buildQueryString(queryParams = []) {
  if (!Array.isArray(queryParams) || queryParams.length === 0) {
    return "";
  }

  const parts = [];

  for (const param of queryParams) {
    const {
      name,
      value,
      style = "form",
      explode = style === "form",
      allowReserved = false,
      isArray = false,
      isObject = false,
    } = param;

    const entries = serializeQueryParam(name, value, { style, explode, isArray, isObject });

    for (const [k, v] of entries) {
      const encodedKey = encodeURIComponent(k);
      const encodedValue = allowReserved ? encodeReservedQueryValue(v) : encodeURIComponent(v);
      parts.push(`${encodedKey}=${encodedValue}`);
    }
  }

  return parts.join("&");
}

/**
 * The OAuth redirect URL for the `oauth-receiver` attribute. A relative value (the default
 * `oauth-receiver.html`) is resolved against the current page's folder, as it always was; a value starting
 * with `/` is a path from the site root, and a full URL is used as is, so a whole site can register one
 * redirect URL with its OAuth provider.
 *
 * @param {{origin: string, pathname: string}} location - e.g. window.location
 * @param {string} receiver - the oauth-receiver attribute
 * @returns {URL}
 */
export function oauthReceiverUrl(location, receiver = "oauth-receiver.html") {
  if (/^[a-z][a-z0-9+.-]*:/i.test(receiver)) return new URL(receiver);
  if (receiver.startsWith("/")) return new URL(receiver, location.origin);
  const folder = location.pathname.substring(0, location.pathname.lastIndexOf("/"));
  return new URL(`${location.origin}${folder}/${receiver}`);
}

/**
 * Safely joins server URL and path template, preventing duplicate or missing slashes.
 */
export function joinServerAndPath(serverUrl = "", path = "") {
  const cleanServer = (serverUrl || "").replace(/\/+$/, "");
  const cleanPath = path ? `/${path.replace(/^\/+/, "")}` : "";
  return `${cleanServer}${cleanPath}`;
}

/**
 * Constructs the final fetch URL with resolved path parameters, serialized query string,
 * and optional authentication tokens.
 */
export function constructFetchURL({
  serverUrl = "",
  path = "",
  pathParams = {},
  queryParams = [],
  apiKeys = [],
} = {}) {
  let resolvedPath = replacePathParams(path, pathParams);
  const queryString = buildQueryString(queryParams);

  if (queryString) {
    resolvedPath = `${resolvedPath}${resolvedPath.includes("?") ? "&" : "?"}${queryString}`;
  }

  // Append query-based authentication parameters
  if (Array.isArray(apiKeys)) {
    apiKeys
      .filter((k) => k && k.in === "query" && k.finalKeyValue)
      .forEach((k) => {
        resolvedPath = `${resolvedPath}${resolvedPath.includes("?") ? "&" : "?"}${encodeURIComponent(k.name)}=${encodeURIComponent(k.finalKeyValue)}`;
      });
  }

  return joinServerAndPath(serverUrl, resolvedPath);
}
