
  before(() => {
    cy.wait(1000)
    cy.loginAdmin()
    cy.wait(2000)
    cy.url().should('include', '#/home')
    cy.get('[data-cy=sidebar-verwaltung-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/verwaltung')
    cy.get('[data-cy=verwaltung-sync-button]').click()
    cy.wait(1000)
    cy.url().should('include', '#/verwaltung/migration')
    cy.viewport(1920,1080)

  })

  afterEach(() => {
    //NOTE: Preparation for next test
    cy.wait(1000)
    cy.disbandModalIfShown()
    cy.wait(1000)
  })

describe('Filter', function () {

  it('Filtern nach erfolgreichen Einträgen', () => {
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findSuccessed?offsetMultiplicator=0&queryPageLimit=500&dateInterval=letzter%20Monat`,
    }).as('filter');
    cy.get('[data-cy=status-filter-selection]').select('1: Erfolgreich')
    cy.wait(2000)
    cy.wait('@filter')
  })

  it('Filtern nach laufenden Einträgen', () => {
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findInProgress?offsetMultiplicator=0&queryPageLimit=500&dateInterval=letzter%20Monat`,
    }).as('filter');
    cy.get('[data-cy=status-filter-selection]').select('2: Laufend')
    cy.wait(1000)
    cy.wait('@filter')
  })

  it('Filtern nach neuen Einträgen', () => {
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findNews?offsetMultiplicator=0&queryPageLimit=500&dateInterval=letzter%20Monat`,
    }).as('filter');
    cy.get('[data-cy=status-filter-selection]').select('3: Neu')
    cy.wait(1000)
    cy.wait('@filter')
  })

  it('Filtern nach allen Einträgen', () => {
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findAllWithPages?offsetMultiplicator=0&queryPageLimit=500&dateInterval=letzter%20Monat`,
    }).as('filter');
    cy.get('[data-cy=status-filter-selection]').select('4: Alle')
    cy.wait(1000)
    cy.wait('@filter')
  })

  it('Filtern nach error Einträgen', () => {
    /* first you have to select something other than "Fehlgeschlagen" because that is the default and will prevent "filter" from running.*/
    cy.get('[data-cy=status-filter-selection]').select('4: Alle')
    cy.wait(1000)
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findErrors?offsetMultiplicator=0&queryPageLimit=500&dateInterval=letzter%20Monat`,
    }).as('filter');
    cy.get('[data-cy=status-filter-selection]').select('0: Fehlgeschlagen')
    cy.wait(1000)
    cy.wait('@filter')
  })

  it('Filtern nach Zeitstempel letzten drei Monate', () => {
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findErrors?offsetMultiplicator=0&queryPageLimit=500&dateInterval=letzten%20drei%20Monate`,
    }).as('filter');
    cy.get('[data-cy=timestamp-filter-selection]').select('1: letzten drei Monate')
    cy.wait(1000)
    cy.wait('@filter')
  })

  it('Filtern nach Zeitstempel letzter Monat', () => {
    /* first you have to select something other than "letzer Monat" because that is the default and will prevent "filter" from running.*/
    cy.get('[data-cy=timestamp-filter-selection]').select('1: letzten drei Monate')
    cy.wait(1000)

    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findErrors?offsetMultiplicator=0&queryPageLimit=500&dateInterval=letzter%20Monat`,
    }).as('filter');
    cy.get('[data-cy=timestamp-filter-selection]').select('0: letzter Monat')
    cy.wait(1000)
    cy.wait('@filter')
  })

  it('Filtern nach Zeitstempel letzten sechs Monate', () => {
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findErrors?offsetMultiplicator=0&queryPageLimit=500&dateInterval=letzten%20sechs%20Monate`,
    }).as('filter');
    cy.get('[data-cy=timestamp-filter-selection]').select('2: letzten sechs Monate')
    cy.wait(1000)
    cy.wait('@filter')
  })

  it('Filtern nach Zeitstempel im letzten Jahr', () => {
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findErrors?offsetMultiplicator=0&queryPageLimit=500&dateInterval=im%20letzten%20Jahr`,
    }).as('filter');
    cy.get('[data-cy=timestamp-filter-selection]').select('3: im letzten Jahr')
    cy.wait(1000)
    cy.wait('@filter')
  })

  it('Filtern nach Zeitstempel älter als ein Monat', () => {
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findErrors?offsetMultiplicator=0&queryPageLimit=500&dateInterval=%C3%A4lter%20als%20ein%20Monat`,
    }).as('filter');
    cy.get('[data-cy=timestamp-filter-selection]').select('4: älter als ein Monat')
    cy.wait(1000)
    cy.wait('@filter')
  })

  it('Filtern nach Zeitstempel älter als drei Monate', () => {
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findErrors?offsetMultiplicator=0&queryPageLimit=500&dateInterval=%C3%A4lter%20als%20drei%20Monate`,
    }).as('filter');
    cy.get('[data-cy=timestamp-filter-selection]').select('5: älter als drei Monate')
    cy.wait(1000)
    cy.wait('@filter')
  })

  it('Filtern nach Zeitstempel älter als sechs Monate', () => {
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findErrors?offsetMultiplicator=0&queryPageLimit=500&dateInterval=%C3%A4lter%20als%20sechs%20Monate`,
    }).as('filter');
    cy.get('[data-cy=timestamp-filter-selection]').select('6: älter als sechs Monate')
    cy.wait(1000)
    cy.wait('@filter')
  })

  it('Filtern nach Zeitstempel alle', () => {
    cy.intercept({
      method: 'GET',
      url: `http://localhost:9000/v1/trigger/findErrors?offsetMultiplicator=0&queryPageLimit=500&dateInterval=alle`,
    }).as('filter');
    cy.get('[data-cy=timestamp-filter-selection]').select('7: alle')
    cy.wait(1000)
    cy.wait('@filter')
  })
})
