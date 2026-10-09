// CSS Custom Highlight API-based Syntax Highlighter using bundled TextMate grammars

import astro from 'microlighter/grammars/astro.js';
import bash from 'microlighter/grammars/bash.js';
import c from 'microlighter/grammars/c.js';
import cpp from 'microlighter/grammars/cpp.js';
import csharp from 'microlighter/grammars/csharp.js';
import cssGrammar from 'microlighter/grammars/css.js';
import go from 'microlighter/grammars/go.js';
import html from 'microlighter/grammars/html.js';
import java from 'microlighter/grammars/java.js';
import javascript from 'microlighter/grammars/javascript.js';
import json from 'microlighter/grammars/json.js';
import kotlin from 'microlighter/grammars/kotlin.js';
import markdown from 'microlighter/grammars/markdown.js';
import objectiveC from 'microlighter/grammars/objective-c.js';
import perl from 'microlighter/grammars/perl.js';
import php from 'microlighter/grammars/php.js';
import powershell from 'microlighter/grammars/powershell.js';
import python from 'microlighter/grammars/python.js';
import r from 'microlighter/grammars/r.js';
import ruby from 'microlighter/grammars/ruby.js';
import rust from 'microlighter/grammars/rust.js';
import svelte from 'microlighter/grammars/svelte.js';
import toml from 'microlighter/grammars/toml.js';
import tsx from 'microlighter/grammars/tsx.js';
import typescript from 'microlighter/grammars/typescript.js';
import vue from 'microlighter/grammars/vue.js';
import yaml from 'microlighter/grammars/yaml.js';
import type { Grammar, GrammarCaptures, GrammarRule } from 'microlighter/grammar.js';

const httpGrammar: Grammar = {
  scopeName: 'source.http',
  patterns: [
    {
      match: '^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS|TRACE|CONNECT)\\s+([^\\s]+)\\s+(HTTP\\/[0-9.]+)',
      captures: {
        1: { name: 'keyword.control.http' },
        2: { name: 'string.unquoted.http' },
        3: { name: 'keyword.other.http' },
      },
    },
    {
      match: '^(HTTP\\/[0-9.]+)\\s+([0-9]{3})(?:\\s+(.*))?',
      captures: {
        1: { name: 'keyword.other.http' },
        2: { name: 'constant.numeric.http' },
        3: { name: 'string.unquoted.http' },
      },
    },
    {
      match: '^([a-zA-Z0-9_-]+):\\s*(.*)',
      captures: {
        1: { name: 'support.type.property-name.http' },
        2: { name: 'string.unquoted.http' },
      },
    },
  ],
};

const grammars: Record<string, Grammar> = {
  astro,
  bash,
  c,
  cpp,
  csharp,
  css: cssGrammar,
  go,
  html,
  http: httpGrammar,
  java,
  javascript,
  json,
  kotlin,
  markdown,
  'objective-c': objectiveC,
  perl,
  php,
  powershell,
  python,
  r,
  ruby,
  rust,
  svelte,
  toml,
  tsx,
  typescript,
  vue,
  yaml,
};

const scopes = new Map<string, Grammar>();
Object.values(grammars).forEach((grammar) => {
  if (grammar?.scopeName) {
    scopes.set(grammar.scopeName, grammar);
  }
});

const languageAliases: Record<string, string> = {
  'c++': 'cpp',
  cs: 'csharp',
  curl: 'bash',
  js: 'javascript',
  jsx: 'javascript',
  markup: 'html',
  md: 'markdown',
  objc: 'objective-c',
  ps1: 'powershell',
  py: 'python',
  rb: 'ruby',
  sh: 'bash',
  shell: 'bash',
  svg: 'html',
  ts: 'typescript',
  xml: 'html',
  yml: 'yaml',
  zsh: 'bash',
};

interface RegexMatch extends RegExpExecArray {
  indices: [number, number][];
}
interface RuleContext {
  grammar: Grammar;
  rule: GrammarRule;
}
interface ClosingPattern {
  pattern: string;
  applyEndPatternLast?: boolean;
}
interface ScanResult {
  contentEnd: number;
  end: number;
  match: RegexMatch | null;
}

const noMatch = { indices: [[Infinity, Infinity]] } as unknown as RegexMatch;
const highlights = new Map<string, Highlight>();

const getCategory = (scope: string): string | undefined => {
  const parts = scope.split('.');
  const [first, second, third] = parts;
  const last = parts.at(-1);

  if (first === 'markup' && ['quote', 'inserted', 'deleted', 'raw'].includes(second)) return second;
  if (first === 'entity' && second === 'name') return third;
  if (scope.startsWith('constant.character.entity')) return 'character-entity';
  if (parts.includes('numeric')) return 'numeric';
  if (scope.startsWith('support.type.property-name')) return 'property';
  if (parts.includes('attribute-value')) return 'attribute-value';
  if (scope.startsWith('string.other.link')) return 'link';

  if (['doctype', 'at-rule', 'important', 'regexp', 'boolean', 'symbol', 'operator', 'attribute-name'].includes(last!)) return last;

  if (['comment', 'string', 'constant', 'storage', 'keyword', 'variable', 'punctuation', 'entity', 'support'].includes(first)) return first;
};

