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
  cy.wait(4000);

  // Jahr auswaehlen
  cy.get('[data-cy=jahr-dropdown]').should('be.visible')
  cy.get('[data-cy=jahr-dropdown]').should('not.be.disabled')
  cy.get('[data-cy=jahr-dropdown]').select(0);
  cy.wait(1000);


  // Wettkampftag auswaehlen
  cy.get('[data-cy=wettkampftage-dropdown]').should('be.visible')
  cy.get('[data-cy=wettkampftage-dropdown]').should('not.be.disabled')
  cy.get('[data-cy=wettkampftage-dropdown]').select(0);
  cy.wait(1000);
});

it('Anzeige Wettkampfergebnisse Liste', function () {

  cy.get('[data-cy=tableStatistik]').should('be.visible')
})

/**
 * Thi test checks if clicking on a team link in the results table navigates to the correct team page
 */
it('Finde Link zur Mannschaft und betätige ihn', () => {
  cy.get('[data-cy=tableStatistik]')
    .find('bla-actionbutton')
    .first()
    .should('exist')
    .then(($comp) => {
      const innerButton = $comp.find('button').first();
      if (innerButton.length) {
        cy.wrap(innerButton).should('be.visible').click();
      } else {
        cy.wrap($comp).should('be.visible').click();
      }
    });

  // Prüfe ob die URL den erwarteten Pfad enthält
  cy.url({ timeout: 4000 }).should('include', '#/vereine/');

});
