import { generateExample, standardizeExample } from "./schema-utils.js";
import { serializeStreamItems, streamKind } from "./stream-utils.js";
import { parseStatusCodes, pickStatusCode } from "./status-codes.js";

/** How many items the mock streams when it generates them from the item schema */
const MOCK_STREAM_ITEMS = 5;
/** The gap between streamed items when mock-server-delay is 0, so the stream is visible */
const MOCK_STREAM_INTERVAL = 300;

/**
 * The chunks the mock streams for an OpenAPI 3.2 sequential media type (`itemSchema`), one per
 * item, each ending with its separator: the items of the first Example Object (an array of items,
 * or the stream's text split into events or lines), else MOCK_STREAM_ITEMS items generated from the
 * item schema, numbered through an `id` property when the item has one.
 */
export function mockStreamChunks(contentType, mediaObj) {
  const chunkOf = (item) => `${serializeStreamItems([item], contentType)}\n`;
  const examples =
    standardizeExample(mediaObj.examples) || standardizeExample(mediaObj.example) || {};
  const first = Object.values(examples)[0]?.value;
  if (Array.isArray(first) && first.length > 0) {
    return first.map(chunkOf);
  }
  if (typeof first === "string" && first) {
    const separator = streamKind(contentType) === "sse" ? /\n\n+/ : /\n+/;
    return first
      .split(separator)
      .filter((part) => part.trim())
      .map((part) => `${part}${streamKind(contentType) === "sse" ? "\n\n" : "\n"}`);
  }
  const generated = generateExample(
    mediaObj.itemSchema,
    "application/json",
    null,
    null,
    true,
    false,
    "json",
  )[0]?.exampleValue;
  if (generated === undefined) return [];
  return Array.from({ length: MOCK_STREAM_ITEMS }, (_, i) => {
    if (generated && typeof generated === "object" && !Array.isArray(generated)) {
      const item = { ...generated };
      if ("id" in item) {
        item.id = typeof item.id === "number" ? i + 1 : String(i + 1);
      }
      return chunkOf(item);
    }
    return chunkOf(generated);
  });
}

/**
 * A body that sends the chunks one at a time, `interval` ms apart (the first at once), and ends
 * after the last. Aborting `signal` (STOP in the Try console) errors it with an AbortError.
 */
function timedStream(chunks, interval, signal) {
  const encoder = new TextEncoder();
  let timer;
  return new ReadableStream({
    start(controller) {
      let i = 0;
      const sendNext = () => {
        if (i >= chunks.length) {
          controller.close();
          return;
        }
        controller.enqueue(encoder.encode(chunks[i]));
        i += 1;
        timer = setTimeout(sendNext, interval);
      };
      signal?.addEventListener("abort", () => {
        clearTimeout(timer);
        try {
          controller.error(new DOMException("The stream was stopped", "AbortError"));
        } catch {
          // already closed
        }
      });
      sendNext();
    },
    cancel() {
      clearTimeout(timer);
    },
  });
}

const STATUS_TEXTS = {
  200: "OK",
  201: "Created",
  202: "Accepted",
  204: "No Content",
  301: "Moved Permanently",
  302: "Found",
  304: "Not Modified",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  409: "Conflict",
  422: "Unprocessable Entity",
  429: "Too Many Requests",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
};

let originalFetch = null;
let originalXhrOpen = null;
let originalXhrSend = null;
let originalXhrSetRequestHeader = null;

/**
 * One mock per owner (the element that turned it on), so several <rapi-doc> and <rapi-doc-mini>
 * on a page can each mock their own API: `{ routes, config, cycle }`. Calls without an owner use
 * DEFAULT_OWNER, so a page with one mocked element works as before.
 */
const mocks = new Map();
const DEFAULT_OWNER = Symbol("rapidoc-mock");

/**
 * The status setting: a string of codes (`"200, 404"`) for every operation, or a map by
 * operation (`{ "POST /store/order": "503, 200", "*": "200" }`, `*` the default), also as JSON
 * text. Map keys are the spec's method and path template, method case-insensitive.
 */
