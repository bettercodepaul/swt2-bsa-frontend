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
  cy.wait(6000)
  cy.get('bla-row-layout > .row-layout > .row > .col-sm-8 > #veranstaltungen').select('Württembergliga Recurve')
  cy.wait(1000)
  cy.get('bla-row-layout > .row-layout > .row > .col-sm-8 > #veranstaltungen').select('0: Object')
  cy.wait(500)
  cy.get('bla-row-layout > .row-layout > .row > .col-sm-8 > #wettkampftag').find('option').should('have.length', 4);
})
