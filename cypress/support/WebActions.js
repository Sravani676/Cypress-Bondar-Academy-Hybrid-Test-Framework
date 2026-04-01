// import * as CryptoJS from "crypto-js";

// class WebActions {
//   encryptPassword() {
//     const key = "secret";
//     cy.env(["VALID_PASSWORD"]).then(({ VALID_PASSWORD }) => {
//       const encrypted = CryptoJS.AES.encrypt(
//         VALID_PASSWORD,
//         key,
//       ).toString();
//       cy.log("Original Password: " + VALID_PASSWORD);
//       cy.log("Encrypted Data: " + encrypted);
//     });
//   }

//   decipherPassword(key, password) {
//     // cy.env(["ENCRYPTED_PASSWORD", "SECRET_KEY"]).then(({ENCRYPTED_PASSWORD, SECRET_KEY}) => {
//     //     const decryptedPassword = (CryptoJS.AES.decrypt(ENCRYPTED_PASSWORD, SECRET_KEY)).toString(CryptoJS.enc.Utf8);
//     // })

//     const decryptedPassword = (CryptoJS.AES.decrypt(password, key)).toString(CryptoJS.enc.Utf8)
//     return decryptedPassword
//   }
// }
// module.exports = {WebActions};
