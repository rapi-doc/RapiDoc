/**
 * Generates a deterministic sample string matching common regex patterns in OpenAPI schemas.
 * Falls back to the pattern string if an unexpected error occurs.
 */
export function patternSampleGenerator(pattern) {
  if (!pattern || typeof pattern !== 'string') {
    return '';
  }

  try {
    let p = pattern.trim();
    if (p.startsWith('^')) p = p.slice(1);
    if (p.endsWith('$') && !p.endsWith('\\$')) p = p.slice(0, -1);

    // Resolve simple group alternations: (opt1|opt2|opt3) -> opt1
    p = p.replace(/\((?:\?:)?([^()|]+)(?:\|[^()]+)*\)/g, '$1');

    // Tokenizer matching
    const tokenRegex = /(\[[^\]]+\]|\\[dwsDWS]|\\[^]|\.|[^\\[\]{}()+*?|])(?:\{(\d+)(?:,\d*)?\}|([+*?]))?/g;

    let result = '';
    let match;

    while ((match = tokenRegex.exec(p)) !== null) {
      const token = match[1];
      const count = match[2];
      const quantifier = match[3];

      let rep = 1;
      if (count !== undefined) {
        rep = parseInt(count, 10);
      } else if (quantifier === '+') {
        rep = 1;
      } else if (quantifier === '*' || quantifier === '?') {
        rep = 0;
      }

      rep = Math.min(Math.max(0, rep), 50);

      let sampleChar = 'a';
      if (token === '\\d') {
        sampleChar = '0';
      } else if (token === '\\D') {
        sampleChar = 'a';
      } else if (token === '\\w') {
        sampleChar = 'a';
      } else if (token === '\\W') {
        sampleChar = '_';
      } else if (token === '\\s') {
        sampleChar = ' ';
      } else if (token === '\\S') {
        sampleChar = 'a';
      } else if (token === '.') {
        sampleChar = 'a';
      } else if (token.startsWith('\\')) {
        sampleChar = token.slice(1);
      } else if (token.startsWith('[')) {
        const inner = token.slice(1, -1);
        if (inner.startsWith('^')) {
          sampleChar = inner.includes('a') ? '0' : 'a';
        } else if (/[1-9]/.test(inner) && !inner.includes('0')) {
          sampleChar = '1';
        } else if (/[0-9]/.test(inner) && !/[a-zA-Z]/.test(inner)) {
          sampleChar = '0';
        } else if (/[0-9]/.test(inner) && /[a-fA-F]/.test(inner) && !/[g-zG-Z]/.test(inner)) {
          sampleChar = '0';
        } else if (/[A-Z]/.test(inner) && !/[a-z]/.test(inner)) {
          sampleChar = 'A';
        } else if (/[a-z]/.test(inner)) {
          sampleChar = 'a';
        } else if (inner.length > 0) {
          sampleChar = inner[0];
        }
      } else {
        sampleChar = token;
      }

      result += sampleChar.repeat(rep);
    }

    return result || pattern;
  } catch {
    return pattern;
  }
}

// Takes a value as input and provides a printable string to replresent null values, spaces, blankstring etc
export function getPrintableVal(val) {
  if (val === undefined) {
    return '';
  }
  if (val === null) {
    return 'null';
  }
  if (val === '') {
    return '∅';
  }
  if (typeof val === 'boolean' || typeof val === 'number') {
    return `${val}`;
  }
  if (Array.isArray(val)) {
    return val
      .map((v) => (v === null ? 'null' : v === '' ? '∅' : v.toString().replace(/^ +| +$/g, (m) => '●'.repeat(m.length)) || ''))
      .join(', ');
  }
  if (typeof val === 'object') {
    const keys = Object.keys(val);
    return `{ ${keys[0]}:${val[keys[0]]}${keys.length > 1 ? ',' : ''} ... }`;
  }
  return val.toString().replace(/^ +| +$/g, (m) => '●'.repeat(m.length)) || '';
}

/* Helper to detect binary file fields across OpenAPI 3.0 and 3.1 */
export function isBinaryFileField(schema) {
  if (!schema) {
    return false;
  }
  return (
    schema.format === 'binary' ||
    schema.contentEncoding === 'binary' ||
    (Boolean(schema.contentMediaType) && schema.contentEncoding !== 'base64')
  );
}

