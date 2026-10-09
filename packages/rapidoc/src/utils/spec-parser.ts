import { dereference, load, upgrade } from '@scalar/openapi-parser';
import { marked } from 'marked';
import { invalidCharsRegEx, rapidocApiKey, sleep } from './common-utils.ts';
import type { OpenAPIV3_1 } from '@scalar/openapi-types';
import type {
  HttpMethod,
  MarkdownHeading,
  ResolvedCallbacks,
  ResolvedComponents,
  ResolvedParameter,
  ResolvedPath,
  ResolvedSecurityScheme,
  ResolvedServer,
  ResolvedSpec,
  ResolvedSpecError,
  ResolvedSubComponent,
  ResolvedTag,
  SortEndpointsBy,
  XBadge,
} from '../types/spec.ts';

/** Plugin accepted by `@scalar/openapi-parser`'s `load()` (the package does not export this type from its root). */
type LoadPlugin = NonNullable<NonNullable<Parameters<typeof load>[1]>['plugins']>[number];

/** Error thrown/handled while loading a spec; carries HTTP details when available. */
interface SpecLoadError extends Error {
  status?: number;
  statusCode?: number;
  response?: Response;
  url?: string;
}

/** Path item (or webhook) holding the operations keyed by method, plus the parser-added `_type`. */
type PathItem = OpenAPIV3_1.PathItemObject & { _type?: string; [method: string]: unknown };

/** Operation object with the RapiDoc extensions read by the parser. */
type OperationObject = Omit<OpenAPIV3_1.OperationObject, 'callbacks' | 'parameters'> & {
  parameters?: ResolvedParameter[];
  callbacks?: ResolvedCallbacks;
  'x-badges'?: XBadge[];
  'x-codeSamples'?: ResolvedPath['xCodeSamples'];
  'x-code-samples'?: ResolvedPath['xCodeSamples'];
};

/** A dereferenced spec document: OpenAPI 3.x with the loosely-typed bits the parser mutates/reads. */
type SpecDocument = Omit<OpenAPIV3_1.Document, 'servers' | 'paths'> & {
  servers?: ResolvedServer[];
  paths: Record<string, PathItem>;
  swagger?: string;
};

/** Tag declared in the spec, with the RapiDoc extensions read by the parser. */
type SpecTag = Omit<OpenAPIV3_1.TagObject, 'name'> & {
  name: string;
  'x-displayName'?: string;
  'x-tag-expanded'?: boolean;
};

/** The `this` of `ProcessSpec`: the custom element it is called on. */
interface SpecHost {
  requestUpdate(): void;
  dispatchEvent(event: Event): boolean;
}

function isUrlLike(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false;
  }
  const trimmed = value.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return false;
  }
  if (trimmed.includes('\n')) {
    return false;
  }
  return true;
}

/**
 * Custom browser fetch plugin for `@scalar/openapi-parser`'s `load()` method.
 *
 * Provides browser-native `fetch` support for loading specifications and resolving
 * relative and external `$ref` files across browser and SSR/Node environments.
 *
 * @param {string} [baseUrl] - The base URL or document path to resolve relative references against.
 * @returns A plugin object conforming to the `@scalar/openapi-parser` plugin interface:
 *   - `check(value)`: Determines whether this plugin handles the given reference/URL.
 *   - `resolvePath(parentPath, reference)`: Resolves relative reference paths against parent document URLs.
 *   - `get(value)`: Fetches file content as text using browser `fetch()`.
 */
