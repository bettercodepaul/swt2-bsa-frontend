/**
 * Ticket swt2#2188:
 * Nach einer fehlgeschlagenen Aktion (z. B. ungueltige Mannschaftsnummer ->
 * Backend-Fehler) muss der Speichern-Button den Ladezustand verlassen und
 * wieder nutzbar sein - die Oberflaeche darf nicht dauerhaft blockieren.
 *
 * Das Create wird per cy.intercept als Fehler gestubt -> es wird KEINE echte
 * Mannschaft angelegt (sicher, keine Datenmanipulation).
 */
describe('swt2#2188 - Button verlaesst Ladezustand nach fehlgeschlagenem Speichern', () => {
  before(() => {
    cy.loginAdmin();
    cy.url({ timeout: 20000 }).should('include', '/home');
  });

  it('Mannschaft anlegen: nach 400-Fehler dreht der Speichern-Button nicht mehr', () => {
    // Vereinsverwaltung direkt oeffnen und einen Verein bearbeiten
    cy.visit('http://localhost:4200/#/verwaltung/vereine');
    cy.url().should('include', '#/verwaltung/vereine');
    cy.get('[data-cy="TABLE.ACTIONS.EDIT"]', { timeout: 20000 }).first().click();

    // Add-Mannschaft-Formular oeffnen und eine gueltige Nummer eingeben
    cy.get('[data-cy=vereine-details-add-mannschaft-button]', { timeout: 20000 }).click();
    cy.get('#mannschaftNummer', { timeout: 20000 }).clear().type('7');

    // Create serverseitig als 400-Fehler stubben -> nichts wird wirklich angelegt
    cy.intercept('POST', '**/v1/dsbmannschaft', {
      statusCode: 400,
      body: { errorCode: 'INVALID_ARGUMENT_ERROR', message: 'Mannschaft Nummer ungueltig', param: null }
    }).as('createMannschaft');

    // Speichern ausloesen -> fuehrt zum Fehler
    cy.get('#mannschaftSaveButton').should('not.be.disabled').click();
    cy.wait('@createMannschaft').its('response.statusCode').should('eq', 400);

    // Akzeptanzkriterium: der Speichern-Button dreht nicht mehr (Lade-Spinner weg)
    // -> Ladezustand beendet, Button wieder nutzbar.
    cy.get('[data-cy=vereine-mannschaft-detail-save-button] .fa-spin').should('not.exist');
  });
});
