it('Login erfolgreich', function() {
  cy.visit('http://localhost:4200/#/home');
  cy.get('[data-cy=login-button]').click();
  cy.get('p:nth-child(8) #undefined').click();
});

it('Anzeige Wettkampfklassen', function () {
  cy.get('[data-cy=sidebar-verwaltung-button]').click()
  cy.get('[data-cy=verwaltung-klassen-button]').click()
  cy.url().should('include', '#/verwaltung/klassen')
})
