import { html } from 'lit-element'; 
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';

/* For Delayed Event Handler Execution */
export function debounce (fn, delay) {
    var timeoutID = null;
    return function () {
      clearTimeout(timeoutID)
      var args = arguments
      var that = this
      timeoutID = setTimeout(function () {
        fn.apply(that, args)
      }, delay)
    }
}

export function copyToClipboard(elId) {
    /* Get the text field */
    var copyText = document.getElementById(elId);
  
    /* Select the text field */
    copyText.select();
  
    /* Copy the text inside the text field */
    document.execCommand("copy");
    return copyText.value;
}

/* Generates an schema object containing type and constraint info */
export function getTypeInfo(schema, overrideAttributes=null){
  if (!schema){
    return;
  }
  if (schema.type === "circular"){
    debugger;
  }
  let returnObj = {
    hasCircularRefs:schema.type === "circular",
    format    : schema.format?schema.format:'',
    pattern   : (schema.pattern && !schema.enum) ? schema.pattern:'',
    readOnly  : schema.readOnly ? '🆁\u00a0' : '',
    writeOnly : schema.writeOnly ? '🆆\u00a0' : '',
    depricated: schema.deprecated ? '❌\u00a0' : '',
    default   : schema.default==0 ? '0 ': (schema.default ? schema.default : ''),
    type      : '',
    arrayType : '',
    allowedValues:'',
    constrain : '',
    html      : ''
  };
  if (returnObj.hasCircularRefs){
    return returnObj;
  }
  // Set the Type
  if (schema.enum) {
    let opt=""
    schema.enum.map(function(v){
      opt = opt + `${v}, `
    });
    returnObj.type='enum';
    returnObj.allowedValues = opt.slice(0,-2);
  }
  else if (schema.type) {
    returnObj.type = schema.type;
  }
  
  if (schema.type==="array" && schema.items){
    let arraySchema = schema.items;
    returnObj.arrayType = `${schema.type} of ${arraySchema.type}`;
    returnObj.default = arraySchema.default==0 ? '0 ': (arraySchema.default ? arraySchema.default : '');
    if (arraySchema.enum){
      let opt=""
      arraySchema.enum.map(function(v){
        opt = opt + `${v}, `
      });
      returnObj.allowedValues = opt.slice(0,-2);
    }
  }
  else if (schema.type==="integer" || schema.type==="number"){
    if (schema.minimum !== undefined && schema.maximum!==undefined){
      returnObj.constrain = `${schema.exclusiveMinimum?">":""}${schema.minimum}\u00a0\u22ef\u00a0${schema.exclusiveMaximum?"<":""}\u00a0${schema.maximum}`
    }
    else if (schema.minimum!==undefined && schema.maximum===undefined){
      returnObj.constrain = `${schema.exclusiveMinimum?">":"≥"}${schema.minimum}`
    }
    else if (schema.minimum===undefined && schema.maximum!==undefined){
      returnObj.constrain = `${schema.exclusiveMaximum?"<":"≤"}${schema.maximum}`
    }
    if (schema.multipleOf!==undefined){
      returnObj.constrain = `(multiple\u00a0of\u00a0${schema.multipleOf})`
    }
  }
  else if (schema.type==="string"){
    if (schema.minLength !==undefined  && schema.maxLength !==undefined ){
      returnObj.constrain = `(${schema.minLength}\u00a0to\u00a0${schema.maxLength}\u00a0chars)`;
    }
    else if (schema.minLength!==undefined  && schema.maxLength===undefined ){
      returnObj.constrain = `(min:${schema.minLength}\u00a0chars)`;
    }
    else if (schema.minLength===undefined  && schema.maxLength!==undefined ){
      returnObj.constrain = `(max:${schema.maxLength}\u00a0chars)`;
    }
  }

  if (overrideAttributes){
    if (overrideAttributes.readOnly){
      returnObj.readOnly = '🆁\u00a0';
    }
    if (overrideAttributes.writeOnly){
      returnObj.writeOnly = '🆆\u00a0';
    }
    if (overrideAttributes.deprecated){
      returnObj.deprecated = '❌\u00a0';
    }
  }

  // ${returnObj.readOnly}${returnObj.writeOnly}${returnObj.deprecated}\u00a0
  let html = `${returnObj.type}`;
  if (returnObj.allowedValues){
    html = html + `:(${returnObj.allowedValues})`;
  }
  if (returnObj.readOnly){
    html = html + `\u00a0🆁`;
  }
  if (returnObj.writeOnly){
    html = html + `\u00a0🆆`;
  }
  if (returnObj.deprecated){
    html = html + `\u00a0❌`;
  }

  if (returnObj.constrain){
    html = html + `\u00a0${returnObj.constrain}`;
  }
  if (returnObj.format){
    html = html + `\u00a0${returnObj.format}`;
  }
  if (returnObj.pattern){
    html = html + `\u00a0${returnObj.pattern}`;
  }
  returnObj.html = html;
  return returnObj;
}

