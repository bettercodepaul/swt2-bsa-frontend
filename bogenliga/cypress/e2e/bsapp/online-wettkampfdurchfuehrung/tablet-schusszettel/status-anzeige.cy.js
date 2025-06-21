import {geheZuTabletSetup} from "../../../../support/tabletNavigation";

describe('Admin - Tablet-Schusszettel-Verwaltung', () => {
  beforeEach(() => {
    geheZuTabletSetup();
  });
  it('zeigt Status korrekt gemäß Backend an', () => {
    cy.intercept('GET', '**/tablet-schusszettel/sessions*').as('ladeSessions');
    cy.reload();

    cy.wait('@ladeSessions').then((interception) => {
      const body = interception.response.body;
      const sessions = body.tabletSessionSingDTOs;

      sessions.slice(0, 3).forEach(({teamName, status}) => {
        cy.contains('.session-table tbody td', teamName)
          .should('exist')
          .parents('tr')
          .within(() => {
            cy.get('td').eq(1)
              .should('exist')
              .then(($td) => {
                const trimmed = $td.text().trim();
                cy.log(`Status im DOM: "${trimmed}"`);
                cy.log(`Backend erwartet: "${status}"`);
                expect(trimmed).to.equal(status);
              });
          });
      });
    });
  });
});
