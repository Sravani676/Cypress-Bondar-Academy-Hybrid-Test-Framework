import * as apiActions from "../../helpers/apiActions";
import * as testDataGenerator from "../../helpers/testDataGenerator";
import { PageManager } from "../../pages/PageManager";
import testData from "../../fixtures/register.json";

describe("Login via API Tests", () => {
  let url, headers, registeredEmail, registeredUsername, blankInput;
  const pm = new PageManager();

  before(() => {
    headers = { "Content-Type": "application/json" };
    url = Cypress.config("apiUrl") + "/users";
    blankInput = "        "

    cy.env(["VALID_EMAIL", "VALID_USERNAME"]).then(
      ({ VALID_EMAIL, VALID_USERNAME }) => {
        registeredEmail = VALID_EMAIL;
        registeredUsername = VALID_USERNAME;
      },
    );
  });
  context("Valid User Registration Scenarios", {tags: "smoke"} , () => {
    it("Registration with valid user details should return 201", () => {
        cy.log(url)
      const { username, email, password } =
        testDataGenerator.generateRandomValidUserDetails();
      const body = {
        user: {
          email: email,
          password: password,
          username: username,
        },
      };

      apiActions.apiPost(url, body, headers).then((response) => {
        expect(response.status).to.eq(201);
        const userData = response.body.user;
        cy.log(userData.token);
      });
    });

    it("Injecting the JWT token obtained from Registration and navigating to home page should load app as authenticated ", {tags: "smoke"}, () => {
      const { username, email, password } =
        testDataGenerator.generateRandomValidUserDetails();
      const body = {
        user: {
          email: email,
          password: password,
          username: username,
        },
      };

      apiActions.apiPost(url, body, headers).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property("user");

        const userData = response.body.user;
        expect(userData).to.have.property("email", email);
        expect(userData).to.have.property("username", username);
        expect(userData).to.have.property("token").and.be.a("string").and.not.to
          .be.empty;

        const token = response.body.user.token;

        //Injecting the JWT Token into local storage
        cy.visit("/", {
          onBeforeLoad(window) {
            window.localStorage.setItem("jwtToken", token);
          },
        });

        //After injecting token and visiting home, app should be authenticated
        pm.loginPage.assertLoggedIn();
        cy.log(
          "Injecting JWT Token is successful and navigating to Application grants authenticated UI access",
        );
      });
    });
  });

  context("Invalid User Registration Scenarios", () => {
    it("Registering with Existing email should return HTTP 422 ", { tags: "regression" }, () => {
      const body = {
        user: {
          email: registeredEmail,
          password: testDataGenerator.validUserPassword(),
          username: testDataGenerator.validUserName(),
        },
      };

      apiActions.apiPost(url, body, headers).then((response) => {
        expect(response.status).to.eq(422);
        const expectedJson =
          testData.invalidRegistrationValues.existingEmail;
        apiActions.assertErrorResponseBody(response, expectedJson);
      });
    });

    it("Registering with Existing username should return HTTP 422 ", { tags: "regression" }, () => {
      const body = {
        user: {
          email: testDataGenerator.validUserEmail(),
          password: testDataGenerator.validUserPassword(),
          username: registeredUsername,
        },
      };

      apiActions.apiPost(url, body, headers).then((response) => {
        expect(response.status).to.eq(422);
        const expectedJson =
          testData.invalidRegistrationValues.existingUsername;
        apiActions.assertErrorResponseBody(response, expectedJson);
      });
    });

    it("Registering with invalid Email format should return HTTP 422 ", { tags: "regression" }, () => {
      const body = {
        user: {
          email: testDataGenerator.invalidUserEmailFormat(),
          password: testDataGenerator.validUserPassword(),
          username: testDataGenerator.validUserName(),
        },
      };

      apiActions.apiPost(url, body, headers).then((response) => {
        expect(response.status).to.eq(422);
        const expectedJson =
          testData.invalidRegistrationValues.invalidEmailFormat;
        apiActions.assertErrorResponseBody(response, expectedJson);
      });
    });

    it("Registering with Blank email should return HTTP 422", { tags: "regression" }, () => {
      const body = {
        user: {
          email: blankInput,
          password: testDataGenerator.validUserPassword(),
          username: testDataGenerator.validUserName(),
        },
      };
      apiActions.apiPost(url, body, headers).then((response) => {
        expect(response.status).to.eq(422);
        const expectedJson = testData.invalidRegistrationValues.blankEmail;
        apiActions.assertErrorResponseBody(response, expectedJson);
      });
    });

    it("Registering with Blank password should return HTTP 422", { tags: "regression" }, () => {
      const body = {
        user: {
          email: testDataGenerator.validUserEmail(),
          password: blankInput,
          username: testDataGenerator.validUserName(),
        },
      };
      apiActions.apiPost(url, body, headers).then((response) => {
        expect(response.status).to.eq(422);
        const expectedJson = testData.invalidRegistrationValues.blankPassword;
        apiActions.assertErrorResponseBody(response, expectedJson);
      });
    });

    it("Registering with Blank username should return HTTP 422", { tags: "regression" }, () => {
      const body = {
        user: {
          email: testDataGenerator.validUserEmail(),
          password: testDataGenerator.validUserPassword(),
          username: blankInput,
        },
      };
      apiActions.apiPost(url, body, headers).then((response) => {
        expect(response.status).to.eq(422);
        const expectedJson = testData.invalidRegistrationValues.blankUsername;
        apiActions.assertErrorResponseBody(response, expectedJson);
      });
    });

    it("Registering with Blank email, blank password, blank username should return HTTP 422", { tags: "regression" }, () => {
      const body = {
        user: {
          email: blankInput,
          password: blankInput,
          username: blankInput,
        },
      };
      apiActions.apiPost(url, body, headers).then((response) => {
        let expectedJson;
        expect(response.status).to.eq(422);
        const errorAssertList = [
          "blankEmail",
          "blankPassword",
          "blankUsername",
        ];
        errorAssertList.forEach((errorType) => {
          expectedJson = testData.invalidRegistrationValues[errorType]//JSON.stringify(testData.invalidRegistrationValues[errorType]); 
          apiActions.assertErrorResponseBody(response, expectedJson);
        });
      });
    });

    it("Registering with Password length greater than Accepted length should return 422", { tags: "regression" }, ()=> {
      const body = {
        user: {
          email: testDataGenerator.validUserEmail(),
          password: testDataGenerator.passwordWithGreaterThanMaxLength(),
          username: testDataGenerator.validUserName()
        }
      }

      apiActions.apiPost(url, body, headers).then((response)=> {
        expect(response.status).to.eq(422)
        const expectedJson = testData.invalidRegistrationValues.greaterThanMaxPasswordLength
        apiActions.assertErrorResponseBody(response, expectedJson)
      })
    });

    it("Registering with Password length shorter than Accepted length should return 422", { tags: "regression" }, ()=> {
      const body = {
        user: {
          email: testDataGenerator.validUserEmail(),
          password: testDataGenerator.passwordWithLessThanMinLength(),
          username: testDataGenerator.validUserName()
        }
      }

      apiActions.apiPost(url, body, headers).then((response)=> {
        expect(response.status).to.eq(422)
        const expectedJson = testData.invalidRegistrationValues.shorterThanMinPasswordLength
        apiActions.assertErrorResponseBody(response, expectedJson)
      })
    });

  });
});
