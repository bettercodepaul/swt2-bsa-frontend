import { loginAlsAdmin } from '../../../support/tabletNavigation';

/**
 * Regressionstest fuer Ticket swt2#2111:
 * Der "Zurueck"-Button am unteren Ende der Match-Ansicht der
 * Wettkampfdurchfuehrung muss zurueck zur Veranstaltungsauswahl fuehren.
 *
 * Hintergrund des Bugs: Die Match-Ansicht (zweite Ansicht) wird nur durch das
 * Umschalten zweier divs eingeblendet (div1Visible/div2Visible) - es gibt kein
 * Routing und damit keinen Browser-History-Eintrag. goBack() rief frueher
 * window.history.back() auf und tat damit nichts bzw. verliess die App.
 * Der Fix blendet stattdessen die Veranstaltungsauswahl wieder ein.
 *
 * Testdaten: LOCAL-Migration V42 ("Demo Wettkampfdurchfuehrung"),
 * Veranstaltung 3000 / Wettkampf 3001. Die Match-Ansicht ist direkt per
 * Deep-Link erreichbar: /#/wkdurchfuehrung/<veranstaltungId>/<wettkampfId>
 * (genau diese URL oeffnet die App sonst per "neue Ansicht" in einem neuen Tab).
 */
const VERANSTALTUNG_ID = 3000;
const WETTKAMPF_ID = 3001;

describe('WKDURCHFUEHRUNG - Zurueck-Button der Match-Ansicht', () => {
  before(() => {
    loginAlsAdmin();
  });

  it('kehrt aus der Match-Ansicht zur Veranstaltungsauswahl zurueck', () => {
    // Deep-Link oeffnet direkt die Match-Ansicht (zweite Ansicht)
    cy.visit(`/#/wkdurchfuehrung/${VERANSTALTUNG_ID}/${WETTKAMPF_ID}`);

    // Ausgangszustand: Match-Ansicht (div2) sichtbar inkl. Zurueck-Button,
    // Veranstaltungsauswahl (div1) ausgeblendet.
    cy.get('[data-cy=wkdurchfuehrung-match-ansicht]', { timeout: 20000 })
      .should('be.visible');
    cy.get('[data-cy=wkdurchfuehrung-zurueck-button]')
      .should('be.visible');
    cy.get('[data-cy=wkdurchfuehrung-veranstaltung-ansicht]')
      .should('not.be.visible');

    // Aktion: auf "Zurueck" klicken. Der Klick muss den inneren <button> der
    // bla-actionbutton-Komponente treffen (dort haengt der (click)-Handler).
    cy.get('[data-cy=wkdurchfuehrung-zurueck-button] button').click();

    // Erwartung (Fix): Veranstaltungsauswahl (div1) wieder sichtbar,
    // Match-Ansicht (div2) ausgeblendet.
    // Vor dem Fix (window.history.back()) passierte hier nichts -> der Test
    // schlaegt dann an dieser Stelle fehl.
    cy.get('[data-cy=wkdurchfuehrung-veranstaltung-ansicht]')
      .should('be.visible');
    cy.get('[data-cy=wkdurchfuehrung-match-ansicht]')
      .should('not.be.visible');
  });
});
