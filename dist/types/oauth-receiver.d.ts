import { LitElement } from 'lit';
export default class OauthReceiver extends LitElement {
    connectedCallback(): void;
    /**
     * Read OAuth2 parameters and sends them off
     * to the window opener through `window.postMessage`.
     */
    receiveAuthParms(): void;
    relayAuthParams(e: any): void;
    parseQueryString(queryString: string, key: string): string;
}
//# sourceMappingURL=oauth-receiver.d.ts.map