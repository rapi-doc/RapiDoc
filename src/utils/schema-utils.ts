import type {
  RapiDocExamples,
  RapiDocObj,
  RapiDocSchema,
} from '@rapidoc-types';
import type { OpenAPIV3 } from 'openapi-types';

// Takes a value as input and provides a printable string to represent null values, spaces, blank string etc
export function getPrintableVal(val: unknown) {
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
      .map((v) =>
        v === null
          ? 'null'
          : v === ''
          ? '∅'
          : v
              .toString()
              .replace(/^ +| +$/g, (m: string) => '●'.repeat(m.length)) || ''
      )
      .join(', ');
  }
  if (typeof val === 'object') {
    const keys = Object.keys(val);
    return `{ ${keys[0]}:${(val as any)[keys[0]]}${
      keys.length > 1 ? ',' : ''
    } ... }`;
  }
  return (
    val.toString().replace(/^ +| +$/g, (m: string) => '●'.repeat(m.length)) ||
    ''
  );
}

/* Generates an schema object containing type and constraint info */
export function getTypeInfo(schema: OpenAPIV3.ReferenceObject | RapiDocSchema) {
  if (!schema) {
    return;
  }
  let dataType = '';
  let constrain = '';
  // let examples;

  const isRefSchema = '$ref' in schema;

  if (isRefSchema) {
    const n = schema.$ref.lastIndexOf('/');
    const schemaNode = schema.$ref.substring(n + 1);
    dataType = `{recursive: ${schemaNode}} `;
  } else if (schema.type) {
    dataType = Array.isArray(schema.type)
      ? schema.type.join(schema.length === 2 ? ' or ' : '┃')
      : schema.type;
    if (schema.format || schema.enum || schema.const) {
      dataType = dataType.replace(
        'string',
        schema.enum ? 'enum' : schema.const ? 'const' : schema.format || ''
      );
    }
    if (schema.nullable) {
      dataType += '┃null';
    }
  } else if (schema.const) {
    dataType = 'const';
  } else if (Object.keys(schema).length === 0) {
    dataType = 'any';
  } else {
    dataType = '{missing-type-info}';
  }

  const info: {
    type: string;
    format: string;
    pattern: string;
    readOrWriteOnly: string;
    deprecated: string;
    examples?: {
      [media: string]: OpenAPIV3.ReferenceObject | OpenAPIV3.ExampleObject;
    };
    example?: any;
    default: string;
    description: string;
    constrain: string;
    allowedValues?: string | number | boolean | undefined;
    arrayType: string;
    html: string;
  } = {
    type: dataType,
    format: isRefSchema ? '' : schema.format || '',
    pattern: isRefSchema
      ? ''
      : schema.pattern && !schema.enum
      ? schema.pattern
      : '',
    readOrWriteOnly: isRefSchema
      ? ''
      : schema.readOnly
      ? '🆁'
      : schema.writeOnly
      ? '🆆'
      : '',
    deprecated: isRefSchema ? '' : schema.deprecated ? '❌' : '',
    examples: isRefSchema ? '' : schema.examples || schema.example,
    default: isRefSchema ? '' : getPrintableVal(schema.default),
    description: isRefSchema ? '' : schema.description || '',
    constrain: '',
    allowedValues: '',
    arrayType: '',
    html: '',
  };

  if (isRefSchema) {
    info.description = schema.$ref.substring(schema.$ref.lastIndexOf('/') + 1);
  } else if (info.type === '{missing-type-info}' || info.type === 'any') {
    info.description = info.description || '';
  }

  if (!isRefSchema) {
    // Set Allowed Values
    info.allowedValues = schema.const
      ? schema.const
      : Array.isArray(schema.enum)
      ? schema.enum.map((v) => getPrintableVal(v)).join('┃')
      : '';
  }

  if (dataType === 'array' && 'items' in schema) {
    const schemaItems = schema.items;
    if (schemaItems) {
      const arrayItemType = 'type' in schemaItems && schemaItems?.type;
      const arrayItemDefault = getPrintableVal(
        'default' in schemaItems && schemaItems.default
      );

      info.arrayType = `${schema.type} of ${
        Array.isArray(arrayItemType) ? arrayItemType.join('') : arrayItemType
      }`;
      info.default = arrayItemDefault;
      info.allowedValues =
        'const' in schemaItems && schemaItems.const
          ? schema.const
          : 'enum' in schemaItems && Array.isArray(schemaItems?.enum)
          ? schemaItems.enum.map((v) => getPrintableVal(v)).join('┃')
          : '';
    }
  }

  if (dataType.match(/integer|number/g)) {
    if (
      ('minimum' in schema && schema.minimum !== undefined) ||
      ('exclusiveMinimum' in schema && schema.exclusiveMinimum !== undefined)
    ) {
      constrain +=
        schema.minimum !== undefined
          ? `Min ${schema.minimum}`
          : `More than ${schema.exclusiveMinimum}`;
    }
    if (
      ('maximum' in schema && schema.maximum !== undefined) ||
      ('exclusiveMaximum' in schema && schema.exclusiveMaximum !== undefined)
    ) {
      constrain +=
        schema.maximum !== undefined
          ? `${constrain ? '┃' : ''}Max ${schema.maximum}`
          : `${constrain ? '┃' : ''}Less than ${schema.exclusiveMaximum}`;
    }
    if ('multipleOf' in schema && schema.multipleOf !== undefined) {
      constrain += `${constrain ? '┃' : ''} multiple of ${schema.multipleOf}`;
    }
  }
  if (dataType.match(/string/g)) {
    if (
      'minLength' in schema &&
      schema.minLength !== undefined &&
      'maxLength' in schema &&
      schema.maxLength !== undefined
    ) {
      constrain += `${constrain ? '┃' : ''}${schema.minLength} to ${
        schema.maxLength
      } chars`;
    } else if ('minLength' in schema && schema.minLength !== undefined) {
      constrain += `${constrain ? '┃' : ''}Min ${schema.minLength} chars`;
    } else if ('maxLength' in schema && schema.maxLength !== undefined) {
      constrain += `Max ${constrain ? '┃' : ''}${schema.maxLength} chars`;
    }
  }
  info.constrain = constrain;
  info.html = `${info.type}~|~${info.readOrWriteOnly}~|~${info.constrain}~|~${
    info.default
  }~|~${info.allowedValues}~|~${info.pattern}~|~${info.description}~|~${
    ('title' in schema && schema.title) || ''
  }~|~${info.deprecated ? 'deprecated' : ''}`;
  return info;
}

