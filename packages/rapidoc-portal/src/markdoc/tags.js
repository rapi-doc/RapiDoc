import Markdoc from '@markdoc/markdoc';
import GithubSlugger from 'github-slugger';
import { operationMatchPattern } from './operation.js';

/**
 * Callout Banner Tag ({% callout type="info|tip|warning|danger" title="..." %})
 */
export const callout = {
  render: 'PortalCallout',
  attributes: {
    type: {
      type: String,
      default: 'info',
      matches: ['info', 'tip', 'warning', 'danger', 'caution', 'note'],
    },
    title: { type: String },
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);
    const calloutType = attributes.type || 'info';

    const headerTags = [];
    if (attributes.title) {
      headerTags.push(
        new Markdoc.Tag('div', { class: 'portal-callout-header' }, [
          new Markdoc.Tag('span', { class: 'portal-callout-title' }, [attributes.title]),
        ])
      );
    }

    return new Markdoc.Tag(
      'aside',
      {
        class: `portal-callout portal-callout-${calloutType}`,
        role: 'note',
        'data-type': calloutType,
      },
      [...headerTags, new Markdoc.Tag('div', { class: 'portal-callout-body' }, children)]
    );
  },
};

/**
 * Single Tab Panel Tag ({% tab name="cURL" %})
 */
export const tab = {
  render: 'PortalTab',
  attributes: {
    name: { type: String, required: true },
    label: { type: String },
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);
    const name = attributes.name || attributes.label || 'Tab';

    return new Markdoc.Tag(
      'div',
      {
        class: 'portal-tab-panel',
        role: 'tabpanel',
        'data-tab-name': name,
      },
      children
    );
  },
};

/**
 * Tabs Container Tag ({% tabs %} ... {% tab %} ... {% /tabs %})
 */
export const tabs = {
  render: 'PortalTabs',
  attributes: {},
  transform(node, config) {
    const tabChildren = node.children.filter((child) => child.tag === 'tab');
    const tabHeaders = [];
    const tabPanels = [];

    const slugger = new GithubSlugger();

    tabChildren.forEach((child, index) => {
      const tabName = child.attributes.name || child.attributes.label || `Tab ${index + 1}`;
      const tabId = slugger.slug(tabName);
      const isFirst = index === 0;

      // Tab Header Button
      tabHeaders.push(
        new Markdoc.Tag(
          'button',
          {
            type: 'button',
            role: 'tab',
            class: `portal-tab-btn ${isFirst ? 'active' : ''}`,
            'aria-selected': isFirst ? 'true' : 'false',
            'data-tab-id': tabId,
          },
          [tabName]
        )
      );

      // Tab Content Panel
      const panelContent = child.transformChildren(config);
      tabPanels.push(
        new Markdoc.Tag(
          'div',
          {
            role: 'tabpanel',
            class: `portal-tab-panel ${isFirst ? 'active' : 'hidden'}`,
            'data-tab-id': tabId,
          },
          panelContent
        )
      );
    });

    return new Markdoc.Tag(
      'div',
      {
        class: 'portal-tabs-container',
      },
      [
        new Markdoc.Tag('div', { class: 'portal-tab-bar', role: 'tablist' }, tabHeaders),
        new Markdoc.Tag('div', { class: 'portal-tab-panels' }, tabPanels),
      ]
    );
  },
};

/**
 * Single Step Tag ({% step title="..." %})
 */
export const step = {
  render: 'PortalStep',
  attributes: {
    title: { type: String, required: true },
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);

    return new Markdoc.Tag(
      'li',
      {
        class: 'portal-step',
      },
      [
        new Markdoc.Tag('div', { class: 'portal-step-marker' }),
        new Markdoc.Tag('div', { class: 'portal-step-content' }, [
          new Markdoc.Tag('h4', { class: 'portal-step-title' }, [attributes.title]),
          new Markdoc.Tag('div', { class: 'portal-step-body' }, children),
        ]),
      ]
    );
  },
};

/**
 * Steps Sequence Tag ({% steps %} ... {% /steps %})
 */
