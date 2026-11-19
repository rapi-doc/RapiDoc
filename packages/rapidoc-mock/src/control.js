/**
 * The control API of the mock server, under `/__mock`: what a test in any language needs beside the mocked APIs.
 *
 *   GET  /__mock/health                         ready check; lists the APIs and which keep state
 *   GET  /__mock/model[/<api>]                  what the mock made of each spec: resources, operations, labels
 *   GET  /__mock/model/<api>/resources/<Resource>          one resource: fields, how each is seeded, relations
 *   GET  /__mock/model/<api>/resources/<Resource>/sample   one generated record, stored nowhere (`?seed=`)
 *   GET  /__mock/model/<api>/operations/<id>               one operation: what the mock does, parameters,
 *                                               request, responses, and a sample of the plain mock's response
 *                                               (`?code=404`: of that response instead of the default one)
 *   GET  /__mock/lint/<api>                     what lint found in the API's spec, when the mock was given a
 *                                               `lint` function (`rapidoc mock` gives one): `{ linted, problems,
 *                                               summary }`. The mock has no lint rules of its own.
 *   GET  /__mock/ui                             a page that shows all of this (src/ui.js)
 *   GET  /__mock/settings                       how the mock was started, and what can change while it runs
 *   PATCH /__mock/settings                      changes the response delay: `{ "delay": 250 }`
 *   POST /__mock/reset[?api=<id>]               back to the seed data; with a body `{ "rows": 25, "seed": 7 }`,
 *                                               new seed data of that size (all sessions' records are dropped)
 *   GET  /__mock/state[/<api>[/<resource>[/<key>]]]   the stored records, for assertions
 *   POST /__mock/snapshot[?api=<id>]            the stored records, as a document `restore` takes
 *   POST /__mock/restore                        replaces the records of the APIs the document names
 *
 * All but `health` work on the state `--stateful` keeps, and on the caller's session when the request has an
 * `X-Mock-Session` header. A state document is `{ "<api id>": { "<Resource>": [records] } }`. A record of a
 * nested resource whose own fields don't name its parent carries it under `$parents` (see stateful/handlers.js):
 * a restore needs it to put the record back under the same parent.
 *
 * Nothing here is protected: the mock is a development tool, and these endpoints change only its own data.
 */
import { problem } from "./auth.js";
import { listOperations } from "./spec.js";
import { operationIds } from "./stateful/classify.js";
import {
  describeOperation,
  describeResource,
  operationSummary,
  sampleRecord,
} from "./stateful/describe.js";

/** The path prefix of the control API; no API may use it as its id. */
export const CONTROL_PREFIX = "__mock";

const json = (data, status = 200) => ({
  status,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data, null, 2),
});
const isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

/**
 * What the stateful mode made of an API, for a person to read (the Mock UI) or a script to check:
 * its resources (key, path, how many records the caller's state holds, what needs review) and every operation
 * with its action and label (`confident`, `needsReview` with the reason, `plainMock`).
 */
function modelOf(api, view) {
  const { model, labels } = api.state;
  const ids = operationIds(api.doc);
  const snapshot = view.snapshot();
  return {
    id: api.id,
    ...(api.title ? { title: api.title } : {}),
    labels,
    resources: Object.entries(model.resources).map(([name, resource]) => ({
      name,
      key: resource.key,
      path: resource.path,
      ...(resource.alsoAt ? { alsoAt: resource.alsoAt } : {}),
      records: snapshot[name]?.length ?? 0,
      // what a reset goes back to: the UI marks a count that differs from it
      seeded: api.state.store.seeded(name),
      ...(resource.review ? { review: resource.why } : {}),
    })),
    operations: listOperations(api.doc).map((one) => {
      const id = ids.get(`${one.method} ${one.path}`);
      return operationSummary(model, {
        ...one,
        id,
        entry: model.operations[id] || { action: "none" },
      });
    }),
  };
}

/**
 * Answers a control request.
 *
 * @param {object} request
 * @param {string} request.method - Upper case
 * @param {string[]} request.segments - The path after `/__mock`, split and decoded
 * @param {URLSearchParams} request.query
 * @param {string} [request.session] - The X-Mock-Session header
 * @param {() => Promise<unknown>} request.body - Reads the JSON body
 * @param {{ id: string, state: object | null }[]} apis - The loaded APIs
 * @param {{ settings: object, started: object, reseed: Function }} [runtime] - What can change while the mock
 *   runs (`settings`: delay, rows, seed), how it was started, and how to make new seed data (see index.js)
 * @returns {Promise<{ status: number, headers: object, body: string | null }>}
 */
