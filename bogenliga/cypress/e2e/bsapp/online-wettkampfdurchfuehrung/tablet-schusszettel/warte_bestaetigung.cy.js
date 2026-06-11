import {
  fuehrePasseDurch,
  geheZuTabletSetup,
  loginAlsAdmin,
  registriereTeam,
  resetDemoWettkampf,
  tabletUrl,
} from '../../../../support/tabletNavigation';

/**
 * Warte-Maske (Maske 3):
 * Nach der eigenen Satzeingabe wartet ein Team auf den Gegner.
 * Der Refresh-Button fragt den Status neu ab; sobald der Gegner
 * seine Passe eingegeben hat, geht es in die naechste Satzeingabe.
 */
describe('Tablet - Warten auf den Gegner', () => {
  let teamA;
  let teamB;

  before(() => {
    resetDemoWettkampf();
    loginAlsAdmin();

    // Eine Begegnung herauspicken: Team A und seinen Gegner Team B
    geheZuTabletSetup().then((sessions) => {
      teamA = sessions.find((s) => s.naechsterGegnerName);
      expect(teamA, 'Session mit Gegner vorhanden').to.exist;
      teamB = sessions.find((s) => s.teamName === teamA.naechsterGegnerName);
      expect(teamB, `Gegner-Session "${teamA.naechsterGegnerName}" vorhanden`).to.exist;

      // Beide Teams melden ihre Schuetzen -> beide in SATZEINGABE
      registriereTeam(teamA);
      registriereTeam(teamB);
    });
  });

  it('zeigt nach der Satzeingabe die Warte-Maske mit Refresh-Button', () => {
    cy.then(() => {
      // Team A gibt Passe 1 ein, Team B noch nicht -> A wartet
      fuehrePasseDurch(teamA, [[10, 9], [9, 9], [10, 8]]);
    });

    cy.get('.warte-container', { timeout: 20000 }).should('be.visible');
    cy.get('.warte-container').should('contain.text', 'Satzeingabe erhalten');

    // Refresh-Button: Gegner ist noch nicht fertig -> es bleibt bei WARTE
    cy.intercept('GET', '**/tablet-schusszettel*').as('refresh');
    cy.get('button.refresh-button')
      .should('be.visible')
      .and('contain.text', 'Nochmal nachfragen')
      .click();
    cy.wait('@refresh');
    cy.get('.warte-container').should('be.visible');
  });

  it('geht nach der Gegner-Eingabe weiter zur naechsten Passe', () => {
    cy.then(() => {
      // Team B zieht nach: meldet ist schon erledigt, gibt Passe 1 ein
      fuehrePasseDurch(teamB, [[7, 8], [8, 8], [9, 7]]);
    });

    // Team B hat schwaecher geschossen und kommt direkt in Passe 2
    cy.get('button.weiter-button', { timeout: 20000 }).click();
    cy.get('.passe-info h2', { timeout: 20000 }).should('contain.text', 'Passe 2');

    // Team A laedt neu: der Server schaltet die Session beim naechsten
    // Abruf automatisch von WARTE auf SATZEINGABE (Passe 2) um
    cy.then(() => {
      cy.visit(tabletUrl(teamA));
    });
    cy.get('button.weiter-button', { timeout: 20000 }).click();
    cy.get('.passe-info h2', { timeout: 20000 }).should('contain.text', 'Passe 2');

    // Admin-Sicht: beide Teams wieder in SATZEINGABE
    geheZuTabletSetup().then((sessions) => {
      const a = sessions.find((s) => s.teamId === teamA.teamId);
      const b = sessions.find((s) => s.teamId === teamB.teamId);
      expect(a.status, 'Team A').to.eq('SATZEINGABE');
      expect(b.status, 'Team B').to.eq('SATZEINGABE');
    });
  });
});
