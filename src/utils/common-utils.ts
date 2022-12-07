/* For Delayed Event Handler Execution */
export function debounce(fn: () => void, delay: number) {
  let timeoutID: number;
  return (...args: any) => {
    clearTimeout(timeoutID);
    const that = this;
    timeoutID = setTimeout(() => {
      fn.apply(that, args);
    }, delay);
  };
}

export const invalidCharsRegEx = /[\s#:?&={}]/g; // used for generating valid html element ids by replacing the invalid chars with hyphen (-)
export const rapidocApiKey = '_rapidoc_api_key';

export function sleep(ms: number) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function copyToClipboard(data: string, e: MouseEvent) {
  const btnEl = e.target as HTMLElement;
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

export function getBaseUrlFromUrl(url: string) {
  const pathArray = url.split('/');
  return `${pathArray[0]}//${pathArray[2]}`;
}

export async function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function componentIsInSearch(
  searchVal: string,
  component: { name: string }
) {
  return component.name.toLowerCase().includes(searchVal.toLowerCase());
}

export function pathIsInSearch(
  searchVal: string,
  path: {
    method: string;
    path: string;
    summary: string;
    operationId: string;
    description: string;
  },
  matchType = 'includes'
) {
  if (matchType === 'includes') {
    const stringToSearch = `${path.method} ${path.path} ${path.summary || path.description || ''} ${path.operationId || ''}`.toLowerCase();
    return stringToSearch.includes(searchVal.toLowerCase());
  }
  const regex = new RegExp(searchVal, 'i');
  return regex.test(`${path.method} ${path.path}`);
}

interface SchemaProps {
  [key: string]: { 
    properties?: SchemaProps, 
    items?: {
      properties: SchemaProps
    } 
  }
}

export function schemaKeys(schemaProps: SchemaProps | undefined, result = new Set()) {
  if (!schemaProps) {
    return result;
  }
  Object.keys(schemaProps).forEach((key) => {
    result.add(key);
    const value = schemaProps[key];
    if (value.properties) {
      schemaKeys(value.properties, result);
    } else if (value.items?.properties) {
      schemaKeys(value.items?.properties, result);
    }
  });
  return result;
}

export function advancedSearch(
  searchVal: string,
  allSpecTags: {
    paths: {
      requestBody: {
        content?:{
          [index:string]: {
            schema?: {
              properties: SchemaProps
            }
          }
        }
      };
      responses: {
        [index: string]: {
          description: string;
        }
      },
      summary: string;
      description: string;
      parameters: {name: string}[];
      path: string;
      elementId: string;
      method: string;
      deprecated: boolean;
    }[];
  }[],
  searchOptions: string[] = []
) {
  if (!searchVal.trim() || searchOptions.length === 0) {
    return;
  }

  const pathsMatched: {
    elementId: string,
    method: string,
    path: string,
    summary: string,
    deprecated: boolean,
  }[] = [];
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
            schemaKeySet = schemaKeys(
              path.requestBody.content[contentType].schema?.properties
            );
          }
          stringToSearch = `${stringToSearch} ${[...schemaKeySet].join(' ')}`;
        }
      }

      if (searchOptions.includes('search-api-resp-descr')) {
        stringToSearch = `${stringToSearch} ${Object.values(path.responses)
          .map((v) => v.description || '')
          .join(' ')}`;
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

export function downloadResource(url: string, fileName: string) {
  if (url) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    a.click();
    a.remove();
  }
}

export function viewResource(url: string) {
  if (url) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.target = '_blank';
    a.click();
    a.remove();
  }
}
