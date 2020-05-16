/* eslint-disable no-use-before-define */
// import JsonRefs from 'json-refs';
import converter from 'swagger2openapi';
import Swagger from 'swagger-client';
import marked from 'marked';
import { invalidCharsRegEx } from '@/utils/common-utils';

export default async function ProcessSpec(specUrl, sortTags = false, sortEndpointsBy = '', attrApiKey = '', attrApiKeyLocation = '', attrApiKeyValue = '', serverUrl = '') {
  let jsonParsedSpec;
  let convertedSpec;
  // let resolvedRefSpec;
  // let resolveOptions;
  // const specLocation = '';
  // let url;

  const convertOptions = {
    patch: true,
    warnOnly: true,
    resolveInternal: true,
  };

  try {
    let specObj;
    if (typeof specUrl === 'string') {
      specObj = await Swagger(specUrl);
    } else {
      specObj = await Swagger({ spec: specUrl });
    }
    jsonParsedSpec = specObj.spec;
    if (specObj.spec.swagger) {
      convertedSpec = await converter.convertObj(specObj.spec, convertOptions);
      jsonParsedSpec = convertedSpec.openapi;
    }

    /*
      // JsonRefs cant load yaml files, so first use converter
      if (typeof specUrl === 'string') {
        // resolvedRefSpec = await JsonRefs.resolveRefsAt(specUrl, resolveOptions);
        convertedSpec = await converter.convertUrl(specUrl, convertOptions);
        specLocation = convertedSpec.source.trim();
        if (specLocation.startsWith('/')) {
          url = new URL(`.${specLocation}`, window.location.href);
          specLocation = url.pathname;
        }
      } else {
        // resolvedRefSpec = await JsonRefs.resolveRefs(specUrl, resolveOptions);
        convertedSpec = await converter.convertObj(specUrl, convertOptions);
        url = new URL(window.location.href);
        specLocation = url.pathname;
      }
      // convertedSpec = await converter.convertObj(resolvedRefSpec.resolved, convertOptions);
      resolveOptions = {
        resolveCirculars: false,
        location: specLocation, // location is important to specify to resolve relative external file references when using JsonRefs.resolveRefs() which takes an JSON object
      };
      resolvedRefSpec = await JsonRefs.resolveRefs(convertedSpec.openapi, resolveOptions);
      // jsonParsedSpec = convertedSpec.openapi;
      jsonParsedSpec = resolvedRefSpec.resolved;
    */
  } catch (err) {
    console.info('RapiDoc: %c There was an issue while parsing the spec %o ', 'color:orangered', err); // eslint-disable-line no-console
  }

  // const pathGroups = groupByPaths(jsonParsedSpec);

  // Tags
  const tags = groupByTags(jsonParsedSpec, sortTags, sortEndpointsBy);

  const components = getComponents(jsonParsedSpec);
  const infoDescriptionHeaders = getInfoDescriptionHeaders(jsonParsedSpec);

  // Security Scheme
  const securitySchemes = [];
  if (jsonParsedSpec.components && jsonParsedSpec.components.securitySchemes) {
    Object.entries(jsonParsedSpec.components.securitySchemes).forEach((kv) => {
      const securityObj = { apiKeyId: kv[0], ...kv[1] };
      securityObj.value = '';
      securityObj.finalKeyValue = '';
      if (kv[1].type === 'apiKey' || kv[1].type === 'http') {
        securityObj.in = kv[1].in || 'header';
        securityObj.name = kv[1].name || 'Authorization';
        securityObj.user = '';
        securityObj.password = '';
      } else if (kv[1].type === 'oauth2') {
        securityObj.in = 'header';
        securityObj.name = 'Authorization';
        securityObj.clientId = '';
        securityObj.clientSecret = '';
      }
      securitySchemes.push(securityObj);
    });
  }

  if (attrApiKey && attrApiKeyLocation && attrApiKeyValue) {
    securitySchemes.push({
      apiKeyId: '_rapidoc_api_key',
      description: 'api-key provided in rapidoc element attributes',
      type: 'apiKey',
      name: attrApiKey,
      in: attrApiKeyLocation,
      value: attrApiKeyValue,
      finalKeyValue: attrApiKeyValue,
    });
  }

  // Updated Security Type Display Text based on Type
  securitySchemes.forEach((v) => {
    if (v.type === 'http') {
      v.typeDisplay = v.scheme === 'basic' ? 'HTTP Basic' : 'HTTP Bearer';
    } else if (v.type === 'apiKey') {
      v.typeDisplay = `API Key (${v.name})`;
    } else if (v.type === 'oauth2') {
      v.typeDisplay = 'OAuth';
    } else {
      v.typeDisplay = v.type;
    }
  });

  // Servers
  let servers = [];
  if (jsonParsedSpec.servers && Array.isArray(jsonParsedSpec.servers)) {
    jsonParsedSpec.servers.forEach((v) => {
      let computedUrl = v.url.trim();
      if (!(computedUrl.startsWith('http') || computedUrl.startsWith('//') || computedUrl.startsWith('{'))) {
        if (window.location.origin.startsWith('http')) {
          v.url = window.location.origin + v.url;
          computedUrl = v.url;
        }
      }
      // Apply server-variables to generate final computed-url
      if (v.variables) {
        Object.entries(v.variables).forEach((kv) => {
          const regex = new RegExp(`{${kv[0]}}`, 'g');
          computedUrl = computedUrl.replace(regex, kv[1].default || '');
          kv[1].value = kv[1].default || '';
        });
      }
      v.computedUrl = computedUrl;
    });
    if (serverUrl) {
      jsonParsedSpec.servers.push({ url: serverUrl, computedUrl: serverUrl });
    }
  } else if (serverUrl) {
    jsonParsedSpec.servers = [{ url: serverUrl, computedUrl: serverUrl }];
  } else if (window.location.origin.startsWith('http')) {
    jsonParsedSpec.servers = [{ url: window.location.origin, computedUrl: window.location.origin }];
  } else {
    jsonParsedSpec.servers = [{ url: 'http://localhost', computedUrl: 'http://localhost' }];
  }
  servers = jsonParsedSpec.servers;
  const parsedSpec = {
    info: jsonParsedSpec.info,
    infoDescriptionHeaders,
    tags,
    components,
    // pathGroups,
    externalDocs: jsonParsedSpec.externalDocs,
    securitySchemes,
    servers,
    basePath: jsonParsedSpec.basePath, // Only available in swagger V2
  };
  return parsedSpec;
}

