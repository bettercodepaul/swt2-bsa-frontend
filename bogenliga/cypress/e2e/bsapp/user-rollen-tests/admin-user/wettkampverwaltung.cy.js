/**
 * This test tries to log in as an administrator and checks if the website has redirected successfully after logging in
 * schon in neuer Struktur
 */
it('Login erfolgreich', function() {
  cy.loginAdmin()
  cy.url().should('include', '#/home');
});

/**
 * This test shows the "Wettkampfklassen" tab in administration
 */
it('Anzeige Wettkampfklassen', function () {
  cy.get('[data-cy=sidebar-verwaltung-button]').click()
  cy.get('[data-cy=verwaltung-klassen-button]').click()
  cy.url().should('include', '#/verwaltung/klassen')
})

/**
 * This test edits a "Wettkampfklasse"
 */
it('Wettkampfklasse bearbeiten', function () {
  cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').first().click()
  cy.get('[data-cy=wettkampfklassen-jahrgang-bis-button]').type('1973')
  cy.get('[data-cy=wettkampfklassen-update-button]').click()
  cy.get('#OKBtn1').click()
  cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').first().click()
  cy.get('[data-cy=wettkampfklassen-jahrgang-bis-button]').type('1972')
  cy.get('[data-cy=wettkampfklassen-update-button]').click()
  cy.get('#OKBtn1').click()
})

/**
 * This test adds a new "Wettkampfklasse"
 * Robustness is only ever guaranteed if this test is run regularly in the CI/CD pipeline
 */
it('Wettkampfklasse hinzufügen', function () {
  cy.get('body').then((body) => {
    if (!body.text().includes('Testfall')) {
      cy.get('button.action-btn-success').click()
      cy.get('[data-cy=wettkampfklasse-nummer]').type('69')
      cy.get('[data-cy=wettkampfklasse-name]').type('Testfall')
      cy.get('[data-cy=wettkampfklassen-jahrgang-von-button]').type('2000')
      cy.get('[data-cy=wettkampfklassen-jahrgang-bis-button]').type('1980')
      cy.get('[data-cy=wettkampfklassen-save-button]').click()
      cy.get('#OKBtn1').click()
    }
  });
})

/**
 * This test checks if the Event-table gets filled.
 */

it('Veranstaltungen Anzeigen', function() {
  cy.get('[data-cy=sidebar-verwaltung-button]').click()
  cy.get('[data-cy=verwaltung-veranstaltung-button]').click()
  cy.wait(5000)
  cy.get('[data-cy=bla-selection-list]').select('2018')
  cy.wait(5000)
  cy.get('tbody').should('have.length.at.least', 1)
})
/**
 * This test adds a "Veranstaltung" and checks if it gets added
 * Robustness is only ever guaranteed if this test is run regularly in the CI/CD pipeline
 */

it('Veranstaltungen hinzufügen', function() {
  cy.get('body').then((body) => {
    if (!body.text().includes('Testveranstaltung')) {
      cy.get('[data-cy=sidebar-verwaltung-button]').click()
      cy.get('[data-cy=verwaltung-veranstaltung-button]').click()
      cy.wait(1000)
      cy.get('[data-cy=veranstaltung-add-button]').click()
      cy.get('[data-cy=veranstaltung-detail-name]').type('Testveranstaltung')
      cy.wait(10000)
      cy.get('[data-cy=veranstaltung-detail-liganame]').select('Bundesliga')
      cy.get('[data-cy=veranstaltung-detail-sportjahr]').type('2030')
      cy.get('[data-cy=veranstaltung-detail-deadline]').type('2030-01-01')
      cy.wait(1000)
      cy.get('[data-cy=veranstaltung-detail-save-button]').click()
      cy.wait(3000)
      cy.get('#OKBtn1').click()
      cy.get('[data-cy=sidebar-verwaltung-button]').click()
      cy.get('[data-cy=verwaltung-veranstaltung-button]').click()
      cy.wait(5000)
      cy.get('[data-cy=bla-selection-list]').select('2030')
      cy.wait(1000)
      cy.get('tbody').should('contain.text', 'Testveranstaltung')
    }
  });
})
/**
 * This test edits a "Veranstaltung" and checks if it was changed
 */

it('Veranstaltungen bearbeiten', function() {

  //cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').last().click()
  cy.visit('http://localhost:4200/#/verwaltung/veranstaltung');
  cy.wait(1000)
  cy.get('.overview-dialog-header').click();
  cy.wait(1000)
  cy.get('[data-cy=bla-selection-list]').type('0: 1200');
  cy.wait(1000)
  cy.get('option:nth-child(1)').click();
  cy.wait(1000)
  cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').last().click()
  cy.wait(1000)
  cy.get('[data-cy=veranstaltung-detail-name]').click();
  cy.wait(1000)
  cy.get('[data-cy=veranstaltung-detail-name]').type('TTT');
  cy.wait(1000)
  cy.get('[data-cy=veranstaltung-detail-ligaleiter-email]').type('1: Object');
  cy.wait(1000)
  cy.get('.dialog-content > div').click();
  cy.wait(1000)
  cy.get('#veranstaltungUpdateButton').click();
  cy.wait(1000)
  cy.get('#OKBtn1 > #OKBtn1').click();
  cy.wait(1000)
  cy.get('[data-cy=bla-selection-list]').select('2030')
  cy.wait(1000)

  cy.get('tbody').should('contain.text', 'TestveranstaltungTTT')

})
/**
 * This test checks all functions of the queue
 */

