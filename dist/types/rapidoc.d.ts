import { LitElement } from 'lit';
import { marked } from 'marked';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-http';
import 'prismjs/components/prism-csharp';
import { RapidocElement, RapiDocExamples, RapiDocSchema, RapiDocServer, ResolvedSpec } from '@rapidoc-types';
export default class RapiDoc extends LitElement implements RapidocElement {
    headingText?: string;
    gotoPath?: string;
    updateRoute?: 'true' | 'false';
    routePrefix?: string;
    specUrl?: string;
    sortTags?: string;
    generateMissingTags?: string;
    sortEndpointsBy?: string;
    specFile?: string;
    layout?: 'row' | 'column';
    renderStyle?: string;
    defaultSchemaTab?: 'schema' | 'model' | 'example';
    responseAreaHeight?: string;
    fillRequestFieldsWithExample?: 'true' | 'false';
    persistAuth?: 'true' | 'false';
    onNavTagClick?: 'show-description' | 'expand-collapse';
    schemaStyle?: 'tree' | 'table';
    schemaExpandLevel?: number;
    schemaDescriptionExpanded?: 'true' | 'false';
    schemaHideReadOnly?: 'default' | 'never';
    schemaHideWriteOnly?: 'default' | 'never';
    apiKeyName?: string;
    apiKeyLocation?: string;
    apiKeyValue?: string;
    defaultApiServerUrl?: string;
    serverUrl?: string;
    oauthReceiver?: string;
    showHeader?: 'true' | 'false';
    showSideNav?: 'true' | 'false';
    showInfo?: 'true' | 'false';
    allowAuthentication?: 'true' | 'false';
    allowTry?: 'true' | 'false';
    showCurlBeforeTry?: 'true' | 'false';
    allowSpecUrlLoad?: 'true' | 'false';
    allowSpecFileLoad?: 'true' | 'false';
    allowSpecFileDownload?: 'true' | 'false';
    allowSearch?: 'true' | 'false';
    allowAdvancedSearch?: 'true' | 'false';
    allowServerSelection?: 'true' | 'false';
    allowSchemaDescriptionExpandToggle?: 'true' | 'false';
    showComponents?: 'true' | 'false';
    pageDirection?: 'rtl' | 'ltr';
    theme?: 'dark' | 'light';
    bgColor?: string;
    textColor?: string;
    headerColor?: string;
    primaryColor?: string;
    fontSize?: 'default' | 'large';
    regularFont?: string;
    monoFont?: string;
    loadFonts?: string;
    cssFile?: string | null;
    cssClasses?: string;
    navBgColor?: string;
    navTextColor?: string;
    navHoverBgColor?: string;
    navHoverTextColor?: string;
    navAccentColor?: string;
    navAccentTextColor?: string;
    navActiveItemMarker?: string;
    navItemSpacing?: 'default' | 'relaxed' | 'compact';
    showMethodInNavBar?: 'false' | 'as-plain-text' | 'as-colored-text' | 'as-colored-block';
    usePathInNavBar?: 'true' | 'false';
    infoDescriptionHeadingsInNavBar?: 'true' | 'false';
    fetchCredentials?: '' | 'omit' | 'same-origin' | 'include';
    matchPaths?: string;
    matchType?: string;
    loading?: boolean;
    focusedElementId?: string;
    showAdvancedSearchDialog?: boolean;
    advancedSearchMatches?: {
        elementId: string;
        method: string;
        path: string;
        summary: string;
        deprecated?: boolean | undefined;
    }[];
    resolvedSpec?: ResolvedSpec | null;
    loadFailed?: boolean;
    showSummaryWhenCollapsed?: boolean;
    private isIntersectionObserverActive?;
    private intersectionObserver?;
    static fontSize: string;
    selectedServer?: RapiDocServer;
    timeoutId?: ReturnType<typeof setTimeout>;
    constructor();
    static get styles(): import("lit").CSSResult[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    infoDescriptionHeadingRenderer(): marked.Renderer<never>;
    render(): "" | import("lit-html").TemplateResult<1>;
    observeExpandedContent(): void;
    attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null): void;
    onSpecUrlChange(): void;
    onSpecFileChange(e?: Event): void;
    onFileLoadClick(): void;
    onSearchChange(e: Event): void;
    onClearSearch(): void;
    onShowSearchModalClicked(): void;
    onOpenSearchDialog(e: CustomEvent<HTMLElement>): Promise<void>;
    loadSpec(specUrl: string | null): Promise<void>;
    afterSpecParsedAndValidated(spec?: ResolvedSpec): Promise<void>;
    /**
     * Return the URL from where is served the RapiDoc component, removing any hash and route prefix
     */
    getComponentBaseURL(): string;
    /**
     * From the URL return the ID of the element whether it is in the hash or if used a router prefix without a hash
     */
    getElementIDFromURL(): string;
    replaceHistoryState(hashId: string): void;
    expandAndGotoOperation(elementId: string, scrollToElement?: boolean): void;
    isValidTopId(id: string): boolean;
    isValidPathId(id: 'overview' | 'servers' | 'auth'): true | import("@rapidoc-types").RapiDocTag | undefined;
    onIntersect(entries: IntersectionObserverEntry[]): void;
    handleHref(e: Event): void;
    /**
     * Called by
     *  - onClick of Navigation Bar
     *  - onClick of Advanced Search items
     *
     * Functionality:
     *  1. First deactivate IntersectionObserver
     *  2. Scroll to the element
     *  3. Activate IntersectionObserver (after little delay)
     *
    */
    scrollToEventTarget(event: MouseEvent | KeyboardEvent, scrollNavItemToView?: boolean): Promise<void>;
    scrollToPath(elementId: string, expandPath?: boolean, scrollNavItemToView?: boolean): Promise<void>;
    setHttpUserNameAndPassword(securitySchemeId: string, username: string, password: string): boolean;
    setApiKey(securitySchemeId: string, apiKeyValue: string): boolean;
    removeAllSecurityKeys(): void;
    setApiServer(apiServerUrl: string): boolean;
    onAdvancedSearch(ev: Event, delay: number): void;
    onSelectExample(_event: Event, _jSchemaBody: {
        elementId: string;
        name: string;
        schema: RapiDocSchema;
        examples: RapiDocExamples;
        example: string;
        selectedExample: string;
        description: string;
    }): void;
}
//# sourceMappingURL=rapidoc.d.ts.map