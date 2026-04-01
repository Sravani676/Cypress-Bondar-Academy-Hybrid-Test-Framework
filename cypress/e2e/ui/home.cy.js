import { PageManager } from "../../pages/PageManager"

const pm = new PageManager()
describe('Home Page Validation', () => {
    beforeEach(()=> {
        cy.clearAuthState()
        pm.loginPage.navigate()
    })

    it('Home-TC01: Verify the Page elements before authentication', ()=> {
        pm.loginPage.assertLoggedOut()

    })

    it('Home-TC02: Verify the Page elements after authentication', () => {
        cy.env(['VALID_EMAIL', 'VALID_PASSWORD', 'VALID_USERNAME']).then(({VALID_EMAIL, VALID_PASSWORD, VALID_USERNAME}) => {
            pm.loginPage.navigateToLogin()
            cy.log(VALID_EMAIL, VALID_PASSWORD)
            pm.loginPage.login(VALID_EMAIL, VALID_PASSWORD)
            pm.loginPage.assertLoggedIn(VALID_USERNAME)
        })
    })
})