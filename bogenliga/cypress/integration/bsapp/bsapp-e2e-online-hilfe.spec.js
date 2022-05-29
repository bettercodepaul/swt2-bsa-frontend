/**
 * This Cypress Test is used to test the online help functions including
 * hover effects in "Verwaltung" and the doku wiki page
 * */
describe('Anonym User tests', function () {

  /**
   * This test opens the home page and check whether the tournament table has any content
   */
  it('Home aufrufen', function () {
    cy.visit('http://localhost:4200/')
    cy.url().should('include', '#/home')
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
    cy.wait(1000) /* wait a second that the iframe has enough time to load successfully */
    cy  /*check if the iframe invokes the correct URL */
      .get('iframe')
      .invoke('attr', 'src')
      .should('eq', 'https://wiki.bsapp.de/doku.php?id=liga:ligasoftware')
  })

  /**
   * This Test selects the "Arbeitsablauf als Ligaleiter" section and checks if
   * the iframe is shown/displays the right content
   * */
  it('Ligaleiter auswählen', function () {
    cy.get('[data-cy=test-ligaleiter]').click()
    cy.wait(1000)
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
    cy.wait(1000)
    cy  /*check if the iframe invokes the correct URL */
      .get('iframe')
      .invoke('attr', 'src')
      .should('eq', 'https://wiki.bsapp.de/doku.php?id=liga:wettkampfdurchfuehrung')
  })
})

describe('Admin User tests', function () {

  /**
   * This test tries to log in as an administrator and checks if the website has redirected successfully after logging in
   */
  it('Login erfolgreich', function() {
    cy.visit('http://localhost:4200/#/home')
    cy.get('[data-cy=login-button]').click()
    cy.url().should('include', '#/user/login')
    cy.get('[data-cy=login-als-admin-button]').click()
    cy.url().should('include', '#/home')
  })

  /**
   * This test opens the sidebar and clicks on the "HILFE" tab and checks if
   * the url has changed successfully
   */
  it('Verwaltung aufrufen', function () {
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.url().should('include', '#/verwaltung')
  })

  /**
   * This test tries to hoover over the "VERWALTUNG" elements
   * important: only hoover not clicking!
   * */
  it('Tooltips prüfen (Hoover effekt)', function () {
    /* Hoover DSB Mitglieder */
    cy.get('[data-cy=verwaltung-dsb-mitglieder-button]').trigger('mouseenter')
    cy.get('[data-cy=verwaltung-dsb-mitglieder-button]').trigger('mouseleave')
    /* Hoover Benutzer */
    cy.get('[data-cy=verwaltung-user-button]').trigger('mouseenter')
    cy.get('[data-cy=verwaltung-user-button]').trigger('mouseleave')
    /* Hoover Klassen */
    cy.get('[data-cy=verwaltung-klassen-button]').trigger('mouseenter')
    cy.get('[data-cy=verwaltung-klassen-button]').trigger('mouseleave')
    /* Hoover Vereine */
    cy.get('[data-cy=verwaltung-vereine-button]').trigger('mouseenter')
    cy.get('[data-cy=verwaltung-vereine-button]').trigger('mouseleave')
    /* Hoover Legen */
    cy.get('[data-cy=verwaltung-liga-button]').trigger('mouseenter')
    cy.get('[data-cy=verwaltung-liga-button]').trigger('mouseleave')
    /* Hoover Regionen */
    cy.get('[data-cy=verwaltung-regionen-button]').trigger('mouseenter')
    cy.get('[data-cy=verwaltung-regionen-button]').trigger('mouseleave')
    /* Hoover Veranstaltungen */
    cy.get('[data-cy=verwaltung-veranstaltung-button]').trigger('mouseenter')
    cy.get('[data-cy=verwaltung-veranstaltung-button]').trigger('mouseleave')
    /* Hoover Einstellungen */
    cy.get('[data-cy=verwaltung-einstellungen-button]').trigger('mouseenter')
    cy.get('[data-cy=verwaltung-einstellungen-button]').trigger('mouseleave')
  })

})
