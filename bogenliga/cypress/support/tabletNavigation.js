export const geheZuTabletSetup = () => {
  cy.visit('http://localhost:4200/#/user/login');
  cy.get('[data-cy=login-als-admin-button]').click();
  cy.url().should('include', '/home');

  cy.get('[data-cy=sidebar-wkdurchfuehrung-button]').click();
  cy.url().should('include', '/wkdurchfuehrung');

  cy.contains('SWT2_Veranstaltung').click();
  cy.get('select').select('SWT2_Veranstaltung');
  cy.contains('button', 'Auswählen').first().click();

  cy.contains('Druckdaten').click();
  cy.get('#setupTabletSchusszettel').click();
  cy.url().should('include', '/tablet-setup');
};
