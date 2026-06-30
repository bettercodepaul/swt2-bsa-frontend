import {
  geheZuTabletSetup,
  loginAlsAdmin,
  resetDemoWettkampf,
  sqlAusfuehren,
  tabletUrl,
} from '../../../../support/tabletNavigation';

/**
 * Wettkampf-beendet-Maske (finaler Zustand WETTKAMPF_ENDE).
 * Ein komplettes Turnier (7 Matches) waere im E2E-Test zu lang,
 * deshalb wird der finale Status fuer ein Team direkt in der DB gesetzt.
 */
describe('Tablet - Wettkampf beendet', () => {
  let session;

  before(() => {
    resetDemoWettkampf();
    loginAlsAdmin();

    // Sessions anlegen lassen und ein Team in den Endzustand versetzen
    geheZuTabletSetup().then((sessions) => {
      session = sessions[0];
      sqlAusfuehren(
        `UPDATE schusszettel_tablet_session SET status='WETTKAMPF_ENDE' ` +
        `WHERE wettkampf_id=3001 AND team_id=${session.teamId};`
      );
    });
  });

  it('zeigt die Wettkampf-beendet-Maske an', () => {
    cy.then(() => {
      cy.visit(tabletUrl(session));
    });

    // Zustands-Uebersicht wegklicken
    cy.get('button.weiter-button', { timeout: 20000 }).click();

    // Finale Maske mit Abschluss-Hinweis
    cy.get('.wettkampfbeendet-container').should('be.visible');
    cy.get('.wettkampfbeendet-container h2')
      .should('contain.text', 'Der Wettkampftag ist beendet');
    cy.get('.wettkampfbeendet-container')
      .should('contain.text', 'keine weiteren Matches');

    // Admin-Tabelle zeigt den finalen Status
    geheZuTabletSetup().then((sessions) => {
      const aktualisiert = sessions.find((s) => s.teamId === session.teamId);
      expect(aktualisiert.status, 'Finaler Status').to.eq('WETTKAMPF_ENDE');
    });
  });
});
