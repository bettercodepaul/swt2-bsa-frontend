/**
 * This test opens the sidebar and clicks on the "REGIONEN" tab and checks if the url has changed successfully
 */
it('Anzeige Regionen', function() {
  cy.visit('http://localhost:4200/')
  cy.get('[data-cy=sidebar-regionen-button]').click()
  cy.url().should('include', '#/regionen')
})

/**
 * This test clicks on a single sunburst arc item and checks if details have loaded for the selected item
 */
it('Sunburst details anzeigen', function () {
  cy.get('[data-cy=sidebar-regionen-button]').click();
  cy.wait(1500)
  cy.get(':nth-child(2) > .main-arc').click({force:true})
  cy.wait(1500)
  cy.get('#details')
  cy.get('[data-cy=sidebar-regionen-button]').click()
  cy.wait(1500)
})

/**
 * This test checks if after an item has been selected the website redirected to the correct location
 */
it('Weiterleitung Ligatabelle', function () {
  cy.wait(6000)
  cy.get('#ligen > bla-selectionlist > #undefined').select(0)
  cy.wait(1000)
  cy.url().should('include', '#/ligatabelle')
})

/**
 * This test opens the sidebar, selects the "REGIONEN" section, selects an item from the list and checks if the website
 * redirected to the correct item's overview page.
 * schon in neuer Struktur
 */
it('Weiterleitung Vereinseite', function () {
  cy.get('[data-cy=sidebar-regionen-button]').click()
  cy.wait(3000)
  cy.get(':nth-child(11) > .main-arc').click({force:true})
  cy.wait(2000)
  cy.get('#vereine > bla-selectionlist > #undefined').select(0)
  cy.wait(1000)
  cy.url().should('include', '#/vereine')
})
