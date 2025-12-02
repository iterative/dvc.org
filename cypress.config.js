const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:8000',
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    // Increase timeouts to account for dev server page building
    pageLoadTimeout: 60000, // 60 seconds for page loads
    defaultCommandTimeout: 10000 // 10 seconds for commands
  }
})
