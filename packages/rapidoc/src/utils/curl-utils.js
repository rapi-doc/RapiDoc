/**
 * Normalizes header values by deduplicating comma-separated tokens (e.g. Accept headers).
 *
 * @param {string} value - Raw header value
 * @returns {string} Deduplicated header value
 */
export function deduplicateHeaderValues(value) {
  if (!value || typeof value !== "string") {
    return value || "";
  }
  const seenValues = [];
  return value
    .split(",")
    .map((val) => {
      const trimmed = val.trim();
      const normalizedValue = trimmed.toLowerCase();
      if (seenValues.includes(normalizedValue)) {
        return null;
      }
      seenValues.push(normalizedValue);
      return trimmed;
    })
    .filter((val) => val !== null)
    .join(", ");
}

/**
 * Generates a clean, copyable cURL command string from request parameters.
 * Pure utility decoupled from the DOM.
 *
 * @param {object} options
 * @param {string} [options.method='GET'] - HTTP method (GET, POST, etc.)
 * @param {string} options.url - Request URL
 * @param {Headers|Map|Array<[string, string]>|object} [options.headers] - Request headers
 * @param {URLSearchParams|FormData|File|string|object} [options.body] - Request body payload
 * @param {string} [options.contentType=''] - Content type of the payload
 * @param {Object<string, string>} [options.partContentTypes] - Content-Type of multipart parts, by field name
 * @param {string} [options.baseLocation] - Optional base location to resolve relative URLs
 * @returns {string} Formatted cURL snippet
 */
export function generateCurlCommand({
  method = "GET",
  url = "",
  headers,
  body,
  contentType = "",
  partContentTypes = {},
  baseLocation = typeof location !== "undefined" ? location.href : "",
} = {}) {
  let curlUrl = url;
  if (!url.startsWith("http://") && !url.startsWith("https://") && baseLocation) {
    try {
      curlUrl = new URL(url, baseLocation).href;
    } catch {
      curlUrl = url;
    }
  }

  let curl = `curl -X ${method.toUpperCase()} "${curlUrl}" \\\n`;

  // Process headers into key-value pairs with deduplicated comma values
  const headerEntries = [];
  if (headers instanceof Headers || (headers && typeof headers.forEach === "function")) {
    headers.forEach((value, key) => {
      headerEntries.push([key, deduplicateHeaderValues(value)]);
    });
  } else if (Array.isArray(headers)) {
    headers.forEach(([key, value]) => {
      headerEntries.push([key, deduplicateHeaderValues(value)]);
    });
  } else if (headers && typeof headers === "object") {
    Object.entries(headers).forEach(([key, value]) => {
      headerEntries.push([key, deduplicateHeaderValues(String(value))]);
    });
  }

  let curlHeaders = headerEntries.map(([key, value]) => ` -H '${key}: ${value}'`).join("\\\n");
  if (curlHeaders) {
    curlHeaders = `${curlHeaders} \\\n`;
  }

  let curlData = "";
  let curlForm = "";

  if (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) {
    curlData = ` -d ${body.toString()} \\\n`;
  } else if (typeof File !== "undefined" && body instanceof File) {
    curlData = ` --data-binary @${body.name} \\\n`;
  } else if (typeof FormData !== "undefined" && body instanceof FormData) {
    curlForm = Array.from(body)
      .map(([key, value]) => {
        const type = partContentTypes?.[key] ? `;type=${partContentTypes[key]}` : "";
        if (typeof File !== "undefined" && value instanceof File) {
          return ` -F "${key}=@${value.name}${value.type ? "" : type}"`;
        }
        const sanitizedVal =
          typeof value === "string" ? value.replace(/\\/g, "\\\\").replace(/"/g, '\\"') : value;
        return ` -F "${key}=${sanitizedVal}${type}"`;
      })
      .join("\\\n");
    if (curlForm) {
      curlForm = `${curlForm} \\\n`;
    }
  } else if (body !== undefined && body !== null && body !== "") {
    const rawBody = typeof body === "object" ? JSON.stringify(body) : String(body);
    const isJson =
      contentType.includes("json") ||
      (rawBody.trim().startsWith("{") && rawBody.trim().endsWith("}"));

    if (isJson) {
      try {
        const compactJson = JSON.stringify(JSON.parse(rawBody));
        curlData = ` -d '${compactJson.replace(/'/g, "'\\''")}' \\\n`;
      } catch {
        // If JSON.parse fails, fall through to regular string escape
      }
    }

    if (!curlData) {
      curlData = ` -d '${rawBody.replace(/'/g, "'\"'\"'")}' \\\n`;
    }
  }

  const result = `${curl}${curlHeaders}${curlData}${curlForm}`;
  return result.endsWith(" \\\n") ? result.slice(0, -3) : result;
}
