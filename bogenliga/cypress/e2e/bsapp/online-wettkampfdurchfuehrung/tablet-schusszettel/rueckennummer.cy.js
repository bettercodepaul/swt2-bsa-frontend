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
          // Wähle exakt 3 unterschiedliche Schützen
          cy.get('.schuetze-item').then(($items) => {
            const usedNames = new Set();
            const uniqueItems = [];

            $items.each((i, el) => {
              const name = el.innerText.trim();
              if (!usedNames.has(name) && uniqueItems.length < 3) {
                usedNames.add(name);
                uniqueItems.push(el);
              }
            });

            expect(uniqueItems.length).to.eq(3, 'Genau 3 unterschiedliche Schützen gefunden');

            // Weise die Schützen den Slots zu (synchron & kontrolliert)
            uniqueItems.forEach((el, index) => {
              const name = el.innerText.trim();
              const rueckennummer = name.split('–')[0].trim();
              cy.log(`Slot ${index + 1}: ${name}`);

              cy.get('.slot-container input').eq(index).click();    // Slot aktivieren
              cy.wrap(el).click();                                  // Schütze zuweisen

              // Wertprüfung
              cy.get('.slot-container input').eq(index)
                .should('have.value', rueckennummer);
            });

          // Abschließen
          cy.get('button.confirm-button').should('not.be.disabled').click();
        });
      });
    });
  });
});
