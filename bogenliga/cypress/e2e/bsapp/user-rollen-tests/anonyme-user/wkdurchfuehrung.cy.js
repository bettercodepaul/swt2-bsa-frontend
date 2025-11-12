/**
 * Tests if an anonymous user can access the WKDurchfuehrung page.
 */
it('Can visit WKDurchfuehrung', function () {
  cy.visit('http://localhost:4200/#/home')
  cy.get('bla-veranstaltungen-button:nth-child(1) > button:nth-child(1)').click();
  cy.url().should('include', '/#/home');
})
