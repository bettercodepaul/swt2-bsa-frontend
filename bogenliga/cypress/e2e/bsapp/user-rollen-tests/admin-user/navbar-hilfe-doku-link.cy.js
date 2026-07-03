/**
 * Ticket swt2#2244:
 * Das Fragezeichen-Symbol in der Navbar (Seitenleiste) muss auf die neue
 * BookStack-Doku-Hauptseite (Bücherübersicht) verlinken und diese ZWINGEND in
 * einem neuen Browser-Tab oeffnen, damit der App-Status (z. B. die getroffene
 * Ligaauswahl) nicht verloren geht. Der alte DokuWiki-Link bzw. die interne
 * /hilfe-Seite (iframes auf wiki.bsapp.de) darf nicht mehr angesteuert werden.
 *
 * Der Test manipuliert keine Daten - er prueft nur die Verlinkung des
 * Fragezeichens und dass ein Klick die App nicht verlaesst.
 */
describe('swt2#2244 - Navbar-Hilfe verlinkt auf neue Doku (neuer Tab)', () => {
  const DOKU_URL = 'https://docs.bsapp.de/books';

  before(() => {
    cy.loginAdmin();
    cy.url({ timeout: 20000 }).should('include', '#/home');
  });

  it('Positiv: Fragezeichen ist externer Link auf die neue Doku mit target=_blank', () => {
    cy.get('[data-cy=sidebar-hilfe-button]', { timeout: 20000 })
      .should('have.attr', 'href', DOKU_URL)
      .and('have.attr', 'target', '_blank')
      .and('have.attr', 'rel').and('contain', 'noopener');
  });

  it('Negativ: kein altes DokuWiki, keine interne /hilfe-Navigation, App bleibt erhalten', () => {
    // Negative Assertion 1: href zeigt NICHT mehr auf das alte DokuWiki / keine .php
    cy.get('[data-cy=sidebar-hilfe-button]').then(($a) => {
      const href = $a.attr('href');
      expect(href, 'kein altes DokuWiki / keine .php-Datei')
        .to.not.match(/wiki\.bsapp\.de|doku\.php|\.php(\?|$)/);
      expect($a.attr('target'), 'oeffnet neuen Tab').to.eq('_blank');
    });

    // Negative Assertion 2: Klick oeffnet neuen Tab -> die aktuelle SPA-Seite
    // bleibt /home, es wird NICHT intern nach /hilfe geroutet (App nicht verlassen).
    cy.url().should('include', '#/home');
    cy.get('[data-cy=sidebar-hilfe-button]').click();
    cy.url().should('include', '#/home').and('not.include', '#/hilfe');
  });
});