/**it('Filtert Teams basierend auf Suchbegriff', () => {
  cy.get('[data-cy=bla-selection-list]').select('2030')
  cy.wait(1000)
  cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').last().click()
  cy.wait(1000)

  cy.get('.quicksearch-container > .custom-quicksearch > .quicksearch > .input-group > #undefined').click()

  cy.get('.quicksearch-container > .custom-quicksearch > .quicksearch > .input-group > #undefined').type('69')
  cy.wait(5000)
  cy.get('tbody > tr > td > bla-actionbutton > #undefined').click()
  cy.wait(5000)
  cy.get('.modal-dialog > .modal-content > .modal-footer > #OKBtn1 > #OKBtn1').click()
  cy.wait(5000)
  cy.get('#undefined > tbody > #payload-id-1217 > #name-1217 > span').click() */

  /*// Überprüfen, ob die Tabelle sichtbar ist
  cy.get('h2').contains('Mannschaften ohne Veranstaltung').should('be.visible');

  // Eingabe eines Suchbegriffs und Auslösen der Suche
  const searchTerm = '69';
  cy.get('.custom-quicksearch input').type(searchTerm).should('have.value', searchTerm);

  // Warten auf die API-Antwort nach der Suche
  cy.wait(1000);

  // Überprüfen, ob die Tabelle der Teams aktualisiert wurde
  cy.get('tbody tr').should('have.length.greaterThan', 0); // Stellt sicher, dass mindestens ein Ergebnis angezeigt wird

  // Optional: Überprüfen, ob die angezeigten Ergebnisse den Suchkriterien entsprechen
  cy.get('tbody tr').each(($row) => {
    cy.wrap($row).find('td').eq(0).should('contain', searchTerm); // Überprüft, ob der Teamname im ersten <td> enthalten ist
  });
});*/
//})
/**
 * This test creates an Platzhalter for the Veranstaltung
 */

it('Platzhalter erstellen', function() {
  cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').last().click()
  cy.get('[data-cy=veranstaltung-detail-create-platzhalter]').click()
  cy.wait(9000)
  cy.get('#OKBtn1').click()
  cy.get('tbody').should('contain.text', 'Platzhalter')
  cy.get('[data-cy=sidebar-verwaltung-button]').click()
  cy.get('[data-cy=verwaltung-veranstaltung-button]').click()
  cy.wait(5000)
  cy.get('[data-cy=bla-selection-list]').select('2030')
})

/**
 * This test deletes a "Veranstaltung" and checks if it was deleted in the table.
 */

it('Veranstaltung Löschen', function() {
  cy.get('tbody').should('contain.text', 'TestveranstaltungTTT')
  cy.get('[data-cy="TABLE.ACTIONS.DELETE"]').last().click()
  cy.get('    .modal-dialog > .modal-content > .modal-footer > bla-actionbutton:nth-child(2) > #undefined').click()
  cy.wait(1000)
  cy.get('tbody').should('not.contain.text', 'TestveranstaltungTTT')
})

/**
 * This test checks if "Wettkampftage" has entries.
 */

it('Wettkampftage anzeigen', function() {
  cy.get('[data-cy=bla-selection-list]').select('2018')
  cy.wait(11000)
  cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').first().click()
  cy.wait(5000)
  cy.get('[data-cy="wettkampftage-button"]').click()
  cy.wait(1000)
  cy.get('bla-col-layout > .col-layout > table > bla-selectionlist > #undefined').select(0)
})

/**
 * This test edits a "Wettkampftag" and checks if it was changed.
 */

it('Wettkampftage bearbeiten', function() {
  cy.get('[data-cy="wettkampftage-adresse"]').clear().type('Bahnhofstrasse 221')
  cy.get('#wettkampftagePLZ').clear().type('70197')
  cy.get('#wettkampftageOrt').clear().type('Stuttgart')
  cy.get('[data-cy="wettkampftage-update-button"]').click()
  cy.wait(1000)
  cy.get('#OKBtn1').click()
  cy.wait(1000)
  cy.get('[data-cy="wettkampftage-zurueck"]').click()
  cy.get('[data-cy="wettkampftage-button"]').click()
  cy.wait(2000)
  cy.get('[data-cy="wettkampftage-adresse"]').should('have.value', 'Bahnhofstrasse 221')
  cy.get('[data-cy="wettkampftage-update-button"]').click()
  cy.wait(500)
  cy.get('#OKBtn1').click()
  cy.get('[data-cy="wettkampftage-zurueck"]').click()
  cy.get('[data-cy="wettkampftage-button"]').click()
  cy.wait(1000)
  cy.get('[data-cy="wettkampftage-adresse"]').type('{selectall}{backspace}')
  cy.get('[data-cy="wettkampftage-adresse"]').type('Bahnhofstrasse 22')
  cy.get('#wettkampftageBeginn').click();
  cy.get('#wettkampftageBeginn').type('15:24');
  cy.get('#wettkampftagSaveButton').click();
  cy.get('#OKBtn1 > .action-btn-circle').click();
  cy.get('[data-cy="wettkampftage-update-button"]').click()
  cy.wait(500)
  cy.get('#OKBtn1').click()
  cy.get('[data-cy="wettkampftage-zurueck"]').click()
  cy.get('[data-cy="wettkampftage-button"]').click()
  cy.wait(2000)
  cy.get('[data-cy="wettkampftage-adresse"]').should('have.value', 'Bahnhofstrasse 22')
})
