/**
 * Names as words, for the stateful mock: one splitter for every naming style a spec uses, so `petId`, `pet_id`,
 * `PetID` and `pet-id` read the same. It cuts where the author wrote a boundary (a capital, `_`, `-`, `.`, a
 * digit run); it needs no dictionary, and callers compare the words with the names the spec itself defines.
 */

const WORD = /[A-Z]+(?![a-z])|[A-Z]?[a-z]+|[0-9]+/g;

/**
 * The words of a name with where each sits in it: `ApiKeyCreateDto` -> Api, Key, Create, Dto.
 * @param {string} name
 * @returns {Array<{ word: string, start: number, end: number }>} `word` in lower case
 */
export function wordSpans(name) {
  return [...String(name ?? "").matchAll(WORD)].map((match) => ({
    word: match[0].toLowerCase(),
    start: match.index,
    end: match.index + match[0].length,
  }));
}

/** The words of a name, in lower case: `assignedUserId` -> ["assigned", "user", "id"]. */
export const splitWords = (name) => wordSpans(name).map((span) => span.word);

/** A word in the singular: `categories` -> `category`, `addresses` -> `address`, `pets` -> `pet`. */
export function singular(word) {
  const text = String(word ?? "");
  if (/ies$/i.test(text)) return `${text.slice(0, -3)}y`;
  if (/(ss|x|ch|sh)es$/i.test(text)) return text.slice(0, -2);
  if (/s$/i.test(text) && !/(ss|us|is)$/i.test(text)) return text.slice(0, -1);
  return text;
}

/**
 * A key to compare names by: their words, last one in the singular, joined. `Pet`, `pets` and `PET` give `pet`;
 * `api_keys` and `ApiKey` give `apikey`.
 * @param {string | string[]} name - A name, or its words
 */
export function nameKey(name) {
  const words = Array.isArray(name) ? name : splitWords(name);
  return words.map((word, i) => (i === words.length - 1 ? singular(word) : word)).join("");
}

/**
 * A name without the given words at its start and end, cut from the original text so its casing stays:
 * `ApiKeyCreateDto` -> `ApiKey`, `key_patch` -> `key`, `PetOut-Output` -> `Pet`. At least one word is kept.
 * @param {string} name
 * @param {Set<string>} prefixes - Words to drop from the start
 * @param {Set<string>} suffixes - Words to drop from the end
 */
export function trimWords(name, prefixes, suffixes) {
  const spans = wordSpans(name);
  let first = 0;
  let last = spans.length - 1;
  while (last > first && suffixes.has(spans[last].word)) last -= 1;
  while (first < last && prefixes.has(spans[first].word)) first += 1;
  if (first === 0 && last === spans.length - 1) return name;
  return name.slice(spans[first].start, spans[last].end);
}
