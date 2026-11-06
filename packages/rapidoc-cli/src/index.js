#!/usr/bin/env node

/**
 * The `rapidoc` command: picks the command, parses its arguments (lib/args.js), prints help, runs it, and
 * turns thrown errors into messages and exit codes (lib/errors.js): 0 success, 1 problems in the input,
 * 2 a wrong command line. Commands live in commands/, one file each, and declare their own options;
 * help is generated from those declarations.
 */
import pkg from "../package.json" with { type: "json" };
import { parseCommandArgs } from "./lib/args.js";
import { CancelledError, UsageError } from "./lib/errors.js";
import { commandHelp, overviewHelp } from "./lib/help.js";
import { error, setQuiet } from "./lib/output.js";
import { canAsk, select, setAssumeYes } from "./lib/prompt.js";
import { closest } from "./lib/suggest.js";
import init from "./commands/init.js";
import dev from "./commands/dev.js";
import build from "./commands/build.js";
import serve from "./commands/serve.js";
import mock from "./commands/mock.js";
import validate from "./commands/validate.js";
import bundle from "./commands/bundle.js";
import lint from "./commands/lint.js";
import migrate from "./commands/migrate.js";
import preview from "./commands/preview.js";
import mcp from "./commands/mcp.js";
import doctor from "./commands/doctor.js";
import completion from "./commands/completion.js";

const COMMANDS = [
  init,
  dev,
  build,
  serve,
  preview,
  mock,
  validate,
  lint,
  bundle,
  mcp,
  migrate,
  doctor,
  completion,
];
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

// `rapidoc` alone in a terminal: what most people come to do, then help.
const MENU = [
  { value: "dev", label: "Start the dev server", hint: "rapidoc dev" },
  { value: "build", label: "Build the portal", hint: "rapidoc build" },
  { value: "validate", label: "Validate the specs", hint: "rapidoc validate" },
  { value: "mock", label: "Run the mock server", hint: "rapidoc mock" },
  { value: "init", label: "Create a portal here", hint: "rapidoc init" },
  { value: "help", label: "Show all commands and options", hint: "rapidoc --help" },
];

async function runCommand(command, argv) {
  // Help wins over everything else on the line, even a mistake (`rapidoc build --outdir x --help`).
  if (argv.includes("--help") || argv.includes("-h")) {
    process.stdout.write(commandHelp(command));
    return;
  }
  const { values, positionals } = parseCommandArgs(command, argv);
  setQuiet(values.quiet);
  setAssumeYes(values.yes);
  await command.run({ values, positionals, commands: COMMANDS });
}

async function main(argv) {
  const [name, ...rest] = argv;
  if (!name && canAsk()) {
    const choice = await select({ message: "What do you want to do?", options: MENU });
    if (choice !== "help") return runCommand(byName.get(choice), []);
  }
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
  await runCommand(command, rest);
}

try {
  await main(process.argv.slice(2));
} catch (err) {
  const exitCode = err.exitCode ?? 1;
  if (err instanceof CancelledError) {
    process.stderr.write(`${err.message}\n`);
    process.exit(exitCode);
  }
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