function normalizeStatus(value) {
  if (value && typeof value === "object") {
    const map = {};
    for (const [key, codes] of Object.entries(value)) {
      const k = key.trim();
      if (!k || !codes) continue;
      map[k === "*" ? "*" : k.replace(/^(\w+)\s+/, (m, method) => `${method.toUpperCase()} `)] =
        String(codes);
    }
    return map;
  }
  const text = typeof value === "string" ? value.trim() : "";
  if (text.startsWith("{")) {
    try {
      return normalizeStatus(JSON.parse(text));
    } catch {
      return "";
    }
  }
  return text;
}

/** The codes for a route: its own entry of a status map, else the map's `*`, else the string. */
function codesFor(status, routeKey) {
  if (!status || typeof status === "string") return status || "";
  return status[routeKey] ?? status["*"] ?? "";
}

function normalizeConfig(options = {}, current = {}) {
  return {
    statusCode:
      options.statusCode !== undefined
        ? normalizeStatus(options.statusCode)
        : current.statusCode || "",
    // For codes without a prefix (cycle:, random:, first:); cycle when unset
    statusStrategy:
      options.statusStrategy !== undefined
        ? options.statusStrategy || "cycle"
        : current.statusStrategy || "cycle",
    delay: options.delay !== undefined ? Number(options.delay) || 0 : current.delay || 0,
    log: options.log !== undefined ? options.log !== "false" : current.log !== false,
  };
}

/**
 * The bases a route can be requested under, from the OpenAPI servers: `{ origin, base }` per
 * server (origin null for a relative server URL), plus the bare path (`{ origin: null, base: "" }`)
 * so a request without the server's base path still matches.
 */
function extractServerBases(servers = []) {
  const bases = new Map();
  bases.set("|", { origin: null, base: "" });

  servers.forEach((s) => {
    const rawUrl = s.computedUrl || s.url || "";
    if (!rawUrl) return;

    try {
      if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
        const u = new URL(rawUrl);
        const p = u.pathname.replace(/\/+$/, "");
        bases.set(`${u.origin}|${p}`, { origin: u.origin, base: p });
      } else {
        const p = rawUrl.replace(/\/+$/, "");
        if (p) bases.set(`|${p}`, { origin: null, base: p.startsWith("/") ? p : `/${p}` });
      }
    } catch {
      // Ignore invalid URL formats
    }
  });

  return Array.from(bases.values());
}

/**
 * Converts an OpenAPI path template (e.g. /pets/{id}) into a matching RegExp.
 */
function compileRoutePattern(pathTemplate, basePath = "") {
  const cleanBase = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  const fullPath = cleanBase + (pathTemplate.startsWith("/") ? pathTemplate : `/${pathTemplate}`);

  // Replace {param} with a placeholder token to avoid escaping issues
  const tokenized = fullPath.replace(/\{([a-zA-Z0-9_-]+)\}/g, "__PARAM_$1__");

  // Escape special regex characters
  const escaped = tokenized.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

  // Replace placeholder token with regex capture group
  const pattern = escaped.replace(/__PARAM_([a-zA-Z0-9_-]+)__/g, "(?<$1>[^/?#]+)");

  return new RegExp(`^${pattern}(?:\\/)?$`);
}

/**
 * Builds the route table from the resolved OpenAPI spec.
 */
export function compileRoutes(spec) {
  const routes = [];
  const rootBases = extractServerBases(spec?.servers);

  if (!spec?.tags || !Array.isArray(spec.tags)) {
    return routes;
  }

  const seenRoutes = new Set();

  spec.tags.forEach((tag) => {
    (tag.paths || []).forEach((pathItem) => {
      const method = (pathItem.method || "GET").toUpperCase();
      const pathTemplate = pathItem.path || "";
      const routeKey = `${method} ${pathTemplate}`;

      if (seenRoutes.has(routeKey)) {
        return;
      }
      seenRoutes.add(routeKey);

      const endpointBases =
        pathItem.servers?.length > 0 ? extractServerBases(pathItem.servers) : rootBases;

      const patterns = endpointBases.map(({ origin, base }) => ({
        regex: compileRoutePattern(pathTemplate, base),
        origin,
        base,
      }));

      routes.push({
        method,
        pathTemplate,
        routeKey,
        patterns,
        responses: pathItem.responses || {},
        parameters: pathItem.parameters || [],
      });
    });
  });

  return routes;
}

