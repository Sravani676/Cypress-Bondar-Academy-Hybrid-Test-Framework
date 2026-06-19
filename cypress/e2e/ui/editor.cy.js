import { PageManager } from "../../pages/PageManager";
import * as webActions from "../../helpers/webActions";
import * as testDataGenerator from "../../helpers/testDataGenerator";
import testData from "../../fixtures/editor.json";

const pm = new PageManager();

describe("EDITOR PAGE TESTS", () => {
  beforeEach(() => {
    cy.clearAuthState();
    pm.loginPage.navigateToLogin();
    webActions.loginWithDefaultCredentials();
    pm.editorPage.navigateToEdit();
  });

  context("Tag Management scenarios", () => {
    it(
      "should add a single tag by pressing Enter and show it as a pill",
      { tags: "smoke" },
      () => {
        pm.editorPage.addTag(testData.tagList.single);
        pm.editorPage.assertTagExists(testData.tagList.single);
        pm.editorPage.assertTagCount(1);
      },
    );

    it(
      "should add multiple tags and show all as separate pills",
      { tags: "smoke" },
      () => {
        const tags = testData.tagList.multiple;
        pm.editorPage.addTags(tags);
        pm.editorPage.assertTagCount(tags.length);
        tags.forEach((tag) => pm.editorPage.assertTagExists(tag));
      },
    );

    it(
      "should clear the tag input field after a tag is committed",
      { tags: "smoke" },
      () => {
        pm.editorPage.addTag("testtag");
        pm.editorPage.tagsInput.should("have.value", "");
      },
    );

    it(
      "should remove a tag by clicking its x icon (by index)",
      { tags: "smoke" },
      () => {
        pm.editorPage.addTags(["first", "second", "third"]);
        pm.editorPage.assertTagCount(3);
        pm.editorPage.removeTagAt(1);
        pm.editorPage.assertTagCount(2);
        pm.editorPage.assertTagNotExists("second");
      },
    );

    it("should remove a tag by matching its name", { tags: "smoke" }, () => {
      pm.editorPage.addTags(["alpha", "beta", "gamma"]);
      pm.editorPage.removeTagByName("beta");
      pm.editorPage.assertTagNotExists("beta");
      pm.editorPage.assertTagExists("alpha");
      pm.editorPage.assertTagExists("gamma");
    });

    it(
      "should remove all tags leaving an empty tag list",
      { tags: "smoke" },
      () => {
        pm.editorPage.addTags(["one", "two"]);
        pm.editorPage.removeTagAt(0);
        pm.editorPage.removeTagAt(0);
        pm.editorPage.assertTagListEmpty();
      },
    );
  });

  context("Positive Editor Page scenarios", () => {
    it("should render all four form fields", { tags: "smoke" }, () => {
      pm.editorPage.assertEditorPageStructure();
    });

    it(
      "Should be able to publish an article successfully with all the fields and redirect to article page",
      { tags: "smoke" },
      () => {
        const article = {
          ...testData.validArticle.article,
          title: `${testData.validArticle.article.title} ${Date.now()}`,
        };
        pm.editorPage.publishArticle(
          article.title,
          article.description,
          article.body,
          article.tagList,
          //article,
        );
        pm.editorPage.assertPublishSuccess();
        cy.log("Article with valid data has been published successfully");

        pm.articlePage.assertTitle(article.title)
        pm.articlePage.assertBodyContent(article.body)
        pm.articlePage.deleteArticle();
      },
    );

    it(
      "should publish a minimal article (no tags) successfully",
      { tags: "smoke" },
      () => {
        const article = {
          ...testData.minimalArticle.article,
          title: `${testData.minimalArticle.article.title} ${Date.now()}`,
        };
        pm.editorPage.publishArticle(
          article.title,
          article.description,
          article.body,
        );
        pm.editorPage.assertPublishSuccess();
        cy.log("Minimal article (no tags) published successfully");
        pm.articlePage.assertTitle(article.title);
        pm.articlePage.assertBodyContent(article.body)
        pm.articlePage.deleteArticle();
      },
    );

    it(
      "should publish an article with single tag successfully",
      { tags: "smoke" },
      () => {
        const article = testDataGenerator.generateRandomValidArticle();
        pm.editorPage.publishArticle(
          article.title,
          article.description,
          article.body,
          article.tags,
        );
        cy.log("Minimal article (no tags) published successfully");
        pm.articlePage.assertTitle(article.title);
        pm.articlePage.assertBodyContent(article.body)
        pm.articlePage.deleteArticle();
      },
    );
  });

  context("Negative Editor page scenarios", () => {
    it("Creating article with Blank title should throw an error", {tags: "regression"}, () => {
      const article = {
        ...testData.invalidArticles.missingTitle.article,
      };
      const expectedUIError = testData.invalidArticles.missingTitle.expectedUIError
      //pm.editorPage.publishArticle(article.title, article.description, article.body)
      pm.editorPage.enterArticleDescription(article.description);
      pm.editorPage.enterArticleBody(article.body);
      pm.editorPage.clickPublish();
      pm.editorPage.assertErrorContains(expectedUIError);
    });

    it("Creating an article with Blank description should throw an error", {tags: "regression"}, () => {
      const article = {
        ...testData.invalidArticles.missingDescription.article,
      };
      const expectedUIError = testData.invalidArticles.missingDescription.expectedUIError

      pm.editorPage.enterArticleTitle(article.title);
      pm.editorPage.enterArticleBody(article.body);
      pm.editorPage.clickPublish();
      pm.editorPage.assertErrorContains(expectedUIError);
    });

    it("Creating an article with Blank Body should throw an error", {tags: "regression"}, () => {
      const article = {
        ...testData.invalidArticles.missingBody.article,
      };
      const expectedUIError = testData.invalidArticles.missingBody.expectedUIError

      pm.editorPage.enterArticleTitle(article.title);
      pm.editorPage.enterArticleDescription(article.description);
      pm.editorPage.clickPublish();
      pm.editorPage.assertErrorContains(expectedUIError);
    });

    it("Creating an article with Blank inputs in title, description and body fields should throw an error", {tags: "regression"}, () => {
      const article = {
        ...testData.invalidArticles.allEmpty.article,
      };
      const expectedUIError = testData.invalidArticles.allEmpty.expectedUIError

      pm.editorPage.clickPublish();
      cy.log(article.expectedUIError)
      pm.editorPage.assertErrorContains(expectedUIError);
    });
  });

});
