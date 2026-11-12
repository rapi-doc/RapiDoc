// The public API of <rapi-doc> as data, read from packages/rapidoc/src/rapidoc.ts: each `@property`
// declaration (attribute name, union type, initial value) with its doc comment, the documented methods
// (`@public`), and the `@fires`, `@slot` and `@deprecatedAttr` tags of the class comment. Nothing is written
// to disk: the docs /api page and scripts/rapidoc-metadata.js call readApiManifest() and so cannot differ
// from the source. The tags are described in the class comment of rapidoc.ts.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { API } from "typescript/unstable/sync";
import * as ts from "typescript/unstable/ast";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceFile = (name) => path.join(rootDir, "packages/rapidoc/src", name);
const RAPIDOC_SOURCE = sourceFile("rapidoc.ts");

/** The elements `rapidoc` publishes, each read from its own class. `<rapi-flow>` is in the flow bundle. */
export const ELEMENTS = [
  {
    tag: "rapi-doc",
    className: "RapiDoc",
    file: sourceFile("rapidoc.ts"),
    bundle: "rapidoc-min.js",
  },
  {
    tag: "rapi-doc-mini",
    className: "RapiDocMini",
    file: sourceFile("rapidoc-mini.ts"),
    bundle: "rapidoc-min.js",
  },
  {
    tag: "rapi-flow",
    className: "RapiFlow",
    file: sourceFile("rapi-flow.ts"),
    bundle: "rapidoc-flow-min.js",
  },
];

const TAGS = new Set([
  "summary",
  "group",
  "default",
  "allowedNote",
  "example",
  "hidden",
  "internal",
  "public",
  "code",
  "deprecated",
  "fires",
  "slot",
  "deprecatedAttr",
]);

/**
 * A doc comment as `{ description, tags: [{ name, text }] }`. A line starts a tag only when it begins with
 * one of TAGS, so an `@` elsewhere (an email address, `@rapidoc/prerender`) is text. Lines are joined with
 * newlines: descriptions are HTML, where that only matters inside <pre>, and `@code` is code.
 */
export function parseDocComment(raw = "") {
  const lines = raw
    .replace(/^\/\*\*/, "")
    .replace(/\*\/$/, "")
    .split("\n")
    .map((line) => line.replace(/^\s*\* ?/, "").trimEnd());
  const doc = { description: "", tags: [] };
  let current = null;
  const body = [];
  const flush = () => {
    const text = body.join("\n").trim();
    if (current) doc.tags.push({ name: current, text });
    else doc.description = text;
    body.length = 0;
  };
  for (const line of lines) {
    const match = /^@(\w+)\s?(.*)$/.exec(line.trimStart());
    if (match && TAGS.has(match[1])) {
      flush();
      current = match[1];
      body.push(match[2]);
    } else {
      body.push(line);
    }
  }
  flush();
  return doc;
}

const tagText = (doc, name) => doc.tags.find((tag) => tag.name === name)?.text;
const tagTexts = (doc, name) => doc.tags.filter((tag) => tag.name === name).map((tag) => tag.text);
const hasTag = (doc, name) => doc.tags.some((tag) => tag.name === name);

/** A node's source text, without the comments and whitespace before it. */
const textOf = (node, sourceFile) =>
  sourceFile.text.slice(ts.getTokenPosOfNode(node, sourceFile), node.end);

function docOf(node, sourceFile) {
  const comment = (node.jsDoc ?? []).at(-1);
  if (!comment) return parseDocComment();
  // A JSDoc node starts at the trivia before it (other comments, blank lines)
  const raw = sourceFile.text.slice(comment.pos, comment.end);
  return parseDocComment(raw.slice(raw.indexOf("/**")));
}

/** The object literal passed to `@property(...)`, as `{ key: source text }`; null without the decorator. */
function propertyOptions(node, sourceFile) {
  for (const decorator of (node.modifiers ?? []).filter(ts.isDecorator)) {
    const call = decorator.expression;
    if (!ts.isCallExpression(call) || textOf(call.expression, sourceFile) !== "property") continue;
    const options = {};
    const [literal] = call.arguments;
    if (literal && ts.isObjectLiteralExpression(literal)) {
      for (const entry of literal.properties) {
        if (ts.isPropertyAssignment(entry)) {
          options[textOf(entry.name, sourceFile)] = textOf(entry.initializer, sourceFile);
        }
      }
    }
    return options;
  }
  return null;
}

/** The string literals of a union type ("" aside: unset, not a value to document); null when the type is not a list of values. */
function allowedValues(typeNode) {
  if (!typeNode) return null;
  const members = ts.isUnionTypeNode(typeNode) ? typeNode.types : [typeNode];
  const values = members
    .filter((member) => ts.isLiteralTypeNode(member) && ts.isStringLiteral(member.literal))
    .map((member) => member.literal.text)
    .filter((value) => value !== "");
  return values.length ? values : null;
}

function initialValue(initializer) {
  if (!initializer) return undefined;
  if (ts.isStringLiteral(initializer) || ts.isNoSubstitutionTemplateLiteral(initializer)) {
    return initializer.text === "" ? "(empty)" : initializer.text;
  }
  if (ts.isNumericLiteral(initializer)) return Number(initializer.text);
  return undefined;
}