/**
 * Matches a request (method + URL) against every mock's routes. With several mocks, the most
 * specific match wins: a route under the server's origin and base path beats one under the base
 * path alone, which beats a bare path; ties go to the mock enabled first.
 */
function matchRoute(method, urlStr) {
  if (!mocks.size || !urlStr) {
    return null;
  }

  let reqUrl;
  try {
    const origin =
      typeof window !== "undefined" && window.location?.href
        ? window.location.href
        : "http://localhost";
    reqUrl = new URL(urlStr, origin);
  } catch {
    return null;
  }

  const upperMethod = (method || "GET").toUpperCase();
  const pathname = decodeURI(reqUrl.pathname);

  let best = null;
  for (const mock of mocks.values()) {
    for (const route of mock.routes) {
      if (route.method !== upperMethod) {
        continue;
      }

      for (const pattern of route.patterns) {
        const match = pathname.match(pattern.regex);
        if (!match) continue;
        const rank =
          (pattern.base ? 1 : 0) + (pattern.origin && pattern.origin === reqUrl.origin ? 1 : 0);
        if (!best || rank > best.rank) {
          best = { mock, route, rank, pathParams: match.groups || {}, url: reqUrl };
        }
      }
    }
  }

  return best;
}

/**
 * Chooses the status code based on config and strategy (first, cycle, random).
 */
function selectStatusCode(configuredCodesStr, strategy, endpointKey, responses = {}, cycle) {
  // A `cycle:` / `random:` / `first:` prefix on the codes wins over the element's strategy
  const { codes } = parseStatusCodes(configuredCodesStr, strategy);

  if (codes.length === 0) {
    // Look for 2xx response defined in spec
    const twoXx = Object.keys(responses).find((k) => k.startsWith("2"));
    if (twoXx) return twoXx;
    if ("default" in responses) return "default";
    const firstCode = Object.keys(responses)[0];
    return firstCode || "200";
  }

  // The call count per operation, for cycle; it starts again when the codes change (updateMockConfig)
  const index = cycle?.get(endpointKey) || 0;
  cycle?.set(endpointKey, index + 1);
  return pickStatusCode(configuredCodesStr, index, strategy);
}

/**
 * Generates the mock response body and headers for a matched route.
 */
function buildMockResponsePayload(route, statusCode) {
  const responseDef =
    route.responses?.[statusCode] ||
    route.responses?.[String(statusCode)] ||
    route.responses?.["default"];

  const headers = {
    "X-Mock-Server": "RapiDoc",
    "Access-Control-Allow-Origin": "*",
  };

  let body = "";
  let streamChunks = null;
  let contentType = "application/json";

  if (responseDef?.content) {
    const availableTypes = Object.keys(responseDef.content);
    // Prefer json, then xml, then text, then first available
    contentType =
      availableTypes.find((t) => t.includes("json")) ||
      availableTypes.find((t) => t.includes("xml")) ||
      availableTypes.find((t) => t.includes("text")) ||
      availableTypes[0] ||
      "application/json";

    const mediaObj = responseDef.content[contentType];
    if (mediaObj?.itemSchema && !mediaObj.schema) {
      // OpenAPI 3.2 stream: one chunk per item (SSE event, JSON line); fetch sends them over time
      streamChunks = mockStreamChunks(contentType, mediaObj);
      body = streamChunks.join("");
    } else if (mediaObj) {
      if (mediaObj.example !== undefined) {
        body =
          typeof mediaObj.example === "object"
            ? JSON.stringify(mediaObj.example, null, 2)
            : String(mediaObj.example);
      } else if (mediaObj.examples && Object.keys(mediaObj.examples).length > 0) {
        const firstEg = Object.values(mediaObj.examples)[0]?.value;
        if (firstEg !== undefined) {
          body = typeof firstEg === "object" ? JSON.stringify(firstEg, null, 2) : String(firstEg);
        }
      }

      if (!body && mediaObj.schema) {
        const generated = generateExample(
          mediaObj.schema,
          contentType,
          null,
          null,
          true,
          false,
          "text",
          true,
        );

        if (generated && generated.length > 0) {
          const val = generated[0].exampleValue;
          body = typeof val === "object" ? JSON.stringify(val, null, 2) : String(val);
        }
      }
    }
  }

  // Handle empty or default body when spec has no content defined
  if (!body) {
    if (String(statusCode) === "204") {
      body = "";
    } else if (contentType.includes("json")) {
      const statusNum = Number(statusCode) || 200;
      body = JSON.stringify(
        {
          status: statusNum,
          message: STATUS_TEXTS[statusNum] || "Mock Response",
        },
        null,
        2,
      );
    } else {
      body = STATUS_TEXTS[Number(statusCode)] || "OK";
    }
  }

  // Copy defined headers from spec if any
  if (responseDef?.headers) {
    Object.entries(responseDef.headers).forEach(([hdrKey, hdrDef]) => {
      if (hdrDef.schema?.default !== undefined) {
        headers[hdrKey] = String(hdrDef.schema.default);
      } else if (hdrDef.example !== undefined) {
        headers[hdrKey] = String(hdrDef.example);
      }
    });
  }

  if (String(statusCode) !== "204") {
    headers["Content-Type"] = contentType;
  }

  return {
    statusCode: Number(statusCode) || 200,
    statusText:
      STATUS_TEXTS[Number(statusCode)] || (statusCode === "default" ? "OK" : "Mock Response"),
    headers,
    body,
    streamChunks: streamChunks?.length ? streamChunks : null,
  };
}

