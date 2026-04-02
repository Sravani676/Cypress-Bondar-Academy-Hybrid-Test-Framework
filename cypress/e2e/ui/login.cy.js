import { LoginPage } from "../../pages/LoginPage";
import * as webActions from "../../helpers/webActions";
import testData from "../../fixtures/login.json";

const loginPage = new LoginPage();

describe("LOGIN PAGE TESTS", () => {
  beforeEach(() => {
    cy.clearAuthState();
    loginPage.navigateToLogin();
  });

  context("Positive scenarios", () => {
    it("Verify page structure",{ tags: "smoke" }, () => {
      loginPage.assertLoginPageStructure();
    });

    it("Login with valid credentials", { tags: "smoke" }, () => {
      webActions.loginWithDefaultCredentials();
      loginPage.assertSuccessfulLogin();
    });
  });

  context("Negative scenarios", () => {
    Object.entries(testData.invalidUsers).forEach(([key, data]) => {
      it(data.testScenario, { tags: "regression" }, () => {
        cy.log(data.email, data.password)
        loginPage.login(data.email, data.password);
        loginPage.assertErrorMessages(data.expectedError)
      });
    });
  });
});
