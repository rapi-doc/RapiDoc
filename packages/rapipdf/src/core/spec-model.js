/**
 * What the PDF sections are built from: the spec's operations grouped by tag, plus its info, security
 * schemes and external docs. `openApiSpec` is a resolved OpenAPI 3 document (see load-spec.js).
 */
export function buildSpecModel(openApiSpec, sortTags) {
  const methods = ["get", "put", "post", "delete", "patch", "options", "head", "trace"];
  // The spec's own tags first, in their order; a tag only operations name is added when it is met
  const tags = (openApiSpec.tags ?? []).map((tag) => ({
    name: tag.name,
    description: tag.description,
    paths: [],
  }));
  let totalPathCount = 0;
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
        if (fullPath.tags) {
          tagText = fullPath.tags[0];
          if (openApiSpec.tags) {
            tagDescr = openApiSpec.tags.find((v) => v.name === tagText);
          }
        } else {
          let firstWordEndIndex = path.indexOf("/", 1);
          if (firstWordEndIndex === -1) {
            firstWordEndIndex = path.length - 1;
          } else {
            firstWordEndIndex -= 1;
          }
          tagText = path.substr(1, firstWordEndIndex);
        }
        tagObj = tags.find((v) => v.name === tagText);

        if (!tagObj) {
          tagObj = {
            name: tagText,
            description: tagDescr ? tagDescr.description : "",
            paths: [],
          };
          tags.push(tagObj);
        }
        // Generate Path summary and Description if it is missing for a method
        let summary = fullPath.summary ? fullPath.summary : "";
        const description = fullPath.description ? fullPath.description : "";
        if (!summary && description) {
          if (description.length > 100) {
            let charIndex = -1;
            charIndex = description.indexOf("\n");
            if (charIndex === -1 || charIndex > 100) {
              charIndex = description.indexOf(". ");
            }
            if (charIndex === -1 || charIndex > 100) {
              charIndex = description.indexOf(".");
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
            finalParameters = commonParams
              .filter((commonParam) => {
                if (
                  !fullPath.parameters.some(
                    (param) => commonParam.name === param.name && commonParam.in === param.in,
                  )
                ) {
                  return commonParam;
                }
              })
              .concat(fullPath.parameters);
          } else {
            finalParameters = commonParams.slice(0);
          }
        } else {
          finalParameters = fullPath.parameters ? fullPath.parameters.slice(0) : [];
        }

        const pathObj = {
          summary,
          method: methodName,
          description: fullPath.description,
          path,
          operationId: fullPath.operationId,
          requestBody: fullPath.requestBody,
          parameters: finalParameters,
          servers: fullPath.servers
            ? commonPathProp.servers.concat(fullPath.servers)
            : commonPathProp.servers,
          responses: fullPath.responses,
          deprecated: fullPath.deprecated,
          security: fullPath.security,
          commonSummary: commonPathProp.summary,
          commonDescription: commonPathProp.description,
        };

        if (fullPath.tags) {
          fullPath.tags.forEach((mtag) => {
            const mtagObj = tags.find((v) => v.name === mtag);
            if (mtagObj) {
              mtagObj.paths.push(pathObj);
            }
          });
        } else {
          tagObj.paths.push(pathObj);
        }
        totalPathCount++;
      }
    }); // End of Methods
  }

  let securitySchemes = {};

  securitySchemes = openApiSpec.components ? openApiSpec.components.securitySchemes : {};
  if (sortTags) {
    tags.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  }
  const parsedSpec = {
    info: openApiSpec.info,
    tags,
    externalDocs: openApiSpec.externalDocs,
    securitySchemes,
    basePath: openApiSpec.basePath, // Only available in swagger V2
    totalPathCount,
  };
  return parsedSpec;
}
