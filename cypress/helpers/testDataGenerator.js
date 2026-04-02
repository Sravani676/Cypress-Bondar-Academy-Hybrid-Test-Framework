import {faker} from "@faker-js/faker";

export function generateRandomValidUserDetails() {
    const username = validUserName()
    const email = validUserEmail()
    const password = validUserPassword()

    return {username, email, password}
}

export function validUserEmail() {
    return faker.internet.email()
}

export function validUserPassword() {
    return faker.string.alphanumeric({length: {min:8, max:20}})
}

export function validUserName() {
    return faker.person.fullName()
}

export function invalidUserEmailFormat() {
    return "not-an-email"
}

export function passwordWithLessThanMinLength() {
    return faker.string.alphanumeric({length: {min: 1, max:7}})
}

export function passwordWithGreaterThanMaxLength() {
    return faker.string.alphanumeric({length: {min:21, max:30}})
}
