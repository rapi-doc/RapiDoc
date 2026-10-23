/**
 * Markdoc config for documentation pages written in Markdoc (`.markdoc` / `.mdoc`), used by the
 * temp workspace's markdoc.config.mjs.
 *
 * It extends Starlight's Markdoc preset (aside, tabs/tabitem, steps, cardgrid, code, ...) and adds
 * the portal's tags, rendered with Starlight components so they look and behave like the rest of
 * the docs. The HTML versions of the same tags in tags.js back compileMarkdoc().
 */

import { component } from '@astrojs/markdoc/config';
import starlightMarkdoc from '@astrojs/starlight-markdoc';

const portal = (name) => component('@rapidoc/portal/markdoc/components', name);
const starlight = (name) => component('@astrojs/starlight/components', name);

export function portalMarkdocConfig() {
  return {
    extends: [starlightMarkdoc()],
    tags: {
      callout: {
        render: portal('Callout'),
        attributes: {
          type: { type: String, default: 'info', matches: ['info', 'tip', 'warning', 'danger', 'caution', 'note'] },
          title: { type: String },
        },
      },
      tabs: {
        render: portal('Tabs'),
        attributes: { syncKey: { type: String } },
      },
      tab: {
        render: portal('Tab'),
        attributes: { name: { type: String }, label: { type: String } },
      },
      steps: { render: portal('Steps') },
      step: {
        render: portal('Step'),
        attributes: { title: { type: String } },
      },
      card: {
        render: portal('Card'),
        attributes: { title: { type: String, required: true }, icon: { type: String }, href: { type: String } },
      },
      'card-grid': {
        render: starlight('CardGrid'),
        // `columns` is accepted for compatibility with the HTML tag; Starlight's grid sizes itself.
        attributes: { stagger: { type: Boolean }, columns: { type: Number } },
      },
      badge: {
        render: portal('Badge'),
        attributes: {
          text: { type: String, required: true },
          variant: { type: String, default: 'info' },
          size: { type: String, matches: ['small', 'medium', 'large'] },
        },
      },
      'api-operation': {
        render: portal('ApiOperation'),
        selfClosing: true,
        attributes: {
          spec: { type: String, required: true },
          path: { type: String, required: true },
          method: { type: String, default: 'get' },
          title: { type: String },
        },
      },
    },
  };
}
