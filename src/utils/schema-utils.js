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
    dataType = Array.isArray(schema.type) ? schema.type.join(schema.length === 2 ? ' or ' : '┃') : schema.type;
    if (schema.format || schema.enum) {
      dataType = dataType.replace('string', schema.enum ? 'enum' : schema.format);
    }
    if (schema.nullable) {
      dataType += '┃null';
    }
  } else if (Object.keys(schema).length === 0) {
    dataType = 'any';
  } else {
    dataType = '{missing-type-info}';
  }

  const info = {
    type: dataType,
    format: schema.format || '',
    pattern: (schema.pattern && !schema.enum) ? schema.pattern : '',
    readOrWriteOnly: (schema.readOnly ? '🆁' : schema.writeOnly ? '🆆' : ''),
    deprecated: schema.deprecated ? '❌' : '',
    examples: schema.examples || schema.example,
    default: schema.default != null ? `${schema.default}` : '',
    description: schema.description || '',
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
  info.allowedValues = Array.isArray(schema.enum) ? schema.enum.join('┃') : '';
  if (dataType === 'array' && schema.items) {
    const arrayItemType = schema.items?.type;
    const arrayItemDefault = schema.items?.default !== undefined ? schema.items.default : '';

    info.arrayType = `${schema.type} of ${Array.isArray(arrayItemType) ? arrayItemType.join('') : arrayItemType}`;
    info.default = arrayItemDefault;
    info.allowedValues = Array.isArray(schema.items?.enum) ? schema.items.enum.join('┃') : '';
  }
  if (dataType.match(/integer|number/g)) {
    if (schema.minimum !== undefined || schema.exclusiveMinimum !== undefined) {
      constrain += schema.minimum !== undefined ? `Min ${schema.minimum}` : `More than ${schema.exclusiveMinimum}`;
    }
    if (schema.maximum !== undefined || schema.exclusiveMaximum !== undefined) {
      constrain += schema.maximum !== undefined ? `${constrain ? '┃' : ''}Max ${schema.maximum}` : `${constrain ? '┃' : ''}Less than ${schema.exclusiveMaximum}`;
    }
    if (schema.multipleOf !== undefined) {
      constrain += `${constrain ? '┃' : ''} multiple of ${schema.multipleOf}`;
    }
  }
  if (dataType.match(/string/g)) {
    if (schema.minLength !== undefined && schema.maxLength !== undefined) {
      constrain += `${constrain ? '┃' : ''}${schema.minLength} to ${schema.maxLength} chars`;
    } else if (schema.minLength !== undefined) {
      constrain += `${constrain ? '┃' : ''}Min ${schema.minLength} chars`;
    } else if (schema.maxLength !== undefined) {
      constrain += `Max ${constrain ? '┃' : ''}${schema.maxLength} chars`;
    }
  }
  info.constrain = constrain;
  info.html = `${info.type}~|~${info.readOrWriteOnly}~|~${info.constrain}~|~${info.default}~|~${info.allowedValues}~|~${info.pattern}~|~${info.description}~|~${schema.title || ''}~|~${info.deprecated ? 'deprecated' : ''}`;
  return info;
}
export function nestExampleIfPresent(example) {
  if (typeof example === 'boolean') {
    return {
      Example: { value: `${example}` },
    };
  }
  if (example === '') {
    return {
      Example: { value: '' },
    };
  }
  return example ? { Example: { value: example } } : example;
}

export function normalizeExamples(examples, dataType = 'string') {
  if (!examples) {
    return {
      exampleVal: '',
      exampleList: [],
    };
  }

  if (examples.constructor === Object) {
    const exampleValAndDescr = Object.values(examples);
    const exampleVal = exampleValAndDescr.length > 0
      ? typeof exampleValAndDescr[0].value === 'boolean' || typeof exampleValAndDescr[0].value === 'number'
        ? exampleValAndDescr[0].value.toString()
        : exampleValAndDescr[0].value
      : '';
    const exampleList = Object.values(examples).map((v) => ({
      value: typeof v.value === 'boolean' || typeof v.value === 'number' ? v.value.toString() : v.value,
      summary: v.summary,
      description: v.description,
    }));
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
    const exampleList = examples.map((v) => ({ value: v }));
    return { exampleVal, exampleList };
  }

  const exampleVal = examples[0].toString();
  const exampleList = examples.map((v) => ({ value: v.toString() }));
  return { exampleVal, exampleList };
}

