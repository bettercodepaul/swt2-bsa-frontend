/**
 * This test navigates to the sidebar, clicks on the "LIGATABELLE" tab, and verifies that the URL updates correctly.
 */
it('Anzeige Ligatabelle', function () {
  cy.visit('http://localhost:4200/')
  cy.get('[data-cy=sidebar-ligatabelle-button]').click()
  cy.url().should('include', '#/ligatabelle')
})

/**
 * This test verifies the functionality of filtering competition days in the "Ligatabelle" section.
 * It ensures that the user can select a competition and choose from the available competition days.
 */
it('Wettkampftagauswahl Ligatabelle', function() {
  cy.wait(6000)
  cy.get('bla-row-layout > .row-layout > .row > .col-sm-8 > #veranstaltungen').select('Württembergliga Recurve')
  cy.wait(1000)
  cy.get('bla-row-layout > .row-layout > .row > .col-sm-8 > #veranstaltungen').select('0: Object')
  cy.wait(500)
  cy.get('bla-row-layout > .row-layout > .row > .col-sm-8 > #wettkampftag').find('option').should('have.length', 4);
})
