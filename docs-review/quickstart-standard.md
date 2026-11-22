# Quickstart standard

The standard a product's quickstart page is reviewed against: RapiDoc, RapiFlow, RapiDoc Portal and
RapiMock each have one. A quickstart is the first page a new reader follows step by step; it gets them
from nothing to a working result, then sends them on.

## Required parts, in this order

1. **Opening**: one or two sentences on what the reader will have at the end, then what they need
   first (Node.js version, a spec file, a browser, an account). Nothing the reader needs may be
   introduced only later in a step.
2. **Steps**: numbered (a numbered heading per step, or a steps list), each one action. Each step can
   be run as written: commands and files are complete; any value the reader must replace is marked
   and explained where it first appears.
3. **Result**: after the last step (or after each step that changes what the reader sees), what they
   should see, so they know it worked.
4. **Next steps**: links to the pages a reader needs after this one.

Optional, after the steps: a variant (another way to start, such as an existing project), what the
generated files are, and a troubleshooting table of the errors a reader is likely to hit in these steps.

## Rules

- **Accuracy**: every command, flag, option, attribute, file name, address, port, default and printed
  output matches the source code the page describes. An example that cannot work as written is a
  blocker.
- **Self-contained**: a term the page uses is defined on the page or linked. A file the reader must
  have (a spec, a config) is provided, linked, or described well enough to make.
- **Names**: products as `brand/README.md` names them: RapiDoc, RapiDoc Mini, RapiFlow, RapiPdf,
  RapiMock, RapiDoc Portal, RapiDoc CLI. Tags, packages, commands and file names in code font.
- **Short**: nothing that belongs on a guide or reference page. Options beyond what the steps use are
  linked, not listed.
- **Formatting**: code blocks have a language; a file shown in full has its name as the block's title;
  links within the site are absolute paths (`/docs/...`) that exist.
