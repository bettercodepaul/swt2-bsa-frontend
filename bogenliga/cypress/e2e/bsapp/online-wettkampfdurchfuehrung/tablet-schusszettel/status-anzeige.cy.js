import {
  geheZuTabletSetup,
  loginAlsAdmin,
  registriereTeam,
  resetDemoWettkampf,
} from '../../../../support/tabletNavigation';

/**
 * Prueft, dass die Status-Spalte der Sitzungstabelle exakt das anzeigt,
 * was das Backend liefert - auch nach einem Statuswechsel.
 */
describe('Admin - Statusanzeige der Tablet-Sessions', () => {
  before(() => {
    resetDemoWettkampf();
    loginAlsAdmin();
  });

  it('zeigt fuer jede Zeile den Status aus dem Backend an', () => {
    geheZuTabletSetup().then((sessions) => {
      sessions.forEach(({ teamName, status }) => {
        cy.contains('.session-table tbody td', teamName)
          .parents('tr')
          .find('td')
          .eq(1)
          .invoke('text')
          .then((domStatus) => {
            expect(domStatus.trim(), `Status von ${teamName}`).to.equal(status);
          });
      });
    });
  });

  it('zeigt einen Statuswechsel nach der Schuetzenmeldung an', () => {
    geheZuTabletSetup().then((sessions) => {
      const session = sessions.find((s) => s.status === 'SCHUETZENMELDUNG');
      expect(session, 'Eine SCHUETZENMELDUNG-Session vorhanden').to.exist;

      registriereTeam(session);

      // Zurueck zur Admin-Seite: Status muss jetzt SATZEINGABE sein
      geheZuTabletSetup().then((neueSessions) => {
        const aktualisiert = neueSessions.find((s) => s.teamId === session.teamId);
        expect(aktualisiert.status).to.eq('SATZEINGABE');
      });

      cy.contains('.session-table tbody td', session.teamName)
        .parents('tr')
        .find('td')
        .eq(1)
        .should('contain.text', 'SATZEINGABE');
    });
  });
});
