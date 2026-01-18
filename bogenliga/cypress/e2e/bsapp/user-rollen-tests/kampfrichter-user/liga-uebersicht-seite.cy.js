/**
 * This test opens the sidebar and clicks on the "LIGAUEBERSICHT" tab and checks if the url has changed successfully
 */
it('Anzeige Ligaübersicht', function() {
  cy.visit('http://localhost:4200/')
  cy.get('[data-cy=sidebar-ligauebersicht-button]').click()
  cy.url().should('include', '#/liga')
})
