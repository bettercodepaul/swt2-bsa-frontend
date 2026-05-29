describe('Sportleiter Schnellstart-Buttons Tests', () => {

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

  it('Schnellstart-Buttons für Sportleiter werden angezeigt', () => {
    // Warte, bis die Buttons geladen sind
    cy.get('[data-cy="shortcut-btn-Mannschaften-verwalten"]', { timeout: 15000 }).should('exist').and('be.visible');
    cy.get('[data-cy="shortcut-btn-Mannschaft-anlegen"]', { timeout: 15000 }).should('exist').and('be.visible');
    cy.get('[data-cy="shortcut-btn-Vereinsmitglieder-verwalten"]', { timeout: 15000 }).should('exist').and('be.visible');
  });

  it('Button "Mannschaften verwalten" kann gedrückt werden', () => {
    cy.get('[data-cy="shortcut-btn-Mannschaften-verwalten"]', { timeout: 15000 }).should('exist').and('be.visible').click();
    // Die Route wird dynamisch basierend auf der Vereins-ID generiert
    cy.url().should('include', '/verwaltung/vereine/');
    cy.go('back');
  });

  it('Button "Mannschaft anlegen" kann gedrückt werden', () => {
    cy.get('[data-cy="shortcut-btn-Mannschaft-anlegen"]', { timeout: 15000 }).should('exist').and('be.visible').click();
    // Die Route wird dynamisch basierend auf der Vereins-ID generiert
    cy.url().should('include', '/verwaltung/vereine/');
    cy.url().should('include', '/add');
    cy.go('back');
  });

  it('Button "Vereinsmitglieder verwalten" kann gedrückt werden', () => {
    cy.get('[data-cy="shortcut-btn-Vereinsmitglieder-verwalten"]', { timeout: 15000 }).should('exist').and('be.visible').click();
    cy.url().should('include', '/verwaltung/dsbmitglieder');
    cy.go('back');
  });

  it('Alle drei Buttons können gedrückt werden', () => {
    // Teste jeden Button einzeln
    cy.get('[data-cy="shortcut-btn-Mannschaften-verwalten"]', { timeout: 15000 }).should('exist').and('be.visible').click();
    cy.url().should('include', '/verwaltung/vereine/');
    cy.go('back');

    cy.get('[data-cy="shortcut-btn-Mannschaft-anlegen"]', { timeout: 15000 }).should('exist').and('be.visible').click();
    cy.url().should('include', '/verwaltung/vereine/');
    cy.url().should('include', '/add');
    cy.go('back');

    cy.get('[data-cy="shortcut-btn-Vereinsmitglieder-verwalten"]', { timeout: 15000 }).should('exist').and('be.visible').click();
    cy.url().should('include', '/verwaltung/dsbmitglieder');
    cy.go('back');
  });

  it('Debug: Überprüfe verfügbare Elemente auf der Seite', () => {
    // Debug-Ausgabe der verfügbaren Buttons
    cy.get('body').then($body => {
      if ($body.find('[data-cy*="shortcut-btn"]').length > 0) {
        cy.log('Shortcut-Buttons gefunden:');
        cy.get('[data-cy*="shortcut-btn"]').each(($el, index) => {
          cy.log(`Button ${index}: ${$el.attr('data-cy')}`);
        });
      } else {
        cy.log('Keine Shortcut-Buttons gefunden');
        // Zeige alle verfügbaren Buttons
        cy.get('button').each(($el, index) => {
          cy.log(`Button ${index}: ${$el.text().trim()}`);
        });
      }
    });
  });

  it('Debug: Überprüfe User-Rolle und Berechtigungen', () => {
    // Überprüfe, ob wir auf der richtigen Seite sind
    cy.url().should('include', '/home');
    cy.log('Auf Home-Seite');

    // Überprüfe, ob ein h1 Element vorhanden ist
    cy.get('h1').should('be.visible');
    cy.log('H1 Element gefunden');

    // Überprüfe, ob das Shortcut-Container vorhanden ist
    cy.get('body').then($body => {
      if ($body.text().includes('Was möchtest du tun?')) {
        cy.log('Shortcut-Container gefunden');
      } else {
        cy.log('Shortcut-Container nicht gefunden');
      }
    });
  });
});
