const {LoginPage} = require('./LoginPage')
const {BasePage} = require('./BasePage')
const {RegisterPage} = require('./RegisterPage')
const {EditorPage} = require('./EditorPage')
const {ArticlePage} = require('./ArticlePage')

class PageManager {
    constructor() {
        this.loginPage = new LoginPage()
        this.basePage = new BasePage()
        this.editorPage = new EditorPage()
        this.registerPage = new RegisterPage()
        this.articlePage = new ArticlePage()
    }
}

module.exports = {PageManager}