import {geheZuTabletSetup} from "../../../../support/tabletNavigation";

describe('Admin - Tablet-Schusszettel-Verwaltung', () => {
  beforeEach(() => {
    geheZuTabletSetup();
  });

  it('öffnet QR-Code-Modal und Link kopierbar', () => {
    cy.get('.session-table tbody tr', {timeout: 10000})
      .should('have.length.at.least', 1);
    cy.get('.session-table tbody tr').first().find('button').first().click();
    cy.get('bla-modal-dialog').should('be.visible');
    cy.get('qrcode').should('exist');

    cy.get('.qr-link-text')
      .should('be.visible')
      .invoke('text');

    cy.contains('button', 'Kopieren').click();
  });
});
