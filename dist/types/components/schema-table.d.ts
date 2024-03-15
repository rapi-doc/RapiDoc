import { LitElement, TemplateResult } from 'lit';
export default class SchemaTable extends LitElement {
    schemaExpandLevel: number;
    schemaDescriptionExpanded?: string;
    allowSchemaDescriptionExpandToggle?: string;
    schemaHideReadOnly?: string;
    schemaHideWriteOnly?: string;
    data?: any;
    connectedCallback(): void;
    static get styles(): import("lit").CSSResult[];
    render(): TemplateResult<1>;
    generateTree(data: any, dataType?: string, arrayType?: string, key?: string, description?: string, schemaLevel?: number, indentLevel?: number, readOrWrite?: string): any;
    handleAllEvents(e: MouseEvent): void;
    toggleObjectExpand(e: MouseEvent): void;
}
//# sourceMappingURL=schema-table.d.ts.map