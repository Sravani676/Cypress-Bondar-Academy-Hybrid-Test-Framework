import * as webActions from "./webActions";
export function assertErrorResponseBody(response, expectedJson) {
  const errors = response.body.errors;
  const errorCode = expectedJson.expectedApiError.errorKey;
  const errorMessage = expectedJson.expectedApiError.errorValue;

  expect(errors).to.have.property(errorCode);
  expect(errors[errorCode]).to.include(errorMessage);
}

export function apiPost(url, body, headers) {
  cy.log(body.title, body.tagList)
  cy.log(headers)
  cy.log(url)
  return cy.request({
    method: "POST",
    url,
    body,
    headers,
    failOnStatusCode: false,
  });
}

export function apiGet(url, headers) {
  return cy.request({
    method: "GET",
    url,
    headers,
    failOnStatusCode: false,
  });
}

export function apiDelete(url, headers) {
  return cy.request({
    method: "DELETE",
    url,
    headers,
    failOnStatusCode: false,
  });
}

export function apiPut(url, body, headers) {
  return cy.request({
    method: "PUT",
    url,
    body,
    headers,
    failOnStatusCode: false,
  });
}

export function getToken(email, password) {
  const url = `${Cypress.config("apiUrl")}/users/login`;
  const headers = { "Content-Type": "application/json" };
  const body = { user: { email, password } };

  return apiPost(url, body, headers).then((response) => {
    expect(response.status).to.eq(200);
    const token = response.body.user.token;
    expect(token).to.be.a("string").and.not.be.empty;
    return token;
  });
}

export function obtainDefaultUserToken() {
  return cy
    .env(["VALID_EMAIL", "ENCRYPTED_PASSWORD", "SECRET_KEY"])
    .then(({ VALID_EMAIL, ENCRYPTED_PASSWORD, SECRET_KEY }) => {
      const email = VALID_EMAIL;
      const password = webActions.decipherPassword(
        SECRET_KEY,
        ENCRYPTED_PASSWORD,
      );

      return getToken(email, password);
    });
}

export function mapArticle(jsonArticle) {
  return {
    article: {
      title: jsonArticle.title,
      description: jsonArticle.description,
      body: jsonArticle.body,
      tagList: jsonArticle.tagList || [],
    },
  };
}

export function validateArticleResponse(responseBody, requestBody) {
  const res = responseBody.article;
  const req = requestBody.article;


  // 1. Validate basic fields
  expect(res.title).to.eq(req.title);
  expect(res.description).to.eq(req.description);
  expect(res.body).to.eq(req.body);


  // 2. Validate tagList (case-insensitive + sorted)
  const normalize = (arr) => (arr ?? []).map((t) => t.toLowerCase()).sort();

  expect(normalize(res.tagList)).to.deep.eq(normalize(req.tagList));

  // 3. Validate slug exists and is string
  expect(res.slug).to.be.a("string").and.not.be.empty;

  // 4. Validate timestamps
  expect(res.createdAt).to.be.a("string");
  expect(res.updatedAt).to.be.a("string");

  // 5. Validate author exists
  expect(res.author).to.have.property("username");

  // Return slug for chaining
  return res.slug;
}

export function setHeader(token) {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Token ${token}`
  }

  return headers
}

export function setUrlToArticle(slug) {
  const url = `${Cypress.config('apiUrl')}/articles/${slug}`
  return url
}

export function uniqueArticle(baseArticle) {
  return {
    article: {
      ...baseArticle.article,
      title: `${baseArticle.article.title} ${Date.now()}`,
      tagList: baseArticle.article.tagList ?? [],
    },
  };
}