/**
 * The store of the stateful mock: collections of records in memory, keyed by the field the classifier found.
 *
 *   const store = createStore({ Pet: { key: "id" }, Order: { key: "id" } });
 *   store.load({ Pet: [...], Order: [...] });          // the seed state
 *   store.session("test-1").insert("Pet", { name: "Biscuit" });
 *
 * Sessions: `store.session(id)` is a view with its own copy of the seed state, made when it first writes, so
 * parallel tests on one server never see each other's data. `store.session()` (no id) is the default state.
 * Records go in and come out as copies: a caller can't change stored data by holding on to an object.
 */

const copy = (value) => (value === undefined ? undefined : structuredClone(value));

/** A key as the map holds it: `12` and `"12"` (a path parameter is always text) find the same record. */
const keyOf = (value) => String(value);

/**
 * @param {Record<string, { key: string | null }>} resources - The classifier's resources (classifySpec)
 */
export function createStore(resources) {
  const names = Object.keys(resources);
  /** @type {Map<string, Map<string, object>>} the seed state: collection -> key -> record */
  let seed = new Map(names.map((name) => [name, new Map()]));
  /** The seed state as `load` left it: what a reset of the default state goes back to. */
  let initial = seed;
  /** @type {Map<string, Map<string, Map<string, object>>>} session id -> its own state */
  const sessions = new Map();

  const cloneState = (state) =>
    new Map([...state].map(([name, records]) => [name, new Map(copy([...records]))]));

  const collection = (state, name) => {
    const records = state.get(name);
    if (!records) throw new Error(`Unknown collection "${name}"`);
    return records;
  };

  /** The next free integer key, or a text key, for a record that arrives without one. */
  const newKey = (records, sample) => {
    const keys = [...records.keys()];
    const numeric = keys.every((key) => /^\d+$/.test(key));
    if (numeric && typeof sample !== "string") {
      return keys.reduce((max, key) => Math.max(max, Number(key)), 0) + 1;
    }
    let n = keys.length + 1;
    while (records.has(`${n}`) || records.has(`id-${n}`)) n += 1;
    return `id-${n}`;
  };

  const view = (id) => {
    const reading = () => (id === undefined ? seed : sessions.get(id) || seed);
    const writing = () => {
      if (id === undefined) return seed;
      if (!sessions.has(id)) sessions.set(id, cloneState(seed));
      return sessions.get(id);
    };
    const keyField = (name) => resources[name]?.key;

    return {
      /** One record by key, or undefined. */
      get(name, key) {
        return copy(collection(reading(), name).get(keyOf(key)));
      },
      /**
       * The records of a collection, filtered and paged.
       * @param {string} name
       * @param {{ where?: Record<string, unknown>, test?: (record: object) => boolean, offset?: number, limit?: number }} [query] -
       *   `where` keys are field paths (`status`, `category.name`, `tags[].name`); a record matches when every one
       *   equals its value (compared as text; an array value matches any of its items). `test` is one more
       *   condition on the stored record
       */
      list(name, { where = {}, test, offset = 0, limit } = {}) {
        const tests = Object.entries(where);
        const all = [...collection(reading(), name).values()].filter(
          (record) =>
            tests.every(([path, expected]) => matches(valuesAt(record, path), expected)) &&
            (!test || test(record)),
        );
        return {
          total: all.length,
          records: copy(all.slice(offset, limit === undefined ? undefined : offset + limit)),
        };
      },
      /** Stores a new record and returns it; assigns the key when the record has none. `null` on a key in use. */
      insert(name, record) {
        const records = collection(writing(), name);
        const field = keyField(name);
        const stored = copy(record) ?? {};
        if (field && (stored[field] === undefined || stored[field] === null)) {
          const sample = records.size ? [...records.values()][0][field] : undefined;
          stored[field] = newKey(records, sample);
        }
        const key = field ? keyOf(stored[field]) : keyOf(records.size + 1);
        if (records.has(key)) return null;
        records.set(key, stored);
        return copy(stored);
      },
      /** Replaces a record (`merge: false`) or merges fields into it; the key stays. `undefined` when missing. */
      update(name, key, changes, { merge = false } = {}) {
        const records = collection(writing(), name);
        const existing = records.get(keyOf(key));
        if (!existing) return undefined;
        const field = keyField(name);
        const next = { ...(merge ? existing : {}), ...copy(changes) };
        if (field) next[field] = existing[field];
        records.set(keyOf(key), next);
        return copy(next);
      },
      /** Removes a record: true when there was one. */
      remove(name, key) {
        return collection(writing(), name).delete(keyOf(key));
      },
      /** Back to the loaded data: a session drops its copy, the default state undoes its writes. */
      reset() {
        if (id !== undefined) sessions.delete(id);
        else seed = cloneState(initial);
      },
      /**
       * Replaces this view's records with the given ones (a snapshot, or data a test wrote): every collection,
       * the ones `data` leaves out become empty. A later `reset` still goes back to the loaded data.
       * @param {Record<string, object[]>} data
       */
      restore(data) {
        const unknown = Object.keys(data).filter((name) => !names.includes(name));
        if (unknown.length) throw new Error(`Unknown collection "${unknown[0]}"`);
        const state = new Map(names.map((name) => [name, new Map()]));
        if (id === undefined) seed = state;
        else sessions.set(id, state);
        for (const name of names) {
          for (const record of data[name] || []) this.insert(name, record);
        }
      },
      /** The whole state as plain data: `{ Pet: [...], Order: [...] }`. */
      snapshot() {
        return Object.fromEntries(
          [...reading()].map(([name, records]) => [name, copy([...records.values()])]),
        );
      },
    };
  };

  return {
    names,
    /**
     * Replaces the seed state, and with it every session's.
     * @param {Record<string, object[]>} data
     */
    load(data) {
      seed = new Map(names.map((name) => [name, new Map()]));
      sessions.clear();
      const state = view(undefined);
      for (const name of names) {
        for (const record of data[name] || []) state.insert(name, record);
      }
      initial = cloneState(seed);
    },
    session: view,
    /** How many sessions hold their own state. */
    get sessionCount() {
      return sessions.size;
    },
  };
}

/** The values at a field path in a record: `tags[].name` gives every tag's name. */
export function valuesAt(record, path) {
  let values = [record];
  for (const part of String(path).split(".")) {
    const each = part.endsWith("[]");
    const field = each ? part.slice(0, -2) : part;
    values = values
      .map((value) => (value && typeof value === "object" ? value[field] : undefined))
      .flatMap((value) => (each && Array.isArray(value) ? value : [value]));
  }
  return values.filter((value) => value !== undefined);
}

/** Whether any of a record's values equals the expected one (or one of them), compared as text. */
function matches(values, expected) {
  const wanted = (Array.isArray(expected) ? expected : [expected]).map(String);
  return values.flat().some((value) => wanted.includes(String(value)));
}
