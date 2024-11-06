/**
 * This test opens the sidebar and clicks on the "VEREINE" tab and checks if the url has changed successfully
 */
it('Anzeige Vereine', function() {
  cy.visit('http://localhost:4200/')
  cy.wait(1000)
  cy.get('[data-cy=sidebar-vereine-button]').click({force:true})
  cy.wait(1000)
  cy.url().should('include', '#/vereine')
})