/* Generates an schema object containing type and constraint info */
export function getTypeInfo(schema) {
  if (!schema) {
    return;
  }
  let dataType = '';
  let constrain = '';
  // let examples;

  if (schema.$ref) {
    const n = schema.$ref.lastIndexOf('/');
    const schemaNode = schema.$ref.substring(n + 1);
    dataType = `{recursive: ${schemaNode}} `;
  } else if (schema.type) {
    dataType = Array.isArray(schema.type) ? schema.type.join('┃') : schema.type;
    if (schema.format || schema.enum || schema.const !== undefined) {
      dataType = dataType.replace('string', schema.enum ? 'enum' : schema.const !== undefined ? 'const' : schema.format);
    }
    if (schema.nullable) {
      dataType += '┃null';
    }
  } else if (schema.const !== undefined) {
    dataType = 'const';
  } else if (schema.anyOf || schema.oneOf) {
    const subSchemas = (schema.anyOf || schema.oneOf).filter(Boolean);
    const subTypes = [];
    subSchemas.forEach((s) => {
      const sInfo = getTypeInfo(s);
      if (sInfo?.type && sInfo.type !== '{missing-type-info}') {
        sInfo.type.split('┃').forEach((t) => {
          const trimmed = t.trim();
          if (trimmed && !subTypes.includes(trimmed)) {
            subTypes.push(trimmed);
          }
        });
      }
    });
    dataType = subTypes.length > 0 ? subTypes.join('┃') : '{missing-type-info}';
  } else if (Object.keys(schema).length === 0) {
    dataType = 'any';
  } else {
    dataType = '{missing-type-info}';
  }

  const effectiveSchema =
    schema.anyOf || schema.oneOf
      ? {
          ...((schema.anyOf || schema.oneOf).find((s) => s && s.type && s.type !== 'null') || (schema.anyOf || schema.oneOf)[0] || {}),
          ...schema,
        }
      : schema;

  const info = {
    type: dataType,
    format: schema.format || effectiveSchema.format || '',
    contentMediaType: schema.contentMediaType || effectiveSchema.contentMediaType || '',
    contentEncoding: schema.contentEncoding || effectiveSchema.contentEncoding || '',
    contentSchema: schema.contentSchema || effectiveSchema.contentSchema || null,
    pattern:
      (schema.pattern || effectiveSchema.pattern) && !schema.enum && !effectiveSchema.enum ? schema.pattern || effectiveSchema.pattern : '',
    readOrWriteOnly: schema.readOnly ? '🆁' : schema.writeOnly ? '🆆' : effectiveSchema.readOnly ? '🆁' : effectiveSchema.writeOnly ? '🆆' : '',
    deprecated: schema.deprecated || effectiveSchema.deprecated ? '❌' : '',
    examples: schema.examples || schema.example || effectiveSchema.examples || effectiveSchema.example,
    default: getPrintableVal(schema.default !== undefined ? schema.default : effectiveSchema.default),
    description: schema.description || effectiveSchema.description || '',
    constrain: '',
    allowedValues: '',
    arrayType: '',
    html: '',
  };

  if (info.type === '{recursive}') {
    info.description = schema.$ref.substring(schema.$ref.lastIndexOf('/') + 1);
  } else if (info.type === '{missing-type-info}' || info.type === 'any') {
    info.description = info.description || '';
  }
  // Set Allowed Values
  info.allowedValues =
    schema.const !== undefined
      ? getPrintableVal(schema.const)
      : Array.isArray(schema.enum)
        ? schema.enum.map((v) => getPrintableVal(v)).join('┃')
        : effectiveSchema.const !== undefined
          ? getPrintableVal(effectiveSchema.const)
          : Array.isArray(effectiveSchema.enum)
            ? effectiveSchema.enum.map((v) => getPrintableVal(v)).join('┃')
            : '';

  if (!info.allowedValues && (schema.anyOf || schema.oneOf)) {
    const subValues = [];
    (schema.anyOf || schema.oneOf).forEach((s) => {
      const sVal =
        s.const !== undefined ? getPrintableVal(s.const) : Array.isArray(s.enum) ? s.enum.map((v) => getPrintableVal(v)).join('┃') : '';
      if (sVal && !subValues.includes(sVal)) {
        subValues.push(sVal);
      }
    });
    if (subValues.length > 0) {
      info.allowedValues = subValues.join('┃');
    }
  }

  const itemsSchema = schema.items || effectiveSchema.items;
  if ((dataType === 'array' || dataType.split('┃').includes('array')) && itemsSchema) {
    const arrayItemType = itemsSchema?.type;
    const arrayItemDefault = getPrintableVal(itemsSchema.default);

    info.arrayType = `${schema.type || 'array'} of ${Array.isArray(arrayItemType) ? arrayItemType.join('') : arrayItemType || ''}`;
    if (!info.default) {
      info.default = arrayItemDefault;
    }
    if (!info.allowedValues) {
      info.allowedValues =
        itemsSchema.const !== undefined
          ? getPrintableVal(itemsSchema.const)
          : Array.isArray(itemsSchema?.enum)
            ? itemsSchema.enum.map((v) => getPrintableVal(v)).join('┃')
            : '';
    }
  }
  if (dataType.match(/integer|number/g)) {
    const minVal = schema.minimum !== undefined ? schema.minimum : effectiveSchema.minimum;
    const excMinVal = schema.exclusiveMinimum !== undefined ? schema.exclusiveMinimum : effectiveSchema.exclusiveMinimum;
    if (minVal !== undefined || excMinVal !== undefined) {
      constrain += minVal !== undefined ? `Min ${minVal}` : `More than ${excMinVal}`;
    }
    const maxVal = schema.maximum !== undefined ? schema.maximum : effectiveSchema.maximum;
    const excMaxVal = schema.exclusiveMaximum !== undefined ? schema.exclusiveMaximum : effectiveSchema.exclusiveMaximum;
    if (maxVal !== undefined || excMaxVal !== undefined) {
      constrain += maxVal !== undefined ? `${constrain ? '┃' : ''}Max ${maxVal}` : `${constrain ? '┃' : ''}Less than ${excMaxVal}`;
    }
    const multVal = schema.multipleOf !== undefined ? schema.multipleOf : effectiveSchema.multipleOf;
    if (multVal !== undefined) {
      constrain += `${constrain ? '┃' : ''} multiple of ${multVal}`;
    }
  }
  if (dataType.match(/string/g)) {
    const minLen = schema.minLength !== undefined ? schema.minLength : effectiveSchema.minLength;
    const maxLen = schema.maxLength !== undefined ? schema.maxLength : effectiveSchema.maxLength;
    if (minLen !== undefined && maxLen !== undefined) {
      constrain += `${constrain ? '┃' : ''}${minLen} to ${maxLen} chars`;
    } else if (minLen !== undefined) {
      constrain += `${constrain ? '┃' : ''}Min ${minLen} chars`;
    } else if (maxLen !== undefined) {
      constrain += `Max ${constrain ? '┃' : ''}${maxLen} chars`;
    }
  }
  info.constrain = constrain;
  info.html = `${info.type}~|~${info.readOrWriteOnly}~|~${info.constrain}~|~${info.default}~|~${info.allowedValues}~|~${info.pattern}~|~${info.description}~|~${schema.title || ''}~|~${info.deprecated ? 'deprecated' : ''}`;
  return info;
}

/**
 *
 * @param {*} ex  if the value
 *  - Is an Object with 'value' property  like
 *      { 'value': 'example_val1', 'description': 'some description' }
 *    Returns >>>
 *      {
 *        'Example': { 'value' : 'example_val1', 'description': 'some description' },
 *      }
 *  - Is an object where each key represents a valid example object (i,e has a value property)
 *      {
 *        'example1': { 'value' : 'example_val1', 'description': 'some description' },
 *        'example2': { 'value' : 'example_val2', 'description': 'some other description' },
 *        'invalid':  { 'description': 'invalid example object without any value property' }
 *      }
 *    Returns >>>
 *      {
 *        'example1': { 'value' : 'example_val1', 'description': 'some description' },
 *        'example2': { 'value' : 'example_val2', 'description': 'some other description' }
 *      }
 *      if none of the keys represents an object with 'value' property then return undefined
 *  - Is an array of premitive values
 *      ['example_val1', 'example_val2']
 *    Returns >>>
 *      {
 *         'Example1': {value:'value1'}
 *         'Example2': {value:'value2'}
 *      }
 *  - Is a premitive value
 *      'example_val1'
 *    Returns >>>
 *      {
 *        'Example': { 'value': 'example_val1' }
 *      }
 *  - Is undefined
 *    returns undefined
 * @returns
 */

export function standardizeExample(ex) {
  if (typeof ex === 'object' && !Array.isArray(ex)) {
    if (ex.value !== undefined) {
      // Case 1: Single object with 'value' property
      return { Example: { ...ex } };
    }
    // Case 2: Object where each key is an object with a 'value' property
    const filteredEntries = Object.entries(ex).filter(([_, obj]) => obj.value !== undefined); // eslint-disable-line
    // If no valid entries found, return JSON.stringify of the input
    if (filteredEntries.length === 0) {
      return undefined;
    }
    return Object.fromEntries(filteredEntries);
  }
  if (Array.isArray(ex)) {
    // Case 3: Array of primitive values
    return ex.reduce((acc, value, index) => {
      acc[`Example${index + 1}`] = { value };
      return acc;
    }, {});
  }
  // Case 4: Single primitive value
  return ex ? { Example: { value: ex } } : undefined;
}

/**
 *  Normalize example object in the following format (List of object which is used to render example links and fill the input boxes)
 *  [{
 *     exampleVal  : 'value to be rendered on the input control (text-box)',
 *     exampleList : [
 *       value         : '',
 *       printableValue: '',
 *       summary       : '',
 *       description   : ''
 *     ]
 *  }]
 * */
export function normalizeExamples(examples, dataType = 'string') {
  if (!examples) {
    return {
      exampleVal: '',
      exampleList: [],
    };
  }
  if (examples.constructor === Object) {
    const exampleList = Object.values(examples)
      .filter((v) => v['x-example-show-value'] !== false)
      .map((v) => ({
        value: typeof v.value === 'boolean' || typeof v.value === 'number' ? `${v.value}` : v.value || '',
        printableValue: getPrintableVal(v.value),
        summary: v.summary || '',
        description: v.description || '',
      }));
    const exampleVal = exampleList.length > 0 ? exampleList[0].value : '';
    return { exampleVal, exampleList };
  }

  // This is non-standard way to provide example but will support for now
  if (!Array.isArray(examples)) {
    examples = examples ? [examples] : [];
  }

  if (examples.length === 0) {
    return {
      exampleVal: '',
      exampleList: [],
    };
  }

  if (dataType === 'array') {
    const [exampleVal] = examples;
    const exampleList = examples.map((v) => ({
      value: v,
      printableValue: getPrintableVal(v),
    }));
    return { exampleVal, exampleList };
  }

  const exampleVal = examples[0].toString();
  const exampleList = examples.map((v) => ({
    value: v.toString(),
    printableValue: getPrintableVal(v),
  }));
  return { exampleVal, exampleList };
}

