
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

export function copyToClipboard(elId) {
  /* Get the text field */
  const copyText = document.getElementById(elId);

  /* Select the text field */
  copyText.select();

  /* Copy the text inside the text field */
  document.execCommand('copy');
  return copyText.value;
}

/* Generates an schema object containing type and constraint info */
export function getTypeInfo(schema) {
  if (!schema) {
    return;
  }
  const info = {
    type: schema.$ref
      ? '{recursive}'
      : schema.enum
        ? 'enum'
        : schema.format
          ? schema.format
          : schema.type,
    format: schema.format ? schema.format : '',
    pattern: (schema.pattern && !schema.enum) ? schema.pattern : '',
    readOrWriteOnly: schema.readOnly
      ? '🆁'
      : schema.writeOnly
        ? '🆆'
        : '',
    deprecated: schema.deprecated ? '❌' : '',
    default: schema.default === 0 ? '0' : (schema.default ? schema.default : ''),
    description: schema.description ? schema.description : '',
    constrain: '',
    allowedValues: '',
    arrayType: '',
    html: '',
  };
  if (info.type === '{recursive}') {
    info.description = schema.$ref.substring(schema.$ref.lastIndexOf('/') + 1);
  }

  // Set Allowed Values
  if (schema.enum) {
    let opt = '';
    schema.enum.map((v) => {
      opt += `${v}, `;
    });
    info.allowedValues = opt.slice(0, -2);
  }

  if (schema.type === 'array' && schema.items) {
    const arraySchema = schema.items;
    info.arrayType = `${schema.type} of ${arraySchema.type}`;
    info.default = arraySchema.default === 0 ? '0 ' : (arraySchema.default ? arraySchema.default : '');
    if (arraySchema.enum) {
      let opt = '';
      arraySchema.enum.map((v) => {
        opt += `${v}, `;
      });
      info.allowedValues = opt.slice(0, -2);
    }
  } else if (schema.type === 'integer' || schema.type === 'number') {
    if (schema.minimum !== undefined && schema.maximum !== undefined) {
      info.constrain = `${schema.exclusiveMinimum ? '>' : '>='}${schema.minimum} and ${schema.exclusiveMaximum ? '<' : '<='} ${schema.maximum}`;
    } else if (schema.minimum !== undefined && schema.maximum === undefined) {
      info.constrain = `${schema.exclusiveMinimum ? '>' : '>='}${schema.minimum}`;
    } else if (schema.minimum === undefined && schema.maximum !== undefined) {
      info.constrain = `${schema.exclusiveMaximum ? '<' : '<='}${schema.maximum}`;
    }
    if (schema.multipleOf !== undefined) {
      info.constrain = `(multiple of ${schema.multipleOf})`;
    }
  } else if (schema.type === 'string') {
    if (schema.minLength !== undefined && schema.maxLength !== undefined) {
      info.constrain = `(${schema.minLength} to ${schema.maxLength} chars)`;
    } else if (schema.minLength !== undefined && schema.maxLength === undefined) {
      info.constrain = `min ${schema.minLength} chars`;
    } else if (schema.minLength === undefined && schema.maxLength !== undefined) {
      info.constrain = `max ${schema.maxLength} chars`;
    }
  }

  info.html = `${info.type}~|~${info.readOrWriteOnly} ${info.deprecated}~|~${info.constrain}~|~${info.default}~|~${info.allowedValues}~|~${info.pattern}~|~${info.description}`;
  return info;
}


export function getSampleValueByType(schemaObj) {
  if (schemaObj.example) {
    return schemaObj.example;
  }
  if (Object.keys(schemaObj).length === 0) {
    return null;
  }
  if (schemaObj.$ref) { // Indicates a Circular ref
    return schemaObj.$ref;
  }
  let typeValue = schemaObj.format || schemaObj.type || (schemaObj.enum ? 'enum' : null);
  if (!typeValue) {
    if (schemaObj.enum) {
      typeValue = 'enum';
    } else if (schemaObj.anyOf) {
      typeValue = 'anyOf';
    } else if (schemaObj.oneOf) {
      typeValue = 'oneOf';
    }
  }

  switch (typeValue.toLowerCase()) {
    case 'int32':
    case 'int64':
    case 'integer':
      return 0;
    case 'float':
    case 'double':
    case 'number':
    case 'decimal':
      return 0.5;
    case 'string':
      return (schemaObj.enum ? schemaObj.enum[0] : (schemaObj.pattern ? schemaObj.pattern : 'string'));
    case 'url':
    case 'uri':
      return 'http://example.com';
    case 'byte':
      return btoa('string');
    case 'binary':
      return 'binary';
    case 'boolean':
      return false;
    case 'date':
      return (new Date(0)).toISOString().split('T')[0];
    case 'date-time':
      return (new Date(0)).toISOString();
    case 'dateTime':
      return (new Date(0)).toISOString();
    case 'password':
      return 'password';
    case 'enum':
      return schemaObj.enum[0];
    case 'uuid':
      return '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    case 'email':
      return 'user@example.com';
    case 'hostname':
      return 'example.com';
    case 'ipv4':
      return '198.51.100.42';
    case 'ipv6':
      return '2001:0db8:5b96:0000:0000:426f:8e17:642a';
    default:
      if (schemaObj.nullable) {
        return null;
      }
      if (schemaObj.$ref) {
        return `data of type ${schemaObj.$ref}`;
      }
      return '?';
  }
}

