import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { rewriteRelativeImports, syncDocs } from "../src/engine/sync-docs.js";

const srcDir = path.resolve("/project/docs");
const abs = (...parts) =>
  path
    .resolve("/project", ...parts)
    .split(path.sep)
    .join("/");

describe("MDX imports of project files", () => {
  it("imports files outside docs/ from the project by absolute path", () => {
    const page = [
      "import Hello from '../components/Hello.astro';",
      'import { format } from "../lib/format.js";',
      'import "../styles/extra.css";',
      "export { meta } from '../lib/meta.js';",
      'import { Badge } from "@rapidoc/portal/components";',
    ].join("\n");
    assert.equal(
      rewriteRelativeImports(page, { srcDir, relPath: "welcome.mdx" }),
      [
        `import Hello from '${abs("components/Hello.astro")}';`,
        `import { format } from "${abs("lib/format.js")}";`,
        `import "${abs("styles/extra.css")}";`,
        `export { meta } from '${abs("lib/meta.js")}';`,
        'import { Badge } from "@rapidoc/portal/components";',
      ].join("\n"),
    );
  });

  it("keeps imports of files inside docs/ relative, also from the home page", () => {
    const page = "import Part from './parts/intro.mdx';\nimport Box from '../box.astro';";
    assert.equal(
      rewriteRelativeImports(page, { srcDir, relPath: "guides/setup.mdx" }),
      "import Part from './parts/intro.mdx';\nimport Box from '../box.astro';",
    );
    // docs/index.mdx is copied to the content root, the other docs under docs/.
    assert.equal(
      rewriteRelativeImports("import Part from './parts/intro.mdx';", {
        srcDir,
        relPath: "index.mdx",
      }),
      "import Part from './docs/parts/intro.mdx';",
    );
  });

  it("handles imports over several lines, and leaves code blocks and prose alone", () => {
    const page = [
      "import {",
      "  a,",
      "  b,",
      "} from '../lib/ab.js';",
      "",
      "Write import X from '../x.astro' to import it:",
      "",
      "```mdx",
      "import Hello from '../components/Hello.astro';",
      "```",
      "",
      "~~~~js",
      "import y from '../y.js';",
      "~~~",
      "import z from '../z.js';",
      "~~~~",
    ].join("\n");
    const lines = rewriteRelativeImports(page, { srcDir, relPath: "a.mdx" }).split("\n");
    assert.equal(lines[3], `} from '${abs("lib/ab.js")}';`);
    assert.equal(lines[5], "Write import X from '../x.astro' to import it:");
    assert.equal(lines[8], "import Hello from '../components/Hello.astro';");
    assert.equal(lines[12], "import y from '../y.js';");
    assert.equal(lines[14], "import z from '../z.js';", "a shorter fence does not close the block");
    assert.equal(lines.length, 16);
  });

  it("stops at React, Vue and Svelte components, naming the page and the import", () => {
    for (const ext of ["jsx", "tsx", "vue", "svelte"]) {
      assert.throws(
        () =>
          rewriteRelativeImports(`import Hi from '../components/Hi.${ext}';`, {
            srcDir,
            relPath: "guides/hi.mdx",
          }),
        new RegExp(`docs/guides/hi\\.mdx imports "\\.\\./components/Hi\\.${ext}".*Astro component`),
      );
    }
  });

  it("rewrites the imports of .mdx pages only, when syncing docs", () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "rapidoc-sync-"));
    try {
      const docs = path.join(project, "docs");
      const dest = path.join(project, "content");
      fs.mkdirSync(docs);
      const line = "import Hello from '../components/Hello.astro';";
      fs.writeFileSync(path.join(docs, "page.mdx"), `---\ntitle: Page\n---\n\n${line}\n`);
      fs.writeFileSync(path.join(docs, "plain.md"), `---\ntitle: Plain\n---\n\n${line}\n`);
      syncDocs(docs, dest);
      const target = path.join(project, "components", "Hello.astro").split(path.sep).join("/");
      assert.match(
        fs.readFileSync(path.join(dest, "docs", "page.mdx"), "utf8"),
        new RegExp(target),
      );
      assert.match(
        fs.readFileSync(path.join(dest, "docs", "plain.md"), "utf8"),
        /'\.\.\/components/,
      );
    } finally {
      fs.rmSync(project, { recursive: true, force: true });
    }
  });
});