function attributeEntry(member, options, doc, sourceFile, fileName) {
  const propertyName = textOf(member.name, sourceFile);
  const name = options.attribute ? JSON.parse(options.attribute) : propertyName.toLowerCase();
  const group = tagText(doc, "group");
  if (!doc.description || !group) {
    throw new Error(
      `${fileName}: attribute "${name}" (${propertyName}) needs a doc comment with a description and @group, or @internal`,
    );
  }
  const entry = { name };
  const values = allowedValues(member.type);
  const notes = tagTexts(doc, "allowedNote");
  if (values) entry.allowed = [...values, ...notes];
  entry.description = doc.description;
  const summary = tagText(doc, "summary");
  if (summary) entry.summary = summary;
  if (options.type === "Number") entry.type = "number";
  const documented = tagText(doc, "default");
  const value = documented ?? initialValue(member.initializer);
  if (value !== undefined) entry.default = value;
  const example = tagText(doc, "example");
  if (example) entry.example = example;
  if (hasTag(doc, "hidden")) entry.hidden = true;
  return { group, entry };
}

/*
 * TypeScript 7 parses in its native compiler, a separate process that the API talks to. Each parse opens
 * one session for the file (its tsconfig project, or an inferred project for a file outside one) and
 * closes it: the AST stays readable afterwards, and no process is left running to keep Node alive.
 * Results are kept per file and modification time, so the docs site and a build parse each file once.
 */
const parsed = new Map();

function parseSourceFile(file) {
  const { mtimeMs } = fs.statSync(file);
  const cached = parsed.get(file);
  if (cached?.mtimeMs === mtimeMs) return cached.sourceFile;
  const api = new API({ cwd: path.dirname(file) });
  try {
    const snapshot = api.updateSnapshot({ openFiles: [file] });
    const sourceFile = snapshot.getDefaultProjectForFile(file)?.program.getSourceFile(file);
    if (!sourceFile) throw new Error(`TypeScript could not parse ${file}`);
    parsed.set(file, { mtimeMs, sourceFile });
    return sourceFile;
  } finally {
    api.close();
  }
}

/** `name - description`, or `- description` for the default slot. */
function namedTag(text, what) {
  const match = /^(?:(\S+)\s+)?-\s+([\s\S]+)$/.exec(text);
  if (!match)
    throw new Error(`rapidoc.ts: ${what} "${text.slice(0, 40)}" is not "name - description"`);
  return { name: match[1] ?? "", description: match[2].trim() };
}

/**
 * `{ Attributes: [{ "<group> Attributes": [...] }], Methods, Events, Slots }`, each of the last three
 * as `{ items }`. Attributes and methods are in source order; groups in order of first use.
 * By default the manifest of `<rapi-doc>`; pass a file and class name for another element (see ELEMENTS).
 */
export function readApiManifest(file = RAPIDOC_SOURCE, className = "RapiDoc") {
  const sourceFile = parseSourceFile(file);
  const element = sourceFile.statements.find(
    (statement) => ts.isClassDeclaration(statement) && statement.name?.text === className,
  );
  if (!element) throw new Error(`class ${className} not found in ${file}`);
  const fileName = path.basename(file);

  const groups = new Map();
  const addAttribute = (group, entry) => {
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(entry);
  };
  const methods = [];

  for (const member of element.members) {
    if (ts.isPropertyDeclaration(member)) {
      const options = propertyOptions(member, sourceFile);
      if (!options || options.attribute === "false") continue;
      const doc = docOf(member, sourceFile);
      if (hasTag(doc, "internal")) continue;
      const { group, entry } = attributeEntry(member, options, doc, sourceFile, fileName);
      addAttribute(group, entry);
    } else if (ts.isMethodDeclaration(member)) {
      const doc = docOf(member, sourceFile);
      if (!hasTag(doc, "public")) continue;
      // `@public name(args)` documents that signature; otherwise the declared parameters
      const parameters = member.parameters.map((parameter) => textOf(parameter.name, sourceFile));
      const entry = {
        name:
          tagText(doc, "public") || `${textOf(member.name, sourceFile)}(${parameters.join(", ")})`,
        description: doc.description,
      };
      const example = tagText(doc, "example");
      if (example) entry.example = example;
      const code = tagText(doc, "code");
      if (code) entry.code = `${code}\n`;
      methods.push(entry);
    }
  }

  const classDoc = docOf(element, sourceFile);
  for (const text of tagTexts(classDoc, "deprecatedAttr")) {
    const [name, group, allowed, defaultValue, ...description] = text
      .split("|")
      .map((part) => part.replace(/\s+/g, " ").trim());
    if (!description.length) {
      throw new Error(`rapidoc.ts: @deprecatedAttr ${name} needs five fields separated by |`);
    }
    addAttribute(group, {
      name,
      deprecated: true,
      allowed: allowed.split(",").map((value) => value.trim()),
      description: description.join(" | "),
      default: defaultValue,
    });
  }

  return {
    Attributes: [...groups].map(([group, items]) => ({ [`${group} Attributes`]: items })),
    Methods: { items: methods },
    Events: { items: tagTexts(classDoc, "fires").map((text) => namedTag(text, "@fires")) },
    Slots: {
      items: tagTexts(classDoc, "slot").map((text) => {
        const slot = namedTag(text, "@slot");
        return { ...slot, name: slot.name || "(default)" };
      }),
    },
  };
}
