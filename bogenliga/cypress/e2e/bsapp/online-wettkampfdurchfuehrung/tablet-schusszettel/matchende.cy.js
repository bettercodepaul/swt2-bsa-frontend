import {
  fuehrePasseDurch,
  geheZuTabletSetup,
  loginAlsAdmin,
  registriereTeam,
  resetDemoWettkampf,
  sqlAbfrage,
  tabletUrl,
} from '../../../../support/tabletNavigation';

/**
 * Komplettes Match ueber die digitale Treffer-Eingabe:
 * Team A gewinnt drei Saetze in Folge (6:0 Satzpunkte) -> MATCH_ENDE,
 * danach schaltet "Weiter" beide Teams ins naechste Match (SCHUETZENMELDUNG).
 */
describe('Tablet - Matchende nach drei gewonnenen Saetzen', () => {
  const SIEGER_PASSE = [[10, 10], [10, 10], [10, 10]];
  const VERLIERER_PASSE = [[5, 5], [5, 5], [5, 5]];

  let teamA;
  let teamB;

  before(() => {
    resetDemoWettkampf();
    loginAlsAdmin();

    geheZuTabletSetup().then((sessions) => {
      teamA = sessions.find((s) => s.naechsterGegnerName);
      expect(teamA, 'Session mit Gegner vorhanden').to.exist;
      teamB = sessions.find((s) => s.teamName === teamA.naechsterGegnerName);
      expect(teamB, 'Gegner-Session vorhanden').to.exist;

      registriereTeam(teamA);
      registriereTeam(teamB);
    });
  });

  it('beendet das Match nach 6:0 Satzpunkten und startet das naechste Match', () => {
    // Drei Saetze: A immer staerker als B
    [1, 2, 3].forEach((satzNr) => {
      cy.log(`--- Satz ${satzNr}: Team A ---`);
      cy.then(() => fuehrePasseDurch(teamA, SIEGER_PASSE));
      cy.get('.warte-container', { timeout: 20000 }).should('be.visible');

      cy.log(`--- Satz ${satzNr}: Team B ---`);
      cy.then(() => fuehrePasseDurch(teamB, VERLIERER_PASSE));
    });

    // Nach Satz 3 hat Team A 6 Satzpunkte. Team B (letzter Eintrag) steht
    // damit auf MATCH_ENDE - und weil im Status MATCH_ENDE jeder Abruf
    // automatisch weiterschaltet, landet B mit dem Reload nach dem POST
    // direkt in der Uebersicht des naechsten Matches (ohne Matchende-Maske).
    cy.get('.maske4-zustand', { timeout: 20000 }).should('be.visible');
    cy.get('.maske6-matchende').should('not.exist');

    // Admin-Sicht: Team B ist schon im naechsten Match; Team A wurde durch
    // die Gegner-Synchronisation von Bs letztem POST auf MATCH_ENDE gesetzt
    geheZuTabletSetup().then((sessions) => {
      const b = sessions.find((s) => s.teamId === teamB.teamId);
      expect(b.status, 'Team B nach Satz 3').to.eq('SCHUETZENMELDUNG');
      const a = sessions.find((s) => s.teamId === teamA.teamId);
      expect(a.status, 'Team A nach Satz 3').to.eq('MATCH_ENDE');
    });

    // Kernpruefung: Satz- und Matchpunkte sind in der match-Tabelle gespeichert
    // (Sieger 6 Satzpunkte / 2 Matchpunkte, Verlierer 0 / 0)
    cy.then(() => {
      sqlAbfrage(
        `SELECT match_mannschaft_id, match_satzpunkte, match_matchpunkte FROM match ` +
        `WHERE match_wettkampf_id=3001 AND match_nr=1 ` +
        `AND match_mannschaft_id IN (${teamA.teamId},${teamB.teamId});`
      ).then((stdout) => {
        expect(stdout, 'Satz-/Matchpunkte Sieger').to.include(`${teamA.teamId}|6|2`);
        expect(stdout, 'Satz-/Matchpunkte Verlierer').to.include(`${teamB.teamId}|0|0`);
      });
    });

    // Team A laedt neu: im Status MATCH_ENDE schaltet der Server beim
    // naechsten Abruf direkt ins naechste Match (Uebersicht, keine Maske 6)
    cy.then(() => cy.visit(tabletUrl(teamA)));
    cy.get('button.weiter-button', { timeout: 20000 }).should('be.visible');
    cy.get('.maske6-matchende').should('not.exist');

    // Beide Teams stehen jetzt im naechsten Match wieder in der Schuetzenmeldung
    geheZuTabletSetup().then((sessions) => {
      const a = sessions.find((s) => s.teamId === teamA.teamId);
      const b = sessions.find((s) => s.teamId === teamB.teamId);
      expect(a.status, 'Team A im naechsten Match').to.eq('SCHUETZENMELDUNG');
      expect(b.status, 'Team B im naechsten Match').to.eq('SCHUETZENMELDUNG');
    });
  });
});
