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
 * swt2#2244: Das Fragezeichen in der Navbar verlinkt nun auf die neue
 * BookStack-Doku "Funktionen der App" und oeffnet sie in einem neuen Tab -
 * es wird NICHT mehr intern auf die veraltete /hilfe-Seite geroutet.
 */
it('Hilfe-Fragezeichen verlinkt auf die neue Doku (neuer Tab)', function () {
  cy.get('[data-cy=sidebar-hilfe-button]')
    .should('have.attr', 'href', 'https://docs.bsapp.de/books/funktionen-der-app')
    .and('have.attr', 'target', '_blank')
})
/*
    * Die interne /hilfe-Seite existiert weiterhin (Legacy, ausserhalb von
    * swt2#2244) und wird hier direkt aufgerufen, da die Navbar nicht mehr
    * dorthin fuehrt. Dieser Test prueft die Startseiten-Sektion.
    * **/
it('Startseite auswählen', function () {
  cy.visit('http://localhost:4200/#/hilfe')
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
