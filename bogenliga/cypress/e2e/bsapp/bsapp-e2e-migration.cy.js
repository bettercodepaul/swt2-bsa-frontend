describe('Verwaltung/Migration tests', function () {
  beforeEach(() => {
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
    cy.loginAdmin()
    cy.wait(60000)
    cy.url().should('include', '#/home')
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/verwaltung')
  })

  /**
   * This test opens the sidebar and clicks on the "VERWALTUNG" tab and checks if the Migration Section (and Button) is present
   */
  it('Anzeige Migration Overview', () => {
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
    cy.viewport(1920,1080)
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findErrors?offsetMultiplicator=0&queryPageLimit=500&dateInterval=1%20MONTH`,
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

  it('Filtern nach erfolgreichen Einträgen', () => {
    cy.viewport(1920,1080)
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findSuccessed?offsetMultiplicator=0&queryPageLimit=500&dateInterval=1%20MONTH`,
    }).as('filter');
    cy.get('[data-cy=status-filter-selection]').select('1: Erfolgreich')
    cy.wait(2000)
    cy.wait('@filter')
  })
  it('Filtern nach laufenden Einträgen', () => {
    cy.viewport(1920,1080)
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findInProgress?offsetMultiplicator=0&queryPageLimit=500&dateInterval=1%20MONTH`,
    }).as('filter');
    cy.get('[data-cy=status-filter-selection]').select('2: Laufend')
    cy.wait(1000)
    cy.wait('@filter')
  })
  it('Filtern nach neuen Einträgen', () => {
    cy.viewport(1920,1080)
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findNews?offsetMultiplicator=0&queryPageLimit=500&dateInterval=1%20MONTH`,
    }).as('filter');
    cy.get('[data-cy=status-filter-selection]').select('3: Neu')
    cy.wait(1000)
    cy.wait('@filter')
  })
  it('Filtern nach allen Einträgen', () => {
    cy.viewport(1920,1080)
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findAllWithPages?offsetMultiplicator=0&queryPageLimit=500&dateInterval=1%20MONTH`,
    }).as('filter');
    cy.get('[data-cy=status-filter-selection]').select('4: Alle')
    cy.wait(1000)
    cy.wait('@filter')
  })
  it('Previous Page Test', () => {
    cy.viewport(1920,1080)
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findAllWithPages?offsetMultiplicator=0&queryPageLimit=500&dateInterval=1%20MONTH`,
    }).as('nextPage');
    cy.get('[data-cy=next-page-button]').click()
  })
  it('Next Page Test', () => {
    cy.viewport(1920,1080)
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findAllWithPages?offsetMultiplicator=0&queryPageLimit=500&dateInterval=1%20MONTH`,
    }).as('previousPage');
    cy.get('[data-cy=previous-page-button]').click()
  })
  it('Next Page Test Above', () => {
    cy.viewport(1920,1080)
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findAllWithPages?offsetMultiplicator=0&queryPageLimit=500&dateInterval=1%20MONTH`,
    }).as('nextPage');
    cy.get('[data-cy=next-page-button-above]').click()
  })
  it('Previous Page Test Above', () => {
    cy.viewport(1920,1080)
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findAllWithPages?offsetMultiplicator=0&queryPageLimit=500&dateInterval=1%20MONTH`,
    }).as('previousPage');
    cy.get('[data-cy=previous-page-button-above]').click()
  })
  it('Filtern nach error Einträgen', () => {
    cy.viewport(1920,1080)
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findErrors?offsetMultiplicator=0&queryPageLimit=500&dateInterval=1%20MONTH`,
    }).as('filter');
    cy.get('[data-cy=status-filter-selection]').select('0: Fehlgeschlagen')
    cy.wait(1000)
    cy.wait('@filter')
  })
  it('Filtern nach Zeitstempel Letzter Monat', () => {
    cy.viewport(1920,1080)
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findErrors?offsetMultiplicator=0&queryPageLimit=500&dateInterval=1%20MONTH`,
    }).as('filter');
    cy.get('[data-cy=timestamp-filter-selection]').select('0: letzter Monat')
    cy.wait(1000)
    cy.wait('@filter')
  })
  it('Filtern nach Zeitstempel letzten drei Monate', () => {
    cy.viewport(1920,1080)
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findErrors?offsetMultiplicator=0&queryPageLimit=500&dateInterval=3%20MONTH`,
    }).as('filter');
    cy.get('[data-cy=timestamp-filter-selection]').select('1: letzten drei Monate')
    cy.wait(1000)
    cy.wait('@filter')
  })
  it('Filtern nach Zeitstempel letzten sechs Monate', () => {
    cy.viewport(1920,1080)
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findErrors?offsetMultiplicator=0&queryPageLimit=500&dateInterval=6%20MONTH`,
    }).as('filter');
    cy.get('[data-cy=timestamp-filter-selection]').select('2: letzten sechs Monate')
    cy.wait(1000)
    cy.wait('@filter')
  })
  it('Filtern nach Zeitstempel im letzten Jahr', () => {
    cy.viewport(1920,1080)
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findErrors?offsetMultiplicator=0&queryPageLimit=500&dateInterval=12%20MONTH`,
    }).as('filter');
    cy.get('[data-cy=timestamp-filter-selection]').select('3: im letzten Jahr')
    cy.wait(1000)
    cy.wait('@filter')
  })
  it('Filtern nach Zeitstempel alle', () => {
    cy.viewport(1920,1080)
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findErrors?offsetMultiplicator=0&queryPageLimit=500&dateInterval=20%20YEAR`,
    }).as('filter');
    cy.get('[data-cy=timestamp-filter-selection]').select('4: alle')
    cy.wait(1000)
    cy.wait('@filter')
  })
})
