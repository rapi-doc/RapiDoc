import { generate } from 'json-schema-faker';

/**
 * Data generation, backed by json-schema-faker. This file is the only one that imports it: swap the library
 * here and keep `fake(schema, seed) → Promise<value>`, where `schema` is self-contained JSON Schema 2020-12
 * (toJsonSchema) and the same seed always gives the same value.
 */

const pad = (n) => String(n).padStart(2, '0');

const OPTIONS = {
  formats: {
    // within the date-time range below, instead of any year
    date: (random) => `${random.int(2025, 2026)}-${pad(random.int(1, 12))}-${pad(random.int(1, 28))}`,
  },
  alwaysFakeOptionals: true, // full objects read better in docs and Try than sparse ones
  useExamplesValue: true, // a property's own `examples` beat random strings
  useDefaultValue: true,
  maxDefaultItems: 3,
  minDateTime: '2025-01-01T00:00:00Z',
  maxDateTime: '2026-12-31T23:59:59Z',
  failOnInvalidTypes: false,
};

export const fake = (schema, seed) => generate(schema, { ...OPTIONS, seed });
