/**
 * Arazzo support shared by <rapi-flow> and the build-time renderer (@rapidoc/prerender).
 */
import { parseDocument, validateArazzo } from "./parse.js";
import { indexOperations } from "./operations.js";
import { buildFlowGraph } from "./graph.js";
import { renderFlowDiagram } from "./svg.js";

export { parseDocument, validateArazzo, resolveComponentRef } from "./parse.js";
export { collectRefs } from "./refs.js";
export { indexOperations, indexResolvedSpec, resolveOperation } from "./operations.js";
export { buildFlowGraph } from "./graph.js";
export {
  renderFlowDiagram,
  renderFlowSvg,
  escapeXml,
  actionLabel,
  actionSentence,
  describeAction,
} from "./svg.js";

/**
 * One call from documents to SVG.
 *
 * @param {string|object} arazzo Arazzo text or object
 * @param {object} [options]
 * @param {string} [options.workflowId] defaults to the first workflow
 * @param {Record<string, string|object>} [options.sources] OpenAPI documents (text or object) by
 *   source description name; operations are looked up in them
 * @param {'expanded'|'compact'} [options.view] defaults to expanded
 * @param {string} [options.idPrefix]
 * @param {boolean} [options.interactive]
 * @returns {{ svg: string, legend: string[], legendHtml: string, graph: object|null,
 *   problems: object[], workflowIds: string[] }} `legend` names the kinds of lines drawn and
 *   `legendHtml` is their legend (see renderFlowDiagram)
 */
export function renderArazzoWorkflow(arazzo, options = {}) {
  const doc = parseDocument(arazzo);
  const problems = validateArazzo(doc);
  const sources = new Map();
  for (const [name, openapi] of Object.entries(options.sources || {})) {
    sources.set(name, indexOperations(parseDocument(openapi)));
  }
  const graph = buildFlowGraph(doc, options.workflowId, { sources });
  const { svg, legend, legendHtml } = renderFlowDiagram(graph, options);
  return {
    svg,
    legend,
    legendHtml,
    graph,
    problems,
    workflowIds: (doc.workflows || []).map((w) => w?.workflowId).filter(Boolean),
  };
}