function createBrowserFetchPlugin(baseUrl?: string): LoadPlugin {
  // Determine root origin/URL; guard for non-browser environments (SSR / test runners)
  const windowLocation = typeof window !== 'undefined' && window.location?.href ? window.location.href : 'http://localhost/';
  const base = baseUrl ? new URL(baseUrl, windowLocation) : new URL(windowLocation);

  return {
    // Determines if the reference should be fetched by this plugin (ignores inlined JSON/YAML and '#/...' local refs)
    check(value?: unknown) {
      if (typeof value !== 'string' || value.startsWith('#')) {
        return false;
      }
      return isUrlLike(value);
    },
    // Resolves relative $ref paths (e.g. '../common/models.yaml') against their parent document URL
    resolvePath(parentPath: string, reference: string) {
      if (reference.startsWith('http://') || reference.startsWith('https://')) {
        return reference;
      }
      const parentUrl = parentPath && (parentPath.startsWith('http://') || parentPath.startsWith('https://')) ? new URL(parentPath) : base;
      return new URL(reference, parentUrl).href;
    },
    // Fetches the target URL via native fetch and returns the raw specification text
    async get(value: string) {
      const targetUrl = value.startsWith('http://') || value.startsWith('https://') ? value : new URL(value, base).href;
      const resp = await fetch(targetUrl);
      if (!resp.ok) {
        const error: SpecLoadError = new Error(`Failed to load ${targetUrl} (${resp.status})`);
        error.status = resp.status;
        error.statusCode = resp.status;
        error.response = resp;
        error.url = targetUrl;
        throw error;
      }
      return await resp.text();
    },
  };
}

function breakCircularRefs(root: unknown): unknown {
  const seen = new WeakMap<object, unknown>();
  const ancestors = new WeakSet<object>();

  function walk(node: unknown, activeRefs: Set<string> = new Set(), currentRef: string | null = null): unknown {
    if (!node || typeof node !== 'object') {
      return node;
    }

    const ref = (node as Record<string, string>)['x-ref'];
    if (ref) {
      if (activeRefs.has(ref)) {
        return { $ref: ref };
      }
    }

    // Cycle detection via object identity (in active ancestor chain)
    if (ancestors.has(node)) {
      return { $ref: ref || currentRef || '#/components/schemas/Circular' };
    }

    // Memoization for non-cycle nodes (preserves DAG sharing & linear O(V+E) time)
    if (seen.has(node)) {
      return seen.get(node);
    }

    ancestors.add(node);
    let childActiveRefs = activeRefs;
    if (ref) {
      childActiveRefs = new Set(activeRefs);
      childActiveRefs.add(ref);
    }

    let clone: unknown[] | Record<string, unknown>;
    if (Array.isArray(node)) {
      clone = [];
      seen.set(node, clone);
      for (let i = 0; i < node.length; i++) {
        clone.push(walk(node[i], childActiveRefs, ref || currentRef));
      }
    } else {
      clone = {};
      seen.set(node, clone);
      for (const key of Object.keys(node)) {
        if (key === 'x-ref') {
          continue;
        }
        clone[key] = walk((node as Record<string, unknown>)[key], childActiveRefs, ref || currentRef);
      }
    }

    ancestors.delete(node);
    return clone;
  }

  return walk(root);
}

