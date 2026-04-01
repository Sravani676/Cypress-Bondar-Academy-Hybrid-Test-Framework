const {BasePage} = require("./BasePage")

class LoginPage extends BasePage{
    // Selectors
    get loginpage() { return cy.get(".auth-page") }
    get pageTitle() { return cy.get(".auth-page h1")}
    get registerLink() { return cy.get(".auth-page a") }
    get emailInput() { return cy.get("input[placeholder='Email']") }
    get passwordInput() { return cy.get("input[placeholder='Password']") }
    get signinButton() { return cy.get("button[type='submit']") }
    get errorMessages() { return cy.get("ul[class='error-messages'] li")}

    // Field actions
    enterEmail(email) {
        this.emailInput.clear().type(email)
        return this
    }

    enterPassword(password) {
        this.passwordInput.clear().type(password)
        return this
    }

    clickSignin() {
        this.signinButton.click()
        return this
    }

    // Navigation and Actions
    navigateToLogin() {
        cy.visit("/login");
        this.pageTitle.should("contain.text", "Sign in");
        return this;
    }

    login(email, password) {
        this.enterEmail(email)
        this.enterPassword(password)
        this.clickSignin()
        return this
    }


    // Assertions
    assertLoginPageStructure() {
        this.loginpage.should('be.visible')
        this.pageTitle.should('be.visible')
        this.registerLink.should('be.visible')
        this.emailInput.should('be.visible')
        this.passwordInput.should('be.visible')
        this.signinButton.should('be.visible').and('be.disabled')
        return this
    }

    assertErrorMessages(message) {
        this.errorMessages.should('be.visible').and('contain', message)
        return this
    }

    assertSuccessfulLogin() {
        cy.url().should("not.include", "/login")
        this.userProfileLink.should('be.visible')
        return this
    }



}
module.exports = {LoginPage};
