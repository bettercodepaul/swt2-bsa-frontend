before(() => {
  // Einmalige Anmeldung als Admin
  cy.loginAdmin();
  cy.url().should('include', '#/home');
});

beforeEach(() => {
  cy.viewport(1920, 1080);

  // Navigation zur Verwaltungsseite
  cy.get('[data-cy=sidebar-verwaltung-button]').click();
  cy.url().should('include', '#/verwaltung');

  // Sync starten
  cy.get('[data-cy=verwaltung-sync-button]').click();
  cy.url().should('include', '#/verwaltung/migration');
});

afterEach(() => {
  //NOTE: Preparation for next test
  cy.disbandModalIfShown()
})



describe('Seitennavigation', function () {

    it('Previous Page Test', () => {
      cy.intercept({
        method: 'GET',
        url: `http://localhost:9000/v1/trigger/findAllWithPages?offsetMultiplicator=0&queryPageLimit=500&dateInterval=im letzten Jahr`,
      }).as('nextPage');
      cy.get('[data-cy=next-page-button]').click()
    })

    it('Next Page Test', () => {
      cy.intercept({
        method: 'GET',
        url: `http://localhost:9000/v1/trigger/findAllWithPages?offsetMultiplicator=0&queryPageLimit=500&dateInterval=im letzten Jahr`,
      }).as('previousPage');
      cy.get('[data-cy=previous-page-button]').click()
    })

    it('Next Page Test Above', () => {
      cy.intercept({
        method: 'GET',
        url: `http://localhost:9000/v1/trigger/findAllWithPages?offsetMultiplicator=0&queryPageLimit=500&dateInterval=im letzten Jahr`,
      }).as('nextPage');
      cy.get('[data-cy=next-page-button-above]').click()
    })

    it('Previous Page Test Above', () => {
      cy.intercept({
        method: 'GET',
        url: `http://localhost:9000/v1/trigger/findAllWithPages?offsetMultiplicator=0&queryPageLimit=500&dateInterval=im letzten Jahr`,
      }).as('previousPage');
      cy.get('[data-cy=previous-page-button-above]').click()
    })
  })