export function anyExampleWithSummaryOrDescription(examples) {
  return examples.some((x) => x.summary?.length > 0 || x.description?.length > 0);
}

/**
 * The 'example' property was deprecated in 3.1.0 in favor of the JSON Schema 'examples' keyword. However RapiDoc supports both. in the following order:
 * - examples
 * - example
 *
 * Returns the first example in the given schema.
 * Returns `undefined` if `schema` is undefined or if there are no examples at the top level of the `schema`.
 */
function getFirstExample(schema) {
  let firstExample;
  if (schema) {
    if (schema.examples && schema.examples.length >= 1) {
      firstExample = schema.examples[0];
    } else {
      firstExample = schema.example;
    }
  }
  return firstExample;
}

export function getSampleValueByType(schemaObj) {
  const example = getFirstExample(schemaObj);
  if (example === '') {
    return '';
  }
  if (example === null) {
    return null;
  }
  if (example === 0) {
    return 0;
  }
  if (example === false) {
    return false;
  }
  if (example instanceof Date) {
    switch (schemaObj.format.toLowerCase()) {
      case 'date':
        return example.toISOString().split('T')[0];
      case 'time':
        return example.toISOString().split('T')[1];
      default:
        return example.toISOString();
    }
  }
  if (example) {
    return example;
  }

  if (Object.keys(schemaObj).length === 0) {
    return null;
  }
  if (schemaObj.$ref) {
    // Indicates a Circular ref
    return {};
  }
  if (schemaObj.const === false || schemaObj.const === 0 || schemaObj.const === null || schemaObj.const === '') {
    return schemaObj.const;
  }
  if (schemaObj.const) {
    return schemaObj.const;
  }
  if (schemaObj.default) {
    return schemaObj.default;
  }
  const typeValue = Array.isArray(schemaObj.type) ? schemaObj.type[0] : schemaObj.type;
  if (!typeValue) {
    return null;
  }
  if (typeValue.match(/^integer|^number/g)) {
    const multipleOf = Number.isNaN(Number(schemaObj.multipleOf)) ? undefined : Number(schemaObj.multipleOf);
    const maximum = Number.isNaN(Number(schemaObj.maximum)) ? undefined : Number(schemaObj.maximum);
    const minimumPossibleVal = Number.isNaN(Number(schemaObj.minimum))
      ? Number.isNaN(Number(schemaObj.exclusiveMinimum))
        ? maximum || 0
        : Number(schemaObj.exclusiveMinimum) + (typeValue.startsWith('integer') ? 1 : 0.001)
      : Number(schemaObj.minimum);
    const finalVal = multipleOf
      ? multipleOf >= minimumPossibleVal
        ? multipleOf
        : minimumPossibleVal % multipleOf === 0
          ? minimumPossibleVal
          : Math.ceil(minimumPossibleVal / multipleOf) * multipleOf
      : minimumPossibleVal;
    return finalVal;
  }
  if (typeValue.match(/^boolean/g)) {
    return false;
  }
  if (typeValue.match(/^null/g)) {
    return null;
  }
  if (typeValue.match(/^string/g)) {
    if (schemaObj.enum) {
      return schemaObj.enum[0];
    }
    if (schemaObj.const) {
      return schemaObj.const;
    }
    if (schemaObj.pattern) {
      try {
        return patternSampleGenerator(schemaObj.pattern);
      } catch {
        return schemaObj.pattern;
      }
    }
    if (schemaObj.contentEncoding) {
      switch (schemaObj.contentEncoding.toLowerCase()) {
        case 'base64':
          return 'ZXhhbXBsZQ=='; // 'example' base64 encoded
        case 'binary':
        case '7bit':
        case '8bit':
        case 'quoted-printable':
          return 'string';
      }
    }
    if (schemaObj.contentMediaType) {
      if (schemaObj.contentMediaType.toLowerCase() === 'application/json') {
        if (schemaObj.contentSchema) {
          const sample = schemaToSampleObj(schemaObj.contentSchema);
          const sampleVal = sample?.['example-0'] ?? sample;
          return JSON.stringify(sampleVal);
        }
        return '{}';
      }
      if (schemaObj.contentMediaType.startsWith('text/')) {
        return 'text content';
      }
    }
    if (schemaObj.format) {
      switch (schemaObj.format.toLowerCase()) {
        case 'url':
        case 'uri':
          return 'http://example.com';
        case 'date':
          return new Date(0).toISOString().split('T')[0];
        case 'time':
          return new Date(0).toISOString().split('T')[1];
        case 'date-time':
          return new Date(0).toISOString();
        case 'duration':
          return 'P3Y6M4DT12H30M5S'; // P=Period 3-Years 6-Months 4-Days 12-Hours 30-Minutes 5-Seconds
        case 'email':
        case 'idn-email':
          return 'user@example.com';
        case 'hostname':
        case 'idn-hostname':
          return 'www.example.com';
        case 'ipv4':
          return '198.51.100.42';
        case 'ipv6':
          return '2001:0db8:5b96:0000:0000:426f:8e17:642a';
        case 'uuid':
          return '3fa85f64-5717-4562-b3fc-2c963f66afa6';
        case 'byte':
        case 'base64':
          return 'ZXhhbXBsZQ=='; // 'example' base64 encoded. See https://spec.openapis.org/oas/v3.0.0#data-types
        case 'binary':
          return 'binary';
        default:
          return '';
      }
    } else {
      const minLength = Number.isNaN(schemaObj.minLength) ? undefined : Number(schemaObj.minLength);
      const maxLength = Number.isNaN(schemaObj.maxLength) ? undefined : Number(schemaObj.maxLength);
      const finalLength = minLength || (maxLength > 6 ? 6 : maxLength || undefined);
      return finalLength ? 'A'.repeat(finalLength) : 'string';
    }
  }
  // If type cannot be determined
  return null;
}

/*
json2xml- TestCase
  {
    'prop1' : 'one',
    'prop2' : 'two',
    'prop3' : [ 'a', 'b', 'c' ],
    'prop4' : {
      'ob1' : 'val-1',
      'ob2' : 'val-2'
    }
  }
  <root>
    <prop1>simple</prop1>
    <prop2>
      <0>a</0>
      <1>b</1>
      <2>c</2>
    </prop2>
    <prop3>
      <ob1>val-1</ob1>
      <ob2>val-2</ob2>
    </prop3>
  </root>
*/
export function json2xml(obj, level = 1) {
  const indent = '  '.repeat(level);
  let xmlText = '';
  if (level === 1 && typeof obj !== 'object') {
    return `\n${indent}${obj.toString()}`;
  }
  for (const prop in obj) {
    const tagNameOrProp = obj[prop]['::XML_TAG'] || prop;
    let tagName = '';
    if (Array.isArray(obj[prop])) {
      tagName = tagNameOrProp[0]['::XML_TAG'] || `${prop}`;
    } else {
      tagName = tagNameOrProp;
    }
    if (prop.startsWith('::')) {
      continue;
    }
    if (Array.isArray(obj[prop])) {
      xmlText = `${xmlText}\n${indent}<${tagName}>${json2xml(obj[prop], level + 1)}\n${indent}</${tagName}>`;
    } else if (typeof obj[prop] === 'object') {
      xmlText = `${xmlText}\n${indent}<${tagName}>${json2xml(obj[prop], level + 1)}\n${indent}</${tagName}>`;
    } else {
      xmlText = `${xmlText}\n${indent}<${tagName}>${obj[prop].toString()}</${tagName}>`;
    }
  }
  return xmlText;
}