export default async function ProcessSpec(
  this: SpecHost,
  specUrl: Parameters<typeof load>[0],
  generateMissingTags = false,
  sortTags = false,
  sortSchemas = false,
  // attribute values (may be null when the attribute is absent)
  sortEndpointsBy: SortEndpointsBy | string | null = 'none',
  attrApiKey: string | null = '',
  attrApiKeyLocation: string | null = '',
  attrApiKeyValue: string | null = '',
  serverUrl: string | null = '',
  matchPaths = '',
  matchType = '',
  removeEndpointsWithBadgeLabelAs = ''
): Promise<ResolvedSpec | ResolvedSpecError> {
  let jsonParsedSpec: SpecDocument;
  try {
    this.requestUpdate(); // important to show the initial loader

    const fetchPlugin = createBrowserFetchPlugin(typeof specUrl === 'string' && isUrlLike(specUrl) ? specUrl : undefined);
    const loaded = await load(specUrl, { plugins: [fetchPlugin] });

    if (loaded.errors && loaded.errors.length > 0 && !loaded.specification) {
      const firstErr = loaded.errors[0];
      const error: SpecLoadError = new Error(firstErr.message || 'Error loading specification');
      error.status = 404;
      throw error;
    }

    const dereferenceOptions = {
      onDereference: ({ schema: dereferencedSchema, ref }: { schema: Record<string, unknown>; ref: string }) => {
        dereferencedSchema['x-ref'] = ref;
      },
    };

    let schema: SpecDocument;
    if (loaded.specification?.swagger && String(loaded.specification.swagger).startsWith('2')) {
      const upgraded = upgrade(loaded.filesystem);
      const derefResult = await dereference(upgraded.specification!, dereferenceOptions);
      schema = breakCircularRefs(derefResult.schema) as SpecDocument;
    } else {
      const derefResult = await dereference(loaded.filesystem, dereferenceOptions);
      schema = breakCircularRefs(derefResult.schema) as SpecDocument;
    }

    await sleep(0); // important to show the initial loader (allows for rendering updates)

    // If RapiDoc or RapiDocMini
    if (schema && (schema.components || schema.info || schema.servers || schema.tags || schema.paths)) {
      jsonParsedSpec = filterPaths(schema, matchPaths, matchType, removeEndpointsWithBadgeLabelAs);
      this.dispatchEvent(new CustomEvent('before-render', { detail: { spec: jsonParsedSpec } }));
    } else {
      console.info('RapiDoc: %c Invalid Spec Definition %o ', 'color:orangered', schema);
      return {
        specLoadError: true,
        isSpecLoading: false,
        info: {
          title: 'Invalid Spec Definition',
          description: 'Invalid Spec Definition',
          version: '',
        },
        tags: [],
      };
    }
  } catch (err: any) {
    // `any`: thrown value may be a SpecLoadError, a plain Error or anything else (accessed as such below)
    let errDescr;
    console.info('RapiDoc: %c There was an issue while loading/parsing the spec %o ', 'color:orangered', err);
    if (err.statusCode === 404 || err.status === 404) {
      errDescr =
        err.response?.url || err.url
          ? `${err.response?.url || err.url} ┃ Not Found (${err.response?.status || err.status})`
          : 'Spec Not Found ┃ 404';
    } else {
      errDescr = `Unable to load ${err.response?.url || err.url || (typeof specUrl === 'string' ? specUrl : '')} ┃ ${err.response?.status || err.status || err.message}`;
    }
    return {
      specLoadError: true,
      isSpecLoading: false,
      info: {
        title: 'Error loading the spec',
        description: errDescr,
        version: '',
      },
      tags: [],
    };
  }

  // const pathGroups = groupByPaths(jsonParsedSpec);

  // Tags with Paths and WebHooks
  const tags = groupByTags(jsonParsedSpec, sortEndpointsBy, generateMissingTags, sortTags);

  // Components
  const components = getComponents(jsonParsedSpec, sortSchemas);

  // Info Description Headers
  const infoDescriptionHeaders = jsonParsedSpec.info?.description ? getHeadersFromMarkdown(jsonParsedSpec.info.description) : [];

  // Security Scheme
  const securitySchemes: ResolvedSecurityScheme[] = [];
  if (jsonParsedSpec.components?.securitySchemes) {
    const securitySchemeSet = new Set();
    Object.entries(jsonParsedSpec.components.securitySchemes as Record<string, Omit<ResolvedSecurityScheme, 'securitySchemeId'>>).forEach(
      (kv) => {
        if (!securitySchemeSet.has(kv[0])) {
          securitySchemeSet.add(kv[0]);
          const securityObj: ResolvedSecurityScheme = { securitySchemeId: kv[0], ...kv[1] };
          securityObj.in = 'header';
          securityObj.name = 'Authorization'; // Name of the header/cookie/api-key
          securityObj.nameId = kv[1].name || kv[0]; // Name of the security-scheme
          securityObj.user = '';
          securityObj.password = '';
          securityObj.clientId = '';
          securityObj.clientSecret = '';
          securityObj.value = '';
          securityObj.finalKeyValue = '';
          if (kv[1].type === 'apiKey') {
            securityObj.in = kv[1].in || 'header';
            securityObj.name = kv[1].name || 'Authorization';
          }
          securitySchemes.push(securityObj);
        }
      }
    );
  }

  if (attrApiKey && attrApiKeyLocation && attrApiKeyValue) {
    securitySchemes.push({
      securitySchemeId: rapidocApiKey,
      description: 'api-key provided in rapidoc element attributes',
      type: 'apiKey',
      oAuthFlow: '',
      name: attrApiKey, // Name of the header/cookie/api-key
      nameId: attrApiKey, // Name of the security-scheme
      in: attrApiKeyLocation,
      value: attrApiKeyValue,
      finalKeyValue: attrApiKeyValue,
    });
  }

  // Updated Security Type Display Text based on Type
  securitySchemes.forEach((v) => {
    if (v.type === 'http') {
      v.typeDisplay = v.scheme === 'basic' ? 'HTTP Basic' : `HTTP Bearer ${v.nameId}`;
    } else if (v.type === 'apiKey') {
      v.typeDisplay = `API Key (${v.name})`;
    } else if (v.type === 'oauth2') {
      v.typeDisplay = `OAuth (${v.securitySchemeId})`;
    } else {
      v.typeDisplay = v.type || 'None';
    }
  });

  // Servers
  let servers: ResolvedServer[] = [];
  if (jsonParsedSpec.servers && Array.isArray(jsonParsedSpec.servers) && jsonParsedSpec.servers.length > 0) {
    jsonParsedSpec.servers.forEach((v) => {
      let computedUrl = v.url!.trim();
      if (!(computedUrl.startsWith('http') || computedUrl.startsWith('//') || computedUrl.startsWith('{'))) {
        if (typeof window !== 'undefined' && window.location?.origin?.startsWith('http')) {
          v.url = window.location.origin + v.url;
          computedUrl = v.url;
        }
      }
      // Apply server-variables to generate final computed-url
      if (v.variables) {
        Object.entries(v.variables).forEach((kv) => {
          const regex = new RegExp(`{${kv[0]}}`, 'g');
          computedUrl = computedUrl.replace(regex, (kv[1].default || '') as string);
          kv[1].value = (kv[1].default || '') as string;
        });
      }
      v.computedUrl = computedUrl;
    });
    if (serverUrl) {
      jsonParsedSpec.servers.push({ url: serverUrl, computedUrl: serverUrl });
    }
  } else if (serverUrl) {
    jsonParsedSpec.servers = [{ url: serverUrl, computedUrl: serverUrl }];
  } else if (typeof window !== 'undefined' && window.location?.origin?.startsWith('http')) {
    jsonParsedSpec.servers = [{ url: window.location.origin, computedUrl: window.location.origin }];
  } else {
    jsonParsedSpec.servers = [{ url: 'http://localhost', computedUrl: 'http://localhost' }];
  }
  servers = jsonParsedSpec.servers;
  const parsedSpec: ResolvedSpec = {
    specLoadError: false,
    isSpecLoading: false,
    info: jsonParsedSpec.info,
    infoDescriptionHeaders,
    tags,
    components,
    externalDocs: jsonParsedSpec.externalDocs,
    securitySchemes,
    servers,
  };
  return parsedSpec;
}