/*
function groupByPaths(openApiSpec) {
  const paths = [];
  for (const p in openApiSpec.paths) {
    openApiSpec.paths[p].path = p;
    openApiSpec.paths[p].expanded = false;
    openApiSpec.paths[p].activeMethod = 'no-active-method';
    paths.push(openApiSpec.paths[p]);
  }
  return paths;
}
*/
function getInfoDescriptionHeaders(openApiSpec) {
  if (openApiSpec && openApiSpec.info && openApiSpec.info.description) {
    const tokens = marked.lexer(openApiSpec.info.description);
    const headers = tokens.filter((v) => v.type === 'heading' && v.depth <= 2);
    return headers || [];
  }
  return [];
}

function getComponents(openApiSpec) {
  if (!openApiSpec.components) {
    return [];
  }
  const components = [];
  for (const component in openApiSpec.components) {
    const subComponents = [];
    for (const sComponent in openApiSpec.components[component]) {
      const scmp = {
        show: true,
        id: `${component.toLowerCase()}-${sComponent.toLowerCase()}`.replace(invalidCharsRegEx, '-'),
        name: sComponent,
        component: openApiSpec.components[component][sComponent],
      };
      subComponents.push(scmp);
    }

    let cmpDescription = component;
    let cmpName = component;

    switch (component) {
      case 'schemas':
        cmpName = 'Schemas';
        cmpDescription = 'Schemas allows the definition of input and output data types. These types can be objects, but also primitives and arrays.';
        break;
      case 'responses':
        cmpName = 'Responses';
        cmpDescription = 'Describes responses from an API Operation, including design-time, static links to operations based on the response.';
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
        // eslint-disable-next-line max-len
        cmpDescription = 'Defines a security scheme that can be used by the operations. Supported schemes are HTTP authentication, an API key (either as a header, a cookie parameter or as a query parameter), OAuth2\'s common flows(implicit, password, client credentials and authorization code) as defined in RFC6749, and OpenID Connect Discovery.';
        break;
      case 'links':
        cmpName = 'Links';
        cmpDescription = 'Links represent a possible design-time link for a response. The presence of a link does not guarantee the caller\'s ability to successfully invoke it, rather it provides a known relationship and traversal mechanism between responses and other operations.';
        break;
      case 'callbacks':
        cmpName = 'Callbacks';
        // eslint-disable-next-line max-len
        cmpDescription = 'A map of possible out-of band callbacks related to the parent operation. Each value in the map is a Path Item Object that describes a set of requests that may be initiated by the API provider and the expected responses. The key value used to identify the path item object is an expression, evaluated at runtime, that identifies a URL to use for the callback operation.';
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

function groupByTags(openApiSpec, sortTags = false, sortEndpointsBy) {
  const methods = ['get', 'put', 'post', 'delete', 'patch', 'head']; // this is also used for ordering endpoints by methods
  const tags = openApiSpec.tags && Array.isArray(openApiSpec.tags)
    ? openApiSpec.tags.map((v) => ({
      show: true,
      name: v.name,
      description: v.description,
      paths: [],
      expanded: v['x-tag-expanded'] !== false,
    }))
    : [];

  // For each path find the tag and push it into the corresponding tag
  for (const path in openApiSpec.paths) {
    const commonParams = openApiSpec.paths[path].parameters;
    const commonPathProp = {
      summary: openApiSpec.paths[path].summary,
      description: openApiSpec.paths[path].description,
      servers: openApiSpec.paths[path].servers ? openApiSpec.paths[path].servers : [],
      parameters: openApiSpec.paths[path].parameters ? openApiSpec.paths[path].parameters : [],
    };

    methods.forEach((methodName) => {
      if (openApiSpec.paths[path][methodName]) {
        const fullPath = openApiSpec.paths[path][methodName];

        // If path.methods are tagged, else generate it from path
        const pathTags = fullPath.tags ? fullPath.tags : [];
        if (pathTags.length === 0) {
          let firstWordEndIndex = path.indexOf('/', 1);
          if (firstWordEndIndex === -1) {
            firstWordEndIndex = (path.length - 1);
          } else {
            firstWordEndIndex -= 1;
          }
          pathTags.push(path.substr(1, firstWordEndIndex));
        }

        pathTags.forEach((tag) => {
          let tagObj;
          let specTagsItem;

          if (openApiSpec.tags) {
            specTagsItem = openApiSpec.tags.find((v) => (v.name.toLowerCase() === tag.toLowerCase()));
          }

          tagObj = tags.find((v) => v.name === tag);
          if (!tagObj) {
            tagObj = {
              show: true,
              name: tag,
              paths: [],
              description: specTagsItem ? specTagsItem.description : '',
              expanded: (specTagsItem ? specTagsItem['x-tag-expanded'] !== false : true),
            };
            tags.push(tagObj);
          }

          // Generate Path summary and Description if it is missing for a method
          let summary = (fullPath.summary || '').trim() ? fullPath.summary.trim() : (fullPath.description || '-').trim().split('/n')[0];
          if (summary.length > 100) {
            summary = summary.split('.')[0];
          }
          if (!(fullPath.description || '').trim()) {
            fullPath.description = ((fullPath.summary || '-').trim());
          }

          // Merge Common Parameters with This methods parameters
          let finalParameters = [];
          if (commonParams) {
            if (fullPath.parameters) {
              finalParameters = commonParams.filter((commonParam) => {
                if (!fullPath.parameters.some((param) => (commonParam.name === param.name && commonParam.in === param.in))) {
                  return commonParam;
                }
              }).concat(fullPath.parameters);
            } else {
              finalParameters = commonParams.slice(0);
            }
          } else {
            finalParameters = fullPath.parameters ? fullPath.parameters.slice(0) : [];
          }

          // Update Responses
          tagObj.paths.push({
            show: true,
            expanded: false,
            expandedAtLeastOnce: false,
            summary,
            method: methodName,
            description: fullPath.description,
            path,
            operationId: fullPath.operationId,
            servers: fullPath.servers ? commonPathProp.servers.concat(fullPath.servers) : commonPathProp.servers,
            parameters: finalParameters,
            requestBody: fullPath.requestBody,
            responses: fullPath.responses,
            callbacks: fullPath.callbacks,
            deprecated: fullPath.deprecated,
            security: fullPath.security,
            commonSummary: commonPathProp.summary,
            commonDescription: commonPathProp.description,
            xCodeSamples: fullPath['x-code-samples'],
          });
        });// End of tag path create
      }
    }); // End of Methods
  }

  // sort paths by methods or path within each tags;
  const tagsWithSortedPaths = tags.filter((v) => v.paths && v.paths.length > 0);
  if (sortEndpointsBy === 'method') {
    tagsWithSortedPaths.forEach((v) => {
      if (v.paths) {
        // v.paths.sort((a, b) => a.method.localeCompare(b.method));
        v.paths.sort((a, b) => methods.indexOf(a.method).toString().localeCompare(methods.indexOf(b.method)));
      }
    });
  } else {
    tagsWithSortedPaths.forEach((v) => {
      if (v.paths) {
        v.paths.sort((a, b) => a.path.localeCompare(b.path));
      }
    });
  }
  return sortTags ? tagsWithSortedPaths.sort((a, b) => a.name.localeCompare(b.name)) : tagsWithSortedPaths;
}
