// @ts-nocheck
import { generateExample } from './schema-utils.ts';

const STATUS_TEXTS = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  204: 'No Content',
  301: 'Moved Permanently',
  302: 'Found',
  304: 'Not Modified',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
};

let isMockActive = false;
let originalFetch = null;
let originalXhrOpen = null;
let originalXhrSend = null;
let originalXhrSetRequestHeader = null;

let compiledRoutes = [];
let mockConfig = {
  statusCode: '',
  statusStrategy: 'first',
  delay: 0,
  log: 'true',
};

const routeCycleIndices = new Map();

/**
 * Normalizes and extracts base paths and hostnames from OpenAPI servers array.
 */
function extractServerBases(servers = []) {
  const bases = new Set();
  // Always include empty root base path
  bases.add('');

  servers.forEach((s) => {
    const rawUrl = s.computedUrl || s.url || '';
    if (!rawUrl) return;

    try {
      if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
        const u = new URL(rawUrl);
        const p = u.pathname.replace(/\/+$/, '');
        if (p) bases.add(p);
      } else {
        const p = rawUrl.replace(/\/+$/, '');
        if (p) bases.add(p.startsWith('/') ? p : `/${p}`);
      }
    } catch {
      // Ignore invalid URL formats
    }
  });

  return Array.from(bases);
}

/**
 * Converts an OpenAPI path template (e.g. /pets/{id}) into a matching RegExp.
 */