function filterPaths(openApiObject: SpecDocument, matchPaths = '', matchType = '', removeEndpointsWithBadgeLabelAs = ''): SpecDocument {
  const filteredPaths: Record<string, PathItem> = {};

  // Convert the removePathsWithBadgeLabeledAs to an array if provided
  const labelsToRemove = removeEndpointsWithBadgeLabelAs
    .split(',')
    .map((label) => label.trim().toLowerCase())
    .filter(Boolean);

  // Helper function to check if a path should be included based on matchPaths
  function pathMatches(pathsKey: string, httpMethod: string): boolean {
    if (!matchPaths) {
      return true; // If no matchPaths provided, include everything
    }
    const fullPath = `${httpMethod} ${pathsKey}`.toLowerCase(); // Construct "method path" string
    if (matchType === 'regex') {
      const matchPathsRegex = new RegExp(matchPaths, 'i');
      return matchPathsRegex.test(fullPath);
    }
    return fullPath.includes(matchPaths.toLowerCase());
  }

  // Helper function to check if the badges contain any label that needs to be removed
  function containsLabelToRemove(badges: XBadge[]): boolean {
    return badges.some((badge) => labelsToRemove.includes(badge?.label.toLowerCase()));
  }

  // Loop through the paths in the openApiObject
  Object.entries(openApiObject.paths).forEach(([pathsKey, methods]) => {
    const filteredMethods: PathItem = {};

    Object.entries(methods as Record<string, OperationObject>).forEach(([httpMethod, methodDetails]) => {
      const badges = methodDetails['x-badges'];

      // Filter by matchPaths
      if (pathMatches(pathsKey, httpMethod)) {
        if (badges && Array.isArray(badges)) {
          // Filter out based on removePathsWithBadgeLabeledAs
          if (!containsLabelToRemove(badges)) {
            filteredMethods[httpMethod] = methodDetails;
          }
        } else {
          // No badges present, include the method
          filteredMethods[httpMethod] = methodDetails;
        }
      }
    });

    if (Object.keys(filteredMethods).length > 0) {
      filteredPaths[pathsKey] = filteredMethods;
    }
  });

  openApiObject.paths = filteredPaths;
  return openApiObject;
}