export const steps = {
  render: 'PortalSteps',
  attributes: {},
  transform(node, config) {
    const children = node.transformChildren(config);
    return new Markdoc.Tag('ol', { class: 'portal-steps-list' }, children);
  },
};

/**
 * Single Card Tag ({% card title="..." icon="..." href="..." %})
 */
export const card = {
  render: 'PortalCard',
  attributes: {
    title: { type: String, required: true },
    icon: { type: String },
    href: { type: String },
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);
    const tag = attributes.href ? 'a' : 'div';

    const header = [new Markdoc.Tag('h4', { class: 'portal-card-title' }, [attributes.title])];

    return new Markdoc.Tag(
      tag,
      {
        class: 'portal-card',
        ...(attributes.href ? { href: attributes.href } : {}),
      },
      [new Markdoc.Tag('div', { class: 'portal-card-header' }, header), new Markdoc.Tag('div', { class: 'portal-card-body' }, children)]
    );
  },
};

/**
 * Card Grid Tag ({% card-grid columns="3" %})
 */
export const cardGrid = {
  render: 'PortalCardGrid',
  attributes: {
    columns: { type: Number, default: 3 },
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);

    return new Markdoc.Tag(
      'div',
      {
        class: 'portal-card-grid',
        style: `--portal-grid-columns: ${attributes.columns || 3}`,
      },
      children
    );
  },
};

/**
 * Interactive RapiDoc Endpoint Tag ({% api-operation spec="..." path="..." method="..." %})
 * Embeds one operation as <rapi-doc-mini>. `spec` is an API id; pass `variables: { specUrls: { [id]: url } }`
 * to compileMarkdoc() to fill in its spec-url, and `variables: { oauthReceiver: '/oauth-receiver.html' }` for
 * its OAuth popup's return page. (Portal pages use components/ApiOperation.astro instead.)
 */
export const apiOperation = {
  render: 'PortalApiOperation',
  attributes: {
    spec: { type: String, required: true },
    path: { type: String, required: true },
    method: { type: String, default: 'get' },
    title: { type: String },
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    const methodUpper = (attributes.method || 'GET').toUpperCase();
    const methodLower = methodUpper.toLowerCase();
    const specUrl = config.variables?.specUrls?.[attributes.spec];
    const oauthReceiver = config.variables?.oauthReceiver;

    return new Markdoc.Tag(
      'div',
      {
        class: `portal-api-operation-embed method-${methodLower}`,
        'data-spec': attributes.spec,
        'data-path': attributes.path,
        'data-method': methodUpper,
      },
      [
        new Markdoc.Tag('div', { class: 'portal-api-op-header' }, [
          new Markdoc.Tag('span', { class: `portal-method-badge badge-${methodLower}` }, [methodUpper]),
          new Markdoc.Tag('code', { class: 'portal-op-path' }, [attributes.path]),
          new Markdoc.Tag('span', { class: 'portal-op-spec-pill' }, [attributes.spec]),
        ]),
        new Markdoc.Tag(
          'div',
          {
            class: 'portal-api-op-frame',
            'data-embed-endpoint': `${attributes.spec}:${methodUpper}:${attributes.path}`,
          },
          [
            new Markdoc.Tag('rapi-doc-mini', {
              ...(specUrl ? { 'spec-url': specUrl } : {}),
              ...(oauthReceiver ? { 'oauth-receiver': oauthReceiver } : {}),
              'match-paths': operationMatchPattern(methodLower, attributes.path),
              'match-type': 'regex',
              'paths-expanded': 'true',
              layout: 'column',
              'color-scheme': 'auto',
            }),
          ]
        ),
      ]
    );
  },
};

/**
 * Status or Method Badge Tag ({% badge variant="warning" text="..." %})
 */
export const badge = {
  render: 'PortalBadge',
  attributes: {
    text: { type: String, required: true },
    variant: { type: String, default: 'info' },
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    return new Markdoc.Tag(
      'span',
      {
        class: `portal-badge portal-badge-${attributes.variant || 'info'}`,
      },
      [attributes.text]
    );
  },
};

export const tags = {
  callout,
  tab,
  tabs,
  step,
  steps,
  card,
  'card-grid': cardGrid,
  'api-operation': apiOperation,
  badge,
};
