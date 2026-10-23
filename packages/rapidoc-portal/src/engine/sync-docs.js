/**
 * Copies a portal project's docs/ folder into the Starlight content folder of the temp
 * workspace, normalizing each Markdown/MDX/Markdoc file so Starlight accepts it.
 *
 * syncDocs() is idempotent: it only writes files whose content changed and removes files
 * whose source is gone, so the dev server can call it again on every docs change.
 */

import fs from 'node:fs';
import path from 'node:path';

export const DOC_EXTENSIONS = ['.md', '.mdx', '.markdoc'];

/** Components that may be used in MDX without an explicit import; imports are injected. */
const AUTO_IMPORTED_COMPONENTS = [
  'Button',
  'Link',
  'Trademark',
  'SpaceWarning',
  'OpenPlaygroundButton',
  'Callout',
  'Card',
  'CardHeader',
  'CardTitle',
  'CardDescription',
  'CardContent',
  'CardFooter',
  'Steps',
  'Tabs',
  'TabItem',
  'Badge',
];

/**
 * Ensures markdown/mdx content has a valid frontmatter title for Starlight's schema.
 */
function normalizeDocFrontmatter(rawContent, fileName = '') {
  let content = rawContent;
  const hasFrontmatter = content.startsWith('---');

  let sidebarLabel = '';

  if (hasFrontmatter) {
    const endMatch = content.indexOf('---', 3);
    if (endMatch !== -1) {
      const frontmatterEndIndex = endMatch + 3;
      const frontmatterText = content.slice(3, endMatch);
      const titleMatch = frontmatterText.match(/(?:^|\n)title:\s*["']?([^"'\n]+)["']?/);
      if (titleMatch) {
        const cleanTitle = titleMatch[1].replace(/<[^>]+>/g, '').trim();
        if (cleanTitle !== titleMatch[1]) {
          content = content.replace(titleMatch[0], `\ntitle: "${cleanTitle.replace(/"/g, '\\"')}"`);
        }
        // Strip duplicate # Heading in the body if it matches cleanTitle
        const bodyContent = content.slice(frontmatterEndIndex);
        const dupHeadingMatch = bodyContent.match(/(?:^|\n)#\s+([^\n#]+)/);
        if (dupHeadingMatch) {
          const bodyHeadingText = dupHeadingMatch[1].trim().replace(/<[^>]+>/g, '');
          if (bodyHeadingText.toLowerCase() === cleanTitle.toLowerCase()) {
            const bodyHeadingIdx = bodyContent.indexOf(dupHeadingMatch[0]);
            const newBody = bodyContent.slice(0, bodyHeadingIdx) + bodyContent.slice(bodyHeadingIdx + dupHeadingMatch[0].length);
            content = content.slice(0, frontmatterEndIndex) + newBody;
          }
        }
        return content; // Already has title
      }
      const labelMatch = frontmatterText.match(/(?:^|\n)sidebar_label:\s*["']?([^"'\n]+)["']?/);
      if (labelMatch) {
        sidebarLabel = labelMatch[1].trim();
      }
    }
  }

  // Extract first markdown # Heading
  let title;
  const headingMatch = content.match(/(?:^|\n)#\s+([^\n#]+)/);
  if (headingMatch) {
    title = headingMatch[1].trim();
    // Strip the # Heading line from the body so Starlight's page title doesn't duplicate it
    const headingIndex = content.indexOf(headingMatch[0]);
    if (headingIndex !== -1) {
      content = content.slice(0, headingIndex) + content.slice(headingIndex + headingMatch[0].length);
    }
  } else if (sidebarLabel) {
    title = sidebarLabel;
  } else {
    title = path.basename(fileName, path.extname(fileName)).replace(/[-_]/g, ' ');
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

  // Strip HTML / JSX tags from title
  title = title.replace(/<[^>]+>/g, '').trim();
  // Escape quotes in title
  const safeTitle = title.replace(/"/g, '\\"');

  if (hasFrontmatter) {
    // Insert title right after the opening ---
    return `---\ntitle: "${safeTitle}"\n${content.slice(4)}`;
  } else {
    // Prepend frontmatter
    return `---\ntitle: "${safeTitle}"\n---\n\n${content.trimStart()}`;
  }
}

/**
 * Rewrites Zudoku-specific imports and tags to their @rapidoc/portal equivalents.
 */
function rewriteZudokuSyntax(content) {
  return content
    .replace(/from\s+["']zudoku\/ui\/[^"']+["']/g, 'from "@rapidoc/portal/components"')
    .replace(/<Stepper\b[^>]*>/g, '<Steps>')
    .replace(/<\/Stepper>/g, '</Steps>');
}

/**
 * Adds an import from @rapidoc/portal/components for every auto-imported component used but not imported.
 */
function injectComponentImports(content) {
  const importedNames = new Set();
  for (const match of content.matchAll(/import\s*\{([^}]+)\}\s*from/g)) {
    match[1].split(',').forEach((item) => {
      const name = item
        .trim()
        .split(/\s+as\s+/)[0]
        .trim();
      if (name) importedNames.add(name);
    });
  }

  const neededImports = AUTO_IMPORTED_COMPONENTS.filter((comp) => new RegExp(`<${comp}\\b`).test(content) && !importedNames.has(comp));
  if (neededImports.length === 0) return content;

  const importStmt = `import { ${neededImports.join(', ')} } from "@rapidoc/portal/components";\n\n`;
  if (content.startsWith('---')) {
    const endFm = content.indexOf('---', 3);
    if (endFm !== -1) {
      return content.slice(0, endFm + 3) + '\n\n' + importStmt + content.slice(endFm + 3).trimStart();
    }
  }
  return importStmt + content;
}

/**
 * Turns a raw doc file into content Starlight accepts.
 */
export function normalizeDocContent(rawContent, fileName = '') {
  return injectComponentImports(rewriteZudokuSyntax(normalizeDocFrontmatter(rawContent, fileName)));
}

function isDocFile(fileName) {
  return DOC_EXTENSIONS.includes(path.extname(fileName).toLowerCase());
}

/**
 * Lists every doc file (absolute paths) under a directory.
 */
export function listDocFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (entry.isFile() && isDocFile(entry.name)) files.push(path.join(entry.parentPath, entry.name));
  }
  return files;
}

/**
 * Computes the files the workspace should contain: relative path -> content (string or Buffer).
 * When both `x.md` and `x.mdx` exist, only the .mdx is kept to avoid duplicate Starlight slugs.
 */
function collectDesiredDocs(srcDir) {
  const desired = new Map();
  if (!fs.existsSync(srcDir)) return desired;
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile()) continue;
    const srcPath = path.join(entry.parentPath, entry.name);
    const relPath = path.relative(srcDir, srcPath);
    const ext = path.extname(entry.name).toLowerCase();

    if (ext === '.md' && fs.existsSync(path.join(entry.parentPath, `${path.parse(entry.name).name}.mdx`))) continue;

    if (isDocFile(entry.name)) {
      desired.set(relPath, normalizeDocContent(fs.readFileSync(srcPath, 'utf8'), entry.name));
    } else if (entry.name !== '.DS_Store') {
      desired.set(relPath, fs.readFileSync(srcPath));
    }
  }
  return desired;
}

function sameContent(destPath, content) {
  if (!fs.existsSync(destPath)) return false;
  const current = fs.readFileSync(destPath);
  return Buffer.isBuffer(content) ? current.equals(content) : current.toString('utf8') === content;
}

/**
 * Mirrors srcDir (the project's docs/) into destDir (the workspace content folder).
 * Returns the number of files written or removed.
 */
export function syncDocs(srcDir, destDir) {
  const desired = collectDesiredDocs(srcDir);
  let changes = 0;

  for (const [relPath, content] of desired) {
    const destPath = path.join(destDir, relPath);
    if (sameContent(destPath, content)) continue;
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, content);
    changes++;
  }

  if (fs.existsSync(destDir)) {
    for (const entry of fs.readdirSync(destDir, { withFileTypes: true, recursive: true })) {
      if (!entry.isFile()) continue;
      const destPath = path.join(entry.parentPath, entry.name);
      if (!desired.has(path.relative(destDir, destPath))) {
        fs.rmSync(destPath, { force: true });
        changes++;
      }
    }
  }

  return changes;
}
