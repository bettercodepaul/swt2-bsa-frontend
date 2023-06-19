
describe('Shortcut buttons appear on login with different roles', () => {

  it('Shortcut buttons appear on Login as Ligaleiter', () => {

    cy.visit('http://localhost:4200/#/user/login')

    cy.get('input#loginEmail').type('HSRT-Test@bogenliga.de')

    cy.get('input#loginPassword').type('mki4HSRT')

    cy.get('button#loginButton').click()

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

    cy.get('input#loginEmail').type('HSRT-Test3@bogenliga.de')

    cy.get('input#loginPassword').type('mki4HSRT')

    cy.get('button#loginButton').click()

    cy.get('[data-cy="login-button"]').click()


    cy.get(':nth-child(1) > .Button > .shortcut-btn').click();

    cy.go('back');

    cy.get('[data-cy="shortcut-btn-Vereinsmitglied-anlegen"]').click();

    cy.go('back');

    cy.get('[data-cy="shortcut-btn-Vereinsmitglieder-verwalten"]').click();

    cy.logout()
  });

  it('Shortcutbuttons appear on Login as Kampfrichter',  () => {
    cy.visit('http://localhost:4200/#/user/login');


cy.get('input#loginEmail').type('HSRT-Test4@bogenliga.de')

cy.get('input#loginPassword').type('mki4HSRT')

cy.get('button#loginButton').click()


    cy.url().should('include', '/home');

    cy.get('[data-cy="shortcut-btn-Wettkampf--durchführung"]').click();

    cy.url().should('include', '/wkdurchfuehrung');

    cy.go('back');

    cy.logout();


  })

  it('Shortcutbuttons appear on Login as Ausrichter',  () => {


    cy.visit('http://localhost:4200/#/user/login');

    cy.get('input#loginEmail').type('HSRT-Test@bogenliga.de')

    cy.get('input#loginPassword').type('mki4HSRT')

    cy.get('button#loginButton').click()

    cy.get('[data-cy="shortcut-btn-Veranstaltung-anlegen"]').click();

    cy.url().should('include', '/verwaltung/veranstaltung');

    cy.go('back');

    cy.url().should('include', '/home');

    cy.get('[data-cy="shortcut-btn-Wettkampf--durchführung"]').click();

    cy.url().should('include', '/wkdurchfuehrung');

    cy.go('back');

    cy.url().should('include', '/home');

    cy.logout();
  });

});

