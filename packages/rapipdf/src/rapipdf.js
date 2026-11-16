import { DEFAULT_LOCALIZE } from "./core/localize.js";

const tmpl = document.createElement("template");
tmpl.innerHTML = `
  <style>
  :host{
    --primary-color:#0078d7;
    --border-radius:2px;
    --input-bg:#fff;
    --fg:#333;
    --primary-text:#fff;
    --font-size:13px;
    display:block;
    width:350px;
  }

  .spec-input {
    border-radius:var(--border-radius);
    border:1px solid var(--primary-color);
    background:var(--input-bg);
    font-size: inherit;
    color:var(--fg);
    transition: border .2s;
    outline: none;
    padding:6px 5px;
    box-sizing: border-box;
    flex:1;
  }
  .spec-input:focus {
    outline: 1px dotted var(--fg);
    outline-offset: -3px;
  }

  .btn-default {
    border-radius: 0 var(--border-radius) var(--border-radius) 0;
    font-size: 85%;
    font-weight: 600;
    display: inline-block;
    padding: 8px 16px;
    outline: none;
    outline-offset: -2px;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    background-color:var(--primary-color);
    color:var(--primary-text);
    border: 0px solid var(--primary-color);
    transition: background-color 0.2s;
    user-select: none;
    cursor: pointer;
  }
  .btn-default:focus{
    outline: 1px solid var(--primary-text);
  }
  .btn-default:disabled{
    opacity: 0.6;
    cursor: progress;
  }
  
  </style>
  <div style='display:flex; width:100%; height: 100%;'>
    <input  class="spec-input"  id="spec-url" type="text"  placeholder="Spec URL" value="" tabindex="0">
    <button class="btn-default" type="button" style="margin-left:-1px" tabindex="0">GENERATE PDF</button>
  </div>  
`;

/**
 * `<rapi-pdf>`: a spec URL field and a button that turns the spec into a PDF.
 *
 * Attributes: `spec-url`; `output` (`open` in a new tab, the default, or `download`) and `file-name`
 * for downloads; what goes in the PDF (`include-info`, `include-toc`, `include-security`,
 * `include-api-details`, `include-api-list`, `include-example`, `pdf-sort-tags`,
 * `pdf-schema-style`, `pdf-title`, `pdf-footer-text`, `pdf-primary-color`, `pdf-alternate-color`);
 * and the element's own look (`button-label`, `button-bg`, `button-color`, `input-bg`,
 * `input-color`, `hide-input`). Labels come as JSON in a `<template>` child.
 *
 * While a PDF is being made the element has the `generating` attribute and its button is disabled.
 *
 * @fires pdf-generated - a PDF was made; `detail.output` is "open", "download" or "blob"
 * @fires pdf-error - it could not be made; `detail.error` is the Error
 */
export class RapiPdf extends HTMLElement {
  constructor() {
    super(); // always call super() first in the constructor.
    const shadowRoot = this.attachShadow({ mode: "open" });
    const elFromTemplate = tmpl.content.cloneNode(true);
    this.inputEl = elFromTemplate.querySelector(".spec-input");
    this.btnEl = elFromTemplate.querySelector(".btn-default");

    // Initialize attributes if not defined
    shadowRoot.appendChild(elFromTemplate);

    // The same function objects are added and removed as listeners
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onButtonClick = () => this.generateFromUi();
    this.localize = { ...DEFAULT_LOCALIZE };
    this.pending = 0;
  }

  connectedCallback() {
    // Add Event Listeners
    this.inputEl.addEventListener("change", this.onChangeInput);
    this.inputEl.addEventListener("keyup", this.onKeyUp);
    this.btnEl.addEventListener("click", this.onButtonClick);
    let localizeObj = {};
    // Labels come as JSON in a <template> child
    const localizeStr = this.children[0]?.content?.textContent;
    if (localizeStr) {
      try {
        localizeObj = JSON.parse(localizeStr);
      } catch {
        localizeObj = {};
      }
    }

    this.localize = { ...DEFAULT_LOCALIZE, ...localizeObj };
  }

  disconnectedCallback() {
    // Remove Event Listeners
    this.inputEl.removeEventListener("change", this.onChangeInput);
    this.inputEl.removeEventListener("keyup", this.onKeyUp);
    this.btnEl.removeEventListener("click", this.onButtonClick);
  }

  static get observedAttributes() {
    return [
      "spec-url",
      "button-bg",
      "input-bg",
      "button-color",
      "input-color",
      "button-label",
      "hide-input",
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "spec-url":
        if (oldValue !== newValue) {
          this.inputEl.value = newValue;
          return true;
        }
        break;
      case "button-label":
        if (oldValue !== newValue) {
          this.btnEl.innerText = newValue;
          return true;
        }
        break;
      case "hide-input":
        if (oldValue !== newValue) {
          if (newValue === "true") {
            this.inputEl.style.display = "none";
            this.btnEl.style.borderRadius = "var(--border-radius)";
          } else {
            this.inputEl.style.display = "block";
            this.btnEl.style.borderRadius = "0 var(--border-radius) var(--border-radius) 0";
          }
          return true;
        }
        break;
      case "button-bg":
        this.btnEl.style.backgroundColor = newValue;
        this.inputEl.style.borderColor = newValue;
        return true;
      case "button-color":
        this.btnEl.style.color = newValue;
        return true;
      case "input-bg":
        this.inputEl.style.backgroundColor = newValue;
        return true;
      case "input-color":
        this.inputEl.style.color = newValue;
        return true;
      default:
        return true;
    }
    return true;
  }

