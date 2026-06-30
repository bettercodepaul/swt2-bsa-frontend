import {
  geheZuTabletSetup,
  loginAlsAdmin,
  oeffneTabletMitWeiter,
  registriereTeam,
  resetDemoWettkampf,
} from '../../../../support/tabletNavigation';

/**
 * Digitale Treffer-Eingabe (Maske 2):
 * Validierung der Schusswerte (0-10), Auto-Fokus-Sprung und das
 * Absenden einer kompletten Passe inklusive Statuswechsel nach WARTE.
 */
describe('Tablet - Satzeingabe', () => {
  let session;

  before(() => {
    resetDemoWettkampf();
    loginAlsAdmin();

    // Vorbedingung selbst herstellen: ein Team in den Status SATZEINGABE bringen
    geheZuTabletSetup().then((sessions) => {
      session = sessions.find((s) => s.status === 'SCHUETZENMELDUNG');
      expect(session, 'Frische SCHUETZENMELDUNG-Session vorhanden').to.exist;
      registriereTeam(session);
    });
  });

  it('validiert die Schusswerte und sendet die Passe ab', () => {
    cy.then(() => {
      oeffneTabletMitWeiter(session);

      // Treffer-Tabelle mit 3 Schuetzen und Passe-Anzeige
      cy.get('table.treffer-table tbody tr').should('have.length', 3);
      cy.get('.passe-info h2').should('contain.text', 'Passe 1');

      // Ungueltiger Wert > 10 -> Fehlermeldung, Bestaetigen gesperrt
      cy.get('#schuss1-0').type('11').blur();
      cy.get('table.treffer-table tbody tr').eq(0)
        .find('.error')
        .should('be.visible')
        .and('contain.text', '0–10');
      cy.get('button.confirm-button').should('be.disabled');

      // Ungueltiger Wert < 0 -> Fehlermeldung
      cy.get('#schuss2-0').type('-1').blur();
      cy.get('table.treffer-table tbody tr').eq(0)
        .find('.error')
        .should('have.length', 2);

      // Gueltige Werte -> Fehler verschwinden
      cy.get('#schuss1-0').clear().type('10').blur();
      cy.get('#schuss2-0').clear().type('9').blur();
      cy.get('table.treffer-table tbody tr').eq(0)
        .find('.error')
        .should('not.exist');

      // Auto-Fokus: nach gueltiger Eingabe springt der Fokus
      // (2 Sekunden Verzoegerung) ins naechste Feld
      cy.get('#schuss1-1').clear().type('8');
      cy.focused({ timeout: 6000 }).should('have.id', 'schuss2-1');

      // Restliche Felder fuellen
      cy.get('#schuss2-1').clear().type('9');
      cy.get('#schuss1-2').clear().type('7');
      cy.get('#schuss2-2').clear().type('8');

      // Passe absenden
      cy.intercept('POST', '**/tablet-schusszettel*').as('satz');
      cy.get('button.confirm-button').should('not.be.disabled').click();
      cy.wait('@satz').its('response.statusCode').should('be.within', 200, 299);

      // Gegner hat noch nichts eingegeben -> Team landet in der Warte-Maske
      cy.get('.warte-container', { timeout: 20000 }).should('be.visible');
      cy.get('.warte-container').should('contain.text', 'Satzeingabe erhalten');

      // Admin-Tabelle zeigt den Status WARTE
      geheZuTabletSetup().then((sessions) => {
        const aktualisiert = sessions.find((s) => s.teamId === session.teamId);
        expect(aktualisiert.status, 'Session nach Satzeingabe').to.eq('WARTE');
      });
    });
  });
});
