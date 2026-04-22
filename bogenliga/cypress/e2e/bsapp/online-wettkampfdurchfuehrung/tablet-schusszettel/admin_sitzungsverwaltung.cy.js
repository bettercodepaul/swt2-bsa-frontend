import {geheZuTabletSetup} from "../../../../support/tabletNavigation";

describe('Admin - Tablet-Schusszettel-Verwaltung', () => {
  beforeEach(() => {
 geheZuTabletSetup();
  });

  it('zeigt Veranstaltungsinfo korrekt an', () => {
    cy.get('.header-section h3', {timeout: 10000})
      .should('exist');

    cy.get('.info-item').should('contain.text', 'Liga');
    cy.get('.info-item').should('contain.text', '1');
    cy.get('.info-item').should('contain.text', '12.12.2025');
    cy.get('.info-item').should('contain.text', '15:30');
    cy.get('.info-item').should('contain.text', 'Reutlingen');
  });

  it('zeigt Tabelle mit Teams', () => {
    cy.intercept('GET', '**/tablet-schusszettel/sessions*');

    cy.get('.session-table', {timeout: 10000}).should('exist');
    cy.get('.session-table tbody tr').its('length').should('be.gte', 1);
  });
});
