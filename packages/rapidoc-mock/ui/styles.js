import { base } from "./styles/base.js";
import { shell } from "./styles/shell.js";
import { blocks } from "./styles/blocks.js";
import { resources } from "./styles/resources.js";
import { lint } from "./styles/lint.js";
import { tables } from "./styles/tables.js";
import { operations } from "./styles/operations.js";
import { schema } from "./styles/schema.js";
import { narrow } from "./styles/narrow.js";

/**
 * The Mock UI's styles: one dark theme, in the manner of a monitoring console. Slate surfaces without borders,
 * white headings over grey text, and RapiDoc's amber as the one accent (the brand block, the place you are, the
 * main action). Label colors come with text: a label is never told by color alone.
 *
 * In parts, under `styles/`, in the order they apply (a later part can restate an earlier one): `tokens.js` has
 * the custom properties, each other file one area of the app.
 */
export const styles = [base, shell, blocks, resources, lint, tables, operations, schema, narrow];
