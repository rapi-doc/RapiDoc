import { LitElement, TemplateResult } from 'lit';
import { ObjectNotationSchema } from '../utils/schema-utils';
export default class SchemaTree extends LitElement {
    data?: ObjectNotationSchema;
    schemaExpandLevel: number;
    schemaDescriptionExpanded?: string;
    allowSchemaDescriptionExpandToggle?: string;
    schemaHideReadOnly?: string;
    schemaHideWriteOnly?: string;
    connectedCallback(): void;
    static get styles(): import("lit").CSSResult[];
    render(): TemplateResult<1>;
    generateTree(data: ObjectNotationSchema, dataType?: string, arrayType?: string, key?: string, description?: string, schemaLevel?: number, indentLevel?: number, readOrWrite?: string): TemplateResult<any> | undefined;
    handleAllEvents(e: MouseEvent): void;
    toggleObjectExpand(e: MouseEvent): void;
}
//# sourceMappingURL=schema-tree.d.ts.map