import { PageManager } from "../../pages/PageManager";
import * as testDataGenerator from "../../helpers/testDataGenerator";
import testData from "../../fixtures/register.json";

const pm = new PageManager()

describe("REGISTER PAGE TESTS", () => {
  let blankInput, email, password, username, errorMessage, registeredEmail, registeredUsername;
  before(() => {
    //const pm = new PageManager()
    blankInput = "           ";

    //storing the existing user details
    cy.env(["VALID_EMAIL", "VALID_USERNAME"]).then(
      ({ VALID_EMAIL, VALID_USERNAME }) => {
        registeredEmail = VALID_EMAIL;
        registeredUsername = VALID_USERNAME;
      },
    );
  });
  beforeEach(() => {
    cy.clearAuthState();
    pm.registerPage.navigateToRegister()
  });

  context("Positive scenarios", () => {
    it("Verify page structure", { tags: "smoke" }, () => {
      pm.registerPage.assertRegisterPageStructure();
    });

    it("Register with valid credentials", { tags: "smoke" }, () => {
      const randomUserDetails =
        testDataGenerator.generateRandomValidUserDetails();
      pm.registerPage.signup(
        randomUserDetails.username,
        randomUserDetails.email,
        randomUserDetails.password,
      );
      pm.registerPage.assertSuccessfulSignup();
    });
  });

  context("Negative scenarios", () => {
    it("Verify user registration with invalid email format should throw an error", {tags: "regression"},() => {
        username = testDataGenerator.validUserName()
        password = testDataGenerator.validUserPassword()
        email = testDataGenerator.invalidUserEmailFormat()
        errorMessage = testData.invalidRegistrationValues.invalidEmailFormat.expectedUIError

        pm.registerPage.signup(username, email, password)
        pm.registerPage.assertErrorMessages(errorMessage)
    });

    it("Verify user registration with existing username should throw an error", {tags: "regression"},() => {
        email = testDataGenerator.validUserEmail()
        password = testDataGenerator.validUserPassword()
        errorMessage = testData.invalidRegistrationValues.existingUsername.expectedUIError

        pm.registerPage.signup(registeredUsername, email, password)
        pm.registerPage.assertErrorMessages(errorMessage)
    });

    it("Verify user registration with existing email should throw an error", {tags: "regression"},() => {
        username = testDataGenerator.validUserName()
        password = testDataGenerator.validUserPassword()
        errorMessage = testData.invalidRegistrationValues.existingEmail.expectedUIError

        pm.registerPage.signup(username, registeredEmail, password)
        pm.registerPage.assertErrorMessages(errorMessage)
    });

    it("Verify user registration with existing email and existing username should throw an error", {tags: "regression"},() => {
        password = testDataGenerator.validUserPassword()
        const emailErrorMessage = testData.invalidRegistrationValues.existingEmail.expectedUIError
        const usernameErrorMessage = testData.invalidRegistrationValues.existingUsername.expectedUIError

        pm.registerPage.signup(registeredUsername, registeredEmail, password)
        pm.registerPage.assertErrorCount(2)
        pm.registerPage.assertErrorMessages(emailErrorMessage)
        pm.registerPage.assertErrorMessages(usernameErrorMessage)
    });

    it("Verify user registration with blank Password should throw an error", {tags: "regression"},() => {
        username = testDataGenerator.validUserName()
        email = testDataGenerator.validUserEmail()
        errorMessage = testData.invalidRegistrationValues.blankPassword.expectedUIError

        pm.registerPage.signup(username, email, blankInput)
        pm.registerPage.assertErrorMessages(errorMessage)
    });

    it("Verify user registration with blank email should throw an error", {tags: "regression"},() => {
        username = testDataGenerator.validUserName()
        password = testDataGenerator.validUserPassword()
        errorMessage = testData.invalidRegistrationValues.blankEmail.expectedUIError

        pm.registerPage.signup(username, blankInput, password)
        pm.registerPage.assertErrorMessages(errorMessage)
    });

    it("Verify user registration with blank username should throw an error", {tags: "regression"},() => {
        password = testDataGenerator.validUserPassword()
        email = testDataGenerator.validUserEmail()
        errorMessage = testData.invalidRegistrationValues.blankUsername.expectedUIError
        
        pm.registerPage.signup(blankInput, email, blankInput)
        pm.registerPage.assertErrorMessages(errorMessage)
    });

    it("Verify user registration with all blank inputs should throw an error", {tags: "regression"},() => {
        const usernameErrorMessage = testData.invalidRegistrationValues.blankUsername.expectedUIError
        const emailErrorMessage = testData.invalidRegistrationValues.blankEmail.expectedUIError
        const passwordErrorMessage = testData.invalidRegistrationValues.blankPassword.expectedUIError
        

        pm.registerPage.signup(blankInput, blankInput, blankInput)
        pm.registerPage.assertErrorCount(3)
        pm.registerPage.assertErrorMessages(usernameErrorMessage)
        pm.registerPage.assertErrorMessages(emailErrorMessage)
        pm.registerPage.assertErrorMessages(passwordErrorMessage)
    });

    it("Verify user registration with password greater than accepted length should throw an error", {tags: "regression"},() => {
        email = testDataGenerator.validUserEmail()
        username = testDataGenerator.validUserName()
        password = testDataGenerator.passwordWithGreaterThanMaxLength()
        errorMessage = testData.invalidRegistrationValues.greaterThanMaxPasswordLength.expectedUIError

        pm.registerPage.signup(username, email, password)
        pm.registerPage.assertErrorMessages(errorMessage)
    });

    it("Verify user registration with password greater than accepted length should throw an error", {tags: "regression"},() => {
        email = testDataGenerator.validUserEmail()
        username = testDataGenerator.validUserName()
        password = testDataGenerator.passwordWithLessThanMinLength()
        errorMessage = testData.invalidRegistrationValues.shorterThanMinPasswordLength.expectedUIError

        pm.registerPage.signup(username, email, password)
        pm.registerPage.assertErrorMessages(errorMessage)
    });
  });
});