export async function control({ method, segments, query, session, body }, apis, runtime) {
  const [action, ...rest] = segments;
  const stateful = apis.filter((api) => api.state);
  const view = (api) => api.state.store.session(session || undefined);
  const allow = (expected) =>
    method === expected
      ? null
      : problem(405, "Method Not Allowed", `/${CONTROL_PREFIX}/${action} accepts ${expected}.`, {
          Allow: expected,
        });

  if (action === "health" && !rest.length) {
    return (
      allow("GET") ??
      json({
        status: "ok",
        apis: apis.map((api) => ({ id: api.id, stateful: Boolean(api.state) })),
      })
    );
  }
  if (action === "settings" && !rest.length && runtime) {
    const show = () =>
      json({
        ...runtime.started,
        ...runtime.settings,
        lint: Boolean(runtime.lint),
        apis: apis.map((api) => ({
          id: api.id,
          ...(api.title ? { title: api.title } : {}),
          ...(api.fullPath ? { file: api.fullPath } : {}),
          operations: api.operations,
          stateful: Boolean(api.state),
        })),
      });
    if (method === "GET") return show();
    if (method !== "PATCH") {
      return problem(405, "Method Not Allowed", `/${CONTROL_PREFIX}/settings accepts GET, PATCH.`, {
        Allow: "GET, PATCH",
      });
    }
    let changes;
    try {
      changes = await body();
    } catch {
      return problem(400, "Bad Request", "The request body is not valid JSON.");
    }
    const unknown = isObject(changes) ? Object.keys(changes).filter((key) => key !== "delay") : [];
    if (!isObject(changes) || unknown.length) {
      return problem(
        400,
        "Bad Request",
        `Only delay can be changed${unknown.length ? ` (not ${unknown.join(", ")})` : ""}: { "delay": 250 }. Rows and seed change with POST /${CONTROL_PREFIX}/reset.`,
      );
    }
    if ("delay" in changes) {
      if (!Number.isInteger(changes.delay) || changes.delay < 0 || changes.delay > 60000) {
        return problem(400, "Bad Request", "delay is a whole number of milliseconds, 0 to 60000.");
      }
      runtime.settings.delay = changes.delay;
    }
    return show();
  }
  if (!["model", "lint", "reset", "state", "snapshot", "restore"].includes(action)) {
    return problem(
      404,
      "Not Found",
      `No control endpoint at /${[CONTROL_PREFIX, ...segments].join("/")}. There are: health, model, lint, settings, reset, state, snapshot, restore, ui.`,
    );
  }
  if (!stateful.length) {
    return problem(
      409,
      "No state",
      "No API keeps state. Start the mock with --stateful (createMockApp({ stateful: true })).",
    );
  }
  /** The stateful API with an id, or a problem response. */
  const find = (id) =>
    stateful.find((api) => api.id === id) ||
    problem(
      404,
      "Not Found",
      `No API with state named ${id}. There are: ${stateful.map((api) => api.id).join(", ")}.`,
    );
  /** The APIs a request is about: the one `?api=` names, else all. */
  const chosen = () => {
    if (!query.has("api")) return stateful;
    const api = find(query.get("api"));
    return api.state ? [api] : api;
  };
  const document = (list) => Object.fromEntries(list.map((api) => [api.id, view(api).snapshot()]));

  if (action === "model" && rest.length <= 4) {
    const wrong = allow("GET");
    if (wrong) return wrong;
    if (!rest.length) return json({ apis: stateful.map((api) => modelOf(api, view(api))) });
    const api = find(rest[0]);
    if (!api.state) return api;
    const [, kind, item, extra] = rest;
    const { model } = api.state;
    if (kind === undefined) return json(modelOf(api, view(api)));
    if (kind === "resources" && item !== undefined) {
      const resource = describeResource(api.doc, model, item);
      if (!resource) {
        return problem(
          404,
          "Not Found",
          `${api.id} has no resource ${item}. There are: ${api.state.store.names.join(", ")}.`,
        );
      }
      if (extra === undefined) {
        return json({ ...resource, records: view(api).list(item).total });
      }
      if (extra === "sample") {
        const seed = query.has("seed")
          ? Number(query.get("seed"))
          : Math.floor(Math.random() * 2 ** 31);
        if (!Number.isInteger(seed) || seed < 0) {
          return problem(400, "Bad Request", "seed is a whole number from 0.");
        }
        return json({ seed, record: await sampleRecord(api.doc, model, item, seed) });
      }
    }
    if (kind === "operations" && item !== undefined && extra === undefined) {
      const operation = describeOperation(api.doc, model, item);
      if (!operation) return problem(404, "Not Found", `${api.id} has no operation ${item}.`);
      // What the plain mock answers: the shape of the response, with example or generated values. `?code=404`:
      // that documented response, as a request with `Prefer: code=404` gets it
      const code = query.get("code");
      if (code !== null && !/^[1-5]\d\d$/.test(code)) {
        return problem(400, "Bad Request", "code is a status code from 100 to 599.");
      }
      let sample;
      try {
        const found = api.byKey.get(`${operation.method.toLowerCase()} ${operation.path}`);
        const response = await api.respond({
          operation: found.operation,
          pointer: found.pointer,
          prefer: code ? { code } : {},
          accept: "application/json",
        });
        sample = { status: response.status, source: response.source, body: response.body ?? null };
      } catch (err) {
        sample = { error: err.message };
      }
      return json({ ...operation, sample });
    }
    return problem(
      404,
      "Not Found",
      `No model at /${[CONTROL_PREFIX, ...segments].join("/")}. Under an API there are resources/<Resource>, resources/<Resource>/sample and operations/<id>.`,
    );
  }

  if (action === "lint" && rest.length === 1) {
    const wrong = allow("GET");
    if (wrong) return wrong;
    if (!runtime?.lint) {
      return problem(
        404,
        "Not Found",
        "This mock was started without lint. rapidoc mock --stateful has it (createMockApp({ lint })).",
      );
    }
    const api = find(rest[0]);
    if (!api.state) return api;
    try {
      return json(await runtime.lint(api));
    } catch (err) {
      return problem(500, "Lint failed", String(err?.message || err).split("\n")[0]);
    }
  }

  if (action === "reset" && !rest.length) {
    const wrong = allow("POST");
    if (wrong) return wrong;
    const list = chosen();
    if (!Array.isArray(list)) return list;
    // A body asks for new seed data: `{ "rows": 25, "seed": 7 }`, either or both
    let asked;
    try {
      asked = await body();
    } catch {
      asked = undefined; // no body, or not JSON: a plain reset
    }
    if (isObject(asked) && runtime && ("rows" in asked || "seed" in asked)) {
      const rows = asked.rows ?? runtime.settings.rows;
      const seed = asked.seed ?? runtime.settings.seed;
      const whole = (value, max) => Number.isInteger(value) && value >= 0 && value <= max;
      if (!whole(rows, 1000) || !whole(seed, 2 ** 31)) {
        return problem(
          400,
          "Bad Request",
          "rows is a whole number from 0 to 1000, and seed a whole number from 0.",
        );
      }
      await runtime.reseed(list, { rows, seed });
      return { status: 204, headers: {}, body: null };
    }
    for (const api of list) view(api).reset();
    return { status: 204, headers: {}, body: null };
  }

  if (action === "snapshot" && !rest.length) {
    const wrong = allow("POST");
    if (wrong) return wrong;
    const list = chosen();
    return Array.isArray(list) ? json(document(list)) : list;
  }

  if (action === "restore" && !rest.length) {
    const wrong = allow("POST");
    if (wrong) return wrong;
    let data;
    try {
      data = await body();
    } catch {
      return problem(400, "Bad Request", "The request body is not valid JSON.");
    }
    const shape =
      isObject(data) &&
      Object.values(data).every(
        (collections) =>
          isObject(collections) &&
          Object.values(collections).every(
            (records) => Array.isArray(records) && records.every(isObject),
          ),
      );
    if (!shape) {
      return problem(
        400,
        "Bad Request",
        'The body must be a state document: { "<api id>": { "<Resource>": [records] } }, as /__mock/snapshot returns.',
      );
    }
    // Everything is checked before anything is replaced: a bad document changes nothing
    const targets = [];
    for (const [id, collections] of Object.entries(data)) {
      const api = find(id);
      if (!api.state) return api;
      const unknown = Object.keys(collections).find(
        (name) => !api.state.store.names.includes(name),
      );
      if (unknown) {
        return problem(
          400,
          "Bad Request",
          `${id} has no resource ${unknown}. There are: ${api.state.store.names.join(", ")}.`,
        );
      }
      targets.push([api, collections]);
    }
    for (const [api, collections] of targets) view(api).restore(collections);
    return { status: 204, headers: {}, body: null };
  }

  if (action === "state" && rest.length <= 3) {
    const wrong = allow("GET");
    if (wrong) return wrong;
    const [id, resource, key] = rest;
    if (id === undefined) return json(document(stateful));
    const api = find(id);
    if (!api.state) return api;
    if (resource === undefined) return json(view(api).snapshot());
    if (!api.state.store.names.includes(resource)) {
      return problem(
        404,
        "Not Found",
        `${id} has no resource ${resource}. There are: ${api.state.store.names.join(", ")}.`,
      );
    }
    if (key === undefined) return json(view(api).list(resource).records);
    const record = view(api).get(resource, key);
    return record === undefined
      ? problem(404, "Not Found", `No ${resource} with key ${key} in ${id}.`)
      : json(record);
  }

  return problem(
    404,
    "Not Found",
    `No control endpoint at /${[CONTROL_PREFIX, ...segments].join("/")}.`,
  );
}
