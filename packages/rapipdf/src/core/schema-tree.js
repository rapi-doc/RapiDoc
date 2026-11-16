import {
  flattenAllOf,
  getTypeInfo,
  schemaToAST,
  typeLabel,
} from "../../../rapidoc/src/utils/schema-utils.js";

/*
 * Schemas as pdfmake content, in the two styles of the PDF: an indented object tree and a flat table.
 * Both are drawn from the AST of RapiDoc's schema-utils.js (schemaToAST), the same reading of a schema
 * that <rapi-doc> renders: allOf merged, anyOf/oneOf and OpenAPI 3.1 type lists as options, a schema
 * inside itself as `{recursive: Name}`, and very deep or very large schemas cut off.
 */

// RapiDoc joins alternatives with a box-drawing bar, which the PDF fonts have no glyph for
const BAR = /\s*┃\s*/g;
const asTypes = (text) =>
  String(text ?? "")
    .replace(BAR, " | ")
    .trim();
const asList = (text) =>
  String(text ?? "")
    .replace(BAR, ", ")
    .trim();

/** Object and array descriptions come with the HTML <rapi-doc> shows them in: the PDF prints their text. */
function plainText(text) {
  return (
    String(text ?? "")
      .replace(/<div[^>]*>/gi, " [")
      .replace(/<\/div>/gi, "]")
      .replace(/<\/p>|<br\s*\/?>/gi, " ")
      .replace(/<[^>]*>/g, "")
      // the arrow between an array's description and its items' has no glyph in the PDF fonts
      .replace(/⮕/g, "—")
      .replace(/\s+/g, " ")
      .trim()
  );
}

// A table needs one row with every cell for colSpan to work. lineHeight 0 keeps it from taking a line.
const spacerRow = () => [
  { text: "", lineHeight: 0, margin: 0 },
  { text: "", lineHeight: 0, margin: 0 },
  { text: "", lineHeight: 0, margin: 0 },
];

const NO_LINES = {
  defaultBorder: false,
  hLineWidth() {
    return 0;
  },
  vLineWidth() {
    return 0;
  },
  paddingTop() {
    return 0;
  },
  paddingBottom() {
    return 0;
  },
};

/** Rows of [name, type, description] as a borderless, indented table. */
function rowsTable(rows) {
  return {
    margin: [10, 0, 0, 0],
    layout: NO_LINES,
    table: {
      headerRows: 0,
      widths: ["auto", "auto", "*"],
      dontBreakRows: false,
      body: [spacerRow(), ...rows],
    },
  };
}

const displayName = (node, name = node.name) => `${name ?? ""}${node.required ? "*" : ""}`;

function primitiveType(node) {
  const label = asTypes(node.typeLabel || node.type);
  return node.formatNote ? `${label} (${node.formatNote})` : label;
}

/** READ ONLY, WRITE ONLY, DEPRECATED: the flags of a node, as one label. */
function flagsOf(node, localize) {
  return [
    node.readOnly && localize.readOnly,
    node.writeOnly && localize.writeOnly,
    node.deprecated && localize.deprecated,
  ]
    .filter(Boolean)
    .join(", ");
}

function labelled(label, value, valueStyle) {
  return {
    text: [
      { text: `${label}:`, style: ["sub", "b", "darkGray"] },
      { text: value, style: valueStyle },
    ],
  };
}

/** What the description column says about a value: flags, constraints, default, allowed values, pattern, text. */
function detailStack(node, localize, description = node.description) {
  const stack = [];
  const flags = flagsOf(node, localize);
  if (flags) stack.push({ text: flags, style: ["sub", "b", "darkGray"], margin: [0, 3, 0, 0] });
  if (node.constraints) {
    stack.push({ text: asList(node.constraints), style: ["small", "mono", "darkGray"] });
  }
  if (node.defaultValue) {
    stack.push(labelled(localize.default, node.defaultValue, ["small", "darkGray", "mono"]));
  }
  if (node.allowedValues) {
    stack.push(
      labelled(localize.allowed, asList(node.allowedValues), ["small", "lightGray", "mono"]),
    );
  }
  if (node.pattern) {
    stack.push(labelled(localize.pattern, node.pattern, ["small", "lightGray", "mono"]));
  }
  const text = plainText(description);
  if (text) stack.push({ text, style: ["sub", "lightGray"], margin: [0, 3, 0, 0] });
  return stack;
}

const hasOwnRows = (node) =>
  node && !node.truncated && (node.kind === "object" || node.kind === "union");

/** The array nesting of a node: how many arrays deep, and the node at the bottom. */
function unwrapArray(node) {
  let depth = 0;
  let inner = node;
  while (inner?.kind === "array" && !inner.truncated && inner.items) {
    depth += 1;
    inner = inner.items;
  }
  return { depth, inner };
}

/* ---------------------------------------------------------------- Object tree */

