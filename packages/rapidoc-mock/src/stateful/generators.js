/**
 * Named value generators of the stateful mock's seed data: values that read like what a field holds, chosen by
 * the domain of the entity or the field and by the field's name (after Mokapi's generator tree), and consistent
 * inside one record: a full name, a username and an e-mail are built from the same first and last name.
 *
 * The values and the word lists that recognise a domain come from `engine/values.js`. A name no list knows
 * (`Beast`, `Notetaker`) has no domain: its `name` becomes "<Entity> <n>", and its other fields keep the value
 * generated from their schema. That is plain, and never wrong.
 */
import { WORDS } from "../engine/values.js";
import { nameKey, singular, splitWords } from "./words.js";

/** Words that name a domain, beside the library's lists (which hold the kinds: `elephant`, `sedan`, `apple`). */
const DOMAIN_WORDS = {
  person:
    "user person people customer owner member contact author employee vet client patient student teacher driver staff attendee guest visitor recipient sender assignee manager candidate applicant subscriber",
  animal: "pet animal beast creature",
  product: "product sku merchandise",
  company: "company organization organisation org vendor supplier business employer merchant brand",
  vehicle: "vehicle car truck van bike",
  food: "food dish meal recipe ingredient",
};
const DOMAINS = Object.fromEntries(
  Object.entries(DOMAIN_WORDS).map(([domain, words]) => [
    domain,
    new Set([...words.split(" "), ...(WORDS[domain] || [])]),
  ]),
);
const PERSON_FIELDS = new Set(
  "firstname lastname givenname familyname surname fullname username email phone birthday birthdate".split(
    " ",
  ),
);

/** The domain a list of words points at: the first word, from the end, that a domain knows. */
function domainOfWords(words) {
  for (const word of [...words].reverse()) {
    const one = singular(word);
    const found = Object.keys(DOMAINS).find((domain) => DOMAINS[domain].has(one));
    if (found) return found;
  }
  return "";
}

/**
 * The domain of an entity: `person`, `animal`, `product`, `company`, `vehicle`, `food` or "" — by the words of
 * its name (`Elephant`, `ManagedUser`), else by how person-like its fields are (a `Member` with `firstName`,
 * `lastName` and `email` is a person whatever it is called).
 * @param {string} entity
 * @param {string[]} fields - Its property names
 */
export function entityDomain(entity, fields) {
  const byName = domainOfWords(splitWords(entity));
  if (byName) return byName;
  const personFields = fields.filter((field) => PERSON_FIELDS.has(nameKey(field))).length;
  return personFields >= 2 ? "person" : "";
}

const slug = (text) =>
  String(text)
    .normalize("NFD")
    .replace(/[^\w]+/g, "")
    .toLowerCase();

/** The person a record describes, made once per record and shared by its fields. */
function person(context) {
  context.person ??= { first: context.values.firstName(), last: context.values.lastName() };
  return context.person;
}

/** What a thing of a domain is called. */
const NAME_OF = {
  person: (c) => `${person(c).first} ${person(c).last}`,
  // a kind of animal (`PetType`, `Species`) is "dog", not a pet's name
  animal: (c) =>
    /^(type|kind|species|breed)$/.test(splitWords(c.entity).at(-1))
      ? c.values.animalType()
      : c.values.petName(),
  product: (c) => c.values.productName(),
  company: (c) => c.values.companyName(),
  vehicle: (c) => c.values.vehicle(),
  food: (c) => c.values.dish(),
};

