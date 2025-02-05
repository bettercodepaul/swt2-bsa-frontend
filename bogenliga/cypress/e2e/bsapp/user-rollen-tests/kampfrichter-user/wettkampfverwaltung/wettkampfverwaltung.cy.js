it('Anzeige Wettkampf Ergebnisse', function() {
  cy.visit('http://localhost:4200/')
  cy.get('[data-cy=sidebar-wettkampf-button]').click()
  cy.url().should('include', '#/wettkaempfe')
})

/**
 * This test checks if the selection of Sportjahr Liga and Mannschaft works
 */
it('Auswahl Sportjahr, Liga und Mannschaft', function () {
  cy.visit('http://localhost:4200/#/wettkaempfe/undefined');

cy.get('.fa-calendar > path').click();
cy.get('[data-cy=bla-selection-list]').type('0: 0');
})

/**
 * Bennenungsfehler->
 cy.get('#selectionListRegions > .ng-star-inserted:nth-child(1)').click();
cy.get('#payload-id-30 > #undefinedActions #undefined').click();
cy.get('#downloadSetzliste').click();
cy.get('#downloadSchusszettel').click();
cy.get('#downloadBogenkontrollliste').click();
cy.get('#downloadMeldezettel').click();
cy.url().should('contains', 'http://localhost:4200http://localhost:4200/3f4e8660-94c3-443e-acc9-904e339d688c');
})**/
