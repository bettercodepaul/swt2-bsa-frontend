describe('Admin - Tablet-Schusszettel-Verwaltung', () => {
  beforeEach(() => {
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

  });

  it('zeigt Veranstaltungsinfo korrekt an', () => {
    cy.get('.header-section h3', { timeout: 10000 })
      .should('exist');

    cy.get('.info-item').should('contain.text', 'Liga');
    cy.get('.info-item').should('contain.text', '1');
    cy.get('.info-item').should('contain.text', '05.05.2018');
    cy.get('.info-item').should('contain.text', '15:30');
    cy.get('.info-item').should('contain.text', 'Reutlingen');
  });

  it('zeigt Tabelle mit Teams', () => {
    cy.intercept('GET', '**/tablet-schusszettel/sessions*').as('getSessions');

    cy.get('.session-table', { timeout: 10000 }).should('exist');
    cy.get('.session-table tbody tr').its('length').should('be.gte', 1);
  });

  it('öffnet QR-Code-Modal', () => {
    cy.get('.session-table tbody tr', { timeout: 10000 })
      .should('have.length.at.least', 1);


    cy.get('.session-table tbody tr').first().find('button').first().click();

    cy.get('bla-modal-dialog').should('be.visible');
    cy.get('qrcode').should('exist');
  });
});
