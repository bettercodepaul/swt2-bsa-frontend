
describe('Shortcut buttons appear on login with different roles', () => {


  it('Shortcut buttons appear on Login as Ligaleiter', () => {
    cy.visit('http://localhost:4200/');

    cy.dismissModal();

    cy.contains('button.btn.btn-primary.btn-sm', 'Login für Team Ligaleiter').click();



    // Überprüfen, ob wir uns auf der Landingpage befinden
    cy.url().should('include', '/home');

    // Klicken Sie auf den Button zum Anlegen einer Veranstaltung
    cy.get('button.shortcut-btn[routerlinkactive="active"][ng-reflect-router-link="/verwaltung/veranstaltung/add"]').click();

    // Überprüfen, ob der Klick erfolgreich war und zur vorherigen Seite zurückkehren
    cy.url().should('include', '/verwaltung/veranstaltung/add');
    cy.go('back');

    // Überprüfen, ob wir zurück auf der ursprünglichen Seite sind
    cy.url().should('include', '/home');

    // Klicken Sie auf den Button für die Terminübersicht
    cy.get('button.shortcut-btn[routerlinkactive="active"][ng-reflect-router-link="/wkdurchfuehrung"]').click();

    // Überprüfen, ob der Klick erfolgreich war und zur vorherigen Seite zurückkehren
    cy.url().should('include', '/wkdurchfuehrung');
    cy.go('back');

    // Überprüfen, ob wir zurück auf der ursprünglichen Seite sind
    cy.url().should('include', '/home');

    // Klicken Sie auf den Button für die Vereinsübersicht
    cy.get('button.shortcut-btn[routerlinkactive="active"][ng-reflect-router-link="/verwaltung/vereine"]').click();

    // Überprüfen, ob der Klick erfolgreich war und zur vorherigen Seite zurückkehren
    cy.url().should('include', '/verwaltung/vereine');
    cy.go('back');

    // Überprüfen, ob wir zurück auf der ursprünglichen Seite sind
    cy.url().should('include', '/home');

    cy.logout();


  });


  it.only('Shortcutbuttons appear on Login as Sportleiter/Mannschaftsführer', () => {
    cy.visit('http://localhost:4200/');

    cy.dismissModal();

    cy.get('[data-cy="login-button"]').click()

   // cy.get('button#OKBtn1.action-btn-primary').click();

    cy.dismissModal();

    cy.contains('button.btn.btn-primary.btn-sm', 'Login für Team Sportleiter').click();

    cy.wait(2000)

    cy.get(':nth-child(1) > .Button > .shortcut-btn').click();

   // cy.get(':nth-child(2) > .Button > .shortcut-btn')
  });

  it('Shortcutbuttons appear on Login as Ausrichter',  () => {

  })

  it('Shortcutbuttons appear on Login as Kampfrichter',  () => {

  })
});

