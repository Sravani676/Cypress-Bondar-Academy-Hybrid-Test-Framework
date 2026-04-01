export function assertErrorResponseBody(response, expectedJson) {
  const errors = response.body.errors;
  const errorCode = expectedJson.api.errorKey;
  const errorMessage = expectedJson.api.errorValue;

  expect(errors).to.have.property(errorCode);
  expect(errors[errorCode]).to.include(errorMessage);
}

export function apiPost(url, body, headers) {
  return cy
    .request({
      method: "POST",
      url,
      body,
      headers,
      failOnStatusCode: false,
    })
    .then((response) => {
      return response;
    });
}
