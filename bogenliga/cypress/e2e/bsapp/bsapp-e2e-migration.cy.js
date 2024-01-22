describe('Verwaltung/Migration tests', function () {
  beforeEach(() => {
    cy.loginAdmin()
    cy.wait(1000)
  })

  /**
   * This test opens the sidebar and clicks on the "VERWALTUNG" tab and checks if the url has changed successfully
   */
  it('Anzeige Verwaltung',  () => {
    cy.url().should('include', '#/home')
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/verwaltung')
  })

  /**
   * This test opens the sidebar and clicks on the "VERWALTUNG" tab and checks if the Sync Section Button is present
   */
  it('Anzeige Migration Overview',  () => {
    cy.url().should('include', '#/home')
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/verwaltung')
    cy.get('[data-cy=verwaltung-sync-button]').should('be.visible')

  })

  /**
   * This test opens the sidebar and clicks on the "VERWALTUNG" tab and checks if the Sync Section Button is present, clicks it and checks if route has changed
   */
  it('Anzeige Migration Section',  () => {
    cy.url().should('include', '#/home')
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/verwaltung')
    cy.get('[data-cy=verwaltung-sync-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/verwaltung/migration')
  })

  /**
   * This test opens the sidebar and clicks on the "VERWALTUNG" tab, clicks the Sync Section Button, checks if route has changed, clicks the "New" Button and checks if it has made a request to Endpoint
   */

  it('Anzeige Migration Button Click',  () => {
    cy.url().should('include', '#/home')
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/verwaltung')
    cy.get('[data-cy=verwaltung-sync-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/verwaltung/migration')
    cy.get('[data-cy=dsb-mitglied-add-button]').click()
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/buttonSync`,
    }).as('request');
    cy.wait('@request')
  })
})