export function nestExampleIfPresent(
  example?: boolean | number | string | undefined | any
) {
  if (typeof example === 'boolean' || typeof example === 'number') {
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

export interface NormalizedExample {
  value: string | OpenAPIV3.ExampleObject;
  printableValue: string;
  summary?: string;
  description?: string;
}

export interface NormalizedExamples {
  exampleVal: string | OpenAPIV3.ExampleObject;
  exampleList: NormalizedExample[];
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
export function normalizeExamples(
  examples:
    | OpenAPIV3.MediaTypeObject['example']
    | OpenAPIV3.MediaTypeObject['examples'],
  dataType = 'string'
): NormalizedExamples {
  if (!examples) {
    return {
      exampleVal: '',
      exampleList: [],
    };
  }
  if (examples.constructor === Object) {
    const exampleList = Object.values(examples as OpenAPIV3.ExampleObject)
      .filter((v) => v['x-example-show-value'] !== false)
      .map((v) => ({
        value:
          typeof v.value === 'boolean' || typeof v.value === 'number'
            ? `${v.value}`
            : v.value || '',
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
    const exampleList = examples.map((v: OpenAPIV3.ExampleObject) => ({
      value: v,
      printableValue: getPrintableVal(v),
    }));
    return { exampleVal, exampleList };
  }

  const exampleVal = examples[0].toString();
  const exampleList = examples.map((v: OpenAPIV3.ExampleObject) => ({
    value: v.toString(),
    printableValue: getPrintableVal(v),
  }));
  return { exampleVal, exampleList };
}

export function anyExampleWithSummaryOrDescription(
  examples: OpenAPIV3.ExampleObject[]
) {
  return examples.some(
    (x) => (x.summary?.length || 0) > 0 || (x.description?.length || 0) > 0
  );
}

export function getSampleValueByType(schemaObj: RapiDocSchema) {
  const example = schemaObj.examples
    ? schemaObj.examples[0]
    : schemaObj.example === null
    ? null
    : schemaObj.example || undefined;
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
    switch (schemaObj.format?.toLowerCase()) {
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
  if ('$ref' in schemaObj) {
    // Indicates a Circular ref
    return schemaObj.$ref;
  }
  if (
    schemaObj.const === false ||
    schemaObj.const === 0 ||
    schemaObj.const === null ||
    schemaObj.const === ''
  ) {
    return schemaObj.const;
  }
  if (schemaObj.const) {
    return schemaObj.const;
  }
  const typeValue = Array.isArray(schemaObj.type)
    ? schemaObj.type[0]
    : schemaObj.type;
  if (!typeValue) {
    return '?';
  }
  if (typeValue.match(/^integer|^number/g)) {
    const multipleOf = Number.isNaN(Number(schemaObj.multipleOf))
      ? undefined
      : Number(schemaObj.multipleOf);
    const maximum = Number.isNaN(Number(schemaObj.maximum))
      ? undefined
      : Number(schemaObj.maximum);
    const minimumPossibleVal = Number.isNaN(Number(schemaObj.minimum))
      ? Number.isNaN(Number(schemaObj.exclusiveMinimum))
        ? maximum || 0
        : Number(schemaObj.exclusiveMinimum) +
          (typeValue.startsWith('integer') ? 1 : 0.001)
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
      return schemaObj.pattern;
    }
    if (schemaObj.format) {
      const u = `${Date.now().toString(16)}${Math.random().toString(
        16
      )}0`.repeat(16);
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
          return [
            u.substr(0, 8),
            u.substr(8, 4),
            `4000-8${u.substr(13, 3)}`,
            u.substr(16, 12),
          ].join('-');
        default:
          return '';
      }
    } else {
      const minLength = Number.isNaN(schemaObj.minLength)
        ? undefined
        : Number(schemaObj.minLength);
      const maxLength = Number.isNaN(schemaObj.maxLength)
        ? 0
        : Number(schemaObj.maxLength);
      const finalLength =
        minLength || (maxLength > 6 ? 6 : maxLength || undefined);
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
export function json2xml(obj: any, level = 1) {
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
      xmlText = `${xmlText}\n${indent}<${tagName}> ${json2xml(
        obj[prop],
        level + 1
      )}\n${indent}</${tagName}>`;
    } else if (typeof obj[prop] === 'object') {
      xmlText = `${xmlText}\n${indent}<${tagName}> ${json2xml(
        obj[prop],
        level + 1
      )}\n${indent}</${tagName}>`;
    } else {
      xmlText = `${xmlText}\n${indent}<${tagName}> ${obj[
        prop
      ].toString()} </${tagName}>`;
    }
  }
  return xmlText;
}

function addSchemaInfoToExample(schema: RapiDocSchema, obj: RapiDocObj) {
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

function removeTitlesAndDescriptions(obj: RapiDocObj) {
  if (typeof obj !== 'object' || obj === null) {
    return;
  }
  delete obj['::TITLE'];
  delete obj['::DESCRIPTION'];
  delete obj['::XML_TAG'];
  delete obj['::XML_WRAP'];
  for (const k in obj) {
    const value = obj[k];
    if (typeof value === 'object') {
      removeTitlesAndDescriptions(value);
    }
  }
}

function addPropertyExampleToObjectExamples(
  example: unknown,
  obj: { [index: string]: any },
  propertyKey: string
) {
  for (const key in obj) {
    obj[key][propertyKey] = example;
  }
}

function mergePropertyExamples(
  obj: any,
  propertyName: string,
  propExamples: any
) {
  // Create an example for each variant of the propertyExample, merging them with the current (parent) example
  let i = 0;
  const maxCombinations = 10;
  const mergedObj: any = {};
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
export function schemaToSampleObj(
  schema: RapiDocSchema | undefined,
  config: {
    includeReadOnly?: boolean;
    deprecated?: boolean;
    includeDeprecated?: boolean;
    includeWriteOnly?: boolean;
    useXmlTagForProp?: boolean;
  } = {}
) {
  let obj: any = {};
  if (!schema) {
    return;
  }
  if (schema.allOf) {
    const objWithAllProps: any = {};

    if (
      schema.allOf.length === 1 &&
      !('properties' in schema.allOf[0]) &&
      !('items' in schema.allOf[0])
    ) {
      // If allOf has single item and the type is not an object or array, then its a primitive
      if ('$ref' in schema.allOf[0]) {
        return '{  }';
      }
      if (schema.allOf[0].readOnly && config.includeReadOnly) {
        const tempSchema = schema.allOf[0] as RapiDocSchema;
        return getSampleValueByType(tempSchema);
      }
      return;
    }

    schema.allOf.forEach((v) => {
      if (
        ('type' in v && v.type === 'object') ||
        'properties' in v ||
        'allOf' in v ||
        'anyOf' in v ||
        'oneOf' in v
      ) {
        const partialObj = schemaToSampleObj(v as RapiDocSchema, config);
        Object.assign(objWithAllProps, partialObj);
      } else if (('type' in v && v.type === 'array') || 'items' in v) {
        const partialObj = [schemaToSampleObj(v as RapiDocSchema, config)];
        Object.assign(objWithAllProps, partialObj);
      } else if ('type' in v) {
        const prop = `prop${Object.keys(objWithAllProps).length}`;
        objWithAllProps[prop] = getSampleValueByType(v as RapiDocSchema);
      }
    });

    obj = objWithAllProps;
  } else if (schema.oneOf) {
    // 1. First create example with scheme.properties
    const objWithSchemaProps: any = {};
    if (schema.properties) {
      for (const propertyName in schema.properties) {
        const value = schema.properties[propertyName] as RapiDocSchema;
        if ('properties' in value && value.properties) {
          objWithSchemaProps[propertyName] = schemaToSampleObj(value, config);
        } else {
          objWithSchemaProps[propertyName] = getSampleValueByType(value);
        }
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

      The above Schema should generate the following 2 examples

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
        const oneOfSamples = schemaToSampleObj(
          schema.oneOf[key] as RapiDocSchema,
          config
        );
        for (const sampleKey in oneOfSamples) {
          // 2. In the final example include a one-of item along with properties
          let finalExample;
          if (Object.keys(objWithSchemaProps).length > 0) {
            if (
              oneOfSamples[sampleKey] === null ||
              typeof oneOfSamples[sampleKey] !== 'object'
            ) {
              // This doesn't really make sense since every oneOf schema _should_ be an object if there are common properties, so we'll skip this
              continue;
            } else {
              finalExample = Object.assign(
                oneOfSamples[sampleKey],
                objWithSchemaProps
              );
            }
          } else {
            finalExample = oneOfSamples[sampleKey];
          }
          obj[`example-${i}`] = finalExample;
          addSchemaInfoToExample(
            schema.oneOf[key] as RapiDocSchema,
            obj[`example-${i}`]
          );
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
        if (
          (schema.properties[propertyName] as RapiDocSchema).deprecated &&
          !config.includeDeprecated
        ) {
          continue;
        }
        if (
          (schema.properties[propertyName] as RapiDocSchema).readOnly &&
          !config.includeReadOnly
        ) {
          continue;
        }
        if (
          (schema.properties[propertyName] as RapiDocSchema).writeOnly &&
          !config.includeWriteOnly
        ) {
          continue;
        }
        commonObj = mergePropertyExamples(
          commonObj,
          propertyName,
          schemaToSampleObj(
            schema.properties[propertyName] as RapiDocSchema,
            config
          )
        );
      }
    }

    // Combine every variant of the regular properties with every variant of the anyOf samples
    let i = 0;
    for (const key in schema.anyOf) {
      const anyOfSamples = schemaToSampleObj(
        schema.anyOf[key] as RapiDocSchema,
        config
      );
      for (const sampleKey in anyOfSamples) {
        if (typeof commonObj !== 'undefined') {
          for (const commonKey in commonObj) {
            obj[`example-${i}`] = {
              ...commonObj[commonKey],
              ...anyOfSamples[sampleKey],
            };
          }
        } else {
          obj[`example-${i}`] = anyOfSamples[sampleKey];
        }
        addSchemaInfoToExample(
          schema.anyOf[key] as RapiDocSchema,
          obj[`example-${i}`]
        );
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
        const subSchema = schema.properties[propertyName] as RapiDocSchema;

        if (subSchema?.deprecated && !config.includeDeprecated) {
          continue;
        }
        if (subSchema?.readOnly && !config.includeReadOnly) {
          continue;
        }
        if (subSchema?.writeOnly && !config.includeWriteOnly) {
          continue;
        }
        if (
          subSchema?.type === 'array' ||
          (schema.properties[propertyName] as RapiDocSchema)?.items
        ) {
          if (subSchema.example) {
            addPropertyExampleToObjectExamples(
              subSchema.example,
              obj,
              propertyName
            );
          } else if (subSchema?.items?.example) {
            // schemas and properties support single example but not multiple examples.
            addPropertyExampleToObjectExamples(
              [subSchema.items.example],
              obj,
              propertyName
            );
          } else {
            const itemSamples = schemaToSampleObj(subSchema.items, config);
            if (config.useXmlTagForProp) {
              const xmlTagName = subSchema.xml?.name || propertyName;
              if (subSchema.xml?.wrapped) {
                const wrappedItemSample = JSON.parse(
                  `{ "${xmlTagName}" : { "${xmlTagName}" : ${JSON.stringify(
                    itemSamples['example-0']
                  )} } }`
                );
                obj = mergePropertyExamples(obj, xmlTagName, wrappedItemSample);
              } else {
                obj = mergePropertyExamples(obj, xmlTagName, itemSamples);
              }
            } else {
              const arraySamples: any[] & { [index: string]: any } = [];
              for (const key in itemSamples) {
                arraySamples[key] = [itemSamples[key]];
              }
              obj = mergePropertyExamples(obj, propertyName, arraySamples);
            }
          }
          continue;
        }
        obj = mergePropertyExamples(
          obj,
          propertyName,
          schemaToSampleObj(
            schema.properties[propertyName] as RapiDocSchema,
            config
          )
        );
      }
    }
  } else if (schema.type === 'array' || schema.items) {
    if (schema.items || schema.example) {
      if (schema.example) {
        obj['example-0'] = schema.example;
      } else if (schema.items?.example) {
        // schemas and properties support single example but not multiple examples.
        obj['example-0'] = [schema.items.example];
      } else {
        const samples = schemaToSampleObj(schema.items, config);
        let i = 0;
        for (const key in samples) {
          obj[`example-${i}`] = [samples[key]];
          addSchemaInfoToExample(
            schema.items as RapiDocSchema,
            obj[`example-${i}`]
          );
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

function generateMarkdownForArrayAndObjectDescription(
  schema: RapiDocSchema,
  level = 0
) {
  let markdown =
    (schema.description || schema.title) && (schema.minItems || schema.maxItems)
      ? '<span class="descr-expand-toggle">➔</span>'
      : '';
  if (schema.title) {
    if (schema.description) {
      markdown = `${markdown} <b>${schema.title}:</b> ${schema.description}<br/>`;
    } else {
      markdown = `${markdown} ${schema.title}<br/>`;
    }
  } else if (schema.description) {
    markdown = `${markdown} ${schema.description}<br/>`;
  }
  if (schema.minItems) {
    markdown = `${markdown} <b>Min Items:</b> ${schema.minItems}`;
  }
  if (schema.maxItems) {
    markdown = `${markdown} <b>Max Items:</b> ${schema.maxItems}`;
  }
  if (level > 0 && schema.items?.description) {
    let itemsMarkdown = '';
    if (schema.items.minProperties) {
      itemsMarkdown = `<b>Min Properties:</b> ${schema.items.minProperties}`;
    }
    if (schema.items.maxProperties) {
      itemsMarkdown = `${itemsMarkdown} <b>Max Properties:</b> ${schema.items.maxProperties}`;
    }
    markdown = `${markdown} ⮕ ${itemsMarkdown} [ ${schema.items.description} ] `;
  }
  return markdown;
}

export interface ObjectNotationSchema {
  '::dataTypeLabel'?: string;
  '::deprecated'?: boolean;
  '::description'?: string;
  '::readwrite'?: 'readonly' | 'writeonly' | '';
  '::title'?: string;
  '::type'?: 'object' | 'array' | 'xxx-of-array' | 'xxx-of-option';
  '::ONE~OF'?: ObjectNotationSchema;
  [key: `::ANY~OF ${string}`]: ObjectNotationSchema | undefined | string;
  [key: `::ONE~OF ${string}`]: ObjectNotationSchema | undefined | string;
  [key: `::OPTION~${number}${string}`]:
    | ObjectNotationSchema
    | undefined
    | string;
  [key: `${string}*`]: ObjectNotationSchema | undefined | string;
  [key: string]: ObjectNotationSchema | undefined | string | boolean;
}

/**
 * For changing OpenAPI-Schema to an Object Notation,
 * This Object would further be an input to UI Components to generate an Object-Tree
 * @param {object} schema - Schema object from OpenAPI spec
 * @param {object} obj - recursively pass this object to generate object notation
 * @param {number} level - recursion level
 * @param {string} suffix - used for suffixing property names to avoid duplicate props during object composition
 */
export function schemaInObjectNotation(
  schema: RapiDocSchema,
  obj: ObjectNotationSchema,
  level: number = 0,
  suffix: string | number = ''
): ObjectNotationSchema | undefined | string {
  if (!schema) {
    return;
  }
  if (schema.allOf) {
    const objWithAllProps: any = {};
    if (
      schema.allOf.length === 1 &&
      !(schema.allOf[0] as RapiDocSchema).properties &&
      !(schema.allOf[0] as RapiDocSchema).items
    ) {
      // If allOf has single item and the type is not an object or array, then its a primitive
      const tempSchema = schema.allOf[0] as RapiDocSchema;
      return `${getTypeInfo(tempSchema)?.html}`;
    }
    // If allOf is an array of multiple elements, then all the keys makes a single object
    (schema.allOf as RapiDocSchema[]).forEach((v, i) => {
      if (
        v.type === 'object' ||
        v.properties ||
        v.allOf ||
        v.anyOf ||
        v.oneOf
      ) {
        const propSuffix = (v.anyOf || v.oneOf) && i > 0 ? i : '';
        const partialObj = schemaInObjectNotation(v, {}, level + 1, propSuffix);
        Object.assign(objWithAllProps, partialObj);
      } else if (v.type === 'array' || v.items) {
        const partialObj = schemaInObjectNotation(v, {}, level + 1);
        Object.assign(objWithAllProps, partialObj);
      } else if (v.type) {
        const prop = `prop${Object.keys(objWithAllProps).length}`;
        const typeObj = getTypeInfo(v);
        objWithAllProps[prop] = `${typeObj?.html}`;
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
          obj[`${key}*`] = schemaInObjectNotation(
            schema.properties[key] as RapiDocSchema,
            {},
            level + 1
          );
        } else {
          obj[key] = schemaInObjectNotation(
            schema.properties[key] as RapiDocSchema,
            {},
            level + 1
          );
        }
      }
    }
    // 2. Then show allof/anyof objects
    const objWithAnyOfProps: ObjectNotationSchema = {};
    const xxxOf = schema.anyOf ? 'anyOf' : 'oneOf';
    (schema[xxxOf] as RapiDocSchema[]).forEach((v, index) => {
      if (
        v.type === 'object' ||
        v.properties ||
        v.allOf ||
        v.anyOf ||
        v.oneOf
      ) {
        const partialObj: ReturnType<typeof schemaInObjectNotation> =
          schemaInObjectNotation(v, {});
        objWithAnyOfProps[
          `::OPTION~${index + 1}${v.title ? `~${v.title}` : ''}`
        ] = partialObj;
        (
          objWithAnyOfProps[
            `::OPTION~${index + 1}${v.title ? `~${v.title}` : ''}`
          ] as ObjectNotationSchema
        )['::readwrite'] = ''; // xxx-options cannot be read or write only
        objWithAnyOfProps['::type'] = 'xxx-of-option';
      } else if (v.type === 'array' || v.items) {
        // This else-if block never seems to get executed
        const partialObj = schemaInObjectNotation(v, {});
        objWithAnyOfProps[
          `::OPTION~${index + 1}${v.title ? `~${v.title}` : ''}`
        ] = partialObj;
        (
          objWithAnyOfProps[
            `::OPTION~${index + 1}${v.title ? `~${v.title}` : ''}`
          ] as ObjectNotationSchema
        )['::readwrite'] = ''; // xxx-options cannot be read or write only
        objWithAnyOfProps['::type'] = 'xxx-of-array';
      } else {
        const prop = `::OPTION~${index + 1}${v.title ? `~${v.title}` : ''}`;
        objWithAnyOfProps[prop] = `${getTypeInfo(v)?.html}`;
        objWithAnyOfProps['::type'] = 'xxx-of-option';
      }
    });
    obj[schema.anyOf ? `::ANY~OF ${suffix}` : `::ONE~OF ${suffix}`] =
      objWithAnyOfProps;
    // obj['::type'] = 'object';
    obj['::type'] = 'object';
  } else if (Array.isArray(schema.type)) {
    // When a property has multiple types, then check further if any of the types are array or object, if yes then modify the schema using one-of
    // Clone the schema - as it will be modified to replace multi-data-types with one-of;
    const subSchema: RapiDocSchema = JSON.parse(JSON.stringify(schema));
    const primitiveType: any[] = [];
    const complexTypes: any[] = [];
    (subSchema.type as unknown as any[]).forEach((v) => {
      if (v.match(/integer|number|string|null|boolean/g)) {
        primitiveType.push(v);
      } else if (
        v === 'array' &&
        typeof subSchema.items?.type === 'string' &&
        subSchema.items?.type.match(/integer|number|string|null|boolean/g)
      ) {
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
      (subSchema.type as string) = primitiveType.join(
        primitiveType.length === 2 ? ' or ' : '┃'
      );
      multiPrimitiveTypes = getTypeInfo(subSchema);
      if (complexTypes.length === 0) {
        return `${multiPrimitiveTypes?.html || ''}`;
      }
    }
    if (complexTypes.length > 0) {
      obj['::type'] = 'object';
      const multiTypeOptions: Partial<ObjectNotationSchema> = {
        '::type': 'xxx-of-option',
      };

      // Generate ONE-OF options for complexTypes
      complexTypes.forEach((v, i) => {
        if (v === 'null') {
          multiTypeOptions[`::OPTION~${i + 1}`] =
            'NULL~|~~|~~|~~|~~|~~|~~|~~|~';
        } else if ('integer, number, string, boolean,'.includes(`${v},`)) {
          subSchema.type = Array.isArray(v) ? v.join('┃') : v;
          const primitiveTypeInfo = getTypeInfo(subSchema);
          multiTypeOptions[`::OPTION~${i + 1}`] = primitiveTypeInfo?.html;
        } else if (v === 'object') {
          // If object type iterate all the properties and create an object-type-option
          const objTypeOption: ObjectNotationSchema = {
            '::title': schema.title || '',
            '::description': schema.description || '',
            '::type': 'object',
            '::deprecated': schema.deprecated || false,
          };
          for (const key in schema.properties) {
            if (schema.required && schema.required.includes(key)) {
              objTypeOption[`${key}*`] = schemaInObjectNotation(
                schema.properties[key] as RapiDocSchema,
                {},
                level + 1
              );
            } else {
              objTypeOption[key] = schemaInObjectNotation(
                schema.properties[key] as RapiDocSchema,
                {},
                level + 1
              );
            }
          }
          multiTypeOptions[`::OPTION~${i + 1}`] = objTypeOption;
        } else if (v === 'array') {
          multiTypeOptions[`::OPTION~${i + 1}`] = {
            '::title': schema.title || '',
            '::description': schema.description || '',
            '::type': 'array',
            '::props': schemaInObjectNotation(
              schema.items as RapiDocSchema,
              {},
              level + 1
            ),
          };
        }
      });
      multiTypeOptions[`::OPTION~${complexTypes.length + 1}`] =
        multiPrimitiveTypes?.html || '';
      obj['::ONE~OF'] = multiTypeOptions;
    }
  } else if (schema.type === 'object' || schema.properties) {
    // If Object
    obj['::title'] = schema.title || '';
    obj['::description'] = generateMarkdownForArrayAndObjectDescription(
      schema,
      level
    );
    obj['::type'] = 'object';
    if (
      (Array.isArray(schema.type) && schema.type.includes('null')) ||
      schema.nullable
    ) {
      obj['::dataTypeLabel'] = 'object or null';
      obj['::nullable'] = true;
    }
    obj['::deprecated'] = schema.deprecated || false;
    obj['::readwrite'] = schema.readOnly
      ? 'readonly'
      : schema.writeOnly
      ? 'writeonly'
      : '';
    for (const key in schema.properties) {
      if (schema.required && schema.required.includes(key)) {
        obj[`${key}*`] = schemaInObjectNotation(
          schema.properties[key] as RapiDocSchema,
          {},
          level + 1
        );
      } else {
        obj[key] = schemaInObjectNotation(
          schema.properties[key] as RapiDocSchema,
          {},
          level + 1
        );
      }
    }
    for (const key in schema.patternProperties) {
      obj[`[pattern: ${key}]`] = schemaInObjectNotation(
        schema.patternProperties[key],
        obj,
        level + 1
      );
    }
    if (schema.additionalProperties) {
      obj['[any-key]'] = schemaInObjectNotation(
        schema.additionalProperties as RapiDocSchema,
        {}
      );
    }
  } else if (schema.type === 'array' || schema.items) {
    // If Array
    obj['::title'] = schema.title || '';
    obj['::description'] = generateMarkdownForArrayAndObjectDescription(
      schema,
      level
    );
    obj['::type'] = 'array';
    if (
      (Array.isArray(schema.type) && schema.type.includes('null')) ||
      schema.nullable
    ) {
      obj['::dataTypeLabel'] = 'array or null';
      obj['::nullable'] = true;
    }
    obj['::deprecated'] = schema.deprecated || false;
    obj['::readwrite'] = schema.readOnly
      ? 'readonly'
      : schema.writeOnly
      ? 'writeonly'
      : '';
    if (schema.items?.items) {
      obj['::array-type'] = schema.items.items.type;
    }
    obj['::props'] = schemaInObjectNotation(
      schema.items as RapiDocSchema,
      {},
      level + 1
    );
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
export function generateExample(
  schema: RapiDocSchema,
  mimeType: string,
  examples: RapiDocExamples | undefined = undefined,
  example = '',
  includeReadOnly = true,
  includeWriteOnly = true,
  outputType = 'json',
  includeGeneratedExample = false
) {
  const finalExamples = [];
  // First check if examples is provided
  if (examples) {
    for (const eg in examples) {
      let egContent = '';
      let egFormat = 'json';
      if (mimeType?.toLowerCase().includes('json')) {
        if (outputType === 'text') {
          egContent =
            typeof examples[eg].value === 'string'
              ? examples[eg].value
              : JSON.stringify(examples[eg].value, undefined, 2);
          egFormat = 'text';
        } else {
          egContent = examples[eg].value;
          if (typeof examples[eg].value === 'string') {
            try {
              // const fixedJsonString = examples[eg].value.replace((/([\w]+)(:)/g), '"$1"$2').replace((/'/g), '"');
              const fixedJsonString = examples[eg].value;
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
        egContent =
          typeof example === 'string'
            ? example
            : JSON.stringify(example, undefined, 2);
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
      if (schema.example) {
        // Note: Deprecated: The 'example' property has been deprecated in 3.1.0 in favor of the JSON Schema 'examples' keyword
        finalExamples.push({
          exampleId: 'Example',
          exampleSummary: '',
          exampleDescription: '',
          exampleType: mimeType,
          exampleValue: schema.example,
          exampleFormat:
            mimeType?.toLowerCase().includes('json') &&
            typeof schema.example === 'object'
              ? 'json'
              : 'text',
        });
      } else if (
        mimeType?.toLowerCase().includes('json') ||
        mimeType?.toLowerCase().includes('text') ||
        mimeType?.toLowerCase().includes('*/*') ||
        mimeType?.toLowerCase().includes('xml')
      ) {
        let xmlRootStart = '';
        let xmlRootEnd = '';
        let exampleFormat = '';
        let exampleValue = '';
        if (mimeType?.toLowerCase().includes('xml')) {
          xmlRootStart = schema.xml?.name
            ? `<${schema.xml.name} ${
                schema.xml.namespace ? `xmlns="${schema.xml.namespace}"` : ''
              }>`
            : '<root>';
          xmlRootEnd = schema.xml?.name ? `</${schema.xml.name}>` : '</root>';
          exampleFormat = 'text';
        } else {
          exampleFormat = outputType;
        }
        const samples = schemaToSampleObj(schema, {
          includeReadOnly,
          includeWriteOnly,
          deprecated: true,
          useXmlTagForProp: mimeType?.toLowerCase().includes('xml'),
        });
        let i = 0;
        for (const samplesKey in samples) {
          if (!samples[samplesKey]) {
            continue;
          }
          const summary = samples[samplesKey]['::TITLE'] || `Example ${++i}`;
          const description = samples[samplesKey]['::DESCRIPTION'] || '';
          if (mimeType?.toLowerCase().includes('xml')) {
            exampleValue = `<?xml version="1.0" encoding="UTF-8"?>\n${xmlRootStart}${json2xml(
              samples[samplesKey],
              1
            )}\n${xmlRootEnd}`;
          } else {
            removeTitlesAndDescriptions(samples[samplesKey]);
            exampleValue =
              outputType === 'text'
                ? JSON.stringify(samples[samplesKey], null, 2)
                : samples[samplesKey];
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

function getSerializeStyleForContentType(contentType: string) {
  if (contentType === 'application/json') {
    return 'json';
  }
  if (contentType === 'application/xml') {
    return 'xml';
  }
  return null;
}

export function getSchemaFromParam(
  param: OpenAPIV3.ParameterObject
):
  | [RapiDocSchema, null, null]
  | [RapiDocSchema, string | null, OpenAPIV3.MediaTypeObject | null]
  | [null, null, null] {
  if (param.schema) {
    return [param.schema as RapiDocSchema, null, null];
  }
  if (param.content) {
    // we gonna use the first content-encoding
    for (const contentType of Object.keys(param.content)) {
      const media = param.content[contentType];
      if (media.schema) {
        return [
          media.schema as RapiDocSchema,
          getSerializeStyleForContentType(contentType),
          param.content[contentType],
        ];
      }
    }
  }
  return [null, null, null];
}
