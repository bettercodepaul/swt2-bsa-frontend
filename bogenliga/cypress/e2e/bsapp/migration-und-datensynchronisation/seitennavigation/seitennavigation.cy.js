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


})

afterEach(() => {
  //NOTE: Preparation for next test
  cy.wait(1000)
  cy.disbandModalIfShown()
  cy.wait(1000)
})



describe('Seitennavigation', function () {

    it('Previous Page Test', () => {
      cy.viewport(1920, 1080)
      cy.intercept({
        method: 'GET',
        url: `http://localhost:9000/v1/trigger/findAllWithPages?offsetMultiplicator=0&queryPageLimit=500&dateInterval=im letzten Jahr`,
      }).as('nextPage');
      cy.get('[data-cy=next-page-button]').click()
    })

    it('Next Page Test', () => {
      cy.viewport(1920, 1080)
      cy.intercept({
        method: 'GET',
        url: `http://localhost:9000/v1/trigger/findAllWithPages?offsetMultiplicator=0&queryPageLimit=500&dateInterval=im letzten Jahr`,
      }).as('previousPage');
      cy.get('[data-cy=previous-page-button]').click()
    })

    it('Next Page Test Above', () => {
      cy.viewport(1920, 1080)
      cy.intercept({
        method: 'GET',
        url: `http://localhost:9000/v1/trigger/findAllWithPages?offsetMultiplicator=0&queryPageLimit=500&dateInterval=im letzten Jahr`,
      }).as('nextPage');
      cy.get('[data-cy=next-page-button-above]').click()
    })

    it('Previous Page Test Above', () => {
      cy.viewport(1920, 1080)
      cy.intercept({
        method: 'GET',
        url: `http://localhost:9000/v1/trigger/findAllWithPages?offsetMultiplicator=0&queryPageLimit=500&dateInterval=im letzten Jahr`,
      }).as('previousPage');
      cy.get('[data-cy=previous-page-button-above]').click()
    })
  })


