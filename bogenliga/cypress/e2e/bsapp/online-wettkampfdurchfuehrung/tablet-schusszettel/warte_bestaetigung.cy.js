import {geheZuTabletSetup} from "../../../../support/tabletNavigation";

describe('Admin - Tablet-Schusszettel-Verwaltung', () => {
  beforeEach(() => {
    geheZuTabletSetup();
    cy.intercept('GET', '**/tablet-schusszettel/sessions*').as('ladeSessions');
    cy.reload();
  });

  it('öffnet eine WARTE-Session', () => {
    cy.wait('@ladeSessions').then((interception) => {
      const sessions = interception.response.body.tabletSessionSingDTOs;
      const session = sessions.find(s => s.status === 'WARTE');

      expect(session, 'Mindestens eine WARTE-Session vorhanden').to.exist;

      cy.get('.session-table tbody tr').each(($row) => {
        const $cells = $row.find('td');
        const teamCellText = $cells.eq(0).text().trim();
        const statusCellText = $cells.eq(1).text().trim();

        if (statusCellText === 'WARTE' && teamCellText === session.teamName) {
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

          cy.contains('button', 'Refresh Status')
            .should('be.visible')
            .and('not.be.disabled')
            .click();
        });
    });
  });

  function öffneQrCodeDesGegnersDerWarteSession(folgeAktion) {
    cy.wait('@ladeSessions').then((interception) => {
      const sessions = interception.response.body.tabletSessionSingDTOs;
      const warteSession = sessions.find(s => s.status === 'WARTE');
      expect(warteSession).to.exist;

      cy.get('.session-table tbody tr').then((rows) => {
        let gegnerName = null;

        // 1. Finde den Gegnernamen aus der WARTE-Zeile
        Cypress._.some(rows, (row) => {
          const $cells = Cypress.$(row).find('td');
          const status = $cells.eq(1).text().trim();
          const team = $cells.eq(0).text().trim();
          if (status === 'WARTE' && team === warteSession.teamName) {
            gegnerName = $cells.eq(4).text().trim();
            return true; // break
          }
          return false;
        });

        expect(gegnerName, 'Gegnername gefunden').to.exist;

        // 2. QR-Code-Button in der Gegnerzeile klicken
        Cypress._.some(rows, (row) => {
          const $cells = Cypress.$(row).find('td');
          const team = $cells.eq(0).text().trim();
          if (team === gegnerName) {
            cy.wrap(row).within(() => {
              cy.get('button').first().click();
            });

            cy.get('bla-modal-dialog').should('be.visible');
            cy.get('.qr-link-text')
              .should('be.visible')
              .invoke('text')
              .then((linkText) => {
                cy.visit(linkText.trim());
                folgeAktion(warteSession.teamName);
              });
            return true;
          }
          return false;
        });
      });
    });
  }

  it('öffnet Gegner-QR-Link und führt Schützenmeldung aus', () => {
    öffneQrCodeDesGegnersDerWarteSession(() => {
      cy.get('.schuetze-item').then(($items) => {
        const used = new Set();
        const uniqueItems = [];

        $items.each((_, el) => {
          const name = el.innerText.trim();
          if (!used.has(name) && uniqueItems.length < 3) {
            used.add(name);
            uniqueItems.push(el);
          }
        });

        uniqueItems.forEach((el, i) => {
          const name = el.innerText.trim();
          const nr = name.split('–')[0].trim();
          cy.get('.slot-container input').eq(i).click();
          cy.wrap(el).click();
          cy.get('.slot-container input').eq(i).should('have.value', nr);
        });

        cy.get('button.confirm-button').should('not.be.disabled').click();
      });
    });
  });

  it('öffnet Gegner-QR-Link und führt Satzeingabe aus', () => {
    öffneQrCodeDesGegnersDerWarteSession((teamName) => {
      cy.get('table.treffer-table tbody tr').eq(0).within(() => {
        cy.get('input[id^="schuss1"]').clear().type('10');
        cy.get('input[id^="schuss2"]').clear().type('9');
      });

      cy.get('table.treffer-table tbody tr').eq(1).within(() => {
        cy.get('input[id^="schuss1"]').clear().type('8');
        cy.get('input[id^="schuss2"]').clear().type('9');
      });

      cy.get('table.treffer-table tbody tr').eq(2).within(() => {
        cy.get('input[id^="schuss1"]').clear().type('7');
        cy.get('input[id^="schuss2"]').clear().type('8');
      });

      cy.get('button.confirm-button').should('not.be.disabled').click();

      cy.visit('#/schusszettel/tablet-setup/2000');
      // Statuswechsel prüfen
      cy.intercept('GET', '**/tablet-schusszettel/sessions*').as('ladeSessionsCheck');
      cy.reload();
      cy.wait('@ladeSessionsCheck').then((interception) => {
        const sessions = interception.response.body.tabletSessionSingDTOs;
        const updated = sessions.find(s => s.teamName === teamName);
        expect(updated).to.exist;
        expect(updated.status).to.eq('SATZEINGABE');
      });
    });
  });
});
