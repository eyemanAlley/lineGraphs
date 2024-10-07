const { defineConfig } = require("cypress");

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
      excludeSpecPattern: [
        '*/**/Cypress/**/*',
        '*/**/cache',
    ],
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    excludeSpecPattern: [
      '*/**/Cypress/**/*',
      '*/**/cache',
    ],
  },
  
});
