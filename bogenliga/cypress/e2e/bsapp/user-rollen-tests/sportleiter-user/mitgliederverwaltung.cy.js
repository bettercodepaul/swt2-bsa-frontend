
function generateID() {
  return Math.floor(100000 + Math.random() * 900000);
}

function generateLigaID() {
  //generates a number between 1 and the amount of ligas that exist
  //this is an example if only 19 liga exist
  return Math.floor(Math.random() * 18 + 1);
}

it('Login erfolgreich', function() {
  cy.clearLocalStorage()
  cy.visit('http://localhost:4200/#/home');
  cy.get('[data-cy=login-button]').click();
  cy.get('p:nth-child(8) #undefined').click();
});


it('Anzeige Verwaltung', function() {
  cy.get('[data-cy=sidebar-verwaltung-button]').click()
  cy.url().should('include', '#/verwaltung')
});

it('Anzeige DSBMitglieder', function() {
  cy.wait(1000)
  cy.get('[data-cy=verwaltung-dsb-mitglieder-button]').click()
  cy.url().should('include', '#/verwaltung/dsbmitglieder')
});

it('Neues DSB-Mitglied', function() {
  const randomID = generateID().toString();

  cy.get('.overview-dialog-header > .overview-dialog-add > bla-actionbutton > #undefined > .action-btn-circle').click()
  cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedVorname').click()
  cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedVorname').type('Cypress')
  cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedNachname').click()
  cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedNachname').type('Test')
  cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedGeburtsdatum').click()
  cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedGeburtsdatum').type('2000-01-01')
  cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedMitgliedsnummer').click()
  cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedMitgliedsnummer').type(randomID);
  cy.get('div > #dsbMitgliedForm > .form-group > .col-sm-9 > #dsbMitgliedVerein').select('SGes Gerstetten')
  cy.get('[data-cy=detail-beitrittsdatum-feld]').click();
  cy.get('[data-cy=detail-beitrittsdatum-feld]').type('2025-01-01');
  cy.get('#dsbMitgliedForm > .form-group > .col-sm-9 > bla-actionbutton > #dsbMitgliedSaveButton').click()
  cy.wait(3000)
  cy.get('#OKBtn1').click()
  cy.wait(1000)
});

it('View DSBMitglied Info', function() {
  cy.wait(1000)
  cy.contains('tr', 'Cypress').find('[data-cy="TABLE.ACTIONS.VIEW"]').click();
  cy.wait(1000)
  cy.get('[data-cy=detail-beitrittsdatum-feld]').invoke('attr', 'readonly')
    .should('exist');
  cy.visit('http://localhost:4200/#/verwaltung/dsbmitglieder');
  cy.url().should('include', '#/verwaltung/dsbmitglieder')
});

it('Edit DSBMitglied', function() {
  cy.wait(1000)
  cy.contains('tr', 'Cypress').find('[data-cy="TABLE.ACTIONS.EDIT"]').click();
  cy.get('[data-cy=detail-vorname-feld]').click()
  cy.get('[data-cy=detail-vorname-feld]').focus().clear().type('CypressTest')
  cy.get('[data-cy=detail-update-button]').click()
  cy.wait(1000)
  cy.get('#OKBtn1').click()
  cy.wait(1000)
  cy.contains('tr', 'CypressTest').find('[data-cy="TABLE.ACTIONS.EDIT"]').click();
  cy.get('[data-cy=detail-vorname-feld]').click()
  cy.get('[data-cy=detail-vorname-feld]').focus().clear().type('CypressTest')
  cy.get('[data-cy=detail-update-button]').click()
  cy.wait(2000)
  cy.get('#OKBtn1').click()
  cy.wait(500)
  cy.url().should('include', '#/verwaltung/dsbmitglieder')
});
