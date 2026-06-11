import {
  geheZuTabletSetup,
  loginAlsAdmin,
  resetDemoWettkampf,
} from '../../../../support/tabletNavigation';

/**
 * Prueft das Zuruecksetzen des Tablet-Tokens ueber den Papierkorb-Button.
 * Laut Backend-Vertrag wird dabei nur der Token erneuert,
 * der Status der Session bleibt erhalten.
 */
describe('Admin - Token-Reset', () => {
  before(() => {
    resetDemoWettkampf();
    loginAlsAdmin();
  });

  it('setzt den Token zurueck und behaelt den Status bei', () => {
    geheZuTabletSetup().then((sessions) => {
      const session = sessions[0];

      // Erfolgsmeldung kommt als window.alert - Inhalt pruefen
      const alerts = [];
      cy.on('window:alert', (text) => alerts.push(text));

      cy.contains('.session-table tbody td', session.teamName)
        .parents('tr')
        .within(() => {
          // Token-Spalte (Index 2) merken und Reset-Button (zweiter Button) klicken
          cy.get('td').eq(2).invoke('text').as('alterToken');
          cy.get('button').eq(1).click();
        });

      // Tabelle laedt neu: Token muss sich geaendert haben, Status nicht
      cy.get('@alterToken').then((alterToken) => {
        cy.contains('.session-table tbody td', session.teamName)
          .parents('tr')
          .find('td')
          .eq(2)
          .should(($td) => {
            const neuerToken = $td.text().trim();
            expect(neuerToken, 'Neuer Token gesetzt').to.not.be.empty;
            expect(neuerToken).to.not.equal(alterToken.trim());
          });
      });

      cy.contains('.session-table tbody td', session.teamName)
        .parents('tr')
        .find('td')
        .eq(1)
        .should('contain.text', session.status);

      cy.then(() => {
        expect(alerts.join(' '), 'Erfolgs-Alert angezeigt').to.include('zurückgesetzt');
      });
    });
  });
});