/* For changing JSON-Schema to a Object Model that can be represnted in a tree-view */ 
export function schemaToModel (schema, obj) {
  if (schema==null){
    return;
  }
  if (schema.type==="object" || schema.properties){
    if (schema.description){
      obj[":description"] = schema.description;
    }
    for( let key in schema.properties ){
      if (schema.required && schema.required.includes(key)){
        obj[key+'*'] = schemaToModel(schema.properties[key],{});
      }
      else {
        obj[key] = schemaToModel(schema.properties[key],{});
      }
    }
  }
  else if (schema.type === "array" || schema.items ){
    obj = [schemaToModel(schema.items,{})  ]
  }
  else if (schema.allOf ){
    let objWithAllProps = {};
    if (schema.allOf.length === 1 && !schema.allOf[0].properties && !schema.allOf[0].items){
      // If allOf has single item and the type is not an object or array, then its a primitive
      if (schema.allOf[0].$ref){
        return `{ ${schema.allOf[0].$ref} } ~|~ Recursive Object`; 
      }
      else {
        let tempSchema = schema.allOf[0];
        return `${getTypeInfo(tempSchema).html}~|~${tempSchema.description ? tempSchema.description : ''}`;
      }
    }
    else {
      // If allOf is an array of multiple elements, then all the keys makes a single object
      schema.allOf.map(function(v){
        if (v.type === 'object' || v.properties) {
          let partialObj = schemaToModel(v,{});
          Object.assign(objWithAllProps, partialObj);
        }
        else if (v.type === "array" || v.items){
          let partialObj = [ schemaToModel(v, {})];
          Object.assign(objWithAllProps, partialObj);
        }
        else if (v.type) {
          let prop = 'prop'+ Object.keys(objWithAllProps).length;
          let typeObj = getTypeInfo(v);
          objWithAllProps[prop] = `${typeObj.html}~|~${v.description ? v.description : ''}`
        }
        else {
          return '';
        }
      });
    }
    obj = objWithAllProps;
  }
  else if (schema.anyOf || schema.oneOf) {
    let i = 1;
    let objWithAnyOfProps = {};
    let xxxOf =  schema.anyOf ? "anyOf":"oneOf"
    schema[xxxOf].map(function(v){
      if (v.type === 'object' || v.properties) {
        let partialObj = schemaToModel(v,{});
        objWithAnyOfProps["OPTION_"+i] = partialObj;
        i++;
      }
      else if (v.type === "array" || v.items){
        let partialObj = [ schemaToModel(v,{}) ];
        Object.assign(objWithAnyOfProps, partialObj);
      }
      else{
        let prop = 'prop'+ Object.keys(objWithAnyOfProps).length;
        objWithAnyOfProps[prop] = `${getTypeInfo(v).html}~|~${v.description ? v.description : ''}`
      }
    });
    obj[(schema.anyOf ? "ANY_OF" : "ONE_OF" )] = objWithAnyOfProps ;
  }
  else {
    let typeObj = getTypeInfo(schema);
    if (typeObj.html){
      return `${typeObj.html}~|~${schema.description?schema.description:''}`;
    }
    else {
      return '';
    }
    
  }
  return obj;
}


/* Create Example object */
export function generateExample(examples, example, schema, mimeType, includeReadOnly = false, outputType){
  let finalExamples = [];
  if (examples){
    for (let eg in examples){
      let egContent="";  
      if (mimeType.toLowerCase().includes("json")){
        if (outputType==="text"){
          egContent = JSON.stringify(examples[eg].value,undefined,2);
        }
        else{
          egContent = examples[eg].value;
        }
      }
      else{
        egContent = examples[eg].value;
      }

      finalExamples.push({
        "exampleType" : mimeType,
        "exampleValue": egContent
      });
    } 
  }
  else if (example){
    let egContent="";  
    if (mimeType.toLowerCase().includes("json")){
      if (outputType === "text"){
        egContent = JSON.stringify(example,undefined,2);
      }
      else{
        egContent = example;
      }
    }
    else{
      egContent = example;
    }
    finalExamples.push({
      "exampleType" : mimeType,
      "exampleValue": egContent
    });
  }
  if (finalExamples.length==0 ){
    // If schema examples are not provided then generate one from Schema (only JSON fomat)
    if (schema){
      //TODO: in case the mimeType is XML then parse it as XML
      if (mimeType.toLowerCase().includes("json") || mimeType.toLowerCase().includes("*/*")){
          let egJson = schemaToObj(schema,{}, {includeReadOnly:includeReadOnly, includeWriteOnly:true, deprecated:true});
          finalExamples.push({
            "exampleType" : mimeType,
            "exampleValue": outputType==="text"?JSON.stringify(egJson,undefined,2):egJson
          });
      }
      else{
          finalExamples.push({
            "exampleType" : mimeType,
            "exampleValue": "" 
          });  
      }
    }
    else{
      // No Example or Schema provided   
      finalExamples.push({
        "exampleType" : mimeType,
        "exampleValue": "" 
      });
    }
  }
  return finalExamples;
}

