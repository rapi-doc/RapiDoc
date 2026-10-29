import { customElement } from "lit/decorators.js";
import { OAUTH_CHANNEL, readOAuthReply } from "~/utils/oauth-utils";

/**
 * The OAuth return page's element: the provider sends the sign-in popup back here with a code (or, in the legacy
 * implicit flow, a token). It hands the reply to the page that opened the popup, which checks it (origin, popup
 * window, state) before using it, then removes it from the address bar and history.
 *
 * Two ways to reach the opener, both limited to this site's origin: `window.opener.postMessage`, and a
 * BroadcastChannel for when the provider's page cut the link to the opener (Cross-Origin-Opener-Policy).
 */
@customElement("oauth-receiver")
export default class OauthReceiver extends HTMLElement {
  connectedCallback() {
    const reply = readOAuthReply(window.location);
    if (!reply) {
      return;
    }
    window.history.replaceState(null, "", window.location.pathname);
    if (window.opener) {
      window.opener.postMessage(reply, window.location.origin);
    }
    if (typeof BroadcastChannel === "function") {
      const channel = new BroadcastChannel(OAUTH_CHANNEL);
      channel.postMessage(reply);
      channel.close();
    }
  }
}
