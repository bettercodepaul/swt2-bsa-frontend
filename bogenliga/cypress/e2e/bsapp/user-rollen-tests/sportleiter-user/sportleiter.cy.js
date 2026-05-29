describe('Sportleiter User Tests', () => {

  beforeEach(() => {
    // Login als Sportleiter
    cy.LoginSportleiter();
    cy.url().should('include', '/home');
    // Warte, bis die Seite vollständig geladen ist
    cy.get('h1', { timeout: 15000 }).should('be.visible');
  });

  afterEach(() => {
    // Logout nach jedem Test
    cy.logout();
  });

  it('Sportleiter kann sich erfolgreich anmelden', () => {
    // Überprüfen, dass die Home-Seite geladen wird
    cy.url().should('include', '/home');
    cy.get('h1').should('contain', 'Willkommen'); // oder ähnlicher Text
  });

  it('Schnellstart-Buttons für Sportleiter werden korrekt angezeigt', () => {
    // Warte, bis die Buttons geladen sind
    cy.get('[data-cy="shortcut-btn-Mannschaften-verwalten"]', { timeout: 15000 }).should('exist').and('be.visible');
    cy.get('[data-cy="shortcut-btn-Mannschaft-anlegen"]', { timeout: 15000 }).should('exist').and('be.visible');
    cy.get('[data-cy="shortcut-btn-Vereinsmitglieder-verwalten"]', { timeout: 15000 }).should('exist').and('be.visible');
  });

  it('Button "Mannschaften verwalten" funktioniert korrekt', () => {
    cy.get('[data-cy="shortcut-btn-Mannschaften-verwalten"]', { timeout: 15000 }).should('exist').and('be.visible').click();
    // Die Route wird dynamisch basierend auf der Vereins-ID generiert
    cy.url().should('include', '/verwaltung/vereine/');
    // Überprüfen, dass die Seite geladen wird (z.B. durch Überprüfung eines Elements)
    cy.get('body').should('be.visible');
  });

  it('Button "Mannschaft anlegen" funktioniert korrekt', () => {
    cy.get('[data-cy="shortcut-btn-Mannschaft-anlegen"]', { timeout: 15000 }).should('exist').and('be.visible').click();
    // Die Route wird dynamisch basierend auf der Vereins-ID generiert
    cy.url().should('include', '/verwaltung/vereine/');
    cy.url().should('include', '/add');
    // Überprüfen, dass die Seite geladen wird
    cy.get('body').should('be.visible');
  });

  it('Button "Vereinsmitglieder verwalten" funktioniert korrekt', () => {
    cy.get('[data-cy="shortcut-btn-Vereinsmitglieder-verwalten"]', { timeout: 15000 }).should('exist').and('be.visible').click();
    cy.url().should('include', '/verwaltung/dsbmitglieder');
    // Überprüfen, dass die Seite geladen wird
    cy.get('body').should('be.visible');
  });
});
