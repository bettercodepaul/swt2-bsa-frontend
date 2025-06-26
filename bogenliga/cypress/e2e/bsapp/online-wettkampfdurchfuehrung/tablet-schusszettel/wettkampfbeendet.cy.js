import {geheZuTabletSetup} from "../../../../support/tabletNavigation";

describe('Wettkampf beendet Maske', () => {
  beforeEach(() => {
    geheZuTabletSetup();
    cy.intercept('GET', '**/tablet-schusszettel/sessions*').as('ladeSessions');
    cy.reload();
  });

  it('zeigt Ergebnis-Tabelle und Start Again Button', () => {
    cy.wait('@ladeSessions').then((interception) => {
      const sessions = interception.response.body.tabletSessionSingDTOs;
      const session = sessions.find(s => s.status === 'WETTKAMPF_ENDE');

      expect(session, 'Mindestens eine WETTKAMPF_ENDE-Session vorhanden').to.exist;

      cy.get('.session-table tbody tr').each(($row) => {
        const $cells = $row.find('td');
        const teamCellText = $cells.eq(0).text().trim();
        const statusCellText = $cells.eq(1).text().trim();

        if (statusCellText === 'WETTKAMPF_ENDE' && teamCellText === session.teamName) {
          cy.wrap($row).within(() => {
            cy.get('button').first().click();
          });
        }
      });

      cy.get('bla-modal-dialog').should('be.visible');
      cy.get('.qr-link-text')
        .should('be.visible')
        .invoke('text')
        .then((linkText) => {
          cy.visit(linkText.trim());

          // Tabelle prüfen
          cy.get('.result-table').within(() => {
            cy.get('thead').should('exist');
            cy.get('tbody tr').should('have.length.at.least', 1); // mindestens ein Team
            cy.get('tbody tr').first().within(() => {
              cy.get('td').eq(0).should('not.be.empty'); // Teamname
              cy.get('td').eq(1).should('not.be.empty'); // Matchpunkte
            });
          });


          cy.url().then((urlVorher) => {
            cy.intercept('GET', '**/tablet-schusszettel/sessions*').as('neuLaden');
            cy.contains('button', 'Start Again').click();
            cy.url().should('eq', urlVorher); // Seite ist gleich geblieben
          });

        });
    });
  });
});