/** The status and payload of a matched request, by the mock that owns the route. */
function answer(match) {
  const { config, cycle } = match.mock;
  const statusCode = selectStatusCode(
    codesFor(config.statusCode, match.route.routeKey),
    config.statusStrategy,
    match.route.routeKey,
    match.route.responses,
    cycle,
  );
  return { config, statusCode, payload: buildMockResponsePayload(match.route, statusCode) };
}

/**
 * Enables the in-browser mock for `options.owner` (the element; omitted: a page-wide default),
 * replacing that owner's routes and config. Other owners' mocks stay. window.fetch and
 * XMLHttpRequest are patched once, while at least one mock is enabled.
 */
export function enableMockServer(spec, options = {}) {
  const owner = options.owner || DEFAULT_OWNER;
  const current = mocks.get(owner);
  mocks.set(owner, {
    routes: compileRoutes(spec),
    config: normalizeConfig(options, current?.config),
    cycle: new Map(),
  });

  if (typeof window === "undefined") {
    return;
  }

  // --- Patch window.fetch ---
  if (!originalFetch && window.fetch) {
    originalFetch = window.fetch;

    window.fetch = async function mockFetch(input, init = {}) {
      if (!mocks.size) {
        return originalFetch.apply(this, arguments);
      }

      let url = "";
      let method = "GET";

      if (typeof input === "string") {
        url = input;
        method = init?.method || "GET";
      } else if (input instanceof URL) {
        url = input.href;
        method = init?.method || "GET";
      } else if (input && typeof input === "object" && "url" in input) {
        url = input.url;
        method = init?.method || input.method || "GET";
      }

      const match = matchRoute(method, url);
      if (!match) {
        return originalFetch.apply(this, arguments);
      }

      const { config, payload } = answer(match);

      // A stream answers at once and sends its items mock-server-delay apart
      const streams = payload.streamChunks && typeof ReadableStream !== "undefined";
      if (config.delay > 0 && !streams) {
        await new Promise((resolve) => setTimeout(resolve, config.delay));
      }

      if (config.log) {
        console.info(
          `%c[RapiDoc Mock]%c ${method.toUpperCase()} ${match.url.pathname} ➔ ${payload.statusCode} ${payload.statusText}`,
          "color:#10b981; font-weight:bold;",
          "color:inherit;",
        );
      }

      const signal = init?.signal || (input && typeof input === "object" ? input.signal : null);
      const responseBody = streams
        ? timedStream(
            payload.streamChunks,
            config.delay > 0 ? config.delay : MOCK_STREAM_INTERVAL,
            signal,
          )
        : payload.body;
      return new Response(responseBody, {
        status: payload.statusCode,
        statusText: payload.statusText,
        headers: payload.headers,
      });
    };
  }

  // --- Patch XMLHttpRequest ---
  if (!originalXhrOpen && window.XMLHttpRequest) {
    originalXhrOpen = window.XMLHttpRequest.prototype.open;
    originalXhrSend = window.XMLHttpRequest.prototype.send;
    originalXhrSetRequestHeader = window.XMLHttpRequest.prototype.setRequestHeader;

    window.XMLHttpRequest.prototype.open = function mockXhrOpen(method, url, ...rest) {
      this._mockMethod = method;
      this._mockUrl = url;
      this._mockHeaders = {};
      return originalXhrOpen.apply(this, [method, url, ...rest]);
    };

    window.XMLHttpRequest.prototype.setRequestHeader = function mockXhrSetHeader(name, value) {
      if (this._mockHeaders) {
        this._mockHeaders[name] = value;
      }
      return originalXhrSetRequestHeader.apply(this, arguments);
    };

    window.XMLHttpRequest.prototype.send = function mockXhrSend() {
      if (!mocks.size) {
        return originalXhrSend.apply(this, arguments);
      }

      const match = matchRoute(this._mockMethod, this._mockUrl);
      if (!match) {
        return originalXhrSend.apply(this, arguments);
      }

      const { config, payload } = answer(match);

      const delayMs = config.delay > 0 ? config.delay : 10;

      setTimeout(() => {
        if (config.log) {
          console.info(
            `%c[RapiDoc Mock (XHR)]%c ${this._mockMethod.toUpperCase()} ${match.url.pathname} ➔ ${payload.statusCode} ${payload.statusText}`,
            "color:#10b981; font-weight:bold;",
            "color:inherit;",
          );
        }

        Object.defineProperty(this, "readyState", { value: 4, writable: true });
        Object.defineProperty(this, "status", { value: payload.statusCode, writable: true });
        Object.defineProperty(this, "statusText", { value: payload.statusText, writable: true });
        Object.defineProperty(this, "responseText", { value: payload.body, writable: true });
        Object.defineProperty(this, "response", { value: payload.body, writable: true });

        const headerStr = Object.entries(payload.headers)
          .map(([k, v]) => `${k}: ${v}\r\n`)
          .join("");

        this.getAllResponseHeaders = () => headerStr;
        this.getResponseHeader = (name) => {
          const lower = name.toLowerCase();
          const found = Object.keys(payload.headers).find((k) => k.toLowerCase() === lower);
          return found ? payload.headers[found] : null;
        };

        this.dispatchEvent(new Event("readystatechange"));
        this.dispatchEvent(new Event("load"));
        this.dispatchEvent(new Event("loadend"));
        if (typeof this.onreadystatechange === "function") {
          this.onreadystatechange();
        }
        if (typeof this.onload === "function") {
          this.onload();
        }
      }, delayMs);
    };
  }
}

