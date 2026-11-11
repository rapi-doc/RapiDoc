import type { DefineComponent } from "vue";
import type { RapiDocOptions } from "@rapidoc/embed";

/** Draws an API reference with `<rapi-doc>` in a VitePress page. */
export declare const RapidocReference: DefineComponent<{
  /** Name of a document given to `withRapidoc({ apis })`. */
  api?: string;
  /** The OpenAPI document itself, instead of `api`. */
  spec?: object;
  /** Attributes of `<rapi-doc>`, in kebab-case or camelCase. */
  options?: RapiDocOptions;
}>;
export default RapidocReference;

/** The attributes the component sets before `options`. */
export declare const PAGE_ATTRIBUTES: Record<string, string>;
