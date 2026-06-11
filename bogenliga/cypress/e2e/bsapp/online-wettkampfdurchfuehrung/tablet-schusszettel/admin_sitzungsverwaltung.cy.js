import {
  geheZuTabletSetup,
  loginAlsAdmin,
  resetDemoWettkampf,
} from '../../../../support/tabletNavigation';

/**
 * Admin-Sitzungsverwaltung des Tablet-Schusszettels (Demo-Wettkampf 3001).
 * Prueft Wettkampf-Infos, die Sitzungstabelle und das QR-Code-Modal.
 */
describe('Admin - Tablet-Schusszettel-Verwaltung', () => {
  before(() => {
    resetDemoWettkampf();
    loginAlsAdmin();
  });

  beforeEach(() => {
    geheZuTabletSetup().as('sessions');
  });

  it('zeigt die Veranstaltungsinfo des Demo-Wettkampfs korrekt an', () => {
    cy.get('.header-section h3').should('contain.text', 'Demo Wettkampfdurchfuehrung');
    cy.get('.header-section h3').should('contain.text', '2025');

    cy.get('.info-item').contains('strong', 'Liga:').parent()
      .should('contain.text', 'Demo-Liga Wettkampfdurchfuehrung');
    cy.get('.info-item').contains('strong', 'Wettkampftag:').parent()
      .should('contain.text', '1');
    cy.get('.info-item').contains('strong', 'Datum:').parent()
      .should('contain.text', '13.06.2026');
    cy.get('.info-item').contains('strong', 'Beginn:').parent()
      .should('contain.text', '13:30');
    cy.get('.info-item').contains('strong', 'Ort:').parent()
      .should('contain.text', 'Demo-Halle 1');
  });

  it('zeigt alle 8 Demo-Teams initial im Status SCHUETZENMELDUNG', () => {
    cy.get('@sessions').then((sessions) => {
      expect(sessions).to.have.length(8);
      sessions.forEach((session) => {
        expect(session.status, `Status von ${session.teamName}`).to.eq('SCHUETZENMELDUNG');
        expect(session.token, `Token von ${session.teamName}`).to.be.a('string').and.not.be.empty;
      });
    });

    cy.get('.session-table tbody tr').should('have.length', 8);
    // Jede Zeile hat einen Gegner (Round Robin, 8 Teams -> 4 Begegnungen)
    cy.get('.session-table tbody tr').each(($row) => {
      const gegner = $row.find('td').eq(4).text().trim();
      expect(gegner, 'Gegner-Spalte gefuellt').to.not.be.oneOf(['', '-']);
    });
  });

  it('oeffnet das QR-Code-Modal mit gueltigem Tablet-Link', () => {
    cy.get('@sessions').then((sessions) => {
      const session = sessions[0];

      cy.contains('.session-table tbody td', session.teamName)
        .parents('tr')
        .within(() => {
          cy.get('button').first().click();
        });

      // Modal mit QR-Code und Link oeffnet sich
      cy.contains('h5', 'QR-Code').should('be.visible');
      cy.get('qrcode').should('exist');
      cy.get('.qr-link-text')
        .should('be.visible')
        .invoke('text')
        .then((linkText) => {
          const link = linkText.trim();
          expect(link).to.include('/schusszettel/tablet');
          expect(link).to.include(`token=${session.token}`);
          expect(link).to.include(`teamid=${session.teamId}`);
          expect(link).to.include('wettkampfid=3001');
        });
    });
  });
});
