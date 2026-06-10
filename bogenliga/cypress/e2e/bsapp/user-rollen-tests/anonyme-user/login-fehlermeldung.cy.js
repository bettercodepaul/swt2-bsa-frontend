describe('Login Fehlermeldung Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/#/user/login');
  });

  it('sollte eine Fehlermeldung im Formular anzeigen, wenn das Passwort falsch ist', () => {
    cy.get('#loginEmail').type('falsche@email.de');
    cy.get('#loginPassword').type('FalschesPasswort123!');

    cy.get('#loginButton').click();

    cy.get('bla-alert')
      .filter(':contains("Die Anmeldedaten sind falsch.")')
      .should('exist')
      .and('be.visible');

    cy.get('#loginEmail').should('have.class', 'is-invalid');
    cy.get('#loginPassword').should('have.class', 'is-invalid');
  });
});
