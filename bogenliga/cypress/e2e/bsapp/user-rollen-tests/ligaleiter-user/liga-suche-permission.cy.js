/**
 * BSAPP-2191 — Ligaübersicht: Suchfeld darf Permissions nicht umgehen
 *
 * In der Ligen-Verwaltung (Verwaltung -> Ligen, /#/verwaltung/liga) sieht ein Ligaleiter
 * normalerweise nur die Ligen, für die er verantwortlich ist (Nicht-Admin-Filter über
 * ligaVerantwortlichMail). Über das Suchfeld wurden jedoch ALLE Ligen angezeigt, weil
 * findBySearch() den Permission-Filter nicht anwendete.
 *
 * Fix: Übersicht UND Suche laufen durch dieselbe Filter-Logik (renderLigenForCurrentUser).
 *
 * Testdaten (LOCAL-DB): Alle Ligen haben liga_verantwortlich = admin@bogenliga.de,
 * d.h. der Test-Ligaleiter (TeamLigaleiter@bogenliga.de) ist für KEINE Liga verantwortlich.
 * Die fremde Liga "Bundesliga" darf für ihn also auch bei Suche nicht erscheinen.
 */

const SEARCH_TERM = 'Bundesliga';
const LIGA_OVERVIEW_URL = 'http://localhost:4200/#/verwaltung/liga';

/**
 * Öffnet die Liga-Übersicht robust: nach dem Login kann der Auth-Guard bei zu frühem
 * Navigieren noch auf /home umleiten (Permission-Load-Timing) -> einmalig erneut aufrufen.
 * Wartet anschließend, bis die initiale Übersicht geladen ist.
 */
function openLigaOverview() {
  cy.visit(LIGA_OVERVIEW_URL);
  cy.wait(1000);
  cy.location('hash').then((hash) => {
    if (hash.indexOf('/verwaltung/liga') === -1) {
      cy.visit(LIGA_OVERVIEW_URL);
      cy.wait(1000);
    }
  });
  cy.get('bla-overview-dialog', {timeout: 20000}).should('exist').and('not.contain', 'werden geladen');
}

describe('BSAPP-2191: Liga-Suche umgeht Permissions nicht', () => {

  it('Kontrolle (positiv): Admin sieht bei Suche die Liga "Bundesliga"', () => {
    // Admin-Login (Shortcut). Kein Cookie-/Storage-Reset -> das würde den Admin-Shortcut-Login stören.
    cy.loginAdmin();
    cy.url({timeout: 20000}).should('include', '/home');
    cy.wait(1500); // Permissions/JWT laden lassen, bevor auf die guard-geschützte Route navigiert wird
    // Nur den gespeicherten Suchbegriff entfernen, damit die Übersicht sauber lädt (Auth bleibt erhalten).
    cy.window().then((w) => w.localStorage.removeItem('searchTermLiga'));

    openLigaOverview();

    cy.get('.quicksearch-input', {timeout: 20000}).type(SEARCH_TERM).should('have.value', SEARCH_TERM);

    // Positiv: Der Admin darf alles sehen -> die fremde Liga taucht in der Ergebnisliste auf.
    // Beweist zugleich, dass der Suchbegriff trifft und der Bypass tatsächlich relevant wäre.
    cy.get('bla-overview-dialog', {timeout: 20000}).contains('td', SEARCH_TERM).should('exist');
  });

  it('negativ: Ligaleiter sieht die fremde Liga auch bei Suche NICHT', () => {
    // Such-Requests mitschneiden, um zu belegen, dass die Suche wirklich ausgeführt wird
    // (sonst könnte der Test trivial gruen sein).
    cy.intercept('GET', '**/v1/liga/search/**').as('ligaSearch');

    // Ligaleiter-Login (robuster Inline-Login), frischer State.
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('http://localhost:4200/#/user/login');
    cy.get('#loginEmail').type('TeamLigaleiter@bogenliga.de');
    cy.get('#loginPassword').type('swt2');
    cy.get('#loginButton').click();
    cy.url({timeout: 20000}).should('include', '/home');
    cy.wait(1500);

    openLigaOverview();

    cy.get('.quicksearch-input', {timeout: 20000}).type(SEARCH_TERM).should('have.value', SEARCH_TERM);

    // Die Suche wurde tatsächlich an das Backend geschickt ...
    cy.wait('@ligaSearch', {timeout: 20000});
    cy.wait(1500); // Rendering der (gefilterten) Ergebnisse abwarten
    cy.get('bla-overview-dialog').should('not.contain', 'werden geladen');

    // Negativ: Trotz passendem Suchbegriff darf die fremde Liga nicht erscheinen.
    cy.get('bla-overview-dialog').contains('td', SEARCH_TERM).should('not.exist');
  });
});