function leafRow(name, type, stack) {
  return [
    { text: name, style: ["small", "mono"], margin: 0 },
    { text: type, style: ["small", "mono", "lightGray"], margin: 0 },
    { stack, margin: 0 },
  ];
}

/** `name {` … `}`: a block that spans the row, with its own rows indented inside. */
function blockRow(heading, description, rows, closing) {
  const keyDef = { stack: [heading] };
  if (description) {
    keyDef.stack.push({ text: description, style: ["sub", "gray"], margin: [0, 0, 0, 4] });
  }
  return [
    {
      colSpan: 3,
      stack: [keyDef, rowsTable(rows), { text: closing, style: ["small", "mono"] }],
    },
  ];
}

function memberRows(node, localize) {
  const rows = [];
  for (const child of node.properties ?? []) rows.push(treeRow(child, localize));
  for (const child of node.patternProperties ?? []) rows.push(treeRow(child, localize));
  if (node.additionalProperties) rows.push(treeRow(node.additionalProperties, localize));
  // allOf members that are themselves a choice (anyOf/oneOf) follow the merged properties
  for (const union of node.unions ?? []) rows.push(treeRow(union, localize));
  return rows;
}

function optionLabel(option, localize) {
  const title = option.optionTitle ? ` ${option.optionTitle}` : "";
  return `${localize.option} ${option.optionIndex}${title}`;
}

function optionRows(node, localize) {
  return node.options.map((option) =>
    treeRow(option, localize, { name: "", label: optionLabel(option, localize) }),
  );
}

/**
 * One row of an object tree for an AST node: [name, type, details] for a value, or one cell across
 * the row for an object, an array of objects or a choice. `label` is printed in front (OPTION 1).
 */
function treeRow(node, localize, { name = node.name, label = "" } = {}) {
  const shownName = displayName(node, name);
  const labelRun = label ? [{ text: `${label} `, style: ["sub", "b", "blue"] }] : [];
  const heading = (text) => ({ text: [...labelRun, { text, style: ["small", "mono"] }] });
  const leafName = [label, shownName].filter(Boolean).join(" ");

  if (node.truncated) {
    const type = node.kind === "array" ? "[…]" : "{…}";
    return leafRow(leafName, type, detailStack(node, localize));
  }

  if (node.kind === "union") {
    const operator = node.operator === "anyOf" ? localize.anyOf : localize.oneOf;
    const description = plainText(node.description);
    return [
      {
        colSpan: 3,
        stack: [
          ...(leafName ? [heading(shownName)] : []),
          ...(description ? [{ text: description, style: ["sub", "gray"] }] : []),
          {
            margin: [leafName ? 10 : 0, 0, 0, 0],
            stack: [
              { text: operator, style: ["sub", "blue", "b"], margin: [0, 5, 0, 0] },
              rowsTable([...memberRows(node, localize), ...optionRows(node, localize)]),
            ],
          },
        ],
      },
    ];
  }

  if (node.kind === "object") {
    const about = [flagsOf(node, localize), plainText(node.description)].filter(Boolean);
    return blockRow(heading(`${shownName} {`), about.join(": "), memberRows(node, localize), "}");
  }

  if (node.kind === "array") {
    const { depth, inner } = unwrapArray(node);
    const open = "[".repeat(depth);
    const close = "]".repeat(depth);
    const description = plainText(node.description);
    if (!inner || inner.kind === "array") {
      // No items schema, or cut off further down
      const type = `${open || "["}${inner?.truncated ? "…" : ""}${close || "]"}`;
      return leafRow(leafName, type, detailStack(node, localize));
    }
    if (inner.kind === "object" && !inner.truncated) {
      const about = [flagsOf(node, localize), description || plainText(inner.description)]
        .filter(Boolean)
        .join(": ");
      return blockRow(
        heading(`${shownName} ${open}{`),
        about ? `${localize.arrayOfObject}: ${about}` : localize.arrayOfObject,
        memberRows(inner, localize),
        `}${close}`,
      );
    }
    if (inner.kind === "union") {
      const rows = [treeRow(inner, localize, { name: "" })];
      return blockRow(heading(`${shownName} ${open}`), description, rows, close);
    }
    // An array of plain values: one row, typed [string]
    const type = inner.truncated ? "{…}" : primitiveType(inner);
    const details = detailStack(inner, localize, description || inner.description);
    const arrayFlags = flagsOf(node, localize);
    if (arrayFlags && !flagsOf(inner, localize)) {
      details.unshift({ text: arrayFlags, style: ["sub", "b", "darkGray"], margin: [0, 3, 0, 0] });
    }
    return leafRow(leafName, `${open}${type}${close}`, details);
  }

  return leafRow(leafName, primitiveType(node), detailStack(node, localize));
}

/**
 * A schema as an object tree: a list of blocks for a `stack`. An object or an array of objects is one
 * braced block; anything else (a plain value, a choice) is a one-row table.
 */
