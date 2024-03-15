import { LitElement, TemplateResult } from 'lit';
export default class JsonTree extends LitElement {
    data?: any;
    renderStyle?: string;
    static get styles(): import("lit").CSSResult[];
    render(): TemplateResult<1>;
    generateTree(data: any, isLast?: boolean): TemplateResult<1>;
    toggleExpand(e: MouseEvent): void;
}
//# sourceMappingURL=json-tree.d.ts.map