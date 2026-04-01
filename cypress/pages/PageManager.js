const {LoginPage} = require('./LoginPage')
const {BasePage} = require('./BasePage')

class PageManager {
    constructor() {
        this.loginPage = new LoginPage()
        this.BasePage = new BasePage()
    }
}

module.exports = {PageManager}