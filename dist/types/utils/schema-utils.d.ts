import type { RapiDocExamples, RapiDocSchema } from '@rapidoc-types';
import type { OpenAPIV3 } from 'openapi-types';
export declare function getPrintableVal(val: unknown): string;
export declare function getTypeInfo(schema: OpenAPIV3.ReferenceObject | RapiDocSchema): {
    type: string;
    format: string;
    pattern: string;
    readOrWriteOnly: string;
    deprecated: string;
    examples?: {
        [media: string]: OpenAPIV3.ReferenceObject | OpenAPIV3.ExampleObject;
    } | undefined;
    example?: any;
    default: string;
    description: string;
    constrain: string;
    allowedValues?: string | number | boolean | undefined;
    arrayType: string;
    html: string;
} | undefined;
export declare function nestExampleIfPresent(example?: boolean | number | string | undefined | any): any;
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
export declare function normalizeExamples(examples: OpenAPIV3.MediaTypeObject['example'] | OpenAPIV3.MediaTypeObject['examples'], dataType?: string): NormalizedExamples;
export declare function anyExampleWithSummaryOrDescription(examples: OpenAPIV3.ExampleObject[]): boolean;
export declare function getSampleValueByType(schemaObj: RapiDocSchema): any;
export declare function json2xml(obj: any, level?: number): string;
export declare function schemaToSampleObj(schema: RapiDocSchema | undefined, config?: {
    includeReadOnly?: boolean;
    deprecated?: boolean;
    includeDeprecated?: boolean;
    includeWriteOnly?: boolean;
    useXmlTagForProp?: boolean;
}): any;
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
    [key: `::OPTION~${number}${string}`]: ObjectNotationSchema | undefined | string;
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
export declare function schemaInObjectNotation(schema: RapiDocSchema, obj: ObjectNotationSchema, level?: number, suffix?: string | number): ObjectNotationSchema | undefined | string;
export declare function generateExample(schema: RapiDocSchema, mimeType: string, examples?: RapiDocExamples | undefined, example?: string, includeReadOnly?: boolean, includeWriteOnly?: boolean, outputType?: string, includeGeneratedExample?: boolean): ({
    exampleId: string;
    exampleSummary: string;
    exampleDescription: string;
    exampleType: string;
    exampleValue: any;
    exampleFormat: string;
} | {
    exampleId: string;
    exampleSummary: any;
    exampleDescription: any;
    exampleType: string;
    exampleFormat: string;
    exampleValue: string;
})[];
export declare function getSchemaFromParam(param: OpenAPIV3.ParameterObject): [RapiDocSchema, null, null] | [RapiDocSchema, string | null, OpenAPIV3.MediaTypeObject | null] | [null, null, null];
//# sourceMappingURL=schema-utils.d.ts.map