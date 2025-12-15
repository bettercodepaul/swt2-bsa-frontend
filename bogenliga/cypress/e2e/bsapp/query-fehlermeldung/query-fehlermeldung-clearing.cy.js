// Tests: Query-Fehlermeldungen + Query-Clearing (liga)

describe('Query-Fehlermeldungen + Query-Clearing (liga)', () => {

  /**
   * Hilfsfunktion:
   * Prüft, dass der Query-Parameter "liga" weder im hash noch in search vorhanden ist
   */
  const assertLigaQueryCleared = () => {
    cy.location('hash').should('not.contain', 'liga=');
    cy.location('search').should('not.contain', 'liga=');
  };

  /**
   * Hilfsfunktion:
   * Prüft, dass wir uns auf der Home-Seite befinden
   * (Hash-basiertes Routing: #/home)
   */
  const assertOnHomeRoute = () => {
    cy.location('hash').should('include', '#/home');
  };

  it('clears liga query when it is empty', () => {
    cy.visit('http://localhost:4200/#/home?liga=');

    assertOnHomeRoute();
    assertLigaQueryCleared();
  });

  it('clears liga query when it contains only whitespace', () => {
    cy.visit('http://localhost:4200/#/home?liga=%20%20%20');

    assertOnHomeRoute();
    assertLigaQueryCleared();
  });

  it('shows error dialog and clears query for invalid liga', () => {
    // Robusteres URL-Matching: fängt /v1/liga/123, /v1/liga?id=123, /v1/liga etc.
    cy.intercept(
      { method: 'GET', url: /\/v1\/liga(\/|$|\?)/ },
      {
        statusCode: 404,
        body: {
          errorCode: 'LIGA_NOT_FOUND_ERROR',
          errorMessage: 'No result found for liga',
          param: null
        }
      }
    ).as('getLiga');

    cy.visit('http://localhost:4200/#/home?liga=99999');

    // Warte auf den konkreten Backend-Call (falls die App ihn macht)
    cy.wait('@getLiga');

    assertOnHomeRoute();
    assertLigaQueryCleared();

    // Prüfe Fehlerdialog - falls vorhanden, besser mit data-cy-Attributen
    // Beispiel-Selektoren (falls implementiert): cy.get('[data-cy=error-dialog]').should('be.visible')
    cy.contains('Liga nicht gefunden').should('be.visible');
    cy.contains('Die angeforderte Liga wurde nicht gefunden.').should('be.visible');
    cy.contains('OK').should('be.visible');
  });

});
