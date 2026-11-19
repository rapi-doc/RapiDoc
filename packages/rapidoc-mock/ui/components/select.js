/**
 * `<rapidoc-mock-select>`: a choice of one from a list, drawn by the app (the browser's own list of a `<select>`
 * takes the system's look, not the Mock UI's). A button that names the choice, and a list under it.
 *
 * Properties: `options` (`[{ value, label, hint }]`, `hint` a short note at the right of a row, as an API's
 * path), `value` (the one chosen) and `label` (what is chosen, for a screen reader). A pick sends a `change`
 * event whose `detail` is the value.
 *
 * Keys, as a select's: Enter, Space or an arrow opens it; the arrows, Home and End move; Enter or Space picks;
 * Esc or Tab closes; a letter goes to the next option that starts with it. The focus stays on the button
 * (`aria-activedescendant` names the option the keys are on).
 */
import { LitElement, html, nothing } from "lit";
import { icon } from "../icons.js";

let count = 0;

export class MockSelect extends LitElement {
  static properties = {
    options: { attribute: false },
    value: { type: String },
    label: { type: String },
    open: { state: true },
    /** The index of the option the keys are on while the list is open. */
    active: { state: true },
  };

  constructor() {
    super();
    this.options = [];
    this.value = "";
    this.label = "";
    this.open = false;
    this.active = 0;
    this.uid = `select-${++count}`;
    // a press anywhere else closes the list
    this.onOutside = (event) => {
      if (this.open && !event.composedPath().includes(this)) this.open = false;
    };
  }

  /** Draws into the app's shadow root, so the app's styles reach it. */
  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("select");
    document.addEventListener("pointerdown", this.onOutside);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("pointerdown", this.onOutside);
  }

  updated(changed) {
    // the option the keys are on stays in view in a long list
    if (this.open && (changed.has("active") || changed.has("open")))
      this.querySelector(`#${this.uid}-${this.active}`)?.scrollIntoView({ block: "nearest" });
  }

  get chosen() {
    return Math.max(
      0,
      this.options.findIndex((one) => one.value === this.value),
    );
  }

  show() {
    this.active = this.chosen;
    this.open = true;
  }

  pick(index) {
    const one = this.options[index];
    this.open = false;
    if (!one || one.value === this.value) return;
    this.dispatchEvent(new CustomEvent("change", { detail: one.value }));
  }

  onKey(event) {
    const last = this.options.length - 1;
    const { key } = event;
    if (!this.open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(key)) {
        event.preventDefault();
        this.show();
      }
      return;
    }
    if (key === "Escape" || key === "Tab") {
      this.open = false;
      // Esc closes the list and nothing else (a drawer behind it stays)
      if (key === "Escape") event.stopPropagation();
      return;
    }
    const to = {
      ArrowDown: Math.min(last, this.active + 1),
      ArrowUp: Math.max(0, this.active - 1),
      Home: 0,
      End: last,
    }[key];
    if (to !== undefined) {
      event.preventDefault();
      this.active = to;
    } else if (key === "Enter" || key === " ") {
      event.preventDefault();
      this.pick(this.active);
    } else if (key.length === 1) {
      // a letter: the next option that starts with it, from the one after the current
      const letter = key.toLowerCase();
      const order = this.options.map((_, index) => (this.active + 1 + index) % this.options.length);
      const next = order.find((index) =>
        this.options[index].label.toLowerCase().startsWith(letter),
      );
      if (next !== undefined) this.active = next;
    }
  }

  render() {
    const current = this.options[this.chosen];
    return html`
      <button
        class="select-button"
        role="combobox"
        aria-haspopup="listbox"
        aria-label=${this.label}
        aria-expanded=${String(this.open)}
        aria-controls="${this.uid}-list"
        aria-activedescendant=${this.open ? `${this.uid}-${this.active}` : nothing}
        @click=${() => (this.open ? (this.open = false) : this.show())}
        @keydown=${this.onKey}
      >
        <span class="select-value">${current?.label ?? ""}</span>
        ${icon("descending", 14)}
      </button>
      <ul class="select-list" id="${this.uid}-list" role="listbox" aria-label=${this.label} ?hidden=${!this.open}>
        ${this.options.map(
          (one, index) => html`
            <li
              id="${this.uid}-${index}"
              role="option"
              class=${index === this.active ? "active" : ""}
              aria-selected=${String(one.value === this.value)}
              @pointermove=${() => (this.active = index)}
              @click=${() => this.pick(index)}
            >
              <span class="select-label">${one.label}</span>
              ${one.hint ? html`<span class="select-hint">${one.hint}</span>` : nothing}
            </li>
          `,
        )}
      </ul>
    `;
  }
}

customElements.define("rapidoc-mock-select", MockSelect);
