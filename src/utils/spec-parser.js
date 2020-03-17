/* eslint-disable no-use-before-define */
// import JsonRefs from 'json-refs';
import converter from 'swagger2openapi';
import Swagger from 'swagger-client';

export default async function ProcessSpec(specUrl, sortTags = false, sortEndpointsBy, attrApiKey = '', attrApiKeyLocation = '', attrApiKeyValue = '', serverUrl = '') {
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
      specObj = { spec: specUrl };
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
    console.info('%c There was an issue while parsing the spec %o ', 'color:orangered', err); // eslint-disable-line no-console
  }

  // const pathGroups = groupByPaths(jsonParsedSpec);

  // Tags
  const tags = groupByTags(jsonParsedSpec, sortTags, sortEndpointsBy);

  // Security Scheme
  const securitySchemes = [];
  if (jsonParsedSpec.components && jsonParsedSpec.components.securitySchemes) {
    Object.entries(jsonParsedSpec.components.securitySchemes).forEach((kv) => {
      const securityObj = { apiKeyId: kv[0], ...kv[1] };
      if (kv[1].type === 'apiKey' || kv[1].type === 'http') {
        securityObj.in = kv[1].in || 'header';
        securityObj.name = kv[1].name || 'Authorization';
        securityObj.user = '';
        securityObj.password = '';
        securityObj.value = '';
        securityObj.finalKeyValue = '';
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

  // Servers
  let servers = [];
  if (jsonParsedSpec.servers && Array.isArray(jsonParsedSpec.servers)) {
    jsonParsedSpec.servers.forEach((v) => {
      let computedUrl = v.url.trim().toLowerCase();
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
    tags,
    // pathGroups,
    externalDocs: jsonParsedSpec.externalDocs,
    securitySchemes,
    servers, // In swagger 2, its generated from schemes, host and basePath properties
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

function groupByTags(openApiSpec, sortTags = false, sortEndpointsBy) {
  const methods = ['get', 'put', 'post', 'delete', 'patch', 'head']; // this is also used for ordering endpoints by methods
  const tags = openApiSpec.tags && Array.isArray(openApiSpec.tags)
    ? openApiSpec.tags.map((v) => ({
      show: true,
      name: v.name,
      description: v.description,
      paths: [],
    }))
    : [];
  // For each path find the tag and push it into the corrosponding tag
  for (const path in openApiSpec.paths) {
    const commonParams = openApiSpec.paths[path].parameters;
    const commonPathProp = {
      summary: openApiSpec.paths[path].summary,
      description: openApiSpec.paths[path].description,
      servers: openApiSpec.paths[path].servers ? openApiSpec.paths[path].servers : [],
      parameters: openApiSpec.paths[path].parameters ? openApiSpec.paths[path].parameters : [],
    };

    methods.forEach((methodName) => {
      let tagObj;
      let tagText;
      let tagDescr;

      if (openApiSpec.paths[path][methodName]) {
        const fullPath = openApiSpec.paths[path][methodName];
        // If path.methods are tagged, else generate it from path
        if (fullPath.tags && fullPath.tags[0]) {
          tagText = fullPath.tags[0];
          if (openApiSpec.tags) {
            tagDescr = openApiSpec.tags.find((v) => (v.name === tagText));
          }
        } else {
          let firstWordEndIndex = path.indexOf('/', 1);
          if (firstWordEndIndex === -1) {
            firstWordEndIndex = (path.length - 1);
          } else {
            firstWordEndIndex -= 1;
          }
          tagText = path.substr(1, firstWordEndIndex);
        }
        tagObj = tags.find((v) => v.name === tagText);

        if (!tagObj) {
          tagObj = {
            show: true,
            name: tagText,
            description: tagDescr ? tagDescr.description : '',
            paths: [],
          };
          tags.push(tagObj);
        }

        // Generate Path summary and Description if it is missing for a method
        let summary = fullPath.summary ? fullPath.summary : '';
        const description = fullPath.description ? fullPath.description : '';
        if (!summary && description) {
          if (description.length > 100) {
            let charIndex = -1;
            charIndex = description.indexOf('\n');
            if (charIndex === -1 || charIndex > 100) {
              charIndex = description.indexOf('. ');
            }
            if (charIndex === -1 || charIndex > 100) {
              charIndex = description.indexOf('.');
            }
            if (charIndex === -1 || charIndex > 100) {
              summary = description;
            } else {
              summary = description.substr(0, charIndex);
            }
          } else {
            summary = description;
          }
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
        });
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
