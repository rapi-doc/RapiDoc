import { LitElement } from "lit";

/**
 * The base of the Mock UI's parts: an element that keeps its own state and draws into the app's shadow root, not
 * into one of its own, so the app's styles (`styles.js`) reach it. It takes no box of its own (`.screen` is
 * `display: contents`): what it draws is laid out as if the app had drawn it.
 *
 * Every part gets `app`, the `<rapidoc-mock-ui>` it belongs to, for the calls to the mock (`app.call`,
 * `app.run`) and for addresses (`app.href`). What a part shows of the app's state comes in as its own
 * properties, so a change draws it again.
 */
export class Screen extends LitElement {
  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("screen");
  }
}
