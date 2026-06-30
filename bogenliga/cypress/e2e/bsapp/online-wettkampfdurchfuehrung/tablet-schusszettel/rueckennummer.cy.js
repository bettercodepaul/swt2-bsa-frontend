import {
  geheZuTabletSetup,
  loginAlsAdmin,
  resetDemoWettkampf,
  waehleErstenFreienSchuetzen,
} from '../../../../support/tabletNavigation';

/**
 * Schuetzenmeldung auf dem Tablet (Maske 1):
 * QR-Link aus dem Admin-Modal oeffnen, drei Schuetzen ueber die
 * Dropdown-Menues melden und die Sicherheitsabfrage durchlaufen.
 */
describe('Tablet - Schuetzenmeldung', () => {
  before(() => {
    resetDemoWettkampf();
    loginAlsAdmin();
  });

  it('meldet drei Schuetzen ueber den QR-Code-Link', () => {
    geheZuTabletSetup().then((sessions) => {
      const session = sessions.find((s) => s.status === 'SCHUETZENMELDUNG');
      expect(session, 'Mindestens eine SCHUETZENMELDUNG-Session vorhanden').to.exist;

      // QR-Modal der Session oeffnen und Link auslesen
      cy.contains('.session-table tbody td', session.teamName)
        .parents('tr')
        .within(() => {
          cy.get('button').first().click();
        });
      // Nur den Link im Modal lesen - die Setup-Seite zeigt darunter
      // auch den Kampfrichter-Link mit derselben Klasse .qr-link-text.
      cy.get('.modal-dialog-content .qr-link-text')
        .should('be.visible')
        .invoke('text')
        .then((linkText) => {
          cy.visit(linkText.trim());
        });

      // Zustands-Uebersicht (Maske 4) -> Weiter zur Registrierung
      cy.get('button.weiter-button', { timeout: 20000 }).click();

      // Drei Dropdowns, Demo-Teams haben genau 3 waehlbare Schuetzen
      cy.get('select.shooter-menu').should('have.length', 3);
      cy.get('select.shooter-menu').eq(0)
        .find('option:not([disabled])')
        .should('have.length', 3);

      // Ohne vollstaendige Auswahl ist "Melden" gesperrt
      cy.get('button.confirm-button').should('be.disabled');

      // Menue 1: ersten Schuetzen waehlen -> in Menue 2 muss er gesperrt sein
      cy.get('select.shooter-menu').eq(0)
        .find('option:not([disabled])')
        .first()
        .invoke('text')
        .then((schuetze1Text) => {
          waehleErstenFreienSchuetzen(0);
          cy.get('select.shooter-menu').eq(1)
            .contains('option', schuetze1Text.trim())
            .should('be.disabled');
        });

      // Restliche Menues befuellen
      waehleErstenFreienSchuetzen(1);
      waehleErstenFreienSchuetzen(2);

      // Melden -> Sicherheitsabfrage: erst abbrechen, dann bestaetigen
      cy.get('button.confirm-button').should('not.be.disabled').click();
      cy.get('.confirm-box').should('be.visible');
      cy.get('button.confirm-no').click();
      cy.get('.confirm-box').should('not.exist');

      cy.intercept('POST', '**/tablet-schusszettel*').as('meldung');
      cy.get('button.confirm-button').click();
      cy.get('button.confirm-yes').click();
      cy.wait('@meldung').its('response.statusCode').should('be.within', 200, 299);

      // Nach der Meldung laedt das Tablet neu -> Status SATZEINGABE
      cy.get('button.weiter-button', { timeout: 20000 }).should('be.visible');

      geheZuTabletSetup().then((neueSessions) => {
        const aktualisiert = neueSessions.find((s) => s.teamId === session.teamId);
        expect(aktualisiert.status, 'Session nach Meldung').to.eq('SATZEINGABE');
      });
    });
  });
});
