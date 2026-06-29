/**
 * Ticket swt2#2172:
 * Wenn das Loeschen eines Vereins fehlschlaegt (z.B. 403 NO_PERMISSION_ERROR),
 * darf die App KEINE Erfolgsmeldung zeigen und NICHT zur Vereinsuebersicht
 * zurueck navigieren - der Verein ist ja noch da.
 *
 * Das DELETE wird per cy.intercept als 403 gestubt -> es wird KEIN echter
 * Verein geloescht (sicher, keine Datenmanipulation).
 *
 * Vorher (Bug): handleHttpError verschluckte den Fehler -> deleteById resolved
 * -> handleDeleteSuccess (Erfolg + Navigation). Nach dem Fix rejectet das
 * Promise korrekt -> handleDeleteFailure, kein Erfolg, keine Navigation.
 */
const VEREIN_ID = 0;

describe('Admin - Verein loeschen: Fehler (403) zeigt keinen falschen Erfolg', () => {
  before(() => {
    cy.loginAdmin();
    // Auf erfolgreichen Login (Redirect zu /home) warten, bevor die
    // Detailseite besucht wird, sonst greift der Auth-Guard.
    cy.url({ timeout: 20000 }).should('include', '/home');
  });

  it('bleibt auf der Detailseite und zeigt keine Erfolgsmeldung bei 403', () => {
    // DELETE serverseitig als 403 stubben -> nichts wird wirklich geloescht.
    cy.intercept('DELETE', '**/v1/vereine/*', {
      statusCode: 403,
      body: {
        errorCode: 'NO_PERMISSION_ERROR',
        param: ['CAN_DELETE_STAMMDATEN'],
        errorMessage: "NO_PERMISSION_ERROR: User has not all required permissions [CAN_DELETE_STAMMDATEN]"
      }
    }).as('deleteVerein');

    // Vereins-Detailseite oeffnen (Admin sieht den Loeschen-Button).
    cy.visit(`http://localhost:4200/#/verwaltung/vereine/${VEREIN_ID}`);
    cy.get('[data-cy=verein-detail-delete-button] button', { timeout: 20000 })
      .should('be.visible')
      .click();

    // Bestaetigungsdialog (YES_NO) -> "Ja"
    cy.get('button.action-btn-primary:contains("Ja")', { timeout: 10000 }).click();

    // Das (gestubte) DELETE wurde gesendet und mit 403 beantwortet.
    cy.wait('@deleteVerein').its('response.statusCode').should('eq', 403);

    // Erwartung (Fix): Es erscheint die FEHLER-Meldung des Loeschens,
    // NICHT die Erfolgsmeldung. Vor dem Fix lief der Success-Handler ->
    // "Verein wurde erfolgreich gelöscht." (obwohl 403 + Verein noch da).
    cy.contains('Verein konnte nicht gelöscht werden.', { timeout: 10000 }).should('be.visible');
    cy.contains('Verein wurde erfolgreich gelöscht.').should('not.exist');
  });
});
