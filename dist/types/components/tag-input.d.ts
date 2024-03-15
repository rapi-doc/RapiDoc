import { LitElement, TemplateResult } from 'lit';
export default class TagInput extends LitElement {
    placeholder?: string;
    value?: string[];
    render(): TemplateResult<1>;
    attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null): void;
    afterPaste(e: ClipboardEvent): void;
    afterKeyDown(e: KeyboardEvent): void;
    onBlur(e: Event): void;
    static get styles(): import("lit").CSSResult[];
}
//# sourceMappingURL=tag-input.d.ts.map