class BasePage {
    // Selectors
    get homePage() { return cy.get(".home-page") }
    get appIcon() { return cy.get(".navbar-brand") }
    get homeLink() { return cy.get("ul a[href='/']")}
    get signinLink() { return cy.get("a[href='/login']")}
    get signupLink() { return cy.get("a[href='/register']")}
    get newArticleLink() { return cy.get("a[href='/editor']")}
    get settingsLink() { return cy.get("a[href='/settings']")}
    get userProfileLink() {
        return cy
        .get("nav a.nav-link")
        .filter(':not([href="#/editor"]):not([href="#/settings"])')
        .last()
    }

    // Actions
    navigate() {
        cy.visit('/')
        return this
    }
    goToHome() {
        this.homeLink.click()
        return this
    }

    goToSettings() {
        this.settingsLink.click()
        cy.url().should('eq', Cypress.config('baseUrl')+'settings')
        return this
    }

    goToProfile(username) {
        this.userProfileLink.click()
        cy.url().should('eq', Cypress.config('baseUrl')+'profile/'+username)
        return this
    }

    clickNewArticle() {
        this.newArticleLink.click()
        cy.url().should('eq', Cypress.config('baseUrl')+'editor')
        return this
    }

    // assertions
    assertLoggedOut() {
        this.signinLink.should('be.visible').and('contain', 'Sign in')
        this.signupLink.should('be.visible').and('contain', 'Sign up')
        this.homeLink.should('be.visible').and('contain', 'Home')
        this.settingsLink.should('not.exist')
        this.newArticleLink.should('not.exist')
        return this
    }

    assertLoggedIn(username) {
        this.settingsLink.should('be.visible').and('contain', 'Settings')
        this.newArticleLink.should('be.visible').and('contain', 'New Article')
        this.homeLink.should('be.visible').and('contain', 'Home')
        
        if(username) {
            this.userProfileLink.should('be.visible').and('contain', username)
        }

        this.signinLink.should('not.exist')
        this.signupLink.should('not.exist')
        return this
    }

}

module.exports = {BasePage};