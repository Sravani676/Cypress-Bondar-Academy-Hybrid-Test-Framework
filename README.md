# Cypress Bondar Academy — Hybrid Test Framework

[![Cypress](https://img.shields.io/badge/Cypress-15.12.0-04C38E?logo=cypress&logoColor=white)](https://www.cypress.io/)
[![Node](https://img.shields.io/badge/Node-20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CI](https://github.com/Sravani676/Cypress-Bondar-Academy-Hybrid-Test-Framework/actions/workflows/cypress.yml/badge.svg)](https://github.com/Sravani676/Cypress-Bondar-Academy-Hybrid-Test-Framework/actions/workflows/cypress.yml)

A production-grade **Hybrid UI + API End-to-End Test Framework** built with Cypress 15, targeting the [Conduit blog app](https://conduit.bondaracademy.com) — the practice automation platform from Bondar Academy. The framework combines Page Object Model, tag-based test filtering, API bypass authentication, dynamic test data generation, and Mochawesome HTML reporting into a single cohesive solution.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Page Objects](#page-objects)
- [Custom Commands](#custom-commands)
- [Test Fixtures](#test-fixtures)
- [Tagging Strategy](#tagging-strategy)
- [Reporting](#reporting)
- [CI/CD Pipeline](#cicd-pipeline)
- [Author](#author)

---

## Tech Stack

| Tool / Library | Version | Purpose |
|---|---|---|
| [Cypress](https://www.cypress.io/) | `^15.12.0` | Core E2E test runner |
| [@cypress/grep](https://github.com/cypress-io/cypress/tree/develop/npm/grep) | `^4.0.2` | Tag-based test filtering (`smoke`, `regression`) |
| [@bahmutov/cy-api](https://github.com/bahmutov/cy-api) | `^2.2.10` | Cypress-native API testing |
| [@faker-js/faker](https://fakerjs.dev/) | `^8.4.0` | Dynamic test data generation |
| [cypress-real-events](https://github.com/dmtrKovalenko/cypress-real-events) | `^1.13.0` | Native browser events (hover, drag) |
| [cypress-xpath](https://github.com/cypress-io/cypress-xpath) | `^2.0.1` | XPath selector support |
| [cypress-mochawesome-reporter](https://github.com/LironEr/cypress-mochawesome-reporter) | `^3.8.2` | Inline HTML test reports with screenshots |
| [mochawesome-merge](https://github.com/Antontelesh/mochawesome-merge) | `^4.3.0` | Merge multi-run JSON report fragments |
| [ESLint](https://eslint.org/) + [eslint-plugin-cypress](https://github.com/cypress-io/eslint-plugin-cypress) | `^10.1.0` | Code quality & Cypress-specific lint rules |

**Application Under Test:** [https://conduit.bondaracademy.com](https://conduit.bondaracademy.com)

---

## Project Structure

```
Cypress-Bondar-Academy-Hybrid-Test-Framework/
├── .github/
│   └── workflows/
│       └── cypress.yml              # CI/CD GitHub Actions pipeline
│
├── cypress/
│   ├── e2e/
│   │   ├── ui/                      # UI end-to-end tests
│   │   │   ├── login/
│   │   │   │   ├── login.cy.js
│   │   │   │   └── post-login-verification.cy.js
│   │   │   ├── register/
│   │   │   │   └── register.cy.js
│   │   │   ├── settings/
│   │   │   │   └── settings.cy.js
│   │   │   └── editor/
│   │   │       └── editor.cy.js
│   │   └── api/                     # API contract tests
│   │       └── login-api.cy.js
│   │       └── register-api.cy.js
│   │
│   ├── fixtures/                    # Static test data (JSON)
│   │   ├── login.json
│   │   ├── register.json
│   │   ├── settings.json
│   │   └── editor.json
│   │
│   ├── pages/                       # Page Object Models (POM)
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── SettingsPage.js
│   │   ├── EditorPage.js
│   │   └── NavigationBar.js
│   │
│   └── support/
│       ├── commands.js              # Custom cy.* commands (UI)
│       ├── commands.register.js     # Registration-specific commands
│       └── e2e.js                   # Global hooks & uncaught exception handling
│
├── cypress.config.js                # Cypress configuration
├── package.json
├── package-lock.json
├── .eslintrc.json                   # ESLint rules
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** `>=20.x` ([download](https://nodejs.org/))
- **npm** `>=10.x` (bundled with Node)
- A modern browser — Chrome or Firefox recommended

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Sravani676/Cypress-Bondar-Academy-Hybrid-Test-Framework.git
cd Cypress-Bondar-Academy-Hybrid-Test-Framework

# 2. Install all dependencies
npm install

# 3. Verify Cypress is installed
npx cypress verify
```

---

## Running Tests

### Interactive Mode (Cypress Test Runner)

```bash
npm run test:open
```

Opens the Cypress GUI. Select **E2E Testing**, pick a browser, and run individual specs.

### Headless Mode — All Tests

```bash
npm run test:run
```

### UI Tests Only

```bash
npm run test:ui
```

Runs all specs under `cypress/e2e/ui/**/*.cy.js`.

### API Tests Only

```bash
npm run test:api
```

Runs all specs under `cypress/e2e/api/**/*.cy.js`.

### Tag-Based Runs (via @cypress/grep)

```bash
# Smoke suite — fast gate for CI
npm run test:smoke

# Full regression suite
npm run test:regression
```

Tests are tagged inline in spec files:

```js
it('should login with valid credentials', { tags: ['smoke', 'regression'] }, () => { ... });
it('should show error for wrong password',  { tags: ['regression'] },          () => { ... });
```

### Run + Generate Report

```bash
npm run test:report
```

Runs all tests, then automatically merges and generates the HTML report.

### Specific Browser

```bash
# Chrome
npm run test:ui -- --browser chrome

# Firefox
npm run test:ui -- --browser firefox
```

### Headed Mode (visible browser, no auto-close)

```bash
npm run test:headed
```

---

## Page Objects

All page interactions are encapsulated in `cypress/pages/`. Each class exposes three tiers:

| Tier | Example |
|---|---|
| **Getters** (selectors) | `loginPage.emailInput` |
| **Actions** (single field) | `loginPage.enterEmail('user@test.com')` |
| **Compound actions** | `loginPage.login(email, password)` |
| **Assertions** | `loginPage.assertStillOnLoginPage()` |

### Pages Covered

| POM File | URL | Key Responsibility |
|---|---|---|
| `LoginPage.js` | `/#/login` | Login form actions, error assertions |
| `RegisterPage.js` | `/#/register` | Registration form, duplicate user errors |
| `SettingsPage.js` | `/#/settings` | Profile update, field pre-fill verification, logout |
| `EditorPage.js` | `/#/editor` | Article creation, tag management, publish flow |
| `NavigationBar.js` | All pages | Authenticated vs. unauthenticated nav state |

---

## Custom Commands

Defined in `cypress/support/commands.js` and `commands.register.js`:

| Command | Description |
|---|---|
| `cy.loginViaUI(email, password)` | Full UI login — used for login-specific tests |
| `cy.loginViaApi(email, password)` | JWT login via REST API — fast setup for non-login tests |
| `cy.registerViaUI(username, email, password)` | Full UI registration flow |
| `cy.registerViaApi(username, email, password)` | REST API registration for test setup |
| `cy.generateUniqueUser()` | Yields a timestamp-suffixed `{ username, email, password }` object |
| `cy.assertAuthenticatedNav(username)` | Asserts navbar is in logged-in state |
| `cy.assertUnauthenticatedNav()` | Asserts navbar is in logged-out state |
| `cy.clearAuthState()` | Clears localStorage tokens and cookies |

---

## Test Fixtures

JSON fixtures in `cypress/fixtures/` centralize all test data:

```json
// login.json
{
  "validUser":   { "email": "cypress_user@test.com", "password": "Welcome123", "username": "cypress_user" },
  "invalidUsers": { "wrongPassword": { ... }, "wrongEmail": { ... }, ... }
}
```

Fixtures are loaded in tests via:

```js
cy.fixture('login').then((data) => {
  loginPage.login(data.validUser.email, data.validUser.password);
});
```

---

## Tagging Strategy

This framework uses [`@cypress/grep`](https://github.com/cypress-io/cypress/tree/develop/npm/grep) for selective test execution:

| Tag | Purpose | Runs on |
|---|---|---|
| `smoke` | Critical path, fast feedback | Every push, PRs, nightly |
| `regression` | Full coverage | Nightly, release branches |

Run a specific tag from the CLI:

```bash
npx cypress run --env grepTags=smoke
npx cypress run --env grepTags=regression
```

---

## Reporting

This framework uses [`cypress-mochawesome-reporter`](https://github.com/LironEr/cypress-mochawesome-reporter) which automatically embeds screenshots into the HTML report on failure.

```bash
# Generate report after a test run
npm run cy:report
```

Report output: `cypress/reports/report.html`

Screenshots are automatically embedded inline on test failure — no separate artifact download required.

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/cypress.yml`) runs on:

- Every push to `main` or `develop`
- Every pull request targeting `main` or `develop`
- Manual dispatch with suite and browser selectors


See [`.github/workflows/cypress.yml`](.github/workflows/cypress.yml) for full configuration.

---

## Author

**Sravani Bachuwar**
Senior QAE · Cypress & Playwright Automation Expert

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Sravani%20Bachuwar-0A66C2?logo=linkedin&logoColor=white)](https://linkedin.com/in/shravanibachuwar/)
[![GitHub](https://img.shields.io/badge/GitHub-Sravani676-181717?logo=github&logoColor=white)](https://github.com/Sravani676)
