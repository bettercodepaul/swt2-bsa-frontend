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

/**
 * This test checks if after typing in a search term the list shrinks in size accordingly
 */
it('Vereinsliste Verringert sich', function() {
  cy.visit('http://localhost:4200/#/vereine');
  cy.get('.fa-users > path').click();
  cy.get('.input-group > #undefined').click();
  cy.get('.input-group > #undefined').type('{backspace}');
  cy.get('.input-group > #undefined').type('{backspace}');
  cy.get('.input-group > #undefined').type('SGes G');
})
