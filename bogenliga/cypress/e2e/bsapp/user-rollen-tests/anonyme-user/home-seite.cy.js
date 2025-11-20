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

it('leitet bei Klick auf jede Veranstaltung zur korrekten URL mit liga QueryParam', () => {
  cy.visit('http://localhost:4200/#/home');

  cy.get('#competitionList bla-veranstaltungen-button')
    .should('have.length.at.least', 1)
    .each(($el) => {
      const ligaId = $el.attr('data-liga-id');
      expect(ligaId, 'Liga-ID vorhanden').to.match(/^\d+$/);

      cy.wrap($el).click();

      // Prüfe Hash-URL mit QueryParam
      cy.url().should('include', '#/home');
      cy.url().should('include', `liga=${ligaId}`);

      cy.go('back');
    });
});
