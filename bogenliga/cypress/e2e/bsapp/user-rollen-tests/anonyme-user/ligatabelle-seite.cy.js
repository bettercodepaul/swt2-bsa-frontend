/**
 * This test opens the sidebar and clicks on the "LIGATABELLE" tab and checks if the url has changed successfully
 */
it('Anzeige Ligatabelle', function () {
  cy.visit('http://localhost:4200/')
  cy.get('[data-cy=sidebar-ligatabelle-button]').click()
  cy.url().should('include', '#/ligatabelle')
})

/**
 * This test checks if you can filter for a Competition-Day in Ligatablle
 */
it('Wettkampftagauswahl Ligatabelle', function() {
  cy.visit('http://localhost:4200/#/ligatabelle');
  cy.get('.fa-list-ol').click();
  cy.wait(3000);
  cy.get('#availableYears').select('2016');
  cy.get('#wettkampftag').select('1: Object');
  cy.get('#regionSaveButton').click();
});
