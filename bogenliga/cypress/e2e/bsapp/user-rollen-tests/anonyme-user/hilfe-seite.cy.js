/*Test hilfeicon */
it('test hilfeicon', function() {
  cy.clearLocalStorage()
  cy.visit('http://localhost:4200/')
  cy.get('[data-cy=login-button]').click()
  cy.url().should('include', '#/user/login')
  cy.get('[data-cy=sidebar-regionen-button]').click();
  cy.get('bla-hilfe-button a')
    .should('have.attr', 'href', 'https://wiki.bsapp.de/doku.php?id=liga:regionen')
    .should('have.attr', 'target', '_blank');
})

/**
 * This test opens the sidebar and clicks on the "HILFE" tab and checks if
 * the url has changed successfully
 */

it('Hilfeseite aufrufen', function () {
  cy.get('[data-cy=sidebar-hilfe-button]').click()
  cy.url().should('include', '#/hilfe')
})
/*
    * This Test selects the "Startseite" in the Section and checks if
    * the iframe is shown/displays the right content
    * **/
it('Startseite auswählen', function () {
  cy.get('[data-cy=test-startseite]').click()
  cy  /*check if the iframe invokes the correct URL */
    .get('iframe')
    .invoke('attr', 'src')
    .should('eq', 'https://wiki.bsapp.de/doku.php?id=liga:startseite')
})

/**
 * This Test selects the "Arbeitsablauf als Ligaleiter" section and checks if
 * the iframe is shown/displays the right content
 * */
it('Ablauf als Ligaleiter auswählen', function () {
  cy.get('[data-cy=test-ligaleiter]').click()
  cy  /*check if the iframe invokes the correct URL */
    .get('iframe')
    .invoke('attr', 'src')
    .should('eq', 'https://wiki.bsapp.de/doku.php?id=liga:arbeitsablauf')
})

/**
 * This Test selects the "Arbeitsablauf als Wettkampfdurchführung" section and checks if
 * the iframe is shown/displays the right content
 * */
it('Wettkampfdurchführung auswählen', function () {
  cy.get('[data-cy=test-wkd]').click()
  cy  /*check if the iframe invokes the correct URL */
    .get('iframe')
    .invoke('attr', 'src')
    .should('eq', 'https://wiki.bsapp.de/doku.php?id=liga:wettkampfdurchfuehrung')
})
