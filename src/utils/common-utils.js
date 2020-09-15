/* For Delayed Event Handler Execution */
/*
export function debounce(fn, delay) {
  let timeoutID = null;
  return function () {
    clearTimeout(timeoutID);
    const args = arguments;
    const that = this;
    timeoutID = setTimeout(() => {
      fn.apply(that, args);
    }, delay);
  };
}
*/

export const invalidCharsRegEx = new RegExp(/[\s#:?&=]/, 'g');

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function copyToClipboard(data, e) {
  const btnEl = e.currentTarget;
  const textArea = document.createElement('textarea');
  textArea.value = data;
  textArea.style.position = 'fixed'; // avoid scrolling to bottom
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    btnEl.innerText = 'Copied';
    setTimeout(() => {
      btnEl.innerText = 'Copy';
    }, 5000);
  } catch (err) {
    console.error('Unable to copy', err); // eslint-disable-line no-console
  }
  document.body.removeChild(textArea);
}

export function getBaseUrlFromUrl(url) {
  const pathArray = url.split('/');
  return `${pathArray[0]}//${pathArray[2]}`;
}

export async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function pathIsInSearch(matchPattern, path) {
  const searchString = `${path.method} ${path.path} ${path.summary || path.description || ''} ${path.operationId || ''}`.toLowerCase();
  return searchString.includes(matchPattern);
}

function processProperties(properties, pattern, tag, path, searchedProperties) {
  for (const property in properties) {
    if (property.includes(pattern) || (properties[property].description !== undefined && properties[property].description.includes(pattern))) {
      // eslint-disable-next-line no-prototype-builtins
      if (searchedProperties.hasOwnProperty(property)) {
        searchedProperties[property].paths.add(path);
      } else {
        const paths = new Set();
        paths.add(path);
        searchedProperties[property] = {
          description: properties[property].description,
          paths,
        };
      }
    }

    // eslint-disable-next-line no-prototype-builtins
    if (properties[property].hasOwnProperty('properties')) {
      processProperties(
        properties[property].properties,
        pattern,
        tag,
        path,
        searchedProperties,
      );
    }

    // eslint-disable-next-line no-prototype-builtins
    if (properties[property].hasOwnProperty('items') && properties[property].items.hasOwnProperty('properties')) {
      processProperties(
        properties[property].items.properties,
        pattern,
        tag,
        path,
        searchedProperties,
      );
    }
  }

  // eslint-disable-next-line no-prototype-builtins
  if (properties && properties.hasOwnProperty('properties')) {
    processProperties(
      properties.properties,
      pattern,
      tag,
      path,
      searchedProperties,
    );
  }
}

export function findProperties(matchPattern, tags) {
  const searchedProperties = {};

  if (!matchPattern) {
    return searchedProperties;
  }

  tags.forEach((tag) => {
    tag.paths.forEach((path) => {
      // eslint-disable-next-line no-prototype-builtins
      if (path.hasOwnProperty('parameters')) {
        for (const parameter of path.parameters) {
          if (parameter.name.includes(matchPattern) || (parameter.description !== undefined && parameter.description.includes(matchPattern))) {
            // eslint-disable-next-line no-prototype-builtins
            if (searchedProperties.hasOwnProperty(parameter.name)) {
              searchedProperties[parameter.name].paths.add(path);
            } else {
              const paths = new Set();
              paths.add(path);
              searchedProperties[parameter.name] = {
                description: parameter.description,
                paths,
              };
            }
          }
        }
      }

      // eslint-disable-next-line no-prototype-builtins
      if (path.hasOwnProperty('requestBody') && path.requestBody !== undefined) {
        const contentTypes = path.requestBody.content;
        for (const contentType in contentTypes) {
          processProperties(
            path.requestBody.content[contentType].schema.properties,
            matchPattern,
            tag,
            path,
            searchedProperties,
          );
        }
      }
    });
  });

  return searchedProperties;
}
