import * as webActions from "../../helpers/webActions";
import testData from "../../fixtures/login.json";
import { PageManager } from "../../pages/PageManager"

const pm = new PageManager()

describe("LOGIN PAGE TESTS", () => {
  beforeEach(() => {
    cy.clearAuthState();
    pm.loginPage.navigateToLogin()
  });

  context("Positive scenarios", () => {
    it("Verify page structure",{ tags: "smoke" }, () => {
      pm.loginPage.assertLoginPageStructure()
    });

    it("Login with valid credentials", { tags: "smoke" }, () => {
      webActions.loginWithDefaultCredentials();
      pm.loginPage.assertSuccessfulLogin()
    });
  });

  context("Negative scenarios", () => {
    Object.entries(testData.invalidUsers).forEach(([key, data]) => {
      it(data.testScenario, { tags: "regression" }, () => {
        pm.loginPage.login(data.email, data.password)
        pm.loginPage.assertErrorMessages(data.expectedUIError)
      });
    });
  });
});