const addRange = (node: Text, start: number, end: number, scope: string): void => {
  const category = getCategory(scope);
  if (!category || start === end) return;

  const range = new Range();
  range.setStart(node, start);
  range.setEnd(node, end);

  if (!highlights.has(category)) {
    highlights.set(category, new Highlight());
  }
  highlights.get(category)!.add(range);
};

const addCaptures = (node: Text, match: RegexMatch, captures: GrammarCaptures = {}): void => {
  Object.entries(captures).forEach(([index, capture]) => {
    const offsets = match.indices[+index];
    if (offsets) addRange(node, offsets[0], offsets[1], capture.name);
  });
};

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const expandEnd = (pattern: string, beginMatch: RegexMatch): string =>
  pattern.replace(/\\(\d+)/g, (reference: string, index: string) =>
    beginMatch[index as unknown as number] === undefined ? reference : escapeRegex(beginMatch[index as unknown as number])
  );

interface RuleContext2 {
  grammar: Grammar;
  rules: GrammarRule[];
}

const getRules = (rule: GrammarRule | GrammarRule[] | undefined): GrammarRule[] => {
  if (!rule) return [];
  if (Array.isArray(rule)) return rule;
  if (rule.match || rule.begin || rule.include) return [rule];
  return rule.patterns || [];
};

const resolveInclude = (include: string, grammar: Grammar, baseGrammar: Grammar): RuleContext2 | null => {
  if (include === '$self') return { grammar, rules: grammar.patterns };
  if (include === '$base') return { grammar: baseGrammar, rules: baseGrammar.patterns };

  if (include[0] === '#') {
    return { grammar, rules: getRules(grammar.repository?.[include.slice(1)]) };
  }

  const [scopeName, repositoryName] = include.split('#');
  const includedGrammar = scopes.get(scopeName);
  if (!includedGrammar) return null;

  return {
    grammar: includedGrammar,
    rules: repositoryName ? getRules(includedGrammar.repository?.[repositoryName]) : includedGrammar.patterns,
  };
};

const expandRules = (
  rules: GrammarRule[],
  grammar: Grammar,
  baseGrammar: Grammar,
  activeIncludes: Set<string> = new Set()
): RuleContext[] => {
  const expanded: RuleContext[] = [];
  rules.forEach((rule) => {
    if (rule.include) {
      const includeKey = `${grammar.scopeName}:${rule.include}`;
      if (activeIncludes.has(includeKey)) return;

      const included = resolveInclude(rule.include, grammar, baseGrammar);
      if (!included) return;

      const nestedIncludes = new Set(activeIncludes);
      nestedIncludes.add(includeKey);
      expanded.push(...expandRules(included.rules, included.grammar, baseGrammar, nestedIncludes));
      return;
    }

    if (rule.match || (rule.begin && rule.end)) expanded.push({ grammar, rule });
  });

  return expanded;
};

const regexes = new Map<string, RegExp>();
let matches = new Map<string, RegexMatch>();

const exec = (pattern: string, node: Text, start: number, end: number): RegexMatch | null => {
  let match = matches.get(pattern);
  if (!match || match.indices[0][0] < start) {
    if (!regexes.has(pattern)) regexes.set(pattern, new RegExp(pattern, 'dgm'));
    const regex = regexes.get(pattern)!;
    regex.lastIndex = start;
    match = (regex.exec(node.data) as RegexMatch | null) || noMatch;
    matches.set(pattern, match);
  }

  return match.indices[0][0] < end && match.indices[0][1] <= end ? match : null;
};

const nextRule = (node: Text, contexts: RuleContext[], start: number, end: number): (RuleContext & { match: RegexMatch }) | null => {
  let winner: (RuleContext & { match: RegexMatch }) | null = null;
  contexts.forEach((context) => {
    const pattern = (context.rule.match || context.rule.begin)!;
    const match = exec(pattern, node, start, end);
    if (!match) return;

    if (!winner || match.indices[0][0] < winner.match.indices[0][0]) {
      winner = { ...context, match };
    }
  });

  return winner;
};

