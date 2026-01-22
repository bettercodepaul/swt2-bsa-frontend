/**
 * This test opens the sidebar and clicks on the "WETTKAEMPFE" tab and checks if the url has changed successfully
 */
it('Anzeige Wettkampf Ergebnisse', function() {
  cy.visit('http://localhost:4200/#/home?liga=2')
  cy.get('[data-cy=sidebar-wettkampf-button]').click()
  cy.url().should('include', '#/wettkaempfe')
})

/**
 * This test checks if the selection of Sportjahr Liga and Mannschaft works
 */
it('Auswahl Sportjahr und Wettkampftag', function () {
  cy.wait(2000);

  // Jahr auswählen
  cy.get('[data-cy=jahr-dropdown]').should('be.visible')
  cy.get('[data-cy=jahr-dropdown]').should('not.be.disabled')
  cy.get('[data-cy=jahr-dropdown]').select(0);
  cy.wait(1000);


  // Wettkampftag ausw#hlen
  cy.get('[data-cy=wettkampftage-dropdown]').select(0);
  cy.wait(1000);
});



