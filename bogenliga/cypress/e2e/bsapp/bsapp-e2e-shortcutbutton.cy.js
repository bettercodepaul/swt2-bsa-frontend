
describe('Shortcut buttons appear on login with different roles', () => {

  it.only('Shortcut buttons appear on Login as Ligaleiter', () => {

    cy.visit('http://localhost:4200/#/user/login')

    /*
    cy.get('input#loginEmail').type('HSRT-Test@bogenliga.de')

    cy.get('input#loginPassword').type('mki4HSRT')

    cy.get('button#loginButton').click()

    cy.pause()

     */
    cy.contains('button.btn.btn-primary.btn-sm', 'Login für Team Ligaleiter').click();

    cy.url().should('include', '/home');

    cy.get('[data-cy="shortcut-btn-Veranstaltung-anlegen"]').click();

    cy.url().should('include', '/verwaltung/veranstaltung/add');
    cy.go('back');

    cy.url().should('include', '/home');

    cy.get('[data-cy="shortcut-btn-Wettkampf--durchführung"]').click();

    cy.url().should('include', '/wkdurchfuehrung');
    cy.go('back');

    cy.url().should('include', '/home');

    cy.get('[data-cy="shortcut-btn-Vereinsübersicht"]').click();

    cy.url().should('include', '/verwaltung/vereine');
    cy.go('back');

    cy.url().should('include', '/home');

    cy.logout();
  });


  it('Shortcutbuttons appear on Login as Sportleiter/Mannschaftsführer', () => {
    cy.visit('http://localhost:4200/#/user/login');

    /*
cy.get('input#loginEmail').type('HSRT-Test3@bogenliga.de')

cy.get('input#loginPassword').type('mki4HSRT')

cy.get('button#loginButton').click()

cy.pause()

 */

    cy.get('[data-cy="login-button"]').click()

    cy.contains('button.btn.btn-primary.btn-sm', 'Login für Team Sportleiter').click();

    cy.get(':nth-child(1) > .Button > .shortcut-btn').click();

    cy.go('back');

    cy.get('[data-cy="shortcut-btn-Vereinsmitglied-anlegen"]').click();

    cy.go('back');

    cy.get('[data-cy="shortcut-btn-Vereinsmitglieder-verwalten"]').click();

    cy.logout()
  });

  it('Shortcutbuttons appear on Login as Kampfrichter',  () => {

    cy.loginAdmin();

    cy.createUserTest();

    cy.visit('http://localhost:4200/#/verwaltung/user');

    cy.assignRoleToTestUser("KAMPFRICHTER");

    cy.logout();

    cy.loginUserTest();
    /*
cy.get('input#loginEmail').type('HSRT-Test4@bogenliga.de')

cy.get('input#loginPassword').type('mki4HSRT')

cy.get('button#loginButton').click()

cy.pause()

 */

    cy.url().should('include', '/home');

    cy.get('[data-cy="shortcut-btn-Wettkampf--durchführung"]').click();

    cy.url().should('include', '/wkdurchfuehrung');

    cy.go('back');

    cy.logout();

    cy.visit('http://localhost:4200/#/user/login');

    cy.deleteTestUser();

  })

  it('Shortcutbuttons appear on Login as Ausrichter',  () => {

    cy.loginAdmin();

    cy.createUserTest();

    cy.visit('http://localhost:4200/#/verwaltung/user');

    cy.assignRoleToTestUser("AUSRICHTER");

    cy.logout();

    cy.loginUserTest();

    cy.url().should('include', '/home');77

    /*
    cy.get('input#loginEmail').type('HSRT-Test@bogenliga.de')

    cy.get('input#loginPassword').type('mki4HSRT')

    cy.get('button#loginButton').click()

    cy.pause()

     */

    cy.get('[data-cy="shortcut-btn-Vorauswahl-Veranstaltungen"]').click();

    cy.url().should('include', '/verwaltung/veranstaltung');

    cy.go('back');

    cy.url().should('include', '/home');

    cy.get('[data-cy="shortcut-btn-Wettkampf--durchführung"]').click();

    cy.url().should('include', '/wkdurchfuehrung');

    cy.go('back');

    cy.url().should('include', '/home');

    cy.logout();

    cy.visit('http://localhost:4200/#/user/login');

    cy.deleteTestUser();
  });

});

