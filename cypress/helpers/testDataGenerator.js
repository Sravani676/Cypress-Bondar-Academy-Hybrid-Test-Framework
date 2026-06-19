import { faker } from "@faker-js/faker";

export function generateRandomValidUserDetails() {
  const username = validUserName();
  const email = validUserEmail();
  const password = validUserPassword();

  return { username, email, password };
}

export function validUserEmail() {
  return faker.internet.email();
}

export function validUserPassword() {
  return faker.string.alphanumeric({ length: { min: 8, max: 20 } });
}

export function validUserName() {
  return faker.person.fullName();
}

export function invalidUserEmailFormat() {
  return "not-an-email";
}

export function passwordWithLessThanMinLength() {
  return faker.string.alphanumeric({ length: { min: 1, max: 7 } });
}

export function passwordWithGreaterThanMaxLength() {
  return faker.string.alphanumeric({ length: { min: 21, max: 30 } });
}

function pickrandomElement(tagsList) {
  return tagsList[Math.floor(Math.random() * tagsList.length)];
}

function pickMultipleRandomElements(tagsList) {
  const result = [];
  const count = Math.floor(Math.random() * tagsList.length) + 1;

  while (result.length < count) {
    const item = tagsList[Math.floor(Math.random() * tagsList.length)];

    if (!result.includes(item)) {
      result.push(item);
    }
  }
  return result;
}

export function generateRandomValidArticle(multipleTags = false) {
  let tags;
  const title = faker.lorem.words({ min: 2, max: 5 });
  const description = faker.lorem.sentence({ min: 3, max: 5 });
  const body = faker.lorem.paragraph({ min: 2, max: 8 });

  const tagsList = [
    "Test",
    "Cypress",
    "Automation",
    "Blog",
    "Git",
    "Youtube",
    "LinkedIn",
    "QA",
  ];
  if (multipleTags) {
    tags = pickMultipleRandomElements(tagsList);
  } else {
    tags = pickrandomElement(tagsList);
  }

  const article = { title, description, body, tags };

  return article;
}
