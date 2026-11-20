export type NavPageKey =
  | "home"
  | "docs"
  | "showcase"
  | "quickstart"
  | "list"
  | "examples"
  | "api"
  | "guides"
  | "tests"
  | "sandbox"
  | "dry-run"
  | "other";

export interface NavItem {
  key: string;
  label: string;
  href: string;
  title?: string;
  pill?: string;
  matchKeys: NavPageKey[];
  matchPrefixes: string[];
}

// The header's links, after the Products menu (SiteNavbar). Home is the logo; Guides, Tests and the
// Sandbox are in the footer (SiteFooter).
export const NAV_LINKS: NavItem[] = [
  {
    key: "quickstart",
    label: "Quickstart",
    href: "/docs/get-started/quickstart/",
    matchKeys: ["quickstart"],
    matchPrefixes: ["/docs/get-started/quickstart"],
  },
  {
    key: "docs",
    label: "Docs",
    href: "/docs",
    matchKeys: ["docs"],
    matchPrefixes: ["/docs"],
  },
  {
    key: "api",
    label: "API",
    href: "/api",
    matchKeys: ["api"],
    matchPrefixes: ["/api"],
  },
  {
    key: "examples",
    label: "Examples",
    href: "/examples",
    matchKeys: ["examples"],
    matchPrefixes: ["/examples"],
  },
];

export function resolveActiveNavKey(
  pathname: string,
  activePage: NavPageKey = "other",
): NavPageKey {
  if (activePage !== "other") {
    return activePage;
  }
  if (pathname === "/") return "home";
  if (pathname.startsWith("/quickstart")) return "quickstart";
  if (pathname.startsWith("/api")) return "api";
  if (pathname.startsWith("/guides")) return "guides";
  if (pathname.startsWith("/examples")) return "examples";
  if (pathname.startsWith("/docs")) return "docs";
  if (pathname.startsWith("/tests")) return "tests";
  if (pathname.startsWith("/sandbox")) return "sandbox";
  return "other";
}

export function isNavActive(item: NavItem, currentKey: NavPageKey, pathname: string): boolean {
  if (currentKey !== "other") {
    return item.matchKeys.includes(currentKey);
  }
  if (item.href === "/") {
    return pathname === "/";
  }
  return item.matchPrefixes.some((prefix) => pathname.startsWith(prefix));
}
