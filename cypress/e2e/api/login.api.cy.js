import * as webActions from "../../helpers/webActions";
import * as apiActions from "../../helpers/apiActions";
import { PageManager } from "../../pages/PageManager";
import testData from "../../fixtures/login.json";

//let email, password, username;

describe("Login via API Tests", () => {
  let email, password, username, url, headers;
  const pm = new PageManager();

  before(() => {
    /**
     * Store the user details from env variables to local variables of this test.
     * Decipher the encrypted password and store it in password variable
     */
    cy.env([
      "VALID_EMAIL",
      "ENCRYPTED_PASSWORD",
      "SECRET_KEY",
      "VALID_USERNAME",
    ]).then(
      ({ VALID_EMAIL, ENCRYPTED_PASSWORD, SECRET_KEY, VALID_USERNAME }) => {
        email = VALID_EMAIL;
        password = webActions.decipherPassword(SECRET_KEY, ENCRYPTED_PASSWORD);
        username = VALID_USERNAME;
      },
    );

    /**
     * Set the URL Endpoint and headers
     */
    url = Cypress.config('apiUrl')+'/users/login'
    headers = {
      "Content-Type": "application/json",
    };
  });

  beforeEach(() => {
    cy.clearAuthState();
  });

  context("Successful API Authentication", () => {
    it("Should return HTTP 200 and a valid user object upon authentication with valid credentials", { tags: "smoke" }, () => {
      const body = {
        user: {
          email: email,
          password: password,
        },
      };

      apiActions.apiPost(url, body, headers).then((response) => {
        expect(response.status).to.eq(200);
        const userData = response.body.user;
        expect(userData).to.have.property("email", email);
        expect(userData).to.have.property("username", username);
        expect(userData).to.have.property("token").and.be.a("string").and.not.to
          .be.empty;
      });
    });

    it("Injecting the JWT token obtained from Authentication and navigating to home page should load app as authenticated ",{ tags: "smoke" }, () => {
      const body = {
        user: {
          email: email,
          password: password,
        },
      };

      apiActions.apiPost(url, body, headers).then((response) => {
        expect(response.status).to.eq(200);
        const userData = response.body.user;
        expect(userData).to.have.property("email", email);
        expect(userData).to.have.property("username", username);
        expect(userData).to.have.property("token").and.be.a("string").and.not.to
          .be.empty;

        expect(response.body).to.have.property("user");
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
  context("Invalid Authentication validation", () => {
    Object.entries(testData.invalidUsers).forEach(([key, data]) => {
      it(data.apiTestScenario, { tags: "regression" }, () => {
        const body = {
          user: {
            email: data.email,
            password: data.password,
          },
        };

        apiActions.apiPost(url, body, headers).then((response) => {
          expect(response.status).to.eq(data.expectedStatusCode);
          apiActions.assertErrorResponseBody(response, data);
        });
      });
    });
  });
});
