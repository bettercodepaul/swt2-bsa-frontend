/**
 * Ticket swt2#2171:
 * In der Wettkampfdurchfuehrung war der Button im Bereich "Teilnehmende Mannschaften"
 * faelschlich mit "Mannschaft anlegen" beschriftet, oeffnet aber ueber addDSBMitglied()
 * den DSB-Mitglied-Dialog. Das Label muss "DSB-Mitglied anlegen" lauten.
 *
 * Login als Ausrichter (Rolle aus dem Ticket).
 * Hinweis: Der Button wird unabhaengig von vorhandenen Eintraegen gerendert,
 * der Test ist also nicht von Testdaten abhaengig.
 */
describe('Ausrichter - Wettkampfdurchfuehrung: korrektes Button-Label', () => {

  it('Button heisst "DSB-Mitglied anlegen" und nicht "Mannschaft anlegen"', () => {
    cy.loginAusrichter();

    // Direkt zur Wettkampfdurchfuehrung-Detailseite (lokale Testdaten: Veranstaltung 0, Wettkampf 30).
    cy.visit('http://localhost:4200/#/wkdurchfuehrung/0/30');

    // korrektes Label vorhanden ...
    cy.contains('button', 'DSB-Mitglied anlegen', { timeout: 20000 }).should('be.visible');
    // ... und das falsche Label existiert nicht mehr.
    cy.contains('button', 'Mannschaft anlegen').should('not.exist');
  });
});
