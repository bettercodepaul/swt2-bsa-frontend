/**
 * This test opens the sidebar and clicks on the "WETTKAEMPFE" tab and checks if the url has changed successfully
 */
it('Anzeige Wettkampf Ergebnisse', function() {
  cy.visit('http://localhost:4200/')
  cy.get('[data-cy=sidebar-wettkampf-button]').click()
  cy.url().should('include', '#/wettkaempfe')
})

/**
 * This test checks if the selection of Sportjahr Liga and Mannschaft works
 */
it('Auswahl Sportjahr, Liga und Mannschaft', function () {
  cy.wait(8000);

  // Jahr auswählen
  cy.get('#jahr').select('2016');  // Direkt auswählen ohne .click()
  cy.wait(5000);
  cy.get('#jahr').select('2018');

  // Veranstaltung auswählen
  cy.wait(5000);
  cy.get('#veranstaltungen').select('4: Object');

  // Verein auswählen
  cy.wait(5000);
  cy.get('#vereine').select('17: Object');
});


/**
 * This test checks if the gesamtstatistik in Wettkaempfe show results
 */
it('Gesamtstatistik anzeigen', function() {
  cy.wait(3000)
  cy.get('#regionenForm > #selectStatistik > .row > .col-sm-8 > #statistiken').select('gesamtstatistik')
  cy.wait(5000)
  // required: add check if data is present in selected statistik
})
/**
 * This test checks if the Matchstatistik of Schuetzen in Wettkaempfe shows results
 */
it('Matchstatistik anzeigen', function() {
  cy.get('#regionenForm > #selectStatistik > .row > .col-sm-8 > #statistiken').select('schuetzenstatistikMatch')
  cy.wait(500)
})
/**
 * This test checks if the Wettkampftagestatistik of Schuetzen in Wettkaempfe shows results
 */
it('Wettkampftagestatistik anzeigen', function() {
  cy.get('#regionenForm > #selectStatistik > .row > .col-sm-8 > #statistiken').select('schuetzenstatistikWettkampftage', {force: true})
  cy.wait(1500)
})

/**
 * This test checks if the Einzelstatistik of Schuetzen in Wettkaempfe shows results
 */
it('Einzelstatistik anzeigen', function() {
  cy.get('#regionenForm > #selectStatistik > .row > .col-sm-8 > #statistiken').select('einzelstatistik', {force: true})
  cy.wait(1500)
})
/**
 * This test checks if the Einzelstatistik of Schuetzen in Wettkaempfe shows results
 */
it('Statistik eines Schützen über die letzten fünf Jahre', function() {
  cy.get('#regionenForm > #selectStatistik > .row > .col-sm-8 > #statistiken').select('letztejahre', {force: true})
  cy.wait(1500)
})
/**
 * This test checks if you can filter for a Competition-Day in Wettkampfergebnisse
 */
it('Wettkampftagauswahl Wettkampfergebnisse', function() {
  cy.get('#regionenForm > #selectStatistik > .row > .col-sm-8 > #statistiken').select('einzelstatistik', {force: true})
  cy.wait(2000)
  cy.get('#regionenForm > #selectWettkampftag > .row > .col-sm-8 > #wettkampftage').select('1: Object')
})
/**
 * This test checks if the switch between Mannschaftsstatistik and Schptzenstatistik filter buttons works
 */
it('Wechsel zwischen Mannschafts- und Schützenstatistik', function() {
  cy.wait(5000)
  cy.get('div > #regionenForm > div > #showMannschaftsstatistik > .statistik-filter-button').click()
  cy.wait(1500)
})
/**
 * This test checks if the Aktuelle Mannschaften shows results
 */
it('Aktuelle Mannschaften anzeigen', function() {
  cy.get('#regionenForm > #selectMannschaftStatistik > .row > .col-sm-8 > #mannschaftsStatistiken').select('aktuelle_mannschaft', {force: true})
  cy.wait(1500)
})
/**
 * This test checks if the  Mannschaftentabellenverlauf over veranstaltung shows results
 */
it('Mannschafttabellenverlauf', function() {
  cy.get('#regionenForm > #selectMannschaftStatistik > .row > .col-sm-8 > #mannschaftsStatistiken').select('tabellenverlauf_statistik_wettkampftage', {force: true})
  cy.wait(1500)
})
/**
 * This test checks if the all Mannschaften shows results
 */
it('Alle Mannschaften anzeigen', function() {
  cy.get('#regionenForm > #selectMannschaftStatistik > .row > .col-sm-8 > #mannschaftsStatistiken').select('alle_mannschaften', {force: true})
  cy.wait(1500)
})
