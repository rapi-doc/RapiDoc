# Arazzo Workflow Diagrams

## Overview

Reads Arazzo 1.x documents and draws one workflow as an SVG string: the workflow's inputs and
outputs, its steps in order, the values passed between steps, and each step's success and failure
actions. The inputs box (each input's type, required flag, default and enum values; a string enum's type
reads `enum`, as `<rapi-doc>` labels it) and the
outputs table are the same in both views, which differ in the step boxes: `expanded` (the
default) lists each step's values with a keyword for where they come from (`input`, `step`,
`fixed`, `expr`), its checks (the success criteria, unnumbered), its actions as "condition →
what happens" under "On success · first match runs" / "On failure · first match runs", and the
outputs something reads; `compact` shows each step's name, method, path and number of checks,
with labelled value lines and no actions. Used by `<rapi-flow>` (`src/rapi-flow.ts`, bundled as `dist/rapidoc-flow-min.js`) and by
the build-time renderer (`@rapidoc/prerender`: `renderArazzoWorkflow`, `getFlowCss`).

Not owned here: running workflows (nothing here makes a request), the element's loading and
events (`src/rapi-flow.ts`), and the diagram's look (`src/styles/flow-styles.js`). `dist/rapidoc-min.js`
imports only the YAML-free modules `components.js`, `operations.js` and `refs.js`, through
`utils/mcp/workflows.js`, which compiles workflows into the MCP manifest; `parse.js` (the `yaml`
package) stays out of it.

## Interface

- `parseDocument(input)` [parse.js]: JSON or YAML text to an object; an object passes through.
  Throws on empty input or a non-object.
- `validateArazzo(doc) -> { level, path, message }[]` [parse.js]: structural checks the diagram
  relies on; an empty list means valid.
- `resolveComponentRef(doc, obj, kind)` [components.js, re-exported by parse.js]: `{ reference: "$components.<kind>.<name>" }`
  to the component, or null.
- `collectRefs(value)` [refs.js]: `$inputs`, `$steps` and `$workflows` expressions anywhere in a
  JSON value, distinct, in first-seen order.
- `indexOperations(openapi)`, `indexResolvedSpec(resolvedSpec)` (the same index from
  `<rapi-doc>`'s processed `tags[].paths[]`, webhooks skipped, the first entry kept for an
  operation with several tags), `resolveOperation(step, sources)` [operations.js]: operation lookup
  by operationId (plain or `$sourceDescriptions.<name>.` qualified) and by `operationPath`.
- `buildFlowGraph(doc, workflowId?, { sources })` [graph.js]: the graph the SVG draws; null when
  the workflow does not exist.
- `renderFlowDiagram(graph, { view, idPrefix, interactive }) -> { svg, legend }` [svg.js]:
  `legend` names the kinds of lines drawn (`seq`, `data`, `output`, `success`, `failure`);
  `renderFlowSvg` returns only the SVG. `actionLabel` (short: "✗ retry 3× after 2s (if)"),
  `actionSentence` (with criteria), `describeAction(action, checks, index)` (`{ when, does, name, tag }`, the
  wording of the expanded boxes; an action without criteria reads "checks
  fail" / "check fails" / "request fails" by the step's number of checks, or "otherwise" after
  other actions) and `escapeXml` are exported too.
- `renderArazzoWorkflow(arazzo, options)` [index.js]: parse, validate, index `options.sources`,
  build and draw in one call; returns `{ svg, legend, graph, problems, workflowIds }`.

## Invariants

- **No DOM, no network.** Text widths are estimated from character counts, so output is the same
  in Node and the browser and long labels are cut with `…` rather than measured.
- **OpenAPI is not dereferenced.** Only `paths.<path>.<method>.operationId` and `summary` are read,
  so an operation reached through a path-item `$ref` is not found.
- **Validation is structural.** It checks required fields, duplicate ids, exactly one of
  `operationId` / `operationPath` / `workflowId` per step, action types (retry only on failure),
  goto and `dependsOn` targets, and `$steps.<id>` references. It does not check expression syntax,
  `inputs` JSON Schema, or criteria.
