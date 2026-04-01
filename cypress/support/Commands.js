
/**
 * Clears LocalStorage tokens and cookies for a clean logged out state
 */
Cypress.Commands.add('clearAuthState', () => {
    cy.clearCookies();
    cy.clearLocalStorage();
});

/**
 * Login via API, acquire JWT token and store it in LocalStorage
 */
Cypress.Commands.add('loginViaApi', (email, password) => {
    cy.request({
        method: 'POST',
        url: cy.expose(API_BASE_URL),
        body: {
            user: {email, password}
        },
        headers: { 'Content-Type': 'application/json'},
        failOnStatusCode: false,
    }).then((response) => {
        expect(response.status).to.eq(200, 'API Login should succeed')
        const token = response.body.user.token
        const username = response.body.user.username
        window.localStorage.setItem('jwtToken', token)
        cy.env('authToken', token)
        cy.env('username', username)
        cy.log(`API login successful — user: ${username}`)
    })
})