function addSchemaInfoToExample(schema, obj) {
  if (typeof obj !== 'object' || obj === null) {
    return;
  }
  if (schema.title) {
    obj['::TITLE'] = schema.title;
  }
  if (schema.description) {
    obj['::DESCRIPTION'] = schema.description;
  }
  if (schema.xml?.name) {
    obj['::XML_TAG'] = schema.xml?.name;
  }
  if (schema.xml?.wrapped) {
    obj['::XML_WRAP'] = schema.xml?.wrapped.toString();
  }
}

function removeTitlesAndDescriptions(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return;
  }
  delete obj['::TITLE'];
  delete obj['::DESCRIPTION'];
  delete obj['::XML_TAG'];
  delete obj['::XML_WRAP'];
  for (const k in obj) {
    removeTitlesAndDescriptions(obj[k]);
  }
}

function mergePropertyExamples(obj, propertyName, propExamples) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  const propVal =
    propExamples && typeof propExamples === 'object' && 'example-0' in propExamples
      ? propExamples['example-0']
      : propExamples && typeof propExamples === 'object' && Object.keys(propExamples).length > 0 && !Array.isArray(propExamples)
        ? Object.values(propExamples)[0]
        : propExamples;

  for (const exampleKey in obj) {
    if (obj[exampleKey] && typeof obj[exampleKey] === 'object') {
      obj[exampleKey][propertyName] = propVal;
    }
  }
  return obj;
}

/* For changing JSON-Schema to a Sample Object, as per the schema (to generate examples based on schema) */
export function schemaToSampleObj(schema, config = {}, level = 0) {
  let obj = {};
  if (!schema || level > 8) {
    return;
  }
  if (schema.allOf) {
    const mergedObj = {};

    if (schema.allOf.length === 1 && !schema.allOf[0]?.properties && !schema.allOf[0]?.items) {
      // If allOf has single item and the type is not an object or array, then its a primitive
      if (schema.allOf[0].$ref) {
        return { 'example-0': {} };
      }
      if (schema.allOf[0].readOnly && config.includeReadOnly) {
        const tempSchema = schema.allOf[0];
        return { 'example-0': getSampleValueByType(tempSchema) };
      }
      return;
    }

    schema.allOf.forEach((v) => {
      if (!v) return;
      if (v.type === 'object' || v.properties || v.allOf || v.anyOf || v.oneOf) {
        const partialSamples = schemaToSampleObj(v, config, level + 1);
        const partialVal = partialSamples?.['example-0'] ?? partialSamples;
        if (partialVal && typeof partialVal === 'object' && !Array.isArray(partialVal)) {
          Object.assign(mergedObj, partialVal);
        }
      } else if (v.type === 'array' || v.items) {
        const partialSamples = schemaToSampleObj(v, config, level + 1);
        const partialVal = partialSamples?.['example-0'] ?? partialSamples;
        if (Array.isArray(partialVal)) {
          mergedObj[Object.keys(mergedObj).length] = partialVal;
        }
      } else if (v.type) {
        const prop = `prop${Object.keys(mergedObj).length}`;
        mergedObj[prop] = getSampleValueByType(v);
      }
    });

    obj = { 'example-0': mergedObj };
    addSchemaInfoToExample(schema, obj['example-0']);
  } else if (schema.oneOf) {
    // 1. First create example with schema.properties
    const objWithSchemaProps = {};
    if (schema.properties) {
      for (const propertyName in schema.properties) {
        const propSchema = schema.properties[propertyName];
        if (propSchema?.properties || propSchema?.items) {
          const propSamples = schemaToSampleObj(propSchema, config, level + 1);
          objWithSchemaProps[propertyName] = propSamples?.['example-0'] ?? propSamples;
        } else {
          objWithSchemaProps[propertyName] = getSampleValueByType(propSchema);
        }
      }
    }

    if (schema.oneOf.length > 0) {
      // If at root (level === 0), expand all oneOf variants as distinct examples.
      // If nested (level > 0), only pick the first oneOf variant to avoid combinatorial duplication.
      const variantsToProcess = level === 0 ? schema.oneOf : [schema.oneOf[0]];
      let i = 0;
      for (let k = 0; k < variantsToProcess.length; k++) {
        const variantSchema = variantsToProcess[k];
        const oneOfSamples = schemaToSampleObj(variantSchema, config, level + 1);
        for (const sampleKey in oneOfSamples) {
          let finalExample = oneOfSamples[sampleKey];
          if (
            Object.keys(objWithSchemaProps).length > 0 &&
            finalExample &&
            typeof finalExample === 'object' &&
            !Array.isArray(finalExample)
          ) {
            finalExample = { ...objWithSchemaProps, ...finalExample };
          }
          obj[`example-${i}`] = finalExample;
          addSchemaInfoToExample(variantSchema, obj[`example-${i}`]);
          i++;
          if (level > 0) {
            break;
          }
        }
      }
    }
  } else if (schema.anyOf) {
    // First generate values for regular properties
    let commonObj = { 'example-0': {} };
    if (schema.type === 'object' || schema.properties) {
      for (const propertyName in schema.properties) {
        const propSchema = schema.properties[propertyName];
        if (propSchema?.deprecated && !config.includeDeprecated) continue;
        if (propSchema?.readOnly && !config.includeReadOnly) continue;
        if (propSchema?.writeOnly && !config.includeWriteOnly) continue;
        const propExample = getFirstExample(propSchema);
        if (propExample !== undefined) {
          commonObj['example-0'][propertyName] = propExample;
        } else {
          mergePropertyExamples(commonObj, propertyName, schemaToSampleObj(propSchema, config, level + 1));
        }
      }
    }

    if (schema.anyOf.length > 0) {
      const variantsToProcess = level === 0 ? schema.anyOf : [schema.anyOf[0]];
      let i = 0;
      for (let k = 0; k < variantsToProcess.length; k++) {
        const variantSchema = variantsToProcess[k];
        const anyOfSamples = schemaToSampleObj(variantSchema, config, level + 1);
        for (const sampleKey in anyOfSamples) {
          const sampleVal = anyOfSamples[sampleKey];
          if (commonObj?.['example-0'] && Object.keys(commonObj['example-0']).length > 0) {
            obj[`example-${i}`] = { ...commonObj['example-0'], ...(typeof sampleVal === 'object' ? sampleVal : {}) };
          } else {
            obj[`example-${i}`] = sampleVal;
          }
          addSchemaInfoToExample(variantSchema, obj[`example-${i}`]);
          i++;
          if (level > 0) {
            break;
          }
        }
      }
    }
  } else if (schema.type === 'object' || schema.properties) {
    obj['example-0'] = {};
    addSchemaInfoToExample(schema, obj['example-0']);
    const firstExample = getFirstExample(schema);
    if (firstExample !== undefined) {
      obj['example-0'] = firstExample;
    } else {
      for (const propertyName in schema.properties) {
        const propSchema = schema.properties[propertyName];
        if (!propSchema) continue;
        if (propSchema.deprecated && !config.includeDeprecated) continue;
        if (propSchema.readOnly && !config.includeReadOnly) continue;
        if (propSchema.writeOnly && !config.includeWriteOnly) continue;

        if (propSchema.type === 'array' || propSchema.items) {
          const propExample = getFirstExample(propSchema);
          if (propExample !== undefined) {
            obj['example-0'][propertyName] = propExample;
          } else if (getFirstExample(propSchema.items) !== undefined) {
            obj['example-0'][propertyName] = [getFirstExample(propSchema.items)];
          } else {
            const itemSamples = schemaToSampleObj(propSchema.items, config, level + 1);
            const itemSampleVal = itemSamples?.['example-0'] ?? itemSamples;
            if (config.useXmlTagForProp) {
              const xmlTagName = propSchema.xml?.name || propertyName;
              if (propSchema.xml?.wrapped) {
                obj['example-0'][xmlTagName] = { [xmlTagName]: itemSampleVal };
              } else {
                obj['example-0'][xmlTagName] = [itemSampleVal];
              }
            } else {
              obj['example-0'][propertyName] = [itemSampleVal];
            }
          }
          continue;
        }

        mergePropertyExamples(obj, propertyName, schemaToSampleObj(propSchema, config, level + 1));
      }

      if (typeof schema.additionalProperties === 'object' && schema.additionalProperties !== null) {
        const propName = schema.additionalProperties['x-additionalPropertiesName'] || 'property';
        mergePropertyExamples(obj, `${propName}1`, schemaToSampleObj(schema.additionalProperties, config, level + 1));
        mergePropertyExamples(obj, `${propName}2`, schemaToSampleObj(schema.additionalProperties, config, level + 1));
      }
    }
  } else if (schema.type === 'array' || schema.items) {
    const firstExample = getFirstExample(schema);
    if (firstExample !== undefined) {
      obj['example-0'] = firstExample;
    } else if (schema.items) {
      const itemsExample = getFirstExample(schema.items);
      if (itemsExample !== undefined) {
        obj['example-0'] = [itemsExample];
      } else {
        const samples = schemaToSampleObj(schema.items, config, level + 1);
        const itemVal = samples?.['example-0'] ?? samples;
        obj['example-0'] = [itemVal];
        addSchemaInfoToExample(schema.items, obj['example-0']);
      }
    } else {
      obj['example-0'] = [];
    }
  } else {
    return { 'example-0': getSampleValueByType(schema) };
  }
  return obj;
}