- **Edges.** A data edge goes from a step to a later step (or to the outputs box) whenever a
  `$steps.<id>.outputs.<name>` expression appears in the later step's `parameters` or
  `requestBody` (or a workflow output). References to the same or an earlier step are not drawn.
  Edges into the outputs box are drawn gray, the others in the primary color. Compact: edges from
  one step with the same labels share a lane and arrive at the middle of the target step; edges
  into the outputs box carry no label and arrive at the step's group, as in expanded. Expanded: one lane per source step, starting at each of its Outputs rows
  that is read and branching to each line (a step binding, or the step's group heading in the
  outputs box) that reads one; no labels, since the lines name the value.
- **Step outputs.** Each step's `usedOutputs` are its outputs that a later step or the workflow
  reads. Expanded boxes end with an Outputs section listing them, the source shortened
  (`$response.body#/status` reads `response body /status`, the full expression a tooltip), and
  "+N unused" for the rest.
- **Outputs box.** A table in both views: the output names in one flat column (the workflow's
  result is a flat object), and on the right, under "From step", the step each group comes from,
  once per group, with a rule between groups. Groups follow the order each step first appears;
  outputs not taken from a step come last, their source kind (`input`, `fixed`, `expr`) in the
  step column. A step output whose name differs from the workflow output's follows as
  `← <name>`. A step's line arrives at its group's first row, beside the step name.
- **Step names** (box titles, the step in `step` value lines, the From step column) share one
  color, `--primary` mixed toward the text color so it passes 4.5:1 on light cards; variable
  names keep the text color.
- **Linking.** Step boxes carry `data-step-id`; output rows and value lines carry
  `data-from-step`, so a caller can highlight a step with everything it feeds (`<rapi-flow>` does
  on hover, with the `rf-linked` class). With `interactive`, those rows are also `rf-jump` links
  (the outputs box's step names focusable, `role="link"`) for a caller to scroll to the step.
- **Actions.** A step's actions are its own `onSuccess` / `onFailure`, then the workflow's
  `successActions` / `failureActions` (marked `inherited`) minus any the step overrides by `name`.
  The graph also lists the workflow's actions once as `workflowActions`. Compact shows no
  actions; expanded lists a step's own actions and the inherited ones in one list per outcome, in merge order, each with its name in parentheses after
  what it does; inherited ones also carry a `workflow` tag on the right. A runner takes the first action whose criteria match, so every action after
  one without criteria is marked `shadowed` (it never runs). Shadowed actions are left out of the
  boxes and draw no goto line; the graph's `warnings` (`{ level, path,
  message }`, one per step and outcome) name them, for author tooling;
  `<rapi-flow>` does not show them. Only `goto` with a `stepId` in the same workflow draws a line, from its action line
  (expanded) or the box's left edge (compact); `end`, `retry` and goto to a workflow draw none.
- **Details.** The graph carries more than the boxes show, for callers that render their own
  documentation: `inputDetails` (type,
  format, required, default, enum, description, from `inputs` or a `$ref` to
  `#/components/inputs/<name>`), each step's `parameters` (component references resolved, their
  `value` overriding), `requestBody`, `criteria` and `outputExprs`, and each output's `expr`.
  Each step's `bindings` are the values it sends: parameters by name and request body fields as
  `body.<path>` (objects flattened, arrays kept whole), each with a `source` (`input`, `step`,
  `expression` or `value`) and the steps it reads (`fromSteps`). Expanded boxes show at most ten.
  Input descriptions and step descriptions are tooltips (`<title>`) on their lines and boxes.
- **Next-step arrows.** A step falls through to the next one unless it has a success action of type
  `end` or `goto` without `criteria`; then no arrow is drawn into the next step, which is reached
  only through goto lines. The last step always gets an arrow into the outputs box.
- **Ids.** Marker ids are `<idPrefix>-<name>`; pages with several diagrams pass distinct prefixes.
  Steps carry `data-step-id`; with `interactive`, steps whose operation or workflow is known get
  `tabindex="0" role="button"` and the `rf-clickable` class.

## Side Effects

- None. `parseDocument` uses the `yaml` package, which is why `dist/rapidoc-flow-min.js` carries it.

## Verification

- `npm run test:unit` from the repo root; `tests/unit/arazzo-flow.test.js` covers parsing,
  validation, lookup, the graph and the SVG, using `docs/public/specs/petstore.arazzo.yaml`.
- The docs page `/examples/arazzo-flow` shows `<rapi-flow>` tied to a `<rapi-doc>`.
- After editing, `npm run lint` and `npm run format-fix`.
