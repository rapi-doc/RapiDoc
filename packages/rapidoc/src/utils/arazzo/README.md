# Arazzo Workflow Diagrams

## Overview

Reads Arazzo 1.x documents and draws one workflow as an SVG string: the workflow's inputs and
outputs, its steps in order, the values passed between steps, and each step's success and failure
actions. The inputs box (each input's type, required flag, default and enum values; a string enum's type
reads `enum`, as `<rapi-doc>` labels it) and the
outputs box are the same in both views, which differ in the step boxes: `expanded` (the
default) lists each step's values under a heading per location (Path params, Query params,
Header params, Cookie params, Request body with its content type; body fields without their `body.` prefix) with a keyword for
where they come from (`input`, `← from` for a step's output, `const` for a literal, `expr`; the `←` in a column
of its own, so values passed in from an earlier step stand apart), its checks (the success criteria,
unnumbered), its actions that draw no line as "condition → what happens" under "On success" /
"On failure", each heading saying when it applies ("· if all checks pass" / "· if any check fails", or "the check" with one check; a step succeeds only when all its checks pass), with "· first match runs" when the step has more than one action for that outcome; an action
without criteria that comes first has no condition (the heading says when it applies), and an
`end` reads as an END pill (red on failure, green on success); a step with no failure action
(its own or inherited) gets an "On failure" section with an outlined END pill and "(default)",
Arazzo's default being to end the workflow (no success action shows nothing: the next-step arrow
says it), and the outputs something reads; `compact` shows each step's name, method, path, number of checks
and the same value sections, without checks, actions or outputs. Neither view draws lines for
values passed between steps: each value names the step it comes from. Used by `<rapi-flow>` (`src/rapi-flow.ts`, bundled as `dist/rapidoc-flow-min.js`) and by
the build-time renderer (`@rapidoc/prerender`: `renderArazzoWorkflow`, `getFlowCss`).

Not owned here: running workflows (nothing here makes a request), the element's loading and
events (`src/rapi-flow.ts`), and the diagram's look (`src/styles/flow-styles.js`). `dist/rapidoc-min.js`
imports only the YAML-free modules `actions.js`, `components.js`, `operations.js` and `refs.js`, through
`utils/mcp/workflows.js`, which compiles workflows into the MCP manifest; `parse.js` (the `yaml`
package) stays out of it.

## Interface

- `parseDocument(input)` [parse.js]: JSON or YAML text to an object; an object passes through.
  Throws on empty input or a non-object.
- `validateArazzo(doc) -> { level, path, message }[]` [parse.js]: structural checks the diagram
  relies on; an empty list means valid.
- `resolveComponentRef(doc, obj, kind)` [components.js, re-exported by parse.js]: `{ reference: "$components.<kind>.<name>" }`
  to the component, or null.
- `readCriteria(list)`, `readActions(doc, list, kind)`, `mergeActions(own, inherited)`,
  `ACTION_TYPES` [actions.js]: criteria and actions as written, read once for the diagram
  (`graph.js`, which adds `outcome`, `conditional`, `inherited` and `shadowed`) and the MCP
  compiler (`utils/mcp/workflows.js`, which reports what its runtime cannot run and defaults the
  retry fields). References are resolved, unknown action types and criteria without a condition
  left out, criterion `type` defaulted to "simple", and each entry keeps its `index` in the list
  as written, for problem paths. `mergeActions` is the order a runner checks: the step's own, then
  the workflow's it does not override by `name`.
- `collectRefs(value)` [refs.js]: `$inputs`, `$steps` and `$workflows` expressions anywhere in a
  JSON value, distinct, in first-seen order.
- `indexOperations(openapi)`, `indexResolvedSpec(resolvedSpec)` (the same index from
  `<rapi-doc>`'s processed `tags[].paths[]`, webhooks skipped, the first entry kept for an
  operation with several tags), `resolveOperation(step, sources)` [operations.js]: operation lookup
  by operationId (plain or `$sourceDescriptions.<name>.` qualified) and by `operationPath`.
- `buildFlowGraph(doc, workflowId?, { sources })` [graph.js]: the graph the SVG draws; null when
  the workflow does not exist.
