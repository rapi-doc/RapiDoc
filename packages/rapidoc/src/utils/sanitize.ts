/** Minimal typings for the (not yet in lib.dom) HTML Sanitizer API. */
type SetHtmlElement = HTMLElement & { setHTML: (html: string, options: { sanitizer: unknown }) => void };
type SanitizerWindow = Window & { Sanitizer?: new (config: unknown) => unknown };

export function sanitizeHTML(htmlString: unknown): string {
  if (typeof htmlString !== 'string') {
    return '';
  }

  // Use native Sanitizer API if supported
  if (typeof window !== 'undefined' && (window as SanitizerWindow).Sanitizer && (Element.prototype as SetHtmlElement).setHTML) {
    try {
      const el = document.createElement('div') as unknown as SetHtmlElement;
      const sanitizer = new (window as SanitizerWindow).Sanitizer!({ allowAttributes: { '*': ['*'] } });
      el.setHTML(htmlString, { sanitizer });
      return el.innerHTML;
    } catch {
      // If Sanitizer with options throws, fall through to fallback shim
    }
  }

  // Minimal shim for unsupported browsers to prevent basic XSS
  let doc: Document;
  if (typeof DOMParser !== 'undefined') {
    doc = new DOMParser().parseFromString(htmlString, 'text/html');
  } else {
    // Fallback for SSR/Node if needed, though this is primarily browser-side
    return htmlString;
  }

  // Remove script tags
  const scripts = doc.querySelectorAll('script');
  for (let i = scripts.length - 1; i >= 0; i--) {
    scripts[i].parentNode!.removeChild(scripts[i]);
  }

  // Remove on* attributes and javascript: URIs
  const allElements = doc.querySelectorAll('*');
  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i];
    for (let j = el.attributes.length - 1; j >= 0; j--) {
      const attr = el.attributes[j];
      const attrName = attr.name.toLowerCase();
      const attrValue = attr.value.toLowerCase();

      if (attrName.startsWith('on')) {
        el.removeAttribute(attr.name);
      } else if (
        (attrName === 'href' || attrName === 'src') &&
        (attrValue.includes('javascript:') || attrValue.includes('data:text/html'))
      ) {
        el.removeAttribute(attr.name);
      }
    }
  }

  return doc.body.innerHTML;
}
