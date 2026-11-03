# Arazzo Workflow Diagrams

## Overview

Reads Arazzo 1.x documents and draws one workflow as an SVG string: the workflow's inputs and
outputs, its steps in order, the values passed between steps, and each step's success and failure
actions. Two views: `expanded` (the default) lists each input's type, required flag, default and
enum values, each step's values with a keyword for where they come from (`input`, `step`,
`fixed`, `expr`), and its actions as "condition → what happens" under On success / On failure; `compact` shows only
each step's operation, with labelled value lines and action pills. Used by `<rapi-flow>` (`src/rapi-flow.ts`, bundled as `dist/rapidoc-flow-min.js`) and by
the build-time renderer (`rapidoc/static`: `renderArazzoWorkflow`, `getFlowCss`).

Not owned here: running workflows (nothing here makes a request), the element's loading and
events (`src/rapi-flow.ts`), and the diagram's look (`src/styles/flow-styles.js`). Nothing in
`dist/rapidoc-min.js` imports this folder.

## Interface

- `parseDocument(input)` [parse.js]: JSON or YAML text to an object; an object passes through.
  Throws on empty input or a non-object.
- `validateArazzo(doc) -> { level, path, message }[]` [parse.js]: structural checks the diagram
  relies on; an empty list means valid.
- `resolveComponentRef(doc, obj, kind)` [parse.js]: `{ reference: "$components.<kind>.<name>" }`
  to the component, or null.
- `collectRefs(value)` [refs.js]: `$inputs`, `$steps` and `$workflows` expressions anywhere in a
  JSON value, distinct, in first-seen order.
- `indexOperations(openapi)`, `resolveOperation(step, sources)` [operations.js]: operation lookup
  by operationId (plain or `$sourceDescriptions.<name>.` qualified) and by `operationPath`.
- `buildFlowGraph(doc, workflowId?, { sources })` [graph.js]: the graph the SVG draws; null when
  the workflow does not exist.
- `renderFlowDiagram(graph, { view, idPrefix, interactive }) -> { svg, legend }` [svg.js]:
  `legend` names the kinds of lines drawn (`seq`, `data`, `output`, `success`, `failure`,
  `action`); `renderFlowSvg` returns only the SVG. `actionLabel` (short, for pills),
  `actionSentence` (with criteria), `describeAction` (`{ when, does, tag }`, the wording of the
  expanded boxes and the step details) and `escapeXml` are exported too.
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
  one step with the same labels share a lane and arrive at the middle of the target; edges into
  the outputs box carry no label. Expanded: one lane per source step, branching to each line
  (step binding or output) that uses one of its outputs; no labels, since the lines name the
  value.
- **Actions.** A step's actions are its own `onSuccess` / `onFailure`, then the workflow's
  `successActions` / `failureActions` (marked `inherited`) minus any the step overrides by `name`.
  The graph also lists the workflow's actions once as `workflowActions`. Compact draws pills only
  for a step's own actions, so callers show the workflow's actions once; expanded lists a step's
  own actions and the inherited ones in one list per outcome, in merge order, each tagged with its
  name or `workflow`. A runner takes the first action whose criteria match, so every action after
  one without criteria is marked `shadowed` (it never runs): dimmed, with a tooltip, and its goto
  draws no line. Only `goto` with a
  `stepId` in the same workflow draws a line, from its pill or action line; `end`, `retry` and
  goto to a workflow draw none.
- **Details for documentation.** The graph carries what a docs view needs: `inputDetails` (type,
  format, required, default, enum, description, from `inputs` or a `$ref` to
  `#/components/inputs/<name>`), each step's `parameters` (component references resolved, their
  `value` overriding), `requestBody`, `criteria` and `outputExprs`, and each output's `expr`.
  Each step's `bindings` are the values it sends: parameters by name and request body fields as
  `body.<path>` (objects flattened, arrays kept whole), each with a `source` (`input`, `step`,
  `expression` or `value`) and the steps it reads (`fromSteps`). Expanded boxes show at most ten.
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
