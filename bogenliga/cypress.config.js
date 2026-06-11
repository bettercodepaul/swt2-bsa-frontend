const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:4200",
    // Schusszettel-Flows (Login -> Meldung -> Satzeingabe) brauchen mehrere
    // Backend-Roundtrips, daher grosszuegigere Timeouts als der Default.
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
    testIsolation: false,
    env: {
      BACKEND_URL: "http://localhost:9000",
      // Lokale Postgres-Instanz fuer den Testdaten-Reset der
      // Tablet-Schusszettel-Demo (Wettkampf 3001, V39-Migration).
      PSQL_PATH: "C:\\Program Files\\PostgreSQL\\16\\bin\\psql.exe",
      DB_HOST: "localhost",
      DB_PORT: 5432,
      DB_NAME: "swt2",
      DB_USER: "swt2",
      DB_PASSWORD: "swt2",
    },
  },

  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.ts",
  },
});
