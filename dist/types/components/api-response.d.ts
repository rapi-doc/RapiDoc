import { LitElement } from 'lit';
import { ObjectNotationSchema } from '../utils/schema-utils';
import './json-tree';
import './schema-tree';
import './schema-table';
import { OpenAPIV3 } from 'openapi-types';
import { RapiDocSchema } from '@rapidoc-types';
export default class ApiResponse extends LitElement {
    callback?: string;
    webhook?: string;
    responses?: {
        [key: string]: OpenAPIV3.ResponseObject;
    };
    parser?: object;
    schemaStyle?: string;
    renderStyle?: string;
    selectedStatus: string;
    selectedMimeType?: string;
    activeSchemaTab: 'example' | 'schema';
    schemaExpandLevel?: number;
    schemaDescriptionExpanded?: string;
    allowSchemaDescriptionExpandToggle?: string;
    schemaHideReadOnly?: string;
    schemaHideWriteOnly?: string;
    private headersForEachRespStatus;
    private mimeResponsesForEachStatus;
    static get styles(): import("lit").CSSResult[];
    render(): import("lit-html").TemplateResult<1>;
    resetSelection(): void;
    responseTemplate(): "" | import("lit-html").TemplateResult<1>;
    responseHeaderListTemplate(respHeaders: {
        name: string;
        description: string;
        schema: RapiDocSchema;
    }[]): import("lit-html").TemplateResult<1>;
    mimeTypeDropdownTemplate(mimeTypes: string[]): import("lit-html").TemplateResult<1>;
    onSelectExample(e: Event): void;
    mimeExampleTemplate(mimeRespDetails: {
        selectedExample: string;
        examples: {
            exampleId: string;
            exampleFormat: 'json';
            exampleSummary: string;
            exampleDescription: string;
            exampleValue: string;
        }[];
    }): import("lit-html").TemplateResult<1>;
    mimeSchemaTemplate(mimeRespDetails: {
        schemaTree: ObjectNotationSchema;
    }): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=api-response.d.ts.map