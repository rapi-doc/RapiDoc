import { LitElement, TemplateResult } from 'lit';
import { NormalizedExample } from '../utils/schema-utils';
import './json-tree';
import './schema-tree';
import './tag-input';
import { OpenAPIV3 } from 'openapi-types';
import { RapiDocMethods, RapiDocSchema, RapiDocSecurityScheme } from '@rapidoc-types';
export default class ApiRequest extends LitElement {
    serverUrl?: string;
    servers?: OpenAPIV3.ServerObject[];
    method: RapiDocMethods;
    path?: string;
    security?: [];
    parameters?: (OpenAPIV3.ParameterObject & {
        'x-fill-example'?: string;
    })[];
    request_body?: OpenAPIV3.RequestBodyObject;
    api_keys?: RapiDocSecurityScheme[];
    parser?: object;
    accept?: string;
    callback?: string;
    webhook?: string;
    responseMessage: string | TemplateResult<1>;
    responseText: string;
    responseHeaders: string;
    responseStatus: string;
    responseUrl: string;
    curlSyntax: string;
    fillRequestFieldsWithExample?: string;
    allowTry?: string;
    showCurlBeforeTry?: string;
    renderStyle: 'read' | 'view' | 'focused';
    schemaStyle?: string;
    activeSchemaTab?: string;
    activeParameterSchemaTabs: any;
    schemaExpandLevel?: number;
    schemaDescriptionExpanded?: string;
    allowSchemaDescriptionExpandToggle?: string;
    schemaHideReadOnly?: string;
    schemaHideWriteOnly?: string;
    fetchCredentials?: 'include' | 'omit' | 'same-origin';
    activeResponseTab?: 'response' | 'headers' | 'curl';
    selectedRequestBodyType: string;
    selectedRequestBodyExample: string;
    responseIsBlob?: any;
    responseBlobUrl?: string | undefined;
    respContentDisposition: string;
    responseBlobType?: 'download' | 'view' | '';
    static get styles(): import("lit").CSSResult[];
    render(): TemplateResult<1>;
    updated(): Promise<void>;
    saveExampleState(): Promise<void>;
    updateExamplesFromDataAttr(): Promise<void>;
    renderExample(example: NormalizedExample, paramType: string, paramName: string): TemplateResult<1>;
    renderShortFormatExamples(examples: NormalizedExample[], paramType: string, paramName: string): TemplateResult<1>;
    renderLongFormatExamples(exampleList: NormalizedExample[], paramType: string, paramName: string): TemplateResult<1>;
    exampleListTemplate(paramName: string, paramType: string, exampleList?: NormalizedExample[]): TemplateResult<1>;
    inputParametersTemplate(paramType: 'path' | 'query' | 'header' | 'cookie'): "" | TemplateResult<1>;
    beforeNavigationFocusedMode(): Promise<void>;
    afterNavigationFocusedMode(): Promise<void>;
    onSelectExample(e: Event): void;
    onMimeTypeChange(e: Event): void;
    requestBodyTemplate(): "" | TemplateResult<1>;
    formDataParamAsObjectTemplate(fieldName: string, fieldSchema: RapiDocSchema, mimeType: string | string[]): TemplateResult<1>;
    formDataTemplate(schema: RapiDocSchema, mimeType: string, exampleValue?: string): TemplateResult<1>;
    curlSyntaxTemplate(display?: string): TemplateResult<1>;
    apiResponseTabTemplate(): TemplateResult<1>;
    apiCallTemplate(): TemplateResult<1>;
    onFillRequestData(e: Event): Promise<void>;
    onClearRequestData(e: Event): Promise<void>;
    buildFetchURL(requestPanelEl: HTMLElement): string;
    buildFetchHeaders(requestPanelEl: HTMLElement): Headers;
    buildFetchBodyOptions(requestPanelEl: HTMLElement): RequestInit;
    onTryClick(e: Event): Promise<void>;
    liveCURLSyntaxUpdate(requestPanelEl: HTMLElement): void;
    onGenerateCURLClick(e: Event): void;
    getRequestPanel(e: Event): Element | null;
    applyCURLSyntax(requestPanelEl: HTMLElement): void;
    generateCURLSyntax(fetchUrl: string, fetchHeaders: Headers, fetchOptions: RequestInit, requestPanelEl: HTMLElement): string;
    onAddRemoveFileInput(e: Event, pname: string, ptype: string): void;
    clearResponseData(): void;
    disconnectedCallback(): void;
}
//# sourceMappingURL=api-request.d.ts.map