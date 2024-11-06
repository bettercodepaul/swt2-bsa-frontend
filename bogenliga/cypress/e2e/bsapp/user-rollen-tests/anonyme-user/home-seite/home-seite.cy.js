/**
 * This test opens the home page and check whether the tournament table has any content
 */
it('Home aufrufen / Wettkampftabelle gefüllt', function () {
  cy.clearLocalStorage();
  cy.clearCookies();
  cy.visit('http://localhost:4200/')
  cy.url().should('include', '#/home')
})

/**
 * This test presses the login button on the home page and checks whether the login page opens
 */
it('Login möglich / Fenster öffnet sich', function() {
  cy.get('[data-cy=login-button]').click()
  cy.url().should('include', '#/user/login')
})