  get specUrl() {
    return this.getAttribute("spec-url");
  }

  set specUrl(newSpecUrl) {
    this.setAttribute("spec-url", newSpecUrl);
  }

  onChangeInput(e) {
    this.specUrl = e.target.value;
  }

  onKeyUp(e) {
    if (e.keyCode === 13) {
      // In case of input keyup - first change event will fire which will set the new specUrl URL
      this.generateFromUi();
    }
  }

  /** generatePdf() for the button and the Enter key, where nobody awaits the result. */
  generateFromUi() {
    this.generatePdf().catch((err) => {
      console.error("RapiPdf: the PDF could not be generated", err);
    });
  }

  /** What the attributes ask for, as the options of buildDocDefinition. */
  pdfOptions() {
    const attr = (name) => this.getAttribute(name);
    return {
      pdfSortTags: attr("pdf-sort-tags") !== "false",
      pdfPrimaryColor: attr("pdf-primary-color"),
      pdfAlternateColor: attr("pdf-alternate-color"),
      pdfTitle: attr("pdf-title") === null ? "API Reference" : attr("pdf-title"),
      pdfSchemaStyle: attr("pdf-schema-style") === "table" ? "table" : "object",
      pdfFooterText: attr("pdf-footer-text") || "",
      includeInfo: attr("include-info") !== "false",
      includeToc: attr("include-toc") !== "false",
      includeSecurity: attr("include-security") !== "false",
      includeExample: attr("include-example") === "true",
      includeApiDetails: attr("include-api-details") !== "false",
      includeApiList: attr("include-api-list") === "true",
      localize: this.localize,
    };
  }

  /** The name a downloaded PDF gets: `file-name`, with .pdf added when it's missing. */
  get fileName() {
    const name = (this.getAttribute("file-name") || "api-reference").trim();
    return /\.pdf$/i.test(name) ? name : `${name}.pdf`;
  }

  /**
   * Runs one generation: marks the element busy, loads the generator on first use, and reports the
   * outcome as an event. `deliver` gets pdfmake's output object and does something with it.
   */
  async run(spec, output, deliver) {
    this.pending += 1;
    this.setAttribute("generating", "");
    this.btnEl.disabled = true;
    try {
      const source = spec ?? this.specUrl;
      if (source === null || source === undefined || source === "") {
        throw new Error("No spec: set spec-url or pass a spec to generatePdf()");
      }
      const { createPdfDocument } = await import("./generate.js");
      const result = await deliver(await createPdfDocument(source, this.pdfOptions()));
      this.dispatchEvent(
        new CustomEvent("pdf-generated", { detail: { output }, bubbles: true, composed: true }),
      );
      return result;
    } catch (error) {
      this.dispatchEvent(
        new CustomEvent("pdf-error", { detail: { error }, bubbles: true, composed: true }),
      );
      throw error;
    } finally {
      this.pending -= 1;
      if (this.pending === 0) {
        this.removeAttribute("generating");
        this.btnEl.disabled = false;
      }
    }
  }

  /**
   * Makes the PDF and opens it in a new tab, or downloads it when `output="download"`.
   * @param {string | object} [spec] a URL, spec text or a spec object; default: the `spec-url` attribute
   * @returns {Promise<void>} resolves when the PDF is open or the download has started
   */
  async generatePdf(spec) {
    let output = this.getAttribute("output") === "download" ? "download" : "open";
    // The tab is opened now, while the click that got us here still counts as the user's: after
    // the spec has loaded the browser would block it. Blocked anyway: the PDF is downloaded.
    let tab = null;
    if (output === "open") {
      tab = window.open("", "_blank");
      if (!tab) output = "download";
    }
    try {
      await this.run(spec, output, (pdf) =>
        output === "open" ? pdf.open(tab) : pdf.download(this.fileName),
      );
    } catch (error) {
      tab?.close();
      throw error;
    }
  }

  /**
   * Makes the PDF and returns it, without opening or downloading anything: for a page that shows
   * or uploads the PDF itself, or where new tabs are not allowed.
   * @param {string | object} [spec] a URL, spec text or a spec object; default: the `spec-url` attribute
   * @returns {Promise<Blob>}
   */
  getPdfBlob(spec) {
    return this.run(spec, "blob", (pdf) => pdf.getBlob());
  }
}

if (!customElements.get("rapi-pdf")) customElements.define("rapi-pdf", RapiPdf);

export default RapiPdf;
