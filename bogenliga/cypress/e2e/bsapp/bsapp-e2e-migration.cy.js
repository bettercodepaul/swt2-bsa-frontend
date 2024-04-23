describe('Verwaltung/Migration tests', function () {
  beforeEach(() => {
    //Log in as Admin before each test
    cy.loginAdmin()
    cy.wait(1000)
  })

  afterEach(() => {
    //NOTE: Preparation for next test

    cy.wait(1000)
    cy.disbandModalIfShown()
    cy.wait(1000)
  })

  /**
   * This test opens the sidebar and clicks on the "VERWALTUNG" tab and checks if the url has changed successfully
   */
  it('Anzeige Verwaltung', () => {
    cy.url().should('include', '#/home')
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/verwaltung')
  })

  /**
   * This test opens the sidebar and clicks on the "VERWALTUNG" tab and checks if the Migration Section (and Button) is present
   */
  it('Anzeige Migration Overview', () => {
    cy.url().should('include', '#/home')
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/verwaltung')
    cy.get('[data-cy=verwaltung-sync-button]').should('be.visible')

  })

  /**
   * This test opens the sidebar and clicks on the "VERWALTUNG" tab and:
   * 1. check if the Migration Section is present
   * 2. clicks on it
   * 3. checks if route has changed
   * 4. if a call was made to Backend
   */
  it('Anzeige Migration Section and FindAll Call', () => {
    cy.url().should('include', '#/home')
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger`,
    }).as('findall-request');
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/verwaltung')
    cy.get('[data-cy=verwaltung-sync-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/verwaltung/migration')

    cy.wait(1000)
    cy.wait('@findall-request')
  })

  /**
   * This test opens the sidebar and clicks on the "VERWALTUNG" tab and:
   * 1. check if the Migration Section is present
   * 2. clicks on it
   * 3. checks if route has changed
   * 4. disband the Error Modal
   * 5. clicks on the "Neue Migration" Button
   * 6. checks if a call was made to Backend
   */

  it('Anzeige Migration Button Click', () => {
    cy.url().should('include', '#/home')
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/verwaltung')
    cy.get('[data-cy=verwaltung-sync-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/verwaltung/migration')
    cy.wait(1000)
    cy.disbandModalIfShown();
    cy.wait(1000)
    cy.get('[data-cy=dsb-mitglied-add-button]').click()

    //Intercept Call to Backend
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/buttonSync`,
    }).as('request');
    cy.wait('@request')
  })
  it('Anzeige Filter Migration Button Click', () => {
    cy.url().should('include', '#/home')
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/verwaltung')
    cy.get('[data-cy=verwaltung-sync-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/verwaltung/migration')
    cy.wait(1000)
    cy.disbandModalIfShown();
    cy.wait(1000)
    cy.get('[data-cy=dsb-mitglied-add-button]').click()
    cy.wait(1000)
    cy.get('[data-cy=filter-migration-button]').click()

    //Intercept Call to Backend
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/buttonSync`,
    }).as('request');
    cy.wait('@request')
  })


  it('Anzeige Next and Previous Page Button Click', () => {
    cy.url().should('include', '#/home')
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/verwaltung')
    cy.get('[data-cy=verwaltung-sync-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/verwaltung/migration')
    cy.wait(1000)
    cy.disbandModalIfShown();
    cy.wait(1000)
    cy.get('[data-cy=filter-migration-button]').click()
    cy.wait(1000)
    cy.get('[data-cy=dsb-mitglied-add-button]').click()
    cy.wait(1000)
    cy.get('[data-cy=next-page-button]').click()

    //Intercept Call to Backend
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/buttonSync`,
    }).as('request');
    cy.wait('@request')
  })
})
