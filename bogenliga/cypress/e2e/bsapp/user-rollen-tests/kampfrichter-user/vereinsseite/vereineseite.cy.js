// CAN_READ_DEFAULT
/**
 * Verifies navigation to the "VEREINE" tab and URL update.
 */
it('Anzeige Vereine', function () {
  cy.wait(1000);
  cy.get('[data-cy=sidebar-vereine-button]').click({ force: true });
  cy.wait(1000);
  cy.url().should('include', '#/vereine');
});

/**
 * Checks redirection to the correct club overview page after selecting a region.
 */
it('Weiterleitung Vereinseite', function () {
  cy.get('[data-cy=sidebar-regionen-button]').click();
  cy.wait(3000);
  cy.get(':nth-child(11) > .main-arc').click({ force: true });
  cy.wait(2000);
  cy.get('#vereine > bla-selectionlist > #undefined').select(0);
  cy.wait(1000);
  cy.url().should('include', '#/vereine');
});

// CAN_READ_STAMMDATEN
/**
 * Opens the admin section and verifies the clubs table is populated.
 */
it('Anzeige Verwaltung Vereinsliste', function () {
  cy.get('[data-cy=sidebar-verwaltung-button]').click();
  cy.url().should('include', '#/verwaltung');
  cy.get('[data-cy=verwaltung-vereine-button]').click();
  cy.url().should('include', '#/verwaltung/vereine');
  cy.wait(1000);
  cy.get('table').find('tr').its('length').should('be.greaterThan', 0);
});

// CAN_MODIFY_MY_ORT
/**
 * Tests editing a club's website and verifies the change.
 */
it('Editieren eines Vereins', function () {
  cy.contains('td', '1111111111')
    .parent('tr')
    .find('[data-cy="TABLE.ACTIONS.EDIT"]')
    .click();

  cy.wait(1000);
  cy.get('[data-cy=vereine-vereinswebsite]').focus().clear().type('cypresstest.com');
  cy.get('[data-cy=vereine-update-button]').click();
  cy.wait(500);
  cy.get('#OKBtn1').click();
  cy.contains('http://cypresstest.com');

  cy.contains('td', '1111111111')
    .parent('tr')
    .find('[data-cy="TABLE.ACTIONS.EDIT"]')
    .click();

  cy.wait(1000);
  cy.get('[data-cy=vereine-vereinswebsite]').type('{selectall}{backspace}');
  cy.get('[data-cy=vereine-update-button]').click();
  cy.wait(200);
  cy.get('#OKBtn1').click();
  cy.wait(1500);
  cy.get('tr').last().find('td').eq(3).should('not.contain.value');
});

/**
 * Adds a new team to a club and checks the entry.
 */
it('Neue Vereins-Mannschaft anlegen', function () {
  cy.get('[data-cy="TABLE.ACTIONS.EDIT"]').last().click();
  cy.wait(1000);

  cy.get('body').then((body) => {
    if (!body.text().includes('69')) {
      cy.get('[data-cy=vereine-details-add-mannschaft-button]').click();
      cy.wait(1000);
      cy.get('div > #mannschaftForm > .form-group > .col-sm-9 > #mannschaftNummer').type('69');
      cy.wait(1000);
      cy.get('#mannschaftSaveButton').click();
      cy.wait(6000);
      cy.get('#OKBtn1').click();
      cy.wait(1000);
      cy.contains('69');
    }
  });
});



