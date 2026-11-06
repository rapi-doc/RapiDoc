import { GLOBAL_OPTIONS, optionLabel } from "./args.js";

const NAME = "RapiDoc CLI (@rapidoc/cli) - OpenAPI & Developer Portal Toolkit";

function table(rows, indent = "  ") {
  const width = Math.max(...rows.map(([left]) => left.length)) + 2;
  return rows
    .map(([left, right]) => {
      const lines = right.split("\n");
      return [
        `${indent}${left.padEnd(width)}${lines[0]}`,
        ...lines.slice(1).map((line) => `${indent}${" ".repeat(width)}${line}`),
      ].join("\n");
    })
    .join("\n");
}

function optionRows(defs) {
  return Object.entries(defs).map(([name, def]) => {
    const extras = [];
    if (def.choices) extras.push(def.choices.join(" | "));
    if (def.default !== undefined && def.type === "string") extras.push(`default ${def.default}`);
    const text = def.description + (extras.length ? ` (${extras.join("; ")})` : "");
    return [optionLabel(name, def), text];
  });
}

/** `rapidoc --help`: every command, the top-level flags, where to read more. */
export function overviewHelp(commands) {
  return `
${NAME}

Usage:
  rapidoc <command> [options]
  rapidoc <command> --help     Show a command's options and examples

Commands:
${table(commands.map((command) => [command.usage, command.summary]))}

Options:
${table([
  ["-h, --help", "Show this help (or a command's, after the command)"],
  ["-v, --version", "Show the version"],
  ["-q, --quiet", "Print errors and warnings only"],
])}

dev, build, migrate, folder-wide validate and mock of a portal folder need @rapidoc/portal installed next to
the CLI; serve needs @rapidoc/server; mock needs @rapidoc/mock.

Exit codes: 0 success, 1 problems in the input (specs, config, build), 2 a wrong command line.

Examples:
  rapidoc init my-portal --title "Acme Developer Portal"
  rapidoc dev
  rapidoc build --out-dir public
  rapidoc validate ./specs/orders-api.yaml
  rapidoc build --help
`;
}

/** `rapidoc <command> --help`. */
export function commandHelp(command) {
  const sections = [`\nrapidoc ${command.usage}\n\n  ${command.summary}`];
  if (command.description) sections.push(command.description.replace(/^/gm, "  "));
  const own = optionRows(command.options || {});
  if (own.length) sections.push(`Options:\n${table(own)}`);
  sections.push(`Global options:\n${table(optionRows(GLOBAL_OPTIONS))}`);
  if (command.examples?.length)
    sections.push(`Examples:\n${command.examples.map((example) => `  ${example}`).join("\n")}`);
  return `${sections.join("\n\n")}\n`;
}