- `renderFlowDiagram(graph, { view, idPrefix, interactive, stepClasses }) -> { svg, legend }` [svg.js]:
  `minScale` (0.85 for 85%) sets the SVG's `min-width`, so with the flow CSS's `max-width: 100%`
  it shrinks to fit a narrower container only that far and the container scrolls past it
  (`<rapi-flow>` uses 0.85); `stepClasses` adds classes to step boxes by step id (`<rapi-flow>` marks the selected step and
  the running one, `rf-selected` / `rf-running`, this way);
  `legend` names the kinds of lines drawn (`seq`, `success`, `failure`, `retry`). Neither
  `<rapi-flow>` nor the portal shows a legend: the colors (next step and goto on success green, goto
  on failure red, retry orange) and the line labels say it;
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
- **Edges.** The graph's `dataEdges` go from a step to a later step (or to the outputs box)
  whenever a `$steps.<id>.outputs.<name>` expression appears in the later step's `parameters` or
  `requestBody` (or a workflow output), for callers. The diagram draws none: each value line in a
  step box or the outputs box names the step it comes from (`← from <step>.<output>`).
- **API sources.** The graph's `sources` are the document's `sourceDescriptions` as written
  (`{ name, type, url }`, type defaulting to `openapi`). The first box lists them under "API
  sources" (`rf-src-type`, `rf-src-url`), with the inputs below a rule under an "Inputs" heading;
  without sources the box is the inputs under its own "Inputs" title.
- **Step outputs.** Each step's `usedOutputs` are its outputs that a later step or the workflow
  reads. Expanded boxes end with an Outputs section listing them, the source shortened
  (`$response.body#/status` reads `response body /status`, the full expression a tooltip), and
  "+N unused" for the rest.
- **Outputs box.** The same in both views: one row per output, read as a step's value lines are:
  the output's name, then `← <step>.<output>` for a step's output (the step in the step color,
  no `from` keyword, no step column), or the source keyword and value (`input`, `const`, `expr`)
  with the `←` column blank. Rows are grouped by step, in the order each step first appears, with
  a rule between groups; outputs not taken from a step come last.
- **Arrows in rows.** The `←` before a value from a step is in the step color. The `→` after an
  action's condition is in the color of what it leads to, as the action's line or END pill:
  orange for a retry, green on success, red on failure (`rf-act-arrow rf-<kind>`).
- **Step names** (box titles, the step in `←` value lines in step boxes and the outputs box) share one
  color, `--primary` mixed toward the text color so it passes 4.5:1 on light cards; variable
  names keep the text color.
- **Linking.** Step boxes carry `data-step-id`; output rows and value lines carry
  `data-from-step`, so a caller can highlight a step with everything it feeds (`<rapi-flow>` does
  on hover, with the `rf-linked` class). With `interactive`, those rows are also `rf-jump` links
  (the outputs box's rows focusable, `role="link"`) for a caller to scroll to the step.
- **Actions.** A step's actions are its own `onSuccess` / `onFailure`, then the workflow's
  `successActions` / `failureActions` (marked `inherited`) minus any the step overrides by `name`.
  The graph also lists the workflow's actions once as `workflowActions`. Compact shows no
  actions; expanded lists a step's own actions and the inherited ones in one list per outcome, in merge order, each with its name in parentheses after
  what it does; inherited ones also carry an `Inherited` tag on the right (`rf-tag rf-inherited`, a light violet: `--purple` mixed with `--foreground`). A runner takes the first action whose criteria match, so every action after
  one without criteria is marked `shadowed` (it never runs). Shadowed actions are left out of the
  boxes and draw no goto line; the graph's `warnings` (`{ level, path,
  message }`, one per step and outcome) name them, for author tooling;
  `<rapi-flow>` does not show them. A `goto` with a `stepId` in the same workflow and a `retry` (into its
  own step, or its `stepId`) draw a line from their action line (expanded) or the box's left edge
  (compact), a loop when a retry retries its own step. A goto's line reads "→ goto <step>" (the
  step in the step color) and its line is labelled with the action's name, which the box does not
  repeat; a retry's line reads "→ retry 3×, 2s apart (<name>)" and its line is labelled
  "retry 3× @ 2s". Each label's tooltip is the whole action. A dot in the line's color
  (`rf-line-start`) marks where each line leaves its box, just inside the box's left edge. Both views draw inherited actions' lines too. In compact, a retry
  into its own step leaves near the bottom of the box, so the loop spans the box with its label on
  the line, as in expanded. All lines between boxes have rounded corners (`roundedPath`).
  `end` and goto to a workflow draw none.
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
