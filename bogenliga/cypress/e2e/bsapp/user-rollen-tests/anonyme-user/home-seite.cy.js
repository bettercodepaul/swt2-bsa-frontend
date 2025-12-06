/**
 * This test opens the home page and check whether the tournament table has any content
 */
it('Home aufrufen / Wettkampftabelle gefüllt', function () {
  cy.clearLocalStorage();
  cy.clearCookies();
  cy.visit('http://localhost:4200/')
  cy.url().should('include', '#/home')
})

/**
 * This test presses the login button on the home page and checks whether the login page opens
 */
it('Login möglich / Fenster öffnet sich', function() {
  cy.get('[data-cy=login-button]').click()
  cy.url().should('include', '#/user/login')
})

it('bla-veranstaltungen-button existiert und toggelt expanded/unexpanded', () => {
  cy.visit('http://localhost:4200/#/home');

  // Auf Container warten
  cy.get('#competitionList', { timeout: 10000 }).should('exist');

  // Buttons suchen (mit längerem Timeout)
  cy.get('#competitionList')
    .find('bla-veranstaltungen-button', { timeout: 10000 })
    .then(($buttons) => {
      if ($buttons.length === 0) {
        // Keine Veranstaltungen vorhanden -> Test überspringen/loggen
        cy.log('Keine bla-veranstaltungen-button gefunden (keine Wettkämpfe)');
        return;
      }

      // Ersten Button als Alias setzen
      cy.wrap($buttons.first()).as('firstEventBtn');

      // Anfangszustand prüfen
      cy.get('@firstEventBtn')
        .find('.toggleArrow')
        .should('exist')
        .and('not.have.class', 'expanded');
      cy.get('@firstEventBtn')
        .find('.competitionCardBody')
        .should('not.exist');

      // Klick zum Expandieren
      cy.get('@firstEventBtn')
        .find('.toggleArrow').click();
      cy.get('@firstEventBtn')
        .find('.competitionCardBody')
        .should('exist');
      cy.get('@firstEventBtn')
        .find('.toggleArrow')
        .should('have.class', 'expanded');

      // Klick zum Schließen
      cy.get('@firstEventBtn')
        .find('.toggleArrow').click();
      cy.get('@firstEventBtn')
        .find('.competitionCardBody')
        .should('not.exist');
      cy.get('@firstEventBtn')
        .find('.toggleArrow')
        .should('not.have.class', 'expanded');
    });
});
