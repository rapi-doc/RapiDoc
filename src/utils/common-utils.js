/* For Delayed Event Handler Execution */
function debounce (fn, delay) {
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

function copyToClipboard(elId) {
    /* Get the text field */
    var copyText = document.getElementById(elId);
  
    /* Select the text field */
    copyText.select();
  
    /* Copy the text inside the text field */
    document.execCommand("copy");
    return copyText.value;
}

/* Generates an HTML string containing type and constraint info */
function getTypeInfo(schema, overrideAttributes=null, inSingleLine=true){
    let html ="";
    if (schema.type==="circular"){
        return "circular-ref";
    }
    if (schema.enum){
        let opt=""
        schema.enum.map(function(v){
            opt = opt + v + ", "
        });
        html = `enum:\u3014 ${opt.slice(0,-2)} \u3015`
    }
    else if (schema.type){
        html = html + schema.type ;
    }
    
    if (schema.type==="integer" || schema.type==="number"){
        if (schema.minimum !== undefined && schema.maximum!==undefined){
            html = `${html} (${schema.exclusiveMinimum?">":""}${schema.minimum} \u22ef ${schema.exclusiveMaximum?"<":""} ${schema.maximum})`
            //html = html+" ( " + (schema.exclusiveMinimum?"> ":"") + schema.minimum + " to " +  (schema.exclusiveMaximum?"< ":"") + schema.maximum + " )";
        }
        else if (schema.minimum!==undefined && schema.maximum===undefined){
            html = `${html} (${schema.exclusiveMinimum?">":"\u2265"}${schema.minimum})`
            //html = html+" ( " + (schema.exclusiveMinimum?"> ":">=") + schema.minimum + " )";
        }
        else if (schema.minimum===undefined && schema.maximum!==undefined){
            html = `(${schema.exclusiveMaximum?"<":"\u2264"}${schema.maximum})`
            //html = html+" ( " + (schema.exclusiveMaximum?"< ":"<=") + schema.maximum + " )";
        }
        if (schema.multipleOf!==undefined){
            html = `(multiple of ${schema.multipleOf})`
            //html = html+" ( multiple of:" + schema.multipleOf+ " )";
        }
    }

    if (schema.type==="string"){
        if (schema.minLength !==undefined  && schema.maxLength !==undefined ){
            html = `${html} (${schema.minLength} to ${schema.maxLength} chars)`;
            //html = html+" ( length: " + schema.minLength + " to " + schema.maxLength +" )";
        }
        else if (schema.minLength!==undefined  && chema.maxLength===undefined ){
            html = `${html} (min:${schema.minLength})`;
            //html = html+" ( min-length: " + schema.minLength + " )";
        }
        else if (schema.minLength===undefined  && schema.maxLength!==undefined ){
            html = `${html} (max:${schema.maxLength})`;
            //html = html+" ( max-length: " + schema.maxLength +" )";
        }
    }

    if (overrideAttributes){
        if (overrideAttributes.readOnly){
            html = `${html} \u24C7`;
        }
        if (overrideAttributes.writeOnly){
            html = `${html} \u24CC`;
        }
        if (overrideAttributes.deprecated){
            html = `${html} \u274c`;
        }
    }
    else{
        if (schema.readOnly){
            html = `${html} \u24C7`;
        }
        if (schema.writeOnly){
            html = `${html} \u24CC`;
        }
        if (schema.deprecated){
            html = `${html} \u274c`;
        }
    }


    let lineBreak = inSingleLine?"":"<br/>";
    if (schema.format){
        html = html + ` ${lineBreak} (${schema.format})`;    
    }
    if (schema.pattern){
        html = html + ` ${lineBreak}(${schema.pattern})`;    
    }
    return html;
}


/* For changing JSON-Schema to a Object Model that can be represnted in a tree-view */ 
function schemaToModel (schema, obj) {
    if (schema==null){
        return;
    }
    if (schema.type==="object" || schema.properties){
        if (schema.description){
            obj[":description"] = schema.description;
        }
        for( let key in schema.properties ){
            obj[key] = schemaToModel(schema.properties[key],{});
        }
    }
    else if (schema.type==="array" || schema.items ){
        //let temp = Object.assign({}, schema.items );
        obj = [schemaToModel(schema.items,{})  ]
    }
    else if (schema.allOf ){
        if (schema.allOf.length===1){
            if (!schema.allOf[0]){
                return `string~|~${schema.description?schema.description:''}`;
            }
            else{
                let overrideAttrib = { 
                    "readOnly":schema.readOnly, 
                    "writeOnly":schema.writeOnly, 
                    "depricated":schema.deprecated
                };
                return `${ getTypeInfo(schema.allOf[0],overrideAttrib) }~|~${schema.description?schema.description:''}`
            }
        }

        // If allOf is an array of multiple elements, then they are the keys of an object
        let objWithAllProps = {};
        schema.allOf.map(function(v){
            if (v && v.properties){
                let partialObj = schemaToModel(v,{});
                Object.assign(objWithAllProps, partialObj);
            }
        });
        obj = objWithAllProps;
    }
    else{
        return `${getTypeInfo(schema)}~|~${schema.description?schema.description:''}`;
    }
    return obj;
}




/* Create Example object */
function generateExample(examples, example, schema, mimeType, outputType){
    let finalExamples = [];
    if (examples){
      for (let eg in examples){
        let egJson="";  
            //TODO: in case the mimeType is XML then parse it as XML
            //egJson = JSON.parse(examples[eg].value);
            finalExamples.push({
                "exampleType" : "json",
                "exampleValue": outputType==="text"?JSON.stringify(examples[eg].value,undefined,2):examples[eg].value
            });
        } 
    }
    else if (example){
        //TODO: in case the mimeType is XML then parse it as XML
        finalExamples.push({
            "exampleType" : "json",
            "exampleValue": outputType==="text"?JSON.stringify(example,undefined,2):example
        });
    }

    if (finalExamples.length==0 ){
      // If schema examples are not provided then generate one from Schema (only JSON fomat)
      if (schema){
        //TODO: in case the mimeType is XML then parse it as XML
        let egJson = schemaToObj(schema,{}, {includeReadOnly:true, includeWriteOnly:true, deprecated:true});
        finalExamples.push({
            "exampleType" : "json",
            "exampleValue": outputType==="text"?JSON.stringify(egJson,undefined,2):egJson
        });
      }
      else{
        // No Example or Schema provided   
        finalExamples.push({
            "exampleType" : "text",
            "exampleValue": "" 
        });
      }
    }
    return finalExamples;
}

/* For changing JSON-Schema to a Sample Object, as per the schema */ 
function schemaToObj (schema, obj, config={}) {
    if (schema==null){
        return;
    }
    if (schema.type==="object" || schema.properties){
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

        if (schema.allOf.length===1){
            if (!schema.allOf[0]){
                return "string";
            }
            else{
                return getSampleValueByType(schema.allOf[0]);
            }
        }
        let objWithAllProps = {};
        schema.allOf.map(function(v){
            if (v && v.type){
                let partialObj = schemaToObj(v,{}, config);
                Object.assign(objWithAllProps, partialObj);
            }
        });
        obj = objWithAllProps;
    }
    else{
        return getSampleValueByType(schema);
    }
    return obj;
}

function getSampleValueByType(schemaObj) {
    if (schemaObj.example) {
      return schemaObj.example;
    }

    if (Object.keys(schemaObj).length === 0) {
        return null;
    }

    const typeValue = schemaObj.format || schemaObj.type || (schemaObj.enum ? 'enum' : null);
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
            else {
                console.warn('Unknown schema value', schemaObj);
                return '?';
            }
    }
  }

