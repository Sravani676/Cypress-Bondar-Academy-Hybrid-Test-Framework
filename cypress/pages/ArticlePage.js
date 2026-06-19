const { EditorPage } = require("./EditorPage");

class ArticlePage extends EditorPage {
    //Selectors 
    get articlePage() { return cy.get(".article-page")}
    get articleTitle() { return cy.get(".container h1")}
    get editArticleButton() { return cy.get(".article-page .banner a.btn-outline-secondary") }
    get deleteArticleButton() { return cy.get(".article-page .banner .btn-outline-danger")}
    get authorName() { return cy.get('.article-page .banner .article-meta .author') }
    get publishDate() { return cy.get('.article-page .banner .article-meta .date') }
    get articleBodyContent() { return cy.get(".row.article-content p")}
    get articleTags() {return cy.get(".tag-list")}
    get articleTagsCount() { return cy.get(".tag-list li")}

    //Comment section selectors
    get commentTextbox() {return cy.get(".card-block textarea")}
    get postCommentButton() {return cy.get("button[type='submit']")}
    get commentDeleteIcons() { return cy.get(".mod-options i.ion-trash-a")}
    get commentBodies() { return cy.get('.card-block p') }


    //Navigation
    navigateToArticle(slug) {
        cy.visit(`/article/${slug}`)
        this.articlePage.should('be.visible')
        this.articleTitle.should('be.visible')
        return this
    }

    // Actions
    editArticle() {
        this.editArticleButton.click()
        return this
    }
    
    deleteArticle() {
        this.deleteArticleButton.click()
        return this
    }

    enterComment(comment) {
        this.commentTextbox.clear().type(comment)
        return this
    }
    submitComment() {
        this.postCommentButton.click()
        return this
    }

    postComment(text) {
        this.enterComment(text)
        this.submitComment()
        return this
    }

    deleteCommentAt(index) {
        this.commentDeleteIcons.eq(index).click()
        return this
    }

    // Assertions
    assertArticlePageStructure() {
        this.articlePage.should('be.visible')
        this.articleTitle.should('be.visible')
        this.articleBodyContent.should('be.visible')
        this.authorName.should('be.visible')
        this.publishDate.should('be.visible')
        return this
    }

    assertSlugInUrl(slug) {
        cy.url().should('include', `/article/${slug}`)
        return this
    }

    assertTitle(expectedTitle) {
        this.articleTitle.should('contain.text', expectedTitle)
        return this
    }

    assertAuthor(expectedAuthor) {
        this.authorName.should('contain.text', expectedAuthor)
        return this
    }

    assertBodyContent(expectedContent) {
        this.articleBodyContent.should('contain.text', expectedContent)
        return this
    }

    assertTagExists(tag) {
        this.articleTags.should('contain.text', tag)
        return this
    }

    assertTagCount(count) {
        this.articleTagsCount.should('have.length', count)
        return this
    }

    assertCommentFormVisible() {
        this.commentTextbox.should('be.visible')
        this.postCommentButton.should('be.visible')
        return this
    }

    assertCommentExists(text) {
        this.commentBodies.should('contain.text', text)
        return this
    }

    assertCommentNotExists(text) {
        cy.get('.card-block p').should('not.contain.text', text)
        return this
    }


}

module.exports = {ArticlePage}