import type { ReactElement } from "react";
import type { RapiDocOptions } from "@rapidoc/embed";

export interface RapidocReferenceProps {
  /** Name of a document given to the plugin's `apis`. */
  api?: string;
  /** The OpenAPI document itself, instead of `api`. */
  spec?: object;
  /** Attributes of `<rapi-doc>`, in kebab-case or camelCase. They win over the component's own. */
  options?: RapiDocOptions;
}

/** Draws an API reference with `<rapi-doc>` in a Docusaurus page. */
export declare function RapidocReference(props: RapidocReferenceProps): ReactElement;
export default RapidocReference;

/** The attributes the component sets before `options`. */
export declare const PAGE_ATTRIBUTES: Record<string, string>;
