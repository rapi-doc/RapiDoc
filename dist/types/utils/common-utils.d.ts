import { RapiDocPath, RapiDocTag } from '@rapidoc-types';
import { OpenAPIV3 } from 'openapi-types';
export declare function debounce(this: unknown, fn: () => void, delay: number): (...args: any) => void;
export declare const invalidCharsRegEx: RegExp;
export declare const rapidocApiKey: string;
export declare function sleep(ms: number): Promise<unknown>;
export declare function copyToClipboard(data: string, e: MouseEvent): void;
export declare function getBaseUrlFromUrl(url: string): string;
export declare function wait(ms: number): Promise<unknown>;
export declare function componentIsInSearch(searchVal: string, component: {
    name: string;
}): boolean;
export declare function pathIsInSearch(searchVal: string, path: RapiDocPath, matchType?: string): boolean;
export declare function schemaKeys(schemaProps: OpenAPIV3.SchemaObject | undefined, result?: Set<unknown>): Set<unknown>;
export declare function advancedSearch(searchVal: string, allSpecTags: RapiDocTag[] | undefined, searchOptions?: string[]): {
    elementId: string;
    method: string;
    path: string;
    summary: string;
    deprecated?: boolean | undefined;
}[] | undefined;
export declare function downloadResource(url: string | undefined, fileName: string): void;
export declare function viewResource(url: string | undefined): void;
//# sourceMappingURL=common-utils.d.ts.map