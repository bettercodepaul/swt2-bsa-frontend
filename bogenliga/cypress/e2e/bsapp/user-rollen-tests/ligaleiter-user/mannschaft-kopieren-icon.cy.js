/**
 * BSAPP-2155 — Mannschaft duplizieren: passendes Copy-Icon und Hover-Label "Kopieren"
 *
 * Auf der Verein-Detailseite (Verwaltung -> Vereine -> Editieren -> Details zum Verein)
 * kopiert die Zeilen-Aktion in der Mannschaftsübersicht die Mannschaft. Sie wurde jedoch
 * mit dem "+"-Icon (plus) und dem Hover-Label "Hinzufügen" (TABLE.ACTIONS.ADD) dargestellt.
 *
 * Fix: eigener TableActionType.COPY mit Copy-Icon und Label "Kopieren" (TABLE.ACTIONS.COPY).
 *
 * Die Aktion ist nur mit CAN_MODIFY_MY_VEREIN / CAN_MODIFY_STAMMDATEN_LIGALEITER sichtbar,
 * daher wird als Ligaleiter eingeloggt (Rolle LIGALEITER besitzt beide Rechte).
 * Das data-cy der Zeilen-Aktion entspricht dem Localization-Key des Titels
 * (determineTitle -> data-cy), das Icon rendert FontAwesome als <svg data-icon="...">.
 *
 * Testdaten (LOCAL-DB): Verein 0 ("SGes Gerstetten") mit Mannschaft 101.
 */

const VEREIN_ID = 0;

describe('BSAPP-2155: Mannschaft-Kopieren zeigt Copy-Icon und Label "Kopieren"', () => {

  // Einmaliger Login + Navigation (testIsolation ist projektweit aus -> Seite bleibt bestehen).
  before(() => {
    // Robuster Inline-Login als Ligaleiter (siehe Projekt-Learnings).
    cy.visit('http://localhost:4200/#/user/login');
    cy.get('#loginEmail').type('TeamLigaleiter@bogenliga.de');
    cy.get('#loginPassword').type('swt2');
    cy.get('#loginButton').click();
    cy.url({timeout: 20000}).should('include', '/home');

    cy.visit(`http://localhost:4200/#/verwaltung/vereine/${VEREIN_ID}`);
    // Warten bis die Mannschaftszeile mit der Kopier-Aktion geladen ist.
    cy.get('bla-data-table [data-cy="TABLE.ACTIONS.COPY"]', {timeout: 20000}).should('exist');
  });

  it('positiv: Kopier-Aktion nutzt das Copy-Icon und das Hover-Label "Kopieren"', () => {
    cy.get('bla-data-table [data-cy="TABLE.ACTIONS.COPY"]')
      .should('exist')
      // Hover-Label (title-Attribut) ist die uebersetzte "Kopieren"-Bezeichnung.
      .should('have.attr', 'title', 'Kopieren')
      // FontAwesome rendert das Copy-Icon.
      .find('svg[data-icon="copy"]')
      .should('exist');
  });

  it('negativ: kein "+"-Icon und kein "Hinzufügen"-Label mehr in der Mannschaftszeile', () => {
    // Alte, missverständliche Darstellung darf in der Tabelle nicht mehr existieren.
    cy.get('bla-data-table [data-cy="TABLE.ACTIONS.ADD"]').should('not.exist');
    cy.get('bla-data-table [title="Hinzufügen"]').should('not.exist');
    cy.get('bla-data-table td[id$="Actions"] svg[data-icon="plus"]').should('not.exist');
  });
});
