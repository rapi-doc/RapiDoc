import Markdoc from '@markdoc/markdoc';
import GithubSlugger from 'github-slugger';

/**
 * Extracts plain text content from Markdoc node children.
 */
export function getNodeText(node) {
  let text = '';
  for (const child of node.children || []) {
    if (typeof child === 'string') {
      text += child;
    } else if (child.type === 'text') {
      text += child.attributes?.content || '';
    } else if (child.children) {
      text += getNodeText(child);
    }
  }
  return text.trim();
}

/**
 * Custom heading node that generates unique, URL-safe anchor IDs.
 */
export const heading = {
  children: ['inline'],
  attributes: {
    id: { type: String },
    level: { type: Number, required: true, default: 1 },
  },
  transform(node, config) {
    const slugger = config?.slugger || new GithubSlugger();
    const text = getNodeText(node);
    const id = node.attributes.id || slugger.slug(text);

    return new Markdoc.Tag(
      `h${node.attributes.level}`,
      {
        ...node.transformAttributes(config),
        id,
        class: `portal-heading portal-heading-${node.attributes.level}`,
      },
      node.transformChildren(config)
    );
  },
};

/**
 * Custom fence node (code block) that adds language identifiers and formatting classes.
 */
export const fence = {
  attributes: {
    content: { type: String, render: false, required: true },
    language: { type: String },
    title: { type: String },
  },
  transform(node) {
    const language = node.attributes.language || 'text';
    const content = node.attributes.content || '';
    const title = node.attributes.title || '';

    const titleTag = title ? [new Markdoc.Tag('div', { class: 'portal-code-title' }, [title])] : [];

    return new Markdoc.Tag('div', { class: 'portal-code-block' }, [
      ...titleTag,
      new Markdoc.Tag('div', { class: 'portal-code-wrapper' }, [
        new Markdoc.Tag(
          'pre',
          {
            class: `portal-pre language-${language}`,
            'data-language': language,
          },
          [
            new Markdoc.Tag(
              'code',
              {
                class: `portal-code language-${language}`,
              },
              [content]
            ),
          ]
        ),
      ]),
    ]);
  },
};
