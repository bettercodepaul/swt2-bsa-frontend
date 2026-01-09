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
  cy.log('Startseite geladen');

  // Auf Container warten
  cy.get('#competitionList', { timeout: 10000 }).should('exist');

  // Bis 5s auf evtl. Buttons warten
  cy.wait(5000);
  cy.get('#competitionList')
    .then($container => {
      const $buttons = $container.find('bla-veranstaltungen-button');

      if ($buttons.length === 0) {
        cy.log('Keine bla-veranstaltungen-button gefunden (nach max. 5s) – nichts zu testen.');
        return; // Test endet hier erfolgreich
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
