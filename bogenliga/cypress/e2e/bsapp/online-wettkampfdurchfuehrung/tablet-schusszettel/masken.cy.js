import {geheZuTabletSetup} from "../../../../support/tabletNavigation";

describe('Admin - Tablet-Schusszettel-Verwaltung', () => {
  beforeEach(() => {
    geheZuTabletSetup();
  });
  it('öffnet QR-Code-Link aus Status SCHUETZENMELDUNG', () => {
    cy.intercept('GET', '**/tablet-schusszettel/sessions*').as('ladeSessions');
    cy.reload();
    cy.wait('@ladeSessions').then((interception) => {
      const sessions = interception.response.body.tabletSessionSingDTOs;
      const session = sessions.find(s => s.status === 'SCHUETZENMELDUNG');

      expect(session, 'Mindestens eine SCHUETZENMELDUNG-Session vorhanden').to.exist;

      // Tabelle nach passender Zeile durchsuchen
      cy.get('.session-table tbody tr').each(($row) => {
        const $cells = $row.find('td');
        const teamCellText = $cells.eq(0).text().trim();
        const statusCellText = $cells.eq(1).text().trim();

        if (statusCellText === 'SCHUETZENMELDUNG' && teamCellText === session.teamName) {
          cy.wrap($row).within(() => {
            cy.get('button').first().click();
          });
        }
      });

      cy.get('bla-modal-dialog').should('be.visible');
      // Link extrahieren
      cy.get('.qr-link-text')
        .should('be.visible')
        .invoke('text')
        .then((linkText) => {
          cy.log('Gefundener Link:', linkText);

          // Simuliere das Öffnen in neuem Tab
          cy.visit(linkText.trim());
          cy.get('button').then(($btns) => {
            const buttons = Array.from($btns);

            const schuetzenButtons = buttons.filter(btn =>
              btn.innerText.includes('SWT2_')
            );

            // Warte, bis die Schützen geladen sind
            cy.get('.schuetze-item').should('have.length', 3);

            cy.get('.schuetze-item').each(($el, index) => {
              cy.wrap($el).click();

              cy.get('.slot-container input').eq(index).click();
              cy.get('.schuetze-item').eq(index).click();
              cy.get('.slot-container input').eq(index)
                .should(($input) => {
                  const val = $input.val();
                  expect(val, `Slot ${index + 1} sollte gefüllt sein`).to.not.be.empty;
                });
            });

              // "BESTÄTIGEN" Button klicken
            cy.get('button.confirm-button').should('not.be.disabled').click();
          });

          });
    });
  });
});
