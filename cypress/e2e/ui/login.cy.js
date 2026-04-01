import {LoginPage} from "../../pages/LoginPage";
import {faker} from "@faker-js/faker";
import * as webActions from "../../helpers/webActions"

const loginPage = new LoginPage();

describe('LOGIN PAGE TESTS', () => {
    let errorMessage = 'email or password is invalid'
    
    beforeEach(() => {
        cy.clearAuthState()
        loginPage.navigateToLogin()
    })

    context('Positive scenarios', ()=> {
        it('Login-TC01: Verify page structure',() => {
            loginPage.assertLoginPageStructure()
        })

        it('Login-TC02: Login with valid credentials', ()=> {
            webActions.loginWithDefaultCredentials()
            loginPage.assertSuccessfulLogin()
        })
    })

    context('Negative scenarios', () => {
        it('Login-TC03: Login with blank email should throw an error', () => {
            const password = faker.lorem.word()
            loginPage.login("    ",password )
            loginPage.assertErrorMessages("email can't be blank")
        })

        it('Login-TC04: Login with blank password should throw an error', () => {
            const email = faker.internet.email()
            loginPage.login(email,'     ' )
            loginPage.assertErrorMessages("password can't be blank")
        })
        
        it('Login-TC05: Login with blank email and password should throw an error', () => {
            loginPage.login("    ", "          " )
            loginPage.assertErrorMessages("email can't be blank")
        })

        it('Login-TC06: Login with Invalid email format should throw an error', () => {
            const password = faker.lorem.word()
            loginPage.login('not.an.email',password)
            loginPage.assertErrorMessages(errorMessage)
        })

        it('Login-TC07: Login with Invalid password should throw an error', ()=> {
            cy.env(['VALID_EMAIL']).then(({VALID_EMAIL}) => {
                const password = faker.lorem.word()
                loginPage.login(VALID_EMAIL, password)
                loginPage.assertErrorMessages(errorMessage)
            })
        })

        it('Login-TC06: Login with non-existent email should throw an error', ()=> {
            cy.env(['VALID_PASSWORD']).then(({VALID_PASSWORD}) => {
                const email = faker.internet.email()
                loginPage.login(email, VALID_PASSWORD)
                loginPage.assertErrorMessages(errorMessage)
            })
        })
    })
})