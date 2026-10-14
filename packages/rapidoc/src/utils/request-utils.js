/**
 * Serializes a header parameter value according to OpenAPI 3 rules.
 * Objects can be serialized exploded (key=value,key2=value2) or unexploded (key,value,key2,value2).
 *
 * @param {any} rawValue - Raw header parameter value
 * @param {object} [options]
 * @param {boolean} [options.explode=false] - Whether to explode object properties with '='
 * @param {boolean} [options.isObject=false] - Whether value is an object
 * @returns {string} Serialized header string
 */
export function serializeHeaderValue(rawValue, options = {}) {
  const { explode = false, isObject = false } = options;

  if (rawValue === undefined || rawValue === null || rawValue === '') {
    return '';
  }

  if (isObject || (typeof rawValue === 'object' && !Array.isArray(rawValue))) {
    let obj = rawValue;
    if (typeof rawValue === 'string') {
      try {
        obj = JSON.parse(rawValue.replace(/\n/g, '').trim());
      } catch {
        return '';
      }
    }

    if (!obj || typeof obj !== 'object') {
      return '';
    }

    const separator = explode ? '=' : ',';
    return Object.keys(obj)
      .map((key) => {
        const val = obj[key];
        const valStr = typeof val === 'object' ? JSON.stringify(val) : String(val);
        return `${key}${separator}${valStr}`;
      })
      .join(',');
  }

  if (Array.isArray(rawValue)) {
    const filtered = rawValue.filter((v) => v !== '' && v !== undefined && v !== null);
    return filtered.join(',');
  }

  return String(rawValue);
}

/**
 * Constructs a Headers instance for an API request from structured inputs.
 *
 * @param {object} options
 * @param {string} [options.accept] - Accept header
 * @param {Array<object>} [options.apiKeys] - Applied API keys
 * @param {Array<{ name: string, value: any, explode?: boolean, isObject?: boolean }>} [options.headerParams]
 * @param {string} [options.contentType] - Content-Type to apply (omitted for multipart/form-data)
 * @returns {Headers}
 */
export function constructFetchHeaders({ accept = '', apiKeys = [], headerParams = [], contentType = '' } = {}) {
  const reqHeaders = new Headers();

  if (accept) {
    reqHeaders.append('Accept', accept);
  }

  if (Array.isArray(apiKeys)) {
    apiKeys
      .filter((k) => k && k.in === 'header' && k.finalKeyValue)
      .forEach((k) => {
        reqHeaders.append(k.name, k.finalKeyValue);
      });
  }

  if (Array.isArray(headerParams)) {
    headerParams.forEach((param) => {
      if (param && param.name && param.value !== undefined && param.value !== null && param.value !== '') {
        const headerValue = serializeHeaderValue(param.value, {
          explode: param.explode === true || param.explode === 'true',
          isObject: param.isObject === true,
        });
        if (headerValue) {
          reqHeaders.append(param.name, headerValue);
        }
      }
    });
  }

  if (contentType && !contentType.includes('form-data')) {
    reqHeaders.append('Content-Type', contentType);
  }

  return reqHeaders;
}

/**
 * Builds a URLSearchParams body from field entries or a dynamic JSON template.
 *
 * @param {Array<{ name: string, value: any, isArray?: boolean }>} fields
 * @param {string} [dynamicJson] - Raw JSON string for dynamic forms
 * @returns {URLSearchParams}
 */
export function buildUrlEncodedBody(fields = [], dynamicJson = '') {
  const params = new URLSearchParams();

  if (dynamicJson) {
    try {
      const obj = JSON.parse(dynamicJson);
      if (obj && typeof obj === 'object') {
        for (const prop of Object.keys(obj)) {
          params.append(prop, typeof obj[prop] === 'object' ? JSON.stringify(obj[prop]) : String(obj[prop]));
        }
        return params;
      }
    } catch {
      // Fall through to fields
    }
  }

  if (Array.isArray(fields)) {
    fields.forEach((field) => {
      if (!field || !field.name || field.value === undefined || field.value === null || field.value === '') {
        return;
      }
      if (field.isArray) {
        const arr = Array.isArray(field.value) ? field.value : [field.value];
        const filtered = arr.filter((v) => v !== '' && v !== undefined && v !== null);
        if (filtered.length > 0) {
          params.append(field.name, filtered.join(','));
        }
      } else {
        params.append(field.name, String(field.value));
      }
    });
  }

  return params;
}

/**
 * Builds a FormData instance from structured field entries.
 *
 * @param {Array<{ name: string, value: any, file?: File, isArray?: boolean }>} fields
 * @returns {FormData}
 */
export function buildMultipartFormData(fields = []) {
  const formData = new FormData();

  if (!Array.isArray(fields)) {
    return formData;
  }

  fields.forEach((field) => {
    if (!field || !field.name) {
      return;
    }

    if (typeof File !== 'undefined' && field.file instanceof File) {
      formData.append(field.name, field.file, field.file.name);
      return;
    }

    if (field.value === undefined || field.value === null || field.value === '') {
      return;
    }

    if (field.isArray) {
      const arr = Array.isArray(field.value) ? field.value : [field.value];
      const filtered = arr.filter((v) => v !== '' && v !== undefined && v !== null);
      filtered.forEach((item) => {
        if (typeof File !== 'undefined' && item instanceof File) {
          formData.append(field.name, item, item.name);
        } else {
          formData.append(field.name, String(item));
        }
      });
    } else {
      formData.append(field.name, String(field.value));
    }
  });

  return formData;
}