function compileRoutePattern(pathTemplate, basePath = '') {
  const cleanBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  const fullPath = cleanBase + (pathTemplate.startsWith('/') ? pathTemplate : `/${pathTemplate}`);

  // Replace {param} with a placeholder token to avoid escaping issues
  const tokenized = fullPath.replace(/\{([a-zA-Z0-9_-]+)\}/g, '__PARAM_$1__');

  // Escape special regex characters
  const escaped = tokenized.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

  // Replace placeholder token with regex capture group
  const pattern = escaped.replace(/__PARAM_([a-zA-Z0-9_-]+)__/g, '(?<$1>[^/?#]+)');

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
      const method = (pathItem.method || 'GET').toUpperCase();
      const pathTemplate = pathItem.path || '';
      const routeKey = `${method} ${pathTemplate}`;

      if (seenRoutes.has(routeKey)) {
        return;
      }
      seenRoutes.add(routeKey);

      const endpointBases = pathItem.servers?.length > 0 ? extractServerBases(pathItem.servers) : rootBases;

      const patterns = endpointBases.map((base) => compileRoutePattern(pathTemplate, base));

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
 * Matches a request (method + URL) against the compiled routes.
 */
function matchRoute(method, urlStr) {
  if (!compiledRoutes.length || !urlStr) {
    return null;
  }

  let reqUrl;
  try {
    const origin = typeof window !== 'undefined' && window.location?.href ? window.location.href : 'http://localhost';
    reqUrl = new URL(urlStr, origin);
  } catch {
    return null;
  }

  const upperMethod = (method || 'GET').toUpperCase();
  const pathname = decodeURI(reqUrl.pathname);

  for (const route of compiledRoutes) {
    if (route.method !== upperMethod) {
      continue;
    }

    for (const pattern of route.patterns) {
      const match = pathname.match(pattern);
      if (match) {
        return {
          route,
          pathParams: match.groups || {},
          url: reqUrl,
        };
      }
    }
  }

  return null;
}

/**
 * Chooses the status code based on config and strategy (first, cycle, random).
 */
function selectStatusCode(configuredCodesStr, strategy, endpointKey, responses = {}) {
  const codes = (configuredCodesStr || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (codes.length === 0) {
    // Look for 2xx response defined in spec
    const twoXx = Object.keys(responses).find((k) => k.startsWith('2'));
    if (twoXx) return twoXx;
    if ('default' in responses) return 'default';
    const firstCode = Object.keys(responses)[0];
    return firstCode || '200';
  }

  if (strategy === 'random') {
    return codes[Math.floor(Math.random() * codes.length)];
  }

  if (strategy === 'cycle') {
    const currentIndex = routeCycleIndices.get(endpointKey) || 0;
    const selected = codes[currentIndex % codes.length];
    routeCycleIndices.set(endpointKey, (currentIndex + 1) % codes.length);
    return selected;
  }

  // 'first'
  return codes[0];
}

/**
 * Generates the mock response body and headers for a matched route.
 */
function buildMockResponsePayload(route, statusCode) {
  const responseDef = route.responses?.[statusCode] || route.responses?.[String(statusCode)] || route.responses?.['default'];

  const headers = {
    'X-Mock-Server': 'RapiDoc',
    'Access-Control-Allow-Origin': '*',
  };

  let body = '';
  let contentType = 'application/json';

  if (responseDef?.content) {
    const availableTypes = Object.keys(responseDef.content);
    // Prefer json, then xml, then text, then first available
    contentType =
      availableTypes.find((t) => t.includes('json')) ||
      availableTypes.find((t) => t.includes('xml')) ||
      availableTypes.find((t) => t.includes('text')) ||
      availableTypes[0] ||
      'application/json';

    const mediaObj = responseDef.content[contentType];
    if (mediaObj) {
      if (mediaObj.example !== undefined) {
        body = typeof mediaObj.example === 'object' ? JSON.stringify(mediaObj.example, null, 2) : String(mediaObj.example);
      } else if (mediaObj.examples && Object.keys(mediaObj.examples).length > 0) {
        const firstEg = Object.values(mediaObj.examples)[0]?.value;
        if (firstEg !== undefined) {
          body = typeof firstEg === 'object' ? JSON.stringify(firstEg, null, 2) : String(firstEg);
        }
      }

      if (!body && mediaObj.schema) {
        const generated = generateExample(mediaObj.schema, contentType, null, null, true, false, 'text', true);

        if (generated && generated.length > 0) {
          const val = generated[0].exampleValue;
          body = typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val);
        }
      }
    }
  }

  // Handle empty or default body when spec has no content defined
  if (!body) {
    if (String(statusCode) === '204') {
      body = '';
    } else if (contentType.includes('json')) {
      const statusNum = Number(statusCode) || 200;
      body = JSON.stringify(
        {
          status: statusNum,
          message: STATUS_TEXTS[statusNum] || 'Mock Response',
        },
        null,
        2
      );
    } else {
      body = STATUS_TEXTS[Number(statusCode)] || 'OK';
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

  if (String(statusCode) !== '204') {
    headers['Content-Type'] = contentType;
  }

  return {
    statusCode: Number(statusCode) || 200,
    statusText: STATUS_TEXTS[Number(statusCode)] || (statusCode === 'default' ? 'OK' : 'Mock Response'),
    headers,
    body,
  };
}

/**
 * Enables the in-browser mock server by patching window.fetch and XMLHttpRequest.
 */
export function enableMockServer(spec, options = {}) {
  mockConfig = {
    statusCode: options.statusCode || '',
    statusStrategy: options.statusStrategy || 'first',
    delay: Number(options.delay) || 0,
    log: options.log !== 'false',
  };

  compiledRoutes = compileRoutes(spec);
  routeCycleIndices.clear();

  if (isMockActive) {
    return;
  }

  if (typeof window === 'undefined') {
    return;
  }

  // --- Patch window.fetch ---
  if (!originalFetch && window.fetch) {
    originalFetch = window.fetch;

    window.fetch = async function mockFetch(input, init = {}) {
      if (!isMockActive) {
        return originalFetch.apply(this, arguments);
      }

      let url = '';
      let method = 'GET';

      if (typeof input === 'string') {
        url = input;
        method = init?.method || 'GET';
      } else if (input instanceof URL) {
        url = input.href;
        method = init?.method || 'GET';
      } else if (input && typeof input === 'object' && 'url' in input) {
        url = input.url;
        method = init?.method || input.method || 'GET';
      }

      const match = matchRoute(method, url);
      if (!match) {
        return originalFetch.apply(this, arguments);
      }

      const statusCode = selectStatusCode(mockConfig.statusCode, mockConfig.statusStrategy, match.route.routeKey, match.route.responses);
      const payload = buildMockResponsePayload(match.route, statusCode);

      if (mockConfig.delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, mockConfig.delay));
      }

      if (mockConfig.log) {
        console.info(
          `%c[RapiDoc Mock]%c ${method.toUpperCase()} ${match.url.pathname} ➔ ${payload.statusCode} ${payload.statusText}`,
          'color:#10b981; font-weight:bold;',
          'color:inherit;'
        );
      }

      return new Response(payload.body, {
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
      if (!isMockActive) {
        return originalXhrSend.apply(this, arguments);
      }

      const match = matchRoute(this._mockMethod, this._mockUrl);
      if (!match) {
        return originalXhrSend.apply(this, arguments);
      }

      const statusCode = selectStatusCode(mockConfig.statusCode, mockConfig.statusStrategy, match.route.routeKey, match.route.responses);
      const payload = buildMockResponsePayload(match.route, statusCode);

      const delayMs = mockConfig.delay > 0 ? mockConfig.delay : 10;

      setTimeout(() => {
        if (mockConfig.log) {
          console.info(
            `%c[RapiDoc Mock (XHR)]%c ${this._mockMethod.toUpperCase()} ${match.url.pathname} ➔ ${payload.statusCode} ${payload.statusText}`,
            'color:#10b981; font-weight:bold;',
            'color:inherit;'
          );
        }

        Object.defineProperty(this, 'readyState', { value: 4, writable: true });
        Object.defineProperty(this, 'status', { value: payload.statusCode, writable: true });
        Object.defineProperty(this, 'statusText', { value: payload.statusText, writable: true });
        Object.defineProperty(this, 'responseText', { value: payload.body, writable: true });
        Object.defineProperty(this, 'response', { value: payload.body, writable: true });

        const headerStr = Object.entries(payload.headers)
          .map(([k, v]) => `${k}: ${v}\r\n`)
          .join('');

        this.getAllResponseHeaders = () => headerStr;
        this.getResponseHeader = (name) => {
          const lower = name.toLowerCase();
          const found = Object.keys(payload.headers).find((k) => k.toLowerCase() === lower);
          return found ? payload.headers[found] : null;
        };

        this.dispatchEvent(new Event('readystatechange'));
        this.dispatchEvent(new Event('load'));
        this.dispatchEvent(new Event('loadend'));
        if (typeof this.onreadystatechange === 'function') {
          this.onreadystatechange();
        }
        if (typeof this.onload === 'function') {
          this.onload();
        }
      }, delayMs);
    };
  }

  isMockActive = true;
}

/**
 * Disables the mock server and restores original network primitives.
 */
export function disableMockServer() {
  isMockActive = false;
  compiledRoutes = [];
  routeCycleIndices.clear();

  if (typeof window !== 'undefined') {
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
 * Updates mock options without re-registering or recompiling routes.
 */
export function updateMockConfig(options = {}) {
  if (options.statusCode !== undefined) mockConfig.statusCode = options.statusCode;
  if (options.statusStrategy !== undefined) mockConfig.statusStrategy = options.statusStrategy;
  if (options.delay !== undefined) mockConfig.delay = Number(options.delay) || 0;
  if (options.log !== undefined) mockConfig.log = options.log !== 'false';
}

export function isMockServerActive() {
  return isMockActive;
}
