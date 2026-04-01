import { defineConfig } from 'cypress'

export default defineConfig({
  defaultCommandTimeout: 5000,
  pageLoadTimeout: 60000,
  env: {
    // Base URLs
    BASE_URL: "https://conduit.bondaracademy.com/",
    API_BASE_URL: "https://conduit.bondaracademy.com/api",

    // Test Credentials
    ENCRYPTED_PASSWORD: "U2FsdGVkX1+RFICFdP4SMIcOHiGSJIwoSBCFmGnuOWI=",
    SECRET_KEY: "secret",
    VALID_USERNAME: "cypress-test-user",
    VALID_EMAIL: "cypress_user@test.com",
    INVALID_EMAIL: "invalid@notexist.com",
    INVALID_PASSWORD: "wrongpass",

    // Tags for selective execution
    tags: "",

    // Timeouts
    SHORT_TIMEOUT: 5000,
    LONG_TIMEOUT: 20000,
  },
  // ─── Reporter ─────────────────────────────────────────────────────────────
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    charts: true,
    reportPageTitle: "AutomationExercise Hybrid Test Report",
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    reportDir: "cypress/reports/mochawesome",
    overwrite: false,
    html: true,
    json: true,
  },
  // ─── E2E Config ───────────────────────────────────────────────────────────
  e2e: {
    baseUrl: 'https://conduit.bondaracademy.com/',
    specPattern: "cypress/e2e/**/*.cy.{js,ts}",
    supportFile: 'cypress/support/Commands.js',
    defaultCommandTimeout: 10000,
    apiUrl: "https://conduit-api.bondaracademy.com/api",
    // env: {
    //   apiUrl: "https://conduit-api.bondaracademy.com/api"  // API base URL
    // },
    setupNodeEvents(on, config) {
      // ── Mochawesome Reporter ──
      require("cypress-mochawesome-reporter/plugin")(on);

      // ── Grep Plugin (tag-based execution) ──
      require("@cypress/grep/src/plugin")(config);

      // ── Task: Log to terminal ──
      on("task", {
        log(message) {
          console.log(`[TASK LOG] ${message}`);
          return null;
        },
        table(data) {
          console.table(data);
          return null;
        },
      });

      return config;
    },
  },
})