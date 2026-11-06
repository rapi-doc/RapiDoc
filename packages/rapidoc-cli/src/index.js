#!/usr/bin/env node

/**
 * The `rapidoc` command: picks the command, parses its arguments (lib/args.js), prints help, runs it, and
 * turns thrown errors into messages and exit codes (lib/errors.js): 0 success, 1 problems in the input,
 * 2 a wrong command line. Commands live in commands/, one file each, and declare their own options;
 * help is generated from those declarations.
 */
import pkg from "../package.json" with { type: "json" };
import { parseCommandArgs } from "./lib/args.js";
import { UsageError } from "./lib/errors.js";
import { commandHelp, overviewHelp } from "./lib/help.js";
import { error, setQuiet } from "./lib/output.js";
import { closest } from "./lib/suggest.js";
import init from "./commands/init.js";
import dev from "./commands/dev.js";
import build from "./commands/build.js";
import serve from "./commands/serve.js";
import mock from "./commands/mock.js";
import validate from "./commands/validate.js";
import migrate from "./commands/migrate.js";

const COMMANDS = [init, dev, build, serve, mock, validate, migrate];
const byName = new Map(COMMANDS.map((command) => [command.name, command]));

function unknownCommand(name) {
  if (name.startsWith("-")) {
    const suggestion = closest(name, ["--help", "--version"]);
    return new UsageError(
      `Unknown option ${name}.${suggestion ? ` Did you mean ${suggestion}?` : ""}`,
    );
  }
  const suggestion = closest(name, [...byName.keys(), "help"]);
  return new UsageError(
    `Unknown command "${name}".${suggestion ? ` Did you mean "${suggestion}"?` : ""}`,
  );
}

async function main(argv) {
  const [name, ...rest] = argv;
  if (!name || name === "--help" || name === "-h") {
    process.stdout.write(overviewHelp(COMMANDS));
    return;
  }
  if (name === "--version" || name === "-v") {
    process.stdout.write(`${pkg.version}\n`);
    return;
  }
  if (name === "help") {
    if (!rest.length) return void process.stdout.write(overviewHelp(COMMANDS));
    const command = byName.get(rest[0]);
    if (!command) throw unknownCommand(rest[0]);
    return void process.stdout.write(commandHelp(command));
  }

  const command = byName.get(name);
  if (!command) throw unknownCommand(name);
  // Help wins over everything else on the line, even a mistake (`rapidoc build --outdir x --help`).
  if (rest.includes("--help") || rest.includes("-h")) {
    process.stdout.write(commandHelp(command));
    return;
  }
  const { values, positionals } = parseCommandArgs(command, rest);
  if (values.help) {
    process.stdout.write(commandHelp(command));
    return;
  }
  setQuiet(values.quiet);
  await command.run({ values, positionals });
}

try {
  await main(process.argv.slice(2));
} catch (err) {
  const exitCode = err.exitCode ?? 1;
  process.stderr.write("\n");
  error(err.message);
  if (err instanceof UsageError) {
    const help = err.command ? `rapidoc ${err.command} --help` : "rapidoc --help";
    process.stderr.write(`Run \`${help}\` for usage.\n`);
  } else if (!err.exitCode && process.env.RAPIDOC_DEBUG) {
    process.stderr.write(`${err.stack}\n`);
  }
  process.stderr.write("\n");
  process.exitCode = exitCode;
}