function generateMarkdownForArrayAndObjectDescription(schema, level = 0) {
  let mainText = '';
  if (schema.title) {
    if (schema.description) {
      mainText = `<b>${schema.title}:</b> ${schema.description}`;
    } else {
      mainText = schema.title;
    }
  } else if (schema.description) {
    mainText = schema.description;
  }

  const extraParts = [];
  if (schema.minItems) {
    extraParts.push(`<b>Min Items:</b> ${schema.minItems}`);
  }
  if (schema.maxItems) {
    extraParts.push(`<b>Max Items:</b> ${schema.maxItems}`);
  }
  if (schema.uniqueItems === true) {
    extraParts.push(`<b>Must have unique items</b>`);
  }
  if (level > 0 && schema.items?.description) {
    let itemsMarkdown = '';
    if (schema.items.minProperties) {
      itemsMarkdown = `<b>Min Properties:</b> ${schema.items.minProperties}`;
    }
    if (schema.items.maxProperties) {
      itemsMarkdown = `${itemsMarkdown} <b>Max Properties:</b> ${schema.items.maxProperties}`;
    }
    extraParts.push(`⮕ ${itemsMarkdown} [ ${schema.items.description} ]`);
  }

  if (mainText && extraParts.length > 0) {
    return `${mainText.trim()}\n\n${extraParts.join(' ')}`;
  }
  if (mainText) {
    return mainText.trim();
  }
  return extraParts.join(' ');
}
/**
 * For changing OpenAPI-Schema to an Object Notation,
 * This Object would further be an input to UI Components to generate an Object-Tree
 * @param {object} schema - Schema object from OpenAPI spec
 * @param {object} obj - recursivly pass this object to generate object notation
 * @param {number} level - recursion level
 * @param {string} suffix - used for suffixing property names to avoid duplicate props during object composion
 */
/**
 * Helper to populate schema properties into a target object notation.
 */
function populateProperties(target, schema, level) {
  if (schema.properties) {
    for (const key in schema.properties) {
      const propKey = schema.required && schema.required.includes(key) ? `${key}*` : key;
      target[propKey] = schemaInObjectNotation(schema.properties[key], {}, level + 1);
    }
  }
  if (schema.patternProperties) {
    for (const key in schema.patternProperties) {
      target[`[pattern: ${key}]`] = schemaInObjectNotation(schema.patternProperties[key], {}, level + 1);
    }
  }
  if (schema.additionalProperties) {
    target['[any-key]'] = schemaInObjectNotation(schema.additionalProperties, {}, level + 1);
  }
}

function handleObjectSchema(schema, baseObj = {}, level = 0) {
  const obj = Object.assign({}, baseObj);
  obj['::title'] = schema.title || '';
  obj['::description'] = generateMarkdownForArrayAndObjectDescription(schema, level);
  obj['::type'] = 'object';
  if ((Array.isArray(schema.type) && schema.type.includes('null')) || schema.nullable) {
    obj['::dataTypeLabel'] = 'object ┃ null';
    obj['::nullable'] = true;
  }
  obj['::deprecated'] = schema.deprecated || false;
  obj['::readwrite'] = schema.readOnly ? 'readonly' : schema.writeOnly ? 'writeonly' : '';
  populateProperties(obj, schema, level);
  return obj;
}

function handleArraySchema(schema, baseObj = {}, level = 0) {
  const obj = Object.assign({}, baseObj);
  obj['::title'] = schema.title || '';
  obj['::description'] = generateMarkdownForArrayAndObjectDescription(schema, level);
  obj['::type'] = 'array';
  if ((Array.isArray(schema.type) && schema.type.includes('null')) || schema.nullable) {
    obj['::dataTypeLabel'] = 'array ┃ null';
    obj['::nullable'] = true;
  }
  obj['::deprecated'] = schema.deprecated || false;
  obj['::readwrite'] = schema.readOnly ? 'readonly' : schema.writeOnly ? 'writeonly' : '';
  if (schema.items?.items) {
    obj['::array-type'] = schema.items.items.type;
  }
  obj['::props'] = schema.items ? schemaInObjectNotation(schema.items, {}, level + 1) : undefined;
  return obj;
}

function handleAllOfSchema(schema, baseObj = {}, level = 0) {
  if (schema.allOf.length === 1 && !schema.allOf[0].properties && !schema.allOf[0].items) {
    // If allOf has single item and the type is not an object or array, then its a primitive
    return `${getTypeInfo(schema.allOf[0]).html}`;
  }

  const objWithAllProps = Object.assign({}, baseObj);
  schema.allOf.forEach((v, i) => {
    if (v.type === 'object' || v.properties || v.allOf || v.anyOf || v.oneOf) {
      const propSuffix = (v.anyOf || v.oneOf) && i > 0 ? `${i}` : '';
      const partialObj = schemaInObjectNotation(v, {}, level + 1, propSuffix);
      Object.assign(objWithAllProps, partialObj);
    } else if (v.type === 'array' || v.items) {
      const partialObj = schemaInObjectNotation(v, {}, level + 1);
      Object.assign(objWithAllProps, partialObj);
    } else if (v.type) {
      const prop = `prop${Object.keys(objWithAllProps).length}`;
      const typeObj = getTypeInfo(v);
      objWithAllProps[prop] = `${typeObj.html}`;
    }
  });

  return objWithAllProps;
}

