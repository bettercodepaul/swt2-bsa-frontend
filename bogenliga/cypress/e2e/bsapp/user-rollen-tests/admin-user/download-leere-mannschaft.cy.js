/**
 * BSAPP-2179 — Klare Fehlermeldung beim Download von Rückennummern/Lizenzen einer leeren Mannschaft
 *
 * Vorher: Download für eine Mannschaft ohne Mitglieder erzeugte im Backend einen unverständlichen
 * Fehler (Rückennummern: IndexOutOfBounds -> 500; Lizenzen: leeres/kaputtes PDF). Es war keine
 * verständliche Meldung definiert.
 *
 * Fix: Vor dem Download wird geprüft, ob die Mannschaft Mitglieder hat. Ist sie leer, erscheint
 * eine klare Meldung ("Die Mannschaft enthält keine Mitglieder ...") und der Download wird NICHT
 * ausgeführt.
 *
 * Da lokal keine leere Mannschaft existiert, wird die Mitglieder-Antwort per cy.intercept gestubbt
 * (sicher, ohne echte Daten zu ändern). Testdaten: Verein 0, Mannschaft 101.
 */

const VEREIN_ID = 0;
const MANNSCHAFT_ID = 101;
const EMPTY_HINT = 'keine Mitglieder';

function openVereinDetail() {
  cy.visit(`http://localhost:4200/#/verwaltung/vereine/${VEREIN_ID}`);
  cy.get(`#payload-id-${MANNSCHAFT_ID}`, {timeout: 20000}).should('exist');
}

describe('BSAPP-2179: Download leerer Mannschaft zeigt klare Meldung', () => {

  beforeEach(() => {
    cy.loginAdmin();
    cy.url({timeout: 20000}).should('include', '/home');
    cy.wait(1000);
  });

  afterEach(() => {
    // Offene Notification schließen, damit ihr Overlay nicht den Login des nächsten Tests verdeckt
    // (testIsolation ist aus, Hash-Navigation lädt die App nicht neu).
    cy.get('body').then(($b) => {
      if ($b.find('#OKBtn1').length) {
        cy.get('#OKBtn1 button', {timeout: 5000}).click({force: true});
      }
    });
  });

  it('positiv: Rückennummern-Download einer leeren Mannschaft zeigt die klare Meldung', () => {
    cy.intercept('GET', `**/v1/mannschaftsmitglied/${MANNSCHAFT_ID}`, {statusCode: 200, body: []}).as('members');

    openVereinDetail();
    cy.get(`#payload-id-${MANNSCHAFT_ID} [data-cy="TABLE.ACTIONS.DOWNLOADRUECKENNUMMER"]`).first().click();

    cy.wait('@members');
    cy.get('bla-notification', {timeout: 20000}).contains(EMPTY_HINT).should('be.visible');
  });

  it('positiv: Lizenzen-Download einer leeren Mannschaft zeigt die klare Meldung', () => {
    cy.intercept('GET', `**/v1/mannschaftsmitglied/${MANNSCHAFT_ID}`, {statusCode: 200, body: []}).as('members');

    openVereinDetail();
    cy.get(`#payload-id-${MANNSCHAFT_ID} [data-cy="TABLE.ACTIONS.DOWNLOADLIZENZEN"]`).first().click();

    cy.wait('@members');
    cy.get('bla-notification', {timeout: 20000}).contains(EMPTY_HINT).should('be.visible');
  });

  it('negativ: bei einer Mannschaft mit Mitgliedern erscheint die Leer-Meldung NICHT', () => {
    // Mannschaft hat Mitglieder -> Download läuft normal weiter (Download-Endpoint gestubbt).
    cy.intercept('GET', `**/v1/mannschaftsmitglied/${MANNSCHAFT_ID}`, {
      statusCode: 200,
      body: [{id: 1, mannschaftId: MANNSCHAFT_ID, dsbMitgliedId: 1, rueckennummer: 1, version: 0}]
    }).as('members');
    cy.intercept('GET', '**/v1/download/pdf/rueckennummern*', {statusCode: 200, body: 'PDF'}).as('dl');

    openVereinDetail();
    cy.get(`#payload-id-${MANNSCHAFT_ID} [data-cy="TABLE.ACTIONS.DOWNLOADRUECKENNUMMER"]`).first().click();

    cy.wait('@members');
    cy.wait(1500);
    cy.get('bla-notification').contains(EMPTY_HINT).should('not.exist');
  });
});