export function anyExampleWithSummaryOrDescription(examples) {
  return examples.some((x) => x.summary?.length > 0 || x.description?.length > 0);
}

export function getSampleValueByType(schemaObj) {
  const example = schemaObj.examples
    ? schemaObj.examples[0]
    : schemaObj.example === null
      ? null
      : schemaObj.example || undefined;
  if (example === '') { return ''; }
  if (example === null) { return null; }
  if (example === 0) { return 0; }
  if (example) { return example; }

  if (Object.keys(schemaObj).length === 0) {
    return null;
  }
  if (schemaObj.$ref) {
    // Indicates a Circular ref
    return schemaObj.$ref;
  }
  const typeValue = Array.isArray(schemaObj.type) ? schemaObj.type[0] : schemaObj.type;
  if (!typeValue) {
    return '?';
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
  if (typeValue.match(/^boolean/g)) { return false; }
  if (typeValue.match(/^null/g)) { return null; }
  if (typeValue.match(/^string/g)) {
    if (schemaObj.enum) { return schemaObj.enum[0]; }
    if (schemaObj.pattern) { return schemaObj.pattern; }
    if (schemaObj.format) {
      const u = `${Date.now().toString(16)}${Math.random().toString(16)}0`.repeat(16);
      switch (schemaObj.format.toLowerCase()) {
        case 'url':
        case 'uri':
          return 'http://example.com';
        case 'date':
          return (new Date(0)).toISOString().split('T')[0];
        case 'time':
          return (new Date(0)).toISOString().split('T')[1];
        case 'date-time':
          return (new Date(0)).toISOString();
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
          return [u.substr(0, 8), u.substr(8, 4), `4000-8${u.substr(13, 3)}`, u.substr(16, 12)].join('-');
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
  return '?';
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
      <0> a </0>
      <1> b </1>
      <2> c </2>
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
    if (Array.isArray(obj[prop])) {
      xmlText = `${xmlText}\n${indent}<${prop}> ${json2xml(obj[prop], level + 1)}\n${indent}</${prop}>`;
    } else if (typeof obj[prop] === 'object') {
      xmlText = `${xmlText}\n${indent}<${prop}> ${json2xml(obj[prop], level + 1)}\n${indent}</${prop}>`;
    } else {
      xmlText = `${xmlText}\n${indent}<${prop}> ${obj[prop].toString()} </${prop}>`;
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
}

function removeTitlesAndDescriptions(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return;
  }
  delete obj['::TITLE'];
  delete obj['::DESCRIPTION'];
  for (const k in obj) {
    removeTitlesAndDescriptions(obj[k]);
  }
}

function addPropertyExampleToObjectExamples(example, obj, propertyKey) {
  for (const key in obj) {
    obj[key][propertyKey] = example;
  }
}

function mergePropertyExamples(obj, propertyName, propExamples) {
  // Create an example for each variant of the propertyExample, merging them with the current (parent) example
  let i = 0;
  const maxCombinations = 10;
  const mergedObj = {};
  for (const exampleKey in obj) {
    for (const propExampleKey in propExamples) {
      mergedObj[`example-${i}`] = { ...obj[exampleKey] };
      mergedObj[`example-${i}`][propertyName] = propExamples[propExampleKey];
      i++;
      if (i >= maxCombinations) {
        break;
      }
    }
    if (i >= maxCombinations) {
      break;
    }
  }
  return mergedObj;
}

/* For changing JSON-Schema to a Sample Object, as per the schema (to generate examples based on schema) */
export function schemaToSampleObj(schema, config = { }) {
  let obj = {};
  if (!schema) {
    return;
  }

  if (schema.allOf) {
    const objWithAllProps = {};

    if (schema.allOf.length === 1 && !schema.allOf[0].properties && !schema.allOf[0].items) {
      // If allOf has single item and the type is not an object or array, then its a primitive
      if (schema.allOf[0].$ref) {
        return '{  }';
      }
      if (schema.allOf[0].readOnly && config.includeReadOnly) {
        const tempSchema = schema.allOf[0];
        return getSampleValueByType(tempSchema);
      }
      return;
    }

    schema.allOf.forEach((v) => {
      if (v.type === 'object' || v.properties || v.allOf || v.anyOf || v.oneOf) {
        const partialObj = schemaToSampleObj(v, config);
        Object.assign(objWithAllProps, partialObj);
      } else if (v.type === 'array' || v.items) {
        const partialObj = [schemaToSampleObj(v, config)];
        Object.assign(objWithAllProps, partialObj);
      } else if (v.type) {
        const prop = `prop${Object.keys(objWithAllProps).length}`;
        objWithAllProps[prop] = getSampleValueByType(v);
      } else {
        return '';
      }
    });

    obj = objWithAllProps;
  } else if (schema.oneOf) {
    // 1. First create example with scheme.properties
    const objWithSchemaProps = {};
    if (schema.properties) {
      for (const propertyName in schema.properties) {
        objWithSchemaProps[propertyName] = getSampleValueByType(schema.properties[propertyName]);
      }
    }

    if (schema.oneOf.length > 0) {
      /*
      oneOf:
        - type: object
          properties:
            option1_PropA:
              type: string
            option1_PropB:
              type: string
        - type: object
          properties:
            option2_PropX:
              type: string
      properties:
        prop1:
          type: string
        prop2:
          type: string
          minLength: 10

      The aboove Schem should generate the following 2 examples

      Example-1
      {
        prop1: 'string',
        prop2: 'AAAAAAAAAA',       <-- min-length 10
        option1_PropA: 'string',
        option1_PropB: 'string'
      }

      Example-2
      {
        prop1: 'string',
        prop2: 'AAAAAAAAAA',       <-- min-length 10
        option2_PropX: 'string'
      }
      */
      let i = 0;
      // Merge all examples of each oneOf-schema
      for (const key in schema.oneOf) {
        const oneOfSamples = schemaToSampleObj(schema.oneOf[key], config);
        for (const sampleKey in oneOfSamples) {
          // 2. In the final example include a one-of item along with properties
          let finalExample;
          if (Object.keys(objWithSchemaProps).length > 0) {
            if (oneOfSamples[sampleKey] === null || typeof oneOfSamples[sampleKey] !== 'object') {
              // This doesn't really make sense since every oneOf schema _should_ be an object if there are common properties, so we'll skip this
              continue;
            } else {
              finalExample = Object.assign(oneOfSamples[sampleKey], objWithSchemaProps);
            }
          } else {
            finalExample = oneOfSamples[sampleKey];
          }
          obj[`example-${i}`] = finalExample;
          addSchemaInfoToExample(schema.oneOf[key], obj[`example-${i}`]);
          i++;
        }
      }
    }
  } else if (schema.anyOf) {
    // First generate values for regular properties
    let commonObj;
    if (schema.type === 'object' || schema.properties) {
      commonObj = { 'example-0': {} };
      for (const propertyName in schema.properties) {
        if (schema.example) {
          commonObj = schema;
          break;
        }
        if (schema.properties[propertyName].deprecated && !config.includeDeprecated) { continue; }
        if (schema.properties[propertyName].readOnly && !config.includeReadOnly) { continue; }
        if (schema.properties[propertyName].writeOnly && !config.includeWriteOnly) { continue; }
        commonObj = mergePropertyExamples(commonObj, propertyName, schemaToSampleObj(schema.properties[propertyName], config));
      }
    }

    // Combine every variant of the regular properties with every variant of the anyOf samples
    let i = 0;
    for (const key in schema.anyOf) {
      const anyOfSamples = schemaToSampleObj(schema.anyOf[key], config);
      for (const sampleKey in anyOfSamples) {
        if (typeof commonObj !== 'undefined') {
          for (const commonKey in commonObj) {
            obj[`example-${i}`] = { ...commonObj[commonKey], ...anyOfSamples[sampleKey] };
          }
        } else {
          obj[`example-${i}`] = anyOfSamples[sampleKey];
        }
        addSchemaInfoToExample(schema.anyOf[key], obj[`example-${i}`]);
        i++;
      }
    }
  } else if (schema.type === 'object' || schema.properties) {
    obj['example-0'] = {};
    addSchemaInfoToExample(schema, obj['example-0']);
    if (schema.example) {
      obj['example-0'] = schema.example;
    } else {
      for (const propertyName in schema.properties) {
        if (schema.properties[propertyName]?.deprecated && !config.includeDeprecated) { continue; }
        if (schema.properties[propertyName]?.readOnly && !config.includeReadOnly) { continue; }
        if (schema.properties[propertyName]?.writeOnly && !config.includeWriteOnly) { continue; }
        if (schema.properties[propertyName]?.type === 'array' || schema.properties[propertyName]?.items) {
          if (schema.properties[propertyName].example) {
            addPropertyExampleToObjectExamples(schema.properties[propertyName].example, obj, propertyName);
          } else if (schema.properties[propertyName]?.items?.example) { // schemas and properties support single example but not multiple examples.
            addPropertyExampleToObjectExamples([schema.properties[propertyName].items.example], obj, propertyName);
          } else {
            const itemSamples = schemaToSampleObj(schema.properties[propertyName].items, config);
            const arraySamples = [];
            for (const key in itemSamples) {
              arraySamples[key] = [itemSamples[key]];
            }
            obj = mergePropertyExamples(obj, propertyName, arraySamples);
          }
          continue;
        }
        obj = mergePropertyExamples(obj, propertyName, schemaToSampleObj(schema.properties[propertyName], config));
      }
    }
  } else if (schema.type === 'array' || schema.items) {
    if (schema.items || schema.example) {
      if (schema.example) {
        obj['example-0'] = schema.example;
      } else if (schema.items?.example) { // schemas and properties support single example but not multiple examples.
        obj['example-0'] = [schema.items.example];
      } else {
        const samples = schemaToSampleObj(schema.items, config);
        let i = 0;
        for (const key in samples) {
          obj[`example-${i}`] = [samples[key]];
          addSchemaInfoToExample(schema.items, obj[`example-${i}`]);
          i++;
        }
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
  let markdown = '';
  if (schema.title) {
    markdown = `**${schema.title}:** `;
  }
  if (schema.description) {
    markdown = `${markdown} ${schema.description} ${schema.minItems || schema.maxItems ? '<span class="more-content">⤵</span><br/>' : ''}`;
  }
  if (schema.minItems) {
    markdown = `${markdown} **Min Items:** ${schema.minItems}`;
  }
  if (schema.maxItems) {
    markdown = `${markdown} **Max Items:** ${schema.maxItems}`;
  }
  if (level > 0 && schema.items?.description) {
    let itemsMarkdown = '';
    if (schema.items.minProperties) {
      itemsMarkdown = `**Min Properties:** ${schema.items.minProperties}`;
    }
    if (schema.items.maxProperties) {
      itemsMarkdown = `${itemsMarkdown} **Max Properties:** ${schema.items.maxProperties}`;
    }
    markdown = `${markdown} ⮕ ${itemsMarkdown} [ ${schema.items.description} ] `;
  }
  return markdown;
}
/**
 * For changing OpenAPI-Schema to an Object Notation,
 * This Object would further be an input to UI Components to generate an Object-Tree
 * @param {object} schema - Schema object from OpenAPI spec
 * @param {object} obj - recursivly pass this object to generate object notation
 * @param {number} level - recursion level
 * @param {string} suffix - used for suffixing property names to avoid duplicate props during object composion
 */
export function schemaInObjectNotation(schema, obj, level = 0, suffix = '') {
  if (!schema) {
    return;
  }
  if (schema.allOf) {
    const objWithAllProps = {};
    if (schema.allOf.length === 1 && !schema.allOf[0].properties && !schema.allOf[0].items) {
      // If allOf has single item and the type is not an object or array, then its a primitive
      const tempSchema = schema.allOf[0];
      return `${getTypeInfo(tempSchema).html}`;
    }
    // If allOf is an array of multiple elements, then all the keys makes a single object
    schema.allOf.map((v, i) => {
      if (v.type === 'object' || v.properties || v.allOf || v.anyOf || v.oneOf) {
        const propSuffix = (v.anyOf || v.oneOf) && i > 0 ? i : '';
        const partialObj = schemaInObjectNotation(v, {}, (level + 1), propSuffix);
        Object.assign(objWithAllProps, partialObj);
      } else if (v.type === 'array' || v.items) {
        const partialObj = schemaInObjectNotation(v, {}, (level + 1));
        Object.assign(objWithAllProps, partialObj);
      } else if (v.type) {
        const prop = `prop${Object.keys(objWithAllProps).length}`;
        const typeObj = getTypeInfo(v);
        objWithAllProps[prop] = `${typeObj.html}`;
      } else {
        return '';
      }
    });
    obj = objWithAllProps;
  } else if (schema.anyOf || schema.oneOf) {
    obj['::description'] = schema.description || '';
    // 1. First iterate the regular properties
    if (schema.type === 'object' || schema.properties) {
      obj['::description'] = schema.description || '';
      obj['::type'] = 'object';
      // obj['::deprecated'] = schema.deprecated || false;
      for (const key in schema.properties) {
        if (schema.required && schema.required.includes(key)) {
          obj[`${key}*`] = schemaInObjectNotation(schema.properties[key], {}, (level + 1));
        } else {
          obj[key] = schemaInObjectNotation(schema.properties[key], {}, (level + 1));
        }
      }
    }
    // 2. Then show allof/anyof objects
    const objWithAnyOfProps = {};
    const xxxOf = schema.anyOf ? 'anyOf' : 'oneOf';
    schema[xxxOf].forEach((v, index) => {
      if (v.type === 'object' || v.properties || v.allOf || v.anyOf || v.oneOf) {
        const partialObj = schemaInObjectNotation(v, {});
        objWithAnyOfProps[`::OPTION~${index + 1}${v.title ? `~${v.title}` : ''}`] = partialObj;
        objWithAnyOfProps['::type'] = 'xxx-of-option';
      } else if (v.type === 'array' || v.items) {
        // This else-if block never seems to get executed
        const partialObj = schemaInObjectNotation(v, {});
        objWithAnyOfProps[`::OPTION~${index + 1}${v.title ? `~${v.title}` : ''}`] = partialObj;
        objWithAnyOfProps['::type'] = 'xxx-of-array';
      } else {
        const prop = `::OPTION~${index + 1}${v.title ? `~${v.title}` : ''}`;
        objWithAnyOfProps[prop] = `${getTypeInfo(v).html}`;
        objWithAnyOfProps['::type'] = 'xxx-of-option';
      }
    });
    obj[(schema.anyOf ? `::ANY~OF ${suffix}` : `::ONE~OF ${suffix}`)] = objWithAnyOfProps;
    obj['::type'] = 'xxx-of';
  } else if (Array.isArray(schema.type)) {
    // When a property has multiple types, then check further if any of the types are array or object, if yes then modify the schema using one-of
    // Clone the schema - as it will be modified to replace multi-data-types with one-of;
    const subSchema = JSON.parse(JSON.stringify(schema));
    const primitiveType = [];
    const complexTypes = [];
    subSchema.type.forEach((v) => {
      if (v.match(/integer|number|string|null|boolean/g)) {
        primitiveType.push(v);
      } else if (v === 'array' && typeof subSchema.items?.type === 'string' && subSchema.items?.type.match(/integer|number|string|null|boolean/g)) {
        // Array with primitive types should also be treated as primitive type
        if (subSchema.items.type === 'string' && subSchema.items.format) {
          primitiveType.push(`[${subSchema.items.format}]`);
        } else {
          primitiveType.push(`[${subSchema.items.type}]`);
        }
      } else {
        complexTypes.push(v);
      }
    });
    let multiPrimitiveTypes;
    if (primitiveType.length > 0) {
      subSchema.type = primitiveType.join(primitiveType.length === 2 ? ' or ' : '┃');
      multiPrimitiveTypes = getTypeInfo(subSchema);
      if (complexTypes.length === 0) {
        return `${multiPrimitiveTypes?.html || ''}`;
      }
    }
    if (complexTypes.length > 0) {
      obj['::type'] = 'xxx-of';
      const multiTypeOptions = {
        '::type': 'xxx-of-option',
      };

      // Generate ONE-OF options for complexTypes
      complexTypes.forEach((v, i) => {
        if (v === 'null') {
          multiTypeOptions[`::OPTION~${i + 1}`] = 'NULL~|~~|~~|~~|~~|~~|~~|~~|~';
        } else if ('integer, number, string, boolean,'.includes(`${v},`)) {
          subSchema.type = Array.isArray(v) ? v.join('┃') : v;
          const primitiveTypeInfo = getTypeInfo(subSchema);
          multiTypeOptions[`::OPTION~${i + 1}`] = primitiveTypeInfo.html;
        } else if (v === 'object') {
          // If object type iterate all the properties and create an object-type-option
          const objTypeOption = {
            '::title': schema.title || '',
            '::description': schema.description || '',
            '::type': 'object',
            '::deprecated': schema.deprecated || false,
          };
          for (const key in schema.properties) {
            if (schema.required && schema.required.includes(key)) {
              objTypeOption[`${key}*`] = schemaInObjectNotation(schema.properties[key], {}, (level + 1));
            } else {
              objTypeOption[key] = schemaInObjectNotation(schema.properties[key], {}, (level + 1));
            }
          }
          multiTypeOptions[`::OPTION~${i + 1}`] = objTypeOption;
        } else if (v === 'array') {
          multiTypeOptions[`::OPTION~${i + 1}`] = {
            '::title': schema.title || '',
            '::description': schema.description || '',
            '::type': 'array',
            '::props': schemaInObjectNotation(schema.items, {}, (level + 1)),
          };
        }
      });
      multiTypeOptions[`::OPTION~${complexTypes.length + 1}`] = multiPrimitiveTypes?.html || '';
      obj['::ONE~OF'] = multiTypeOptions;
    }
  } else if (schema.type === 'object' || schema.properties) { // If Object
    obj['::title'] = schema.title || '';
    obj['::description'] = generateMarkdownForArrayAndObjectDescription(schema, level);
    obj['::type'] = 'object';
    if ((Array.isArray(schema.type) && schema.type.includes('null')) || schema.nullable) {
      obj['::dataTypeLabel'] = 'object or null';
    }
    obj['::deprecated'] = schema.deprecated || false;
    obj['::readwrite'] = schema.readOnly ? 'readonly' : schema.writeOnly ? 'writeonly' : '';
    for (const key in schema.properties) {
      if (schema.required && schema.required.includes(key)) {
        obj[`${key}*`] = schemaInObjectNotation(schema.properties[key], {}, (level + 1));
      } else {
        obj[key] = schemaInObjectNotation(schema.properties[key], {}, (level + 1));
      }
    }
    if (schema.additionalProperties) {
      obj['<any-key>'] = schemaInObjectNotation(schema.additionalProperties, {});
    }
  } else if (schema.type === 'array' || schema.items) { // If Array
    obj['::title'] = schema.title || '';
    obj['::description'] = generateMarkdownForArrayAndObjectDescription(schema, level);
    obj['::type'] = 'array';
    if ((Array.isArray(schema.type) && schema.type.includes('null')) || schema.nullable) {
      obj['::dataTypeLabel'] = 'array or null';
    }
    obj['::deprecated'] = schema.deprecated || false;
    obj['::readwrite'] = schema.readOnly ? 'readonly' : schema.writeOnly ? 'writeonly' : '';
    if (schema.items?.items) {
      obj['::array-type'] = schema.items.items.type;
    }
    obj['::props'] = schemaInObjectNotation(schema.items, {}, (level + 1));
  } else {
    const typeObj = getTypeInfo(schema);
    if (typeObj?.html) {
      return `${typeObj.html}`;
    }
    return '';
  }
  return obj;
}

/* Create Example object */
export function generateExample(schema, mimeType, examples = '', example = '', includeReadOnly = true, includeWriteOnly = true, outputType = 'json', includeGeneratedExample = false) {
  const finalExamples = [];
  // First check if examples is provided
  if (examples) {
    for (const eg in examples) {
      let egContent = '';
      let egFormat = 'json';
      if (mimeType?.toLowerCase().includes('json')) {
        if (outputType === 'text') {
          egContent = typeof examples[eg].value === 'string' ? examples[eg].value : JSON.stringify(examples[eg].value, undefined, 2);
          egFormat = 'text';
        } else {
          egContent = examples[eg].value;
          if (typeof examples[eg].value === 'string') {
            try {
              const fixedJsonString = examples[eg].value.replace((/([\w]+)(:)/g), '"$1"$2').replace((/'/g), '"');
              egContent = JSON.parse(fixedJsonString);
              egFormat = 'json';
            } catch (err) {
              egFormat = 'text';
              egContent = examples[eg].value;
            }
          }
        }
      } else {
        egContent = examples[eg].value;
        egFormat = 'text';
      }

      finalExamples.push({
        exampleId: eg,
        exampleSummary: examples[eg].summary || eg,
        exampleDescription: examples[eg].description || '',
        exampleType: mimeType,
        exampleValue: egContent,
        exampleFormat: egFormat,
      });
    }
  } else if (example) {
    let egContent = '';
    let egFormat = 'json';
    if (mimeType?.toLowerCase().includes('json')) {
      if (outputType === 'text') {
        egContent = typeof example === 'string' ? example : JSON.stringify(example, undefined, 2);
        egFormat = 'text';
      } else if (typeof example === 'object') {
        egContent = example;
        egFormat = 'json';
      } else if (typeof example === 'string') {
        try {
          egContent = JSON.parse(example);
          egFormat = 'json';
        } catch (err) {
          egFormat = 'text';
          egContent = example;
        }
      }
    } else {
      egContent = example;
      egFormat = 'text';
    }
    finalExamples.push({
      exampleId: 'Example',
      exampleSummary: '',
      exampleDescription: '',
      exampleType: mimeType,
      exampleValue: egContent,
      exampleFormat: egFormat,
    });
  }
  // If schema-level examples are not provided or includeGeneratedExample === true then generate one based on the schema field types
  if (finalExamples.length === 0 || includeGeneratedExample === true) {
    if (schema) {
      if (schema.example) { // Note: schema.examples (plurals) is not allowed as per spec
        finalExamples.push({
          exampleId: 'Example',
          exampleSummary: '',
          exampleDescription: '',
          exampleType: mimeType,
          exampleValue: schema.example,
          exampleFormat: ((mimeType?.toLowerCase().includes('json') && typeof schema.example === 'object') ? 'json' : 'text'),
        });
      } else if (mimeType?.toLowerCase().includes('json') || mimeType?.toLowerCase().includes('text') || mimeType?.toLowerCase().includes('*/*') || mimeType?.toLowerCase().includes('xml')) {
        let xmlRootStart = '';
        let xmlRootEnd = '';
        let exampleFormat = '';
        let exampleValue = '';
        if (mimeType?.toLowerCase().includes('xml')) {
          xmlRootStart = (schema.xml && schema.xml.name) ? `<${schema.xml.name}>` : '<root>';
          xmlRootEnd = (schema.xml && schema.xml.name) ? `</${schema.xml.name}>` : '</root>';
          exampleFormat = 'text';
        } else {
          exampleFormat = outputType;
        }

        const samples = schemaToSampleObj(
          schema,
          {
            includeReadOnly,
            includeWriteOnly,
            deprecated: true,
          },
        );

        let i = 0;
        for (const samplesKey in samples) {
          if (!samples[samplesKey]) {
            continue;
          }
          const summary = samples[samplesKey]['::TITLE'] || `Example ${++i}`;
          const description = samples[samplesKey]['::DESCRIPTION'] || '';
          removeTitlesAndDescriptions(samples[samplesKey]);

          if (mimeType?.toLowerCase().includes('xml')) {
            exampleValue = `${xmlRootStart}${json2xml(samples[samplesKey])}\n${xmlRootEnd}`;
          } else {
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
      // No Example or Schema provided (should never reach here)
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