function handleAnyOrOneOfSchema(schema, baseObj = {}, level = 0, suffix = '') {
  const obj = Object.assign({}, baseObj);
  obj['::description'] = schema.description || '';

  // 1. First iterate the regular properties if defined
  if (schema.type === 'object' || schema.properties) {
    obj['::type'] = 'object';
    populateProperties(obj, schema, level);
  }

  // 2. Then build anyOf / oneOf option entries
  const objWithAnyOfProps = {};
  const xxxOf = schema.anyOf ? 'anyOf' : 'oneOf';
  schema[xxxOf].forEach((v, index) => {
    const optKey = `::OPTION~${index + 1}${v.title ? `~${v.title}` : ''}`;
    if (v.type === 'object' || v.properties || v.allOf || v.anyOf || v.oneOf) {
      const partialObj = schemaInObjectNotation(v, {}, level + 1);
      objWithAnyOfProps[optKey] = partialObj;
      if (typeof partialObj === 'object' && partialObj !== null) {
        partialObj['::readwrite'] = ''; // xxx-options cannot be read or write only
      }
      objWithAnyOfProps['::type'] = 'xxx-of-option';
    } else if (v.type === 'array' || v.items) {
      const partialObj = schemaInObjectNotation(v, {}, level + 1);
      objWithAnyOfProps[optKey] = partialObj;
      if (typeof partialObj === 'object' && partialObj !== null) {
        partialObj['::readwrite'] = '';
      }
      objWithAnyOfProps['::type'] = 'xxx-of-array';
    } else {
      objWithAnyOfProps[optKey] = `${getTypeInfo(v).html}`;
      objWithAnyOfProps['::type'] = 'xxx-of-option';
    }
  });

  const operatorKey = schema.anyOf ? '::ANY~OF' : '::ONE~OF';
  const fullKey = suffix ? `${operatorKey} ${suffix}` : operatorKey;
  obj[fullKey] = objWithAnyOfProps;
  obj['::type'] = 'object';

  return obj;
}

function handleMultiTypeSchema(schema, baseObj = {}, level = 0) {
  // Recognize OpenAPI 3.1 nullable object and array
  if (schema.type.length === 2 && schema.type.includes('null')) {
    if (schema.type.includes('object')) {
      return handleObjectSchema(schema, baseObj, level);
    }
    if (schema.type.includes('array')) {
      return handleArraySchema(schema, baseObj, level);
    }
  }

  const subSchema = typeof structuredClone === 'function' ? structuredClone(schema) : JSON.parse(JSON.stringify(schema));
  const primitiveType = [];
  const complexTypes = [];

  subSchema.type.forEach((v) => {
    if (v.match(/integer|number|string|null|boolean/g)) {
      primitiveType.push(v);
    } else if (
      v === 'array' &&
      typeof subSchema.items?.type === 'string' &&
      subSchema.items?.type.match(/integer|number|string|null|boolean/g)
    ) {
      if (subSchema.items.type === 'string' && (subSchema.items.format || subSchema.items.contentMediaType)) {
        primitiveType.push(`[${subSchema.items.format || subSchema.items.contentMediaType}]`);
      } else {
        primitiveType.push(`[${subSchema.items.type}]`);
      }
    } else {
      complexTypes.push(v);
    }
  });

  let multiPrimitiveTypes;
  if (primitiveType.length > 0) {
    subSchema.type = primitiveType.join('┃');
    multiPrimitiveTypes = getTypeInfo(subSchema);
    if (complexTypes.length === 0) {
      return `${multiPrimitiveTypes?.html || ''}`;
    }
  }

  if (complexTypes.length > 0) {
    const obj = Object.assign({}, baseObj);
    obj['::type'] = 'object';
    const multiTypeOptions = {
      '::type': 'xxx-of-option',
    };

    let optionIndex = 1;
    complexTypes.forEach((v) => {
      if (v === 'object') {
        const objTypeOption = {
          '::title': schema.title || '',
          '::description': schema.description || '',
          '::type': 'object',
          '::deprecated': schema.deprecated || false,
        };
        populateProperties(objTypeOption, schema, level);
        multiTypeOptions[`::OPTION~${optionIndex++}`] = objTypeOption;
      } else if (v === 'array') {
        multiTypeOptions[`::OPTION~${optionIndex++}`] = {
          '::title': schema.title || '',
          '::description': schema.description || '',
          '::type': 'array',
          '::props': schemaInObjectNotation(schema.items, {}, level + 1),
        };
      }
    });

    if (primitiveType.length > 0 && multiPrimitiveTypes?.html) {
      multiTypeOptions[`::OPTION~${optionIndex++}`] = multiPrimitiveTypes.html;
    }

    obj['::ONE~OF'] = multiTypeOptions;
    return obj;
  }

  return Object.assign({}, baseObj);
}

function createObjectAST(schema, level, name, isRequired) {
  const isNullable = schema.nullable || (Array.isArray(schema.type) && schema.type.includes('null')) || false;
  const properties = [];
  if (schema.properties) {
    for (const key in schema.properties) {
      const isPropReq = Array.isArray(schema.required) && schema.required.includes(key);
      const child = schemaToAST(schema.properties[key], level + 1, key, isPropReq);
      if (child) properties.push(child);
    }
  }

  const patternProperties = [];
  if (schema.patternProperties) {
    for (const key in schema.patternProperties) {
      const child = schemaToAST(schema.patternProperties[key], level + 1, `[pattern: ${key}]`, false);
      if (child) patternProperties.push(child);
    }
  }

  let additionalProperties = null;
  if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
    additionalProperties = schemaToAST(schema.additionalProperties, level + 1, '[any-key]', false);
  }

  return {
    kind: 'object',
    name,
    title: schema.title || '',
    description: generateMarkdownForArrayAndObjectDescription(schema, level),
    required: isRequired,
    deprecated: schema.deprecated || false,
    readOnly: schema.readOnly || false,
    writeOnly: schema.writeOnly || false,
    nullable: isNullable,
    dataTypeLabel: isNullable ? 'object ┃ null' : 'object',
    properties,
    patternProperties,
    additionalProperties,
  };
}

function createArrayAST(schema, level, name, isRequired) {
  const isNullable = schema.nullable || (Array.isArray(schema.type) && schema.type.includes('null')) || false;
  let itemsNode = null;
  if (schema.items) {
    itemsNode = schemaToAST(schema.items, level + 1, '', false);
  }

  let arrayType = '';
  if (schema.items?.items) {
    arrayType = schema.items.items.type || '';
  } else if (schema.items?.type && typeof schema.items.type === 'string') {
    arrayType = schema.items.type;
  }

  return {
    kind: 'array',
    name,
    title: schema.title || '',
    description: generateMarkdownForArrayAndObjectDescription(schema, level),
    required: isRequired,
    deprecated: schema.deprecated || false,
    readOnly: schema.readOnly || false,
    writeOnly: schema.writeOnly || false,
    nullable: isNullable,
    dataTypeLabel: isNullable ? 'array ┃ null' : 'array',
    arrayType,
    minItems: schema.minItems,
    maxItems: schema.maxItems,
    uniqueItems: schema.uniqueItems || false,
    items: itemsNode,
  };
}

function createPrimitiveAST(schema, name, isRequired) {
  const typeInfo = getTypeInfo(schema) || {};
  return {
    kind: 'primitive',
    name,
    type: typeInfo.type || schema.type || '',
    format: typeInfo.format || schema.format || '',
    contentMediaType: typeInfo.contentMediaType || schema.contentMediaType || '',
    contentEncoding: typeInfo.contentEncoding || schema.contentEncoding || '',
    contentSchema: typeInfo.contentSchema || schema.contentSchema || null,
    pattern: typeInfo.pattern || schema.pattern || '',
    constraints: typeInfo.constrain || '',
    defaultValue: typeInfo.default !== undefined && typeInfo.default !== '' ? String(typeInfo.default) : '',
    allowedValues: typeInfo.allowedValues || '',
    description: (schema.description || typeInfo.description || '').trim(),
    title: (schema.title || '').trim(),
    required: isRequired,
    deprecated: schema.deprecated || !!typeInfo.deprecated,
    readOnly: schema.readOnly || typeInfo.readOrWriteOnly === 'readonly',
    writeOnly: schema.writeOnly || typeInfo.readOrWriteOnly === 'writeonly',
    html: typeInfo.html || '',
  };
}

