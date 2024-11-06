/*Test hilfeicon */
it('test hilfeicon', function() {
  cy.visit('http://localhost:4200/')
  cy.get('[data-cy=login-button]').click()
  cy.url().should('include', '#/user/login')
  cy.get('[data-cy=sidebar-regionen-button]').click();
  cy.get('bla-hilfe-button a')
    .should('have.attr', 'href', 'https://wiki.bsapp.de/doku.php?id=liga:regionen')
    .should('have.attr', 'target', '_blank');
})

/**
 * This test opens the sidebar and clicks on the "HILFE" tab and checks if
 * the url has changed successfully
 */

it('Hilfeseite aufrufen', function () {
  cy.get('[data-cy=sidebar-hilfe-button]').click()
  cy.url().should('include', '#/hilfe')
})

