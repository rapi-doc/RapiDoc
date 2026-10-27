import fs from 'node:fs';
import path from 'node:path';

/**
 * Search for readers who see only some zones. The build writes (see @rapidoc/portal split-output.js):
 *
 *   public/search-index.json                               public records of the portal's own search
 *   protected/_rapidoc/search/<zone>/search-index.json     each protected zone's records
 *   protected/_rapidoc/search/<zone>/pagefind/             each protected zone's Pagefind bundle
 *   protected/_rapidoc/search/_empty/pagefind/             an empty bundle
 *
 * Starlight merges every zone's Pagefind bundle; a reader gets the real bundle for zones they may see
 * and the empty one for the rest, so search works for everyone and finds only what they may open.
 */

export const SEARCH_PREFIX = '/_rapidoc/search/';
export const EMPTY_ZONE = '_empty';
const INDEX_FILE = 'search-index.json';

/** search-index.json files are read once; the build never changes under a running server. */
function createJsonCache() {
  const cache = new Map();
  return (file) => {
    if (!cache.has(file)) cache.set(file, fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null);
    return cache.get(file);
  };
}

/**
 * @param {{publicDir: string, protectedDir: string}} settings
 */
export function createSearch(settings) {
  const readJson = createJsonCache();
  const zoneDir = (zone) => path.join(settings.protectedDir, '_rapidoc/search', zone);

  return {
    /** The portal's search index with the records of every zone in `zones`, or null when the build has none. */
    mergedIndex(zones) {
      const base = readJson(path.join(settings.publicDir, INDEX_FILE));
      if (!base) return null;
      const records = [...(base.records || [])];
      for (const zone of zones) records.push(...(readJson(path.join(zoneDir(zone), INDEX_FILE))?.records || []));
      return { ...base, totalRecords: records.length, records };
    },

    /**
     * Folder to serve `/_rapidoc/search/<zone>/pagefind/*` from: the zone's bundle when the reader may see
     * it and it exists, else the empty bundle.
     */
    pagefindDir(zone, mayRead) {
      const real = path.join(zoneDir(zone), 'pagefind');
      if (mayRead && fs.existsSync(real)) return real;
      return path.join(zoneDir(EMPTY_ZONE), 'pagefind');
    },
  };
}