const scanRegion = (
  node: Text,
  rules: GrammarRule[],
  start: number,
  end: number,
  grammar: Grammar,
  baseGrammar: Grammar = grammar,
  closing: ClosingPattern | null = null
): ScanResult => {
  const contexts = expandRules(rules, grammar, baseGrammar);
  let cursor = start;

  while (cursor < end) {
    const candidate = nextRule(node, contexts, cursor, end);
    const endMatch = closing ? exec(closing.pattern, node, cursor, end) : null;
    const candidateStart = candidate?.match.indices[0][0] ?? Infinity;
    const endStart = endMatch?.indices[0][0] ?? Infinity;

    if (endMatch && (endStart < candidateStart || (endStart === candidateStart && !closing?.applyEndPatternLast))) {
      return { contentEnd: endStart, end: endMatch.indices[0][1], match: endMatch };
    }

    if (!candidate) return { contentEnd: end, end, match: null };

    const { rule, match, grammar: ruleGrammar } = candidate;
    if (rule.match) {
      if (rule.name) addRange(node, match.indices[0][0], match.indices[0][1], rule.name);
      addCaptures(node, match, rule.captures);
      cursor = match.indices[0][1] > cursor ? match.indices[0][1] : cursor + 1;
      continue;
    }

    const nested = scanRegion(node, rule.patterns || [], match.indices[0][1], end, ruleGrammar, baseGrammar, {
      pattern: expandEnd(rule.end!, match),
      applyEndPatternLast: rule.applyEndPatternLast,
    });

    if (rule.name) addRange(node, match.indices[0][0], nested.end, rule.name);
    if (rule.contentName) addRange(node, match.indices[0][1], nested.contentEnd, rule.contentName);
    addCaptures(node, match, rule.beginCaptures || rule.captures);
    if (nested.match) addCaptures(node, nested.match, rule.endCaptures || rule.captures);

    cursor = nested.end > cursor ? nested.end : cursor + 1;
  }

  return { contentEnd: end, end, match: null };
};

export const getLanguage = (codeBlock: HTMLElement): string => {
  const pre = codeBlock.parentElement;
  const getLangClass = (el: Element | null): string | null | undefined => {
    if (!el || !el.classList) return null;
    return [...el.classList].find((c: string) => c.startsWith('language-'))?.slice('language-'.length);
  };
  const lang =
    getLangClass(codeBlock) ||
    codeBlock.dataset?.language ||
    getLangClass(pre) ||
    pre?.dataset?.language ||
    pre?.getAttribute?.('lang') ||
    '';
  return lang.toLowerCase();
};

export const normalizeLanguage = (lang: string): string => languageAliases[lang] || lang;

export const getAllCodeBlocks = (rootNode: Document | ShadowRoot | Element = document): HTMLElement[] => {
  const blocks: HTMLElement[] = [];
  const visitedRoots = new Set<Node>();

  const traverse = (node: Document | ShadowRoot | Element | null): void => {
    if (!node || visitedRoots.has(node)) return;
    visitedRoots.add(node);

    if (node.querySelectorAll) {
      const codeEls = node.querySelectorAll('pre > code');
      blocks.push(...(codeEls as NodeListOf<HTMLElement>));

      const allChildren = node.querySelectorAll('*');
      for (let i = 0; i < allChildren.length; i++) {
        const child = allChildren[i];
        if (child.shadowRoot) {
          traverse(child.shadowRoot);
        }
      }
    }
  };

  traverse(rootNode);
  return blocks;
};

let highlightScheduled = false;

export const highlightAllCode = (rootNode: Document | ShadowRoot | Element = document): void => {
  if (typeof window === 'undefined' || typeof CSS === 'undefined' || !CSS.highlights) {
    return;
  }

  // Find all code blocks across the root and any nested shadow roots
  const codeBlocks = getAllCodeBlocks(rootNode).filter(getLanguage);
  if (codeBlocks.length === 0) return;

  // Clear previous ranges
  highlights.forEach((ranges, category) => {
    if (CSS.highlights.get(category) === ranges) CSS.highlights.delete(category);
    ranges.clear();
  });

  codeBlocks.forEach((codeBlock) => {
    const rawLang = getLanguage(codeBlock);
    const lang = normalizeLanguage(rawLang);
    const grammar = grammars[lang];
    if (!grammar) return;

    // Scan all text nodes without mutating or removing Lit marker comment nodes
    const textNodes = Array.from(codeBlock.childNodes).filter(
      (child) => child.nodeType === Node.TEXT_NODE && (child as Text).data?.length > 0
    ) as Text[];
    if (textNodes.length === 0) return;

    matches = new Map();
    textNodes.forEach((node) => {
      scanRegion(node, grammar.patterns, 0, node.data.length, grammar);
    });
  });

  highlights.forEach((ranges, category) => {
    if (ranges.size) CSS.highlights.set(category, ranges);
  });
};

export const scheduleHighlight = (rootNode: Document | ShadowRoot | Element = document): void => {
  if (highlightScheduled) return;
  highlightScheduled = true;
  requestAnimationFrame(() => {
    highlightScheduled = false;
    highlightAllCode(rootNode);
  });
};
