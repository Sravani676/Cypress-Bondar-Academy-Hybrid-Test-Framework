const { BasePage } = require("./BasePage")

class EditorPage extends BasePage {
    // Selectors
    get editorPage() { return cy.get(".editor-page") }
    get titleInput() { return cy.get("input[placeholder='Article Title']") }
    get descriptionInput() { return cy.get('input[placeholder="What\'s this article about?"]') }
    get bodyInput() { return cy.get(".editor-page textarea") }
    get tagsInput() { return cy.get("input[placeholder='Enter tags']") }
    get publishButton() { return cy.get("button[type='button']") }
    get errorMessages() { return cy.get(".error-messages li") }

    //Tags 
    get tagList() { return cy.get('.editor-page .tag-list'); }
    get tagPills() { return cy.get('.editor-page .tag-list .tag-pill'); }
    get tagRemoveIcons() { return cy.get('.editor-page .tag-list .ion-close-round'); }


    //Field actions
    enterArticleTitle(title) {
        this.titleInput.clear().type(title)
        return this
    }

    enterArticleDescription(description) {
        this.descriptionInput.clear().type(description)
        return this
    }

    enterArticleBody(body) {
        this.bodyInput.clear().type(body)
        return this
    }

    addTag(tag) {
        this.tagsInput.clear().type(`${tag}{enter}`);
        return this
    }

    addTags(tags = []) {
        tags.forEach((tag) => this.addTag(tag));
        return this
    }

    removeTagAt(index) {
        this.tagRemoveIcons.eq(index).click();
        return this
    }

    removeTagByName(tagText) {
        this.tagPills
        .contains(tagText)
        .find('i.ion-close-round')
        .click();

        return this;
    }

    clickPublish() {
        this.publishButton.click()
        return this
    }

    //Navigation
    navigateToEdit() {
        cy.visit('/editor')
        this.assertonEditorPage()
        return this
    }

    //Compound actions
    publishArticle(title, description, body, tags = []) {
        this.enterArticleTitle(title)
        this.enterArticleDescription(description)
        this.enterArticleBody(body)
        if (Array.isArray(tags) && tags.length > 0) this.addTags(tags)
            else this.addTag(tags)
        this.clickPublish()

        return this
    }

    // Update only the fields provided and omitted keys remain the same 
    updateArticle(updates = {}) {
        if (updates.title       !== undefined) this.enterTitle(updates.title)
        if (updates.description !== undefined) this.enterDescription(updates.description)
        if (updates.body        !== undefined) this.enterBody(updates.body)
        if (updates.tagList     !== undefined) this.addTags(updates.tagList)
        this.clickPublish()

        return this;
    }

    //Assertions
    assertonEditorPage() {
        cy.url().should('include', '/editor')
        this.editorPage.should('be.visible')
        this.titleInput.should('be.visible')
        return this
    }

    assertEditorPageStructure() {
        cy.url().should('include', '/editor');
        this.titleInput.should('be.visible')
        this.descriptionInput.should('be.visible')
        this.bodyInput.should('be.visible')
        this.tagsInput.should('be.visible')
        this.publishButton.should('be.visible').and('contain.text', 'Publish Article')
        this.userProfileLink.should('be.visible')

        return this
    }

    assertPublishSuccess() {
        cy.url().should('include', '/article/')
        cy.get('.article-page').should('be.visible')
        return this
    }

    assertTagExists(tagText) {
        this.tagPills.should('contain.text', tagText)
        return this
    }

    assertTagNotExists(tagText) {
        this.tagList.should('not.contain.text', tagText)
        return this
    }

    assertTagListEmpty() {
        this.tagPills.should('not.exist')
        return this
    }

    assertTagCount(count) {
        if (count === 0) {
            this.tagPills.should('not.exist')
        } else {
            this.tagPills.should('have.length', count)
        }
        return this
    }

    assertErrorContains(message) {
        cy.log(message)
        this.errorMessages.should('be.visible').and('contain.text', message)
        return this
    }

    assertNoErrors() {
        cy.get('.error-messages').should('not.exist')
        return this
    }

    assertAllFieldsEmpty() {
        this.titleInput.should('have.value', '')
        this.descriptionInput.should('have.value', '')
        this.bodyTextarea.should('have.value', '')
        this.tagsInput.should('have.value', '')
        return this
    }

    assertTitlePrefilled(expectedValue) {
        this.titleInput.should('have.value', expectedValue)
        return this
    }

    assertDescriptionPrefilled(expectedValue) {
        this.descriptionInput.should('have.value', expectedValue)
        return this
    }

    assertBodyPrefilled(expectedValue) {
        this.bodyInput.should('have.value', expectedValue)
        return this
    }

}

module.exports = {EditorPage}; 