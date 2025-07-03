/**
 * This test opens the sidebar and clicks on the "REGIONEN" tab and checks if the url has changed successfully
 */
it('Anzeige Regionen', function() {
  cy.visit('http://localhost:4200/')
  cy.get('[data-cy=sidebar-regionen-button]').click()
  cy.wait(1000)
  cy.url().should('include', '#/regionen')
})

/**
 * This test clicks on a single sunburst arc item and checks if details have loaded for the selected item
 */
it('Sunburst details anzeigen', function () {
  cy.visit('http://localhost:4200/#/regionen');
  /**
   Seitenaufbaufehler bei Bullseye
   cy.get('.fa-bullseye > path').click();
   cy.get('.slice:nth-child(13) > .main-arc').click();
   cy.get('.slice:nth-child(12) > .main-arc').click();
   cy.get('.slice:nth-child(11) > .main-arc').click();
   cy.get('.slice:nth-child(5) > .main-arc').click();**/
  cy.get('[data-cy=quicksearch-suchfeld]').click();
  cy.get('[data-cy=quicksearch-suchfeld]').type('{backspace}');
  cy.get('[data-cy=quicksearch-suchfeld]').type('Kreis St');

})
