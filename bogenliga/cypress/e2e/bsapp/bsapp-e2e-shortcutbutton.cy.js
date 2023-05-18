describe('Shortcuts appear on login', function() {
  it('Click shortcut buttons on login as Ligaleiter', function() {
    cy.visit('http://localhost:4200/');
    cy.get('button#OKBtn1.action-btn-primary').click();

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

    // Weitere Tests oder Assertions hier hinzufügen
  });
});