function schemaToElTree(schema, obj, name) {
    if (schema.type==="object" || schema.properties){
        for( let key in schema.properties ){
            let temp = Object.assign({}, schema.properties[key] );
            if (schema.properties[key].type==="object" || schema.properties[key].properties){
                obj.push({
                    "label": {label:key , type:schema.properties[key].type, descr:schema.properties[key].description},
                    "children": schemaToElTree(temp, [], key)
                });
            }
            else if (schema.properties[key].type==="array" || schema.properties[key].items){
                let typeOfArr="";
                if (schema.properties[key].items.properties){
                    typeOfArr = "array of objects";
                }
                else {
                    typeOfArr = "array of " + schema.properties[key].items.type;
                }
                obj.push({
                    "label"   : {label:"[ "+key+" ]", type:typeOfArr, descr:schema.properties[key].description},
                    "children": schemaToElTree(temp, [], key)
                });
            }
            else{
                let typeOfField="";
                if (schema.properties[key].enum){
                    typeOfField = "Enum: " + schema.properties[key].enum.join(" | ");
                }
                else{
                    typeOfField = schema.properties[key].type;
                }
                obj.push({
                    "label": {label:key, type:typeOfField, descr:schema.properties[key].description},
                });
            }
        }
    }
    else if (schema.type==="array"){
        if (schema.items.type==="object" || schema.items.properties){
            let temp = Object.assign({}, schema.items);
            return schemaToElTree(temp, []);
        }
        else if (schema.items.type==="array"){
            obj.push({
                "label": {label:"[ "+schema.items.type+" ]", type:schema.items.type, descr:schema.items.description }
            });
        }
        else{
            return;
            /*
            obj.push({
                "label": {label:"["+schema.items.type+" ]", type:schema.items.type, descr:schema.items.description}
            });
            */
        }
    }
    else{
        obj.push({
            "label" : {label:name, type:schema.type, descr:schema.description}
        });
    }
    return obj;
}

function getBaseUrlFromUrl(url){
    let pathArray = url.split( '/' );
    return pathArray[0] + "//" + pathArray[2];
}

function removeCircularReferences(level=0) {
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


export { debounce, schemaToModel, schemaToObj, schemaToElTree, generateExample, getTypeInfo, getBaseUrlFromUrl, removeCircularReferences }