/**
 * Transforms an OpenAPI Schema into a strongly-typed Abstract Syntax Tree (AST) node.
 *
 * @param {object} schema - OpenAPI/JSON Schema object
 * @param {number} [level=0] - Recursion depth
 * @param {string} [name=''] - Property or field name
 * @param {boolean} [isRequired=false] - Whether this property is required
 * @param {string} [suffix=''] - Suffix used for union composition
 * @returns {object|null} Typed SchemaNode AST
 */
export function schemaToAST(schema, level = 0, name = '', isRequired = false, suffix = '') {
  if (!schema) {
    return null;
  }
  if (level > 8) {
    return {
      kind: 'object',
      name,
      type: schema.type || 'object',
      title: schema.title || '',
      description: schema.description || '',
      required: isRequired,
      truncated: true,
    };
  }

  // 1. allOf
  if (schema.allOf) {
    if (schema.allOf.length === 1 && !schema.allOf[0].properties && !schema.allOf[0].items) {
      const mergedSchema = {
        ...schema.allOf[0],
        ...schema,
        title: schema.title || schema.allOf[0].title || '',
        description: schema.description || schema.allOf[0].description || '',
      };
      delete mergedSchema.allOf;
      return schemaToAST(mergedSchema, level, name, isRequired);
    }

    const mergedProps = [];
    const mergedPatternProps = [];
    let mergedAdditionalProps = null;
    const unionChildren = [];
    let mergedTitle = schema.title || '';
    let mergedDescription = schema.description || '';
    let mergedDeprecated = schema.deprecated || false;
    let mergedReadOnly = schema.readOnly || false;
    let mergedWriteOnly = schema.writeOnly || false;
    let mergedNullable = schema.nullable || false;

    schema.allOf.forEach((sub, i) => {
      if (sub.title && !mergedTitle) mergedTitle = sub.title;
      if (sub.description && !mergedDescription) mergedDescription = sub.description;
      if (sub.deprecated) mergedDeprecated = true;
      if (sub.readOnly) mergedReadOnly = true;
      if (sub.writeOnly) mergedWriteOnly = true;
      if (sub.nullable) mergedNullable = true;

      if (sub.type === 'object' || sub.properties || sub.allOf || sub.anyOf || sub.oneOf) {
        const subSuffix = (sub.anyOf || sub.oneOf) && i > 0 ? `${i}` : '';
        const subAst = schemaToAST(sub, level + 1, '', false, subSuffix);
        if (subAst) {
          if (subAst.kind === 'object') {
            if (subAst.properties) mergedProps.push(...subAst.properties);
            if (subAst.patternProperties) mergedPatternProps.push(...subAst.patternProperties);
            if (subAst.additionalProperties) mergedAdditionalProps = subAst.additionalProperties;
          } else if (subAst.kind === 'union') {
            unionChildren.push(subAst);
          }
        }
      } else if (sub.type === 'array' || sub.items) {
        const subAst = schemaToAST(sub, level + 1);
        if (subAst) {
          mergedProps.push(subAst);
        }
      } else if (sub.type) {
        const propName = `prop${mergedProps.length}`;
        mergedProps.push(schemaToAST(sub, level + 1, propName, false));
      }
    });

    return {
      kind: 'object',
      name,
      title: mergedTitle,
      description: generateMarkdownForArrayAndObjectDescription({ ...schema, title: mergedTitle, description: mergedDescription }, level),
      required: isRequired,
      deprecated: mergedDeprecated,
      readOnly: mergedReadOnly,
      writeOnly: mergedWriteOnly,
      nullable: mergedNullable,
      dataTypeLabel: mergedNullable ? 'object ┃ null' : 'object',
      properties: mergedProps,
      patternProperties: mergedPatternProps,
      additionalProperties: mergedAdditionalProps,
      unions: unionChildren,
    };
  }

  // 2. anyOf / oneOf
  if (schema.anyOf || schema.oneOf) {
    const operator = schema.anyOf ? 'anyOf' : 'oneOf';
    const rawOptions = schema.anyOf || schema.oneOf;
    const options = rawOptions
      .map((opt, idx) => {
        const optTitle = opt.title || '';
        const optAst = schemaToAST(opt, level + 1, optTitle || `Option ${idx + 1}`, false);
        if (optAst) {
          optAst.readOnly = false;
          optAst.writeOnly = false;
          optAst.optionIndex = idx + 1;
          optAst.optionTitle = optTitle;
        }
        return optAst;
      })
      .filter(Boolean);

    let baseProps = [];
    if (schema.type === 'object' || schema.properties) {
      if (schema.properties) {
        for (const key in schema.properties) {
          const isReq = Array.isArray(schema.required) && schema.required.includes(key);
          const propNode = schemaToAST(schema.properties[key], level + 1, key, isReq);
          if (propNode) baseProps.push(propNode);
        }
      }
    }

    return {
      kind: 'union',
      operator,
      name,
      suffix,
      title: schema.title || '',
      description: schema.description || '',
      required: isRequired,
      properties: baseProps,
      options,
    };
  }

  // 3. Multi-type array (OpenAPI 3.1)
  if (Array.isArray(schema.type)) {
    if (schema.type.length === 2 && schema.type.includes('null')) {
      if (schema.type.includes('object')) {
        return createObjectAST(schema, level, name, isRequired);
      }
      if (schema.type.includes('array')) {
        return createArrayAST(schema, level, name, isRequired);
      }
    }

    const subSchema = typeof structuredClone === 'function' ? structuredClone(schema) : JSON.parse(JSON.stringify(schema));
    const primitiveType = [];
    const complexTypes = [];

    subSchema.type.forEach((v) => {
      if (v.match(/integer|number|string|null|boolean/g)) {
        primitiveType.push(v);
      } else if (
        v === 'array' &&
        typeof subSchema.items?.type === 'string' &&
        subSchema.items?.type.match(/integer|number|string|null|boolean/g)
      ) {
        if (subSchema.items.type === 'string' && (subSchema.items.format || subSchema.items.contentMediaType)) {
          primitiveType.push(`[${subSchema.items.format || subSchema.items.contentMediaType}]`);
        } else {
          primitiveType.push(`[${subSchema.items.type}]`);
        }
      } else {
        complexTypes.push(v);
      }
    });

    if (complexTypes.length === 0 && primitiveType.length > 0) {
      subSchema.type = primitiveType.join('┃');
      return createPrimitiveAST(subSchema, name, isRequired);
    }

    if (complexTypes.length > 0) {
      const options = [];
      let optionIndex = 1;
      complexTypes.forEach((v) => {
        if (v === 'object') {
          const objNode = createObjectAST(schema, level + 1, schema.title || `Option ${optionIndex}`, false);
          objNode.optionIndex = optionIndex++;
          objNode.optionTitle = schema.title || '';
          options.push(objNode);
        } else if (v === 'array') {
          const arrNode = createArrayAST(schema, level + 1, schema.title || `Option ${optionIndex}`, false);
          arrNode.optionIndex = optionIndex++;
          arrNode.optionTitle = schema.title || '';
          options.push(arrNode);
        }
      });

      if (primitiveType.length > 0) {
        subSchema.type = primitiveType.join('┃');
        const primNode = createPrimitiveAST(subSchema, `Option ${optionIndex}`, false);
        primNode.optionIndex = optionIndex++;
        options.push(primNode);
      }

      return {
        kind: 'union',
        operator: 'oneOf',
        name,
        title: schema.title || '',
        description: schema.description || '',
        required: isRequired,
        options,
      };
    }
  }

  // 4. Object
  if (schema.type === 'object' || schema.properties) {
    return createObjectAST(schema, level, name, isRequired);
  }

  // 5. Array
  if (schema.type === 'array' || schema.items) {
    return createArrayAST(schema, level, name, isRequired);
  }

  // 6. Primitive
  return createPrimitiveAST(schema, name, isRequired);
}