/* For changing JSON-Schema to a Sample Object, as per the schema */
export function schemaToSampleObj(schema, config = {}) {
  let obj = {};
  if (schema === null) {
    return;
  }
  if (schema.type === 'object' || schema.properties) {
    for (const key in schema.properties) {
      if (schema.properties[key].deprecated && !config.includeDeprecated) { continue; }
      if (schema.properties[key].readOnly && !config.includeReadOnly) { continue; }
      if (schema.properties[key].writeOnly && !config.includeWriteOnly) { continue; }

      if (schema.example) {
        obj[key] = schema.example;
      } else if (schema.examples && schema.example.length > 0) {
        obj[key] = schema.examples[0];
      } else {
        obj[key] = schemaToSampleObj(schema.properties[key], config);
      }
    }
  } else if (schema.type === 'array' || schema.items) {
    if (schema.example) {
      obj = schema.example;
    } else if (schema.examples && schema.example.length > 0) {
      obj = schema.examples[0];
    } else {
      obj = [schemaToSampleObj(schema.items, config)];
    }
  } else if (schema.allOf) {
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

    schema.allOf.map((v) => {
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
    if (schema.oneOf.length > 0) {
      obj = schemaToSampleObj(schema.oneOf[0], config);
    }
  } else if (schema.anyOf) {
    if (schema.anyOf.length > 0) {
      obj = schemaToSampleObj(schema.anyOf[0], config);
    }
  } else {
    return getSampleValueByType(schema);
  }
  return obj;
}


/**
 * For changing OpenAPI-Schema to an Object Notation,
 * This Object would further be an input to UI Components to generate an Object-Tree
 * @param {object} schema - Schema object from OpenAPI spec
 * @param {object} obj - recursivly pass this object to generate object notation
 */
export function schemaInObjectNotation(schema, obj, level = 0) {
  if (schema == null) {
    return;
  }
  if (schema.type === 'object' || schema.properties) {
    obj['::description'] = schema.description ? schema.description : '';
    obj['::type'] = 'object';
    for (const key in schema.properties) {
      if (schema.required && schema.required.includes(key)) {
        obj[`${key}*`] = schemaInObjectNotation(schema.properties[key], {}, (level + 1));
      } else {
        obj[key] = schemaInObjectNotation(schema.properties[key], {}, (level + 1));
      }
    }
  } else if (schema.items) { // If Array
    obj['::description'] = schema.description ? schema.description : '';
    obj['::type'] = 'array';
    obj['::props'] = schemaInObjectNotation(schema.items, {}, (level + 1));
  } else if (schema.allOf) {
    const objWithAllProps = {};
    if (schema.allOf.length === 1 && !schema.allOf[0].properties && !schema.allOf[0].items) {
      // If allOf has single item and the type is not an object or array, then its a primitive
      const tempSchema = schema.allOf[0];
      return `${getTypeInfo(tempSchema).html}`;
    }

    // If allOf is an array of multiple elements, then all the keys makes a single object
    schema.allOf.map((v) => {
      if (v.type === 'object' || v.properties || v.allOf || v.anyOf || v.oneOf) {
        const partialObj = schemaInObjectNotation(v, {}, (level + 1));
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
    let i = 1;
    const objWithAnyOfProps = {};
    const xxxOf = schema.anyOf ? 'anyOf' : 'oneOf';
    schema[xxxOf].map((v) => {
      if (v.type === 'object' || v.properties || v.allOf || v.anyOf || v.oneOf) {
        const partialObj = schemaInObjectNotation(v, {});
        objWithAnyOfProps[`OPTION_${i}`] = partialObj;
        i++;
      } else if (v.type === 'array' || v.items) {
        const partialObj = [schemaInObjectNotation(v, {})];
        Object.assign(objWithAnyOfProps, partialObj);
      } else {
        const prop = `prop${Object.keys(objWithAnyOfProps).length}`;
        objWithAnyOfProps[prop] = `${getTypeInfo(v).html}`;
      }
    });
    obj[(schema.anyOf ? 'ANY_OF' : 'ONE_OF')] = objWithAnyOfProps;
  } else {
    const typeObj = getTypeInfo(schema);
    if (typeObj.html) {
      return `${typeObj.html}`;
    }
    return '';
  }
  return obj;
}


/* Create Example object */
export function generateExample(examples, example, schema, mimeType, includeReadOnly = true, outputType) {
  const finalExamples = [];
  if (examples) {
    for (const eg in examples) {
      let egContent = '';
      if (mimeType.toLowerCase().includes('json')) {
        if (outputType === 'text') {
          egContent = JSON.stringify(examples[eg].value, undefined, 2);
        } else {
          egContent = examples[eg].value;
        }
      } else {
        egContent = examples[eg].value;
      }

      finalExamples.push({
        exampleType: mimeType,
        exampleValue: egContent,
      });
    }
  } else if (example) {
    let egContent = '';
    if (mimeType.toLowerCase().includes('json')) {
      if (outputType === 'text') {
        egContent = JSON.stringify(example, undefined, 2);
      } else {
        egContent = example;
      }
    } else {
      egContent = example;
    }
    finalExamples.push({
      exampleType: mimeType,
      exampleValue: egContent,
    });
  }
  if (finalExamples.length === 0) {
    // If schema examples are not provided then generate one from Schema (only JSON fomat)
    if (schema) {
      // TODO: in case the mimeType is XML then parse it as XML
      if (mimeType.toLowerCase().includes('json') || mimeType.toLowerCase().includes('*/*')) {
        const egJson = schemaToSampleObj(schema, { includeReadOnly, includeWriteOnly: true, deprecated: true });
        finalExamples.push({
          exampleType: mimeType,
          exampleValue: outputType === 'text' ? JSON.stringify(egJson, undefined, 2) : egJson,
        });
      } else {
        finalExamples.push({
          exampleType: mimeType,
          exampleValue: '',
        });
      }
    } else {
      // No Example or Schema provided
      finalExamples.push({
        exampleType: mimeType,
        exampleValue: '',
      });
    }
  }
  return finalExamples;
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
