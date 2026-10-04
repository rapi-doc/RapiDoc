export type NavPageKey =
  | 'home'
  | 'docs'
  | 'showcase'
  | 'quickstart'
  | 'list'
  | 'examples'
  | 'api'
  | 'guides'
  | 'tests'
  | 'sandbox'
  | 'dry-run'
  | 'other';

export interface NavItem {
  key: string;
  label: string;
  href: string;
  title?: string;
  pill?: string;
  matchKeys: NavPageKey[];
  matchPrefixes: string[];
}

export const NAV_LINKS: NavItem[] = [
  {
    key: 'home',
    label: 'Home',
    href: '/',
    matchKeys: ['home'],
    matchPrefixes: ['/'],
  },
  {
    key: 'quickstart',
    label: 'QuickStart',
    href: '/quickstart',
    matchKeys: ['quickstart'],
    matchPrefixes: ['/quickstart'],
  },
  {
    key: 'api',
    label: 'API',
    href: '/api',
    matchKeys: ['api'],
    matchPrefixes: ['/api'],
  },
  {
    key: 'guides',
    label: 'Guides',
    href: '/guides',
    matchKeys: ['guides'],
    matchPrefixes: ['/guides'],
  },
  {
    key: 'showcase',
    label: 'Showcase',
    href: '/showcase',
    matchKeys: ['showcase', 'examples', 'list'],
    matchPrefixes: ['/showcase', '/examples'],
  },
  {
    key: 'docs',
    label: 'Docs',
    href: '/docs',
    matchKeys: ['docs'],
    matchPrefixes: ['/docs'],
  },
  {
    key: 'tests',
    label: 'Tests',
    href: '/tests',
    matchKeys: ['tests'],
    matchPrefixes: ['/tests'],
  },
  {
    key: 'sandbox',
    label: 'Sandbox',
    href: '/sandbox',
    title: 'Developer Spec Sandbox',
    pill: 'DEV',
    matchKeys: ['sandbox', 'dry-run'],
    matchPrefixes: ['/sandbox', '/dry-run', '/dryrun'],
  },
];

export function resolveActiveNavKey(pathname: string, activePage: NavPageKey = 'other'): NavPageKey {
  if (activePage !== 'other') {
    return activePage;
  }
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/quickstart')) return 'quickstart';
  if (pathname.startsWith('/api')) return 'api';
  if (pathname.startsWith('/guides')) return 'guides';
  if (pathname.startsWith('/showcase') || pathname.startsWith('/examples')) return 'showcase';
  if (pathname.startsWith('/docs')) return 'docs';
  if (pathname.startsWith('/tests')) return 'tests';
  if (pathname.startsWith('/sandbox') || pathname.startsWith('/dry-run') || pathname.startsWith('/dryrun')) return 'sandbox';
  return 'other';
}

export function isNavActive(item: NavItem, currentKey: NavPageKey, pathname: string): boolean {
  if (currentKey !== 'other') {
    return item.matchKeys.includes(currentKey);
  }
  if (item.href === '/') {
    return pathname === '/';
  }
  return item.matchPrefixes.some((prefix) => pathname.startsWith(prefix));
}
