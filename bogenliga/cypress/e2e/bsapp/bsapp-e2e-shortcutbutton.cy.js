describe('Shortcuts appear on login', function() {
  it('Click shortcut buttons on login as Ligaleiter', function() {
    cy.visit('http://localhost:4200/');
    cy.get('button#OKBtn1.action-btn-primary').click();

    cy.contains('button.btn.btn-primary.btn-sm', 'Login für Team Ligaleiter').click();
  });
});