/**
 * Disables the mock of `owner` (omitted: the page-wide default). The original fetch and
 * XMLHttpRequest come back once no mock is enabled.
 */
export function disableMockServer(owner = DEFAULT_OWNER) {
  mocks.delete(owner);
  if (mocks.size) return;

  if (typeof window !== "undefined") {
    if (originalFetch) {
      window.fetch = originalFetch;
      originalFetch = null;
    }
    if (originalXhrOpen) {
      window.XMLHttpRequest.prototype.open = originalXhrOpen;
      window.XMLHttpRequest.prototype.send = originalXhrSend;
      window.XMLHttpRequest.prototype.setRequestHeader = originalXhrSetRequestHeader;
      originalXhrOpen = null;
      originalXhrSend = null;
      originalXhrSetRequestHeader = null;
    }
  }
}

/**
 * Updates the options of `options.owner`'s mock (omitted: the page-wide default) without
 * recompiling its routes. Does nothing for an owner without a mock.
 */
export function updateMockConfig(options = {}) {
  const mock = mocks.get(options.owner || DEFAULT_OWNER);
  if (!mock) return;
  mock.config = normalizeConfig(options, mock.config);
  // New codes or strategy: each operation's cycle starts again from its first code
  if (options.statusCode !== undefined || options.statusStrategy !== undefined)
    mock.cycle = new Map();
}

/** Whether `owner`'s mock is enabled; without an owner, whether any mock is. */
export function isMockServerActive(owner) {
  return owner ? mocks.has(owner) : mocks.size > 0;
}
