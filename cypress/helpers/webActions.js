import * as CryptoJS from "crypto-js";
import { LoginPage } from "../pages/LoginPage";
const loginPage = new LoginPage();

export function decipherPassword(key, password) {
  const decryptedPassword = CryptoJS.AES.decrypt(password, key).toString(
    CryptoJS.enc.Utf8,
  );
  return decryptedPassword;
}

export function loginWithDefaultCredentials() {
  cy.env(["VALID_EMAIL", "ENCRYPTED_PASSWORD", "SECRET_KEY"]).then(
    ({ VALID_EMAIL, ENCRYPTED_PASSWORD, SECRET_KEY }) => {
      const VALID_PASSWORD = decipherPassword(SECRET_KEY, ENCRYPTED_PASSWORD);
      loginPage.login(VALID_EMAIL, VALID_PASSWORD);
      loginPage.assertSuccessfulLogin();
    },
  );
}
