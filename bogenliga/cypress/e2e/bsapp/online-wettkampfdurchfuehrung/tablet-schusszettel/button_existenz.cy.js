import {
  geheZuTabletSetupUeberMenu,
  loginAlsAdmin,
  resetDemoWettkampf,
} from '../../../../support/tabletNavigation';

/**
 * Prueft den kompletten Benutzer-Weg zum Tablet-Schusszettel-Setup:
 * Login -> Wettkampfdurchfuehrung -> Veranstaltung -> Wettkampftag
 * -> Druckdaten -> "Setup Tablet Schusszettel"-Button.
 */
describe('WKDURCHFUEHRUNG - Einstieg in den Tablet-Schusszettel', () => {
  before(() => {
    resetDemoWettkampf();
    loginAlsAdmin();
  });

  it('navigiert ueber den setupTabletSchusszettel-Button zur Setup-Seite', () => {
    geheZuTabletSetupUeberMenu();

    // Auf der Setup-Seite kommen die Sessions des Demo-Wettkampfs an
    cy.get('.session-table', { timeout: 20000 }).should('exist');
    cy.get('.session-table tbody tr').should('have.length', 8);
  });
});
