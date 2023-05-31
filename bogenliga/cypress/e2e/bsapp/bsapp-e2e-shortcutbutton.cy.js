
describe('Shortcut buttons appear on login with different roles', () => {

  it('Shortcut buttons appear on Login as Ligaleiter', () => {
    cy.visit('http://localhost:4200/');

    cy.dismissModal();

    cy.contains('button.btn.btn-primary.btn-sm', 'Login für Team Ligaleiter').click();

    cy.url().should('include', '/home');

    cy.get('button.shortcut-btn[routerlinkactive="active"][ng-reflect-router-link="/verwaltung/veranstaltung/add"]').click();

    cy.url().should('include', '/verwaltung/veranstaltung/add');
    cy.go('back');

    cy.url().should('include', '/home');

    cy.get('button.shortcut-btn[routerlinkactive="active"][ng-reflect-router-link="/wkdurchfuehrung"]').click();

    cy.url().should('include', '/wkdurchfuehrung');
    cy.go('back');

    cy.url().should('include', '/home');

    cy.get('button.shortcut-btn[routerlinkactive="active"][ng-reflect-router-link="/verwaltung/vereine"]').click();

    cy.url().should('include', '/verwaltung/vereine');
    cy.go('back');

    cy.url().should('include', '/home');

    cy.logout();
  });


  it('Shortcutbuttons appear on Login as Sportleiter/Mannschaftsführer', () => {
    cy.visit('http://localhost:4200/');

    cy.dismissModal();

    cy.get('[data-cy="login-button"]').click()

    cy.dismissModal();

    cy.contains('button.btn.btn-primary.btn-sm', 'Login für Team Sportleiter').click();

    cy.get(':nth-child(1) > .Button > .shortcut-btn').click();

    cy.dismissModal();

    cy.go('back');

    cy.get(':nth-child(2) > .Button > .shortcut-btn').click();

    cy.logout()
  });

  it.only('Shortcutbuttons appear on Login as Kampfrichter',  () => {
    //cy.visit('http://localhost:4200/#/user/login');

    cy.loginAdmin();

    cy.createUserTest();

    cy.visit('http://localhost:4200/#/verwaltung/user');

    cy.assignRoleToTestUser("KAMPFRICHTER");

    cy.logout();

    cy.loginUserTest();

    cy.url().should('include', '/home');

    cy.go('back');


    cy.get(':nth-child(1) > .Button > .shortcut-btn').click()

    cy.url().should('include', '/wkdurchfuehrung');


    cy.go('back');


    cy.logout();

  })

  it('Shortcutbuttons appear on Login as Ausrichter',  () => {
    cy.visit('http://localhost:4200/#/user/login');

    cy.get('input#loginEmail').type('testKampfrichter@testmail.com');
    cy.get('input#loginPassword').type('Test123456');
    cy.get('#loginButton').click({ force: true });
    cy.dismissModal();
    cy.wait(2000);

    cy.url().should('include', '/home');

    cy.get('button.shortcut-btn[ng-reflect-router-link="/wkdurchfuehrung"]').click();

    cy.url().should('include', '/wkdurchfuehrung');

    cy.go('back');

    cy.url().should('include', '/home');

    cy.logout()
  });

});

