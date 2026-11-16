// The RapiDoc family: the Products menu in the navbar (SiteNavbar), the footer (SiteFooter) and the home
// page's family section (ProductFamily) read this. Each product links to its page (src/pages/<page>.astro;
// list new top-level ones in PRODUCT_PAGES of utils/pageTitle.ts), or to its docs where it has none.

/** A Phosphor icon name (https://phosphoricons.com), drawn by components/Icon.astro */
export type ProductIcon = string;

export interface ProductLink {
  label: string;
  href: string;
  /** One line, shown in the Products menu */
  description?: string;
  /** The element or command, shown in monospace next to the label */
  tag?: string;
  icon?: ProductIcon;
  /** On another site: opens in a new tab */
  external?: boolean;
}

export interface ProductGroup {
  key: string;
  label: string;
  items: ProductLink[];
}

export const WEB_COMPONENTS: ProductGroup = {
  key: "components",
  label: "Web Components",
  items: [
    {
      label: "RapiDoc",
      tag: "<rapi-doc>",
      href: "/docs/",
      description: "Interactive API reference from your OpenAPI spec",
      icon: "file-code",
    },
    {
      label: "RapiDoc Mini",
      tag: "<rapi-doc-mini>",
      href: "/rapidoc-mini/",
      description: "A few endpoints, with Try, inside a post or guide",
      icon: "puzzle-piece",
    },
    {
      label: "RapiFlow",
      tag: "<rapi-flow>",
      href: "/rapi-flow/",
      description: "Step through and run Arazzo workflows",
      icon: "path",
    },
    {
      label: "RapiPdf",
      tag: "<rapi-pdf>",
      href: "/rapipdf/",
      description: "Turn an OpenAPI spec into a PDF",
      icon: "file-pdf",
    },
  ],
};

export const TOOLS: ProductGroup = {
  key: "tools",
  label: "Tools",
  items: [
    {
      label: "Developer Portal",
      href: "https://portal.rapidocui.com/",
      description: "API references and guides as one site, with search and SSO",
      icon: "layout",
      external: true,
    },
    {
      label: "RapiDoc CLI",
      tag: "rapidoc",
      href: "/cli/",
      description: "Preview, validate, lint, bundle and export specs",
      icon: "terminal-window",
    },
    {
      label: "Mock Server",
      href: "/docs/mocking/overview/",
      description: "Answer requests from your spec, in the page or as a server",
      icon: "hard-drives",
    },
    {
      label: "MCP Server",
      href: "/docs/ai/mcp-server/",
      description: "Turn your API into tools for AI agents",
      icon: "robot",
    },
    {
      label: "Pre-rendering",
      href: "/docs/performance/prerender/",
      description: "Server-rendered HTML for search engines and a fast first paint",
      icon: "lightning",
    },
  ],
};

export const INTEGRATIONS: ProductGroup = {
  key: "integrations",
  label: "Integrations",
  items: [
    { label: "All integrations", href: "/integrations/" },
    { label: "React, Vue, Angular, Svelte", href: "/docs/integrations/front-end/" },
    { label: "Hono, Express, Fastify", href: "/docs/integrations/node/" },
    { label: "Starlight, VitePress, Docusaurus", href: "/docs/integrations/docs-sites/" },
    { label: "Python (FastAPI, Starlette)", href: "/docs/integrations/python/" },
    { label: ".NET (ASP.NET Core)", href: "/docs/integrations/dotnet/" },
    { label: "Go (net/http)", href: "/docs/integrations/go/" },
    { label: "Build an integration", href: "/docs/integrations/build-your-own/" },
  ],
};

export const PRODUCT_GROUPS: ProductGroup[] = [WEB_COMPONENTS, TOOLS, INTEGRATIONS];

/** The link under the Products menu's columns */
export const ALL_PACKAGES: ProductLink = {
  label: "Which package do I need?",
  href: "/docs/get-started/packages/",
};
