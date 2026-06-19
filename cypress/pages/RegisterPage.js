const { BasePage } = require("./BasePage");

class RegisterPage extends BasePage {
  // Selectors
  get registerPage() { return cy.get(".auth-page"); }
  get pageTitle() { return cy.get(".auth-page h1"); }
  get loginLink() { return cy.get(".auth-page a"); }
  get usernameInput() { return cy.get("input[placeholder='Username']"); }
  get emailInput() { return cy.get("input[placeholder='Email']"); }
  get passwordInput() { return cy.get("input[placeholder='Password']"); }
  get signupButton() { return cy.get("button[type='submit']"); }
  get errorMessages() { return cy.get("ul[class='error-messages'] li"); }

  //Field Actions
  enterEmail(email) {
    this.emailInput.clear().type(email);
    return this
  }

  enterPassword(password) {
    this.passwordInput.clear().type(password);
    return this
  }

  enterUsername(username) {
    this.usernameInput.clear().type(username);
    return this
  }

  clickSignup() {
    this.signupButton.click();
    return this
  }

  //navigation
  navigateToRegister() {
    cy.visit("/register")
    this.pageTitle.should("contain.text", "Sign up")
    return this
  }

  signup(username, email, password) {
    this.enterUsername(username)
    this.enterEmail(email)
    this.enterPassword(password)
    this.clickSignup()
    return this
  }

  // Assertions
  assertRegisterPageStructure() {
    this.registerPage.should("be.visible")
    this.pageTitle.should("be.visible")
    this.loginLink.should("be.visible")
    this.usernameInput.should("be.visible")
    this.emailInput.should("be.visible")
    this.passwordInput.should("be.visible")
    this.signupButton.should("be.visible").and("be.disabled")
    return this
  }

  assertErrorMessages(message) {
    this.errorMessages.should("be.visible").and("contain", message)
    return this
  }

  assertErrorCount(count) {
    this.errorMessages.should("have.length", count)
    return this
  }

  assertSuccessfulSignup() {
    cy.url().should("not.include", "/register")
    this.userProfileLink.should("be.visible")
    return this
  }
}

module.exports = { RegisterPage };
