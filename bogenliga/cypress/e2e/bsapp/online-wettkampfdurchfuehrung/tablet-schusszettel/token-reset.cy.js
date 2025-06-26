import {geheZuTabletSetup} from "../../../../support/tabletNavigation";

describe('Admin - Tablet-Schusszettel-Verwaltung', () => {
  beforeEach(() => {
    geheZuTabletSetup();
  });
  it('setzt Token zurück und zeigt neuen Wert an', () => {
    cy.get('.session-table', {timeout: 10000}).should('exist');
    cy.get('.session-table tbody tr').should('have.length.at.least', 1);

    let originalToken = '';
    cy.get('.session-table tbody tr').first()
      .find('td')
      .eq(2)
      .invoke('text')
      .then((originalToken) => {
        originalToken = originalToken.trim();
      });
    // Reset-Button klicken
    cy.get('.session-table tbody tr').first()
      .find('button').eq(1).click();

    // Warten, bis der Token sich ändert
    cy.get('.session-table tbody tr').first()
      .find('td')
      .eq(2)
      .should(($td) => {
        const newToken = $td.text().trim();
        expect(newToken).to.not.equal(originalToken);
      });
  });
});
