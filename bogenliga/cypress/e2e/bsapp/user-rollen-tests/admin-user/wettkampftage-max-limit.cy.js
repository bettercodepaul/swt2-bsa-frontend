/**
 * BSAPP-2185 — "Wettkampftag hinzufügen" bei erreichter Maximalanzahl
 *
 * Analyse-Ergebnis: Das Fehlen der "Neu"-Funktion liegt NICHT an der Veranstaltungs-Phase,
 * sondern am Limit `MaxWettkampfTage` (configuration id 8, Default 4). Ist die maximale Anzahl
 * an Wettkampftagen erreicht, wurde "Neu" bisher nur beim Klick per Fehlermeldung abgewiesen
 * (wirkt wie ein Bug/inkonsistent).
 *
 * Fix: "Neu"/"Kopieren" werden bei erreichtem Limit deaktiviert und ein Hinweis wird angezeigt.
 *
 * Testdaten (LOCAL-DB, MaxWettkampfTage=4):
 *  - Veranstaltung 0 ("Würtembergliga"): 5 Wettkampftage -> Limit erreicht (Hinweis + "Neu" disabled)
 *  - Veranstaltung 1102 (1 Wettkampftag): unter dem Limit ("Neu" aktiv, kein Hinweis)
 *
 * Der Limit-Check ist benutzerunabhängig; als Admin ist jede Veranstaltung erreichbar.
 */

const VERANSTALTUNG_AT_LIMIT = 0;
const VERANSTALTUNG_UNDER_LIMIT = 1102;

function openWettkampftage(id) {
  cy.visit(`http://localhost:4200/#/verwaltung/veranstaltung/${id}/${id}`);
  // cy.visit erkennt einen reinen Hash-Wechsel (gleiche URL vor '#') NICHT als Reload -> Angular
  // würde die Wettkampftage-Komponente wiederverwenden (Zustands-Übernahme zwischen Tests).
  // cy.reload() erzwingt einen echten vollständigen Reload mit frischer Komponente.
  cy.reload();
  cy.get('bla-wettkampftage', {timeout: 20000}).should('exist');
  cy.get('[data-cy=wettkampftage-datum]', {timeout: 20000}).invoke('val').should('match', /^\d{4}-\d{2}-\d{2}$/);
}

describe('BSAPP-2185: Wettkampftage-Limit blendet "Neu"/"Kopieren" konsistent aus', () => {

  before(() => {
    cy.loginAdmin();
    cy.url({timeout: 20000}).should('include', '/home');
    cy.wait(1500);
  });

  it('positiv: bei erreichtem Limit ist "Neu" deaktiviert und der Hinweis wird angezeigt', () => {
    openWettkampftage(VERANSTALTUNG_AT_LIMIT);

    // Hinweis erscheint, sobald anzahl >= Max geladen ist.
    cy.get('[data-cy=wettkampftage-max-hint]', {timeout: 20000}).should('be.visible');
    // "Neu" und "Kopieren" sind deaktiviert.
    cy.contains('bla-actionbutton', 'Neu').find('button').should('be.disabled');
    cy.contains('bla-actionbutton', 'Kopieren').find('button').should('be.disabled');
  });

  it('negativ: unter dem Limit ist "Neu" aktiv und es erscheint kein Hinweis', () => {
    openWettkampftage(VERANSTALTUNG_UNDER_LIMIT);
    cy.wait(3000); // Daten laden lassen

    // Unter dem Limit: kein Hinweis, "Neu" ist aktiv.
    cy.get('[data-cy=wettkampftage-max-hint]').should('not.exist');
    cy.contains('bla-actionbutton', 'Neu').find('button', {timeout: 20000}).should('not.be.disabled');
  });
});
