import { parseArgs } from "node:util";
import { UsageError } from "./errors.js";
import { closest } from "./suggest.js";

/**
 * Options every command accepts. `--version` is only a top-level flag (`rapidoc --version`).
 */
export const GLOBAL_OPTIONS = {
  help: { type: "boolean", short: "h", description: "Show this command's help" },
  quiet: { type: "boolean", short: "q", description: "Print errors and warnings only" },
  yes: {
    type: "boolean",
    short: "y",
    description: "Don't ask: take the default answer to every question",
  },
};

/** How an option is written: `--out-dir <path>`, `-f, --force`, `--no-install`. */
export function optionLabel(name, def) {
  if (def.type === "boolean" && def.negatable) return `--no-${name}`;
  const long = `--${name}${def.type === "string" ? ` <${def.value || "value"}>` : ""}`;
  return def.short ? `-${def.short}, ${long}` : long;
}

const spellings = (defs) =>
  Object.entries(defs).flatMap(([name, def]) =>
    def.type === "boolean" && def.negatable ? [`--${name}`, `--no-${name}`] : [`--${name}`],
  );

function unknownOption(raw, defs, command) {
  const suggestion = raw.startsWith("--") ? closest(raw, spellings(defs)) : undefined;
  return new UsageError(
    `Unknown option ${raw}.${suggestion ? ` Did you mean ${suggestion}?` : ""}`,
    { command },
  );
}

/** Checks a string value against the option's `kind` and `choices`; returns the value to use. */
function checkValue(name, def, value, command) {
  if (def.kind === "int" || def.kind === "port") {
    const number = Number(value);
    const max = def.kind === "port" ? 65535 : Number.MAX_SAFE_INTEGER;
    if (value.trim() === "" || !Number.isInteger(number) || number < 0 || number > max) {
      const range = def.kind === "port" ? " from 0 to 65535" : "";
      throw new UsageError(`--${name} needs a whole number${range}, got "${value}"`, { command });
    }
    return number;
  }
  if (def.choices) {
    const match = def.choices.find((choice) => choice === value.toLowerCase());
    if (!match) {
      const suggestion = closest(value, def.choices);
      throw new UsageError(
        `--${name} must be one of ${def.choices.join(", ")}, got "${value}".${suggestion ? ` Did you mean ${suggestion}?` : ""}`,
        { command },
      );
    }
    return match;
  }
  return value;
}

/**
 * Parses a command's arguments (everything after the command name) against its declared options:
 *
 *   options: { "out-dir": { type: "string", value: "path", default: "dist", description },
 *              port: { type: "string", kind: "port" }, force: { type: "boolean", short: "f" },
 *              install: { type: "boolean", negatable: true, default: true }, from: { type: "string",
 *              choices: ["redocly", "zudoku"], required: true } }
 *   positionals: { name: "dir", max: 1 }
 *
 * Positionals may come anywhere. Unknown options, missing or malformed values, bad choices and extra
 * positionals throw a UsageError (exit 2). Returns { values, positionals }; values are keyed by option
 * name (`values["out-dir"]`), with defaults filled in and numbers converted.
 */
export function parseCommandArgs(command, argv) {
  const defs = { ...command.options, ...GLOBAL_OPTIONS };
  const parseOptions = Object.fromEntries(
    Object.entries(defs).map(([name, def]) => [
      name,
      { type: def.type, ...(def.short && { short: def.short }) },
    ]),
  );

  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      options: parseOptions,
      allowPositionals: true,
      allowNegative: true,
      strict: false,
      tokens: true,
    });
  } catch (err) {
    throw new UsageError(err.message, { command: command.name });
  }

  const values = {};
  for (const token of parsed.tokens) {
    if (token.kind !== "option") continue;
    const def = defs[token.name];
    if (!def) throw unknownOption(token.rawName, defs, command.name);
    const negated = token.rawName !== `--${token.name}` && token.rawName.startsWith("--no-");

    if (def.type === "boolean") {
      if (negated && !def.negatable) throw unknownOption(token.rawName, defs, command.name);
      if (token.value !== undefined && token.value !== null)
        throw new UsageError(`${token.rawName} takes no value`, { command: command.name });
      values[token.name] = !negated;
      continue;
    }

    if (negated) throw unknownOption(token.rawName, defs, command.name);
    const missing =
      token.value === undefined ||
      token.value === null ||
      (!token.inlineValue && token.value.startsWith("-") && token.value !== "-");
    if (missing) {
      throw new UsageError(
        `--${token.name} needs a value (--${token.name} <${def.value || "value"}>)`,
        {
          command: command.name,
        },
      );
    }
    const value = checkValue(token.name, def, token.value, command.name);
    if (def.multiple) (values[token.name] ??= []).push(value);
    else values[token.name] = value;
  }

  for (const [name, def] of Object.entries(defs)) {
    if (values[name] !== undefined) continue;
    if (def.required && !values.help)
      throw new UsageError(`rapidoc ${command.name} needs ${optionLabel(name, def)}`, {
        command: command.name,
      });
    if (def.default !== undefined) values[name] = def.default;
  }

  const positionals = parsed.positionals;
  const max = command.positionals?.max ?? 0;
  if (positionals.length > max && !values.help) {
    const extra = positionals
      .slice(max)
      .map((arg) => `"${arg}"`)
      .join(", ");
    const takes =
      max === 0 ? "takes no arguments" : `takes ${command.usage.split(" ").slice(1).join(" ")}`;
    throw new UsageError(`Unexpected argument ${extra}: rapidoc ${command.name} ${takes}`, {
      command: command.name,
    });
  }

  return { values, positionals };
}
