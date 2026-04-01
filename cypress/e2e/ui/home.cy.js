import { PageManager } from "../../pages/PageManager"
import * as webActions from "../../helpers/webActions";


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
        pm.loginPage.navigateToLogin()
        webActions.loginWithDefaultCredentials()
        cy.env(['VALID_USERNAME']).then(({VALID_USERNAME}) => {
            pm.loginPage.assertLoggedIn(VALID_USERNAME)
        })
    })
})