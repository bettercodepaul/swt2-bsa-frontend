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
      url: `http://localhost:9000/v1/trigger/findErrors?offsetMultiplicator=0&queryPageLimit=500`,
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

  /**
   * This test opens the sidebar and clicks on the "VERWALTUNG" tab and:
   * 1. check if the Migration Section is present
   * 2. clicks on it
   * 3. checks if route has changed
   * 4. disband the Error Modal
   * 5. clicks on the "Neue Migration" Button
   * 6. checks if a call was made to Backend
   */
  it('Filtern nach erfolgreichen Einträgen', () => {
    cy.get('[data-cy=status-filter-selection]').select('1: Erfolgreich')
    cy.wait(1000)
    //Intercept Call to Backend
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findSuccessed?offsetMultiplicator=0&queryPageLimit=500`,
    }).as('filter');
    cy.wait('@filter')
  })
  it('Filtern nach laufenden Einträgen', () => {
    cy.get('[data-cy=status-filter-selection]').select('2: Laufend')
    cy.wait(1000)
    //Intercept Call to Backend
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findInProgress?offsetMultiplicator=0&queryPageLimit=500`,
    }).as('filter');
    cy.wait('@filter')
  })
  it('Filtern nach neuen Einträgen', () => {
    cy.get('[data-cy=status-filter-selection]').select('3: Neu')
    cy.wait(1000)
    //Intercept Call to Backend
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findNews?offsetMultiplicator=0&queryPageLimit=500`,
    }).as('filter');
    cy.wait('@filter')
  })
  it('Filtern nach allen Einträgen', () => {
    cy.get('[data-cy=status-filter-selection]').select('4: Alle')
    cy.wait(1000)
    //Intercept Call to Backend
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findAllWithPages?offsetMultiplicator=0&queryPageLimit=500`,
    }).as('filter');
    cy.wait('@filter')
  })
  it('Previous Page Test', () => {
    cy.get('[data-cy=next-page-button]').click()
    cy.wait(1000)
    //Intercept Call to Backend
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findAllWithPages?offsetMultiplicator=1&queryPageLimit=500`,
    }).as('nextPage');
    cy.wait('@nextPage')
  })
  it('Next Page Test', () => {
    cy.get('[data-cy=previous-page-button]').click()
    cy.wait(1000)
    //Intercept Call to Backend
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findAllWithPages?offsetMultiplicator=0&queryPageLimit=500`,
    }).as('previousPage');
    cy.wait('@previousPage')
  })
  it('Next Page Test Above', () => {
    cy.get('[data-cy=next-page-button-above]').click()
    cy.wait(1000)
    //Intercept Call to Backend
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findAllWithPages?offsetMultiplicator=1&queryPageLimit=500`,
    }).as('nextPage');
    cy.wait('@nextPage')
  })
  it('Previous Page Test Above', () => {
    cy.get('[data-cy=previous-page-button-above]').click()
    cy.wait(1000)
    //Intercept Call to Backend
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findAllWithPages?offsetMultiplicator=0&queryPageLimit=500`,
    }).as('previousPage');
    cy.wait('@previousPage')
  })
  it('Filtern nach error Einträgen', () => {
    cy.get('[data-cy=status-filter-selection]').select('0: Fehlgeschlagen')
    cy.wait(1000)
    //Intercept Call to Backend
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findErrors?offsetMultiplicator=0&queryPageLimit=500`,
    }).as('filter');
    cy.wait('@filter')
  })
  it('Anzeige Filter Migration und start der Migration', () => {
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
})
