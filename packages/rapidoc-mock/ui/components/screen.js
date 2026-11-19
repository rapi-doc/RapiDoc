import { LitElement } from "lit";

/**
 * The base of the Mock UI's parts: an element that keeps its own state and draws into the app's shadow root, not
 * into one of its own, so the app's styles (`styles.js`) reach it. It takes no box of its own (`.screen` is
 * `display: contents`): what it draws is laid out as if the app had drawn it.
 *
 * Every part gets `app`, the `<rapidoc-mock-ui>` it belongs to, for the calls to the mock (`read` here, over
 * `app.call` and `app.run`) and for addresses (`app.href`). What a part shows of the app's state comes in as its own
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

  /**
   * Reads something from the mock for what the part shows now, and keeps the answer only if the part still shows
   * that: an answer for an operation or a resource that is no longer in view is dropped. Busy state and a
   * failure's banner are the app's (`app.run`).
   * @param {string} what - A name for this kind of read: a later read of the same kind supersedes it
   * @param {string} path - What follows `/__mock` (`app.call`)
   * @param {(answer: any) => void} keep - Stores the answer
   */
  read(what, path, keep) {
    this.reads ??= {};
    const mine = (this.reads[what] = Symbol(path));
    return this.app.run(async () => {
      const answer = await this.app.call(path);
      if (this.reads[what] === mine) keep(answer);
    });
  }
}
