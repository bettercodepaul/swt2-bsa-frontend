beforeEach(() => {
  cy.wait(1000)
  cy.loginAdmin()
  cy.wait(2000)

})

afterEach(() => {
  //NOTE: Preparation for next test
  cy.wait(1000)
  cy.disbandModalIfShown()
  cy.wait(1000)
})

describe('Anzeige', function () {
  /**
   * This test opens the sidebar and clicks on the "VERWALTUNG" tab and checks if the url has changed successfully
   */
  /*
  it('Anzeige Verwaltung', () => {
    cy.loginAdmin()
    cy.wait(2000)
    cy.url().should('include', '#/home')
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/verwaltung')
  })*/

  /**
   * This test opens the sidebar and clicks on the "VERWALTUNG" tab and checks if the Migration Section (and Button) is present
   */
  /*
  it('Anzeige Migration Overview', () => {
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/verwaltung')
    cy.get('[data-cy=verwaltung-sync-button]').should('be.visible')

  })*/

  /**
   * This test opens the sidebar and clicks on the "VERWALTUNG" tab and:
   * 1. check if the Migration Section is present
   * 2. clicks on it
   * 3. checks if route has changed
   * 4. if a call was made to Backend
   */
  /* This test includes "Anzeige Verwaltung" and "Anzeige Migration Overview" --> only this test ist needed*/
  it('Anzeige Migration Section and FindAll Call', () => {
    cy.viewport(1920, 1080)
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findErrors?offsetMultiplicator=0&queryPageLimit=500&dateInterval=letzter%20Monat`,
    }).as('findallErrors-request');
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/verwaltung')
    cy.get('[data-cy=verwaltung-sync-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/verwaltung/migration')

    cy.wait(1000)
    cy.wait('@findallErrors-request')
  })
})


