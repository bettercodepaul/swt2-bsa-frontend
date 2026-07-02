/**
 * BSAPP-2103 — "Auswahl Liga wird zurückgesetzt"
 *
 * Wenn man aus den Wettkampfergebnissen zu einem Verein/einer Mannschaft navigiert,
 * darf der Liga-Kontext nicht verloren gehen. Die Sidebar-Einträge "Wettkampfergebnisse"
 * (sidebar-wettkampf-button) und "Ligatabelle" (sidebar-ligatabelle-button) werden nur
 * angezeigt, solange ein Liga-Kontext aktiv ist (requiresLigaContext). Gleiches gilt für
 * den Feedback-Klick im Footer, der vorher den ?liga=-QueryParam verworfen hat.
 *
 * Testdaten (LOCAL-DB): Liga-ID 2 ("Württembergliga Recurve"), Veranstaltung 0,
 * Mannschaft 101 / Verein 0. Der LigaResolver akzeptiert numerische Liga-IDs (findById).
 */

const LIGA_ID = 2;
const VEREIN_ID = 0;
const MANNSCHAFT_ID = 101;

describe('BSAPP-2103: Liga-Kontext bleibt bei Navigation erhalten', () => {

  beforeEach(() => {
    cy.loginAdmin();
    cy.url({timeout: 20000}).should('include', '/home');
  });

  it('positiv: Liga-Kontext (Sidebar-Einträge) bleibt nach Navigation zu einem Verein erhalten', () => {
    // Liga-Kontext aufbauen, indem die Wettkampfergebnisse mit liga-Param geöffnet werden.
    cy.visit(`http://localhost:4200/#/wettkaempfe?liga=${LIGA_ID}`);

    // Vorbedingung: mit aktivem Liga-Kontext sind beide Einträge vorhanden.
    cy.get('[data-cy=sidebar-wettkampf-button]', {timeout: 20000}).should('exist');
    cy.get('[data-cy=sidebar-ligatabelle-button]').should('exist');

    // Navigation zu einem Verein/einer Mannschaft OHNE liga-Param – genau so verlinken
    // die Wettkampfergebnisse (['/vereine', vereinId, mannschaftId]).
    cy.visit(`http://localhost:4200/#/vereine/${VEREIN_ID}/${MANNSCHAFT_ID}`);

    // POSITIV: Der LigaStickyGuard hängt den gemerkten liga-Param wieder an,
    // sodass der Kontext (und damit die Sidebar-Einträge) erhalten bleibt.
    cy.url({timeout: 20000}).should('include', 'liga=');
    cy.get('[data-cy=sidebar-wettkampf-button]').should('exist');
    cy.get('[data-cy=sidebar-ligatabelle-button]').should('exist');
  });

  it('positiv: Liga-Kontext bleibt auch auf der reinen Verein-Route (/vereine/:id) erhalten', () => {
    // Antwort auf Review-Frage: Die Route ':id' (VereinComponent) hat KEINEN LigaResolver und
    // damit auch keinen Guard. Sie kann den Kontext gar nicht leeren; die Sidebar-Einträge
    // bleiben über den gemerkten Kontext (remembered) erhalten – ohne dass ein Guard nötig ist.
    cy.visit(`http://localhost:4200/#/wettkaempfe?liga=${LIGA_ID}`);
    cy.get('[data-cy=sidebar-wettkampf-button]', {timeout: 20000}).should('exist');

    // Reine Verein-Route OHNE mannschaftId und OHNE liga-Param.
    cy.visit(`http://localhost:4200/#/vereine/${VEREIN_ID}`);

    // POSITIV: Sidebar-Einträge bleiben erhalten (Kontext nicht verloren).
    cy.get('[data-cy=sidebar-wettkampf-button]', {timeout: 20000}).should('exist');
    cy.get('[data-cy=sidebar-ligatabelle-button]').should('exist');
  });

  it('negativ: ohne Liga-Kontext erscheinen die liga-abhängigen Sidebar-Einträge nicht', () => {
    // Home ohne liga-Param leert den Liga-Kontext bewusst (echte Startseite).
    cy.visit('http://localhost:4200/#/home');

    // NEGATIV: ohne aktiven Liga-Kontext sind die Einträge nicht im DOM –
    // beweist, dass die Einträge tatsächlich liga-gated sind (Positivtest ist aussagekräftig).
    cy.get('[data-cy=sidebar-home-button]', {timeout: 20000}).should('exist');
    cy.get('[data-cy=sidebar-wettkampf-button]').should('not.exist');
    cy.get('[data-cy=sidebar-ligatabelle-button]').should('not.exist');
  });

  it('positiv: Klick auf "Feedback" im Footer verwirft den Liga-Kontext nicht', () => {
    cy.visit(`http://localhost:4200/#/wettkaempfe?liga=${LIGA_ID}`);
    cy.get('[data-cy=sidebar-wettkampf-button]', {timeout: 20000}).should('exist');

    // Feedback öffnen – darf NICHT auf "#" navigieren und damit den liga-Param verwerfen.
    cy.get('[data-cy=footer-feedback-link]').click();

    // POSITIV: Popup ist offen, URL behält den liga-Param, Sidebar-Einträge bleiben.
    cy.url().should('include', `liga=${LIGA_ID}`);
    cy.get('[data-cy=sidebar-wettkampf-button]').should('exist');
    cy.get('[data-cy=sidebar-ligatabelle-button]').should('exist');
  });
});
