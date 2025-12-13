import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // setupNodeEvents bleibt eine Funktion
    setupNodeEvents(on, config) {
      // Falls du alte plugins verwendest (CommonJS):
      // Die require-Aufruf sollte die Funktion aus ./cypress/plugins/index.js aufrufen und ggf. config zurückgeben.
      // Wenn du nichts importieren musst, kannst du die Funktion auch leer lassen.
      return require('./cypress/plugins/index.js')(on, config);
    },

    // Diese Optionen müssen außerhalb der setupNodeEvents-Funktion stehen:
    baseUrl: 'http://localhost:4200', // setze hier die URL deines laufenden Dev-Servers
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',

    // Falls du testIsolation nutzen willst, kann es hier stehen:
    testIsolation: false,
  },
});
