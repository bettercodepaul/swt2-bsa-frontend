/**
 * This test lists all "DSBMitglieder" items and checks if the URI has been updated accordingly
 */
it('Anzeige DSBMitglieder', function() {
  cy.wait(1000)
  cy.get('[data-cy=verwaltung-dsb-mitglieder-button]').click()
  cy.url().should('include', '#/verwaltung/dsbmitglieder')
});

/**
 * This test adds a new "DSB-Mitglied"
 * Robustness is only ever guaranteed if this test is run regularly in the CI/CD pipeline
 */
it('Neues DSB-Mitglied', function() {
  const randomID = generateID().toString();

  cy.get('.overview-dialog-header > .overview-dialog-add > bla-actionbutton > #undefined > .action-btn-circle').click()
  cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedVorname').click()
  cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedVorname').type('vorname')
  cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedNachname').click()
  cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedNachname').type('nachname')
  cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedGeburtsdatum').click()
  cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedGeburtsdatum').type('1996-02-01')
  cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedMitgliedsnummer').click()
  cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedMitgliedsnummer').type(randomID);
  cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedVerein').select('BSC Stuttgart')
  cy.get('[data-cy=detail-beitrittsdatum-feld]').click();
  cy.get('[data-cy=detail-beitrittsdatum-feld]').type('2001-02-02');

  cy.get('#dsbMitgliedForm > .form-group > .col-sm-9 > bla-actionbutton > #dsbMitgliedSaveButton').click()
  cy.wait(3000)
  cy.get('#OKBtn1').click()
  cy.wait(1000)
});

/**
 * This test searches for a specific "DSBMitglied" name and checks if the corresponding club name has been listed
 */
it('Suche DSBMitglieder', function () {
    cy.get('.input-group > #undefined').click();
    cy.get('.input-group > #undefined').type('vorname');
    cy.wait(1000)
    cy.get('table td')
      .contains('span', 'BSC Stuttgart')
      .should('exist')
    cy.wait(2000)
    cy.get('.input-group > #undefined').clear();
  }
)

/**
 * This test searches for a specific "club name" name and checks if the corresponding name has been listed
 */
it('Suche Verein eines DSBMitglieds', function () {
    cy.get('.input-group > #undefined').click();
    cy.get('.input-group > #undefined').type('BSC Stuttgart');
    cy.wait(1000)
    cy.get('table td')
      .contains('span', 'vorname')
      .should('exist')
    cy.wait(2000)
    cy.get('.input-group > #undefined').clear();
  }
)

/**
 * This test views a single member and redirects to the overview page afterward
 */
it('View DSBMitglied Info', function() {
  cy.wait(1000)
  cy.contains('tr', 'vorname').find('[data-cy="TABLE.ACTIONS.VIEW"]').click();
  cy.wait(1000)
  cy.get('[data-cy=detail-beitrittsdatum-feld]').invoke('attr', 'readonly')
    .should('exist');
  cy.visit('http://localhost:4200/#/verwaltung/dsbmitglieder');
  cy.url().should('include', '#/verwaltung/dsbmitglieder')
})

/**
 * This test edits a single member and checks if after editing the website redirects the user to the expected location
 */
it('Edit DSBMitglied', function() {
  cy.wait(1000)
  cy.contains('tr', 'vorname').find('[data-cy="TABLE.ACTIONS.EDIT"]').click();
  cy.get('[data-cy=detail-vorname-feld]').click()
  cy.get('[data-cy=detail-vorname-feld]').focus().clear().type('SWTZweiTestLocalBitte')
  cy.get('[data-cy=detail-update-button]').click()
  cy.wait(1000)
  cy.get('#OKBtn1').click()
  cy.wait(1000)
  cy.contains('tr', 'SWTZweiTestLocalBitte').find('[data-cy="TABLE.ACTIONS.EDIT"]').click();
  cy.get('[data-cy=detail-vorname-feld]').click()
  cy.get('[data-cy=detail-vorname-feld]').focus().clear().type('SWTZweiTestLocal')
  cy.get('[data-cy=detail-update-button]').click()
  cy.wait(2000)
  cy.get('#OKBtn1').click()
  cy.wait(500)
  cy.url().should('include', '#/verwaltung/dsbmitglieder')
})

/**
 * This test deletes a single member and checks if after deletion the website redirects the user to the expected location
 */
it('Löschen DSBMitglied', function() {
  cy.wait(1000)
  cy.contains('tr', 'SWTZweiTestLocal').find('[data-cy="TABLE.ACTIONS.DELETE"]').click();
  cy.get('.modal-dialog > .modal-content > .modal-footer > bla-actionbutton:nth-child(2) > #undefined').click()
  cy.url().should('include', '#/verwaltung/dsbmitglieder')
  cy.wait(2000)
})
