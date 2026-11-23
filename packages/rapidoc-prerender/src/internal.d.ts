/**
 * `@rapidoc/prerender/internal`: used by the other RapiDoc packages. Not public API and not covered by
 * semver; the parsed model (`ResolvedSpec`) follows RapiDoc's parser and changes with it.
 */

import type { NavBarOptions, SpecOptions } from "./index.js";

/** The parsed model the templates render. Opaque: pass it on, don't read it. */
export type ResolvedSpec = Record<string, any>;

/**
 * Loads and parses a spec: a URL, a file path, JSON or YAML text, or an object. Throws when it cannot
 * be loaded or parsed ("file not found: <path>" for a path that is not a file).
 */
export function resolveSpecInput(
  specInput: string | object,
  options?: SpecOptions,
): Promise<ResolvedSpec>;

/** The sidebar's HTML from a parsed model; `getNavBarHtml` without loading the spec. */
export function renderNavBarHtml(resolvedSpec: ResolvedSpec, options?: NavBarOptions): string;

/** Serializes a Lit `TemplateResult` to HTML without a DOM. */
export function renderTemplateToString(result: any, options?: { stripComments?: boolean }): string;
export function escapeHtml(str: string): string;

/** The anchors of a spec's operations and tags, as `<rapi-doc>` computes them. */
export class OperationSlugger {
  reset(): void;
  slugOp(op: { method?: string; path?: string; operationId?: string; summary?: string }): string;
  slug(
    op: { method?: string; path?: string; operationId?: string; summary?: string },
    tagSlug?: string,
  ): string;
  slugTag(name: string): string;
  slugTagGroup(name: string): string;
}
