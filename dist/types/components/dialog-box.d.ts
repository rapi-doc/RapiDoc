import { LitElement } from 'lit';
export default class DialogBox extends LitElement {
    heading?: string | null;
    show?: string | null;
    static get styles(): import("lit").CSSResult[];
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null): void;
    render(): import("lit-html").TemplateResult<1>;
    onClose(): void;
}
//# sourceMappingURL=dialog-box.d.ts.map