/**
 * For changing OpenAPI-Schema to an Object Notation,
 * This Object would further be an input to UI Components to generate an Object-Tree
 * @deprecated Use schemaToAST instead.
 * @param {object} schema - Schema object from OpenAPI spec
 * @param {object} [obj={}] - base object to populate (defaults to new object)
 * @param {number} [level=0] - recursion level
 * @param {string} [suffix=''] - used for suffixing property names to avoid duplicate props during object composition
 */
export function schemaInObjectNotation(schema, obj = {}, level = 0, suffix = '') {
  if (!schema) {
    return;
  }
  if (level > 8) {
    return {
      ...obj,
      '::type': schema.type || 'object',
      '::description': schema.description || '',
    };
  }
  if (schema.allOf) {
    return handleAllOfSchema(schema, obj, level);
  }
  if (schema.anyOf || schema.oneOf) {
    return handleAnyOrOneOfSchema(schema, obj, level, suffix);
  }
  if (Array.isArray(schema.type)) {
    return handleMultiTypeSchema(schema, obj, level);
  }
  if (schema.type === 'object' || schema.properties) {
    return handleObjectSchema(schema, obj, level);
  }
  if (schema.type === 'array' || schema.items) {
    return handleArraySchema(schema, obj, level);
  }
  const typeObj = getTypeInfo(schema);
  if (typeObj?.html) {
    return `${typeObj.html}`;
  }
  return '';
}

/**
 * Helper to consistently format raw example values according to mimeType and outputType.
 */
function formatExampleContent(rawVal, mimeType = '', outputType = 'json') {
  let content = rawVal;
  let format = 'text';

  if (mimeType?.toLowerCase().includes('json')) {
    if (outputType === 'text') {
      content = typeof rawVal === 'string' ? rawVal : JSON.stringify(rawVal, undefined, 2);
      format = 'text';
    } else if (typeof rawVal === 'object' && rawVal !== null) {
      content = rawVal;
      format = 'json';
    } else if (typeof rawVal === 'string') {
      try {
        content = JSON.parse(rawVal);
        format = 'json';
      } catch {
        content = rawVal;
        format = 'text';
      }
    } else {
      content = rawVal;
      format = 'json';
    }
  } else {
    content = typeof rawVal === 'object' && rawVal !== null ? JSON.stringify(rawVal, undefined, 2) : String(rawVal ?? '');
    format = 'text';
  }

  return { content, format };
}

/* Create Example object */
export function generateExample(
  schema,
  mimeType = '',
  examples = null,
  example = null,
  includeReadOnly = true,
  includeWriteOnly = true,
  outputType = 'json',
  includeGeneratedExample = false
) {
  const finalExamples = [];
  const isJson = mimeType?.toLowerCase().includes('json');
  const isXml = mimeType?.toLowerCase().includes('xml');

  // 1. Process multiple examples (examples map)
  if (examples && typeof examples === 'object' && Object.keys(examples).length > 0) {
    for (const eg in examples) {
      const rawVal = examples[eg]?.value !== undefined ? examples[eg].value : examples[eg];
      const { content, format } = formatExampleContent(rawVal, mimeType, outputType);

      finalExamples.push({
        exampleId: eg,
        exampleSummary: examples[eg]?.summary || eg,
        exampleDescription: examples[eg]?.description || '',
        exampleType: mimeType,
        exampleValue: content,
        exampleFormat: format,
      });
    }
  }
  // 2. Process single example (when examples is absent or empty)
  else if (example !== null && example !== undefined && (typeof example !== 'object' || Object.keys(example).length > 0)) {
    const rawVal = example?.value !== undefined ? example.value : example;
    const { content, format } = formatExampleContent(rawVal, mimeType, outputType);

    finalExamples.push({
      exampleId: 'Example',
      exampleSummary: example?.summary || '',
      exampleDescription: example?.description || '',
      exampleType: mimeType,
      exampleValue: content,
      exampleFormat: format,
    });
  }

  // 3. Fallback to schema-level example or schema-generated sample
  if (finalExamples.length === 0 || includeGeneratedExample === true) {
    if (schema) {
      const firstExample = getFirstExample(schema);
      if (firstExample !== undefined && firstExample !== null) {
        const { content, format } = formatExampleContent(firstExample, mimeType, outputType);
        finalExamples.push({
          exampleId: 'Example',
          exampleSummary: '',
          exampleDescription: '',
          exampleType: mimeType,
          exampleValue: content,
          exampleFormat: format,
        });
      } else if (
        isJson ||
        isXml ||
        mimeType?.toLowerCase().includes('text') ||
        mimeType?.toLowerCase().includes('yaml') ||
        mimeType?.toLowerCase().includes('*/*')
      ) {
        let xmlRootStart = '';
        let xmlRootEnd = '';
        let exampleFormat = outputType;

        if (isXml) {
          xmlRootStart = schema.xml?.name
            ? `<${schema.xml.name}${schema.xml.namespace ? ` xmlns="${schema.xml.namespace}"` : ''}>`
            : '<root>';
          xmlRootEnd = schema.xml?.name ? `</${schema.xml.name}>` : '</root>';
          exampleFormat = 'text';
        }

        const samples = schemaToSampleObj(schema, {
          includeReadOnly,
          includeWriteOnly,
          deprecated: true,
          useXmlTagForProp: isXml,
        });

        let i = 0;
        for (const samplesKey in samples) {
          if (!samples[samplesKey]) {
            continue;
          }
          const summary = samples[samplesKey]['::TITLE'] || `Example ${++i}`;
          const description = samples[samplesKey]['::DESCRIPTION'] || '';
          let exampleValue = '';

          if (isXml) {
            exampleValue = `<?xml version="1.0" encoding="UTF-8"?>\n${xmlRootStart}${json2xml(samples[samplesKey], 1)}\n${xmlRootEnd}`;
          } else {
            removeTitlesAndDescriptions(samples[samplesKey]);
            exampleValue = outputType === 'text' ? JSON.stringify(samples[samplesKey], null, 2) : samples[samplesKey];
          }

          finalExamples.push({
            exampleId: samplesKey,
            exampleSummary: summary,
            exampleDescription: description,
            exampleType: mimeType,
            exampleFormat,
            exampleValue,
          });
        }
      } else if (mimeType?.toLowerCase().includes('jose')) {
        finalExamples.push({
          exampleId: 'Example',
          exampleSummary: 'Base64 Encoded',
          exampleDescription: '',
          exampleType: mimeType,
          exampleValue: schema.pattern || 'bXJpbg==',
          exampleFormat: 'text',
        });
      } else {
        finalExamples.push({
          exampleId: 'Example',
          exampleSummary: '',
          exampleDescription: '',
          exampleType: mimeType,
          exampleValue: '',
          exampleFormat: 'text',
        });
      }
    } else {
      // No Example or Schema provided
      finalExamples.push({
        exampleId: 'Example',
        exampleSummary: '',
        exampleDescription: '',
        exampleType: mimeType,
        exampleValue: '',
        exampleFormat: 'text',
      });
    }
  }

  return finalExamples;
}

function getSerializeStyleForContentType(contentType) {
  if (contentType === 'application/json') {
    return 'json';
  }
  if (contentType === 'application/xml') {
    return 'xml';
  }
  return null;
}

export function getSchemaFromParam(param) {
  if (param.schema) {
    return [param.schema, null, null];
  }
  if (param.content) {
    // we gonna use the first content-encoding
    for (const contentType of Object.keys(param.content)) {
      if (param.content[contentType].schema) {
        return [param.content[contentType].schema, getSerializeStyleForContentType(contentType), param.content[contentType]];
      }
    }
  }
  return [null, null, null];
}
