import { defaultSiteTitle } from "./scaffold.js";

/**
 * The questions `rapidoc init` and `npm create rapidoc` ask in a terminal, for whatever the command line
 * didn't already say. Each one is also an option (--title, --spec / --starter-spec, --install /
 * --no-install), so a run can be repeated without questions.
 *
 * @param {object} args
 * @param {{ text: Function, multiselect: Function, confirm: Function }} args.ask - prompt functions
 *   (@clack/prompts' signatures): the CLI passes its lib/prompt.js, create-rapidoc its own.
 * @param {string} args.targetDir - The portal folder.
 * @param {string[]} args.foundSpecs - OpenAPI files found there (findOpenApiSpecs), relative to it.
 * @param {{ title?: string, specs?: string[], install?: boolean }} args.known - Answers the command line
 *   already gave; `undefined` means ask. `specs: []` means the starter spec.
 * @param {boolean} [args.askInstall=true] - Whether to ask about `npm install` (not when the folder
 *   already has a package.json, which the scaffold leaves alone).
 * @returns {Promise<{ title?: string, specs?: string[], install?: boolean }>}
 */
export async function askInitQuestions({ ask, targetDir, foundSpecs, known, askInstall = true }) {
  const answers = { ...known };
  if (answers.title === undefined) {
    const fallback = defaultSiteTitle(targetDir);
    answers.title = await ask.text({
      message: "Site title",
      placeholder: fallback,
      defaultValue: fallback,
    });
  }
  if (answers.specs === undefined && foundSpecs.length) {
    answers.specs = await ask.multiselect({
      message: `OpenAPI files to include (${foundSpecs.length} found; none selected = a starter spec)`,
      options: foundSpecs.map((spec) => ({ value: spec, label: spec })),
      initialValues: foundSpecs,
      required: false,
    });
  }
  if (askInstall && answers.install === undefined) {
    answers.install = await ask.confirm({
      message: "Install the dependencies with npm now?",
      initialValue: true,
    });
  }
  return answers;
}
