/**
 * Markdoc config for documentation pages written in Markdoc (`.markdoc` / `.mdoc`), used by the
 * temp workspace's markdoc.config.mjs.
 *
 * It extends Starlight's Markdoc preset (aside, tabs/tabitem, steps, cardgrid, code, ...) and adds
 * the portal's tags, rendered with Starlight components so they look and behave like the rest of
 * the docs. The HTML versions of the same tags in tags.js back compileMarkdoc().
 */

import Markdoc from "@markdoc/markdoc";
import { component } from "@astrojs/markdoc/config";
import starlightMarkdoc from "@astrojs/starlight-markdoc";
import { CALLOUT_TYPES } from "../components/callout-types.js";
import { withBase } from "../components/base-path.js";

const portal = (name) => component("@rapidoc/portal/markdoc/components", name);
const starlight = (name) => component("@astrojs/starlight/components", name);

/**
 * Links and images with paths relative to the portal get the base path the portal is served under
 * (engine/base-links.js does the same for Markdown and MDX).
 */
function baseNodes(base) {
  if (!base) return {};
  const { link, image } = Markdoc.nodes;
  return {
    link: {
      ...link,
      transform(node, config) {
        const attributes = node.transformAttributes(config);
        return new Markdoc.Tag(
          "a",
          { ...attributes, href: withBase(attributes.href, base) },
          node.transformChildren(config),
        );
      },
    },
    image: {
      ...image,
      transform(node, config) {
        const attributes = node.transformAttributes(config);
        return new Markdoc.Tag("img", { ...attributes, src: withBase(attributes.src, base) }, []);
      },
    },
  };
}

/**
 * @param {{ base?: string }} [options] - base: the path the portal is served under ('' at the root)
 */
export function portalMarkdocConfig({ base = "" } = {}) {
  const preset = starlightMarkdoc();
  const { fence } = preset.nodes;
  return {
    extends: [preset],
    nodes: {
      ...baseNodes(base),
      // The code frame by default, as in Markdown (starlight-options.js): no empty terminal title bar.
      // `process` is Markdoc's own fence attribute (```md {% process=false %} shows tags without checking
      // them); Starlight's preset leaves it out, so the build would reject it as unknown.
      fence: {
        ...fence,
        attributes: {
          ...fence.attributes,
          frame: { ...fence.attributes.frame, default: "code" },
          process: { type: Boolean, render: false, default: true },
        },
      },
    },
    tags: {
      callout: {
        render: portal("Callout"),
        attributes: {
          type: { type: String, default: "info", matches: CALLOUT_TYPES },
          title: { type: String },
          icon: { type: String },
        },
      },
      // Starlight's Markdoc aside, drawn like {% callout %}
      aside: {
        render: portal("Callout"),
        attributes: {
          type: { type: String, default: "note", matches: CALLOUT_TYPES },
          title: { type: String },
          icon: { type: String },
        },
      },
      tabs: {
        render: portal("Tabs"),
        attributes: { syncKey: { type: String } },
      },
      tab: {
        render: portal("Tab"),
        attributes: { name: { type: String }, label: { type: String } },
      },
      steps: { render: portal("Steps") },
      step: {
        render: portal("Step"),
        attributes: { title: { type: String } },
      },
      card: {
        render: portal("Card"),
        attributes: {
          title: { type: String, required: true },
          icon: { type: String },
          href: { type: String },
        },
      },
      "card-grid": {
        render: starlight("CardGrid"),
        // `columns` is accepted for compatibility with the HTML tag; Starlight's grid sizes itself.
        attributes: { stagger: { type: Boolean }, columns: { type: Number } },
      },
      badge: {
        render: portal("Badge"),
        attributes: {
          text: { type: String, required: true },
          variant: { type: String, default: "info" },
          size: { type: String, matches: ["small", "medium", "large"] },
        },
      },
      "api-operation": {
        render: portal("ApiOperation"),
        selfClosing: true,
        attributes: {
          spec: { type: String, required: true },
          path: { type: String, required: true },
          method: { type: String, default: "get" },
          title: { type: String },
          version: { type: String },
        },
      },
    },
  };
}
