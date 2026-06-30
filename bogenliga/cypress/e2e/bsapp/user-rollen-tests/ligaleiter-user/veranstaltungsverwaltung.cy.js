/**
 * Ticket swt2#2157:
 * Bei einer LAUFENDEN Veranstaltung duerfen unter "Teilnehmende Mannschaften"
 * keine Mannschaften hinzugefuegt, editiert (Tabellenplatz) oder geloescht werden.
 *
 * Testdaten: Veranstaltung 0 ("Wuerttembergliga") ist im lokalen Seed in Phase
 * "Laufend" (veranstaltung_phase = 2) und hat teilnehmende Mannschaften.
 *
 * Login als Ligaleiter (Rolle aus dem Ticket).
 */
const VERANSTALTUNG_LAUFEND_ID = 0;

describe('Ligaleiter - laufende Veranstaltung sperrt teilnehmende Mannschaften', () => {
  before(() => {
    // Login als Ligaleiter und auf erfolgreiche Weiterleitung zur Home-Seite warten,
    // damit der Token gesetzt ist, bevor die Detailseite besucht wird.
    cy.visit('http://localhost:4200/#/user/login');
    cy.get('#loginEmail').type('HSRT-Test@bogenliga.de');
    cy.get('#loginPassword').type('mki4HSRT');
    cy.get('#loginButton').click();
    cy.url({ timeout: 20000 }).should('include', '/home');
  });

  it('keine Bearbeiten-/Loeschen-Aktionen und Hinzufuegen deaktiviert', () => {
    cy.visit(`http://localhost:4200/#/verwaltung/veranstaltung/${VERANSTALTUNG_LAUFEND_ID}`);

    // Teilnehmende Mannschaften werden geladen (mind. eine Tabellenzeile vorhanden).
    // Zeilen-IDs der bla-data-table folgen dem Muster payload-id-<id>.
    cy.get('tr[id^=payload-id-]', { timeout: 20000 }).should('have.length.at.least', 1);

    // Editieren (Tabellenplatz) und Loeschen sind nicht moeglich:
    // die Aktions-Icons der Tabelle werden bei laufender Veranstaltung ausgeblendet.
    cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').should('not.exist');
    cy.get('[data-cy="TABLE.ACTIONS.DELETE"]').should('not.exist');

    // Hinzufuegen ist gesperrt: der Platzhalter-Button ist deaktiviert.
    cy.get('#platzhalterCreateButton').should('be.disabled');
  });
});