/* For changing JSON-Schema to a Sample Object, as per the schema */ 
export function schemaToObj (schema, obj, config={}) {
    if (schema === null){
      return;
    }
    if (schema.type === "object" || schema.properties){
      for( let key in schema.properties ){
        if ( schema.properties[key].deprecated ) {
          continue;
        }
        if ( schema.properties[key].readOnly && !config.includeReadOnly ) {
          continue;
        }
        if ( schema.properties[key].writeOnly && !config.includeWriteOnly ) {
          continue;
        }
        //let temp = Object.assign({}, schema.properties[key] );
        obj[key] = schemaToObj(schema.properties[key],{}, config);
      }
    }
    else if (schema.type==="array" || schema.items ){
      //let temp = Object.assign({}, schema.items );
      obj = [schemaToObj(schema.items,{}, config)  ]
    }
    else if (schema.allOf ){
      let objWithAllProps = {};
      
      if (schema.allOf.length === 1 && !schema.allOf[0].properties && !schema.allOf[0].items){
        // If allOf has single item and the type is not an object or array, then its a primitive
        if (schema.allOf[0].$ref){
          return '{  }'; 
        }
        else {
          if (schema.allOf[0].readOnly && config.includeReadOnly ){
            let tempSchema = schema.allOf[0];
            return getSampleValueByType(tempSchema);
          }
          else {
            return;
          }
        }
      }
      else {
        schema.allOf.map(function(v){
          if ( v.readOnly) {
            return 'abcd';
          }
          else if (v.type === 'object' || v.properties) {
            let partialObj = schemaToObj(v, {}, config);
            Object.assign(objWithAllProps, partialObj);
          }
          else if (v.type === "array" || v.items){
            let partialObj = [ schemaToObj(v, {}, config) ];
            Object.assign(objWithAllProps, partialObj);
          }
          else if (v.type){
            let prop = 'prop'+ Object.keys(objWithAllProps).length;
            objWithAllProps[prop] = getSampleValueByType(v);
          }
          else {
            return '';
          }
        });
      }
      obj = objWithAllProps;
    }
    else if (schema.oneOf) {
      if (schema.oneOf.length > 0 ){
        obj = schemaToObj(schema.oneOf[0], {}, config);
      }
    }
    else if (schema.anyOf) {
      if (schema.anyOf.length > 0) {
        obj = schemaToObj(schema.anyOf[0], {}, config);
      }
    }
    else{
      return getSampleValueByType(schema);
    }
    return obj;
}

export function getSampleValueByType(schemaObj) {
    if (schemaObj.example) {
      return schemaObj.example;
    }
    if (Object.keys(schemaObj).length === 0) {
      return null;
    }
    let typeValue = schemaObj.format || schemaObj.type || (schemaObj.enum ? 'enum' : null) 
    if (!typeValue){
      if (schemaObj.enum){
        typeValue = "enum";
      }
      else if (schemaObj.anyOf){
        typeValue = "anyOf";
      }
      else if (schemaObj.oneOf){
        typeValue = "oneOf";
      }
    }

    switch (typeValue) {
      case 'int32':
      case 'int64':
      case 'integer':
        return 0;
      case 'float':
      case 'double':
      case 'number':
        return 0.5;
      case 'string':
        return (schemaObj.enum ? schemaObj.enum[0] : (schemaObj.pattern ? schemaObj.pattern : "string"))
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
      case 'uri':
        return 'http://example.com';
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
      case 'circular':
        return 'CIRCULAR REF';
      default:
        if (schemaObj.nullable) {
          return null;
        }
        else if (schemaObj.$ref){
          return `data of type ${schemaObj.$ref}`;
        }
        else {
          console.warn('Unknown schema value', schemaObj);
          return '?';
        }
    }
  }

export function getBaseUrlFromUrl(url){
  let pathArray = url.split( '/' );
  return pathArray[0] + "//" + pathArray[2];
}

export function removeCircularReferences(level=0) {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        //let dupVal = Object.assign({}, value);
        //return;
        if (level > 0){
          return {};
        }
        else{
          let dupVal = JSON.parse(JSON.stringify(value, removeCircularReferences(level+1)));
          seen.add(dupVal);
          return dupVal;
        }
      }
      seen.add(value);
    }
    return value;
  };
};

export async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}