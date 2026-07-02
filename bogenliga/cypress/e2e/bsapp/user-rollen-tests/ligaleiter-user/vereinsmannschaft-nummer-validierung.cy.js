/**
 * Ticket swt2#2174:
 * Beim Anlegen einer Vereinsmannschaft fuehrte eine nicht-numerische
 * Mannschaftsnummer (z.B. "ab") zu einer generischen "Vom Server abgewiesen"-
 * Fehlermeldung, weil das Feld nur 'required', aber nicht numerisch validiert war.
 *
 * Nach dem Fix (pattern="[0-9]+") wird eine ungueltige Eingabe bereits im
 * Frontend abgefangen: Das Feld wird als ungueltig markiert und der
 * Speichern-Button bleibt gesperrt -> kein Server-Call, keine kryptische Meldung.
 *
 * Login als Ligaleiter (Rolle aus dem Ticket).
 */
describe('Ligaleiter - Vereinsmannschaft anlegen: Mannschaftsnummer-Validierung', () => {

  before(() => {
    cy.visit('http://localhost:4200/#/user/login');
    cy.get('#loginEmail').type('HSRT-Test@bogenliga.de');
    cy.get('#loginPassword').type('mki4HSRT');
    cy.get('#loginButton').click();
    cy.url({ timeout: 20000 }).should('include', '/home');
  });

  it('lehnt eine nicht-numerische Mannschaftsnummer ab (Feld ungueltig, Speichern gesperrt)', () => {
    // Anlege-Formular einer Vereinsmannschaft (lokale Testdaten: Verein 11).
    cy.visit('http://localhost:4200/#/verwaltung/vereine/11/add');

    // nicht-numerische Eingabe
    cy.get('[data-cy=vereine-mannschaft-detail-mannschaftsnummer]', { timeout: 20000 }).type('ab');

    // Feld wird als ungueltig markiert ...
    cy.get('[data-cy=vereine-mannschaft-detail-mannschaftsnummer]').should('have.class', 'is-invalid');
    // ... und der Speichern-Button bleibt gesperrt (kein Server-Call, keine generische Fehlermeldung).
    cy.get('[data-cy=vereine-mannschaft-detail-save-button] button').should('be.disabled');
  });
});
