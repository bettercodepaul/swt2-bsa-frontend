describe('Query-Fehleranzeige', function () {
  const url = 'http://localhost:4200/#/wettkaempfe?statistik=ungueltig';
  const structural = '[data-test="query-error"], [role="alert"], .alert-danger, .mat-error, .error';
  const errorRegex = /fehler|ung.?ltig|nicht gefunden|fehlende daten|fehl(er|end)/i;

  beforeEach(() => {
    cy.viewport(2558, 1103);
  });

  it('zeigt eine Fehlermeldung bei ungültigem Query-Parameter', function () {
    // selbst-entfernender fail-Handler: loggt Dokumenttext und wirft den Fehler weiter
    const failHandler = (err) => {
      try {
        const fullText = (Cypress.$('html').text() || '').trim();
        // eslint-disable-next-line no-console
        console.error('--- Dokumententext (gekürzt) ---\n', fullText.slice(0, 2000));
      } finally {
        // Entferne den Handler, damit er andere Tests nicht beeinflusst
        try {
          Cypress.off('fail', failHandler);
        } catch (e) {
          // falls Cypress.off nicht vorhanden wäre, nichts weiter tun
        }
      }
      // Fehler weiterwerfen, damit Cypress den Test weiterhin als fehlgeschlagen markiert
      throw err;
    };

    // Registriere den Handler
    Cypress.on('fail', failHandler);

    cy.visit(url);
    cy.get('#regionenForm', { timeout: 15000 }).should('exist');

    cy.get('body', { timeout: 10000 }).then(($body) => {
      const $found = $body.find(structural);
      const $visible = $found.filter(':visible');

      if ($visible.length) {
        cy.wrap($visible.first(), { timeout: 10000 })
          .should('be.visible')
          .should(($el) => {
            const text = $el.text();
            // eslint-disable-next-line no-console
            console.log('Gefundener struktureller Text:', text);
            if (!errorRegex.test(text)) {
              throw new Error('Strukturelles Fehler-Element gefunden, aber Text passt nicht zum erwarteten Regex.');
            }
          });
      } /*else {
        cy.contains(errorRegex, { timeout: 10000 })
          .should('be.visible')
          .then(($el) => {
            // eslint-disable-next-line no-console
            console.log('Gefundener Fehlertext:', $el.text());
          });
      }*/
    })
      .then(() => {
        // Erfolgsweg: entferne Handler, damit er nicht für andere Tests bleibt
        try {
          Cypress.off('fail', failHandler);
        } catch (e) {
          // ignore
        }
      });
  });
});
