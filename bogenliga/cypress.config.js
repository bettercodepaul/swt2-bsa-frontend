const { defineConfig } = require("cypress");
const fs = require("fs");

// psql fuer den Testdaten-Reset: Windows-Standardpfad, sonst psql aus dem
// PATH (Mac/Linux/abweichende Installation). Per CYPRESS_PSQL_PATH uebersteuerbar.
const WINDOWS_PSQL = "C:\\Program Files\\PostgreSQL\\16\\bin\\psql.exe";
const psqlPath = fs.existsSync(WINDOWS_PSQL) ? WINDOWS_PSQL : "psql";

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
      PSQL_PATH: psqlPath,
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
