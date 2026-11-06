import { UsageError } from "../lib/errors.js";

/*
 * rapidoc completion <zsh|bash|fish>: prints a completion script for the shell, generated from the
 * command declarations (lib/completion.js). Load it in the shell's startup file, or write it where the
 * shell looks for completions (the fastest: the CLI doesn't start on every shell).
 */

const SHELLS = ["zsh", "bash", "fish"];

export default {
  name: "completion",
  usage: "completion <zsh|bash|fish>",
  summary: "Prints a shell completion script for commands, options and their values",
  description:
    'Generated from the commands\' declarations, so it matches this version. Load it:\n  zsh:   rapidoc completion zsh > ~/.zsh/completions/_rapidoc   (a folder in $fpath, before compinit)\n         or: eval "$(rapidoc completion zsh)" in ~/.zshrc\n  bash:  eval "$(rapidoc completion bash)" in ~/.bashrc\n  fish:  rapidoc completion fish > ~/.config/fish/completions/rapidoc.fish',
  positionals: { name: "shell", max: 1, choices: SHELLS },
  options: {},
  examples: [
    "rapidoc completion zsh > ~/.zsh/completions/_rapidoc",
    'eval "$(rapidoc completion bash)"',
    "rapidoc completion fish > ~/.config/fish/completions/rapidoc.fish",
  ],

  async run({ positionals, commands }) {
    const [shell] = positionals;
    if (!SHELLS.includes(shell))
      throw new UsageError(
        shell
          ? `Unknown shell "${shell}": one of ${SHELLS.join(", ")}`
          : `rapidoc completion needs a shell: ${SHELLS.join(", ")}`,
        { command: "completion" },
      );
    const generators = await import("../lib/completion.js");
    process.stdout.write(generators[shell](commands));
  },
};
