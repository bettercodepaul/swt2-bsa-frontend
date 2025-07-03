import {geheZuTabletSetup} from "../../../../support/tabletNavigation";

describe('Admin - Tablet-Schusszettel-Verwaltung', () => {
  beforeEach(() => {
    geheZuTabletSetup();
  });

  it('öffnet QR-Code-Link aus Status Satzeingabe', () => {
    cy.intercept('GET', '**/tablet-schusszettel/sessions*').as('ladeSessions');
    cy.reload();

    cy.wait('@ladeSessions').then((interception) => {
      const sessions = interception.response.body.tabletSessionSingDTOs;
      const session = sessions.find(s => s.status === 'SATZEINGABE');

      expect(session, 'Mindestens eine SATZEINGABE-Session vorhanden').to.exist;

      cy.get('.session-table tbody tr').each(($row) => {
        const $cells = $row.find('td');
        const teamCellText = $cells.eq(0).text().trim();
        const statusCellText = $cells.eq(1).text().trim();

        if (statusCellText === 'SATZEINGABE' && teamCellText === session.teamName) {
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
          cy.get('button.weiter-button').click();
          cy.get('table.treffer-table tbody tr').should('have.length.at.least', 2);

          // Erste Zeile prüfen
          cy.get('table.treffer-table tbody tr').eq(0).within(() => {
            cy.get('input[id^="schuss1"]').as('schuss1');
            cy.get('input[id^="schuss2"]').as('schuss2');

            cy.get('@schuss1')
              .type('{selectall}11')
              .should('have.value', '11')
              .blur();
              cy.get('.error').should('exist').and('contain', '0–10');


            cy.get('@schuss2')
              .type('{selectall}-1')
              .should('have.value', '-1')
              .blur();
              cy.get('.error').should('contain', '0–10');

            cy.get('@schuss1').clear().type('10')
              .then(() => {
                cy.focused().should('have.attr', 'id').and('include', 'schuss2');

              });
            cy.get('@schuss2').clear().type('9');

          });

          // Zweite Zeile korrekt befüllen
          cy.get('table.treffer-table tbody tr').eq(1).within(() => {
            cy.get('input[id^="schuss1"]').clear().type('8');
            cy.get('input[id^="schuss2"]').clear().type('9');
          });

          // Dritter Zeile korrekt befüllen
          cy.get('table.treffer-table tbody tr').eq(2).within(() => {
            cy.get('input[id^="schuss1"]').clear().type('7');
            cy.get('input[id^="schuss2"]').clear().type('8');
          });


          cy.get('button.confirm-button').should('not.be.disabled').click();
        });
    });
  });
});
