/* For Delayed Event Handler Execution */
export function debounce(fn, delay) {
  let timeoutID = null;
  return (...args) => {
    clearTimeout(timeoutID);
    const that = this;
    timeoutID = setTimeout(() => {
      fn.apply(that, args);
    }, delay);
  };
}

export const invalidCharsRegEx = /[\s#:?&={}]/g; // used for generating valid html element ids by replacing the invalid chars with hyphen (-)
export const rapidocApiKey = '_rapidoc_api_key';

export function sleep(ms) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function copyToClipboard(data, e) {
  const btnEl = e.target.closest('button');
  const textArea = document.createElement('textarea');
  textArea.value = data;
  textArea.style.position = 'fixed'; // avoid scrolling to bottom
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    btnEl.innerHTML = `<svg class="check-button" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M10 17.5C5.8575 17.5 2.5 14.1425 2.5 10C2.5 5.8575 5.8575 2.5 10 2.5C14.1425 2.5 17.5 5.8575 17.5 10C17.5 14.1425 14.1425 17.5 10 17.5Z" fill="#79A479"/>
    <path d="M13.3327 8.33337L9.16602 12.5L6.66602 10" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    setTimeout(() => {
      btnEl.innerHTML = `
        <svg class="copy-button" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="m4.873 3.1245c0-0.41421 0.33578-0.75 0.75-0.75h11.251c0.4142 0 0.75 0.33579 0.75 0.75v11.25c0 0.4142-0.3358 0.75-0.75 0.75s-0.75-0.3358-0.75-0.75v-10.5h-10.501c-0.41422 0-0.75-0.33578-0.75-0.75z" clip-rule="evenodd" fill="#4A596B" fill-rule="evenodd"/>
        <path d="m2.373 5.6246c0-0.41421 0.33578-0.75 0.75-0.75h11.25c0.4142 0 0.75 0.33579 0.75 0.75v11.25c0 0.4142-0.3358 0.75-0.75 0.75h-11.25c-0.41422 0-0.75-0.3358-0.75-0.75v-11.25zm1.5 0.75v9.75h9.7504v-9.75h-9.7504z" clip-rule="evenodd" fill="#4A596B" fill-rule="evenodd"/>
        </svg>`;
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

export function componentIsInSearch(searchVal, component) {
  return component.name.toLowerCase().includes(searchVal.toLowerCase());
}

export function pathIsInSearch(searchVal, path, matchType = 'includes') {
  if (matchType === 'includes') {
    const stringToSearch = `${path.method} ${path.path} ${path.summary || path.description || ''} ${path.operationId || ''}`.toLowerCase();
    return stringToSearch.includes(searchVal.toLowerCase());
  }
  const regex = new RegExp(`^${searchVal}$`, 'i');
  return regex.test(`${path.method} ${path.path}`);
}

export function schemaKeys(schemaProps, result = new Set()) {
  if (!schemaProps) {
    return result;
  }
  Object.keys(schemaProps).forEach((key) => {
    result.add(key);
    if (schemaProps[key].properties) {
      schemaKeys(schemaProps[key].properties, result);
    } else if (schemaProps[key].items?.properties) {
      schemaKeys(schemaProps[key].items?.properties, result);
    }
  });
  return result;
}

export function advancedSearch(searchVal, allSpecTags, searchOptions = []) {
  if (!searchVal.trim() || searchOptions.length === 0) {
    return;
  }

  const pathsMatched = [];
  allSpecTags.forEach((tag) => {
    tag.paths.forEach((path) => {
      let stringToSearch = '';
      if (searchOptions.includes('search-api-path')) {
        stringToSearch = path.path;
      }
      if (searchOptions.includes('search-api-descr')) {
        stringToSearch = `${stringToSearch} ${path.summary || path.description || ''}`;
      }
      if (searchOptions.includes('search-api-params')) {
        stringToSearch = `${stringToSearch} ${path.parameters?.map((v) => v.name).join(' ') || ''}`;
      }

      if (searchOptions.includes('search-api-request-body') && path.requestBody) {
        let schemaKeySet = new Set();
        for (const contentType in path.requestBody?.content) {
          if (path.requestBody.content[contentType].schema?.properties) {
            schemaKeySet = schemaKeys(path.requestBody.content[contentType].schema?.properties);
          }
          stringToSearch = `${stringToSearch} ${[...schemaKeySet].join(' ')}`;
        }
      }

      if (searchOptions.includes('search-api-resp-descr')) {
        stringToSearch = `${stringToSearch} ${Object.values(path.responses).map((v) => v.description || '').join(' ')}`;
      }

      if (stringToSearch.toLowerCase().includes(searchVal.trim().toLowerCase())) {
        pathsMatched.push({
          elementId: path.elementId,
          method: path.method,
          path: path.path,
          summary: path.summary || path.description || '',
          deprecated: path.deprecated,
        });
      }
    });
  });
  return pathsMatched;
}

/*
export function prettyXml(sourceXmlString) {
  const xmlDoc = new DOMParser().parseFromString(sourceXmlString, 'text/xml');
  const xsltDoc = new DOMParser().parseFromString([
    // describes how we want to modify the XML - indent everything
    `<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
      <xsl:strip-space elements="*"/>
        <xsl:template match="para[content-style][not(text())]">
          <xsl:value-of select="normalize-space(.)"/>
        </xsl:template>
        <xsl:template match="node()|@*">
          <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>
        </xsl:template>
        <xsl:output indent="yes"/>
      </xsl:stylesheet>`,
  ].join('\n'), 'application/xml');
  const xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xsltDoc);
  const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
  return new XMLSerializer().serializeToString(resultDoc);
}
*/

export function downloadResource(url, fileName) {
  if (url) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = fileName;
    a.click();
    a.remove();
  }
}

export function viewResource(url) {
  if (url) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.target = '_blank';
    a.click();
    a.remove();
  }
}