/** Field name (as `nameKey`) -> generator, for a field of any entity. */
const BY_FIELD = {
  firstname: (c) => person(c).first,
  givenname: (c) => person(c).first,
  lastname: (c) => person(c).last,
  familyname: (c) => person(c).last,
  surname: (c) => person(c).last,
  fullname: NAME_OF.person,
  username: (c) => `${slug(person(c).first)}.${slug(person(c).last)}`,
  email: (c) => `${slug(person(c).first)}.${slug(person(c).last)}@example.com`,
  phone: (c) => c.values.phone(),
  phonenumber: (c) => c.values.phone(),
  jobtitle: (c) => c.values.jobTitle(),
  city: (c) => c.values.city(),
  country: (c) => c.values.country(),
  street: (c) => c.values.street(),
  address: (c) => c.values.street(),
  zip: (c) => c.values.zip(),
  zipcode: (c) => c.values.zip(),
  postalcode: (c) => c.values.zip(),
  company: (c) => c.values.companyName(),
  department: (c) => c.values.department(),
  color: (c) => c.values.color(),
  colour: (c) => c.values.color(),
  website: (c) => c.values.url(),
  url: (c) => c.values.url(),
  description: (c) => c.values.sentence(),
  summary: (c) => c.values.sentence(),
  bio: (c) => c.values.sentence(),
  note: (c) => c.values.sentence(),
  comment: (c) => c.values.sentence(),
};
/** What the generator of a field (by `nameKey`) makes, in words: for `generatorLabel`. */
const FIELD_LABELS = {
  firstname: "a first name",
  givenname: "a first name",
  lastname: "a last name",
  familyname: "a last name",
  surname: "a last name",
  fullname: "a person's full name",
  username: "a username",
  email: "an e-mail address",
  phone: "a phone number",
  phonenumber: "a phone number",
  jobtitle: "a job title",
  city: "a city",
  country: "a country",
  street: "a street address",
  address: "a street address",
  zip: "a postal code",
  zipcode: "a postal code",
  postalcode: "a postal code",
  company: "a company name",
  department: "a department",
  color: "a color",
  colour: "a color",
  website: "a URL",
  url: "a URL",
  description: "a sentence",
  summary: "a sentence",
  bio: "a sentence",
  note: "a sentence",
  comment: "a sentence",
};
const NAME_LABELS = {
  person: "a person's full name",
  animal: "a pet's name, or a kind of animal",
  product: "a product name",
  company: "a company name",
  vehicle: "a vehicle",
  food: "a dish",
};

/** An entity's name as words, in its own casing: `MenuItem` -> "Menu Item", `api_key` -> "api key". */
const readable = (entity) =>
  String(entity)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ");

/** Fields that name the record itself. */
const NAMING = new Set(["name", "title", "label", "displayname"]);

/**
 * The generator for a field of an entity, or undefined: `(context) => value`. `context` is one object per
 * record: `{ values, entity, index }` (values from `valuesFor`, the entity's name, the record's number from 0).
 *
 * - `petName`, `companyName`, `elephant_name`: the words before `name` give the domain, on any entity.
 * - `name` (and `title`, `label`): the entity's domain; with none, "<Entity> <n>".
 * - Any other field by its own name: `email`, `city`, `description`.
 *
 * @param {string} domain - From entityDomain
 * @param {string} field
 */
export function generatorFor(domain, field) {
  const words = splitWords(field);
  const key = nameKey(field);
  // a field with its own generator first: `userName` is a username, not the name of a user
  if (BY_FIELD[key]) return BY_FIELD[key];
  if (words.length > 1 && words.at(-1) === "name") {
    const own = domainOfWords(words.slice(0, -1));
    if (own) return NAME_OF[own];
  }
  if (NAMING.has(key)) {
    if (key === "name" || key === "displayname") {
      return NAME_OF[domain] || ((c) => `${readable(c.entity)} ${c.index + 1}`);
    }
    // a title or label reads as a few words, whatever the entity
    return domain === "person" ? undefined : (c) => c.values.words();
  }
  return undefined;
}

/**
 * What `generatorFor(domain, field)` makes, in words ("a first name", "a city"), or undefined when it has no
 * generator. Follows the same rules, in the same order: keep the two together.
 * @param {string} domain - From entityDomain
 * @param {string} field
 * @param {string} entity - For a `name` with no domain: "<Entity> 1, <Entity> 2, ..."
 */
export function generatorLabel(domain, field, entity) {
  const words = splitWords(field);
  const key = nameKey(field);
  if (BY_FIELD[key]) return FIELD_LABELS[key];
  if (words.length > 1 && words.at(-1) === "name") {
    const own = domainOfWords(words.slice(0, -1));
    if (own) return NAME_LABELS[own];
  }
  if (NAMING.has(key)) {
    if (key === "name" || key === "displayname") {
      return NAME_LABELS[domain] || `"${readable(entity)} 1", "${readable(entity)} 2", ...`;
    }
    return domain === "person" ? undefined : "a few words";
  }
  return undefined;
}