function getHeadersFromMarkdown(markdownContent: string): MarkdownHeading[] {
  const tokens = marked.lexer(markdownContent);
  const headers = tokens.filter((v): v is MarkdownHeading => v.type === 'heading' && (v as MarkdownHeading).depth <= 2);
  return headers || [];
}

function getComponents(openApiSpec: SpecDocument, sortSchemas = false): ResolvedComponents {
  if (!openApiSpec.components) {
    return [];
  }
  const components: ResolvedComponents = [];
  for (const component in openApiSpec.components) {
    const subComponents: ResolvedSubComponent[] = [];
    for (const sComponent in (openApiSpec.components as Record<string, Record<string, unknown>>)[component]) {
      const scmp = {
        show: true,
        id: `${component.toLowerCase()}-${sComponent.toLowerCase()}`.replace(invalidCharsRegEx, '-'),
        name: sComponent,
        component: (openApiSpec.components as Record<string, Record<string, unknown>>)[component][sComponent],
      };
      subComponents.push(scmp);
    }

    let cmpDescription = component;
    let cmpName = component;

    switch (component) {
      case 'schemas':
        if (sortSchemas) {
          subComponents.sort((c1, c2) => c1.name.localeCompare(c2.name));
        }

        cmpName = 'Schemas';
        cmpDescription =
          'Schemas allows the definition of input and output data types. These types can be objects, but also primitives and arrays.';
        break;
      case 'responses':
        cmpName = 'Responses';
        cmpDescription =
          'Describes responses from an API Operation, including design-time, static links to operations based on the response.';
        break;
      case 'parameters':
        cmpName = 'Parameters';
        cmpDescription = 'Describes operation parameters. A unique parameter is defined by a combination of a name and location.';
        break;
      case 'examples':
        cmpName = 'Examples';
        cmpDescription = 'List of Examples for operations, can be requests, responses and objects examples.';
        break;
      case 'requestBodies':
        cmpName = 'Request Bodies';
        cmpDescription = 'Describes common request bodies that are used across the API operations.';
        break;
      case 'headers':
        cmpName = 'Headers';
        cmpDescription = 'Headers follows the structure of the Parameters but they are explicitly in "header"';
        break;
      case 'securitySchemes':
        cmpName = 'Security Schemes';

        cmpDescription =
          "Defines a security scheme that can be used by the operations. Supported schemes are HTTP authentication, an API key (either as a header, a cookie parameter or as a query parameter), OAuth2's common flows(implicit, password, client credentials and authorization code) as defined in RFC6749, and OpenID Connect Discovery.";
        break;
      case 'links':
        cmpName = 'Links';
        cmpDescription =
          "Links represent a possible design-time link for a response. The presence of a link does not guarantee the caller's ability to successfully invoke it, rather it provides a known relationship and traversal mechanism between responses and other operations.";
        break;
      case 'callbacks':
        cmpName = 'Callbacks';

        cmpDescription =
          'A map of possible out-of band callbacks related to the parent operation. Each value in the map is a Path Item Object that describes a set of requests that may be initiated by the API provider and the expected responses. The key value used to identify the path item object is an expression, evaluated at runtime, that identifies a URL to use for the callback operation.';
        break;
      default:
        cmpName = component;
        cmpDescription = component;
        break;
    }

    const cmp = {
      show: true,
      name: cmpName,
      description: cmpDescription,
      subComponents,
    };
    components.push(cmp);
  }

  return components || [];
}