export function schemaObjectTree(schema, localize) {
  const ast = schemaToAST(schema);
  if (!ast) return [];
  const row = treeRow(ast, localize, { name: "" });
  // A block row is a single cell that holds everything; outside a table its content is what is drawn
  if (row.length === 1) return [{ stack: row[0].stack }];
  const table = rowsTable([row]);
  delete table.margin;
  return [table];
}

/* ---------------------------------------------------------------- Table */

function tableRows(node, localize, rows, level, { name = node.name, label = "" } = {}) {
  const leftMargin = level * 10;
  const shownName = [label, displayName(node, name)].filter(Boolean).join(" ");
  const containerRow = (type, details) => {
    rows.push([
      { text: shownName, style: ["small", "b"], margin: [leftMargin, 0, 0, 0] },
      { text: type, style: ["small", "mono", "lightGray"], margin: 0 },
      details.length ? { stack: details, margin: 0 } : { text: "", lineHeight: 0, margin: 0 },
    ]);
  };
  const valueRow = (type, details) => {
    rows.push([
      { text: shownName, style: ["small"], margin: [leftMargin, 0, 0, 0] },
      { text: type, style: ["small", "mono", "lightGray"], margin: 0 },
      { stack: details.length ? details : [{ text: "", lineHeight: 0 }], margin: 0 },
    ]);
  };

  if (node.truncated) {
    valueRow(node.kind === "array" ? "[…]" : "{…}", detailStack(node, localize));
    return rows;
  }

  if (node.kind === "union") {
    containerRow(node.operator, detailStack(node, localize));
    childTableRows(node, localize, rows, level + 1);
    return rows;
  }

  if (node.kind === "object") {
    containerRow("object", detailStack(node, localize));
    childTableRows(node, localize, rows, level + 1);
    return rows;
  }

  if (node.kind === "array") {
    const { depth, inner } = unwrapArray(node);
    const description = plainText(node.description);
    if (hasOwnRows(inner)) {
      const of = inner.kind === "object" ? "object" : inner.operator;
      containerRow(
        `${"array of ".repeat(depth)}${of}`,
        detailStack(node, localize, description || inner.description),
      );
      childTableRows(inner, localize, rows, level + 1);
      return rows;
    }
    if (!inner || inner.kind === "array" || inner.truncated) {
      valueRow("array", detailStack(node, localize));
      return rows;
    }
    valueRow(
      `${"array of ".repeat(depth)}${primitiveType(inner)}`,
      detailStack(inner, localize, description || inner.description),
    );
    return rows;
  }

  valueRow(primitiveType(node), detailStack(node, localize));
  return rows;
}

function childTableRows(node, localize, rows, level) {
  for (const child of node.properties ?? []) tableRows(child, localize, rows, level);
  for (const child of node.patternProperties ?? []) tableRows(child, localize, rows, level);
  if (node.additionalProperties) tableRows(node.additionalProperties, localize, rows, level);
  for (const union of node.unions ?? []) tableRows(union, localize, rows, level);
  for (const option of node.options ?? []) {
    tableRows(option, localize, rows, level, { name: "", label: optionLabel(option, localize) });
  }
}

/**
 * A schema as table rows of [name, type, description], nested names indented.
 * `root` says what the rows describe: the members of an "object", of the objects in an "array", or
 * ("value") the schema itself as a single row.
 *
 * @returns {{ root: "object" | "array" | "value", rows: object[][] }}
 */
export function schemaTableRows(schema, localize) {
  const ast = schemaToAST(schema);
  if (!ast) return { root: "value", rows: [] };
  const rows = [];
  if (ast.kind === "object" && !ast.truncated) {
    childTableRows(ast, localize, rows, 0);
    return { root: "object", rows };
  }
  const { depth, inner } = unwrapArray(ast);
  if (depth === 1 && inner?.kind === "object" && !inner.truncated) {
    childTableRows(inner, localize, rows, 0);
    return { root: "array", rows };
  }
  tableRows(ast, localize, rows, 0, { name: "" });
  return { root: "value", rows };
}

/* ---------------------------------------------------------------- Parameters */

export { flattenAllOf };

/**
 * What a parameter table prints for a parameter's schema: its type (`array of string`, `int32`, a
 * choice as `string | integer`), constraints, allowed values and pattern, as plain text.
 */
export function parameterTypeInfo(schema) {
  const info = getTypeInfo(flattenAllOf(schema));
  if (!info) return undefined;
  // The format in place of the type when it implies it (int64), otherwise beside it: string (uuid)
  const label = typeLabel(info.baseType, info.format, info.type);
  const type = label.formatNote ? `${label.label} (${label.formatNote})` : label.label;
  return {
    type: asTypes(info.arrayType || type),
    constrain: asList(info.constrain),
    allowedValues: asList(info.allowedValues),
    pattern: info.pattern,
    deprecated: Boolean(info.deprecated),
  };
}
