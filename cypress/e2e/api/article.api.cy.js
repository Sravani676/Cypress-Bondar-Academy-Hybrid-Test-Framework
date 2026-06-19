import * as apiActions from "../../helpers/apiActions";
import testData from "../../fixtures/editor.json";
import * as testDataGenerator from "../../helpers/testDataGenerator";


const unauthenticatedHeaders = { "Content-Type": "application/json" };

describe("Article API Tests", () => {
  let url, headers, token;

  before(() => {
    headers = { "Content-Type": "application/json" };
    url = Cypress.config("apiUrl") + "/articles";
    apiActions.obtainDefaultUserToken().then((usertoken) => {
      token = usertoken;
    });
  });

  context("Valid Test Scenarios", () => {
    it("Create an article successfully", { tags: "smoke" }, () => {
      const data = testDataGenerator.generateRandomValidArticle(true);
      const requestBody = apiActions.mapArticle(data);
      headers = apiActions.setHeader(token);

      apiActions.apiPost(url, requestBody, headers).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.article).to.have.property("slug");

        const slug = apiActions.validateArticleResponse(response.body, requestBody);
        cy.wrap(slug).as("articleSlug");
      });

      cy.get("@articleSlug").then((slug) => {
        apiActions.apiDelete(`${url}/${slug}`, headers).then((response) => {
          expect(response.status).to.eq(204);
        });
      });
    });

    it("Create a minimal article without tags successfully", { tags: "smoke" }, () => {
      const requestBody = apiActions.uniqueArticle(testData.minimalArticle);
      headers = apiActions.setHeader(token);

      apiActions.apiPost(url, requestBody, headers).then((response) => {
        expect(response.status).to.eq(201);

        const slug = apiActions.validateArticleResponse(response.body, requestBody);
        cy.wrap(slug).as("articleSlug");
      });

      cy.get("@articleSlug").then((slug) => {
        apiActions.apiDelete(`${url}/${slug}`, headers).then((response) => {
          expect(response.status).to.eq(204);
        });
      });
    });

    it("Read an article successfully", { tags: "smoke" }, () => {
      const getArticleUrl = `${url}/${testData.readArticle.slugId}`;
      headers = apiActions.setHeader(token);

      apiActions.apiGet(getArticleUrl, headers).then((response) => {
        expect(response.status).to.eq(200);
        apiActions.validateArticleResponse(response.body, testData.readArticle);
      });
    });

    it("Update an article successfully", { tags: "smoke" }, () => {
      const requestBody = apiActions.uniqueArticle(testData.validArticle);
      const updateTitle = `This is Update article title ${Date.now()}`;
      headers = apiActions.setHeader(token);

      apiActions.apiPost(url, requestBody, headers).then((response) => {
        expect(response.status).to.eq(201);
        const slug = apiActions.validateArticleResponse(response.body, requestBody);
        cy.wrap(slug).as("articleSlug");
      });

      cy.get("@articleSlug").then((slug) => {
        const updatedBody = { article: { title: updateTitle } };

        apiActions.apiPut(`${url}/${slug}`, updatedBody, headers).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.article.title).to.eq(updateTitle);
          cy.wrap(response.body.article.slug).as("articleSlug");
        });
      });

      cy.get("@articleSlug").then((slug) => {
        apiActions.apiDelete(`${url}/${slug}`, headers).then((response) => {
          expect(response.status).to.eq(204);
        });
      });
    });

    it("Delete an article successfully", { tags: "smoke" }, () => {
      const requestBody = apiActions.uniqueArticle(testData.validArticle);
      headers = apiActions.setHeader(token);

      apiActions.apiPost(url, requestBody, headers).then((response) => {
        expect(response.status).to.eq(201);
        cy.wrap(response.body.article.slug).as("articleSlug");
      });

      cy.get("@articleSlug").then((slug) => {
        apiActions.apiDelete(`${url}/${slug}`, headers).then((response) => {
          expect(response.status).to.eq(204);
        });

        apiActions.apiGet(`${url}/${slug}`, headers).then((response) => {
          expect(response.status).to.eq(404);
        });
      });
    });
  });

  context("Invalid scenarios", () => {
    context("Create — invalid POST requests", () => {
      Object.entries(testData.invalidArticles).forEach(([, data]) => {
        it(data.apiTestScenario, { tags: "regression" }, () => {
          const requestBody = { article: data.article };
          headers = apiActions.setHeader(token);

          apiActions.apiPost(url, requestBody, headers).then((response) => {
            expect(response.status).to.eq(data.expectedStatusCode);
            apiActions.assertErrorResponseBody(response, data);
          });
        });
      });

      it("POST article without auth token should return HTTP 401", { tags: "regression" }, () => {
        const requestBody = apiActions.uniqueArticle(testData.validArticle);

        apiActions.apiPost(url, requestBody, unauthenticatedHeaders).then((response) => {
          expect(response.status).to.eq(401);
        });
      });

      it("POST article with invalid auth token should return HTTP 401", { tags: "regression" }, () => {
        const requestBody = apiActions.uniqueArticle(testData.validArticle);
        const invalidHeaders = apiActions.setHeader("invalid-token-value");

        apiActions.apiPost(url, requestBody, invalidHeaders).then((response) => {
          expect(response.status).to.eq(401);
        });
      });
    });

    context("Read — invalid GET requests", () => {
      it("GET article with non-existent slug should return HTTP 404", { tags: "regression" }, () => {
        headers = apiActions.setHeader(token);

        apiActions
          .apiGet(`${url}/slug-that-does-not-exist-${Date.now()}`, headers)
          .then((response) => {
            expect(response.status).to.eq(404);
          });
      });
    });

    context("Update — invalid PUT requests", () => {
      it("PUT article with non-existent slug should return HTTP 404", { tags: "regression" }, () => {
        const requestBody = apiActions.uniqueArticle(testData.validArticle);
        headers = apiActions.setHeader(token);

        apiActions
          .apiPut(`${url}/non-existent-slug-${Date.now()}`, requestBody, headers)
          .then((response) => {
            expect(response.status).to.eq(404);
          });
      });

      it("PUT article without auth token should return HTTP 401", { tags: "regression" }, () => {
        const requestBody = apiActions.uniqueArticle(testData.validArticle);
        headers = apiActions.setHeader(token);

        apiActions.apiPost(url, requestBody, headers).then((response) => {
          expect(response.status).to.eq(201);
          cy.wrap(response.body.article.slug).as("articleSlug");
        });

        cy.get("@articleSlug").then((slug) => {
          apiActions
            .apiPut(`${url}/${slug}`, requestBody, unauthenticatedHeaders)
            .then((response) => {
              expect(response.status).to.eq(401);
            });
        });

        cy.get("@articleSlug").then((slug) => {
          apiActions.apiDelete(`${url}/${slug}`, apiActions.setHeader(token)).then((response) => {
            expect(response.status).to.eq(204);
          });
        });
      });
    });

    context("Delete — invalid DELETE requests", () => {
      it("DELETE article with non-existent slug should return HTTP 404", { tags: "regression" }, () => {
        headers = apiActions.setHeader(token);

        apiActions
          .apiDelete(`${url}/non-existent-slug-${Date.now()}`, headers)
          .then((response) => {
            expect(response.status).to.eq(404);
          });
      });

      it("DELETE article without auth token should return HTTP 401", { tags: "regression" }, () => {
        const requestBody = apiActions.uniqueArticle(testData.validArticle);
        headers = apiActions.setHeader(token);

        apiActions.apiPost(url, requestBody, headers).then((response) => {
          expect(response.status).to.eq(201);
          cy.wrap(response.body.article.slug).as("articleSlug");
        });

        cy.get("@articleSlug").then((slug) => {
          apiActions.apiDelete(`${url}/${slug}`, unauthenticatedHeaders).then((response) => {
            expect(response.status).to.eq(401);
          });
        });

        cy.get("@articleSlug").then((slug) => {
          apiActions.apiDelete(`${url}/${slug}`, apiActions.setHeader(token)).then((response) => {
            expect(response.status).to.eq(204);
          });
        });
      });

      it("DELETE article with invalid auth token should return HTTP 401", { tags: "regression" }, () => {
        const requestBody = apiActions.uniqueArticle(testData.validArticle);
        headers = apiActions.setHeader(token);

        apiActions.apiPost(url, requestBody, headers).then((response) => {
          expect(response.status).to.eq(201);
          cy.wrap(response.body.article.slug).as("articleSlug");
        });

        cy.get("@articleSlug").then((slug) => {
          const invalidHeaders = apiActions.setHeader("invalid-token-value");

          apiActions.apiDelete(`${url}/${slug}`, invalidHeaders).then((response) => {
            expect(response.status).to.eq(401);
          });
        });

        cy.get("@articleSlug").then((slug) => {
          apiActions.apiDelete(`${url}/${slug}`, headers).then((response) => {
            expect(response.status).to.eq(204);
          });
        });
      });
    });
  });
});
