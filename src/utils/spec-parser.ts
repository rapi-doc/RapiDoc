/* eslint-disable no-use-before-define */
import OpenApiParser from '@apitools/openapi-parser';
import { marked } from 'marked';
import { invalidCharsRegEx, rapidocApiKey, sleep } from './common-utils';
import {
  DocumentModifiedByRapiDoc,
  RapiDocCallableElement,
  RapiDocDocument,
  HTTPMethods,
  RapiDocSecurityScheme,
  RapiDocTag,
  ResolvedSpec,
} from '@rapidoc-types';
import { OpenAPIV3 } from 'openapi-types';

export default async function ProcessSpec(
  this: RapiDocCallableElement,
  specUrl: string,
  generateMissingTags = false,
  sortTags = false,
  sortEndpointsBy: 'method' | 'summary' | 'path' | 'none' | '' = '',
  attrApiKey = '',
  attrApiKeyLocation = '',
  attrApiKeyValue = '',
  serverUrl = ''
): Promise<ResolvedSpec | undefined> {
  let jsonParsedSpec: DocumentModifiedByRapiDoc | undefined;
  try {
    this.requestUpdate(); // important to show the initial loader
    let specMeta = await OpenApiParser.resolve({
      url: specUrl,
      allowMetaPatches: false,
    }); // Swagger(specUrl);
    await sleep(0); // important to show the initial loader (allows for rendering updates)

    // If  JSON Schema Viewer
    if (
      specMeta.resolvedSpec?.jsonSchemaViewer &&
      specMeta.resolvedSpec?.schemaAndExamples
    ) {
      this.dispatchEvent(
        new CustomEvent('before-render', {
          detail: { spec: specMeta.resolvedSpec },
        })
      );
      const schemaAndExamples = Object.entries(
        specMeta.resolvedSpec.schemaAndExamples
      ).map(([key, value]) => ({
        show: true,
        expanded: true,
        selectedExample: null,
        name: key,
        elementId: key.replace(invalidCharsRegEx, '-'),
        ...value,
      }));
      const parsedSpec = {
        specLoadError: false,
        isSpecLoading: false,
        info: specMeta.resolvedSpec.info,
        schemaAndExamples,
      };
      return parsedSpec;
    }
    if (
      specMeta.spec &&
      (specMeta.spec.components ||
        specMeta.spec.info ||
        specMeta.spec.servers ||
        specMeta.spec.tags ||
        specMeta.spec.paths)
    ) {
      jsonParsedSpec = specMeta.spec;
      this.dispatchEvent(
        new CustomEvent('before-render', { detail: { spec: jsonParsedSpec } })
      );
    } else {
      console.info(
        'RapiDoc: %c There was an issue while parsing the spec %o ',
        'color:orangered',
        specMeta
      ); // eslint-disable-line no-console

      const info: OpenAPIV3.InfoObject = {
        title: 'Error loading the spec',
        version: ' ',
        description: specMeta.response?.url
          ? `${specMeta.response?.url} ┃ ${specMeta.response?.status}  ${specMeta.response?.statusText}`
          : 'Unable to load the Spec',
      };
      return {
        specLoadError: true,
        isSpecLoading: false,
        info,
        tags: [],
      };
    }
  } catch (err) {
    console.info(
      'RapiDoc: %c There was an issue while parsing the spec %o ',
      'color:orangered',
      err
    ); // eslint-disable-line no-console
  }

  if (!jsonParsedSpec) {
    return;
  }

  // const pathGroups = groupByPaths(jsonParsedSpec);

  // Tags with Paths and WebHooks
  const tags = groupByTags(
    jsonParsedSpec,
    sortEndpointsBy,
    generateMissingTags,
    sortTags
  );

  // Components
  const components = getComponents(jsonParsedSpec);

  // Info Description Headers
  const infoDescriptionHeaders = jsonParsedSpec?.info?.description
    ? getHeadersFromMarkdown(jsonParsedSpec.info.description)
    : [];

  // Security Scheme
  const securitySchemes: RapiDocSecurityScheme[] = [];
  if (jsonParsedSpec?.components?.securitySchemes) {
    const securitySchemeSet = new Set();
    Object.entries(jsonParsedSpec.components.securitySchemes).forEach(
      ([securitySchemeId, securityScheme]) => {
        if (!securitySchemeSet.has(securitySchemeId)) {
          securitySchemeSet.add(securitySchemeId);
          const securitySchemeObject: any = {
            securitySchemeId,
            ...securityScheme,
          };
          securitySchemeObject.value = '';
          securitySchemeObject.finalKeyValue = '';

          if ('$ref' in securityScheme) {
            return;
          }

          if (securityScheme.type === 'apiKey') {
            securitySchemeObject.in = securityScheme.in || 'header';
            securitySchemeObject.name = securityScheme.name || 'Authorization';
            securitySchemeObject.user = '';
            securitySchemeObject.password = '';
          } else if (securityScheme.type === 'http') {
            securitySchemeObject.in = 'header';
            securitySchemeObject.name = 'Authorization';
            securitySchemeObject.user = '';
            securitySchemeObject.password = '';
          } else if (securityScheme.type === 'oauth2') {
            securitySchemeObject.in = 'header';
            securitySchemeObject.name = 'Authorization';
            securitySchemeObject.clientId = '';
            securitySchemeObject.clientSecret = '';
          }
          securitySchemes.push(securitySchemeObject);
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
      name: attrApiKey,
      in: attrApiKeyLocation,
      value: attrApiKeyValue,
      finalKeyValue: attrApiKeyValue,
    });
  }

  // Updated Security Type Display Text based on Type
  securitySchemes.forEach((securityScheme) => {
    if (securityScheme.type === 'http') {
      securityScheme.typeDisplay =
        securityScheme.scheme === 'basic' ? 'HTTP Basic' : 'HTTP Bearer';
    } else if (securityScheme.type === 'apiKey') {
      securityScheme.typeDisplay = `API Key (${securityScheme.name})`;
    } else if (securityScheme.type === 'oauth2') {
      securityScheme.typeDisplay = `OAuth (${securityScheme.securitySchemeId})`;
    } else {
      securityScheme.typeDisplay = securityScheme.type || 'None';
    }
  });

  // Servers
  let servers: DocumentModifiedByRapiDoc['servers'] = [];
  if (jsonParsedSpec?.servers && Array.isArray(jsonParsedSpec.servers)) {
    jsonParsedSpec.servers.forEach((server) => {
      let computedUrl = server.url.trim();
      if (
        !(
          computedUrl.startsWith('http') ||
          computedUrl.startsWith('//') ||
          computedUrl.startsWith('{')
        )
      ) {
        if (window.location.origin.startsWith('http')) {
          server.url = window.location.origin + server.url;
          computedUrl = server.url;
        }
      }
      // Apply server-variables to generate final computed-url
      if (server.variables) {
        Object.entries(server.variables).forEach(([key, variable]) => {
          const regex = new RegExp(`{${key}}`, 'g');
          computedUrl = computedUrl.replace(regex, variable.default || '');
          variable.value = variable.default || '';
        });
      }
      server.computedUrl = computedUrl;
    });
    if (serverUrl) {
      jsonParsedSpec.servers.push({ url: serverUrl, computedUrl: serverUrl });
    }
  } else if (serverUrl) {
    jsonParsedSpec.servers = [{ url: serverUrl, computedUrl: serverUrl }];
  } else if (window.location.origin.startsWith('http')) {
    jsonParsedSpec.servers = [
      { url: window.location.origin, computedUrl: window.location.origin },
    ];
  } else {
    jsonParsedSpec.servers = [
      { url: 'http://localhost', computedUrl: 'http://localhost' },
    ];
  }
  servers = jsonParsedSpec.servers;
  const parsedSpec = {
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

function getHeadersFromMarkdown(
  markdownContent: string
): marked.Tokens.Heading[] {
  const tokens = marked.lexer(markdownContent);
  const headers = tokens.filter(
    (token) => token.type === 'heading' && token.depth <= 2
  ) as marked.Tokens.Heading[];
  return headers || [];
}

function getComponents(openApiSpec: OpenAPIV3.Document) {
  if (!openApiSpec.components) {
    return [];
  }
  const components: RapiDocDocument['components'] = [];
  Object.entries(openApiSpec.components).forEach(
    ([component, componentValue]) => {
      const subComponents = [];
      for (const sComponent in componentValue) {
        const scmp = {
          show: true,
          id: `${component.toLowerCase()}-${sComponent.toLowerCase()}`.replace(
            invalidCharsRegEx,
            '-'
          ),
          name: sComponent,
          component: componentValue[sComponent],
        };
        subComponents.push(scmp);
      }

      let cmpDescription = component;
      let cmpName = component;

      switch (component) {
        case 'schemas':
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
          cmpDescription =
            'Describes operation parameters. A unique parameter is defined by a combination of a name and location.';
          break;
        case 'examples':
          cmpName = 'Examples';
          cmpDescription =
            'List of Examples for operations, can be requests, responses and objects examples.';
          break;
        case 'requestBodies':
          cmpName = 'Request Bodies';
          cmpDescription =
            'Describes common request bodies that are used across the API operations.';
          break;
        case 'headers':
          cmpName = 'Headers';
          cmpDescription =
            'Headers follows the structure of the Parameters but they are explicitly in "header"';
          break;
        case 'securitySchemes':
          cmpName = 'Security Schemes';
          // eslint-disable-next-line max-len
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
          // eslint-disable-next-line max-len
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
  );

  return components || [];
}

function groupByTags(
  openApiSpec: DocumentModifiedByRapiDoc,
  sortEndpointsBy: 'method' | 'summary' | 'path' | 'none' | '',
  generateMissingTags = false,
  sortTags = false
) {
  const supportedMethods: HTTPMethods[] = [
    'get',
    'put',
    'post',
    'delete',
    'patch',
    'head',
    'options',
  ]; // this is also used for ordering endpoints by methods
  const tags: RapiDocTag[] =
    openApiSpec.tags && Array.isArray(openApiSpec.tags)
      ? openApiSpec.tags.map((tag) => ({
          show: true,
          elementId: `tag--${tag.name.replace(invalidCharsRegEx, '-')}`,
          name: tag.name,
          description: tag.description || '',
          headers: tag.description
            ? getHeadersFromMarkdown(tag.description)
            : [],
          paths: [],
          expanded: tag['x-tag-expanded'] !== false,
        }))
      : [];

  const pathsAndWebhooks = openApiSpec.paths || {};
  if (openApiSpec.webhooks) {
    for (const [key, value] of Object.entries(openApiSpec.webhooks)) {
      value._type = 'webhook'; // eslint-disable-line no-underscore-dangle
      // TODO: typescript migration: replace "as" with proper inferred typings
      pathsAndWebhooks[key] = value as { _type: 'webhook' };
    }
  }
  // For each path find the tag and push it into the corresponding tag
  Object.entries(pathsAndWebhooks).forEach(
    ([pathOrHookName, pathOrHookValue]) => {
      // Theoretically could be an OpenAPIV3.ReferenceObject[];
      const commonParams =
        pathOrHookValue?.parameters as unknown as OpenAPIV3.ParameterObject[];
      const commonPathProp = {
        servers: pathOrHookValue?.servers || [],
        parameters: pathOrHookValue?.parameters || [],
      };
      const isWebhook = pathOrHookValue?._type === 'webhook'; // eslint-disable-line no-underscore-dangle
      supportedMethods.forEach((methodName) => {
        if (pathOrHookValue?.[methodName]) {
          const pathOrHookObj =
            openApiSpec?.paths?.[pathOrHookName]?.[methodName];
          // If path.methods are tagged, else generate it from path
          const pathTags = pathOrHookObj?.tags || [];
          if (pathTags.length === 0) {
            if (generateMissingTags) {
              const pathOrHookNameKey = pathOrHookName.replace(
                /^\/+|\/+$/g,
                ''
              );
              const firstWordEndIndex = pathOrHookNameKey.indexOf('/');
              if (firstWordEndIndex === -1) {
                pathTags.push(pathOrHookNameKey);
              } else {
                // firstWordEndIndex -= 1;
                pathTags.push(pathOrHookNameKey.substr(0, firstWordEndIndex));
              }
            } else {
              pathTags.push('General ⦂');
            }
          }

          pathTags.forEach((pathTag) => {
            let tagObj: RapiDocTag | undefined;
            let specTagsItem;

            if (openApiSpec.tags) {
              specTagsItem = openApiSpec.tags.find(
                (tag) => tag.name.toLowerCase() === pathTag.toLowerCase()
              );
            }

            tagObj = tags.find((tag) => tag.name === pathTag);
            if (!tagObj) {
              tagObj = {
                show: true,
                elementId: `tag--${pathTag.replace(invalidCharsRegEx, '-')}`,
                name: pathTag,
                description: specTagsItem?.description || '',
                headers: specTagsItem?.description
                  ? getHeadersFromMarkdown(specTagsItem.description)
                  : [],
                paths: [],
                expanded: specTagsItem
                  ? specTagsItem['x-tag-expanded'] !== false
                  : true,
              };
              tags.push(tagObj);
            }

            // Generate a short summary which is broken
            let shortSummary = (
              pathOrHookObj?.summary ||
              pathOrHookObj?.description ||
              `${methodName.toUpperCase()} ${pathOrHookName}`
            ).trim();
            if (shortSummary.length > 100) {
              [shortSummary] = shortSummary.split(/[.|!|?]\s|[\r?\n]/); // take the first line (period or carriage return)
            }
            // Merge Common Parameters with This methods parameters
            let finalParameters = [];
            if (commonParams) {
              if (pathOrHookObj?.parameters) {
                finalParameters = commonParams
                  .filter((commonParam) => {
                    if (
                      !(
                        pathOrHookObj?.parameters as unknown as OpenAPIV3.ParameterObject[]
                      )?.some(
                        (param) =>
                          commonParam.name === param.name &&
                          commonParam.in === param.in
                      )
                    ) {
                      return true;
                    }

                    return false;
                  })
                  .concat(
                    pathOrHookObj.parameters as unknown as OpenAPIV3.ParameterObject[]
                  );
              } else {
                finalParameters = commonParams.slice(0);
              }
            } else {
              finalParameters = pathOrHookObj?.parameters
                ? pathOrHookObj.parameters.slice(0)
                : [];
            }

            // Filter callbacks to contain only objects.
            if (pathOrHookObj?.callbacks) {
              for (const [callbackName, callbackConfig] of Object.entries(
                pathOrHookObj.callbacks
              )) {
                const filteredCallbacks =
                  Object.entries(callbackConfig).filter(
                    (entry) => typeof entry[1] === 'object'
                  ) || [];
                pathOrHookObj.callbacks[callbackName] =
                  Object.fromEntries(filteredCallbacks);
              }
            }

            // Update Responses
            tagObj.paths.push({
              show: true,
              expanded: false,
              isWebhook,
              expandedAtLeastOnce: false,
              summary: pathOrHookObj?.summary || '',
              description: pathOrHookObj?.description || '',
              externalDocs: pathOrHookObj?.externalDocs,
              shortSummary,
              method: methodName,
              path: pathOrHookName,
              operationId: pathOrHookObj?.operationId,
              elementId: `${methodName}-${pathOrHookName.replace(
                invalidCharsRegEx,
                '-'
              )}`,
              servers: pathOrHookObj?.servers
                ? commonPathProp.servers.concat(pathOrHookObj.servers)
                : commonPathProp.servers,
              parameters: finalParameters,
              requestBody: pathOrHookObj?.requestBody,
              responses: pathOrHookObj?.responses,
              callbacks: pathOrHookObj?.callbacks,
              deprecated: pathOrHookObj?.deprecated,
              security: pathOrHookObj?.security,
              // commonSummary: commonPathProp.summary,
              // commonDescription: commonPathProp.description,
              xBadges: pathOrHookObj?.['x-badges'] || undefined,
              xCodeSamples:
                pathOrHookObj?.['x-codeSamples'] ||
                pathOrHookObj?.['x-code-samples'],
            });
          }); // End of tag path create
        }
      }); // End of Methods
    }
  );

  const tagsWithSortedPaths = tags.filter(
    (tag) => tag.paths && tag.paths.length > 0
  );
  tagsWithSortedPaths.forEach((tag) => {
    if (sortEndpointsBy === 'method') {
      tag.paths.sort((tagA, tagB) => {
        const indexOfMethodA = supportedMethods.indexOf(tagA.method);
        const indexOfMethodB = supportedMethods.indexOf(tagB.method);

        return indexOfMethodA - indexOfMethodB;
      });
    } else if (sortEndpointsBy === 'summary') {
      tag.paths.sort((a, b) => a.shortSummary.localeCompare(b.shortSummary));
    } else if (sortEndpointsBy === 'path') {
      tag.paths.sort((a, b) => a.path.localeCompare(b.path));
    } else if (sortEndpointsBy === 'none') {
      // don't sort if sortEndpointsBy is 'none'
    }
    tag.firstPathId = tag.paths[0].elementId;
  });
  return sortTags
    ? tagsWithSortedPaths.sort((tagA, tagB) =>
        tagA.name.localeCompare(tagB.name)
      )
    : tagsWithSortedPaths;
}
