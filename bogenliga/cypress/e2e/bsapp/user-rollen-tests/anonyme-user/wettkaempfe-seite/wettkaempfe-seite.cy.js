// Test: Opens the sidebar, clicks on "WETTKAEMPFE" tab, and verifies URL change
it('Anzeige Wettkampf Ergebnisse', function() {
  cy.visit('http://localhost:4200/');
  cy.get('[data-cy=sidebar-wettkampf-button]').click();
  cy.url().should('include', '#/wettkaempfe');
});

// Test: Selects Sportjahr, Liga, and Mannschaft and verifies functionality
it('Auswahl Sportjahr Liga und Mannschaft', function() {
  cy.wait(8000);
  cy.get('div > #regionenForm > .row > .col-sm-8 > #jahr').select('2016');
  cy.wait(5000);
  cy.get('div > #regionenForm > .row > .col-sm-8 > #jahr').select('2018');
  cy.wait(5000);
  cy.get('#regionenForm > #selectVereink > .row > .col-sm-8 > #veranstaltungen').select('4: Object');
  cy.wait(5000);
  cy.get('#regionenForm > #selectVerein > .row > .col-sm-8 > #vereine').select('17: Object');
});

// Test: Displays Gesamtstatistik results in Wettkaempfe
it('Gesamtstatistik anzeigen', function() {
  cy.wait(3000);
  cy.get('#regionenForm > #selectStatistik > .row > .col-sm-8 > #statistiken')
    .select('gesamtstatistik');
  cy.wait(5000);
  // TODO: Add check to verify that data is present
});

// Test: Displays Matchstatistik of Schützen in Wettkaempfe
it('Matchstatistik anzeigen', function() {
  cy.get('#regionenForm > #selectStatistik > .row > .col-sm-8 > #statistiken')
    .select('schuetzenstatistikMatch');
  cy.wait(500);
});

// Test: Displays Einzelstatistik of Schützen in Wettkaempfe
it('Einzelstatistik anzeigen', function() {
  cy.get('#regionenForm > #selectStatistik > .row > .col-sm-8 > #statistiken')
    .select('einzelstatistik', { force: true });
  cy.wait(1500);
});

// Test: Displays statistics for a Schütze over the last five years
it('Statistik eines Schützen über die letzten fünf Jahre', function() {
  cy.get('#regionenForm > #selectStatistik > .row > .col-sm-8 > #statistiken')
    .select('letztejahre', { force: true });
  cy.wait(1500);
});

// Test: Displays the Mannschaftstabellenverlauf over a Veranstaltung
it('Mannschafttabellenverlauf', function() {
  cy.get('#regionenForm > #selectMannschaftStatistik > .row > .col-sm-8 > #mannschaftsStatistiken')
    .select('tabellenverlauf_statistik_wettkampftage', { force: true });
  cy.wait(1500);
});

// Test: Displays the current Mannschaften
it('Aktuelle Mannschaften anzeigen', function() {
  cy.get('#regionenForm > #selectMannschaftStatistik > .row > .col-sm-8 > #mannschaftsStatistiken')
    .select('aktuelle_mannschaft', { force: true });
  cy.wait(1500);
});