function groupByTags(
  openApiSpec: SpecDocument,
  sortEndpointsBy: string | null = 'none',
  generateMissingTags = false,
  sortTags = false
): ResolvedTag[] {
  const supportedMethods: HttpMethod[] = ['get', 'put', 'post', 'delete', 'patch', 'head', 'options']; // this is also used for ordering endpoints by methods
  const tags: ResolvedTag[] =
    openApiSpec.tags && Array.isArray(openApiSpec.tags) && openApiSpec.tags.length > 0
      ? (openApiSpec.tags as SpecTag[]).map((v) => ({
          show: true,
          elementId: `tag--${v.name.replace(invalidCharsRegEx, '-')}`,
          name: v.name,
          displayName: v['x-displayName'] || v.name,
          description: v.description || '',
          headers: v.description ? getHeadersFromMarkdown(v.description) : [],
          paths: [],
          expanded: v['x-tag-expanded'] !== false,
        }))
      : [];

  const pathsAndWebhooks: Record<string, PathItem> = openApiSpec.paths || {};
  if (openApiSpec.webhooks) {
    for (const [key, value] of Object.entries(openApiSpec.webhooks as Record<string, PathItem>)) {
      value._type = 'webhook';
      pathsAndWebhooks[key] = value;
    }
  }
  // For each path find the tag and push it into the corresponding tag
  for (const pathOrHookName in pathsAndWebhooks) {
    const commonParams = pathsAndWebhooks[pathOrHookName].parameters;
    const commonPathProp = {
      servers: pathsAndWebhooks[pathOrHookName].servers || [],
      parameters: pathsAndWebhooks[pathOrHookName].parameters || [],
    };
    const isWebhook = pathsAndWebhooks[pathOrHookName]._type === 'webhook';
    supportedMethods.forEach((methodName) => {
      if (pathsAndWebhooks[pathOrHookName][methodName]) {
        const pathOrHookObj = openApiSpec.paths[pathOrHookName][methodName] as OperationObject;
        // If path.methods are tagged, else generate it from path
        const pathTags: string[] = pathOrHookObj.tags || [];
        if (pathTags.length === 0) {
          if (generateMissingTags) {
            const pathOrHookNameKey = pathOrHookName.replace(/^\/+|\/+$/g, '');
            const firstWordEndIndex = pathOrHookNameKey.indexOf('/');
            if (firstWordEndIndex === -1) {
              pathTags.push(pathOrHookNameKey);
            } else {
              // firstWordEndIndex -= 1;
              pathTags.push(pathOrHookNameKey.substring(0, firstWordEndIndex));
            }
          } else {
            pathTags.push('General ⦂');
          }
        }

        pathTags.forEach((tag) => {
          let tagObj: ResolvedTag | undefined;
          let specTagsItem: SpecTag | undefined;

          if (openApiSpec.tags) {
            specTagsItem = (openApiSpec.tags as SpecTag[]).find((v) => v.name.toLowerCase() === tag.toLowerCase());
          }

          tagObj = tags.find((v) => v.name === tag);
          if (!tagObj) {
            tagObj = {
              show: true,
              elementId: `tag--${tag.replace(invalidCharsRegEx, '-')}`,
              name: tag,
              description: specTagsItem?.description || '',
              headers: specTagsItem?.description ? getHeadersFromMarkdown(specTagsItem.description) : [],
              paths: [],
              expanded: specTagsItem ? specTagsItem['x-tag-expanded'] !== false : true,
            };
            tags.push(tagObj);
          }

          // Generate a short summary which is broken
          let shortSummary = (pathOrHookObj.summary || pathOrHookObj.description || `${methodName.toUpperCase()} ${pathOrHookName}`).trim();
          if (shortSummary.length > 100) {
            [shortSummary] = shortSummary.split(/[.|!|?]\s|[\r?\n]/); // take the first line (period or carriage return)
          }
          // Merge Common Parameters with This methods parameters
          let finalParameters: ResolvedParameter[] = [];
          if (commonParams) {
            if (pathOrHookObj.parameters) {
              finalParameters = commonParams
                .filter((commonParam) => {
                  if (!pathOrHookObj.parameters!.some((param) => commonParam.name === param.name && commonParam.in === param.in)) {
                    return commonParam;
                  }
                })
                .concat(pathOrHookObj.parameters);
            } else {
              finalParameters = commonParams.slice(0);
            }
          } else {
            finalParameters = pathOrHookObj.parameters ? pathOrHookObj.parameters.slice(0) : [];
          }

          // Filter callbacks to contain only objects.
          if (pathOrHookObj.callbacks) {
            for (const [callbackName, callbackConfig] of Object.entries(pathOrHookObj.callbacks)) {
              const filteredCallbacks = Object.entries(callbackConfig).filter((entry) => typeof entry[1] === 'object') || [];
              pathOrHookObj.callbacks[callbackName] = Object.fromEntries(filteredCallbacks);
            }
          }

          // Update Responses
          tagObj.paths.push({
            show: true,
            expanded: false,
            isWebhook,
            expandedAtLeastOnce: false,
            summary: pathOrHookObj.summary || '',
            description: pathOrHookObj.description || '',
            externalDocs: pathOrHookObj.externalDocs,
            shortSummary,
            method: methodName,
            path: pathOrHookName,
            operationId: pathOrHookObj.operationId,
            elementId: `${methodName}-${pathOrHookName.replace(invalidCharsRegEx, '-')}`,
            servers: pathOrHookObj.servers ? commonPathProp.servers.concat(pathOrHookObj.servers) : commonPathProp.servers,
            parameters: finalParameters,
            requestBody: pathOrHookObj.requestBody,
            responses: pathOrHookObj.responses,
            callbacks: pathOrHookObj.callbacks,
            deprecated: pathOrHookObj.deprecated,
            security: pathOrHookObj.security,
            // commonSummary: commonPathProp.summary,
            // commonDescription: commonPathProp.description,
            xBadges: pathOrHookObj['x-badges'] || undefined,
            xCodeSamples: pathOrHookObj['x-codeSamples'] || pathOrHookObj['x-code-samples'] || '',
          });
        }); // End of tag path create
      }
    }); // End of Methods
  }

  const tagsWithSortedPaths = tags.filter((tag) => tag.paths && tag.paths.length > 0);
  if (sortEndpointsBy !== 'none') {
    tagsWithSortedPaths.forEach((tag) => {
      if (sortEndpointsBy === 'method') {
        // TODO(ts-migration): localeCompare is given a number (implicit string coercion); the sort compares indices as strings, so 10+ would mis-order (harmless with 7 methods)
        tag.paths.sort((a, b) =>
          supportedMethods
            .indexOf(a.method)
            .toString()
            .localeCompare(supportedMethods.indexOf(b.method) as unknown as string)
        );
      } else if (sortEndpointsBy === 'summary') {
        tag.paths.sort((a, b) => a.shortSummary.localeCompare(b.shortSummary));
      } else if (sortEndpointsBy === 'path') {
        tag.paths.sort((a, b) => a.path.localeCompare(b.path));
      }
      tag.firstPathId = tag.paths[0].elementId;
    });
  }
  return sortTags ? tagsWithSortedPaths.sort((a, b) => a.name.localeCompare(b.name)) : tagsWithSortedPaths;
}
