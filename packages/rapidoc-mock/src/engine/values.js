import { Faker, en } from "@faker-js/faker";

/**
 * Named values and word lists, backed by @faker-js/faker. This file is the only one that imports it: swap the
 * library here and keep the two exports.
 *
 * - `valuesFor(seed)`: value makers for one record; the same seed always gives the same values.
 * - `WORDS`: lower-case words that name a kind of thing, per domain, for recognising what an entity or a field
 *   is about (`elephant` is an animal). English only, as the library's lists are.
 */

const faker = new Faker({ locale: en });
const lowered = (list) => list.map((word) => String(word).toLowerCase());

export const WORDS = {
  animal: lowered(faker.definitions.animal.type),
  vehicle: lowered(faker.definitions.vehicle.type).flatMap((type) => type.split(" ")),
  food: [
    ...lowered(faker.definitions.food.fruit),
    ...lowered(faker.definitions.food.vegetable),
    ...lowered(faker.definitions.food.meat),
  ].filter((word) => !word.includes(" ")),
};

/**
 * @param {number} seed
 * @returns {Record<string, () => string>} Makers of one value each; calling the same ones in the same order
 *   after the same seed repeats the values
 */
export function valuesFor(seed) {
  faker.seed(seed >>> 0);
  return {
    firstName: () => faker.person.firstName(),
    lastName: () => faker.person.lastName(),
    jobTitle: () => faker.person.jobTitle(),
    phone: () => faker.phone.number({ style: "international" }),
    petName: () => faker.animal.petName(),
    animalType: () => faker.animal.type(),
    productName: () => faker.commerce.productName(),
    department: () => faker.commerce.department(),
    companyName: () => faker.company.name(),
    vehicle: () => faker.vehicle.vehicle(),
    dish: () => faker.food.dish(),
    city: () => faker.location.city(),
    country: () => faker.location.country(),
    street: () => faker.location.streetAddress(),
    zip: () => faker.location.zipCode(),
    url: () => faker.internet.url(),
    color: () => faker.color.human(),
    sentence: () => faker.lorem.sentence({ min: 5, max: 10 }),
    words: () => faker.lorem.words({ min: 2, max: 3 }),
  };
}
