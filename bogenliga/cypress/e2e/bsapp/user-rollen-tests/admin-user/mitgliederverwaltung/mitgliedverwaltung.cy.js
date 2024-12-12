
function generateID() {
  return Math.floor(100000 + Math.random() * 900000);
}

function generateLigaID() {
  //generates a number between 1 and the amount of ligas that exist
  //this is an example if only 19 liga exist
  return Math.floor(Math.random() * 18 + 1);
}

it('Login erfolgreich', function() {
  cy.loginAdmin()
  cy.url().should('include', '#/home');
});

/**
 * This test opens the sidebar and clicks on the "VERWALTUNG" tab and checks if the url has changed successfully
 */
it('Anzeige Verwaltung', function() {
  cy.get('[data-cy=sidebar-verwaltung-button]').click()
  cy.url().should('include', '#/verwaltung')
})

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
/**
 * This test adds a new "DSB-Kampfrichter"
 * Robustness is only ever guaranteed if this test is run regularly in the CI/CD pipeline
 */
it('Neuer DSB-Kampfrichter', function() {
  cy.get('body').then((body) => {
    if (!body.text().includes('KampfrichterVorname')) {
      cy.get('.overview-dialog-header > .overview-dialog-add > bla-actionbutton > #undefined > .action-btn-circle').click()
      cy.get('[data-cy=detail-vorname-feld]').type('KampfrichterVorname')
      cy.get('[data-cy=detail-nachname-feld]').type('KampfrichterNachname')
      cy.get('[data-cy=detail-geburtsdatum-feld]').type('2021-11-01')
      cy.get('[data-cy=detail-mitgliedsnummer-feld]').type('34563456')
      cy.get('[data-cy=detail-nationalitaet-feld]').select('Germany')
      cy.get('[data-cy=detail-vereine-dsb]').select('BSC Stuttgart')
      cy.get('[data-cy=detail-beitrittsdatum-feld]').click();
      cy.get('[data-cy=detail-beitrittsdatum-feld]').type('2001-02-02');
      cy.wait(1500)
      cy.get('[data-cy=detail-save-button]').click()
      cy.get('#OKBtn1').click()
    }}
  );
})
/**
 * This test adds a new user with two-factor-authentication
 */

it('Testfall 12: User mit 2 Faktor Authentifizierung', function() {

  cy.get('[data-cy="dsb-mitglied-add-button"]').click();
  cy.get('select[data-cy="bla-selection-list"]').select('KampfrichterNachname,KampfrichterVorname No.:34563456');
  cy.get('[data-cy="username-input"]').type("DefaultCypressTestUser2WayAuth@cypressTestuser.com");
  cy.get('[data-cy="password-input"]').type('Test123456');
  cy.get('[data-cy="verify-password-input"]').type('Test123456');
  cy.get('#user2FA').click()
  cy.get('[data-cy="user-submit-button"]').click()

  cy.contains('.modal-content', 'Erfolg').within(() => {
    cy.get('.modal-dialog-ok button')
      .should('contain', 'OK')
      .click();
  });

  cy.wait(4000)
  cy.get('#qr > img').should('exist');
  cy.go('back')
  cy.deleteTestUser("DefaultCypressTestUser2WayAuth@cypressTestuser.com");

})


/**
 * This test adds a new user
 */

it('Testfall 11: User hinzufügen', function() {
  cy.createUserTest("DefaultCypressTestUser@cypressTestuser.com");

  cy.contains('.modal-content', 'Erfolg').within(() => {
    cy.get('.modal-dialog-ok button')
      .should('contain', 'OK')
      .click();
  });

})



/**
 * This test edits a user
 */

it('Testfall 9: User bearbeiten', function () {
  /*
  //cy.get('div > #management\.user\.table\.headers\.roleSorted > .ng-fa-icon > .svg-inline--fa > path').click()
  cy.get('[data-cy=TABLE.ACTIONS.EDIT]').last().click()
  cy.get('bla-double-selectionlist > bla-col-layout > .col-layout > bla-selectionlist > #left').select('0: 1')
  cy.get('bla-col-layout > .col-layout > bla-selectionlist > #left > option:nth-child(1)').click()
  cy.get('.col-layout > .shift-buttons > .shift-button > bla-button > #shiftLeft-left').click()
  cy.get('#userForm > .form-group > .col-sm-9 > bla-button > #userUpdateButton').click()
  cy.get('#OKBtn1').click()*/
  cy.assignRoleToTestUser("LIGALEITER", "DefaultCypressTestUser@cypressTestuser.com")
  cy.contains('.modal-content', 'Erfolg').within(() => {
    cy.get('.modal-dialog-ok button')
      .should('contain', 'OK')
      .click();
  });
})


/**
 * This test deletes a user
 */

it('Testfall 10: User löschen', function() {
  /*
  cy.get('#sidebarCollapseBottom').click()
  cy.contains('VERWALTUNG').click()
  cy.get('#sidebarCollapseBottom').click()
  cy.url().should('include', '#/verwaltung')
  cy.get('bla-grid-layout > .grid-layout > .card:nth-child(2) > .card-body > .btn').click()
  cy.url().should('include', '#/verwaltung/user')

  //löschen von Nicholas Corle - Moderator
  cy.get('#payload-id-4 > #undefinedActions > .action_icon > a > .ng-fa-icon > .fa-trash > path').click()
  cy.get('    .modal-dialog > .modal-content > .modal-footer > bla-actionbutton:nth-child(2) > #undefined').click()
   */
  cy.deleteTestUser("DefaultCypressTestUser@cypressTestuser.com");

  //cy.get('[ng-reflect-color="action-btn-primary"] > #undefined > .action-btn-circle').click();
})
