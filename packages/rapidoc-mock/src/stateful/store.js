/**
 * The store of the stateful mock: collections of records in memory, keyed by the field the classifier found
 * (or `mock.config.yaml` names; it can be a path into the record, such as `metadata.name`).
 *
 *   const store = createStore({ Pet: { key: "id" }, Order: { key: "id" } });
 *   store.load({ Pet: [...], Order: [...] });          // the seed state
 *   store.session("test-1").insert("Pet", { name: "Biscuit" });
 *
 * Sessions: `store.session(id)` is a view with its own copy of the seed state, made when it first writes, so
 * parallel tests on one server never see each other's data. `store.session()` (no id) is the default state.
 * A store keeps the state of at most `maxSessions` sessions (1000): one more, and the session used longest
 * ago loses its copy and reads the seed state again, so a mock that runs for weeks does not grow without end.
 * Records go in and come out as copies: a caller can't change stored data by holding on to an object.
 */

const copy = (value) => (value === undefined ? undefined : structuredClone(value));

/** How many sessions keep their own state, per API. */
export const MAX_SESSIONS = 1000;

/** The value at a dotted path of a record: `metadata.name` of a Kubernetes object. */
export function valueAt(record, path) {
  let value = record;
  for (const part of String(path).split(".")) {
    if (!value || typeof value !== "object") return undefined;
    value = value[part];
  }
  return value;
}

/** Sets the value at a dotted path of a record, making the objects on the way. */
export function setAt(record, path, value) {
  const parts = String(path).split(".");
  let node = record;
  for (const part of parts.slice(0, -1)) {
    if (!node[part] || typeof node[part] !== "object" || Array.isArray(node[part])) node[part] = {};
    node = node[part];
  }
  node[parts.at(-1)] = value;
  return record;
}

/** A key as the map holds it: `12` and `"12"` (a path parameter is always text) find the same record. */
const keyOf = (value) => String(value);

/**
 * @param {Record<string, { key: string | null, keyAs?: "number" }>} resources - The classifier's resources
 *   (classifySpec); `keyAs: "number"`: the path takes a number for a key stored as text
 * @param {object} [options]
 * @param {number} [options.maxSessions] - Sessions that keep their own state (default 1000); the one used
 *   longest ago is dropped for a new one
 */
export function createStore(resources, { maxSessions = MAX_SESSIONS } = {}) {
  const names = Object.keys(resources);
  /** @type {Map<string, Map<string, object>>} the seed state: collection -> key -> record */
  let seed = new Map(names.map((name) => [name, new Map()]));
  /** The seed state as `load` left it: what a reset of the default state goes back to. */
  let initial = seed;
  /** @type {Map<string, Map<string, Map<string, object>>>} session id -> its own state */
  const sessions = new Map();
  /** A session's state, marked as the one used last (a Map keeps its keys in the order they were set). */
  const touch = (id) => {
    const state = sessions.get(id);
    if (state && sessions.size > 1) {
      sessions.delete(id);
      sessions.set(id, state);
    }
    return state;
  };
  /** Gives a session its state, dropping the sessions used longest ago when there are too many. */
  const keep = (id, state) => {
    sessions.delete(id);
    sessions.set(id, state);
    while (sessions.size > Math.max(1, maxSessions)) sessions.delete(sessions.keys().next().value);
    return state;
  };

  const cloneState = (state) =>
    new Map([...state].map(([name, records]) => [name, new Map(copy([...records]))]));

  const collection = (state, name) => {
    const records = state.get(name);
    if (!records) throw new Error(`Unknown collection "${name}"`);
    return records;
  };

  /**
   * A key for a record that arrives without one: the next number where the keys are numbers (as text where
   * they are stored as text: "10", then "11"), else a text key.
   */
  const newKey = (records, sample, asNumber) => {
    const keys = [...records.keys()];
    const numeric = keys.every((key) => /^\d+$/.test(key));
    if (numeric && (keys.length || typeof sample !== "string" || asNumber)) {
      const next = keys.reduce((max, key) => Math.max(max, Number(key)), 0) + 1;
      return typeof sample === "string" || (sample === undefined && asNumber) ? String(next) : next;
    }
    let n = keys.length + 1;
    while (records.has(`${n}`) || records.has(`id-${n}`)) n += 1;
    return `id-${n}`;
  };

  const view = (id) => {
    const reading = () => (id === undefined ? seed : touch(id) || seed);
    const writing = () => {
      if (id === undefined) return seed;
      return touch(id) || keep(id, cloneState(seed));
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
        const given = field ? valueAt(stored, field) : undefined;
        if (field && (given === undefined || given === null)) {
          const sample = records.size ? valueAt([...records.values()][0], field) : undefined;
          setAt(stored, field, newKey(records, sample, resources[name]?.keyAs === "number"));
        }
        const key = field ? keyOf(valueAt(stored, field)) : keyOf(records.size + 1);
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
        if (field) setAt(next, field, valueAt(existing, field));
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
        else keep(id, state);
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
    /** How many records a collection had when it was loaded: what a reset goes back to. */
    seeded(name) {
      return initial.get(name)?.size ?? 0;
    },
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
