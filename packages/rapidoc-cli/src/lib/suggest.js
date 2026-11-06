/** Edit distance (insertions, deletions, substitutions, swaps of two neighbours). */
function distance(a, b) {
  const rows = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) rows[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
        rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1);
    }
  }
  return rows[a.length][b.length];
}

/**
 * The candidate closest to `input` (case-insensitive), or undefined when none is close enough: the only
 * candidate starting with an input of 3+ letters, else the nearest within 1 edit (2 for 5+ letters).
 */
export function closest(input, candidates) {
  const needle = input.toLowerCase();
  if (needle.length >= 3) {
    const prefixed = candidates.filter((candidate) => candidate.toLowerCase().startsWith(needle));
    if (prefixed.length === 1) return prefixed[0];
  }
  let best;
  let bestDistance = Infinity;
  for (const candidate of candidates) {
    const hay = candidate.toLowerCase();
    const d = distance(needle, hay);
    if (d < bestDistance) [best, bestDistance] = [candidate, d];
  }
  if (best === undefined) return undefined;
  const limit = needle.length >= 5 ? 2 : 1;
  return bestDistance <= limit ? best : undefined;
}
