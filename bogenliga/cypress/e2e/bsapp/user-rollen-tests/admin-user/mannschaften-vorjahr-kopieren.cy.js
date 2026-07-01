/**
 * BSAPP-2158 — "Mannschaften aus Vorjahr kopieren": verständliche Fehlermeldung
 *
 * Vorher: Schlug der eigentliche Kopier-Aufruf fehl, gab es KEINE lokale Meldung (nur console.log)
 * -> der globale Error-Interceptor zeigte die generische, unverständliche Meldung
 * "Ihre Anfrage wurde vom Server abgewiesen".
 *
 * Fix: (1) Der Interceptor umgeht das globale Handling für die Copy-Endpoints
 * (findLastVeranstaltungBy / byLastVeranstaltungsID). (2) Die Komponente zeigt bei Copy-Fehler eine
 * eigene, verständliche Meldung ("Die Mannschaften konnten nicht aus dem Vorjahr kopiert werden ...").
 *
 * Der Fehlerfall wird per cy.intercept deterministisch erzeugt (Vorjahr existiert -> findLast 200,
 * Copy-Aufruf -> HTTP 400), ohne echte Daten zu verändern.
 * Testdaten: Veranstaltung 3 (geplant, groesse 8, keine Mannschaften -> Copy-Button aktiv).
 */

const VERANSTALTUNG_ID = 3;
const COPY_BUTTON_TEXT = 'Mannschaften aus Vorjahr';
const GENERIC_MSG = 'vom Server abgewiesen';
const CLEAR_MSG = 'konnten nicht'; // aus COPYMANNSCHAFT_FAILURE_GENERAL

function stubPreviousYearExistsButCopyFails() {
  // Vorjahr existiert (groesse <= aktuelle 8 -> kein Sizediff, es wird kopiert)
  cy.intercept('GET', '**/v1/veranstaltung/findLastVeranstaltungBy/*', {
    statusCode: 200,
    body: {id: 999, wettkampfTypId: 0, name: 'Vorjahr Test', sportjahr: 2017, ligaleiterId: 1, ligaId: 9, version: 0, groesse: 1, phase: 'Geplant'}
  }).as('findLast');
  // Der eigentliche Kopier-Aufruf schlaegt fehl (400 = "vom Server abgewiesen" im Altverhalten)
  cy.intercept('GET', '**/v1/dsbmannschaft/byLastVeranstaltungsID/*/*', {
    statusCode: 400,
    body: {errorCode: 'INVALID_ARGUMENT_ERROR', errorMessage: 'x', param: null}
  }).as('copy');
}

function openVeranstaltungAndClickCopy() {
  cy.visit(`http://localhost:4200/#/verwaltung/veranstaltung/${VERANSTALTUNG_ID}`);
  cy.contains('bla-actionbutton', COPY_BUTTON_TEXT, {timeout: 20000})
    .find('button')
    .click({force: true});
  cy.wait('@findLast');
  cy.wait('@copy');
}

describe('BSAPP-2158: Mannschaften aus Vorjahr kopieren zeigt verständliche Meldung', () => {

  beforeEach(() => {
    cy.loginAdmin();
    cy.url({timeout: 20000}).should('include', '/home');
    cy.wait(1000);
  });

  afterEach(() => {
    // Offene Notification schließen, damit ihr Overlay nicht den Login des nächsten Tests verdeckt.
    cy.get('body').then(($b) => {
      if ($b.find('#OKBtn1').length) {
        cy.get('#OKBtn1 button', {timeout: 5000}).click({force: true});
      }
    });
  });

  it('positiv: bei fehlgeschlagenem Kopieren erscheint eine verständliche Meldung', () => {
    stubPreviousYearExistsButCopyFails();
    openVeranstaltungAndClickCopy();

    cy.get('bla-notification', {timeout: 20000}).contains(CLEAR_MSG).should('be.visible');
  });

  it('negativ: die generische "vom Server abgewiesen"-Meldung erscheint NICHT', () => {
    stubPreviousYearExistsButCopyFails();
    openVeranstaltungAndClickCopy();
    cy.wait(1500);

    cy.get('bla-notification').contains(GENERIC_MSG).should('not.exist');
  });
});
