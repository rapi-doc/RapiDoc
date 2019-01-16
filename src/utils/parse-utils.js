import SwaggerParser  from 'swagger-parser';
import converter from 'swagger2openapi';

export default function ProcessSpec(specUrl){
    let p;
    let options = {patch:true,warnOnly:true}
    if (typeof specUrl==="string"){
        p = converter.convertUrl(specUrl,options);
    }
    else{
        p = converter.convertObj(specUrl,options);
    }
    return p
    .then(function(api3Spec) {
        console.info("%c Convertion to OpenAPI 3.0 - Success !!! ","color:cornflowerblue");
        let parser = new SwaggerParser();
        return parser.validate(
            api3Spec.openapi, { 
                validate: {spec: false, schema:false } 
            }
        );
       /*
       return parser.bundle(
        api3Spec.openapi, { 
            validate: {spec: false, schema:false } 
            }
        );
        */

    })
    .then(function(deReffedSpec) {
        console.info("%c OpenAPI 3.0 Dereferencing - Success !!! ","color:cornflowerblue");
        let methods=['get','put','post','delete','patch','options','head'];
        let tags=[];
        let totalPathCount=0;
        // For each path find the tag and push it into the corrosponding tag
        for (let path in deReffedSpec.paths) {
            let commonParams = deReffedSpec.paths[path].parameters;
            let commonPathProp = {
                "summary"    : deReffedSpec.paths[path].summary,
                "description": deReffedSpec.paths[path].description,
                "servers"    : deReffedSpec.paths[path].servers?deReffedSpec.paths[path].servers:[],
                "parameters" : deReffedSpec.paths[path].parameters?deReffedSpec.paths[path].parameters:[]
            };
            methods.forEach(function(methodName){
                let tagObj;
                let tagText;
                let tagDescr;
                
                if (deReffedSpec.paths[path][methodName]){
                    let fullPath = deReffedSpec.paths[path][methodName];
                    // If path.methods are tagged, else generate it from path 
                    if(fullPath.tags){
                        tagText = fullPath.tags[0];
                        if (deReffedSpec.tags){
                            tagDescr = deReffedSpec.tags.find(function(v){
                                return (v.name === tagText)
                            });
                        }
                    }
                    else {
                        let firstWordEndIndex = path.indexOf("/",1);
                        if (firstWordEndIndex === -1){
                            firstWordEndIndex = (path.length-1);
                        }
                        else{
                            firstWordEndIndex=firstWordEndIndex-1;
                        }
                        tagText = path.substr(1,firstWordEndIndex);
                    }
                    tagObj = tags.find(v => v.name == tagText);

                    if (!tagObj){
                        tagObj = { 
                            show    : true,
                            "name"  : tagText,
                            "description" : tagDescr?tagDescr.description:"",
                            "paths" : []
                        }
                        tags.push(tagObj);
                    }

                    //Generate Path summary and Description if it is missing for a method
                    let summary = fullPath.summary?fullPath.summary:"";
                    let description = fullPath.description?fullPath.description:"";
                    if (!summary && description){
                        if (description.length > 100){
                            let charIndex = -1;
                            charIndex = description.indexOf("\n");
                            if (charIndex === -1 || charIndex > 100){
                                charIndex = description.indexOf(". ");
                            }
                            if (charIndex === -1 || charIndex > 100){
                                charIndex = description.indexOf(".");
                            }
                            if (charIndex === -1 || charIndex > 100){
                                summary = description;
                            }
                            else {
                                summary = description.substr(0, charIndex);
                            }
                        }
                        else{
                            summary = description;
                        }
                    }

                    // Merge Common Parameters with This methods parameters
                    let finalParameters =[];
                    if (commonParams){
                        if (fullPath.parameters){
                            finalParameters = commonParams.filter(commonParam => {
                                if (! fullPath.parameters.some(  param => (commonParam.name===param.name && commonParam.in===param.in)  )) {
                                return commonParam;
                                }
                            }).concat(fullPath.parameters)
                        }
                        else{
                            finalParameters =  commonParams.slice(0);
                        }
                    }
                    else{
                        finalParameters = fullPath.parameters? fullPath.parameters.slice(0):[];
                    }

                    //Update Responses
                    tagObj.paths.push({
                        "show"        : true,
                        "expanded"    : false,
                        "expandedAtLeastOnce":false,
                        "summary"     : summary,
                        "method"      : methodName,
                        "description" : fullPath.description,
                        "path"        : path,
                        "operationId" : fullPath.operationId,
                        "requestBody" : fullPath.requestBody,
                        "parameters"  : finalParameters,
                        "servers"     : fullPath.servers ? commonPathProp.servers.concat(fullPath.servers):commonPathProp.servers,
                        "responses"   : fullPath.responses,
                        "depricated"  : fullPath.deprecated,
                        "security"    : fullPath.security,
                        "commonSummary"     : commonPathProp.summary,
                        "commonDescription" : commonPathProp.description,
                    });
                    totalPathCount++;
                }
            }); // End of Methods

        }

        let securitySchemes={};
        let servers=[];

        securitySchemes = (deReffedSpec.components? deReffedSpec.components.securitySchemes:{});
        if (deReffedSpec.servers){
            deReffedSpec.servers.map(function(v){
                if (v.url && v.url.substr(0,1) === "/"){
                    let paths = specUrl.split("/");
                    v.url = paths[0]+"//"+paths[2]+v.url;
                }
            })
        }
        servers = deReffedSpec.servers;
        let parsedSpec = {
            "info"    : deReffedSpec.info,
            "tags"    : tags,
            "externalDocs": deReffedSpec.externalDocs,
            "securitySchemes": securitySchemes, 
            "servers" : servers, // In swagger 2, its generated from schemes, host and basePath properties
            "basePath": deReffedSpec.basePath, // Only available in swagger V2 
            "totalPathCount" : totalPathCount
        }
        return Promise.resolve(parsedSpec);
    })
    .catch(function(err) {
        console.error(err);
    });
    
}




export {convertSpec}
